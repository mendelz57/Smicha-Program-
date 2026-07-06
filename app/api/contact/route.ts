import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import { contactMessages } from '@/lib/schema';

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Always save to database first
  await db.insert(contactMessages).values({ name, email, message });

  // Send email via Formspree
  try {
    await fetch('https://formspree.io/f/xwvdzqnl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
  } catch (err) {
    console.error('Formspree send failed:', err);
  }

  return NextResponse.json({ success: true });
}
