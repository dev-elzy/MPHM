import { z } from 'zod';
import { eq, and, inArray } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { students, classStudents } from '@/db/schema/students';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';


// Validation schema for imported student item
const importStudentSchema = z.object({
  nis: z.string().optional().nullable(),
  nisn: z.string().optional().nullable(),
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  birthPlace: z.string().optional().nullable(),
  birthDate: z.string().optional().nullable(),
  gender: z.enum(['male', 'female']).default('female'),
  address: z.string().optional().nullable(),
  parentName: z.string().optional().nullable(),
  parentPhone: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  entryYear: z.string().optional().nullable(),
  entryJenjang: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

const importPayloadSchema = z.object({
  students: z.array(importStudentSchema),
  classId: z.string().uuid().optional().nullable(),
  academicYearId: z.string().uuid().optional().nullable(),
  semesterId: z.string().uuid().optional().nullable(),
});

// POST /api/v1/students/import
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: super_admin, admin, operator
    const ALLOWED_ROLES = ['super_admin', 'admin', 'operator'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk mengimpor data', 403);
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'preview'; // 'preview' or 'confirm'

    const valResult = await validateBody(request, importPayloadSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const { students: importList, classId, academicYearId, semesterId } = valResult.data;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // 1. Gather all existing NIS from the database to check duplicates
    const incomingNisList = importList
      .map((s) => s.nis)
      .filter((nis): nis is string => typeof nis === 'string' && nis.trim() !== '');

    const existingNisMap = new Set<string>();
    if (incomingNisList.length > 0) {
      const existingStudents = await db
        .select({ nis: students.nis })
        .from(students)
        .where(
          and(
            eq(students.institutionId, session.institutionId),
            notDeleted(students),
            inArray(students.nis, incomingNisList)
          )
        );
      
      existingStudents.forEach((es) => {
        if (es.nis) existingNisMap.add(es.nis);
      });
    }

    // 2. Validate row-by-row
    const previewItems = [];
    const validRows: z.infer<typeof importStudentSchema>[] = [];
    let validCount = 0;
    let failedCount = 0;

    const seenNis = new Set<string>();

    for (let i = 0; i < importList.length; i++) {
      const rawRow = importList[i];
      const errors: string[] = [];
      const rowNum = i + 1;

      // Check fields
      if (!rawRow.name || rawRow.name.trim().length < 3) {
        errors.push('Nama lengkap wajib diisi minimal 3 karakter');
      }

      if (rawRow.nis) {
        const cleanNis = rawRow.nis.trim();
        if (seenNis.has(cleanNis)) {
          errors.push(`Duplikat NIS "${cleanNis}" di file excel/CSV`);
        } else {
          seenNis.add(cleanNis);
        }

        if (existingNisMap.has(cleanNis)) {
          errors.push(`NIS "${cleanNis}" sudah terdaftar di database`);
        }
      }

      const isValid = errors.length === 0;
      if (isValid) {
        validCount++;
        validRows.push(rawRow);
      } else {
        failedCount++;
      }

      previewItems.push({
        rowNumber: rowNum,
        name: rawRow.name,
        nis: rawRow.nis || '',
        status: isValid ? 'valid' : 'error',
        errors,
      });
    }

    // 3. Mode Processing
    if (mode === 'preview') {
      return apiSuccess({
        total: importList.length,
        valid: validCount,
        failed: failedCount,
        items: previewItems,
      }, 'Selesai menganalisis file impor');
    }

    // Confirm Mode: Perform actual DB write for valid rows
    if (validRows.length === 0) {
      return apiError('Tidak ada data valid yang dapat disimpan', 400);
    }

    await db.transaction(async (tx) => {
      for (const row of validRows) {
        const newStudentId = crypto.randomUUID();
        
        // Insert student
        await tx.insert(students).values({
          id: newStudentId,
          institutionId: session.institutionId,
          nis: row.nis || null,
          nisn: row.nisn || null,
          name: row.name,
          birthDate: row.birthDate || null,
          birthPlace: row.birthPlace || null,
          gender: row.gender,
          address: row.address || null,
          parentName: row.parentName || null,
          parentPhone: row.parentPhone || null,
          phone: row.phone || null,
          entryYear: row.entryYear || null,
          entryJenjang: row.entryJenjang || null,
          status: 'active',
          createdBy: session.userId,
          updatedBy: session.userId,
        });

        // Insert class link if provided
        if (classId && academicYearId && semesterId) {
          await tx.insert(classStudents).values({
            id: crypto.randomUUID(),
            academicYearId,
            semesterId,
            classId,
            studentId: newStudentId,
            status: 'active',
            createdBy: session.userId,
            updatedBy: session.userId,
          });
        }
      }
    });

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'student',
        action: 'import',
        description: `Berhasil mengimpor massal ${validRows.length} data siswi`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess({
      successCount: validRows.length,
    }, `Berhasil mengimpor ${validRows.length} data siswi`);

  } catch (error) {
    console.error('Import students error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}
