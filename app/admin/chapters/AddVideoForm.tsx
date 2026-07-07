'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Chapter = { id: number; title: string; subjectId: number };

export default function AddVideoForm({ chapters }: { chapters: Chapter[] }) {
  const [form, setForm] = useState({ chapterId: '', title: '', youtubeId: '', pdfUrl: '', order: '' });
  const [loading, setLoading] = useState(false);
  const [generateQuestions, setGenerateQuestions] = useState(true);
  const router = useRouter();

  const inputStyle = { width: '100%', border: '1px solid #D5CFC4', padding: '0.6rem 0.9rem', fontSize: '0.9rem', outline: 'none', background: '#FDFAF4', color: '#162B22', boxSizing: 'border-box' as const };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterId: parseInt(form.chapterId), title: form.title, youtubeId: form.youtubeId, pdfUrl: form.pdfUrl || null, order: parseInt(form.order), generateQuestions }),
    });
    setForm({ chapterId: '', title: '', youtubeId: '', pdfUrl: '', order: '' });
    setLoading(false);
    router.refresh();
  }

  return (
    <div style={{ background: '#fff', borderTop: '3px solid #C4912A', padding: '1.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400', color: '#162B22', marginBottom: '1.25rem' }}>Add Video</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <select value={form.chapterId} onChange={e => setForm({ ...form, chapterId: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }} required>
            <option value="">Select Chapter</option>
            {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <input type="number" placeholder="Order within chapter" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} style={inputStyle} required />
        </div>
        <input type="text" placeholder="Video title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} required />
        <input type="text" placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)" value={form.youtubeId} onChange={e => setForm({ ...form, youtubeId: e.target.value })} style={inputStyle} required />
        <input type="url" placeholder="PDF URL (optional)" value={form.pdfUrl} onChange={e => setForm({ ...form, pdfUrl: e.target.value })} style={inputStyle} />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#4A5A55', cursor: 'pointer' }}>
          <input type="checkbox" checked={generateQuestions} onChange={e => setGenerateQuestions(e.target.checked)} style={{ width: '1rem', height: '1rem', accentColor: '#C4912A' }} />
          Auto-generate 15 quiz questions (AI — review before publishing)
        </label>
        <button type="submit" disabled={loading} style={{ background: loading ? '#8A9A95' : '#C4912A', color: '#162B22', border: 'none', padding: '0.75rem', fontWeight: '700', fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Adding video...' : 'Add Video'}
        </button>
      </form>
    </div>
  );
}
