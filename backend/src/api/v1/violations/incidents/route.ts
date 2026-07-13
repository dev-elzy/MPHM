import { z } from 'zod';
import { getDb } from '@/db/client';
import {
  studentViolations,
  violationTypes,
  violationCategories,
  violationSeverities,
} from '@/db/schema/violations';
import { studentProfiles, people } from '@/db/schema';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';
import { eq, desc, isNull } from 'drizzle-orm';

const createIncidentSchema = z.object({
  academicYearId: z.string().min(1, 'Tahun ajaran wajib diisi'),
  studentProfileId: z.string().min(1, 'Santri harus dipilih'),
  violationTypeId: z.string().min(1, 'Jenis pelanggaran harus dipilih'),
  incidentDate: z.string().min(1, 'Tanggal kejadian wajib diisi'),
  incidentTime: z.string().optional(),
  location: z.string().optional(),
  description: z.string().min(3, 'Keterangan kejadian minimal 3 karakter'),
  evidenceUrl: z.string().optional(),
  status: z.enum(['Draft', 'Dilaporkan', 'Diproses', 'Selesai', 'Dibatalkan']).default('Dilaporkan'),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const db = getDb();
    const results = await db
      .select({
        id: studentViolations.id,
        academicYearId: studentViolations.academicYearId,
        studentProfileId: studentViolations.studentProfileId,
        incidentDate: studentViolations.incidentDate,
        incidentTime: studentViolations.incidentTime,
        location: studentViolations.location,
        description: studentViolations.description,
        evidenceUrl: studentViolations.evidenceUrl,
        status: studentViolations.status,
        violationTypeName: violationTypes.name,
        defaultPoints: violationTypes.defaultPoints,
        categoryName: violationCategories.name,
        categoryColor: violationCategories.color,
        severityName: violationSeverities.name,
        severityBadge: violationSeverities.badgeColor,
        studentName: people.fullName,
        studentNis: studentProfiles.nis,
      })
      .from(studentViolations)
      .leftJoin(studentProfiles, eq(studentViolations.studentProfileId, studentProfiles.id))
      .leftJoin(people, eq(studentProfiles.personId, people.id))
      .leftJoin(violationTypes, eq(studentViolations.violationTypeId, violationTypes.id))
      .leftJoin(violationCategories, eq(violationTypes.categoryId, violationCategories.id))
      .leftJoin(violationSeverities, eq(violationTypes.severityId, violationSeverities.id))
      .where(isNull(studentViolations.deletedAt))
      .orderBy(desc(studentViolations.incidentDate));

    return apiSuccess(results);
  } catch (error: unknown) {
    console.error('Fetch Violation Incidents Error:', error);
    return apiError('Gagal mengambil daftar laporan pelanggaran', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const userRole = (session.role || '').toLowerCase();
    const isSekretariat = ['sekretariat'].includes(userRole);
    const isKeamanan = ['petugas_keamanan', 'security', 'keamanan'].includes(userRole);

    if (!isSekretariat && !isKeamanan) {
      return apiError('Anda tidak memiliki izin untuk mencatat pelanggaran', 403);
    }

    const body = await request.json();
    const parsed = createIncidentSchema.safeParse(body);
    if (!parsed.success) {
      return apiError('Validasi input laporan pelanggaran gagal', 400);
    }

    const db = getDb();
    const id = `viol-${crypto.randomUUID()}`;
    await db.insert(studentViolations).values({
      id,
      ...parsed.data,
      reportedBy: session.userId,
      createdBy: session.userId,
    });

    return apiSuccess({ id, ...parsed.data }, 'Laporan pelanggaran berhasil dicatat', 201);
  } catch (error: unknown) {
    console.error('Create Violation Incident Error:', error);
    return apiError('Gagal mencatat laporan pelanggaran baru', 500);
  }
}
