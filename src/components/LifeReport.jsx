import { useState } from 'react'
import { computePersonality } from '../utils/lifeReport.js'

const SERIF = "'Cormorant Garamond', Georgia, serif"
const SANS  = "'Inter', system-ui, sans-serif"

const COMING_SOON_CATS = [
  { key: 'physical',  label: 'Physical Characteristics', icon: '◈', color: '#94a3b8' },
  { key: 'health',    label: 'Health',                   icon: '◎', color: '#4ade80' },
  { key: 'career',    label: 'Career',                   icon: '⊕', color: '#fb923c' },
  { key: 'love',      label: 'Love Life',                icon: '♀', color: '#f9a8d4' },
  { key: 'marriage',  label: 'Marriage',                 icon: '⊞', color: '#c4b5fd' },
  { key: 'children',  label: 'Children',                 icon: '✶', color: '#6ee7b7' },
]

// ── Expandable section shell ───────────────────────────────────────────────────

function ReportSection({ label, icon, color, subtitle, comingSoon, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid rgba(99,102,241,0.18)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.28)',
        opacity: comingSoon ? 0.52 : 1,
      }}
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left select-none"
        style={{ cursor: comingSoon ? 'default' : 'pointer', background: 'transparent', border: 'none' }}
        onClick={() => !comingSoon && setOpen(o => !o)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span style={{ fontSize: '1rem', color, flexShrink: 0 }}>{icon}</span>
          <div className="min-w-0">
            <p
              className="text-[10px] uppercase tracking-[0.22em] font-semibold"
              style={{ color, marginBottom: subtitle ? '0.2rem' : 0 }}
            >
              {label}
            </p>
            {subtitle && (
              <p
                className="text-xs truncate"
                style={{ color: comingSoon ? 'var(--text-faint)' : 'var(--text-soft)', fontFamily: SANS }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {!comingSoon && (
          <span
            className="text-[11px] shrink-0 ml-2 transition-transform duration-150"
            style={{ color: 'var(--text-muted)', transform: open ? 'rotate(90deg)' : 'none' }}
          >
            ›
          </span>
        )}
      </button>

      {open && !comingSoon && (
        <div
          className="px-5 pb-6 flex flex-col gap-4"
          style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

// ── Personality & Character content ───────────────────────────────────────────

function PersonalityContent({ signDisplay, lordName, lordHouse, baseText, modifierText }) {
  return (
    <>
      {/* Identity chips */}
      <div className="flex flex-wrap gap-2 pt-4">
        <span
          className="text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-[0.1em]"
          style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.28)', color: '#a78bfa' }}
        >
          {signDisplay}
        </span>
        <span
          className="text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-[0.1em]"
          style={{ background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.18)', color: '#c4b5fd' }}
        >
          {lordName} lord · H{lordHouse}
        </span>
      </div>

      {/* Base personality (Lagna sign) */}
      <p style={{ fontFamily: SANS, fontSize: '1rem', color: 'var(--text-body)', lineHeight: 1.78, margin: 0 }}>
        {baseText}
      </p>

      {/* Lord-in-house modifier */}
      <div
        className="rounded-xl px-4 py-3.5"
        style={{ background: 'var(--card-inner)', borderLeft: '2px solid rgba(167,139,250,0.4)' }}
      >
        <p
          className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2"
          style={{ color: '#a78bfa' }}
        >
          {lordName} in House {lordHouse} · How it expresses
        </p>
        <p style={{ fontFamily: SANS, fontSize: '1rem', color: 'var(--text-body)', lineHeight: 1.78, margin: 0 }}>
          {modifierText}
        </p>
      </div>
    </>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function LifeReport({ chart }) {
  const personality = computePersonality(chart)
  const { signDisplay, lordName, lordHouse } = personality

  return (
    <div className="flex flex-col gap-3">
      {/* Section header */}
      <div className="mb-1 px-1">
        <p
          className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-1"
          style={{ color: 'rgba(167,139,250,0.6)' }}
        >
          Full Life Report
        </p>
        <p style={{ fontFamily: SANS, fontSize: '0.8125rem', color: 'var(--text-soft)', lineHeight: 1.6 }}>
          Derived from your D1 birth chart · expand each section to read your interpretation
        </p>
      </div>

      {/* Personality & Character — live */}
      <ReportSection
        label="Personality & Character"
        icon="✦"
        color="#a78bfa"
        subtitle={`${signDisplay} · ${lordName} in H${lordHouse}`}
      >
        <PersonalityContent {...personality} />
      </ReportSection>

      {/* Remaining categories — coming soon */}
      {COMING_SOON_CATS.map(cat => (
        <ReportSection
          key={cat.key}
          label={cat.label}
          icon={cat.icon}
          color={cat.color}
          subtitle="Coming soon"
          comingSoon
        />
      ))}

      <p
        className="text-center text-[8px] uppercase tracking-[0.2em] mt-1"
        style={{ color: 'var(--text-faint)' }}
      >
        Classical Jyotish · whole-sign houses · Lahiri ayanamsha
      </p>
    </div>
  )
}
