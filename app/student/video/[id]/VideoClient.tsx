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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {!showQuiz ? (
        <div>
          <h1 className="text-2xl font-bold text-indigo-800 mb-6">{video.title}</h1>
          {/* YouTube embed */}
          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg mb-6">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          {/* PDF Section */}
          {video.pdfUrl && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-700">Study Material</h2>
                <a
                  href={video.pdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                >
                  ⬇ Download PDF
                </a>
              </div>
              <iframe
                src={video.pdfUrl}
                className="w-full rounded-xl border border-gray-200"
                style={{ height: '500px' }}
                title="Study Material PDF"
              />
            </div>
          )}

          {questions.length > 0 ? (
            <button
              onClick={() => setShowQuiz(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition text-lg"
            >
              Take Quiz ({questions.length} questions)
            </button>
          ) : (
            <p className="text-center text-gray-400">Quiz questions coming soon.</p>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-indigo-800 mb-2">Quiz: {video.title}</h2>
          <p className="text-gray-500 mb-6 text-sm">Answer all {questions.length} questions. You need 80% to advance.</p>

          {submitted && (
            <div className={`mb-6 p-5 rounded-xl text-center ${passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-2xl font-bold ${passed ? 'text-green-700' : 'text-red-700'}`}>
                {score}% — {passed ? 'Passed!' : 'Not quite'}
              </p>
              <p className={`mt-1 text-sm ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {passed ? 'Great job! You can now proceed to the next video.' : 'You need 80% to advance. Review the video and try again.'}
              </p>
              {passed ? (
                <button
                  onClick={() => router.push('/student')}
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
                >
                  Continue →
                </button>
              ) : (
                <div className="flex gap-3 justify-center mt-4">
                  <button onClick={handleRetry} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                    Try Again
                  </button>
                  <button onClick={() => setShowQuiz(false)} className="border border-gray-300 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50">
                    Rewatch Video
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="space-y-6">
            {questions.sort((a, b) => a.order - b.order).map((q, idx) => (
              <div key={q.id} className="bg-white rounded-xl shadow p-5">
                <p className="font-semibold text-gray-800 mb-3">
                  {idx + 1}. {q.text}
                </p>
                <div className="space-y-2">
                  {q.options.map(opt => {
                    const selected = answers[q.id] === opt.id;
                    let optClass = 'border border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300';
                    if (submitted) {
                      if (opt.isCorrect) optClass = 'border border-green-400 bg-green-50';
                      else if (selected && !opt.isCorrect) optClass = 'border border-red-400 bg-red-50';
                      else optClass = 'border border-gray-200 bg-gray-50';
                    } else if (selected) {
                      optClass = 'border border-indigo-500 bg-indigo-50';
                    }
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleAnswer(q.id, opt.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition text-sm ${optClass}`}
                      >
                        {opt.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!submitted && (
            <button
              onClick={handleSubmit}
              disabled={loading || Object.keys(answers).length < questions.length}
              className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition text-lg"
            >
              Submit Quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
}
