import { useState } from 'react'
import { computeMangalDosha } from '../utils/mangalDosha.js'

const SEVERITY_STYLE = {
  none: {
    label:  'No Mangal Dosha',
    color:  '#4ade80',
    bg:     'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.25)',
  },
  mild: {
    label:  'Mild Mangal Dosha',
    color:  '#fb923c',
    bg:     'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.28)',
  },
  significant: {
    label:  'Mangal Dosha',
    color:  '#f87171',
    bg:     'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.28)',
  },
}

export default function MangalDosha({ chart }) {
  const [expanded, setExpanded] = useState(false)
  const result = computeMangalDosha(chart)
  if (!result) return null

  const {
    hasDosha, severity, fromLagna, fromMoon,
    marsHouseFromLagna, marsHouseFromMoon, marsSign, explanation,
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
      {/* ── Header row (always visible, click to expand) ── */}
      <div
        className="flex items-center justify-between gap-3 cursor-pointer select-none"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-[0.22em] text-indigo-400/70 font-semibold">
            Doshas
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-300">Mangal Dosha</span>
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide"
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

      {/* ── Expanded detail ── */}
      {expanded && (
        <div className="flex flex-col gap-4 mt-4">
          {/* From-Lagna / From-Moon / Mars-sign chips */}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'From Lagna', active: fromLagna, house: marsHouseFromLagna },
              { label: 'From Moon',  active: fromMoon,  house: marsHouseFromMoon  },
            ].map(({ label, active, house }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                style={{
                  background: active ? 'rgba(248,113,113,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? 'rgba(248,113,113,0.28)' : 'rgba(255,255,255,0.07)'}`,
                }}
              >
                <span
                  className="text-[8px]"
                  style={{ color: active ? '#f87171' : '#334155' }}
                >
                  {active ? '●' : '○'}
                </span>
                <span
                  className="text-[10px] font-mono"
                  style={{ color: active ? '#f87171' : '#334155' }}
                >
                  {label}
                </span>
                <span className="text-[9px] font-mono text-slate-700">
                  H{house}
                </span>
              </div>
            ))}

            {/* Mars sign chip */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <span className="text-[11px]" style={{ color: '#f87171' }}>♂</span>
              <span className="text-[10px] font-mono text-slate-500">
                Mars in {marsSign}
              </span>
            </div>
          </div>

          {/* Explanation */}
          <p className="text-[11.5px] text-slate-400 leading-relaxed">{explanation}</p>

          {/* Footer reference */}
          <div
            className="pt-3 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}
          >
            <p className="text-[8px] uppercase tracking-[0.2em] text-slate-800 mb-1">
              Dosha-activating houses
            </p>
            <p className="text-[9px] font-mono text-slate-800">
              1 · 2 · 4 · 7 · 8 · 12 &nbsp;(checked from Lagna &amp; Moon)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
