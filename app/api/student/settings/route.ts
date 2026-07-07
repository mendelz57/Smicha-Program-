import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = parseInt(session.user.id);
  const { name, email, currentPassword, newPassword, phone, address, city, state, zip, dateOfBirth } = await req.json();

  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const updates: any = {};

  if (name) updates.name = name;
  if (email && email !== user.email) {
    const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (existing) return NextResponse.json({ error: 'Email already in use.' }, { status: 400 });
    updates.email = email;
  }
  if (phone !== undefined) updates.phone = phone;
  if (address !== undefined) updates.address = address;
  if (city !== undefined) updates.city = city;
  if (state !== undefined) updates.state = state;
  if (zip !== undefined) updates.zip = zip;
  if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth;

  if (newPassword) {
    if (!currentPassword) return NextResponse.json({ error: 'Enter your current password to set a new one.' }, { status: 400 });
    if (user.password) {
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }
    updates.password = await bcrypt.hash(newPassword, 10);
  }

  await db.update(users).set(updates).where(eq(users.id, userId));
  return NextResponse.json({ success: true });
}
