'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Chapter = { id: number; title: string; subjectId: number };

export default function AddVideoForm({ chapters }: { chapters: Chapter[] }) {
  const [form, setForm] = useState({ chapterId: '', title: '', youtubeId: '', pdfUrl: '', order: '' });
  const [loading, setLoading] = useState(false);
  const [generateQuestions, setGenerateQuestions] = useState(true);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chapterId: parseInt(form.chapterId),
        title: form.title,
        youtubeId: form.youtubeId,
        pdfUrl: form.pdfUrl || null,
        order: parseInt(form.order),
        generateQuestions,
      }),
    });
    setForm({ chapterId: '', title: '', youtubeId: '', pdfUrl: '', order: '' });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="font-bold text-lg text-gray-800 mb-4">Add Video</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <select
            value={form.chapterId}
            onChange={e => setForm({ ...form, chapterId: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select Chapter</option>
            {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <input
            type="number"
            placeholder="Order within chapter"
            value={form.order}
            onChange={e => setForm({ ...form, order: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <input
          type="text"
          placeholder="Video title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="text"
          placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)"
          value={form.youtubeId}
          onChange={e => setForm({ ...form, youtubeId: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="url"
          placeholder="PDF URL (optional — paste link when ready)"
          value={form.pdfUrl}
          onChange={e => setForm({ ...form, pdfUrl: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={generateQuestions}
            onChange={e => setGenerateQuestions(e.target.checked)}
            className="w-4 h-4 text-indigo-600"
          />
          Auto-generate 15 quiz questions (AI — review before publishing)
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Adding video...' : 'Add Video'}
        </button>
      </form>
    </div>
  );
}
