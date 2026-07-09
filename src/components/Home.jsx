import { useState } from 'react'

const SERIF = "'Cormorant Garamond', Georgia, serif"
const SANS  = "'Inter', system-ui, sans-serif"

const CATEGORIES = [
  {
    id: 'astrology',
    heading: 'Vedic Astrology',
    cards: [
      {
        id: 'kundali',
        label: 'Vedic Kundali',
        glyph: '⊕',
        desc: 'Birth chart · Mahadasha · Doshas · Transits · D9',
        badge: 'Core',
        featured: true,
      },
      {
        id: 'numerology-hub',
        label: 'Numerology & Name Correction',
        glyph: '∑',
        desc: 'Your Life Path Number, and how your name\'s numerology aligns with it.',
      },
      {
        id: 'vastu',
        label: 'Vastu Check',
        glyph: '⌂',
        desc: 'Space & directional energy analysis',
      },
      {
        id: null,
        label: 'Talk to Astrologer',
        glyph: '◎',
        desc: 'Live Vedic guidance session',
        soon: true,
      },
    ],
  },
  {
    id: 'numerology',
    heading: 'Numerology',
    cards: [
      {
        id: 'oracle',
        label: 'Angel Numbers',
        glyph: '✦',
        desc: 'Decode the numbers your angels send',
      },
      {
        id: 'loshu',
        label: 'Lo Shu Grid',
        glyph: '⊞',
        desc: 'Chinese numerology birth grid',
      },
      {
        id: 'dictionary',
        label: 'Angel Dictionary',
        glyph: '✶',
        desc: 'Meanings for every angel number',
      },
    ],
  },
  {
    id: 'practice',
    heading: 'Daily Practice',
    cards: [
      {
        id: 'oracle',
        label: 'Daily Oracle',
        glyph: '✧',
        desc: "Today's channeled message & guidance",
      },
      {
        id: 'chakra',
        label: 'Chakra Sounds',
        glyph: '◎',
        desc: 'Healing frequencies for each energy centre',
      },
      {
        id: 'alignment',
        label: 'Chakra Alignment',
        glyph: '◈',
        desc: 'Guided balancing & chakra check',
      },
    ],
  },
]

function FeaturedCard({ card, onNavigate }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      className="col-span-1 sm:col-span-2 text-left rounded-2xl p-6 relative overflow-hidden transition-all duration-300 w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onNavigate(card.id)}
      style={{
        background: hovered
          ? 'linear-gradient(135deg, rgba(79,70,229,0.38) 0%, rgba(124,58,237,0.38) 60%, rgba(168,85,247,0.28) 100%)'
          : 'linear-gradient(135deg, rgba(79,70,229,0.22) 0%, rgba(124,58,237,0.22) 60%, rgba(168,85,247,0.16) 100%)',
        border: `1px solid ${hovered ? 'rgba(139,92,246,0.55)' : 'rgba(139,92,246,0.28)'}`,
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered
          ? '0 16px 48px rgba(124,58,237,0.35), 0 0 0 1px rgba(139,92,246,0.15)'
          : '0 4px 20px rgba(0,0,0,0.35)',
        cursor: 'pointer',
      }}
    >
      {/* Core badge */}
      <span
        className="absolute top-4 right-4 text-[8.5px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full"
        style={{
          background: 'rgba(139,92,246,0.22)',
          border: '1px solid rgba(139,92,246,0.45)',
          color: '#a78bfa',
          fontFamily: SANS,
        }}
      >
        {card.badge}
      </span>

      {/* Glyph */}
      <div className="text-4xl mb-4" style={{ color: '#a78bfa' }}>{card.glyph}</div>

      {/* Title */}
      <h3
        className="mb-2"
        style={{ fontFamily: SERIF, fontSize: '1.4rem', fontWeight: 500, color: '#e2e8f0', lineHeight: 1.15 }}
      >
        {card.label}
      </h3>

      {/* Desc */}
      <p style={{ fontFamily: SANS, fontSize: '11.5px', color: '#64748b', lineHeight: 1.6 }}>
        {card.desc}
      </p>
    </button>
  )
}

function Card({ card, onNavigate }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      className="text-left rounded-2xl p-5 relative overflow-hidden transition-all duration-300 w-full"
      onMouseEnter={() => !card.soon && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !card.soon && onNavigate(card.id)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.028)',
        border: `1px solid ${hovered ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`,
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 10px 28px rgba(99,102,241,0.22)' : '0 2px 8px rgba(0,0,0,0.3)',
        cursor: card.soon ? 'not-allowed' : 'pointer',
        opacity: card.soon ? 0.42 : 1,
      }}
    >
      <div className="text-xl mb-3" style={{ color: card.soon ? '#334155' : '#818cf8' }}>
        {card.glyph}
      </div>
      <h3
        className="mb-1.5"
        style={{
          fontFamily: SERIF,
          fontSize: '1.05rem',
          fontWeight: 500,
          color: card.soon ? '#334155' : '#cbd5e1',
          lineHeight: 1.2,
        }}
      >
        {card.label}
      </h3>
      {card.soon ? (
        <span
          style={{ fontFamily: SANS, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#334155', fontWeight: 600 }}
        >
          Coming Soon
        </span>
      ) : (
        <p style={{ fontFamily: SANS, fontSize: '11px', color: '#475569', lineHeight: 1.55 }}>
          {card.desc}
        </p>
      )}
    </button>
  )
}

export default function Home({ onNavigate }) {
  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      {/* ── Top bar ── */}
      <div
        className="sticky top-0 z-40 px-5 sm:px-8 py-3.5 flex items-center justify-between"
        style={{
          background: 'rgba(6,4,18,0.82)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <span style={{ fontFamily: SERIF, color: '#a78bfa', fontSize: '1.15rem', fontWeight: 500, letterSpacing: '0.06em' }}>
          ✦ Angel App
        </span>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs select-none"
          style={{
            background: 'rgba(139,92,246,0.12)',
            border: '1px solid rgba(139,92,246,0.22)',
            color: '#6366f1',
          }}
        >
          ◎
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="px-6 pt-16 pb-12 text-center flex flex-col items-center">
        <p
          className="mb-5 uppercase"
          style={{ fontFamily: SANS, fontSize: '10px', letterSpacing: '0.35em', color: 'rgba(167,139,250,0.55)', fontWeight: 500 }}
        >
          Your Cosmic Companion
        </p>
        <h1
          className="mb-5"
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(2.4rem, 7vw, 3.8rem)',
            fontWeight: 500,
            lineHeight: 1.08,
            maxWidth: '640px',
          }}
        >
          <span className="shimmer-text">The Universe<br />Is Always Speaking</span>
        </h1>
        <p
          style={{
            fontFamily: SANS,
            fontSize: '13px',
            color: '#475569',
            lineHeight: 1.7,
            maxWidth: '360px',
          }}
        >
          Astrology, numerology &amp; daily practice — tools for those who listen.
        </p>
      </div>

      {/* ── Categories ── */}
      <div className="px-4 sm:px-6 pb-20 flex flex-col gap-14 max-w-3xl mx-auto w-full">
        {CATEGORIES.map(cat => (
          <section key={cat.id}>
            {/* Heading + divider */}
            <div className="flex items-center gap-4 mb-5">
              <h2
                className="shrink-0"
                style={{
                  fontFamily: SANS,
                  fontSize: '10px',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: '#475569',
                }}
              >
                {cat.heading}
              </h2>
              <div
                className="flex-1 h-px"
                style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.35), transparent)' }}
              />
            </div>

            {/* Card grid */}
            <div className={`grid gap-3 ${cat.id === 'astrology' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
              {cat.cards.map((card, i) =>
                card.featured ? (
                  <FeaturedCard key={i} card={card} onNavigate={onNavigate} />
                ) : (
                  <Card key={i} card={card} onNavigate={onNavigate} />
                )
              )}
            </div>
          </section>
        ))}
      </div>

      {/* ── Footer ── */}
      <p
        className="text-center pb-10"
        style={{ fontFamily: SANS, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1e293b' }}
      >
        Trust the signs ✦ The universe is always speaking
      </p>
    </div>
  )
}
