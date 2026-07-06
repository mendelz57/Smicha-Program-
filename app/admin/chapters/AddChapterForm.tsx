'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Subject = { id: number; name: string; order: number };

export default function AddChapterForm({ subjects }: { subjects: Subject[] }) {
  const [form, setForm] = useState({ subjectId: '', title: '', order: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="font-bold text-lg text-gray-800 mb-4">Add Chapter</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
        <select
          value={form.subjectId}
          onChange={e => setForm({ ...form, subjectId: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        >
          <option value="">Select Subject</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input
          type="text"
          placeholder="Chapter title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="number"
          placeholder="Order (1, 2, 3...)"
          value={form.order}
          onChange={e => setForm({ ...form, order: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="col-span-3 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Chapter'}
        </button>
      </form>
    </div>
  );
}
