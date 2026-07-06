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

  return (
    <div>
      <h2 className="text-lg font-bold text-indigo-800 mb-4">{video.title} — {localQuestions.length} questions</h2>

      {localQuestions.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700 text-sm">
          No questions yet. Add a video with AI generation enabled, or add questions manually.
        </div>
      )}

      <div className="space-y-6">
        {localQuestions.sort((a, b) => a.order - b.order).map((q, idx) => (
          <div key={q.id} className="bg-white rounded-xl shadow p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="text-indigo-600 font-bold text-sm mt-2">Q{idx + 1}</span>
              <textarea
                value={q.text}
                onChange={e => updateQuestionText(q.id, e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={2}
              />
              <button onClick={() => deleteQuestion(q.id)} className="text-red-400 hover:text-red-600 text-sm mt-2">✕</button>
            </div>
            <div className="space-y-2 ml-6">
              {q.options.map((opt, oi) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${q.id}`}
                    checked={opt.isCorrect}
                    onChange={() => setCorrectOption(q.id, opt.id)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <input
                    type="text"
                    value={opt.text}
                    onChange={e => updateOptionText(q.id, opt.id, e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    placeholder={`Option ${oi + 1}`}
                  />
                  {opt.isCorrect && <span className="text-green-500 text-xs font-medium">Correct</span>}
                </div>
              ))}
            </div>
            <button
              onClick={() => saveQuestion(q)}
              disabled={saving === q.id}
              className="mt-3 ml-6 text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving === q.id ? 'Saving...' : 'Save'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
