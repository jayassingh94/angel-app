import { useState } from 'react'
import { STARS } from './data.js'
import Home from './components/Home.jsx'
import DailyOracle from './components/DailyOracle.jsx'
import AngelDictionary from './components/AngelDictionary.jsx'
import LoShuGrid from './components/LoShuGrid.jsx'
import ChakraSounds from './components/ChakraSounds.jsx'
import ChakraAlignment from './components/ChakraAlignment.jsx'
import VedicKundali from './components/VedicKundali.jsx'
import NumerologyHub from './components/NumerologyHub.jsx'
import LifePath from './components/LifePath.jsx'
import NameNumerology from './components/NameNumerology.jsx'

const SERIF = "'Cormorant Garamond', Georgia, serif"
const SANS  = "'Inter', system-ui, sans-serif"

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
  const [activeView, setActiveView] = useState('home')

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

      {/* ── Feature nav bar (hidden on home) ── */}
      {activeView !== 'home' && (
        <nav
          className="sticky top-0 z-40 px-5 sm:px-8 py-3.5 flex items-center gap-4 border-b"
          style={{
            background: 'rgba(6,4,18,0.88)',
            backdropFilter: 'blur(14px)',
            borderColor: 'rgba(255,255,255,0.05)',
          }}
        >
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-1.5 transition-colors"
            style={{ fontFamily: SANS, fontSize: '12px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
          >
            <span style={{ fontSize: '15px' }}>←</span>&nbsp;Home
          </button>
          <div className="flex-1" />
          <span style={{ fontFamily: SERIF, color: 'rgba(167,139,250,0.45)', fontSize: '1rem', letterSpacing: '0.06em' }}>
            ✦ Angel App
          </span>
        </nav>
      )}

      {/* ── Views ── */}
      <div className="relative z-10 flex flex-col flex-1">
        {activeView === 'home'           && <Home onNavigate={setActiveView} />}
        {activeView === 'numerology-hub'  && <NumerologyHub onNavigate={setActiveView} />}
        {activeView === 'lifepath'        && <LifePath />}
        {activeView === 'namecorrection'  && <NameNumerology />}
        {activeView === 'oracle'     && <DailyOracle />}
        {activeView === 'dictionary' && <AngelDictionary />}
        {activeView === 'loshu'      && <LoShuGrid />}
        {activeView === 'chakra'     && <ChakraSounds />}
        {activeView === 'alignment'  && <ChakraAlignment />}
        {activeView === 'kundali'    && <VedicKundali />}
      </div>
    </div>
  )
}
