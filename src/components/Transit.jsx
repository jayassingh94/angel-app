import { useState, useEffect } from 'react'
import { computeTransits, SIGN_EN } from '../utils/transit.js'
import { transitInterpretations, sadeSatiInterpretations } from '../utils/transitInterpretations.js'

const NATURE_STYLE = {
  favorable:   { label: 'Favorable',   color: '#4ade80', bg: 'rgba(74,222,128,0.08)',   border: 'rgba(74,222,128,0.25)' },
  neutral:     { label: 'Neutral',     color: '#94a3b8', bg: 'rgba(148,163,184,0.06)', border: 'rgba(148,163,184,0.18)' },
  challenging: { label: 'Challenging', color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)' },
}

const SADE_SATI_PHASE_LABEL = { rising: 'Rising Phase', peak: 'Peak Phase', setting: 'Setting Phase' }

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export default function Transit({ swe, natalMoonRashi }) {
  const [dateStr,        setDateStr]        = useState(todayISO)
  const [transits,       setTransits]       = useState(null)
  const [expandedPlanet, setExpandedPlanet] = useState(null)

  useEffect(() => {
    if (!swe) return
    const [y, m, d] = dateStr.split('-').map(Number)
    // Use 6:00 UTC (≈ noon IST) so the date matches the user's local day
    const date = new Date(Date.UTC(y, m - 1, d, 6, 0, 0))
    setTransits(computeTransits(swe, date, natalMoonRashi))
  }, [swe, natalMoonRashi, dateStr])

  if (!transits) return null

  const natalMoonSign = SIGN_EN[natalMoonRashi]
  const sadeSati      = transits.find(t => t.isSadeSati)

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: 'rgba(10,8,28,0.85)',
        border: '1px solid rgba(99,102,241,0.18)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-indigo-400/70 font-semibold">
            Gochar · Transit
          </p>
          <p className="text-sm font-semibold text-slate-300 mt-0.5">
            Planetary Transits
            <span className="text-slate-600 font-normal text-xs ml-2">
              from natal Moon in {natalMoonSign}
            </span>
          </p>
        </div>
        <input
          type="date"
          value={dateStr}
          onChange={e => setDateStr(e.target.value)}
          className="text-[11px] font-mono px-2.5 py-1.5 rounded-lg outline-none"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(99,102,241,0.2)',
            color: '#94a3b8',
            colorScheme: 'dark',
          }}
        />
      </div>

      {/* ── Sade Sati banner ── */}
      {sadeSati && (
        <div
          className="rounded-xl px-4 py-3 flex flex-col gap-2"
          style={{
            background: 'rgba(94,90,180,0.12)',
            border: '1px solid rgba(148,130,240,0.32)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[13px]" style={{ color: '#a78bfa' }}>♄</span>
            <p
              className="text-xs uppercase tracking-[0.22em] font-bold"
              style={{ color: '#a78bfa' }}
            >
              Sade Sati · {SADE_SATI_PHASE_LABEL[sadeSati.sadeSatiPhase]}
            </p>
          </div>
          <p className="text-base text-slate-400 leading-relaxed">
            {sadeSatiInterpretations[sadeSati.sadeSatiPhase]}
          </p>
        </div>
      )}

      {/* ── Transit rows ── */}
      <div className="flex flex-col gap-0.5">
        {transits.map(t => {
          const sty       = NATURE_STYLE[t.nature]
          const interp    = transitInterpretations[t.name]?.[t.nature]
          const isOpen    = expandedPlanet === t.name

          return (
            <div key={t.name}>
              <div
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer select-none transition-colors"
                style={{ background: isOpen ? 'rgba(255,255,255,0.03)' : 'transparent' }}
                onClick={() => setExpandedPlanet(isOpen ? null : t.name)}
              >
                {/* Planet symbol */}
                <span className="text-[15px] w-5 text-center shrink-0" style={{ color: t.color }}>
                  {t.symbol}
                </span>

                {/* Name + transit sign */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-300">{t.name}</span>
                  <span className="text-xs text-slate-600 ml-1.5">
                    {t.transitSymbol} {t.transitSign}
                  </span>
                </div>

                {/* House from Moon */}
                <span className="text-xs font-mono text-slate-700 shrink-0">
                  H{t.houseFromMoon} ☽
                </span>

                {/* Nature badge */}
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full tracking-wide shrink-0"
                  style={{ background: sty.bg, border: `1px solid ${sty.border}`, color: sty.color }}
                >
                  {sty.label}
                </span>

                {/* Chevron */}
                <span
                  className="text-slate-700 text-xs shrink-0"
                  style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}
                >
                  ›
                </span>
              </div>

              {/* Expanded interpretation */}
              {isOpen && interp && (
                <div
                  className="mx-3 mb-1.5 px-3 py-2.5 rounded-lg"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    borderLeft: `2px solid ${t.color}30`,
                  }}
                >
                  <p className="text-sm text-slate-500 leading-relaxed">{interp}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs uppercase tracking-[0.18em] text-slate-800 text-center">
        Classical Vedic Gochar · houses from natal Moon · Lahiri ayanamsha
      </p>
    </div>
  )
}
