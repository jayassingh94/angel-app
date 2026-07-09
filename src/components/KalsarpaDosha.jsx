import { useState } from 'react'
import { computeKalsarpaDosha } from '../utils/kalsarpaDosha.js'

const SEVERITY_STYLE = {
  none: {
    label:  'No Kalsarpa Dosha',
    color:  '#4ade80',
    bg:     'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.25)',
  },
  partial: {
    label:  'Partial Kalsarpa Dosha',
    color:  '#fb923c',
    bg:     'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.28)',
  },
  full: {
    label:  'Kalsarpa Dosha',
    color:  '#f87171',
    bg:     'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.28)',
  },
}

export default function KalsarpaDosha({ chart }) {
  const [expanded, setExpanded] = useState(false)
  const result = computeKalsarpaDosha(chart)
  if (!result) return null

  const {
    hasDosha, severity, fullName,
    rahuHouse, ketuHouse, rahuSign, ketuSign,
    explanation,
  } = result

  const sty = SEVERITY_STYLE[severity]

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-0"
      style={{
        background: 'rgba(10,8,28,0.85)',
        border: '1px solid rgba(99,102,241,0.18)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div
        className="flex items-center justify-between gap-3 cursor-pointer select-none"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.22em] text-indigo-400/70 font-semibold">
            Kalsarpa Dosha
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {hasDosha && fullName && (
              <span className="text-sm font-semibold text-slate-300">{fullName}</span>
            )}
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full tracking-wide"
              style={{ background: sty.bg, border: `1px solid ${sty.border}`, color: sty.color }}
            >
              {sty.label}
            </span>
          </div>
        </div>
        <span
          className="text-slate-600 text-[11px] shrink-0 transition-transform duration-150"
          style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}
        >
          ›
        </span>
      </div>

      {expanded && (
        <div className="flex flex-col gap-4 mt-4">
          {/* Rahu / Ketu position chips */}
          <div className="flex gap-2 flex-wrap">
            {[
              { symbol: '☊', label: 'Rahu', house: rahuHouse, sign: rahuSign, active: hasDosha, nodeColor: '#a78bfa' },
              { symbol: '☋', label: 'Ketu', house: ketuHouse, sign: ketuSign, active: hasDosha, nodeColor: '#6ee7b7' },
            ].map(({ symbol, label, house, sign, active, nodeColor }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                style={{
                  background: active ? `${nodeColor}14` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? `${nodeColor}48` : 'rgba(255,255,255,0.07)'}`,
                }}
              >
                <span className="text-[11px]" style={{ color: active ? nodeColor : '#334155' }}>{symbol}</span>
                <span className="text-xs font-mono" style={{ color: active ? nodeColor : '#334155' }}>
                  {label} H{house}
                </span>
                <span className="text-[9px] text-slate-700">{sign}</span>
              </div>
            ))}
          </div>

          <p className="text-base text-slate-400 leading-relaxed">{explanation}</p>

          <div className="pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-800 mb-1">How it's checked</p>
            <p className="text-xs text-slate-800">
              All 7 planets (Sun–Saturn) must be hemmed between Rahu and Ketu on one side of the axis.
              A planet sharing a sign with a node is treated as a partial cancellation.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
