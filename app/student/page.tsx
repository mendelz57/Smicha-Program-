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

  // Determine which video is currently unlocked (first incomplete)
  const sortedVideos = allVideos.sort((a, b) => {
    const chA = allChapters.find(c => c.id === a.chapterId);
    const chB = allChapters.find(c => c.id === b.chapterId);
    if (chA && chB && chA.subjectId !== chB.subjectId) return chA.subjectId - chB.subjectId;
    if (chA && chB && chA.order !== chB.order) return chA.order - chB.order;
    return a.order - b.order;
  });

  let firstLockedIndex = sortedVideos.findIndex(v => !completedVideoIds.has(v.id));
  const currentVideoId = firstLockedIndex >= 0 ? sortedVideos[firstLockedIndex]?.id : null;

  const totalVideos = allVideos.length;
  const completedCount = completedVideoIds.size;
  const progressPct = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-800 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Smicha Program</h1>
        <div className="flex items-center gap-4">
          <span className="text-indigo-200 text-sm">{session!.user!.name}</span>
          <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }}>
            <button type="submit" className="text-sm text-indigo-200 hover:text-white">Sign out</button>
          </form>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-gray-700">Overall Progress</h2>
            <span className="text-indigo-600 font-bold">{completedCount}/{totalVideos} videos</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-indigo-600 h-3 rounded-full transition-all" style={{ width: `${progressPct}%` }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{progressPct}% complete</p>

          {completedCount === totalVideos && totalVideos > 0 && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-700 font-semibold text-lg">Mazel Tov! You have completed the Smicha Program!</p>
              <p className="text-green-600 text-sm mt-1">Your certificate will be mailed to you shortly.</p>
            </div>
          )}
        </div>

        {/* Subjects */}
        {allSubjects.map(subject => {
          const subjectChapters = allChapters.filter(c => c.subjectId === subject.id);
          return (
            <div key={subject.id} className="mb-8">
              <h2 className="text-xl font-bold text-indigo-800 mb-4 border-b-2 border-indigo-100 pb-2">
                {subject.name}
              </h2>
              <div className="space-y-4">
                {subjectChapters.map(chapter => {
                  const chapterVideos = allVideos.filter(v => v.chapterId === chapter.id)
                    .sort((a, b) => a.order - b.order);
                  return (
                    <div key={chapter.id} className="bg-white rounded-xl shadow p-5">
                      <h3 className="font-semibold text-gray-800 mb-3">{chapter.title}</h3>
                      <div className="space-y-2">
                        {chapterVideos.map(video => {
                          const isCompleted = completedVideoIds.has(video.id);
                          const isCurrent = video.id === currentVideoId;
                          const isLocked = !isCompleted && !isCurrent;
                          return (
                            <div key={video.id} className={`flex items-center gap-3 p-3 rounded-lg ${isCompleted ? 'bg-green-50' : isCurrent ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50'}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-500'}`}>
                                {isCompleted ? '✓' : isLocked ? '🔒' : '▶'}
                              </div>
                              <div className="flex-1">
                                <p className={`font-medium text-sm ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>{video.title}</p>
                              </div>
                              {(isCompleted || isCurrent) && (
                                <Link
                                  href={`/student/video/${video.id}`}
                                  className={`text-sm px-4 py-1.5 rounded-lg font-medium ${isCompleted ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                                >
                                  {isCompleted ? 'Review' : 'Start'}
                                </Link>
                              )}
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
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">Course content coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
