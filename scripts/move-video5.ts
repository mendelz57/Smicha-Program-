import { db } from '../lib/db';
import { videos } from '../lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  // Move video id=5 from chapter 1 (סימן פז) to chapter 4 (סימן פח), order 1
  await db.update(videos)
    .set({ chapterId: 4, order: 1 })
    .where(eq(videos.id, 5));
  console.log('Done — video 5 moved to סימן פח');
}

main().catch(console.error);
