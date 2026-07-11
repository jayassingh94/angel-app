import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { STARS } from './data.js'
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx'
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
import VastuCheck from './components/VastuCheck.jsx'

const SERIF = "'Cormorant Garamond', Georgia, serif"
const SANS  = "'Inter', system-ui, sans-serif"

function Stars() {
  return (
    <div className="stars-layer fixed inset-0 overflow-hidden pointer-events-none z-0">
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

function AppShell() {
  const location = useLocation()
  const navigate  = useNavigate()
  const isHome    = location.pathname === '/'
  const { isDark, toggle } = useTheme()

  return (
    <div
      className="relative min-h-screen w-full flex flex-col"
      style={{ background: 'var(--bg-gradient)' }}
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
      {!isHome && (
        <nav
          className="sticky top-0 z-40 px-5 sm:px-8 py-3.5 flex items-center gap-4 border-b"
          style={{
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(14px)',
            borderColor: 'var(--nav-border)',
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 transition-colors"
            style={{ fontFamily: SANS, fontSize: '12px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
          >
            <span style={{ fontSize: '15px' }}>←</span>&nbsp;Back
          </button>
          <div className="flex-1" />
          <span style={{ fontFamily: SERIF, color: 'rgba(167,139,250,0.45)', fontSize: '1rem', letterSpacing: '0.06em' }}>
            ✦ Angel App
          </span>
          <button
            onClick={toggle}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: 'none',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              padding: '4px 9px',
              fontSize: '13px',
              lineHeight: 1,
              color: '#94a3b8',
            }}
          >
            {isDark ? '☀' : '☾'}
          </button>
        </nav>
      )}

      {/* ── Views ── */}
      <div className="relative z-10 flex flex-col flex-1">
        <Routes>
          <Route path="/"                        element={<Home />} />
          <Route path="/kundali"                 element={<VedicKundali />} />
          <Route path="/numerology"              element={<NumerologyHub />} />
          <Route path="/numerology/lifepath"     element={<LifePath />} />
          <Route path="/numerology/namecorrection" element={<NameNumerology />} />
          <Route path="/oracle"                  element={<DailyOracle />} />
          <Route path="/dictionary"              element={<AngelDictionary />} />
          <Route path="/loshu"                   element={<LoShuGrid />} />
          <Route path="/chakra"                  element={<ChakraSounds />} />
          <Route path="/alignment"               element={<ChakraAlignment />} />
          <Route path="/vastu"                   element={<VastuCheck />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ThemeProvider>
  )
}
