import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { questions, questionOptions } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PUT(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id, text, options } = await req.json();
  await db.update(questions).set({ text }).where(eq(questions.id, id));

  for (const opt of options) {
    await db.update(questionOptions)
      .set({ text: opt.text, isCorrect: opt.isCorrect })
      .where(eq(questionOptions.id, opt.id));
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id')!);
  await db.delete(questionOptions).where(eq(questionOptions.questionId, id));
  await db.delete(questions).where(eq(questions.id, id));

  return NextResponse.json({ success: true });
}
