import { getDb } from '@/db/client';
import { schedules } from '@/db/schema/schedules';
import { eq, and, isNull } from 'drizzle-orm';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const academicYearId = searchParams.get('academicYearId');
    const semesterId = searchParams.get('semesterId');
    const jenjang = searchParams.get('jenjang');
    const tingkat = searchParams.get('tingkat');
    const classId = searchParams.get('classId');

    if (!academicYearId || !semesterId) {
      return Response.json({ success: false, message: 'academicYearId and semesterId required' }, { status: 400 });
    }

    const conditions = [
      eq(schedules.academicYearId, academicYearId),
      eq(schedules.semesterId, semesterId),
      isNull(schedules.deletedAt)
    ];

    if (classId) {
      conditions.push(eq(schedules.classId, classId));
    } else if (jenjang) {
      conditions.push(eq(schedules.jenjang, jenjang));
      if (tingkat) conditions.push(eq(schedules.tingkat, tingkat));
    }

    const db = getDb();
    const items = await db.query.schedules.findMany({
      where: and(...conditions),
      orderBy: (schedules, { asc }) => [asc(schedules.day), asc(schedules.startTime)],
    });

    return Response.json({ success: true, message: 'Success', data: { items } });
  } catch (error: unknown) {
    return Response.json({ success: false, message: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

const postSchema = z.object({
  academicYearId: z.string(),
  semesterId: z.string(),
  targetType: z.enum(['jenjang', 'tingkat', 'class']),
  jenjang: z.string().optional(),
  tingkat: z.string().optional(),
  classId: z.string().optional(),
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  activity: z.string(),
  subjectId: z.string().optional().nullable(),
  teacherId: z.string().optional().nullable(),
  room: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ success: false, message: 'Sesi tidak valid' }, { status: 401 });
    }
    const userRole = (session.role || '').toLowerCase();
    const isSekretariat = ['sekretariat'].includes(userRole);
    if (!isSekretariat) {
      return Response.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const data = postSchema.parse(body);

    const newItem = {
      id: crypto.randomUUID(),
      ...data,
      isOverride: data.targetType === 'class',
    };

    const db = getDb();
    await db.insert(schedules).values(newItem);

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
    const isSekretariat = ['sekretariat'].includes(userRole);
    if (!isSekretariat) {
      return Response.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ success: false, message: 'id required' }, { status: 400 });

    const body = await req.json();
    const data = postSchema.partial().parse(body);

    const db = getDb();
    await db.update(schedules).set(data).where(eq(schedules.id, id));

    return Response.json({ success: true, message: 'Success' });
  } catch (error: unknown) {
    return Response.json({ success: false, message: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ success: false, message: 'Sesi tidak valid' }, { status: 401 });
    }
    const userRole = (session.role || '').toLowerCase();
    const isSekretariat = ['sekretariat'].includes(userRole);
    if (!isSekretariat) {
      return Response.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ success: false, message: 'id required' }, { status: 400 });

    const db = getDb();
    await db.update(schedules).set({
      deletedAt: new Date(),
    }).where(eq(schedules.id, id));

    return Response.json({ success: true, message: 'Success' });
  } catch (error: unknown) {
    return Response.json({ success: false, message: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
