import { db } from '@/lib/db';
import { users, studentProgress, videos } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

export default async function UsersPage() {
  const allStudents = await db.query.users.findMany({
    where: eq(users.role, 'student'),
    orderBy: (u, { desc }) => [desc(u.createdAt)],
  });
  const allVideos = await db.query.videos.findMany();
  const totalVideos = allVideos.length;

  const studentsWithProgress = await Promise.all(
    allStudents.map(async student => {
      const prog = await db.query.studentProgress.findMany({
        where: eq(studentProgress.userId, student.id),
      });
      const completed = prog.filter(p => p.completed).length;
      return { ...student, completed, total: totalVideos };
    })
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-800 text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-indigo-200 hover:text-white text-sm">← Admin</Link>
        <h1 className="text-lg font-bold">Students</h1>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 text-gray-600 font-semibold">Name</th>
                <th className="text-left px-5 py-3 text-gray-600 font-semibold">Email</th>
                <th className="text-left px-5 py-3 text-gray-600 font-semibold">Plan</th>
                <th className="text-left px-5 py-3 text-gray-600 font-semibold">Progress</th>
                <th className="text-left px-5 py-3 text-gray-600 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {studentsWithProgress.map(student => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{student.name}</td>
                  <td className="px-5 py-3 text-gray-600">{student.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.plan === 'monthly' ? 'bg-blue-100 text-blue-700' :
                      student.plan === 'annual' ? 'bg-green-100 text-green-700' :
                      student.plan === 'trial' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {student.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${student.completed === student.total && student.total > 0 ? 'bg-green-500' : 'bg-indigo-500'}`}
                          style={{ width: `${student.total > 0 ? (student.completed / student.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-500 text-xs">{student.completed}/{student.total}</span>
                      {student.completed === student.total && student.total > 0 && (
                        <span className="text-green-600 text-xs font-bold">🎓</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {studentsWithProgress.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">No students yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
