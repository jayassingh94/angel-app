import { useState, useRef, useEffect } from 'react'
import { SwissEphemeris } from '@swisseph/browser'
import VedicDasha from './VedicDasha.jsx'
import MangalDosha from './MangalDosha.jsx'

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

// House positions in the 4×4 grid: [houseNum, row, col]
const HOUSE_GRID = [
  [12,0,0],[1,0,1],[2,0,2],[3,0,3],
  [11,1,0],[4,1,3],
  [10,2,0],[5,2,3],
  [9,3,0],[8,3,1],[7,3,2],[6,3,3],
]
const CORNER_HOUSES = new Set([12,3,6,9])

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
    ayanamsha:      ay.toFixed(4),
    grahas,
    utcISO:         utcDate.toISOString(),
  }
}

// ── SVG chart ─────────────────────────────────────────────────────────────────

const CELL = 92
const SVG_S = CELL * 4  // 368

function NorthIndianChart({ chart }) {
  const accent = '#6366f1'

  const planetsByHouse = {}
  for (let i = 1; i <= 12; i++) planetsByHouse[i] = []
  chart.grahas.forEach(g => planetsByHouse[g.houseNum].push({ id: g.id, color: g.color }))

  const rashiInHouse = h => (chart.lagnaRashi + h - 1) % 12

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${SVG_S} ${SVG_S}`}
      style={{ maxWidth: SVG_S, display: 'block' }}
    >
      <rect width={SVG_S} height={SVG_S} fill="rgba(4,3,14,0.98)" rx={2} />

      <rect x={1} y={1} width={SVG_S-2} height={SVG_S-2}
        fill="none" stroke={accent} strokeWidth={1.5} opacity={0.55} rx={2} />

      {[1,2,3].map(i => (
        <g key={i}>
          <line x1={i*CELL} y1={0} x2={i*CELL} y2={SVG_S}
            stroke={accent} strokeWidth={0.5} opacity={0.2} />
          <line x1={0} y1={i*CELL} x2={SVG_S} y2={i*CELL}
            stroke={accent} strokeWidth={0.5} opacity={0.2} />
        </g>
      ))}

      <rect x={CELL+1} y={CELL+1} width={CELL*2-2} height={CELL*2-2}
        fill={`${accent}08`} stroke={accent} strokeWidth={0.8} opacity={0.5} />
      <text x={CELL*2} y={CELL*2 - 8}
        textAnchor="middle" fill={accent} fontSize={30} opacity={0.25}
        fontFamily="serif">ॐ</text>
      <text x={CELL*2} y={CELL*2 + 14}
        textAnchor="middle" fill={accent} fontSize={7.5}
        letterSpacing="2.5" opacity={0.2} fontFamily="monospace">KUNDALI</text>

      <text x={CELL*2} y={CELL*2 + 32}
        textAnchor="middle" fill={accent} fontSize={8} opacity={0.4} fontFamily="monospace">
        {`${chart.lagnaRashiName} ${chart.lagnaDegs}°`}
      </text>

      {HOUSE_GRID.map(([houseNum, row, col]) => {
        const x = col * CELL
        const y = row * CELL
        const planets  = planetsByHouse[houseNum]
        const rashiIdx = rashiInHouse(houseNum)
        const isCorner = CORNER_HOUSES.has(houseNum)
        const isLagna  = houseNum === 1

        return (
          <g key={houseNum}>
            {isLagna && (
              <rect x={x+1} y={y+1} width={CELL-2} height={CELL-2}
                fill={`${accent}14`} />
            )}

            {isCorner && (
              <>
                <line x1={x} y1={y} x2={x+CELL} y2={y+CELL}
                  stroke={accent} strokeWidth={0.6} opacity={0.22} />
                <line x1={x+CELL} y1={y} x2={x} y2={y+CELL}
                  stroke={accent} strokeWidth={0.6} opacity={0.22} />
              </>
            )}

            <text x={x+5} y={y+13} fontSize={8}
              fill={isLagna ? accent : `${accent}80`}
              fontFamily="monospace" fontWeight={isLagna ? 'bold' : 'normal'}>
              {houseNum}
            </text>

            <text x={x+CELL-5} y={y+13} fontSize={7.5}
              fill={`${accent}60`} textAnchor="end" fontFamily="monospace">
              {rashiIdx + 1}
            </text>

            <text x={x+CELL-4} y={y+CELL-4} fontSize={9}
              fill={`${accent}40`} textAnchor="end">
              {RASHI_SYMS[rashiIdx]}
            </text>

            {isLagna && (
              <text x={x+CELL/2} y={y+CELL-6} fontSize={7.5}
                fill={accent} textAnchor="middle" fontWeight="bold"
                fontFamily="monospace" opacity={0.8}>
                Asc
              </text>
            )}

            {planets.map(({ id, color }, i) => {
              const rows  = Math.ceil(planets.length / 2)
              const col2  = i % 2
              const row2  = Math.floor(i / 2)
              const totalH = rows * 15
              const startY = CELL / 2 - totalH / 2 + 18 + row2 * 15
              const px = col2 === 0 && planets.length % 2 !== 0 && i === planets.length - 1
                ? x + CELL / 2
                : col2 === 0 ? x + CELL * 0.3 : x + CELL * 0.7

              return (
                <text key={id}
                  x={planets.length <= 2 ? x + CELL / 2 - (planets.length === 2 ? (col2 === 0 ? 11 : -11) : 0) : px}
                  y={y + startY}
                  fontSize={10.5} fontWeight="bold"
                  fill={color}
                  textAnchor="middle"
                  fontFamily="monospace"
                  style={{ filter: `drop-shadow(0 0 3px ${color})` }}
                >
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
    } catch (e) {
      setError(e.message || 'Calculation failed. Please check your inputs.')
    } finally {
      setComputing(false)
    }
  }

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
          <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed mt-1">
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
          <p className="text-[10px] uppercase tracking-[0.22em] text-indigo-400/70 font-semibold">
            Birth Details
          </p>

          {/* ── Date of Birth — DD / MM / YYYY ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-slate-500">
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
            <p className="text-[9px] text-slate-700 pl-1">Day / Month / Year</p>
          </div>

          {/* ── Time & City ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Time of Birth — HH / MM / AM·PM */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-slate-500">
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
              <p className="text-[9px] text-slate-700 pl-1">Hour / Minute / AM · PM</p>
            </div>

            {/* Birth City — Nominatim autocomplete */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-slate-500">
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
                          <span className="text-[13px] font-medium text-white leading-snug">{name}</span>
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
          <div className="chakra-card-in flex flex-col gap-6">

            {/* Chart identity bar */}
            <div
              className="rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-3"
              style={{
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
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

            {/* Split layout: chart SVG | graha table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

              {/* Left: North Indian chart */}
              <div
                className="rounded-2xl overflow-hidden p-4"
                style={{
                  background: 'rgba(4,3,14,0.9)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  boxShadow: '0 0 48px rgba(99,102,241,0.12), 0 8px 32px rgba(0,0,0,0.5)',
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 mb-3 text-center">
                  North Indian Rasi Chart
                </p>
                <NorthIndianChart chart={chart} />
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

            {/* Doshas section */}
            <MangalDosha chart={chart} />

            {/* Dasha section */}
            {(() => {
              const moon = chart.grahas.find(g => g.id === 'Mo')
              return moon
                ? <VedicDasha moonSidLon={moon.sidLon} birthDate={new Date(chart.utcISO)} />
                : null
            })()}

            <p className="text-center text-slate-700 text-[11px]">
              Positions calculated using Swiss Ephemeris WASM (Moshier) with Lahiri ayanamsha. For ceremonial use, verify with a licensed Jyotishi.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
