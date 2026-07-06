'use client';

type Video = { id: number; title: string };

export default function VideoSelector({ videos, selectedVideoId }: { videos: Video[]; selectedVideoId: number | null }) {
  return (
    <select
      defaultValue={selectedVideoId || ''}
      onChange={e => { if (e.target.value) window.location.href = `/admin/questions?videoId=${e.target.value}`; }}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">Choose a video...</option>
      {videos.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
    </select>
  );
}
