import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { videos, questions, questionOptions, chapters, subjects } from '@/lib/schema';
import { eq } from 'drizzle-orm';

async function generateQuestions(videoTitle: string, subjectName: string) {
  const prompt = `You are an expert in Jewish law (Halacha). Generate exactly 15 multiple choice quiz questions for a Smicha (rabbinical ordination) student who just watched a video titled "${videoTitle}" in the subject of "${subjectName}".

Each question must have exactly 4 answer options with exactly 1 correct answer. Questions should test understanding of the halachic concepts, rulings, and practical applications covered in this topic.

Return ONLY a valid JSON array in this exact format:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correctIndex": 0
  }
]`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 4096 },
      }),
    }
  );

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Failed to parse questions');
  return JSON.parse(jsonMatch[0]);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { chapterId, title, youtubeId, pdfUrl, order, generateQuestions: doGenerate } = await req.json();

  const [video] = await db.insert(videos).values({ chapterId, title, youtubeId, pdfUrl: pdfUrl || null, order }).returning();

  if (doGenerate) {
    try {
      const chapter = await db.query.chapters.findFirst({ where: eq(chapters.id, chapterId) });
      const subject = chapter ? await db.query.subjects.findFirst({ where: eq(subjects.id, chapter.subjectId) }) : null;
      const subjectName = subject?.name || 'Halacha';

      const generated = await generateQuestions(title, subjectName);

      for (let i = 0; i < generated.length; i++) {
        const q = generated[i];
        const [newQ] = await db.insert(questions).values({
          videoId: video.id,
          text: q.question,
          order: i + 1,
        }).returning();

        for (let j = 0; j < q.options.length; j++) {
          await db.insert(questionOptions).values({
            questionId: newQ.id,
            text: q.options[j],
            isCorrect: j === q.correctIndex,
          });
        }
      }
    } catch (err) {
      console.error('Question generation failed:', err);
    }
  }

  return NextResponse.json({ success: true, videoId: video.id });
}
