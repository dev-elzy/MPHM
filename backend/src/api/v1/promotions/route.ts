import { getDb } from '@/db/client';
import { promotionPeriods } from '@/db/schema/promotions';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const db = getDb();
    const periods = await db.query.promotionPeriods.findMany({
      orderBy: (periods, { desc }) => [desc(periods.createdAt)],
    });
    return Response.json({ success: true, message: 'Success', data: { items: periods } });
  } catch (error: unknown) {
    return Response.json({ success: false, message: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

const postSchema = z.object({
  academicYearFromId: z.string(),
  academicYearToId: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ success: false, message: 'Sesi tidak valid' }, { status: 401 });
    }
    const userRole = (session.role || '').toLowerCase();
    const isSekretariat = ['sekretariat', 'super_admin', 'admin', 'operator'].includes(userRole);
    if (!isSekretariat) {
      return Response.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const data = postSchema.parse(body);

    const newItem = {
      id: crypto.randomUUID(),
      academicYearFromId: data.academicYearFromId,
      academicYearToId: data.academicYearToId,
      status: 'draft',
    };

    const db = getDb();
    await db.insert(promotionPeriods).values(newItem);

    return Response.json({ success: true, message: 'Success', data: newItem });
  } catch (error: unknown) {
    return Response.json({ success: false, message: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ success: false, message: 'Sesi tidak valid' }, { status: 401 });
    }
    const userRole = (session.role || '').toLowerCase();
    const isSekretariat = ['sekretariat', 'super_admin', 'admin', 'operator'].includes(userRole);
    if (!isSekretariat) {
      return Response.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ success: false, message: 'id required' }, { status: 400 });

    const body = await req.json();
    const statusSchema = z.object({ status: z.string() });
    const data = statusSchema.parse(body);

    const db = getDb();
    await db.update(promotionPeriods).set({
      status: data.status,
      updatedAt: new Date(),
    }).where(eq(promotionPeriods.id, id));

    return Response.json({ success: true, message: 'Success' });
  } catch (error: unknown) {
    return Response.json({ success: false, message: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
