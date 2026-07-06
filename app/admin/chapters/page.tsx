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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-800 text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-indigo-200 hover:text-white text-sm">← Admin</Link>
        <h1 className="text-lg font-bold">Chapters & Videos</h1>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <AddChapterForm subjects={allSubjects} />
        <AddVideoForm chapters={allChapters} />

        {allSubjects.map(subject => {
          const subjectChapters = allChapters.filter(c => c.subjectId === subject.id);
          return (
            <div key={subject.id}>
              <h2 className="text-xl font-bold text-indigo-800 mb-3">{subject.name}</h2>
              {subjectChapters.map(chapter => {
                const chapterVideos = allVideos.filter(v => v.chapterId === chapter.id).sort((a, b) => a.order - b.order);
                return (
                  <div key={chapter.id} className="bg-white rounded-xl shadow p-5 mb-4">
                    <h3 className="font-semibold text-gray-800 mb-3">{chapter.title}</h3>
                    {chapterVideos.length === 0 ? (
                      <p className="text-sm text-gray-400">No videos yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {chapterVideos.map(v => (
                          <div key={v.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm">
                            <span className="text-indigo-600">▶</span>
                            <span className="flex-1">{v.title}</span>
                            <span className="text-gray-400 text-xs">{v.youtubeId}</span>
                            <Link href={`/admin/questions?videoId=${v.id}`} className="text-indigo-600 hover:underline text-xs">
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
