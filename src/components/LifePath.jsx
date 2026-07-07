import { useState } from 'react'
import { computeLifePath } from '../utils/numerologyCalc.js'
import { lifePathInterpretations } from '../utils/numerologyInterpretations.js'

const SERIF = "'Cormorant Garamond', Georgia, serif"
const SANS  = "'Inter', system-ui, sans-serif"

const MONTHS = ['January','February','March','April','May','June',
                 'July','August','September','October','November','December']

const DAYS   = Array.from({ length: 31 }, (_, i) => i + 1)
const YEARS  = Array.from({ length: 126 }, (_, i) => 2025 - i)

const MASTER_LABEL = { 11: 'Master Number', 22: 'Master Number', 33: 'Master Number' }

export default function LifePath() {
  const [day,    setDay]    = useState('')
  const [month,  setMonth]  = useState('')
  const [year,   setYear]   = useState('')
  const [result, setResult] = useState(null)

  function calculate() {
    if (!day || !month || !year) return
    setResult(computeLifePath(Number(day), Number(month), Number(year)))
  }

  const interp = result != null ? lifePathInterpretations[result] : null

  const selectStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(99,102,241,0.22)',
    color: '#94a3b8',
    borderRadius: '0.75rem',
    padding: '0.6rem 0.75rem',
    fontFamily: SANS,
    fontSize: '13px',
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 pt-12 pb-20 flex flex-col gap-6">
      {/* Header */}
      <div className="text-center mb-2">
        <p className="mb-3 uppercase"
          style={{ fontFamily: SANS, fontSize: '10px', letterSpacing: '0.32em', color: 'rgba(167,139,250,0.55)', fontWeight: 500 }}>
          Numerology
        </p>
        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.9rem, 5vw, 2.8rem)', fontWeight: 500, color: '#e2e8f0', lineHeight: 1.1 }}>
          Life Path Number
        </h1>
        <p style={{ fontFamily: SANS, fontSize: '13px', color: '#475569', marginTop: '0.75rem', lineHeight: 1.7 }}>
          Your core numerological blueprint, derived from your date of birth.
        </p>
      </div>

      {/* Form */}
      <div className="rounded-2xl p-6 flex flex-col gap-5"
        style={{ background: 'rgba(10,8,28,0.85)', border: '1px solid rgba(99,102,241,0.18)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        <p style={{ fontFamily: SANS, fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#4f5d7a', fontWeight: 600 }}>
          Date of Birth
        </p>

        <div className="grid grid-cols-3 gap-3">
          {/* Day */}
          <div className="flex flex-col gap-1.5">
            <label style={{ fontFamily: SANS, fontSize: '10px', color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Day</label>
            <select value={day} onChange={e => setDay(e.target.value)} style={selectStyle}>
              <option value="">—</option>
              {DAYS.map(d => <option key={d} value={d}>{String(d).padStart(2,'0')}</option>)}
            </select>
          </div>

          {/* Month */}
          <div className="flex flex-col gap-1.5">
            <label style={{ fontFamily: SANS, fontSize: '10px', color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Month</label>
            <select value={month} onChange={e => setMonth(e.target.value)} style={selectStyle}>
              <option value="">—</option>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </div>

          {/* Year */}
          <div className="flex flex-col gap-1.5">
            <label style={{ fontFamily: SANS, fontSize: '10px', color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Year</label>
            <select value={year} onChange={e => setYear(e.target.value)} style={selectStyle}>
              <option value="">—</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={calculate}
          disabled={!day || !month || !year}
          className="w-full py-3 rounded-xl font-semibold transition-all"
          style={{
            fontFamily: SANS,
            fontSize: '13px',
            letterSpacing: '0.12em',
            background: (!day || !month || !year)
              ? 'rgba(99,102,241,0.15)'
              : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            color: (!day || !month || !year) ? '#334155' : '#fff',
            border: 'none',
            cursor: (!day || !month || !year) ? 'not-allowed' : 'pointer',
            boxShadow: (!day || !month || !year) ? 'none' : '0 4px 20px rgba(124,58,237,0.4)',
          }}
        >
          Calculate Life Path
        </button>
      </div>

      {/* Result */}
      {result != null && interp && (
        <div className="rounded-2xl p-6 flex flex-col gap-5"
          style={{ background: 'rgba(10,8,28,0.85)', border: '1px solid rgba(99,102,241,0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>

          {/* Number display */}
          <div className="flex items-center gap-5">
            <div className="shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.3), rgba(124,58,237,0.3))', border: '1px solid rgba(139,92,246,0.35)' }}>
              <span style={{ fontFamily: SERIF, fontSize: '2.4rem', fontWeight: 600, color: '#c4b5fd' }}>{result}</span>
            </div>
            <div>
              {MASTER_LABEL[result] && (
                <span className="inline-block mb-1.5 text-[8.5px] uppercase tracking-[0.2em] font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(139,92,246,0.18)', border: '1px solid rgba(139,92,246,0.35)', color: '#a78bfa', fontFamily: SANS }}>
                  {MASTER_LABEL[result]}
                </span>
              )}
              <p style={{ fontFamily: SANS, fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#4f5d7a', fontWeight: 600 }}>
                Your Life Path Number
              </p>
              <p style={{ fontFamily: SERIF, fontSize: '1.4rem', color: '#e2e8f0', fontWeight: 500, marginTop: '0.2rem' }}>
                Life Path {result}
              </p>
            </div>
          </div>

          {/* Theme */}
          <div className="rounded-xl px-5 py-4"
            style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(99,102,241,0.35)' }}>
            <p className="mb-2" style={{ fontFamily: SANS, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4f5d7a', fontWeight: 600 }}>
              Core Theme
            </p>
            <p style={{ fontFamily: SANS, fontSize: '13px', color: '#94a3b8', lineHeight: 1.75 }}>{interp.theme}</p>
          </div>

          {/* Challenges */}
          <div className="rounded-xl px-5 py-4"
            style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(168,85,247,0.3)' }}>
            <p className="mb-2" style={{ fontFamily: SANS, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4f5d7a', fontWeight: 600 }}>
              Growth Area
            </p>
            <p style={{ fontFamily: SANS, fontSize: '13px', color: '#94a3b8', lineHeight: 1.75 }}>{interp.challenges}</p>
          </div>
        </div>
      )}

      <p className="text-center"
        style={{ fontFamily: SANS, fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1e293b' }}>
        Pythagorean system · Master numbers 11, 22, 33 preserved
      </p>
    </div>
  )
}
