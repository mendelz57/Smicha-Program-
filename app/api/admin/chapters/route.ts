import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { chapters } from '@/lib/schema';

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { subjectId, title, order } = await req.json();
  await db.insert(chapters).values({ subjectId, title, order });
  return NextResponse.json({ success: true });
}
