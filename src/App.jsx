import { useState } from 'react'
import { STARS } from './data.js'
import DailyOracle from './components/DailyOracle.jsx'
import AngelDictionary from './components/AngelDictionary.jsx'
import LoShuGrid from './components/LoShuGrid.jsx'
import ChakraSounds from './components/ChakraSounds.jsx'
import ChakraAlignment from './components/ChakraAlignment.jsx'
import VedicKundali from './components/VedicKundali.jsx'

const TABS = [
  { id: 'oracle',     label: '✦ Daily Oracle'       },
  { id: 'dictionary', label: '✶ Angel Dictionary'   },
  { id: 'loshu',      label: '⊞ Lo Shu Grid'        },
  { id: 'chakra',     label: '◎ Chakra Sounds'      },
  { id: 'alignment',  label: '◈ Chakra Alignment'   },
  { id: 'kundali',    label: '✵ Vedic Kundali'      },
]

function Stars() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {STARS.map((s) => (
        <div
          key={s.id}
          className="star absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            '--duration': `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('oracle')

  return (
    <div
      className="relative min-h-screen w-full flex flex-col"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #1e1040 0%, #0f0a1e 40%, #060412 100%)',
      }}
    >
      <Stars />

      {/* Nebula blobs */}
      <div
        className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none blur-3xl z-0"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
      />
      <div
        className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 pointer-events-none blur-3xl z-0"
        style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }}
      />

      {/* ── Navigation ── */}
      <nav
        className="sticky top-0 z-40 border-b border-violet-900/40 backdrop-blur-lg"
        style={{ background: 'rgba(6, 4, 18, 0.85)' }}
      >
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 py-3 sm:py-0 sm:h-16">
          {/* Brand */}
          <span className="text-violet-400/80 font-semibold text-xs tracking-[0.25em] uppercase sm:mr-8 shrink-0">
            Cosmic Dashboard
          </span>

          {/* Tabs */}
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white bg-violet-600/25 border border-violet-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                  style={
                    isActive
                      ? { boxShadow: '0 0 16px rgba(139,92,246,0.3), inset 0 0 16px rgba(139,92,246,0.05)' }
                      : {}
                  }
                >
                  {tab.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                      style={{ background: 'linear-gradient(90deg, #7c3aed, #c026d3)' }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* ── Page header (shared across tabs) ── */}
      <div className="relative z-10 text-center pt-10 pb-2 px-6">
        <p className="text-violet-400/60 text-xs uppercase tracking-[0.3em] mb-2 font-light">
          Divine Numerology
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          <span className="shimmer-text">Angel Numbers</span>
        </h1>
      </div>

      {/* ── Tab content ── */}
      <div className="relative z-10 flex flex-col flex-1">
        {activeTab === 'oracle'     && <DailyOracle />}
        {activeTab === 'dictionary' && <AngelDictionary />}
        {activeTab === 'loshu'      && <LoShuGrid />}
        {activeTab === 'chakra'     && <ChakraSounds />}
        {activeTab === 'alignment'  && <ChakraAlignment />}
        {activeTab === 'kundali'    && <VedicKundali />}
      </div>

      {/* Footer */}
      <p className="relative z-10 text-center text-slate-700 text-xs tracking-wide py-6">
        Trust the signs ✦ The universe is always speaking
      </p>
    </div>
  )
}
