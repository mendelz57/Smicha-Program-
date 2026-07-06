import { db } from '@/lib/db';
import { contactMessages } from '@/lib/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';

export default async function MessagesPage() {
  const messages = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));

  return (
    <div style={{ minHeight: '100vh', background: '#F6F1E7', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#162B22', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link href="/admin" style={{ color: '#A8C0B8', fontSize: '0.85rem', textDecoration: 'none' }}>← Admin</Link>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#C4912A' }}>Contact Messages</span>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {messages.length === 0 ? (
          <div style={{ background: '#fff', borderTop: '3px solid #C4912A', padding: '2.5rem', textAlign: 'center', color: '#8A9A95' }}>
            No messages yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ background: '#fff', borderTop: '3px solid #C4912A', padding: '1.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontWeight: '700', color: '#162B22' }}>{msg.name}</span>
                    <span style={{ color: '#8A9A95', fontSize: '0.85rem', marginLeft: '0.75rem' }}>{msg.email}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#8A9A95' }}>
                    {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ color: '#4A5A55', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                <a href={`mailto:${msg.email}`} style={{ display: 'inline-block', marginTop: '1rem', color: '#C4912A', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>
                  Reply →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
