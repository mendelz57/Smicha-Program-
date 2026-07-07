'use client';
import { useState } from 'react';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
  'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
  'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
  'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
  'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming','Other',
];

type Props = {
  user: { name: string; email: string; phone: string; dateOfBirth: string; address: string; city: string; state: string; zip: string; hasPassword: boolean };
};

export default function SettingsForm({ user }: Props) {
  const [form, setForm] = useState({ ...user, currentPassword: '', newPassword: '', confirmPassword: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    width: '100%', border: '1px solid #D5CFC4', padding: '0.65rem 0.9rem',
    fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' as const,
    background: '#FDFAF4', color: '#162B22',
  };
  const labelStyle = {
    display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' as const,
    letterSpacing: '0.08em', color: '#8A9A95', fontWeight: '600' as const, marginBottom: '0.4rem',
  };
  const sectionStyle = {
    background: '#fff', borderTop: '3px solid #C4912A', padding: '1.75rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem',
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (form.newPassword && form.newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/student/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        currentPassword: form.currentPassword || undefined,
        newPassword: form.newPassword || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Something went wrong.');
    } else {
      setSuccess('Settings saved successfully.');
      setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
    }
  }

  return (
    <form onSubmit={handleSubmit}>

      {/* Personal Info */}
      <div style={sectionStyle}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4912A', fontWeight: '600', marginBottom: '1.25rem' }}>Personal Information</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} placeholder="(201) 555-0123" />
          </div>
          <div>
            <label style={labelStyle}>Date of Birth</label>
            <input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Address */}
      <div style={sectionStyle}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4912A', fontWeight: '600', marginBottom: '1.25rem' }}>Address</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Street Address</label>
            <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={inputStyle} placeholder="123 Main St" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div style={{ gridColumn: '1 / 2' }}>
              <label style={labelStyle}>City</label>
              <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Select</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Zip</label>
              <input type="text" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} style={inputStyle} maxLength={10} />
            </div>
          </div>
        </div>
      </div>

      {/* Password */}
      <div style={sectionStyle}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4912A', fontWeight: '600', marginBottom: '1.25rem' }}>Change Password</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {user.hasPassword && (
            <div>
              <label style={labelStyle}>Current Password</label>
              <input type="password" value={form.currentPassword} onChange={e => setForm({ ...form, currentPassword: e.target.value })} style={inputStyle} placeholder="Enter current password" />
            </div>
          )}
          <div>
            <label style={labelStyle}>New Password</label>
            <input type="password" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} style={inputStyle} placeholder="Leave blank to keep current" />
          </div>
          <div>
            <label style={labelStyle}>Confirm New Password</label>
            <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} style={inputStyle} placeholder="Repeat new password" />
          </div>
        </div>
      </div>

      {error && <p style={{ color: '#C0392B', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}
      {success && <p style={{ color: '#2E7D50', fontSize: '0.875rem', marginBottom: '1rem' }}>{success}</p>}

      <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? '#8A9A95' : '#162B22', color: '#F6F1E7', border: 'none', padding: '0.9rem', fontWeight: '700', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.02em' }}>
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
