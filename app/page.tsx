import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    if ((session.user as any)?.role === 'admin') redirect('/admin');
    redirect('/student');
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'system-ui, sans-serif', background: '#F6F1E7' }}>
      {/* Hero */}
      <div style={{ background: '#162B22', color: '#F6F1E7', padding: '0' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(196,145,42,0.2)' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', letterSpacing: '0.05em', color: '#C4912A' }}>
            Smicha Program
          </span>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href="/contact" className="hide-mobile" style={{ color: '#C4D4CC', fontSize: '0.85rem', textDecoration: 'none' }}>Contact</Link>
            <Link href="/login" className="hide-mobile" style={{ color: '#C4D4CC', fontSize: '0.85rem', textDecoration: 'none' }}>Sign In</Link>
            <Link href="/register" style={{ background: '#C4912A', color: '#162B22', padding: '0.45rem 1rem', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Free Trial
            </Link>
          </div>
        </nav>

        <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center', padding: '6rem 2rem 5rem' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '5rem', color: '#C4912A', lineHeight: 1, marginBottom: '1.5rem', opacity: 0.6 }}>ס</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: '400', lineHeight: 1.15, textWrap: 'balance', marginBottom: '1.5rem', color: '#F6F1E7' }}>
            An Online Smicha Program<br />with Animated Videos, Charts<br />& Weekly Live Shiurim
          </h1>
          <div style={{ width: '3rem', height: '2px', background: '#C4912A', margin: '0 auto 1.75rem' }}></div>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.7, color: '#A8C0B8', maxWidth: '560px', margin: '0 auto 2.5rem' }}>
            Master the four core areas of practical Halacha: Basar Bechalav, Taruvos, Hagalas Kelim, and Hilchos Shabbos, through animated video lessons, visual charts, and an optional weekly live shiur. Finish your Smicha in as little as one year.
          </p>
          <Link href="/register" style={{ display: 'inline-block', background: '#C4912A', color: '#162B22', padding: '0.9rem 2.5rem', fontWeight: '700', fontSize: '1rem', textDecoration: 'none', letterSpacing: '0.02em' }}>
            Begin Your Free 7-Day Trial
          </Link>
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#6A8880' }}>No commitment during your trial. $300/month after.</p>
        </div>
      </div>

      {/* Two offerings */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '5rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <div style={{ background: '#fff', borderTop: '3px solid #162B22', padding: '2.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4912A', fontWeight: '600', marginBottom: '1rem' }}>The Program</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: '400', color: '#162B22', marginBottom: '1rem', lineHeight: 1.2 }}>World-Class Instruction</h2>
          <p style={{ color: '#4A5A55', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Shiurim are given by Rabbi Mendel Zajac of Los Angeles, California. Tests are administered by Rabbi Chazan and Rabbi Tauber.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {['Shiurim by Rabbi Mendel Zajac', 'Tests by Rabbi Chazan and Rabbi Tauber', '15-question quiz per video', '80% passing score to advance'].map(item => (
              <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#3A4A45' }}>
                <span style={{ color: '#C4912A', marginTop: '2px', flexShrink: 0 }}>✦</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ background: '#162B22', borderTop: '3px solid #C4912A', padding: '2.5rem' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4912A', fontWeight: '600', marginBottom: '1rem' }}>Live Learning</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: '400', color: '#F6F1E7', marginBottom: '1rem', lineHeight: 1.2 }}>Weekly Live Shiur</h2>
          <p style={{ color: '#A8C0B8', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Join a live weekly shiur with your cohort. Ask questions, review difficult sugyos, and learn alongside other students in real time. Details provided upon enrollment.
          </p>
          <Link href="/register" style={{ display: 'inline-block', border: '1px solid #C4912A', color: '#C4912A', padding: '0.7rem 1.75rem', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none', letterSpacing: '0.02em' }}>
            Enroll to Join
          </Link>
        </div>
      </div>

      {/* Sample Video */}
      <div style={{ background: '#F6F1E7', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4912A', fontWeight: '600', marginBottom: '1rem' }}>Sample Class</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: '400', color: '#162B22', marginBottom: '0.75rem' }}>Watch the First Smicha Shiur</h2>
          <div style={{ width: '2.5rem', height: '2px', background: '#C4912A', margin: '0 auto 2rem' }}></div>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
            <iframe
              src="https://www.youtube.com/embed/MCva_JO_dzY"
              title="First Smicha Shiur"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div style={{ background: '#162B22', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4912A', fontWeight: '600', marginBottom: '1rem' }}>Curriculum</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: '400', color: '#F6F1E7', marginBottom: '3rem' }}>Four Core Areas of Halacha</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1px', background: 'rgba(196,145,42,0.2)', direction: 'rtl' }}>
            {[
              { heb: 'בשר בחלב', eng: 'Basar Bechalav' },
              { heb: 'תערובות', eng: 'Taruvos' },
              { heb: 'הגעלת כלים', eng: 'Hagalas Kelim' },
              { heb: 'שבת', eng: 'Hilchos Shabbos' },
            ].map(subject => (
              <div key={subject.eng} style={{ background: '#162B22', padding: '2rem 1.5rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#C4912A', marginBottom: '0.5rem', direction: 'rtl' }}>{subject.heb}</div>
                <div style={{ fontSize: '0.85rem', color: '#A8C0B8', letterSpacing: '0.03em' }}>{subject.eng}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#F6F1E7' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: '400', color: '#162B22', marginBottom: '1rem' }}>Ready to begin?</h2>
        <p style={{ color: '#4A5A55', marginBottom: '2rem', fontSize: '1rem' }}>Start with a free 7-day trial. No credit card required.</p>
        <Link href="/register" style={{ display: 'inline-block', background: '#162B22', color: '#F6F1E7', padding: '0.9rem 2.5rem', fontWeight: '700', fontSize: '1rem', textDecoration: 'none', letterSpacing: '0.02em' }}>
          Start Free Trial
        </Link>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#8A9A95' }}>
          Already enrolled?{' '}
          <Link href="/login" style={{ color: '#162B22', fontWeight: '600', textDecoration: 'underline' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
