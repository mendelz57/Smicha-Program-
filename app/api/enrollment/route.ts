import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { phone, dateOfBirth, address, city, state, zip, familyStatus, occupation, torahEducation, shulchanAruchLevel, aboutYourself, mothersHebrewName, fathersHebrewName, referenceRabbi, referencePhone, hearAboutUs } = await req.json();
  if (!phone || !address || !city || !state || !zip || !familyStatus || !occupation || !shulchanAruchLevel || !referenceRabbi || !referencePhone) {
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
  }

  await db.update(users)
    .set({ phone, dateOfBirth, address, city, state, zip, familyStatus, occupation, torahEducation, shulchanAruchLevel, aboutYourself, mothersHebrewName, fathersHebrewName, referenceRabbi, referencePhone, hearAboutUs, profileComplete: true })
    .where(eq(users.id, parseInt(session.user.id)));

  return NextResponse.json({ success: true });
}
