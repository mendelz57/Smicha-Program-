'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Save to DB
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    // Send via Formspree
    await fetch('https://formspree.io/f/xwvdzqnl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
    });
    setSent(true);
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#F6F1E7' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2.5rem', borderBottom: '1px solid rgba(196,145,42,0.2)', background: '#162B22' }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', letterSpacing: '0.05em', color: '#C4912A', textDecoration: 'none' }}>
          Smicha Program
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/login" style={{ color: '#C4D4CC', fontSize: '0.9rem', textDecoration: 'none' }}>Sign In</Link>
          <Link href="/register" style={{ background: '#C4912A', color: '#162B22', padding: '0.5rem 1.25rem', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none' }}>
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div style={{ background: '#162B22', padding: '4rem 2rem 3rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4912A', fontWeight: '600', marginBottom: '1rem' }}>Get in Touch</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '400', color: '#F6F1E7', marginBottom: '1rem' }}>Contact Us</h1>
        <div style={{ width: '2.5rem', height: '2px', background: '#C4912A', margin: '0 auto' }}></div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '4rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>

        {/* Contact info */}
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: '400', color: '#162B22', marginBottom: '1.5rem' }}>We'd love to hear from you</h2>
          <p style={{ color: '#4A5A55', lineHeight: 1.7, marginBottom: '2rem' }}>
            Have a question about the program, need help with your account, or want to learn more? Reach out and we'll get back to you as soon as possible.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ color: '#C4912A', fontSize: '1.1rem', marginTop: '2px' }}>✉</span>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A9A95', fontWeight: '600', marginBottom: '0.25rem' }}>Email</div>
                <a href="mailto:rabbimendel@chabadsola.com" style={{ color: '#162B22', fontWeight: '600', textDecoration: 'none' }}>rabbimendel@chabadsola.com</a>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ color: '#C4912A', fontSize: '1.1rem', marginTop: '2px' }}>◎</span>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A9A95', fontWeight: '600', marginBottom: '0.25rem' }}>Response Time</div>
                <span style={{ color: '#4A5A55' }}>Within 24 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: '#fff', borderTop: '3px solid #C4912A', padding: '2.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✓</div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: '400', color: '#162B22', marginBottom: '0.75rem' }}>Message Sent</h3>
              <p style={{ color: '#4A5A55', lineHeight: 1.6 }}>Thank you for reaching out. We'll be in touch within 24 hours.</p>
              <button onClick={() => setSent(false)} style={{ marginTop: '1.5rem', background: 'none', border: '1px solid #C4912A', color: '#C4912A', padding: '0.6rem 1.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A9A95', fontWeight: '600', marginBottom: '0.4rem' }}>Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ width: '100%', border: '1px solid #D5CFC4', padding: '0.65rem 0.9rem', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A9A95', fontWeight: '600', marginBottom: '0.4rem' }}>Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ width: '100%', border: '1px solid #D5CFC4', padding: '0.65rem 0.9rem', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A9A95', fontWeight: '600', marginBottom: '0.4rem' }}>Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ width: '100%', border: '1px solid #D5CFC4', padding: '0.65rem 0.9rem', fontSize: '0.95rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                style={{ background: '#162B22', color: '#F6F1E7', border: 'none', padding: '0.85rem', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', letterSpacing: '0.02em' }}
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer link */}
      <div style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid #D5CFC4' }}>
        <Link href="/" style={{ color: '#8A9A95', fontSize: '0.9rem', textDecoration: 'none' }}>← Back to Home</Link>
      </div>
    </div>
  );
}
