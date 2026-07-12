import { z } from 'zod';
import { getDb } from '@/db/client';
import {
  violationTypes,
  violationCategories,
  violationSeverities,
} from '@/db/schema/violations';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';
import { eq, desc } from 'drizzle-orm';

const createViolationTypeSchema = z.object({
  categoryId: z.string().min(1, 'Kategori harus dipilih'),
  severityId: z.string().min(1, 'Severity harus dipilih'),
  name: z.string().min(3, 'Nama jenis pelanggaran minimal 3 karakter'),
  defaultPoints: z.number().int().default(10),
  description: z.string().optional(),
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
        id: violationTypes.id,
        categoryId: violationTypes.categoryId,
        severityId: violationTypes.severityId,
        name: violationTypes.name,
        defaultPoints: violationTypes.defaultPoints,
        description: violationTypes.description,
        isActive: violationTypes.isActive,
        categoryName: violationCategories.name,
        categoryColor: violationCategories.color,
        severityName: violationSeverities.name,
        severityBadge: violationSeverities.badgeColor,
      })
      .from(violationTypes)
      .leftJoin(violationCategories, eq(violationTypes.categoryId, violationCategories.id))
      .leftJoin(violationSeverities, eq(violationTypes.severityId, violationSeverities.id))
      .where(eq(violationTypes.isActive, true))
      .orderBy(desc(violationTypes.createdAt));

    return apiSuccess(results);
  } catch (error: unknown) {
    console.error('Fetch Violation Types Error:', error);
    return apiError('Gagal mengambil daftar jenis pelanggaran', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const body = await request.json();
    const parsed = createViolationTypeSchema.safeParse(body);
    if (!parsed.success) {
      return apiError('Validasi input jenis pelanggaran gagal', 400);
    }

    const db = getDb();
    const id = `vtype-${crypto.randomUUID()}`;
    await db.insert(violationTypes).values({
      id,
      ...parsed.data,
      isActive: true,
      createdBy: session.userId,
    });

    return apiSuccess({ id, ...parsed.data }, 'Jenis pelanggaran berhasil dibuat', 201);
  } catch (error: unknown) {
    console.error('Create Violation Type Error:', error);
    return apiError('Gagal membuat jenis pelanggaran baru', 500);
  }
}
