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

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#D5CFC4' }}></div>
              <span style={{ fontSize: '0.8rem', color: '#8A9A95' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#D5CFC4' }}></div>
            </div>

            <button
              onClick={() => signIn('google', { callbackUrl: '/student' })}
              style={{ width: '100%', border: '2px solid #D5CFC4', background: '#fff', padding: '0.75rem', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', color: '#162B22', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', transition: 'all 0.15s ease', WebkitTapHighlightColor: 'rgba(196,145,42,0.2)' }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              onTouchStart={e => (e.currentTarget.style.background = '#F6F1E7')}
              onTouchEnd={e => (e.currentTarget.style.background = '#fff')}
            >
              <svg style={{ width: '1.1rem', height: '1.1rem' }} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
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
