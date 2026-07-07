'use client';

type Video = { id: number; title: string };

export default function VideoSelector({ videos, selectedVideoId }: { videos: Video[]; selectedVideoId: number | null }) {
  return (
    <select
      defaultValue={selectedVideoId || ''}
      onChange={e => { if (e.target.value) window.location.href = `/admin/questions?videoId=${e.target.value}`; }}
      style={{ width: '100%', border: '1px solid #D5CFC4', padding: '0.6rem 0.9rem', fontSize: '0.9rem', outline: 'none', background: '#FDFAF4', color: '#162B22', cursor: 'pointer' }}
    >
      <option value="">Choose a video...</option>
      {videos.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
    </select>
  );
}
