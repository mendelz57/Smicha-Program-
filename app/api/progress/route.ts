import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { studentProgress } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { videoId, score, passed } = await req.json();
  const userId = parseInt(session.user.id);

  const existing = await db.query.studentProgress.findFirst({
    where: and(eq(studentProgress.userId, userId), eq(studentProgress.videoId, videoId)),
  });

  if (existing) {
    await db.update(studentProgress)
      .set({
        score,
        completed: passed || existing.completed,
        attempts: existing.attempts + 1,
        completedAt: passed && !existing.completed ? new Date() : existing.completedAt,
      })
      .where(eq(studentProgress.id, existing.id));
  } else {
    await db.insert(studentProgress).values({
      userId,
      videoId,
      score,
      completed: passed,
      attempts: 1,
      completedAt: passed ? new Date() : null,
    });
  }

  return NextResponse.json({ success: true });
}
