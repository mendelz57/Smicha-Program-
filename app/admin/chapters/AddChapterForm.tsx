'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Subject = { id: number; name: string; order: number };

export default function AddChapterForm({ subjects }: { subjects: Subject[] }) {
  const [form, setForm] = useState({ subjectId: '', title: '', order: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const inputStyle = { width: '100%', border: '1px solid #D5CFC4', padding: '0.6rem 0.9rem', fontSize: '0.9rem', outline: 'none', background: '#FDFAF4', color: '#162B22', boxSizing: 'border-box' as const };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/chapters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjectId: parseInt(form.subjectId), title: form.title, order: parseInt(form.order) }),
    });
    setForm({ subjectId: '', title: '', order: '' });
    setLoading(false);
    router.refresh();
  }

  return (
    <div style={{ background: '#fff', borderTop: '3px solid #C4912A', padding: '1.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400', color: '#162B22', marginBottom: '1.25rem' }}>Add Chapter</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
        <select value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }} required>
          <option value="">Select Subject</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input type="text" placeholder="Chapter title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} required />
        <input type="number" placeholder="Order (1, 2, 3...)" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} style={inputStyle} required />
        <button type="submit" disabled={loading} style={{ gridColumn: '1 / -1', background: loading ? '#8A9A95' : '#162B22', color: '#F6F1E7', border: 'none', padding: '0.75rem', fontWeight: '700', fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Adding...' : 'Add Chapter'}
        </button>
      </form>
    </div>
  );
}
