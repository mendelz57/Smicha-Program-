import { db } from '@/lib/db';
import { users, videos, chapters, studentProgress } from '@/lib/schema';
import { eq, count } from 'drizzle-orm';
import Link from 'next/link';
import { signOut } from '@/lib/auth';

export default async function AdminDashboard() {
  const [userCount] = await db.select({ count: count() }).from(users).where(eq(users.role, 'student'));
  const [videoCount] = await db.select({ count: count() }).from(videos);
  const [chapterCount] = await db.select({ count: count() }).from(chapters);

  // Students who completed all videos
  const allStudents = await db.query.users.findMany({ where: eq(users.role, 'student') });
  const allVideos = await db.query.videos.findMany();
  const totalVideos = allVideos.length;

  const completedStudents = [];
  for (const student of allStudents) {
    const prog = await db.query.studentProgress.findMany({
      where: eq(studentProgress.userId, student.id),
    });
    const completedCount = prog.filter(p => p.completed).length;
    if (totalVideos > 0 && completedCount >= totalVideos) {
      completedStudents.push(student);
    }
  }

  const cards = [
    { label: 'Students', value: userCount.count, href: '/admin/users', color: 'bg-blue-500' },
    { label: 'Chapters', value: chapterCount.count, href: '/admin/chapters', color: 'bg-purple-500' },
    { label: 'Videos', value: videoCount.count, href: '/admin/videos', color: 'bg-indigo-500' },
    { label: 'Completions', value: completedStudents.length, href: '/admin/users', color: 'bg-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-800 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Smicha Program — Admin</h1>
        <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }}>
          <button type="submit" className="text-sm text-indigo-200 hover:text-white">Sign out</button>
        </form>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {cards.map(card => (
            <Link key={card.label} href={card.href} className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
              <div className={`w-10 h-10 ${card.color} rounded-lg mb-3`}></div>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
              <p className="text-gray-500 text-sm mt-1">{card.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-lg text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/admin/chapters" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition">
                <span className="text-indigo-600">+</span> Add Chapter / Video
              </Link>
              <Link href="/admin/questions" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition">
                <span className="text-indigo-600">✎</span> Manage Questions
              </Link>
              <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition">
                <span className="text-indigo-600">👥</span> View Students
              </Link>
            </div>
          </div>

          {completedStudents.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-bold text-lg text-gray-800 mb-4">Program Completions 🎓</h2>
              <div className="space-y-2">
                {completedStudents.map(s => (
                  <div key={s.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600 font-bold">✓</span>
                    <div>
                      <p className="font-medium text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
