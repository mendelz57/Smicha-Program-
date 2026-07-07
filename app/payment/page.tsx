'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function PaymentPage() {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');
  const [form, setForm] = useState({ cardNumber: '', cardExpiry: '', cardCvv: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, plan }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Payment failed. Please try again.');
      setLoading(false);
      return;
    }
    router.push('/student');
  }

  const inputStyle = {
    width: '100%', border: '1px solid #D5CFC4', padding: '0.65rem 0.9rem',
    fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' as const,
    background: '#FDFAF4', color: '#162B22',
  };
  const labelStyle = {
    display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' as const,
    letterSpacing: '0.08em', color: '#8A9A95', fontWeight: '600' as const, marginBottom: '0.4rem',
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#F6F1E7', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ background: '#162B22', borderBottom: '1px solid rgba(196,145,42,0.2)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', letterSpacing: '0.05em', color: '#C4912A', textDecoration: 'none' }}>Smicha Program</Link>
        </div>
      </nav>

      <div style={{ background: '#162B22', padding: '3rem 2rem 2.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4912A', fontWeight: '600', marginBottom: '0.75rem' }}>Step 2 of 2</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '400', color: '#F6F1E7', marginBottom: '0.75rem' }}>Choose Your Plan</h1>
        <div style={{ width: '2.5rem', height: '2px', background: '#C4912A', margin: '0 auto 1rem' }}></div>
        <p style={{ color: '#A8C0B8', fontSize: '0.9rem' }}>Your free trial has ended. Continue learning by subscribing.</p>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          {/* Plan selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <button onClick={() => setPlan('monthly')} style={{ background: plan === 'monthly' ? '#162B22' : '#fff', border: plan === 'monthly' ? '2px solid #C4912A' : '2px solid #D5CFC4', padding: '1.25rem', textAlign: 'left', cursor: 'pointer' }}>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C4912A', fontWeight: '600', marginBottom: '0.5rem' }}>Monthly</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: plan === 'monthly' ? '#F6F1E7' : '#162B22', fontWeight: '400' }}>$300<span style={{ fontSize: '0.85rem', color: '#8A9A95' }}>/mo</span></p>
              <p style={{ fontSize: '0.75rem', color: '#8A9A95', marginTop: '0.25rem' }}>$3,600 over 12 months</p>
            </button>
            <button onClick={() => setPlan('annual')} style={{ background: plan === 'annual' ? '#162B22' : '#fff', border: plan === 'annual' ? '2px solid #C4912A' : '2px solid #D5CFC4', padding: '1.25rem', textAlign: 'left', cursor: 'pointer', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: '#C4912A', color: '#162B22', fontSize: '0.65rem', fontWeight: '700', padding: '0.2rem 0.5rem', letterSpacing: '0.05em' }}>SAVE 20%</span>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C4912A', fontWeight: '600', marginBottom: '0.5rem' }}>Annual</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', color: plan === 'annual' ? '#F6F1E7' : '#162B22', fontWeight: '400' }}>$2,880<span style={{ fontSize: '0.85rem', color: '#8A9A95' }}> once</span></p>
              <p style={{ fontSize: '0.75rem', color: '#8A9A95', marginTop: '0.25rem' }}>vs $3,600 monthly</p>
            </button>
          </div>

          <div style={{ background: '#fff', borderTop: '3px solid #C4912A', padding: '2.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={e => setForm({ ...form, cardNumber: e.target.value.replace(/\D/g, '') })} maxLength={16} style={inputStyle} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Expiry (MM/YY)</label>
                  <input type="text" placeholder="MM/YY" value={form.cardExpiry} onChange={e => setForm({ ...form, cardExpiry: e.target.value })} maxLength={5} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>CVV</label>
                  <input type="text" placeholder="123" value={form.cardCvv} onChange={e => setForm({ ...form, cardCvv: e.target.value.replace(/\D/g, '') })} maxLength={4} style={inputStyle} required />
                </div>
              </div>
              {error && <p style={{ color: '#C0392B', fontSize: '0.85rem' }}>{error}</p>}
              <button type="submit" disabled={loading} style={{ background: loading ? '#8A9A95' : '#162B22', color: '#F6F1E7', border: 'none', padding: '0.85rem', fontWeight: '700', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.02em' }}>
                {loading ? 'Processing...' : `Pay ${plan === 'annual' ? '$2,880' : '$300'}`}
              </button>
            </form>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#8A9A95', marginTop: '1rem' }}>Payments processed securely via Authorize.net</p>
            <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ width: '100%', textAlign: 'center', fontSize: '0.85rem', color: '#8A9A95', marginTop: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
