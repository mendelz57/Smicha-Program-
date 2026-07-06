'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{ background: '#162B22', borderBottom: '1px solid rgba(196,145,42,0.2)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', letterSpacing: '0.05em', color: '#C4912A', textDecoration: 'none' }}>
          Smicha Program
        </Link>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Desktop links */}
          <Link href="/contact" className="hide-mobile" style={{ color: '#C4D4CC', fontSize: '0.85rem', textDecoration: 'none' }}>Contact</Link>
          <Link href="/login" className="hide-mobile" style={{ color: '#C4D4CC', fontSize: '0.85rem', textDecoration: 'none' }}>Sign In</Link>
          <Link href="/register" style={{ background: '#C4912A', color: '#162B22', padding: '0.45rem 1rem', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Free Trial
          </Link>
          {/* Hamburger button — mobile only */}
          <button
            className="show-mobile"
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: '1px solid rgba(196,145,42,0.4)', color: '#C4912A', padding: '0.35rem 0.6rem', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="show-mobile" style={{ background: '#1E3A2F', borderTop: '1px solid rgba(196,145,42,0.2)', padding: '0.5rem 1.25rem 1rem' }}>
          <Link href="/login" onClick={() => setOpen(false)} style={{ display: 'block', padding: '0.75rem 0', color: '#C4D4CC', fontSize: '0.95rem', textDecoration: 'none', borderBottom: '1px solid rgba(196,145,42,0.15)' }}>
            Sign In
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)} style={{ display: 'block', padding: '0.75rem 0', color: '#C4D4CC', fontSize: '0.95rem', textDecoration: 'none' }}>
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
