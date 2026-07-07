'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Option = { id: number; text: string; isCorrect: boolean };
type Question = { id: number; text: string; order: number; options: Option[] };
type Video = { id: number; title: string; youtubeId: string; pdfUrl?: string | null };

export default function VideoClient({ video, questions }: { video: Video; questions: Question[] }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleAnswer(questionId: number, optionId: number) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  }

  async function handleSubmit() {
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    let correct = 0;
    for (const q of questions) {
      const selectedOptionId = answers[q.id];
      const selectedOption = q.options.find(o => o.id === selectedOptionId);
      if (selectedOption?.isCorrect) correct++;
    }

    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setSubmitted(true);
    setLoading(true);

    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId: video.id, score: pct, passed: pct >= 80 }),
    });

    setLoading(false);
  }

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  }

  const passed = score >= 80;

  const btnPrimary: React.CSSProperties = { background: '#162B22', color: '#F6F1E7', border: 'none', padding: '0.8rem 2rem', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', letterSpacing: '0.02em' };
  const btnGold: React.CSSProperties = { background: '#C4912A', color: '#162B22', border: 'none', padding: '0.8rem 2rem', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', letterSpacing: '0.02em' };
  const btnOutline: React.CSSProperties = { background: 'transparent', color: '#162B22', border: '1px solid #C4912A', padding: '0.8rem 2rem', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer' };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {!showQuiz ? (
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: '400', color: '#162B22', marginBottom: '1.5rem' }}>{video.title}</h1>

          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', marginBottom: '1.5rem' }}>
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </div>

          {video.pdfUrl && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A9A95', fontWeight: '600' }}>Study Material</span>
                <a href={video.pdfUrl} download target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: '#C4912A', textDecoration: 'none', border: '1px solid #C4912A', padding: '0.35rem 0.9rem' }}>
                  ⬇ Download PDF
                </a>
              </div>
              <iframe src={video.pdfUrl} style={{ width: '100%', height: '500px', border: '1px solid #D5CFC4' }} title="Study Material PDF" />
            </div>
          )}

          {questions.length > 0 ? (
            <button onClick={() => setShowQuiz(true)} style={{ ...btnGold, width: '100%', padding: '1rem', fontSize: '1rem' }}>
              Take Quiz ({questions.length} questions)
            </button>
          ) : (
            <p style={{ textAlign: 'center', color: '#8A9A95' }}>Quiz questions coming soon.</p>
          )}
        </div>
      ) : (
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: '400', color: '#162B22', marginBottom: '0.5rem' }}>Quiz: {video.title}</h2>
          <p style={{ color: '#8A9A95', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Answer all {questions.length} questions. You need 80% to pass.</p>

          {submitted && (
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', textAlign: 'center', background: passed ? 'rgba(196,145,42,0.08)' : 'rgba(192,57,43,0.06)', borderTop: `3px solid ${passed ? '#C4912A' : '#C0392B'}` }}>
              <p style={{ fontSize: '1.8rem', fontWeight: '700', color: passed ? '#C4912A' : '#C0392B', fontFamily: 'Georgia, serif' }}>
                {score}% — {passed ? 'Passed!' : 'Not quite'}
              </p>
              <p style={{ color: '#4A5A55', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {passed ? 'Great job! Your progress has been recorded.' : 'You need 80% to pass. Review the video and try again.'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.25rem' }}>
                {passed ? (
                  <button onClick={() => router.push('/student')} style={btnPrimary}>Back to Dashboard →</button>
                ) : (
                  <>
                    <button onClick={handleRetry} style={btnGold}>Try Again</button>
                    <button onClick={() => setShowQuiz(false)} style={btnOutline}>Rewatch Video</button>
                  </>
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {questions.sort((a, b) => a.order - b.order).map((q, idx) => (
              <div key={q.id} style={{ background: '#fff', borderTop: '3px solid #162B22', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <p style={{ fontWeight: '600', color: '#162B22', marginBottom: '1rem', fontSize: '0.95rem' }}>
                  {idx + 1}. {q.text}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {q.options.map(opt => {
                    const selected = answers[q.id] === opt.id;
                    let bg = '#F6F1E7', border = '1px solid #D5CFC4', color = '#162B22';
                    if (submitted) {
                      if (opt.isCorrect) { bg = 'rgba(46,125,80,0.1)'; border = '1px solid #2E7D50'; color = '#2E7D50'; }
                      else if (selected && !opt.isCorrect) { bg = 'rgba(192,57,43,0.08)'; border = '1px solid #C0392B'; color = '#C0392B'; }
                    } else if (selected) {
                      bg = 'rgba(196,145,42,0.12)'; border = '1px solid #C4912A';
                    }
                    return (
                      <button key={opt.id} onClick={() => handleAnswer(q.id, opt.id)}
                        style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', background: bg, border, color, fontSize: '0.9rem', cursor: submitted ? 'default' : 'pointer' }}>
                        {opt.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!submitted && (
            <button onClick={handleSubmit} disabled={loading || Object.keys(answers).length < questions.length}
              style={{ ...btnPrimary, width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '1.5rem', opacity: Object.keys(answers).length < questions.length ? 0.5 : 1 }}>
              Submit Quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
}
