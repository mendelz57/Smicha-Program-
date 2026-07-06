import { db } from '../lib/db';
import { videos, questions, questionOptions, chapters, subjects } from '../lib/schema';
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
  if (!jsonMatch) throw new Error('Failed to parse questions from AI response');
  return JSON.parse(jsonMatch[0]);
}

async function main() {
  const allVideos = await db.query.videos.findMany({ orderBy: (v, { asc }) => [asc(v.id)] });

  for (const video of allVideos) {
    // Check if questions already exist
    const existing = await db.query.questions.findMany({ where: eq(questions.videoId, video.id) });
    if (existing.length > 0) {
      console.log(`Skipping video ${video.id} "${video.title}" — already has ${existing.length} questions`);
      continue;
    }

    console.log(`Generating questions for video ${video.id}: "${video.title}"...`);

    try {
      const chapter = await db.query.chapters.findFirst({ where: eq(chapters.id, video.chapterId) });
      const subject = chapter ? await db.query.subjects.findFirst({ where: eq(subjects.id, chapter.subjectId) }) : null;
      const subjectName = subject?.name || 'Basar Bechalav';

      const generated = await generateQuestions(video.title, subjectName);

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

      console.log(`  ✓ ${generated.length} questions saved`);
    } catch (err) {
      console.error(`  ✗ Failed for video ${video.id}:`, err);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
