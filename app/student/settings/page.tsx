import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
  const session = await auth();
  const userId = parseInt(session!.user!.id!);
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#F6F1E7', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#162B22', borderBottom: '1px solid rgba(196,145,42,0.2)', padding: '1rem 1.25rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/student" style={{ color: '#A8C0B8', fontSize: '0.85rem', textDecoration: 'none' }}>← Dashboard</Link>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#C4912A', letterSpacing: '0.05em' }}>Account Settings</span>
        </div>
      </header>

      <div style={{ background: '#162B22', padding: '2.5rem 2rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: '400', color: '#F6F1E7', marginBottom: '0.5rem' }}>{user.name}</h1>
        <p style={{ color: '#A8C0B8', fontSize: '0.9rem' }}>{user.email}</p>
        <div style={{ width: '2.5rem', height: '2px', background: '#C4912A', margin: '1rem auto 0' }}></div>
      </div>

      <div style={{ maxWidth: '580px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <SettingsForm user={{
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          dateOfBirth: user.dateOfBirth || '',
          address: user.address || '',
          city: user.city || '',
          state: user.state || '',
          zip: user.zip || '',
          hasPassword: !!user.password,
        }} />
      </div>
    </div>
  );
}
