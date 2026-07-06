'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Registration failed');
      setLoading(false);
      return;
    }
    await signIn('credentials', { email: form.email, password: form.password, redirect: false });
    router.push('/student');
  }

  const inputStyle = {
    width: '100%',
    border: '1px solid #D5CFC4',
    padding: '0.65rem 0.9rem',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
    background: '#FDFAF4',
    color: '#162B22',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    color: '#8A9A95',
    fontWeight: '600',
    marginBottom: '0.4rem',
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#F6F1E7', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2.5rem', borderBottom: '1px solid rgba(196,145,42,0.2)', background: '#162B22' }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', letterSpacing: '0.05em', color: '#C4912A', textDecoration: 'none' }}>
          Smicha Program
        </Link>
        <Link href="/login" style={{ color: '#C4D4CC', fontSize: '0.9rem', textDecoration: 'none' }}>Sign In</Link>
      </nav>

      {/* Form area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '3rem', color: '#C4912A', lineHeight: 1, marginBottom: '1rem', opacity: 0.6 }}>ס</div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: '400', color: '#162B22', marginBottom: '0.5rem' }}>Start Your Free Trial</h1>
            <div style={{ width: '2rem', height: '2px', background: '#C4912A', margin: '0 auto 0.75rem' }}></div>
            <p style={{ color: '#8A9A95', fontSize: '0.9rem' }}>7 days free. No credit card required.</p>
          </div>

          {/* Card */}
          <div style={{ background: '#fff', borderTop: '3px solid #C4912A', padding: '2.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} required minLength={6} />
              </div>
              {error && <p style={{ color: '#C0392B', fontSize: '0.85rem' }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ background: loading ? '#8A9A95' : '#162B22', color: '#F6F1E7', border: 'none', padding: '0.85rem', fontWeight: '700', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.02em' }}
              >
                {loading ? 'Creating account...' : 'Start Free Trial'}
              </button>
            </form>
          </div>

          {/* What's included */}
          <div style={{ background: '#162B22', padding: '1.5rem 2rem', marginTop: '0', borderTop: '1px solid rgba(196,145,42,0.3)' }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4912A', fontWeight: '600', marginBottom: '0.75rem' }}>What&apos;s Included</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['7-day free trial — no credit card', 'Full access to all 4 subjects', '$300/month or $2,880/year after trial'].map(item => (
                <li key={item} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.85rem', color: '#A8C0B8' }}>
                  <span style={{ color: '#C4912A' }}>✦</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#8A9A95', marginTop: '1.5rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#162B22', fontWeight: '600', textDecoration: 'underline' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
