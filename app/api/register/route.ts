import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.insert(users).values({
    name,
    email,
    password: hashed,
    role: 'student',
    plan: 'trial',
    trialEndsAt,
  });

  await fetch('https://formspree.io/f/xwvdzqnl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      name: 'New Student Registration',
      email: email,
      message: `${name} just created an account and started their free trial.`,
    }),
  }).catch(() => {});

  return NextResponse.json({ success: true });
}
