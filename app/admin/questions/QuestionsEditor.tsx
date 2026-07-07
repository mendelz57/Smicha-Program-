'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Option = { id: number; text: string; isCorrect: boolean };
type Question = { id: number; text: string; order: number; options: Option[] };
type Video = { id: number; title: string };

export default function QuestionsEditor({ video, questions }: { video: Video; questions: Question[] }) {
  const [localQuestions, setLocalQuestions] = useState(questions);
  const [saving, setSaving] = useState<number | null>(null);
  const router = useRouter();

  async function saveQuestion(q: Question) {
    setSaving(q.id);
    await fetch('/api/admin/questions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(q),
    });
    setSaving(null);
    router.refresh();
  }

  async function deleteQuestion(qId: number) {
    if (!confirm('Delete this question?')) return;
    await fetch(`/api/admin/questions?id=${qId}`, { method: 'DELETE' });
    setLocalQuestions(prev => prev.filter(q => q.id !== qId));
  }

  function updateQuestionText(qId: number, text: string) {
    setLocalQuestions(prev => prev.map(q => q.id === qId ? { ...q, text } : q));
  }

  function updateOptionText(qId: number, optId: number, text: string) {
    setLocalQuestions(prev => prev.map(q => q.id === qId ? {
      ...q,
      options: q.options.map(o => o.id === optId ? { ...o, text } : o)
    } : q));
  }

  function setCorrectOption(qId: number, optId: number) {
    setLocalQuestions(prev => prev.map(q => q.id === qId ? {
      ...q,
      options: q.options.map(o => ({ ...o, isCorrect: o.id === optId }))
    } : q));
  }

  const inputStyle = { border: '1px solid #D5CFC4', padding: '0.5rem 0.75rem', fontSize: '0.875rem', outline: 'none', background: '#FDFAF4', color: '#162B22', width: '100%', boxSizing: 'border-box' as const };

  return (
    <div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '400', color: '#162B22', marginBottom: '1.25rem' }}>{video.title} — {localQuestions.length} questions</h2>

      {localQuestions.length === 0 && (
        <div style={{ background: 'rgba(196,145,42,0.1)', borderLeft: '3px solid #C4912A', padding: '1rem 1.25rem', color: '#162B22', fontSize: '0.875rem' }}>
          No questions yet. Add a video with AI generation enabled, or add questions manually.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {localQuestions.sort((a, b) => a.order - b.order).map((q, idx) => (
          <div key={q.id} style={{ background: '#fff', borderTop: '3px solid #162B22', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ color: '#C4912A', fontWeight: '700', fontSize: '0.85rem', marginTop: '0.5rem', flexShrink: 0 }}>Q{idx + 1}</span>
              <textarea value={q.text} onChange={e => updateQuestionText(q.id, e.target.value)} style={{ ...inputStyle, flex: 1, resize: 'none' }} rows={2} />
              <button onClick={() => deleteQuestion(q.id)} style={{ background: 'none', border: 'none', color: '#C0392B', cursor: 'pointer', fontSize: '1rem', marginTop: '0.25rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1.75rem' }}>
              {q.options.map((opt, oi) => (
                <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <input type="radio" name={`correct-${q.id}`} checked={opt.isCorrect} onChange={() => setCorrectOption(q.id, opt.id)} style={{ width: '1rem', height: '1rem', accentColor: '#C4912A', cursor: 'pointer', flexShrink: 0 }} />
                  <input type="text" value={opt.text} onChange={e => updateOptionText(q.id, opt.id, e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder={`Option ${oi + 1}`} />
                  {opt.isCorrect && <span style={{ color: '#2E7D50', fontSize: '0.75rem', fontWeight: '600', flexShrink: 0 }}>Correct</span>}
                </div>
              ))}
            </div>
            <button onClick={() => saveQuestion(q)} disabled={saving === q.id} style={{ marginTop: '1rem', marginLeft: '1.75rem', background: saving === q.id ? '#8A9A95' : '#C4912A', color: '#162B22', border: 'none', padding: '0.4rem 1.25rem', fontWeight: '700', fontSize: '0.85rem', cursor: saving === q.id ? 'not-allowed' : 'pointer' }}>
              {saving === q.id ? 'Saving...' : 'Save'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
