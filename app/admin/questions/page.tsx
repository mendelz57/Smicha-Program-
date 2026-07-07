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
    const qs = await db.query.questions.findMany({ where: eq(questions.videoId, selectedVideoId), orderBy: (q, { asc }) => [asc(q.order)] });
    videoQuestions = await Promise.all(qs.map(async q => ({ ...q, options: await db.query.questionOptions.findMany({ where: eq(questionOptions.questionId, q.id) }) })));
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F6F1E7', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#162B22', borderBottom: '1px solid rgba(196,145,42,0.2)', padding: '1rem 1.25rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/admin" style={{ color: '#A8C0B8', fontSize: '0.85rem', textDecoration: 'none' }}>← Admin</Link>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#C4912A', letterSpacing: '0.05em' }}>Manage Questions</span>
        </div>
      </header>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ background: '#fff', borderTop: '3px solid #C4912A', padding: '1.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A9A95', fontWeight: '600', marginBottom: '0.6rem' }}>Select a video to manage its questions</label>
          <VideoSelector videos={allVideos} selectedVideoId={selectedVideoId} />
        </div>
        {selectedVideo && <QuestionsEditor video={selectedVideo} questions={videoQuestions} />}
      </div>
    </div>
  );
}
