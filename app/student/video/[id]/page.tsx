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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-800 text-white px-6 py-4 flex items-center gap-4">
        <Link href="/student" className="text-indigo-200 hover:text-white text-sm">← Back</Link>
        <h1 className="text-lg font-bold">Smicha Program</h1>
      </header>
      <VideoClient video={video} questions={questionsWithOptions} />
    </div>
  );
}
