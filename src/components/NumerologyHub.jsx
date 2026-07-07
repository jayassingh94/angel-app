import { useState } from 'react'

const SERIF = "'Cormorant Garamond', Georgia, serif"
const SANS  = "'Inter', system-ui, sans-serif"

const SUBITEMS = [
  {
    id: 'lifepath',
    label: 'Life Path Number',
    glyph: '◷',
    desc: 'Your core numerological blueprint derived from your date of birth.',
  },
  {
    id: 'namecorrection',
    label: 'Name Numerology',
    glyph: '✎',
    desc: 'How your name\'s vibrational number aligns with your Life Path.',
  },
  {
    id: 'oracle',
    label: 'Angel Numbers',
    glyph: '✦',
    desc: 'Decode the numbers your angels send.',
  },
  {
    id: 'loshu',
    label: 'Lo Shu Grid',
    glyph: '⊞',
    desc: 'Chinese numerology birth grid.',
  },
  {
    id: 'dictionary',
    label: 'Angel Dictionary',
    glyph: '✶',
    desc: 'Meanings for every angel number.',
  },
]

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
        style={{ fontFamily: SERIF, fontSize: '1.05rem', fontWeight: 500, color: card.soon ? '#334155' : '#cbd5e1', lineHeight: 1.2 }}
      >
        {card.label}
      </h3>
      {card.soon ? (
        <span style={{ fontFamily: SANS, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#334155', fontWeight: 600 }}>
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

export default function NumerologyHub({ onNavigate }) {
  return (
    <div className="relative z-10 max-w-3xl mx-auto w-full px-4 sm:px-6 pt-12 pb-20">
      {/* Header */}
      <div className="text-center mb-12">
        <p
          className="mb-3 uppercase"
          style={{ fontFamily: SANS, fontSize: '10px', letterSpacing: '0.32em', color: 'rgba(167,139,250,0.55)', fontWeight: 500 }}
        >
          Numbers &amp; Vibration
        </p>
        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.9rem, 5vw, 2.9rem)', fontWeight: 500, color: '#e2e8f0', lineHeight: 1.1 }}>
          Numerology &amp; Name Correction
        </h1>
        <p style={{ fontFamily: SANS, fontSize: '13px', color: '#475569', marginTop: '0.9rem', lineHeight: 1.7, maxWidth: '380px', margin: '0.9rem auto 0' }}>
          Your Life Path Number, and how your name&apos;s numerology aligns with it.
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3))' }} />
        <span style={{ fontFamily: SANS, fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#334155' }}>Tools</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.3), transparent)' }} />
      </div>

      {/* Sub-card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SUBITEMS.map(item => (
          <Card key={item.id} card={item} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  )
}
