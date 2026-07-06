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

  // Try to send email
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Smicha Program <onboarding@resend.dev>',
      to: 'mandmzajac@gmail.com',
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
      html: `
        <h2>New message from the Smicha Program contact form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });
  } catch (err) {
    console.error('Email send failed:', err);
    // Still return success — message is saved to DB
  }

  return NextResponse.json({ success: true });
}
