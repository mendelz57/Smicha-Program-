import { db } from '@/lib/db';
import { subjects, chapters, videos } from '@/lib/schema';
import Link from 'next/link';
import AddChapterForm from './AddChapterForm';
import AddVideoForm from './AddVideoForm';

export default async function ChaptersPage() {
  const allSubjects = await db.query.subjects.findMany({ orderBy: (s, { asc }) => [asc(s.order)] });
  const allChapters = await db.query.chapters.findMany({ orderBy: (c, { asc }) => [asc(c.order)] });
  const allVideos = await db.query.videos.findMany({ orderBy: (v, { asc }) => [asc(v.order)] });

  return (
    <div style={{ minHeight: '100vh', background: '#F6F1E7', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#162B22', borderBottom: '1px solid rgba(196,145,42,0.2)', padding: '1rem 1.25rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/admin" style={{ color: '#A8C0B8', fontSize: '0.85rem', textDecoration: 'none' }}>← Admin</Link>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#C4912A', letterSpacing: '0.05em' }}>Chapters & Videos</span>
        </div>
      </header>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <AddChapterForm subjects={allSubjects} />
        <AddVideoForm chapters={allChapters} />

        {allSubjects.map(subject => {
          const subjectChapters = allChapters.filter(c => c.subjectId === subject.id);
          return (
            <div key={subject.id}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', fontWeight: '400', color: '#162B22', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid rgba(196,145,42,0.3)' }}>{subject.name}</h2>
              {subjectChapters.map(chapter => {
                const chapterVideos = allVideos.filter(v => v.chapterId === chapter.id).sort((a, b) => a.order - b.order);
                return (
                  <div key={chapter.id} style={{ background: '#fff', borderTop: '3px solid #162B22', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C4912A', fontWeight: '600', marginBottom: '1rem' }}>{chapter.title}</h3>
                    {chapterVideos.length === 0 ? (
                      <p style={{ color: '#8A9A95', fontSize: '0.85rem' }}>No videos yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {chapterVideos.map(v => (
                          <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1rem', background: '#F6F1E7', borderLeft: '3px solid #C4912A', fontSize: '0.875rem' }}>
                            <span style={{ color: '#C4912A' }}>▶</span>
                            <span style={{ flex: 1, color: '#162B22' }}>{v.title}</span>
                            <span style={{ color: '#8A9A95', fontSize: '0.75rem' }}>{v.youtubeId}</span>
                            <Link href={`/admin/questions?videoId=${v.id}`} style={{ color: '#C4912A', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '600', border: '1px solid #C4912A', padding: '0.2rem 0.6rem' }}>
                              Questions
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
