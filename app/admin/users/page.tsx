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
      const prog = await db.query.studentProgress.findMany({ where: eq(studentProgress.userId, student.id) });
      const completed = prog.filter(p => p.completed).length;
      return { ...student, completed, total: totalVideos };
    })
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F6F1E7', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#162B22', borderBottom: '1px solid rgba(196,145,42,0.2)', padding: '1rem 1.25rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/admin" style={{ color: '#A8C0B8', fontSize: '0.85rem', textDecoration: 'none' }}>← Admin</Link>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#C4912A', letterSpacing: '0.05em' }}>Students</span>
        </div>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ background: '#fff', borderTop: '3px solid #C4912A', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#F6F1E7', borderBottom: '2px solid #D5CFC4' }}>
                {['Name', 'Email', 'Plan', 'Progress', 'Joined'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1.25rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A9A95', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentsWithProgress.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid #E8E2D6' }}>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: '600', color: '#162B22' }}>{student.name}</td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#4A5A55' }}>{student.email}</td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.05em',
                      background: student.plan === 'trial' ? 'rgba(196,145,42,0.15)' : student.plan === 'monthly' || student.plan === 'annual' ? 'rgba(22,43,34,0.1)' : 'rgba(192,57,43,0.1)',
                      color: student.plan === 'trial' ? '#C4912A' : student.plan === 'monthly' || student.plan === 'annual' ? '#162B22' : '#C0392B',
                    }}>
                      {student.plan}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '80px', background: '#E8E2D6', height: '6px' }}>
                        <div style={{ background: '#C4912A', height: '6px', width: `${student.total > 0 ? (student.completed / student.total) * 100 : 0}%` }}></div>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#8A9A95' }}>{student.completed}/{student.total}</span>
                      {student.completed === student.total && student.total > 0 && <span>🎓</span>}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#8A9A95', fontSize: '0.85rem' }}>
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {studentsWithProgress.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#8A9A95' }}>No students yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
