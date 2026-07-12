import { z } from 'zod';
import { getDb } from '@/db/client';
import { violationSeverities } from '@/db/schema/violations';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';
import { asc, eq } from 'drizzle-orm';

const createSeveritySchema = z.object({
  name: z.string().min(2, 'Nama severity minimal 2 karakter'),
  levelWeight: z.number().int().min(1).max(10),
  badgeColor: z.string().default('blue'),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const db = getDb();
    const severities = await db.query.violationSeverities.findMany({
      where: eq(violationSeverities.isActive, true),
      orderBy: [asc(violationSeverities.levelWeight)],
    });

    return apiSuccess(severities);
  } catch (error: unknown) {
    console.error('Fetch Violation Severities Error:', error);
    return apiError('Gagal mengambil daftar severity pelanggaran', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const body = await request.json();
    const parsed = createSeveritySchema.safeParse(body);
    if (!parsed.success) {
      return apiError('Validasi input severity gagal', 400);
    }

    const db = getDb();
    const id = `sev-${crypto.randomUUID()}`;
    await db.insert(violationSeverities).values({
      id,
      name: parsed.data.name,
      levelWeight: parsed.data.levelWeight,
      badgeColor: parsed.data.badgeColor,
      isActive: true,
    });

    return apiSuccess({ id, ...parsed.data }, 'Severity pelanggaran berhasil dibuat', 201);
  } catch (error: unknown) {
    console.error('Create Violation Severity Error:', error);
    return apiError('Gagal membuat severity baru', 500);
  }
}
