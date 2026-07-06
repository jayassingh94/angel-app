import { useState, useEffect, useRef } from 'react'
import { ANGEL_NUMBERS, ZODIAC_SIGNS } from '../data.js'
import { playChime, makeParticles } from '../utils.js'

const INPUT_CLASS =
  'w-full px-5 py-4 rounded-2xl bg-white/5 border border-violet-500/30 text-white ' +
  'focus:outline-none focus:border-violet-400/60 focus:bg-white/8 ' +
  'transition-all duration-200 text-base tracking-wide'

function PulseRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 0.5, 1].map((delay) => (
        <div
          key={delay}
          className="pulse-ring absolute w-40 h-40 rounded-full border border-violet-400/50"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  )
}

export default function DailyOracle() {
  const [name, setName] = useState('')
  const [zodiac, setZodiac] = useState('')
  const [phase, setPhase] = useState('idle')
  const [result, setResult] = useState(null)
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)
  const [particles, setParticles] = useState([])

  const timerRef = useRef(null)
  const msgTimerRef = useRef(null)
  const particleTimerRef = useRef(null)

  const canSubmit = name.trim() !== '' && zodiac !== ''

  const loadingMessages = [
    `Reading ${name}'s cosmic alignment...`,
    `Analyzing ${zodiac} energy fields...`,
  ]

  function handleReceive() {
    setPhase('loading')
    setLoadingMsgIdx(0)
    msgTimerRef.current = setTimeout(() => setLoadingMsgIdx(1), 1000)
    timerRef.current = setTimeout(() => {
      const pick = ANGEL_NUMBERS[Math.floor(Math.random() * ANGEL_NUMBERS.length)]
      setResult(pick)
      setPhase('result')
      playChime()
      setParticles(makeParticles())
      particleTimerRef.current = setTimeout(() => setParticles([]), 1900)
    }, 2000)
  }

  function handleReset() {
    setPhase('idle')
    setResult(null)
    setParticles([])
  }

  useEffect(() => () => {
    clearTimeout(timerRef.current)
    clearTimeout(msgTimerRef.current)
    clearTimeout(particleTimerRef.current)
  }, [])

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">

      {/* Particle burst */}
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute" style={{ left: '50%', top: '45%' }}>
            {particles.map((p) => (
              <div
                key={p.id}
                className="particle absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  marginLeft: -p.size / 2,
                  marginTop: -p.size / 2,
                  backgroundColor: p.color,
                  boxShadow: `0 0 ${p.size * 1.5}px ${p.color}`,
                  '--tx': `${p.tx}px`,
                  '--ty': `${p.ty}px`,
                  '--dur': `${p.dur}s`,
                  '--delay': `${p.delay}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-md flex flex-col items-center gap-8">

        {/* ── IDLE ── */}
        {phase === 'idle' && (
          <div className="w-full flex flex-col items-center gap-5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Your First Name"
              maxLength={40}
              className={INPUT_CLASS}
              style={{ caretColor: '#a78bfa' }}
            />

            <div className="relative w-full">
              <select
                value={zodiac}
                onChange={(e) => setZodiac(e.target.value)}
                className={INPUT_CLASS + ' appearance-none cursor-pointer pr-10'}
                style={{ color: zodiac ? 'white' : '#64748b' }}
              >
                <option value="" disabled style={{ color: '#64748b', background: '#0f0a1e' }}>
                  Select Your Zodiac Sign
                </option>
                {ZODIAC_SIGNS.map((sign) => (
                  <option key={sign} value={sign} style={{ color: 'white', background: '#0f0a1e' }}>
                    {sign}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-violet-400 text-lg">
                ▾
              </div>
            </div>

            <div className={`mt-2 float-anim relative flex items-center justify-center transition-opacity duration-300 ${canSubmit ? 'opacity-100' : 'opacity-40'}`}>
              <button
                onClick={handleReceive}
                disabled={!canSubmit}
                className={`relative px-10 py-5 rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white font-semibold text-lg tracking-wide border border-violet-400/30 transition-all duration-300 ${canSubmit ? 'glow-button cursor-pointer hover:scale-105 active:scale-95' : 'cursor-not-allowed'}`}
              >
                <span className="relative z-10">✦ Receive Today&apos;s Message</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
              </button>
            </div>

            {!canSubmit && (
              <p className="text-slate-600 text-xs tracking-wide -mt-2">
                Enter your name and zodiac sign to unlock your reading
              </p>
            )}
          </div>
        )}

        {/* ── LOADING ── */}
        {phase === 'loading' && (
          <div className="flex flex-col items-center gap-8">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <PulseRings />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="text-3xl animate-spin" style={{ animationDuration: '3s' }}>✦</span>
              </div>
            </div>
            <div className="text-center min-h-[60px]">
              <p key={loadingMsgIdx} className="msg-fade text-violet-300 text-xl font-light tracking-wide">
                {loadingMessages[loadingMsgIdx]}
              </p>
              <p className="text-slate-500 text-sm mt-3 tracking-wide">
                The cosmos is preparing your message
              </p>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {phase === 'result' && result && (
          <div className={`card-appear w-full rounded-3xl border backdrop-blur-sm bg-white/5 ${result.borderColor} glow-card p-8 sm:p-10 flex flex-col items-center gap-6`}>
            <p className="text-slate-500 text-xs uppercase tracking-[0.25em]">
              A message for {name} · {zodiac}
            </p>

            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${result.color} text-white/90`}>
              {result.emoji} {result.category}
            </span>

            <div className="text-center">
              <p className="text-slate-500 text-xs uppercase tracking-[0.3em] mb-2">Your Angel Number</p>
              <div className={`number-glow text-8xl sm:text-9xl font-bold tracking-tighter bg-gradient-to-br ${result.color} bg-clip-text text-transparent`}>
                {result.number}
              </div>
            </div>

            <div className="w-16 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

            <p className="text-slate-300 text-center leading-relaxed text-base sm:text-lg font-light max-w-sm">
              {result.message}
            </p>

            <button
              onClick={handleReset}
              className="mt-2 px-8 py-3 rounded-full border border-violet-500/40 text-violet-300 hover:bg-violet-500/10 hover:border-violet-400/60 hover:text-white transition-all duration-200 text-sm tracking-widest uppercase font-medium cursor-pointer"
            >
              ↺ Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
