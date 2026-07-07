import { db } from '@/lib/db';
import { users, videos, chapters, studentProgress } from '@/lib/schema';
import { eq, count } from 'drizzle-orm';
import Link from 'next/link';
import { signOut } from '@/lib/auth';

export default async function AdminDashboard() {
  const [userCount] = await db.select({ count: count() }).from(users).where(eq(users.role, 'student'));
  const [videoCount] = await db.select({ count: count() }).from(videos);
  const [chapterCount] = await db.select({ count: count() }).from(chapters);

  const allStudents = await db.query.users.findMany({ where: eq(users.role, 'student') });
  const allVideos = await db.query.videos.findMany();
  const totalVideos = allVideos.length;

  const completedStudents = [];
  for (const student of allStudents) {
    const prog = await db.query.studentProgress.findMany({ where: eq(studentProgress.userId, student.id) });
    if (totalVideos > 0 && prog.filter(p => p.completed).length >= totalVideos) {
      completedStudents.push(student);
    }
  }

  const cards = [
    { label: 'Students', value: userCount.count, href: '/admin/users' },
    { label: 'Chapters', value: chapterCount.count, href: '/admin/chapters' },
    { label: 'Videos', value: videoCount.count, href: '/admin/chapters' },
    { label: 'Completions', value: completedStudents.length, href: '/admin/users' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F6F1E7', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#162B22', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#C4912A', letterSpacing: '0.05em', textDecoration: 'none' }}>Smicha Program — Admin</Link>
        <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }}>
          <button type="submit" style={{ background: 'none', border: 'none', color: '#A8C0B8', fontSize: '0.85rem', cursor: 'pointer' }}>Sign out</button>
        </form>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {cards.map(card => (
            <Link key={card.label} href={card.href} style={{ background: '#fff', borderTop: '3px solid #C4912A', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textDecoration: 'none', display: 'block' }}>
              <p style={{ fontSize: '2.2rem', fontWeight: '700', color: '#162B22', fontFamily: 'Georgia, serif' }}>{card.value}</p>
              <p style={{ fontSize: '0.8rem', color: '#8A9A95', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginTop: '0.25rem' }}>{card.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: '#fff', borderTop: '3px solid #162B22', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', fontWeight: '400', color: '#162B22', marginBottom: '1.25rem' }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { href: '/admin/chapters', label: '+ Add Chapter / Video' },
                { href: '/admin/questions', label: '✎  Manage Questions' },
                { href: '/admin/users', label: '👥  View Students' },
              { href: '/admin/messages', label: '✉  Contact Messages' },
              { href: 'https://analytics.google.com', label: '📊  Google Analytics', external: true },
              ].map(item => (
                <Link key={item.href} href={item.href} target={(item as any).external ? '_blank' : undefined} rel={(item as any).external ? 'noopener noreferrer' : undefined} style={{ display: 'block', padding: '0.75rem 1rem', background: '#F6F1E7', color: '#162B22', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', borderLeft: '3px solid #C4912A' }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {completedStudents.length > 0 && (
            <div style={{ background: '#162B22', borderTop: '3px solid #C4912A', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', fontWeight: '400', color: '#F6F1E7', marginBottom: '1.25rem' }}>Program Completions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {completedStudents.map(s => (
                  <div key={s.id} style={{ padding: '0.75rem 1rem', background: 'rgba(196,145,42,0.1)', borderLeft: '3px solid #C4912A' }}>
                    <p style={{ fontWeight: '600', color: '#F6F1E7', fontSize: '0.9rem' }}>{s.name}</p>
                    <p style={{ fontSize: '0.8rem', color: '#A8C0B8' }}>{s.email}</p>
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
