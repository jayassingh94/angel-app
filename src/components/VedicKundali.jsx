import { useState, useRef, useEffect, useMemo } from 'react'
import { SwissEphemeris } from '@swisseph/browser'
import VedicDasha from './VedicDasha.jsx'
import MangalDosha from './MangalDosha.jsx'
import KalsarpaDosha from './KalsarpaDosha.jsx'
import { computeNavamsa } from '../utils/navamsa.js'
import Transit from './Transit.jsx'

// ── WASM singleton — initialised once at module load ──────────────────────────

let _swe = null
const _sweInitP = (async () => {
  const swe = new SwissEphemeris()
  await swe.init()
  _swe = swe
})()

// SE planet body numbers (same as SE_* C constants)
const SE_BODY = { Sun: 0, Moon: 1, Mercury: 2, Venus: 3, Mars: 4, Jupiter: 5, Saturn: 6 }
const SE_MEAN_NODE = 10              // Rahu (mean ascending node)
const SE_FLAGS     = 4 | 256        // SE_FLG_MOSEPH | SE_FLG_SPEED

// ── Static data ───────────────────────────────────────────────────────────────

const RASHIS = [
  'Mesh','Vrishabha','Mithuna','Karka',
  'Simha','Kanya','Tula','Vrishchika',
  'Dhanu','Makara','Kumbha','Meena',
]
const RASHI_SHORT = ['Ar','Ta','Ge','Ca','Le','Vi','Li','Sc','Sg','Cp','Aq','Pi']
const RASHI_SYMS  = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']

const GRAHAS = [
  { id: 'Su', name: 'Sun',     vName: 'Surya',   symbol: '☉', bodyKey: 'Sun',     color: '#facc15' },
  { id: 'Mo', name: 'Moon',    vName: 'Chandra',  symbol: '☽', bodyKey: 'Moon',    color: '#e2e8f0' },
  { id: 'Ma', name: 'Mars',    vName: 'Mangal',   symbol: '♂', bodyKey: 'Mars',    color: '#f87171' },
  { id: 'Me', name: 'Mercury', vName: 'Budha',    symbol: '☿', bodyKey: 'Mercury', color: '#4ade80' },
  { id: 'Ju', name: 'Jupiter', vName: 'Guru',     symbol: '♃', bodyKey: 'Jupiter', color: '#fb923c' },
  { id: 'Ve', name: 'Venus',   vName: 'Shukra',   symbol: '♀', bodyKey: 'Venus',   color: '#f9a8d4' },
  { id: 'Sa', name: 'Saturn',  vName: 'Shani',    symbol: '♄', bodyKey: 'Saturn',  color: '#94a3b8' },
  { id: 'Ra', name: 'Rahu',    vName: 'Rahu',     symbol: '☊', bodyKey: null,      color: '#a78bfa' },
  { id: 'Ke', name: 'Ketu',    vName: 'Ketu',     symbol: '☋', bodyKey: null,      color: '#6ee7b7' },
]

// North Indian diamond layout: 12 triangular house sections in 400×400 SVG
// Inner square corners: iNW(100,100), iNE(300,100), iSE(300,300), iSW(100,300)
// [houseNum, [[x1,y1],[x2,y2],[x3,y3]], [labelX, labelY]]
const HOUSE_TRIANGLES = [
  [1,  [[200,0],[100,100],[300,100]],   [200, 26]],   // top-center (Lagna)
  [2,  [[200,0],[400,0],[300,100]],     [363, 22]],   // top-right corner
  [3,  [[400,0],[400,200],[300,100]],   [384, 80]],   // right-upper
  [4,  [[400,200],[300,100],[300,300]], [362, 200]],  // right-center
  [5,  [[400,200],[400,400],[300,300]], [384, 320]],  // right-lower
  [6,  [[400,400],[200,400],[300,300]], [363, 380]],  // bottom-right corner
  [7,  [[200,400],[300,300],[100,300]], [200, 382]],  // bottom-center
  [8,  [[0,400],[200,400],[100,300]],   [37, 380]],   // bottom-left corner
  [9,  [[0,400],[0,200],[100,300]],     [16, 320]],   // left-lower
  [10, [[0,200],[100,100],[100,300]],   [38, 200]],   // left-center
  [11, [[0,0],[0,200],[100,100]],       [16, 80]],    // left-upper
  [12, [[0,0],[200,0],[100,100]],       [37, 22]],    // top-left corner
]

// Darker planet hues for visibility on the light chart background
const PLANET_CHART_COLOR = {
  Su: '#b45309', Mo: '#64748b', Ma: '#dc2626', Me: '#15803d',
  Ju: '#c2410c', Ve: '#be185d', Sa: '#334155', Ra: '#7c3aed', Ke: '#0d9488',
}

const DEFAULT_CITY = { label: 'Mumbai, Maharashtra', lat: 19.0760, lon: 72.8777, tz: 'Asia/Kolkata' }

// ── Astronomy helpers ─────────────────────────────────────────────────────────

function julianDay(date) {
  return date.getTime() / 86400000.0 + 2440587.5
}

function getLahiriAyanamsha(jd) {
  // Swiss Ephemeris SE_SIDM_LAHIRI: J2000.0 = 23.853167°, rate = 1.39657°/century
  const T = (jd - 2451545.0) / 36525.0
  return 23.853167 + T * 1.39657
}

// Convert birth date + local time → UTC Date
function localToUTC(year, month, day, h24, min, tzString) {
  const fakeUTCMs = Date.UTC(year, month - 1, day, h24, min, 0)
  const fakeUTC   = new Date(fakeUTCMs)

  // '2-digit' + hour12:false guarantees 00–23; avoids the V8 bug where
  // 'numeric' can return 24 for midnight without advancing the day field
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tzString,
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).formatToParts(fakeUTC)
  const get = type => parseInt(parts.find(p => p.type === type)?.value ?? '0', 10)

  let tzH = get('hour'), tzDay = get('day'), tzMon = get('month'), tzYear = get('year')
  if (tzH === 24) {
    tzH = 0
    const next = new Date(Date.UTC(tzYear, tzMon - 1, tzDay + 1))
    tzYear = next.getUTCFullYear(); tzMon = next.getUTCMonth() + 1; tzDay = next.getUTCDate()
  }
  const tzAsUTCMs = Date.UTC(tzYear, tzMon - 1, tzDay, tzH, get('minute'), 0)
  const offsetMs  = tzAsUTCMs - fakeUTCMs
  return new Date(fakeUTCMs - offsetMs)
}

// ── Core calculation (synchronous after WASM init) ────────────────────────────

function computeKundali(swe, year, month, day, h24, min, city) {
  const utcDate = localToUTC(year, month, day, h24, min, city.tz)
  const jd      = julianDay(utcDate)
  const ay      = getLahiriAyanamsha(jd)
  const toSid   = trop => ((trop - ay) % 360 + 360) % 360

  // Ascendant via Swiss Ephemeris WASM (includes full nutation + true obliquity)
  const houseData  = swe.calculateHouses(jd, city.lat, city.lon, 'W')
  const lagnaLon   = toSid(houseData.ascendant)
  const lagnaRashi = Math.floor(lagnaLon / 30)
  const lagnaDegs  = lagnaLon % 30

  // Rahu = mean ascending node (SE body 10); Ketu = opposite point
  const rahuPos  = swe.calculatePosition(jd, SE_MEAN_NODE, SE_FLAGS)
  const rahuTrop = rahuPos.longitude
  const ketuTrop = (rahuTrop + 180) % 360

  const grahas = GRAHAS.map(g => {
    const tropLon = g.bodyKey !== null
      ? swe.calculatePosition(jd, SE_BODY[g.bodyKey], SE_FLAGS).longitude
      : (g.id === 'Ra' ? rahuTrop : ketuTrop)

    const sidLon   = toSid(tropLon)
    const rashiIdx = Math.floor(sidLon / 30)
    const degsRaw  = sidLon % 30
    const degs     = Math.floor(degsRaw)
    const mins     = Math.floor((degsRaw - degs) * 60)
    const houseNum = ((rashiIdx - lagnaRashi + 12) % 12) + 1
    return { ...g, sidLon, rashiIdx, degs, mins, houseNum }
  })

  return {
    lagnaRashi,
    lagnaDegs:      Math.floor(lagnaDegs),
    lagnaRashiName: RASHIS[lagnaRashi],
    lagnaSymbol:    RASHI_SYMS[lagnaRashi],
    lagnaSidLon:    lagnaLon,
    ayanamsha:      ay.toFixed(4),
    grahas,
    utcISO:         utcDate.toISOString(),
  }
}

// ── SVG chart ─────────────────────────────────────────────────────────────────

function NorthIndianChart({ chart }) {
  const S = 400
  const lineColor = 'rgba(100,90,160,0.38)'
  const lineW = 0.85

  const planetsByHouse = {}
  for (let i = 1; i <= 12; i++) planetsByHouse[i] = []
  chart.grahas.forEach(g => planetsByHouse[g.houseNum].push(g.id))

  return (
    <svg width="100%" viewBox={`0 0 ${S} ${S}`} style={{ maxWidth: S, display: 'block', borderRadius: 6 }}>
      {/* Light cream background */}
      <rect width={S} height={S} fill="#f5f3ee" rx={6} />

      {/* H1 (Lagna) subtle tint */}
      <polygon points="200,0 100,100 300,100" fill="rgba(99,102,241,0.08)" />

      {/* Outer border */}
      <rect x={0.5} y={0.5} width={S-1} height={S-1} fill="none" stroke={lineColor} strokeWidth={1.2} rx={5.5} />

      {/* 6 structural lines forming the 12 houses */}
      <line x1={0}   y1={0}   x2={S}   y2={S}   stroke={lineColor} strokeWidth={lineW} />
      <line x1={S}   y1={0}   x2={0}   y2={S}   stroke={lineColor} strokeWidth={lineW} />
      <line x1={200} y1={0}   x2={0}   y2={200} stroke={lineColor} strokeWidth={lineW} />
      <line x1={200} y1={0}   x2={S}   y2={200} stroke={lineColor} strokeWidth={lineW} />
      <line x1={S}   y1={200} x2={200} y2={S}   stroke={lineColor} strokeWidth={lineW} />
      <line x1={0}   y1={200} x2={200} y2={S}   stroke={lineColor} strokeWidth={lineW} />

      {/* Center square */}
      <rect x={100} y={100} width={200} height={200} fill="rgba(242,240,234,0.9)" stroke={lineColor} strokeWidth={lineW} />

      {/* Center: lagna sign + degree */}
      <text x={200} y={187} textAnchor="middle" fontSize={11} fill="#5048a8" fontFamily="monospace" fontWeight="bold">
        {RASHI_SHORT[chart.lagnaRashi]}
      </text>
      <text x={200} y={203} textAnchor="middle" fontSize={9} fill="#7066aa" fontFamily="monospace">
        {chart.lagnaDegs}°
      </text>
      <text x={200} y={218} textAnchor="middle" fontSize={7.5} fill="#9090bb" fontFamily="monospace">
        {chart.lagnaRashiName}
      </text>

      {/* House numbers + planet abbreviations */}
      {HOUSE_TRIANGLES.map(([houseNum, pts, [lx, ly]]) => {
        const isLagna = houseNum === 1
        const planets = planetsByHouse[houseNum]
        const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3
        const cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3
        const cols   = planets.length > 2 ? 2 : 1
        const lineH  = 13
        const rows   = Math.ceil(planets.length / cols)
        const totalH = rows * lineH
        const baseY  = isLagna
          ? cy + 10
          : cy - totalH / 2 + lineH * 0.7

        return (
          <g key={houseNum}>
            <text x={lx} y={ly} textAnchor="middle" fontSize={8}
              fill={isLagna ? '#5048a8' : '#a8a8c8'}
              fontFamily="monospace" fontWeight={isLagna ? 'bold' : 'normal'}>
              {houseNum}
            </text>

            {isLagna && (
              <text x={cx} y={cy - (planets.length > 0 ? 3 : -4)}
                textAnchor="middle" fontSize={8.5}
                fill="#5048a8" fontFamily="monospace" fontWeight="bold" opacity={0.9}>
                Asc
              </text>
            )}

            {planets.map((id, i) => {
              const row = Math.floor(i / cols)
              const col = i % cols
              const xOdd = cols === 2 && planets.length % 2 !== 0 && i === planets.length - 1
              const colOff = cols === 2 ? (col === 0 ? -10 : 10) : 0
              return (
                <text key={id}
                  x={xOdd ? cx : cx + colOff}
                  y={baseY + row * lineH}
                  textAnchor="middle" fontSize={9.5} fontWeight="bold"
                  fill={PLANET_CHART_COLOR[id] ?? '#334155'}
                  fontFamily="monospace">
                  {id}
                </text>
              )
            })}
          </g>
        )
      })}
    </svg>
  )
}

// ── Graha table ───────────────────────────────────────────────────────────────

function GrahaTable({ chart }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div
        className="grid text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 py-2 mb-1"
        style={{ gridTemplateColumns: '2.2rem 1fr 2.5rem 2.5rem 4.5rem' }}
      >
        <span>Graha</span>
        <span>Planet</span>
        <span className="text-center">House</span>
        <span className="text-center">Rashi</span>
        <span className="text-right">Position</span>
      </div>

      {chart.grahas.map((g, i) => (
        <div
          key={g.id}
          className="grid items-center px-3 py-2 rounded-lg transition-all duration-150"
          style={{
            gridTemplateColumns: '2.2rem 1fr 2.5rem 2.5rem 4.5rem',
            background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent',
            border: '1px solid transparent',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = `${g.color}12`
            e.currentTarget.style.borderColor = `${g.color}30`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent'
            e.currentTarget.style.borderColor = 'transparent'
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-base" style={{ color: g.color, filter: `drop-shadow(0 0 4px ${g.color})` }}>
              {g.symbol}
            </span>
            <span className="text-[11px] font-bold font-mono" style={{ color: g.color }}>
              {g.id}
            </span>
          </div>

          <div>
            <p className="text-[12px] font-medium text-slate-300 leading-tight">{g.name}</p>
            <p className="text-[10px] text-slate-600 leading-tight italic">{g.vName}</p>
          </div>

          <div className="text-center">
            <span
              className="text-[11px] font-bold font-mono w-6 h-6 inline-flex items-center justify-center rounded-full"
              style={{ background: `${g.color}18`, color: g.color, border: `1px solid ${g.color}35` }}
            >
              {g.houseNum}
            </span>
          </div>

          <div className="text-center">
            <span className="text-[11px] text-slate-400 font-mono" title={RASHIS[g.rashiIdx]}>
              {RASHI_SYMS[g.rashiIdx]}
            </span>
            <p className="text-[8px] text-slate-600">{RASHI_SHORT[g.rashiIdx]}</p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-slate-400">
              {String(g.degs).padStart(2,'0')}°{String(g.mins).padStart(2,'0')}′
            </span>
            <p className="text-[8px] text-slate-600 truncate">{RASHIS[g.rashiIdx]}</p>
          </div>
        </div>
      ))}

      {/* Lagna row */}
      <div
        className="grid items-center px-3 py-2 rounded-lg mt-1"
        style={{
          gridTemplateColumns: '2.2rem 1fr 2.5rem 2.5rem 4.5rem',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.25)',
        }}
      >
        <div>
          <span className="text-[11px] font-bold font-mono text-indigo-400">⬆</span>
        </div>
        <div>
          <p className="text-[12px] font-medium text-indigo-300">Lagna</p>
          <p className="text-[10px] text-slate-600 italic">Ascendant</p>
        </div>
        <div className="text-center">
          <span className="text-[11px] font-bold font-mono text-indigo-400 inline-flex items-center justify-center w-6 h-6 rounded-full"
            style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.35)' }}>
            1
          </span>
        </div>
        <div className="text-center">
          <span className="text-[11px] text-slate-400 font-mono">{chart.lagnaSymbol}</span>
          <p className="text-[8px] text-slate-600">{RASHI_SHORT[chart.lagnaRashi]}</p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono text-indigo-400">
            {String(chart.lagnaDegs).padStart(2,'0')}°
          </span>
          <p className="text-[8px] text-slate-600">{chart.lagnaRashiName}</p>
        </div>
      </div>

      <p className="text-[9px] text-slate-700 text-right mt-2 px-1">
        Lahiri Ayanamsha: {chart.ayanamsha}° · Whole-sign houses
      </p>
    </div>
  )
}

// ── Input helpers ─────────────────────────────────────────────────────────────

const K_DAYS    = Array.from({ length: 31 }, (_, i) => i + 1)
const K_MONTHS  = ['January','February','March','April','May','June',
                   'July','August','September','October','November','December']
const K_CUR_YR  = new Date().getFullYear()
const K_YEARS   = Array.from({ length: K_CUR_YR - 1900 + 1 }, (_, i) => K_CUR_YR - i)
const K_HOURS   = Array.from({ length: 12 }, (_, i) => String(i + 1))
const K_MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

const KSEL_CLS =
  'w-full px-2 py-3.5 rounded-2xl border text-white appearance-none cursor-pointer ' +
  'focus:outline-none transition-all duration-200 text-sm text-center'
const KSEL_BASE = { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(99,102,241,0.28)' }

function KSel({ value, onChange, placeholder, children }) {
  const hasPlaceholder = placeholder !== undefined
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={KSEL_CLS}
        style={{ ...KSEL_BASE, color: (!hasPlaceholder || value !== '') ? '#e2e8f0' : '#64748b' }}
      >
        {hasPlaceholder && (
          <option value="" disabled style={{ color: '#64748b', background: '#0a081c' }}>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400 text-xs">▾</div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function VedicKundali() {
  const [sweReady,  setSweReady]  = useState(false)
  const [day,       setDay]       = useState('')
  const [month,     setMonth]     = useState('')
  const [year,      setYear]      = useState('')
  const [hour,      setHour]      = useState('12')
  const [minute,    setMinute]    = useState('00')
  const [period,    setPeriod]    = useState('PM')
  const [city,         setCity]         = useState(DEFAULT_CITY)
  const [cityQuery,    setCityQuery]    = useState(DEFAULT_CITY.label)
  const [cityResults,  setCityResults]  = useState([])
  const [cityLoading,  setCityLoading]  = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [chart,     setChart]     = useState(null)
  const [error,     setError]     = useState('')
  const [computing, setComputing] = useState(false)
  const [chartView, setChartView] = useState('d1')
  const [activeTab,  setActiveTab]  = useState('chart')
  const debounceRef = useRef(null)

  useEffect(() => {
    _sweInitP.then(() => setSweReady(true)).catch(() => {})
  }, [])

  const canCalculate = sweReady && day !== '' && month !== '' && year !== ''

  function formatCityResult(result) {
    const addr = result.address || {}
    const name = addr.city || addr.town || addr.village || addr.suburb
               || addr.municipality || result.display_name.split(',')[0].trim()
    const state = addr.state || ''
    const sub   = addr.county ? `${addr.county}, ${state}` : state
    return { name, subtitle: sub }
  }

  function handleCityInput(e) {
    const q = e.target.value
    setCityQuery(q)
    clearTimeout(debounceRef.current)
    if (q.trim().length < 2) { setCityResults([]); setShowDropdown(false); return }
    debounceRef.current = setTimeout(async () => {
      setCityLoading(true)
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(q)}&countrycodes=in&limit=8`
        const res  = await fetch(url, { headers: { 'Accept-Language': 'en' } })
        const data = await res.json()
        setCityResults(data)
        setShowDropdown(data.length > 0)
      } catch {
        setCityResults([])
        setShowDropdown(false)
      } finally {
        setCityLoading(false)
      }
    }, 300)
  }

  function handleCitySelect(result) {
    const { name, subtitle } = formatCityResult(result)
    const label  = subtitle ? `${name}, ${subtitle}` : name
    const picked = { label, lat: parseFloat(result.lat), lon: parseFloat(result.lon), tz: 'Asia/Kolkata' }
    setCity(picked)
    setCityQuery(label)
    setCityResults([])
    setShowDropdown(false)
  }

  function handleCalculate() {
    setError('')
    setComputing(true)
    try {
      const dayNum   = parseInt(day,   10)
      const monthNum = parseInt(month, 10)
      const yearNum  = parseInt(year,  10)
      if (!dayNum || !monthNum || !yearNum)
        throw new Error('Please select a complete date of birth.')

      let h24 = parseInt(hour, 10)
      const min = parseInt(minute, 10)
      if (period === 'PM' && h24 !== 12) h24 += 12
      if (period === 'AM' && h24 === 12) h24 = 0

      const result = computeKundali(_swe, yearNum, monthNum, dayNum, h24, min, city)
      setChart(result)
      setChartView('d1')
      setActiveTab('chart')
    } catch (e) {
      setError(e.message || 'Calculation failed. Please check your inputs.')
    } finally {
      setComputing(false)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navamsaChart = useMemo(() => chart ? computeNavamsa(chart) : null, [chart])
  const moon         = useMemo(() => chart?.grahas.find(g => g.id === 'Mo') ?? null, [chart])

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 py-12 w-full">
      <div className="w-full max-w-5xl flex flex-col gap-8">

        {/* ── Section header ── */}
        <div className="text-center flex flex-col gap-2">
          <p className="text-violet-400/70 text-xs uppercase tracking-[0.3em] font-medium">
            Jyotish Shastra
          </p>
          <h2 className="text-3xl font-bold text-white">
            <span className="shimmer-text">Vedic Kundali</span>
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto leading-relaxed mt-1">
            Your precise North Indian birth chart, calculated from the positions of all 9 Grahas
            using the Lahiri sidereal ayanamsha.
          </p>
        </div>

        {/* ── Input card ── */}
        <div
          className="rounded-2xl px-5 py-6 flex flex-col gap-5"
          style={{
            background: 'rgba(10,8,28,0.8)',
            border: '1px solid rgba(99,102,241,0.2)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(99,102,241,0.06)',
          }}
        >
          <p className="text-xs uppercase tracking-[0.22em] text-indigo-400/70 font-semibold">
            Birth Details
          </p>

          {/* ── Date of Birth — DD / MM / YYYY ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest text-slate-500">
              Date of Birth
            </label>
            <div className="grid grid-cols-3 gap-2">
              <KSel value={day} onChange={v => { setDay(v); setChart(null) }} placeholder="Day">
                {K_DAYS.map(d => (
                  <option key={d} value={d} style={{ background: '#0a081c' }}>
                    {String(d).padStart(2, '0')}
                  </option>
                ))}
              </KSel>

              <KSel value={month} onChange={v => { setMonth(v); setChart(null) }} placeholder="Month">
                {K_MONTHS.map((m, i) => (
                  <option key={m} value={i + 1} style={{ background: '#0a081c' }}>
                    {m}
                  </option>
                ))}
              </KSel>

              <KSel value={year} onChange={v => { setYear(v); setChart(null) }} placeholder="Year">
                {K_YEARS.map(y => (
                  <option key={y} value={y} style={{ background: '#0a081c' }}>
                    {y}
                  </option>
                ))}
              </KSel>
            </div>
            <p className="text-xs text-slate-700 pl-1">Day / Month / Year</p>
          </div>

          {/* ── Time & City ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Time of Birth — HH / MM / AM·PM */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-widest text-slate-500">
                Time of Birth
              </label>
              <div className="grid grid-cols-3 gap-2">
                <KSel value={hour} onChange={setHour}>
                  {K_HOURS.map(h => (
                    <option key={h} value={h} style={{ background: '#0a081c' }}>
                      {h.padStart(2, '0')}
                    </option>
                  ))}
                </KSel>

                <KSel value={minute} onChange={setMinute}>
                  {K_MINUTES.map(m => (
                    <option key={m} value={m} style={{ background: '#0a081c' }}>
                      {m}
                    </option>
                  ))}
                </KSel>

                <KSel value={period} onChange={setPeriod}>
                  {['AM', 'PM'].map(p => (
                    <option key={p} value={p} style={{ background: '#0a081c' }}>
                      {p}
                    </option>
                  ))}
                </KSel>
              </div>
              <p className="text-xs text-slate-700 pl-1">Hour / Minute / AM · PM</p>
            </div>

            {/* Birth City — Nominatim autocomplete */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-widest text-slate-500">
                Birth City
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cityQuery}
                  onChange={handleCityInput}
                  onFocus={() => cityResults.length > 0 && setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 160)}
                  placeholder="Search any Indian city…"
                  className={KSEL_CLS}
                  style={{ ...KSEL_BASE, color: '#e2e8f0', textAlign: 'left', paddingLeft: '0.85rem' }}
                  autoComplete="off"
                  spellCheck={false}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400/70 text-base select-none">
                  {cityLoading ? '⟳' : '⌕'}
                </div>

                {showDropdown && cityResults.length > 0 && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-2xl overflow-hidden"
                    style={{
                      background: 'rgba(8,6,22,0.97)',
                      border: '1px solid rgba(99,102,241,0.35)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.7), 0 0 28px rgba(99,102,241,0.1)',
                    }}
                  >
                    {cityResults.map(result => {
                      const { name, subtitle } = formatCityResult(result)
                      return (
                        <button
                          key={result.place_id}
                          onMouseDown={() => handleCitySelect(result)}
                          className="w-full text-left px-4 py-2.5 flex flex-col gap-0.5 border-b border-white/[0.04] last:border-none cursor-pointer"
                          style={{ background: 'transparent', transition: 'background 0.1s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.13)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                        >
                          <span className="text-sm font-medium text-white leading-snug">{name}</span>
                          {subtitle && (
                            <span className="text-[10px] text-slate-500 leading-none">{subtitle}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coords preview */}
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {[
              ['Latitude',  `${city.lat >= 0 ? city.lat + '° N' : Math.abs(city.lat) + '° S'}`],
              ['Longitude', `${city.lon >= 0 ? city.lon + '° E' : Math.abs(city.lon) + '° W'}`],
              ['Timezone',  city.tz],
            ].map(([k,v]) => (
              <span key={k} className="text-[10px] text-slate-600">
                <span className="text-slate-500">{k}: </span>{v}
              </span>
            ))}
          </div>

          {/* WASM status indicator */}
          {!sweReady && (
            <p className="text-[10px] text-indigo-400/60 text-center animate-pulse">
              ◌ Loading ephemeris engine…
            </p>
          )}

          {/* Calculate button */}
          <button
            onClick={handleCalculate}
            disabled={computing || !canCalculate}
            className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#fff',
              border: '1px solid rgba(99,102,241,0.5)',
              boxShadow: '0 0 24px rgba(99,102,241,0.35)',
            }}
          >
            {computing ? '✦ Calculating…' : '◈ Generate Kundali'}
          </button>

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}
        </div>

        {/* ── Chart results ── */}
        {chart && (
          <div className="chakra-card-in flex flex-col gap-5">

            {/* Identity bar — always visible */}
            <div
              className="rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-3"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Lagna (Ascendant)</p>
                <p className="text-white font-bold text-lg">
                  {chart.lagnaSymbol} {chart.lagnaRashiName}
                  <span className="text-slate-400 text-sm font-normal ml-2">{chart.lagnaDegs}°</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">UTC birth time</p>
                <p className="text-xs font-mono text-slate-400">{chart.utcISO.replace('T',' ').replace('.000Z',' UTC')}</p>
              </div>
            </div>

            {/* ── Tab navigation ── */}
            <div
              className="flex gap-1 rounded-xl p-1"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,102,241,0.15)' }}
            >
              {[
                { key: 'chart',     label: 'Chart' },
                { key: 'mahadasha', label: 'Mahadasha' },
                { key: 'doshas',    label: 'Doshas' },
                { key: 'transits',  label: 'Transits' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className="flex-1 py-2 rounded-lg text-[9.5px] uppercase tracking-widest font-semibold transition-all"
                  style={{
                    background: activeTab === key ? 'rgba(99,102,241,0.28)' : 'transparent',
                    color:      activeTab === key ? '#a5b4fc' : '#475569',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── Chart tab ── */}
            <div style={{ display: activeTab === 'chart' ? 'flex' : 'none', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* Left: chart with D1/D9 toggle */}
                <div
                  className="rounded-2xl overflow-hidden p-4"
                  style={{
                    background: 'rgba(4,3,14,0.9)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    boxShadow: '0 0 48px rgba(99,102,241,0.12), 0 8px 32px rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(99,102,241,0.2)' }}>
                      {[{ key: 'd1', label: 'D1 · Rashi' }, { key: 'd9', label: 'D9 · Navamsa' }].map(({ key, label }) => (
                        <button
                          key={key}
                          onClick={() => setChartView(key)}
                          className="px-3 py-1 text-[8.5px] uppercase tracking-widest font-semibold transition-colors"
                          style={{
                            background: chartView === key ? 'rgba(99,102,241,0.28)' : 'transparent',
                            color:      chartView === key ? '#a5b4fc' : '#475569',
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    {chartView === 'd9' && navamsaChart && (
                      <span className="text-[9px] font-mono" style={{ color: 'rgba(99,102,241,0.5)' }}>
                        Lagna {navamsaChart.lagnaSymbol} {navamsaChart.lagnaRashiName}
                      </span>
                    )}
                  </div>
                  <NorthIndianChart chart={chartView === 'd1' ? chart : navamsaChart} />
                  {chartView === 'd9' && (
                    <p className="text-[9px] text-slate-700 mt-3 text-center leading-relaxed px-2">
                      Navamsa reflects the strength of planets and matters related to marriage and inner life.
                    </p>
                  )}
                </div>

                {/* Right: Graha table */}
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: 'rgba(10,8,28,0.85)',
                    border: '1px solid rgba(99,102,241,0.18)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 mb-3 text-center">
                    Graha Positions · Sidereal
                  </p>
                  <GrahaTable chart={chart} />
                </div>
              </div>
            </div>

            {/* ── Mahadasha tab ── */}
            <div style={{ display: activeTab === 'mahadasha' ? 'block' : 'none' }}>
              {moon && <VedicDasha moonSidLon={moon.sidLon} birthDate={new Date(chart.utcISO)} />}
            </div>

            {/* ── Doshas tab ── */}
            <div style={{ display: activeTab === 'doshas' ? 'flex' : 'none', flexDirection: 'column', gap: '1rem' }}>
              <MangalDosha chart={chart} />
              <KalsarpaDosha chart={chart} />
            </div>

            {/* ── Transits tab ── */}
            <div style={{ display: activeTab === 'transits' ? 'block' : 'none' }}>
              {moon && <Transit swe={_swe} natalMoonRashi={moon.rashiIdx} />}
            </div>

            <p className="text-center text-slate-700 text-[11px]">
              Positions calculated using Swiss Ephemeris WASM (Moshier) with Lahiri ayanamsha. For ceremonial use, verify with a licensed Jyotishi.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
