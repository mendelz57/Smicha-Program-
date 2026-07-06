import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'Smicha Program <onboarding@resend.dev>',
    to: 'rabbimendel@chabadsola.com',
    subject: `New Contact Form Message from ${name}`,
    html: `
      <h2>New message from the Smicha Program contact form</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  });

  return NextResponse.json({ success: true });
}
