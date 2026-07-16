import { useState, useRef, useEffect, useMemo } from 'react'
import { SwissEphemeris } from '@swisseph/browser'
import VedicDasha from './VedicDasha.jsx'
import MangalDosha from './MangalDosha.jsx'
import KalsarpaDosha from './KalsarpaDosha.jsx'
import { computeNavamsa } from '../utils/navamsa.js'
import { computeDashamsha } from '../utils/dashamsha.js'
import Transit from './Transit.jsx'
import LifeReport from './LifeReport.jsx'

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
const SIGN_LORDS  = ['Ma','Ve','Me','Mo','Su','Me','Ve','Ma','Ju','Sa','Sa','Ju']

const NAKSHATRAS = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra',
  'Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni',
  'Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
  'Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha',
  'Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati',
]
// Vimshottari nakshatra lord cycle (repeats 3×9 = 27)
const NK_LORDS = ['Ke','Ve','Su','Mo','Ma','Ra','Ju','Sa','Me']

function getNakshatra(sidLon) {
  const span = 360 / 27
  const idx  = Math.floor(sidLon / span)
  const pada = Math.floor((sidLon % span) / (span / 4)) + 1
  return { idx, pada }
}

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

// North Indian diamond layout: 12 positions ordered counter-clockwise from H1 (index 0).
// Traditional convention: H2 is to the LEFT of H1, H4 at left-center, H10 at right-center.
// NO pre-assigned house numbers — they are derived at render time from NI_LAGNA_POS.
// Each entry: [[[x1,y1],[x2,y2],[x3,y3]], [labelX, labelY]]
const NI_POSITIONS = [
  [[[200,0],[100,100],[300,100]],   [200, 26]],   // 0  → H1  top-center (Lagna)
  [[[0,0],[200,0],[100,100]],       [37, 22]],    // 1  → H2  top-left corner
  [[[0,0],[0,200],[100,100]],       [16, 80]],    // 2  → H3  left-upper
  [[[0,200],[100,100],[100,300]],   [38, 200]],   // 3  → H4  left-center
  [[[0,400],[0,200],[100,300]],     [16, 320]],   // 4  → H5  left-lower
  [[[0,400],[200,400],[100,300]],   [37, 380]],   // 5  → H6  bottom-left corner
  [[[200,400],[300,300],[100,300]], [200, 382]],  // 6  → H7  bottom-center
  [[[400,400],[200,400],[300,300]], [363, 380]],  // 7  → H8  bottom-right corner
  [[[400,400],[400,200],[300,300]], [384, 320]],  // 8  → H9  right-lower
  [[[400,200],[300,100],[300,300]], [362, 200]],  // 9  → H10 right-center
  [[[400,0],[400,200],[300,100]],   [384, 80]],   // 10 → H11 right-upper
  [[[200,0],[400,0],[300,100]],     [363, 22]],   // 11 → H12 top-right corner
]

// Single source of truth: Lagna (H1) is ALWAYS at position index 0.
// house number for any position = ((posIdx - NI_LAGNA_POS + 12) % 12) + 1
const NI_LAGNA_POS = 0

// South Indian fixed sign grid (0-indexed rashi, -1 = center blank cell)
const SI_GRID = [
  [ 0,  1,  2,  3],  // Ar Ta Ge Ca
  [11, -1, -1,  4],  // Pi  _  _ Le
  [10, -1, -1,  5],  // Aq  _  _ Vi
  [ 9,  8,  7,  6],  // Cp Sg Sc Li
]

// Distinct planet colors for the light chart background
const PLANET_CHART_COLOR = {
  Su: '#ea580c', // orange
  Mo: '#64748b', // silver-grey
  Ma: '#dc2626', // red
  Me: '#16a34a', // green
  Ju: '#ca8a04', // yellow (distinct from Su orange)
  Ve: '#c026d3', // magenta/fuchsia
  Sa: '#1e3a8a', // dark blue
  Ra: '#2563eb', // blue (distinct from Sa)
  Ke: '#92400e', // brown/maroon
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
  const lineC = '#2d2a50'
  const lineW = 1.2

  // ── Single source of truth ──────────────────────────────────────────────────
  // NI_LAGNA_POS is the one constant that drives EVERYTHING below.
  // houseAtPos derives the house number for any position from it.
  // isLagna derives the Asc marker position from it.
  // They share the same root, so they can never disagree.
  const houseAtPos = posIdx => ((posIdx - NI_LAGNA_POS + 12) % 12) + 1

  // Build planet map keyed by house number
  const planetsByHouse = {}
  for (let i = 1; i <= 12; i++) planetsByHouse[i] = []
  chart.grahas.forEach(g => planetsByHouse[g.houseNum].push(g.id))

  // ── Diagnostic console output ───────────────────────────────────────────────
  const houseNumberMap = Object.fromEntries(NI_POSITIONS.map((_, i) => [i, houseAtPos(i)]))
  console.log('[NorthIndianChart] lagnaRashi:', chart.lagnaRashi, '(' + RASHI_SHORT[chart.lagnaRashi] + ')')
  console.log('[NorthIndianChart] Asc renders in position:', NI_LAGNA_POS)
  console.log('[NorthIndianChart] House numbers assigned (posIdx→houseNum):', houseNumberMap)
  console.log('[NorthIndianChart] Verify: position', NI_LAGNA_POS, '→ house', houseAtPos(NI_LAGNA_POS), '(must be 1)')

  return (
    <svg width="100%" viewBox={`0 0 ${S} ${S}`} style={{ display: 'block' }}>
      {/* White background */}
      <rect width={S} height={S} fill="#fff" />

      {/* H1 Lagna accent — position 0 is always top-center */}
      <polygon points="200,0 100,100 300,100" fill="rgba(79,70,229,0.08)" />

      {/* Outer border */}
      <rect x={0.5} y={0.5} width={S-1} height={S-1} fill="none" stroke={lineC} strokeWidth={1.5} />

      {/* Full corner-to-corner diagonals */}
      <line x1={0} y1={0} x2={S} y2={S} stroke={lineC} strokeWidth={lineW} />
      <line x1={S} y1={0} x2={0} y2={S} stroke={lineC} strokeWidth={lineW} />

      {/* Edge-midpoint → inner-corner lines */}
      <line x1={200} y1={0}   x2={100} y2={100} stroke={lineC} strokeWidth={lineW} />
      <line x1={200} y1={0}   x2={300} y2={100} stroke={lineC} strokeWidth={lineW} />
      <line x1={S}   y1={200} x2={300} y2={100} stroke={lineC} strokeWidth={lineW} />
      <line x1={S}   y1={200} x2={300} y2={300} stroke={lineC} strokeWidth={lineW} />
      <line x1={200} y1={S}   x2={300} y2={300} stroke={lineC} strokeWidth={lineW} />
      <line x1={200} y1={S}   x2={100} y2={300} stroke={lineC} strokeWidth={lineW} />
      <line x1={0}   y1={200} x2={100} y2={300} stroke={lineC} strokeWidth={lineW} />
      <line x1={0}   y1={200} x2={100} y2={100} stroke={lineC} strokeWidth={lineW} />

      {NI_POSITIONS.map(([pts, [lx, ly]], posIdx) => {
        // houseNum and isLagna both derived from the same NI_LAGNA_POS — one source
        const houseNum = houseAtPos(posIdx)
        const isLagna  = posIdx === NI_LAGNA_POS
        const planets  = planetsByHouse[houseNum]
        const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3
        const cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3
        const signIdx = (chart.lagnaRashi + houseNum - 1) % 12

        const cols  = planets.length > 2 ? 2 : 1
        const lineH = 13
        const rows  = Math.ceil(planets.length / cols)
        const totalH = rows * lineH
        const baseY = isLagna
          ? cy + 13
          : cy - totalH / 2 + lineH * 0.75

        return (
          <g key={posIdx}>
            {/* House number label at apex — derived from NI_LAGNA_POS, not hardcoded */}
            <text x={lx} y={ly} textAnchor="middle" fontSize={9}
              fontFamily="Georgia, 'Times New Roman', serif" fontWeight="600"
              fill={isLagna ? '#3730a3' : '#6b64a8'}>
              {houseNum}
            </text>
            {/* Rashi abbreviation below house number */}
            <text x={lx} y={ly + 10} textAnchor="middle" fontSize={6.5}
              fontFamily="monospace"
              fill={isLagna ? '#4f46e5' : '#9090c0'}>
              {RASHI_SHORT[signIdx]}
            </text>

            {/* "Asc" marker — same condition as house "1" label, both from NI_LAGNA_POS */}
            {isLagna && (
              <text x={cx} y={planets.length > 0 ? cy - 1 : cy + 5}
                textAnchor="middle" fontSize={9} fontWeight="bold"
                fontFamily="monospace" fill="#3730a3">
                Asc
              </text>
            )}

            {/* Planet abbreviations */}
            {planets.map((id, i) => {
              const row = Math.floor(i / cols)
              const col = i % cols
              const xOdd = cols === 2 && planets.length % 2 !== 0 && i === planets.length - 1
              const colOff = cols === 2 ? (col === 0 ? -11 : 11) : 0
              return (
                <text key={id}
                  x={xOdd ? cx : cx + colOff}
                  y={baseY + row * lineH}
                  textAnchor="middle" fontSize={10.5} fontWeight="bold"
                  fontFamily="monospace"
                  fill={PLANET_CHART_COLOR[id] ?? '#1e293b'}>
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

// ── South Indian chart ────────────────────────────────────────────────────────

function SouthIndianChart({ chart }) {
  const S = 400
  const CS = 100
  const lineColor = 'rgba(100,90,160,0.35)'

  // House number for any rashi cell: derived from lagnaRashi, same formula as grahas
  const houseOfRashi = rashiIdx => ((rashiIdx - chart.lagnaRashi + 12) % 12) + 1

  const planetsByRashi = {}
  for (let i = 0; i < 12; i++) planetsByRashi[i] = []
  chart.grahas.forEach(g => planetsByRashi[g.rashiIdx].push(g.id))

  // ── Diagnostic console output ───────────────────────────────────────────────
  console.log('[SouthIndianChart] lagnaRashi:', chart.lagnaRashi, '(' + RASHI_SHORT[chart.lagnaRashi] + ')')
  console.log('[SouthIndianChart] Asc renders in rashiIdx:', chart.lagnaRashi)
  console.log('[SouthIndianChart] House number at Asc cell:', houseOfRashi(chart.lagnaRashi), '(must be 1)')

  return (
    <svg width="100%" viewBox={`0 0 ${S} ${S}`} style={{ maxWidth: S, display: 'block', borderRadius: 6 }}>
      <rect width={S} height={S} fill="#f5f3ee" rx={6} />

      {SI_GRID.map((row, ri) =>
        row.map((rashiIdx, ci) => {
          const x = ci * CS
          const y = ri * CS
          const isCenter = rashiIdx === -1

          if (isCenter) {
            return (
              <rect key={`${ri}-${ci}`} x={x} y={y} width={CS} height={CS}
                fill="rgba(99,102,241,0.04)" stroke={lineColor} strokeWidth={0.7} />
            )
          }

          const isLagna  = rashiIdx === chart.lagnaRashi
          const houseNum = houseOfRashi(rashiIdx)  // derived, not hardcoded
          const planets  = planetsByRashi[rashiIdx]
          const cx = x + CS / 2
          const cy = y + CS / 2

          const cols  = planets.length > 2 ? 2 : 1
          const lineH = 13
          const rows  = Math.ceil(planets.length / cols)
          const totalH = rows * lineH
          const baseY  = cy - totalH / 2 + lineH * 0.7 + (isLagna && planets.length > 0 ? 6 : 0)

          return (
            <g key={`${ri}-${ci}`}>
              <rect x={x} y={y} width={CS} height={CS}
                fill={isLagna ? 'rgba(99,102,241,0.08)' : 'transparent'}
                stroke={lineColor} strokeWidth={0.7} />

              {/* House number — derived from lagnaRashi, same source as isLagna */}
              <text x={x + 5} y={y + 13} fontSize={8}
                fill={isLagna ? '#3730a3' : '#9898b8'} fontFamily="monospace"
                fontWeight={isLagna ? 'bold' : 'normal'}>
                {houseNum}
              </text>
              <text x={x + CS - 4} y={y + 13} fontSize={7} fill="#8888a8" fontFamily="monospace" textAnchor="end">
                {RASHI_SHORT[rashiIdx]}
              </text>

              {isLagna && (
                <text x={cx} y={cy - (planets.length > 0 ? 10 : 0)}
                  fontSize={8} fill="#5048a8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
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
                    textAnchor="middle" fontSize={9} fontWeight="bold"
                    fill={PLANET_CHART_COLOR[id] ?? '#334155'}
                    fontFamily="monospace">
                    {id}
                  </text>
                )
              })}
            </g>
          )
        })
      )}

      <rect x={0.5} y={0.5} width={S - 1} height={S - 1} fill="none" stroke={lineColor} strokeWidth={1.2} rx={5.5} />
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

// ── Planet data table (Sign / Nakshatra toggle) ───────────────────────────────

function getDMS(sidLon) {
  const raw  = sidLon % 30
  const d    = Math.floor(raw)
  const mRaw = (raw - d) * 60
  const m    = Math.floor(mRaw)
  const s    = Math.floor((mRaw - m) * 60)
  return { d, m, s }
}

const PT_SIGN_COLS = '6.5rem 1fr 4.5rem 6.5rem 2.6rem'
const PT_NAK_COLS  = '6.5rem 1fr 4.5rem 3rem  2.6rem'

function PlanetTable({ chart }) {
  const [view, setView] = useState('sign')

  const { d: aD, m: aM, s: aS } = getDMS(chart.lagnaSidLon)

  const rows = [
    {
      id: 'Asc', name: 'Ascendant', symbol: '⬆', color: '#6366f1',
      sidLon: chart.lagnaSidLon, rashiIdx: chart.lagnaRashi,
      houseNum: 1,
    },
    ...chart.grahas,
  ]

  const cols    = view === 'sign' ? PT_SIGN_COLS : PT_NAK_COLS
  const headers = view === 'sign'
    ? ['Planet', 'Sign', 'Sign Lord', 'Degree', 'H']
    : ['Planet', 'Nakshatra', 'Nak. Lord', 'Pada', 'H']

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#ffffff',
        border: '1px solid #d1cfe8',
        boxShadow: '0 4px 20px rgba(45,42,80,0.12)',
      }}
    >
      {/* Section header + toggle */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: '#f7f6fc', borderBottom: '1px solid #e2dff0' }}
      >
        <p className="text-sm font-bold tracking-wide" style={{ color: '#2d2a50' }}>Planets</p>
        <div
          className="flex rounded-lg overflow-hidden"
          style={{ border: '1px solid rgba(100,90,160,0.28)' }}
        >
          {[{ v: 'sign', label: 'Sign' }, { v: 'nakshatra', label: 'Nakshatra' }].map(({ v, label }) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3 py-1 text-xs font-semibold transition-colors cursor-pointer"
              style={{
                background: view === v ? 'rgba(99,102,241,0.14)' : 'transparent',
                color:      view === v ? '#4f46e5' : '#94a3b8',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Column headers */}
      <div
        className="grid px-4 py-2"
        style={{
          gridTemplateColumns: cols,
          background: '#eeedf8',
          borderBottom: '1px solid #d1cfe8',
        }}
      >
        {headers.map(h => (
          <span key={h} className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#4338ca' }}>
            {h}
          </span>
        ))}
      </div>

      {/* Data rows */}
      {rows.map((row, i) => {
        const isAsc = row.id === 'Asc'
        const nak   = getNakshatra(row.sidLon)
        const lord  = view === 'sign' ? SIGN_LORDS[row.rashiIdx] : NK_LORDS[nak.idx % 9]
        const { d, m, s } = getDMS(row.sidLon)

        return (
          <div
            key={row.id}
            className="grid items-center px-4 py-2"
            style={{
              gridTemplateColumns: cols,
              background: i % 2 === 0 ? '#f3f2fa' : '#ffffff',
              borderBottom: '1px solid #e8e6f4',
            }}
          >
            {/* Planet */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span style={{ color: isAsc ? '#6366f1' : row.color, fontSize: 14 }}>
                {row.symbol}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold font-mono leading-tight"
                  style={{ color: isAsc ? '#4f46e5' : '#1e293b' }}>
                  {row.id}
                </p>
                <p className="text-[8.5px] leading-tight truncate" style={{ color: '#94a3b8' }}>
                  {row.name}
                </p>
              </div>
            </div>

            {/* Sign / Nakshatra */}
            {view === 'sign' ? (
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-sm" style={{ color: '#475569' }}>{RASHI_SYMS[row.rashiIdx]}</span>
                <span className="text-[10px] font-medium truncate" style={{ color: '#334155' }}>
                  {RASHIS[row.rashiIdx]}
                </span>
              </div>
            ) : (
              <span className="text-[10px] font-medium truncate pr-1" style={{ color: '#334155' }}>
                {NAKSHATRAS[nak.idx]}
              </span>
            )}

            {/* Sign Lord / Nak Lord */}
            <span className="text-[10px] font-bold font-mono"
              style={{ color: PLANET_CHART_COLOR[lord] ?? '#475569' }}>
              {lord}
            </span>

            {/* Degree DD°MM′SS″ / Pada */}
            {view === 'sign' ? (
              <span className="text-[10px] font-mono" style={{ color: '#475569' }}>
                {String(d).padStart(2,'0')}°{String(m).padStart(2,'0')}′{String(s).padStart(2,'0')}″
              </span>
            ) : (
              <span className="text-sm font-bold font-mono" style={{ color: '#475569' }}>
                {nak.pada}
              </span>
            )}

            {/* House */}
            <span className="text-xs font-bold font-mono text-center"
              style={{ color: isAsc ? '#6366f1' : '#64748b' }}>
              {row.houseNum}
            </span>
          </div>
        )
      })}

      <p className="text-[8.5px] text-right px-4 py-2" style={{ color: '#c4c4d4' }}>
        Lahiri ayanamsha · Whole-sign houses
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
const KSEL_BASE = { background: 'var(--input-bg)', borderColor: 'var(--input-border)' }

function KSel({ value, onChange, placeholder, children }) {
  const hasPlaceholder = placeholder !== undefined
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={KSEL_CLS}
        style={{ ...KSEL_BASE, color: (!hasPlaceholder || value !== '') ? 'var(--input-text)' : '#64748b' }}
      >
        {hasPlaceholder && (
          <option value="" disabled style={{ color: '#64748b', background: 'var(--option-bg)' }}>
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
  const [topTab,     setTopTab]     = useState('charts')
  const [subTab,     setSubTab]     = useState('lagna')
  const [chartStyle, setChartStyle] = useState('north')
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
      setTopTab('charts')
      setSubTab('lagna')
    } catch (e) {
      setError(e.message || 'Calculation failed. Please check your inputs.')
    } finally {
      setComputing(false)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navamsaChart  = useMemo(() => chart ? computeNavamsa(chart)   : null, [chart])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dashamshaChart = useMemo(() => chart ? computeDashamsha(chart) : null, [chart])
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
            background: 'var(--panel-bg)',
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
                  <option key={d} value={d} style={{ background: 'var(--option-bg)' }}>
                    {String(d).padStart(2, '0')}
                  </option>
                ))}
              </KSel>

              <KSel value={month} onChange={v => { setMonth(v); setChart(null) }} placeholder="Month">
                {K_MONTHS.map((m, i) => (
                  <option key={m} value={i + 1} style={{ background: 'var(--option-bg)' }}>
                    {m}
                  </option>
                ))}
              </KSel>

              <KSel value={year} onChange={v => { setYear(v); setChart(null) }} placeholder="Year">
                {K_YEARS.map(y => (
                  <option key={y} value={y} style={{ background: 'var(--option-bg)' }}>
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
                    <option key={h} value={h} style={{ background: 'var(--option-bg)' }}>
                      {h.padStart(2, '0')}
                    </option>
                  ))}
                </KSel>

                <KSel value={minute} onChange={setMinute}>
                  {K_MINUTES.map(m => (
                    <option key={m} value={m} style={{ background: 'var(--option-bg)' }}>
                      {m}
                    </option>
                  ))}
                </KSel>

                <KSel value={period} onChange={setPeriod}>
                  {['AM', 'PM'].map(p => (
                    <option key={p} value={p} style={{ background: 'var(--option-bg)' }}>
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
                  style={{ ...KSEL_BASE, color: 'var(--input-text)', textAlign: 'left', paddingLeft: '0.85rem' }}
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
                      background: 'var(--dropdown-bg)',
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
          <div className="chakra-card-in flex flex-col gap-0">

            {/* Identity bar */}
            <div
              className="rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 mb-4"
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

            {/* ── Top navigation ── */}
            <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
              {[
                { key: 'basic',       label: 'Basic' },
                { key: 'charts',      label: 'Charts' },
                { key: 'kp',          label: 'KP' },
                { key: 'ashtakvarga', label: 'Ashtakvarga' },
                { key: 'dasha',       label: 'Dasha' },
                { key: 'report',      label: 'Report' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTopTab(key)}
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all"
                  style={{
                    color:        topTab === key ? '#eab308' : '#475569',
                    borderBottom: topTab === key ? '2px solid #eab308' : '2px solid transparent',
                    marginBottom: '-1px',
                    background:   'transparent',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-4">

              {/* ── Basic tab ── */}
              {topTab === 'basic' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <div className="rounded-2xl p-4"
                    style={{ background: 'var(--panel-bg-deep)', border: '1px solid rgba(99,102,241,0.18)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 mb-3 text-center">Graha Positions · Sidereal</p>
                    <GrahaTable chart={chart} />
                  </div>
                  <div className="rounded-2xl p-4 flex flex-col gap-3"
                    style={{ background: 'var(--panel-bg-deep)', border: '1px solid rgba(99,102,241,0.18)' }}>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 text-center">Birth Summary</p>
                    {[
                      ['Lagna',       `${chart.lagnaSymbol} ${chart.lagnaRashiName}  ${chart.lagnaDegs}°`],
                      ['Moon Sign',   `${RASHI_SYMS[chart.grahas.find(g=>g.id==='Mo')?.rashiIdx??0]} ${RASHIS[chart.grahas.find(g=>g.id==='Mo')?.rashiIdx??0]}`],
                      ['Sun Sign',    `${RASHI_SYMS[chart.grahas.find(g=>g.id==='Su')?.rashiIdx??0]} ${RASHIS[chart.grahas.find(g=>g.id==='Su')?.rashiIdx??0]}`],
                      ['Ayanamsha',   `Lahiri ${chart.ayanamsha}°`],
                      ['House System','Whole Sign'],
                    ].map(([k,v]) => (
                      <div key={k} className="flex justify-between items-center py-1.5 border-b" style={{ borderColor: 'rgba(99,102,241,0.1)' }}>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500">{k}</span>
                        <span className="text-sm font-medium text-slate-300">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Charts tab ── */}
              {topTab === 'charts' && (
                <div className="flex flex-col gap-4">
                  {/* Sub-navigation */}
                  <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
                    {[
                      { key: 'lagna',      label: 'Lagna' },
                      { key: 'navamsa',    label: 'Navamsa' },
                      { key: 'dashamsha',  label: 'D10' },
                      { key: 'transit',    label: 'Transit' },
                      { key: 'divisional', label: 'Divisional' },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setSubTab(key)}
                        className="px-4 py-2 text-xs font-medium whitespace-nowrap transition-all"
                        style={{
                          color:        subTab === key ? '#a5b4fc' : '#64748b',
                          borderBottom: subTab === key ? '2px solid #6366f1' : '2px solid transparent',
                          marginBottom: '-1px',
                          background:   'transparent',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Chart style toggle (Lagna + Navamsa + D10 only) */}
                  {(subTab === 'lagna' || subTab === 'navamsa' || subTab === 'dashamsha') && (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-widest text-slate-600">Chart Style</span>
                      <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(99,102,241,0.22)' }}>
                        {[{ key: 'north', label: 'North Indian' }, { key: 'south', label: 'South Indian' }].map(({ key, label }) => (
                          <button
                            key={key}
                            onClick={() => setChartStyle(key)}
                            className="px-3 py-1 text-[9px] uppercase tracking-wider font-semibold transition-colors"
                            style={{
                              background: chartStyle === key ? 'rgba(99,102,241,0.22)' : 'transparent',
                              color:      chartStyle === key ? '#a5b4fc' : '#475569',
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lagna */}
                  {subTab === 'lagna' && (
                    <div className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        {/* Chart canvas */}
                        <div className="flex flex-col gap-0">
                          <div
                            className="rounded-2xl overflow-hidden"
                            style={{
                              background: '#fff',
                              border: '1px solid #d1cfe8',
                              boxShadow: '0 4px 24px rgba(45,42,80,0.18)',
                            }}
                          >
                            {chartStyle === 'north' ? <NorthIndianChart chart={chart} /> : <SouthIndianChart chart={chart} />}
                          </div>
                          <p className="text-[9px] text-center mt-2" style={{ color: '#6060a0' }}>
                            D1 · Rashi Chart &nbsp;·&nbsp; Lahiri Ayanamsha &nbsp;·&nbsp; Whole-Sign Houses
                          </p>
                        </div>

                        {/* Graha table */}
                        <div
                          className="rounded-2xl p-4"
                          style={{
                            background: 'var(--panel-bg-deep)',
                            border: '1px solid rgba(99,102,241,0.2)',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
                          }}
                        >
                          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 mb-3 text-center">
                            Graha Positions · Sidereal
                          </p>
                          <GrahaTable chart={chart} />
                        </div>
                      </div>

                      {/* Planet data table */}
                      <PlanetTable chart={chart} />
                    </div>
                  )}

                  {/* Navamsa */}
                  {subTab === 'navamsa' && navamsaChart && (
                    <div className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        <div className="flex flex-col gap-0">
                          <div
                            className="rounded-2xl overflow-hidden"
                            style={{ background: '#fff', border: '1px solid #d1cfe8', boxShadow: '0 4px 24px rgba(45,42,80,0.18)' }}
                          >
                            {chartStyle === 'north' ? <NorthIndianChart chart={navamsaChart} /> : <SouthIndianChart chart={navamsaChart} />}
                          </div>
                          <p className="text-[9px] text-center mt-2" style={{ color: '#6060a0' }}>
                            D9 · Navamsa &nbsp;·&nbsp; Lagna {navamsaChart.lagnaSymbol} {navamsaChart.lagnaRashiName}
                          </p>
                        </div>
                        <div className="rounded-2xl p-4"
                          style={{ background: 'var(--panel-bg-deep)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 4px 24px rgba(0,0,0,0.35)' }}>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 mb-3 text-center">Navamsa Positions</p>
                          <GrahaTable chart={navamsaChart} />
                        </div>
                      </div>
                      <PlanetTable chart={navamsaChart} />
                      <p className="text-[9px] text-slate-700 text-center">Navamsa reflects the strength of planets and matters related to marriage and inner life.</p>
                    </div>
                  )}

                  {/* D10 Dashamsha */}
                  {subTab === 'dashamsha' && dashamshaChart && (
                    <div className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        <div className="flex flex-col gap-0">
                          <div
                            className="rounded-2xl overflow-hidden"
                            style={{ background: '#fff', border: '1px solid #d1cfe8', boxShadow: '0 4px 24px rgba(45,42,80,0.18)' }}
                          >
                            {chartStyle === 'north' ? <NorthIndianChart chart={dashamshaChart} /> : <SouthIndianChart chart={dashamshaChart} />}
                          </div>
                          <p className="text-[9px] text-center mt-2" style={{ color: '#6060a0' }}>
                            D10 · Dashamsha &nbsp;·&nbsp; Lagna {dashamshaChart.lagnaSymbol} {dashamshaChart.lagnaRashiName}
                          </p>
                        </div>
                        <div className="rounded-2xl p-4"
                          style={{ background: 'var(--panel-bg-deep)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 4px 24px rgba(0,0,0,0.35)' }}>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 mb-3 text-center">Dashamsha Positions</p>
                          <GrahaTable chart={dashamshaChart} />
                        </div>
                      </div>
                      <PlanetTable chart={dashamshaChart} />
                      <p className="text-[9px] text-slate-700 text-center">
                        Dashamsha reflects career, profession, and public standing.
                      </p>
                    </div>
                  )}

                  {/* Transit */}
                  {subTab === 'transit' && (
                    <div>
                      {moon && <Transit swe={_swe} natalMoonRashi={moon.rashiIdx} />}
                    </div>
                  )}

                  {/* Divisional — coming soon */}
                  {subTab === 'divisional' && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="text-3xl opacity-20" style={{ color: '#6366f1' }}>◎</div>
                      <p className="text-slate-500 font-medium text-sm">Divisional Charts</p>
                      <p className="text-slate-700 text-xs text-center max-w-xs">D2 Hora, D3 Drekkana, D4 Chaturthamsa and more are coming soon.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── KP tab ── */}
              {topTab === 'kp' && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="text-3xl opacity-20" style={{ color: '#6366f1' }}>◎</div>
                  <p className="text-slate-500 font-medium text-sm">KP System</p>
                  <p className="text-slate-700 text-xs text-center max-w-xs">Krishnamurti Paddhati analysis is coming soon.</p>
                </div>
              )}

              {/* ── Ashtakvarga tab ── */}
              {topTab === 'ashtakvarga' && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="text-3xl opacity-20" style={{ color: '#6366f1' }}>◎</div>
                  <p className="text-slate-500 font-medium text-sm">Ashtakvarga</p>
                  <p className="text-slate-700 text-xs text-center max-w-xs">Eight-source strength analysis is coming soon.</p>
                </div>
              )}

              {/* ── Dasha tab ── */}
              {topTab === 'dasha' && (
                <div>
                  {moon && <VedicDasha moonSidLon={moon.sidLon} birthDate={new Date(chart.utcISO)} />}
                </div>
              )}

              {/* ── Report tab ── */}
              {topTab === 'report' && (
                <div className="flex flex-col gap-4">
                  <LifeReport chart={chart} />
                  <MangalDosha chart={chart} />
                  <KalsarpaDosha chart={chart} />
                  {moon && <Transit swe={_swe} natalMoonRashi={moon.rashiIdx} />}
                </div>
              )}

            </div>

            <p className="text-center text-slate-700 text-[11px] mt-6">
              Positions calculated using Swiss Ephemeris WASM (Moshier) with Lahiri ayanamsha. For ceremonial use, verify with a licensed Jyotishi.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
