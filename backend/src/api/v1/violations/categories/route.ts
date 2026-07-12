import { z } from 'zod';
import { getDb } from '@/db/client';
import { violationCategories } from '@/db/schema/violations';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';
import { desc, eq } from 'drizzle-orm';

const createCategorySchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter'),
  color: z.string().default('#3B82F6'),
  icon: z.string().default('AlertCircle'),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const db = getDb();
    const categories = await db.query.violationCategories.findMany({
      where: eq(violationCategories.isActive, true),
      orderBy: [desc(violationCategories.createdAt)],
    });

    return apiSuccess(categories);
  } catch (error: unknown) {
    console.error('Fetch Violation Categories Error:', error);
    return apiError('Gagal mengambil daftar kategori pelanggaran', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const body = await request.json();
    const parsed = createCategorySchema.safeParse(body);
    if (!parsed.success) {
      return apiError('Validasi input kategori pelanggaran gagal', 400);
    }

    const db = getDb();
    const id = `cat-${crypto.randomUUID()}`;
    await db.insert(violationCategories).values({
      id,
      name: parsed.data.name,
      color: parsed.data.color,
      icon: parsed.data.icon,
      isActive: true,
      createdBy: session.userId,
    });

    return apiSuccess({ id, ...parsed.data }, 'Kategori pelanggaran berhasil dibuat', 201);
  } catch (error: unknown) {
    console.error('Create Violation Category Error:', error);
    return apiError('Gagal membuat kategori pelanggaran baru', 500);
  }
}
