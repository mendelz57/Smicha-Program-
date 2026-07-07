import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { videos, questions, questionOptions, studentProgress } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import VideoClient from './VideoClient';
import Link from 'next/link';

export default async function VideoPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const userId = parseInt(session!.user!.id!);
  const videoId = parseInt(params.id);

  const video = await db.query.videos.findFirst({ where: eq(videos.id, videoId) });
  if (!video) notFound();


  const videoQuestions = await db.query.questions.findMany({
    where: eq(questions.videoId, videoId),
  });

  const questionsWithOptions = await Promise.all(
    videoQuestions.map(async q => {
      const opts = await db.query.questionOptions.findMany({
        where: eq(questionOptions.questionId, q.id),
      });
      return { ...q, options: opts };
    })
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F6F1E7', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#162B22', borderBottom: '1px solid rgba(196,145,42,0.2)', padding: '1rem 1.25rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/student" style={{ color: '#A8C0B8', fontSize: '0.85rem', textDecoration: 'none' }}>← Back</Link>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#C4912A', letterSpacing: '0.05em' }}>Smicha Program</span>
        </div>
      </header>
      <VideoClient video={video} questions={questionsWithOptions} />
    </div>
  );
}
