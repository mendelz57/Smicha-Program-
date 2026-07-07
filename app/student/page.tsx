import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { subjects, chapters, videos, studentProgress, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function StudentDashboard() {
  const session = await auth();
  const userId = parseInt(session!.user!.id!);

  // Subscription check
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (user) {
    const now = new Date();
    const trialActive = user.plan === 'trial' && user.trialEndsAt && user.trialEndsAt > now;
    const subActive = (user.plan === 'monthly' || user.plan === 'annual') && user.subscriptionEndsAt && user.subscriptionEndsAt > now;
    if (!trialActive && !subActive) {
      if (!user.profileComplete) redirect('/enrollment');
      else redirect('/payment');
    }
  }

  const allSubjects = await db.query.subjects.findMany({ orderBy: (s, { asc }) => [asc(s.order)] });
  const allChapters = await db.query.chapters.findMany({ orderBy: (c, { asc }) => [asc(c.order)] });
  const allVideos = await db.query.videos.findMany({ orderBy: (v, { asc }) => [asc(v.order)] });
  const progress = await db.query.studentProgress.findMany({
    where: eq(studentProgress.userId, userId),
  });

  const completedVideoIds = new Set(
    progress.filter(p => p.completed).map(p => p.videoId)
  );

  const sortedVideos = allVideos.sort((a, b) => {
    const chA = allChapters.find(c => c.id === a.chapterId);
    const chB = allChapters.find(c => c.id === b.chapterId);
    if (chA && chB && chA.subjectId !== chB.subjectId) return chA.subjectId - chB.subjectId;
    if (chA && chB && chA.order !== chB.order) return chA.order - chB.order;
    return a.order - b.order;
  });

  const totalVideos = allVideos.length;
  const completedCount = completedVideoIds.size;
  const progressPct = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#F6F1E7', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#162B22', borderBottom: '1px solid rgba(196,145,42,0.2)', padding: '1rem 1.25rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#C4912A', letterSpacing: '0.05em' }}>Smicha Program</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#A8C0B8', fontSize: '0.85rem' }}>{session!.user!.name}</span>
            <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }}>
              <button type="submit" style={{ background: 'none', border: 'none', color: '#A8C0B8', fontSize: '0.85rem', cursor: 'pointer' }}>Sign out</button>
            </form>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Progress bar */}
        <div style={{ background: '#fff', borderTop: '3px solid #C4912A', padding: '1.75rem 2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#162B22' }}>Overall Progress</span>
            <span style={{ color: '#C4912A', fontWeight: '700', fontSize: '0.9rem' }}>{completedCount}/{totalVideos} videos</span>
          </div>
          <div style={{ width: '100%', background: '#E8E2D6', height: '8px' }}>
            <div style={{ background: '#C4912A', height: '8px', width: `${progressPct}%`, transition: 'width 0.4s ease' }}></div>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#8A9A95', marginTop: '0.5rem' }}>{progressPct}% complete</p>

          {completedCount === totalVideos && totalVideos > 0 && (
            <div style={{ marginTop: '1rem', background: '#162B22', padding: '1rem 1.5rem', textAlign: 'center' }}>
              <p style={{ color: '#C4912A', fontFamily: 'Georgia, serif', fontSize: '1.1rem' }}>Mazel Tov! You have completed the Smicha Program!</p>
              <p style={{ color: '#A8C0B8', fontSize: '0.85rem', marginTop: '0.25rem' }}>Your certificate will be mailed to you shortly.</p>
            </div>
          )}
        </div>

        {/* Subjects */}
        {allSubjects.map(subject => {
          const subjectChapters = allChapters.filter(c => c.subjectId === subject.id);
          return (
            <div key={subject.id} style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: '400', color: '#162B22', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid rgba(196,145,42,0.3)' }}>
                {subject.name}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {subjectChapters.map(chapter => {
                  const chapterVideos = allVideos.filter(v => v.chapterId === chapter.id).sort((a, b) => a.order - b.order);
                  return (
                    <div key={chapter.id} style={{ background: '#fff', borderTop: '3px solid #162B22', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                      <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C4912A', fontWeight: '600', marginBottom: '1rem' }}>{chapter.title}</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {chapterVideos.map(video => {
                          const isCompleted = completedVideoIds.has(video.id);
                          return (
                            <div key={video.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: isCompleted ? 'rgba(196,145,42,0.08)' : '#F6F1E7', borderLeft: isCompleted ? '3px solid #C4912A' : '3px solid transparent' }}>
                              <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', flexShrink: 0, background: isCompleted ? '#C4912A' : '#162B22', color: '#fff' }}>
                                {isCompleted ? '✓' : '▶'}
                              </div>
                              <p style={{ flex: 1, fontSize: '0.9rem', fontWeight: '500', color: '#162B22' }}>{video.title}</p>
                              <Link href={`/student/video/${video.id}`} style={{ fontSize: '0.82rem', padding: '0.4rem 1rem', fontWeight: '600', textDecoration: 'none', background: isCompleted ? 'transparent' : '#C4912A', color: isCompleted ? '#C4912A' : '#162B22', border: isCompleted ? '1px solid #C4912A' : 'none' }}>
                                {isCompleted ? 'Review' : 'Start'}
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {allSubjects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#8A9A95' }}>
            <p>Course content coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
