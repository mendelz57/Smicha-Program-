'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/student');
    }
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
        <Link href="/register" style={{ background: '#C4912A', color: '#162B22', padding: '0.5rem 1.25rem', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none' }}>
          Start Free Trial
        </Link>
      </nav>

      {/* Form area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '3rem', color: '#C4912A', lineHeight: 1, marginBottom: '1rem', opacity: 0.6 }}>ס</div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: '400', color: '#162B22', marginBottom: '0.5rem' }}>Welcome Back</h1>
            <div style={{ width: '2rem', height: '2px', background: '#C4912A', margin: '0 auto 0.75rem' }}></div>
            <p style={{ color: '#8A9A95', fontSize: '0.9rem' }}>Sign in to continue learning</p>
          </div>

          {/* Card */}
          <div style={{ background: '#fff', borderTop: '3px solid #C4912A', padding: '2.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required />
              </div>
              {error && <p style={{ color: '#C0392B', fontSize: '0.85rem' }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ background: loading ? '#8A9A95' : '#162B22', color: '#F6F1E7', border: 'none', padding: '0.85rem', fontWeight: '700', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.02em' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#8A9A95', marginTop: '1.5rem' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#162B22', fontWeight: '600', textDecoration: 'underline' }}>Start Free Trial</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
