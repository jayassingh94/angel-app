import { useState } from 'react'
import { vastuRemedies } from '../utils/vastuRemedies.js'
import { QUESTIONS } from '../utils/vastuData.js'

const SERIF = "'Cormorant Garamond', Georgia, serif"
const SANS  = "'Inter', system-ui, sans-serif"

const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

const DIR_FULL = {
  N: 'North', NE: 'Northeast', E: 'East', SE: 'Southeast',
  S: 'South', SW: 'Southwest', W: 'West', NW: 'Northwest',
}

const DIR_POSITIONS = DIRS.map((dir, i) => {
  const rad = (-90 + i * 45) * Math.PI / 180
  return { dir, x: 110 + 82 * Math.cos(rad), y: 110 + 82 * Math.sin(rad) }
})

const STATUS_STYLE = {
  favorable:         { label: 'Well-placed',    color: '#4ade80', bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.22)' },
  neutral:           { label: 'Neutral',         color: '#94a3b8', bg: 'rgba(148,163,184,0.06)', border: 'rgba(148,163,184,0.18)' },
  'needs attention': { label: 'Worth adjusting', color: '#fb923c', bg: 'rgba(251,146,60,0.08)',  border: 'rgba(251,146,60,0.22)' },
}

function overallSummary(answers) {
  const answered = answers.filter(Boolean)
  if (answered.length === 0) return ''
  const fav  = answered.filter(r => r.status === 'favorable').length
  const attn = answered.filter(r => r.status === 'needs attention').length
  if (attn === 0)
    return "Your home's directional energy is well-aligned across all the areas checked. Keeping each space clean and clutter-free helps maintain this balance."
  if (fav === 0)
    return "A few of your home's directional placements are worth gentle attention. The remedies are simple household adjustments — try one at a time and notice the shift."
  if (fav >= attn)
    return "Your home has a good directional foundation. A few areas have room for small adjustments, and the remedies are easy to try."
  return "Your home has a mix of strong and gentle directional placements. Starting with the main door remedy tends to have the widest positive effect on overall energy."
}

function CompassPicker({ selected, onSelect }) {
  return (
    <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto' }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '1px solid rgba(99,102,241,0.15)',
        background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.04), rgba(0,0,0,0.2))',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '54px', height: '54px', borderRadius: '50%',
        border: '1px solid rgba(99,102,241,0.2)',
        background: 'rgba(10,8,28,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: SERIF,
          fontSize: selected ? '1rem' : '0.75rem',
          fontWeight: 500,
          color: selected ? '#c4b5fd' : '#334155',
          letterSpacing: '0.02em',
        }}>
          {selected || '·'}
        </span>
      </div>
      {DIR_POSITIONS.map(({ dir, x, y }) => {
        const on = selected === dir
        return (
          <button
            key={dir}
            onClick={() => onSelect(dir)}
            style={{
              position: 'absolute', left: `${x}px`, top: `${y}px`,
              transform: 'translate(-50%, -50%)',
              width: '34px', height: '34px', borderRadius: '50%',
              fontFamily: SANS, fontSize: '9.5px', fontWeight: on ? 700 : 500,
              letterSpacing: '0.04em',
              background: on ? 'rgba(99,102,241,0.28)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${on ? 'rgba(139,92,246,0.65)' : 'rgba(255,255,255,0.1)'}`,
              color: on ? '#c4b5fd' : '#475569',
              cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: on ? '0 0 12px rgba(139,92,246,0.38)' : 'none',
            }}
          >
            {dir}
          </button>
        )
      })}
    </div>
  )
}

function QuizStep({ step, selected, onSelect, onConfirm, onSkip }) {
  const q = QUESTIONS[step]
  return (
    <div className="max-w-lg mx-auto w-full px-4 sm:px-6 pt-12 pb-20 flex flex-col gap-8 items-center">
      <div className="text-center w-full">
        <p className="mb-3 uppercase"
          style={{ fontFamily: SANS, fontSize: '10px', letterSpacing: '0.32em', color: 'rgba(167,139,250,0.55)', fontWeight: 500 }}>
          Vastu Check
        </p>
        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 500, color: '#e2e8f0', lineHeight: 1.1 }}>
          Space &amp; Direction
        </h1>
      </div>

      {/* Progress */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span style={{ fontFamily: SANS, fontSize: '10px', color: '#475569', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
            {q.label}
          </span>
          <span style={{ fontFamily: SANS, fontSize: '10px', color: '#334155' }}>{step + 1} / 4</span>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="flex-1 h-0.5 rounded-full transition-all duration-500"
              style={{ background: i <= step ? 'rgba(139,92,246,0.65)' : 'rgba(255,255,255,0.07)' }} />
          ))}
        </div>
      </div>

      {/* Question card */}
      <div className="w-full rounded-2xl p-6 flex flex-col gap-8 items-center"
        style={{ background: 'rgba(10,8,28,0.85)', border: '1px solid rgba(99,102,241,0.18)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>

        <p style={{ fontFamily: SERIF, fontSize: '1.15rem', fontWeight: 400, color: '#cbd5e1', lineHeight: 1.55, textAlign: 'center' }}>
          {q.question}
        </p>

        <CompassPicker selected={selected} onSelect={onSelect} />

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={!selected}
            className="w-full py-3 rounded-xl font-semibold transition-all"
            style={{
              fontFamily: SANS, fontSize: '13px', letterSpacing: '0.1em',
              background: selected ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'rgba(99,102,241,0.1)',
              color: selected ? '#fff' : '#334155',
              border: 'none', cursor: selected ? 'pointer' : 'not-allowed',
              boxShadow: selected ? '0 4px 20px rgba(124,58,237,0.35)' : 'none',
            }}
          >
            {step < 3 ? 'Next Question' : 'See Results'}
          </button>
          <button onClick={onSkip}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: SANS, fontSize: '11px', color: '#334155',
              textDecoration: 'underline', textDecorationColor: 'rgba(100,116,139,0.3)',
              padding: '0.4rem', letterSpacing: '0.04em',
            }}>
            Skip this question
          </button>
        </div>
      </div>

      <p style={{ fontFamily: SANS, fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1e293b', textAlign: 'center' }}>
        Classical Vastu Shastra directional principles
      </p>
    </div>
  )
}

function ResultsScreen({ answers, onRestart }) {
  const summary = overallSummary(answers)
  return (
    <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 pt-12 pb-20 flex flex-col gap-6">
      <div className="text-center mb-2">
        <p className="mb-3 uppercase"
          style={{ fontFamily: SANS, fontSize: '10px', letterSpacing: '0.32em', color: 'rgba(167,139,250,0.55)', fontWeight: 500 }}>
          Vastu Analysis
        </p>
        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.9rem, 5vw, 2.6rem)', fontWeight: 500, color: '#e2e8f0', lineHeight: 1.1 }}>
          Your Space Report
        </h1>
      </div>

      {summary && (
        <div className="rounded-xl px-5 py-4"
          style={{ background: 'rgba(10,8,28,0.85)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          <p style={{ fontFamily: SANS, fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.8 }}>{summary}</p>
        </div>
      )}

      {answers.some(Boolean) ? (
        <div className="flex flex-col gap-4">
          {answers.map((ans, i) => {
            if (!ans) return null
            const sty = STATUS_STYLE[ans.status]
            return (
              <div key={i} className="rounded-2xl p-5 flex flex-col gap-3"
                style={{ background: 'rgba(10,8,28,0.85)', border: '1px solid rgba(99,102,241,0.18)', boxShadow: '0 4px 16px rgba(0,0,0,0.35)' }}>

                {/* Room + direction + badge */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p style={{ fontFamily: SANS, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4f5d7a', fontWeight: 600, marginBottom: '0.25rem' }}>
                      {ans.room}
                    </p>
                    <p style={{ fontFamily: SERIF, fontSize: '1.15rem', fontWeight: 500, color: '#cbd5e1' }}>
                      {ans.direction}
                    </p>
                  </div>
                  <span className="shrink-0 text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.12em]"
                    style={{ background: sty.bg, border: `1px solid ${sty.border}`, color: sty.color, fontFamily: SANS }}>
                    {sty.label}
                  </span>
                </div>

                {/* Note — the "why" */}
                <p style={{ fontFamily: SANS, fontSize: '12px', color: '#475569', lineHeight: 1.75, fontStyle: 'italic' }}>
                  {ans.note}
                </p>

                {/* Remedy — the "what to do" */}
                <div className="rounded-xl px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.02)', borderLeft: `2px solid ${sty.border}` }}>
                  <p style={{ fontFamily: SANS, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: sty.color, fontWeight: 600, marginBottom: '0.4rem' }}>
                    Remedy
                  </p>
                  <p style={{ fontFamily: SANS, fontSize: '12px', color: '#64748b', lineHeight: 1.8 }}>
                    {ans.remedy}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl px-5 py-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontFamily: SANS, fontSize: '13px', color: '#475569', lineHeight: 1.7 }}>
            No directions were entered. Try again and answer at least one question to see your space report.
          </p>
        </div>
      )}

      <button onClick={onRestart}
        className="w-full py-3 rounded-xl mt-2"
        style={{
          fontFamily: SANS, fontSize: '12px', letterSpacing: '0.12em', fontWeight: 600,
          background: 'rgba(99,102,241,0.1)', color: '#818cf8',
          border: '1px solid rgba(99,102,241,0.22)', cursor: 'pointer',
        }}>
        Check Again
      </button>

      <p className="text-center"
        style={{ fontFamily: SANS, fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1e293b' }}>
        Classical Vastu Shastra directional principles · remedies are optional, not prescriptive
      </p>
    </div>
  )
}

export default function VastuCheck() {
  const [step,     setStep]     = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers,  setAnswers]  = useState([null, null, null, null])

  function confirm() {
    if (!selected) return
    const { roomKey, label } = QUESTIONS[step]
    const fullDir = DIR_FULL[selected]
    const rule = vastuRemedies[roomKey][fullDir]
    const next = [...answers]
    next[step] = { room: label, direction: fullDir, ...rule }
    setAnswers(next)
    advance()
  }

  function advance() {
    if (step < 3) { setStep(step + 1); setSelected(null) }
    else setStep('results')
  }

  function restart() {
    setStep(0); setSelected(null); setAnswers([null, null, null, null])
  }

  if (step === 'results')
    return <ResultsScreen answers={answers} onRestart={restart} />

  return (
    <QuizStep
      step={step}
      selected={selected}
      onSelect={setSelected}
      onConfirm={confirm}
      onSkip={advance}
    />
  )
}
