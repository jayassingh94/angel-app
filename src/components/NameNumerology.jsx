import { useState } from 'react'
import { computeLifePath, computeNameNumber, COMPATIBLE, generateSuggestions } from '../utils/numerologyCalc.js'
import { lifePathInterpretations, nameNumberInterpretations } from '../utils/numerologyInterpretations.js'

const SERIF = "'Cormorant Garamond', Georgia, serif"
const SANS  = "'Inter', system-ui, sans-serif"

const MONTHS = ['January','February','March','April','May','June',
                 'July','August','September','October','November','December']
const DAYS   = Array.from({ length: 31 }, (_, i) => i + 1)
const YEARS  = Array.from({ length: 126 }, (_, i) => 2025 - i)

const MASTER_LABEL = { 11: 'Master Number', 22: 'Master Number', 33: 'Master Number' }

const selectStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(99,102,241,0.22)',
  color: '#94a3b8',
  borderRadius: '0.75rem',
  padding: '0.6rem 0.75rem',
  fontFamily: SANS,
  fontSize: '1rem',
  outline: 'none',
  appearance: 'none',
  cursor: 'pointer',
}

function alignmentLabel(lifePath, nameNum) {
  if (lifePath == null || nameNum == null) return null
  const compatible = COMPATIBLE[lifePath] ?? new Set()
  if (!compatible.has(nameNum)) return 'neutral'
  // 4+8 / 8+4 combinations are traditionally "reflect on"
  if ((nameNum === 4 || nameNum === 8) && (lifePath === 4 || lifePath === 8 || lifePath === 22)) return 'reflect'
  return 'harmonious'
}

const ALIGN_STYLE = {
  harmonious: { label: 'Harmonious Alignment', color: '#4ade80', bg: 'rgba(74,222,128,0.07)', border: 'rgba(74,222,128,0.22)' },
  neutral:    { label: 'Neutral Alignment',    color: '#94a3b8', bg: 'rgba(148,163,184,0.06)', border: 'rgba(148,163,184,0.18)' },
  reflect:    { label: 'Worth Reflecting On',  color: '#fb923c', bg: 'rgba(251,146,60,0.07)',  border: 'rgba(251,146,60,0.22)' },
}

function NumberCard({ label, number, isMaster }) {
  return (
    <div className="flex items-center gap-4 rounded-xl p-4"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,102,241,0.15)' }}>
      <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.28), rgba(124,58,237,0.28))', border: '1px solid rgba(139,92,246,0.3)' }}>
        <span style={{ fontFamily: SERIF, fontSize: '1.9rem', fontWeight: 600, color: '#c4b5fd' }}>{number}</span>
      </div>
      <div>
        {isMaster && (
          <span className="inline-block mb-1 text-[8px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(139,92,246,0.18)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa', fontFamily: SANS }}>
            Master Number
          </span>
        )}
        <p style={{ fontFamily: SANS, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4f5d7a', fontWeight: 600 }}>{label}</p>
        <p style={{ fontFamily: SERIF, fontSize: '1.15rem', color: '#e2e8f0', fontWeight: 500, marginTop: '0.15rem' }}>
          {label.split(' ')[0]} {number}
        </p>
      </div>
    </div>
  )
}

function SuggestionCard({ suggestion, lifePath }) {
  const interp = nameNumberInterpretations[suggestion.nameNumber]
  // Trim theme to a readable snippet
  const snippet = interp?.theme?.slice(0, 110).trimEnd() + (interp?.theme?.length > 110 ? '…' : '')
  return (
    <div className="rounded-xl p-4 flex flex-col gap-2.5"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(99,102,241,0.18)' }}>
      {/* Spelling + number badge */}
      <div className="flex items-center justify-between gap-3">
        <span style={{ fontFamily: SERIF, fontSize: '1.2rem', fontWeight: 500, color: '#e2e8f0' }}>
          {suggestion.spelling}
        </span>
        <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ade80', fontFamily: SANS, letterSpacing: '0.1em' }}>
          № {suggestion.nameNumber}
        </span>
      </div>
      {/* Reason */}
      <p style={{ fontFamily: SANS, fontSize: '1rem', color: '#64748b', lineHeight: 1.6 }}>
        {snippet}
      </p>
      <p style={{ fontFamily: SANS, fontSize: '0.75rem', color: '#334155', lineHeight: 1.5 }}>
        Name Number {suggestion.nameNumber} is compatible with Life Path {lifePath}.
      </p>
    </div>
  )
}

export default function NameNumerology() {
  const [name,        setName]        = useState('')
  const [day,         setDay]         = useState('')
  const [month,       setMonth]       = useState('')
  const [year,        setYear]        = useState('')
  const [nameNum,     setNameNum]     = useState(null)
  const [lifePath,    setLifePath]    = useState(null)
  const [suggestions, setSuggestions] = useState(null)

  function calculate() {
    const nn = name.trim() ? computeNameNumber(name) : null
    const lp = (day && month && year) ? computeLifePath(Number(day), Number(month), Number(year)) : null
    setNameNum(nn)
    setLifePath(lp)
    setSuggestions(nn != null && lp != null ? generateSuggestions(name.trim(), lp) : null)
  }

  const ready      = name.trim().length > 0
  const nnInterp   = nameNum   != null ? nameNumberInterpretations[nameNum]  : null
  const lpInterp   = lifePath  != null ? lifePathInterpretations[lifePath]   : null
  const align      = alignmentLabel(lifePath, nameNum)
  const alignSty   = align ? ALIGN_STYLE[align] : null
  const isAlreadyHarmonious = align === 'harmonious'

  return (
    <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 pt-12 pb-20 flex flex-col gap-6">
      {/* Header */}
      <div className="text-center mb-2">
        <p className="mb-3 uppercase"
          style={{ fontFamily: SANS, fontSize: '0.75rem', letterSpacing: '0.32em', color: 'rgba(167,139,250,0.55)', fontWeight: 500 }}>
          Name Correction
        </p>
        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.9rem, 5vw, 2.8rem)', fontWeight: 500, color: '#e2e8f0', lineHeight: 1.1 }}>
          Name Numerology
        </h1>
        <p style={{ fontFamily: SANS, fontSize: '1rem', color: '#475569', marginTop: '0.75rem', lineHeight: 1.7 }}>
          How your name&apos;s vibrational number aligns with your Life Path.
        </p>
      </div>

      {/* Form */}
      <div className="rounded-2xl p-6 flex flex-col gap-5"
        style={{ background: 'rgba(10,8,28,0.85)', border: '1px solid rgba(99,102,241,0.18)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>

        <div className="flex flex-col gap-1.5">
          <label style={{ fontFamily: SANS, fontSize: '0.75rem', color: '#475569', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
            Full Name <span style={{ color: '#334155', fontWeight: 400 }}>(as used in daily life)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
            style={{ ...selectStyle, padding: '0.65rem 0.85rem', fontSize: '1rem', color: name ? '#e2e8f0' : '#334155' }}
          />
        </div>

        <div>
          <p style={{ fontFamily: SANS, fontSize: '0.75rem', color: '#334155', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.75rem' }}>
            Date of Birth <span style={{ fontWeight: 400, letterSpacing: '0.05em' }}>· optional — adds Life Path alignment &amp; spelling suggestions</span>
          </p>
          <div className="grid grid-cols-3 gap-3">
            <select value={day}   onChange={e => setDay(e.target.value)}   style={selectStyle}>
              <option value="">Day</option>
              {DAYS.map(d => <option key={d} value={d}>{String(d).padStart(2,'0')}</option>)}
            </select>
            <select value={month} onChange={e => setMonth(e.target.value)} style={selectStyle}>
              <option value="">Month</option>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
            <select value={year}  onChange={e => setYear(e.target.value)}  style={selectStyle}>
              <option value="">Year</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={calculate}
          disabled={!ready}
          className="w-full py-3 rounded-xl font-semibold transition-all"
          style={{
            fontFamily: SANS,
            fontSize: '1rem',
            letterSpacing: '0.12em',
            background: !ready ? 'rgba(99,102,241,0.15)' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            color: !ready ? '#334155' : '#fff',
            border: 'none',
            cursor: !ready ? 'not-allowed' : 'pointer',
            boxShadow: !ready ? 'none' : '0 4px 20px rgba(124,58,237,0.4)',
          }}
        >
          Calculate
        </button>
      </div>

      {/* Results */}
      {(nameNum != null || lifePath != null) && (
        <div className="rounded-2xl p-6 flex flex-col gap-5"
          style={{ background: 'rgba(10,8,28,0.85)', border: '1px solid rgba(99,102,241,0.22)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>

          <div className="flex flex-col sm:flex-row gap-3">
            {nameNum   != null && <div className="flex-1"><NumberCard label="Name Number" number={nameNum}  isMaster={!!MASTER_LABEL[nameNum]}  /></div>}
            {lifePath  != null && <div className="flex-1"><NumberCard label="Life Path"   number={lifePath} isMaster={!!MASTER_LABEL[lifePath]} /></div>}
          </div>

          {align && alignSty && (
            <div className="rounded-xl px-4 py-3"
              style={{ background: alignSty.bg, border: `1px solid ${alignSty.border}` }}>
              <p className="mb-1.5" style={{ fontFamily: SANS, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: alignSty.color, fontWeight: 700 }}>
                {alignSty.label}
              </p>
              <p style={{ fontFamily: SANS, fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.65 }}>
                {nnInterp?.note}
              </p>
            </div>
          )}

          {nnInterp && (
            <div className="flex flex-col gap-2">
              <p style={{ fontFamily: SANS, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4f5d7a', fontWeight: 600 }}>
                Name Number {nameNum} · Vibration
              </p>
              <div className="rounded-xl px-5 py-4"
                style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(99,102,241,0.35)' }}>
                <p style={{ fontFamily: SANS, fontSize: '1rem', color: '#94a3b8', lineHeight: 1.75 }}>{nnInterp.theme}</p>
              </div>
            </div>
          )}

          {lpInterp && (
            <div className="flex flex-col gap-2">
              <p style={{ fontFamily: SANS, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4f5d7a', fontWeight: 600 }}>
                Life Path {lifePath} · Core Theme
              </p>
              <div className="rounded-xl px-5 py-4"
                style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(168,85,247,0.3)' }}>
                <p style={{ fontFamily: SANS, fontSize: '1rem', color: '#94a3b8', lineHeight: 1.75 }}>{lpInterp.theme}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suggestions */}
      {suggestions != null && (
        <div className="flex flex-col gap-4">
          {/* Section heading */}
          <div>
            <p style={{ fontFamily: SERIF, fontSize: '1.2rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.35rem' }}>
              {isAlreadyHarmonious
                ? 'Your current spelling is already well-aligned'
                : 'A few spelling variations that align more closely with your Life Path'}
            </p>
            {!isAlreadyHarmonious && (
              <p style={{ fontFamily: SANS, fontSize: '0.8125rem', color: '#334155', lineHeight: 1.6 }}>
                These are traditional numerology suggestions to consider, not a requirement — many people keep their name exactly as is.
              </p>
            )}
          </div>

          {suggestions.length > 0 ? (
            <div className="flex flex-col gap-3">
              {suggestions.map((s, i) => (
                <SuggestionCard key={i} suggestion={s} lifePath={lifePath} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl px-5 py-4"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontFamily: SANS, fontSize: '0.875rem', color: '#475569', lineHeight: 1.7 }}>
                No close spelling variations were found that shift the name number into a more compatible range for Life Path {lifePath}. Your current spelling may already be the most natural form.
              </p>
            </div>
          )}

          <p style={{ fontFamily: SANS, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1e293b', textAlign: 'center' }}>
            Suggestions use Chaldean numerology · ranked by closeness to original spelling
          </p>
        </div>
      )}

      <p className="text-center"
        style={{ fontFamily: SANS, fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1e293b' }}>
        Chaldean system · Life Path via Pythagorean reduction
      </p>
    </div>
  )
}
