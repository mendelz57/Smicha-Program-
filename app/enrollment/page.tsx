'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EnrollmentPage() {
  const [form, setForm] = useState({
    phone: '', dateOfBirth: '', address: '', city: '', state: '', zip: '',
    familyStatus: '', occupation: '', torahEducation: [] as string[],
    shulchanAruchLevel: '', aboutYourself: '',
    mothersHebrewName: '', fathersHebrewName: '',
    referenceRabbi: '', referencePhone: '', hearAboutUs: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const US_STATES = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
    'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
    'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
    'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
    'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
    'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
    'Virginia','Washington','West Virginia','Wisconsin','Wyoming','Other',
  ];

  const TORAH_OPTIONS = [
    'Independent learning', 'High school', 'Yeshiva - one year or less',
    'Yeshiva - more than one year', 'Kolel',
  ];

  function toggleTorah(option: string) {
    setForm(f => ({
      ...f,
      torahEducation: f.torahEducation.includes(option)
        ? f.torahEducation.filter(o => o !== option)
        : [...f.torahEducation, option],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/enrollment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, torahEducation: form.torahEducation.join(', ') }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Something went wrong.');
      setLoading(false);
      return;
    }
    router.push('/payment');
  }

  const inputStyle = {
    width: '100%', border: '1px solid #D5CFC4', padding: '0.65rem 0.9rem',
    fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' as const,
    background: '#FDFAF4', color: '#162B22',
  };

  const labelStyle = {
    display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' as const,
    letterSpacing: '0.08em', color: '#8A9A95', fontWeight: '600' as const, marginBottom: '0.4rem',
  };

  const req = <span style={{ color: '#C4912A', marginLeft: '2px' }}>*</span>;

  const sectionHead = (title: string) => (
    <div style={{ borderBottom: '1px solid #D5CFC4', paddingBottom: '0.5rem', marginBottom: '0.25rem' }}>
      <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#C4912A', fontWeight: '600' }}>{title}</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#F6F1E7', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ background: '#162B22', borderBottom: '1px solid rgba(196,145,42,0.2)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', letterSpacing: '0.05em', color: '#C4912A', textDecoration: 'none' }}>Smicha Program</Link>
        </div>
      </nav>

      <div style={{ background: '#162B22', padding: '3rem 2rem 2.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4912A', fontWeight: '600', marginBottom: '0.75rem' }}>Step 1 of 2</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '400', color: '#F6F1E7', marginBottom: '0.75rem' }}>Complete Your Enrollment</h1>
        <div style={{ width: '2.5rem', height: '2px', background: '#C4912A', margin: '0 auto 1rem' }}></div>
        <p style={{ color: '#A8C0B8', fontSize: '0.9rem' }}>Please fill in your details before proceeding to payment.</p>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '580px' }}>
          <div style={{ background: '#fff', borderTop: '3px solid #C4912A', padding: '2.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {sectionHead('Personal Information')}

              {/* Name row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>First Name {req}</label>
                  <input type="text" disabled style={{ ...inputStyle, background: '#F0EDE6', color: '#8A9A95' }} placeholder="From your account" />
                </div>
                <div>
                  <label style={labelStyle}>Last Name {req}</label>
                  <input type="text" disabled style={{ ...inputStyle, background: '#F0EDE6', color: '#8A9A95' }} placeholder="From your account" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Phone {req}</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} placeholder="(201) 555-0123" required />
              </div>

              <div>
                <label style={labelStyle}>Date of Birth</label>
                <input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Address {req}</label>
                <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={inputStyle} placeholder="123 Main St" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div style={{ gridColumn: '1 / 2' }}>
                  <label style={labelStyle}>City {req}</label>
                  <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={inputStyle} placeholder="Los Angeles" required />
                </div>
                <div>
                  <label style={labelStyle}>State {req}</label>
                  <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }} required>
                    <option value="">State</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Zip {req}</label>
                  <input type="text" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} style={inputStyle} placeholder="90210" required maxLength={10} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Family Status {req}</label>
                <select value={form.familyStatus} onChange={e => setForm({ ...form, familyStatus: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }} required>
                  <option value="">Select</option>
                  {['Single', 'Married', 'Divorced', 'Widowed'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Current Occupation {req}</label>
                <input type="text" value={form.occupation} onChange={e => setForm({ ...form, occupation: e.target.value })} style={inputStyle} placeholder="e.g. Teacher, Student, Business" required />
              </div>

              {sectionHead('Torah Background')}

              <div>
                <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>Torah Education (select all that apply)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {TORAH_OPTIONS.map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', color: '#162B22' }}>
                      <input
                        type="checkbox"
                        checked={form.torahEducation.includes(opt)}
                        onChange={() => toggleTorah(opt)}
                        style={{ width: '1rem', height: '1rem', accentColor: '#C4912A', cursor: 'pointer' }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>How well can you independently learn Shulchan Aruch? {req}</label>
                <select value={form.shulchanAruchLevel} onChange={e => setForm({ ...form, shulchanAruchLevel: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }} required>
                  <option value="">Select</option>
                  {['Not at all', 'Somewhat', 'Fairly well', 'Very well'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Tell us a little about yourself</label>
                <textarea value={form.aboutYourself} onChange={e => setForm({ ...form, aboutYourself: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Share anything you'd like us to know..." />
              </div>

              {sectionHead('Hebrew Names & Reference')}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Mother's Hebrew Name</label>
                  <input type="text" value={form.mothersHebrewName} onChange={e => setForm({ ...form, mothersHebrewName: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Father's Hebrew Name</label>
                  <input type="text" value={form.fathersHebrewName} onChange={e => setForm({ ...form, fathersHebrewName: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Rabbi who can serve as your reference {req}</label>
                <input type="text" value={form.referenceRabbi} onChange={e => setForm({ ...form, referenceRabbi: e.target.value })} style={inputStyle} placeholder="Rabbi's full name" required />
              </div>

              <div>
                <label style={labelStyle}>Reference phone number {req}</label>
                <input type="tel" value={form.referencePhone} onChange={e => setForm({ ...form, referencePhone: e.target.value })} style={inputStyle} placeholder="(201) 555-0123" required />
              </div>

              <div>
                <label style={labelStyle}>How did you hear about our Smicha Program?</label>
                <input type="text" value={form.hearAboutUs} onChange={e => setForm({ ...form, hearAboutUs: e.target.value })} style={inputStyle} placeholder="e.g. Friend, Google, social media..." />
              </div>

              {error && <p style={{ color: '#C0392B', fontSize: '0.85rem' }}>{error}</p>}

              <button
                type="submit"
                disabled={loading}
                style={{ background: loading ? '#8A9A95' : '#162B22', color: '#F6F1E7', border: 'none', padding: '0.85rem', fontWeight: '700', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.02em', marginTop: '0.5rem' }}
              >
                {loading ? 'Saving...' : 'Continue to Payment →'}
              </button>
            </form>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#8A9A95', marginTop: '1.25rem' }}>
            <span style={{ color: '#C4912A' }}>*</span> Required fields
          </p>
        </div>
      </div>
    </div>
  );
}
