import { db } from '@/lib/db';
import { videos, questions, questionOptions } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import QuestionsEditor from './QuestionsEditor';
import VideoSelector from './VideoSelector';

export default async function QuestionsPage({ searchParams }: { searchParams: { videoId?: string } }) {
  const allVideos = await db.query.videos.findMany({ orderBy: (v, { asc }) => [asc(v.order)] });

  const selectedVideoId = searchParams.videoId ? parseInt(searchParams.videoId) : null;
  const selectedVideo = selectedVideoId ? allVideos.find(v => v.id === selectedVideoId) : null;

  let videoQuestions: any[] = [];
  if (selectedVideoId) {
    const qs = await db.query.questions.findMany({
      where: eq(questions.videoId, selectedVideoId),
      orderBy: (q, { asc }) => [asc(q.order)],
    });
    videoQuestions = await Promise.all(
      qs.map(async q => ({
        ...q,
        options: await db.query.questionOptions.findMany({ where: eq(questionOptions.questionId, q.id) }),
      }))
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-800 text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-indigo-200 hover:text-white text-sm">← Admin</Link>
        <h1 className="text-lg font-bold">Manage Questions</h1>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select a video to manage its questions</label>
          <VideoSelector videos={allVideos} selectedVideoId={selectedVideoId} />
        </div>

        {selectedVideo && (
          <QuestionsEditor video={selectedVideo} questions={videoQuestions} />
        )}
      </div>
    </div>
  );
}
