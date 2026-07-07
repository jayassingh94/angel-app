export const DASHA_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']
export const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17]

export const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
]

export const PLANET_META = {
  Ketu:    { symbol: '☋', color: '#6ee7b7' },
  Venus:   { symbol: '♀', color: '#f9a8d4' },
  Sun:     { symbol: '☉', color: '#facc15' },
  Moon:    { symbol: '☽', color: '#e2e8f0' },
  Mars:    { symbol: '♂', color: '#f87171' },
  Rahu:    { symbol: '☊', color: '#a78bfa' },
  Jupiter: { symbol: '♃', color: '#fb923c' },
  Saturn:  { symbol: '♄', color: '#94a3b8' },
  Mercury: { symbol: '☿', color: '#4ade80' },
}

const NAKSHATRA_DEG = 360 / 27
const TOTAL_YEARS   = 120
const YEAR_MS       = 365.25 * 24 * 3600 * 1000

function addYears(date, years) {
  return new Date(date.getTime() + years * YEAR_MS)
}

export function computeDasha(moonSidLon, birthDate) {
  const moon     = ((moonSidLon % 360) + 360) % 360
  const nakIdx   = Math.floor(moon / NAKSHATRA_DEG)
  const lordIdx  = nakIdx % 9
  const posInNak = moon - nakIdx * NAKSHATRA_DEG
  const fracElap = posInNak / NAKSHATRA_DEG
  const firstYrs = DASHA_YEARS[lordIdx] * (1 - fracElap)

  const lifetime  = addYears(new Date(birthDate), TOTAL_YEARS)  // birth + 120 Julian years
  const mahadashas = []
  let cur = new Date(birthDate)

  // First Mahadasha — partial (balance of birth nakshatra's lord period)
  mahadashas.push({
    lord: DASHA_LORDS[lordIdx], lordIdx,
    fullYears: DASHA_YEARS[lordIdx], years: firstYrs,
    start: new Date(cur), end: addYears(cur, firstYrs),
    fracElap,
    isEndTruncated: false,
  })
  cur = mahadashas[0].end

  // Cycle through remaining lords until we reach exactly birth + 120 years.
  // If a full period would overshoot, truncate it to the lifetime boundary.
  let idx = (lordIdx + 1) % 9
  while (cur < lifetime) {
    const fullYrs = DASHA_YEARS[idx]
    const fullEnd = addYears(cur, fullYrs)
    const truncated = fullEnd > lifetime
    const end  = truncated ? lifetime : fullEnd
    const yrs  = (end - cur) / YEAR_MS

    mahadashas.push({
      lord: DASHA_LORDS[idx], lordIdx: idx,
      fullYears: fullYrs, years: yrs,
      start: new Date(cur), end,
      fracElap: 0,
      isEndTruncated: truncated,
    })
    cur = end
    idx = (idx + 1) % 9
  }

  for (const md of mahadashas) md.antardashas = buildAntardashas(md)

  return {
    nakIdx,
    nakName:  NAKSHATRA_NAMES[nakIdx],
    nakPada:  Math.floor(posInNak / (NAKSHATRA_DEG / 4)) + 1,
    lordName: DASHA_LORDS[lordIdx],
    lordIdx,
    fracElap,
    posInNak,
    firstYrs,
    lifetime,
    birthDate: new Date(birthDate),
    mahadashas,
  }
}

function buildAntardashas(md) {
  const { lordIdx, fullYears, fracElap, start: mdStart, end: mdEnd } = md
  const absMDStart = new Date(mdStart.getTime() - fracElap * fullYears * YEAR_MS)
  const ads = []
  let adAbs = new Date(absMDStart)

  for (let i = 0; i < 9; i++) {
    const adLordIdx = (lordIdx + i) % 9
    const adFullYrs = fullYears * DASHA_YEARS[adLordIdx] / TOTAL_YEARS
    const adAbsEnd  = addYears(adAbs, adFullYrs)

    const visS = adAbs    < mdStart ? new Date(mdStart) : new Date(adAbs)
    const visE = adAbsEnd > mdEnd   ? new Date(mdEnd)   : new Date(adAbsEnd)

    if (visE > visS) {
      ads.push({
        lord: DASHA_LORDS[adLordIdx], lordIdx: adLordIdx,
        fullYears: adFullYrs,
        years: (visE - visS) / YEAR_MS,
        start: visS, end: visE,
        absStart: new Date(adAbs),
        isPartial: adAbs < mdStart || adAbsEnd > mdEnd,
      })
    }
    adAbs = new Date(adAbsEnd)
  }
  return ads
}

export function buildPADs(ad) {
  const { lordIdx, fullYears, absStart: adAbs, start: adStart, end: adEnd } = ad
  const pads = []
  let padAbs = new Date(adAbs)

  for (let i = 0; i < 9; i++) {
    const pLordIdx   = (lordIdx + i) % 9
    const padFullYrs = fullYears * DASHA_YEARS[pLordIdx] / TOTAL_YEARS
    const padAbsEnd  = addYears(padAbs, padFullYrs)

    const visS = padAbs    < adStart ? new Date(adStart) : new Date(padAbs)
    const visE = padAbsEnd > adEnd   ? new Date(adEnd)   : new Date(padAbsEnd)

    if (visE > visS) {
      pads.push({
        lord: DASHA_LORDS[pLordIdx], lordIdx: pLordIdx,
        years: (visE - visS) / YEAR_MS,
        start: visS, end: visE,
        isPartial: padAbs < adStart || padAbsEnd > adEnd,
      })
    }
    padAbs = new Date(padAbsEnd)
  }
  return pads
}

// Serialise the full timeline to a plain JSON-compatible object.
export function toTimelineJSON(dasha) {
  const { nakName, nakPada, lordName, firstYrs, birthDate } = dasha
  return {
    nakshatra:        nakName,
    nakshatra_pada:   nakPada,
    birth_lord:       lordName,
    balance_at_birth: +firstYrs.toFixed(6),
    mahadashas: dasha.mahadashas.map(md => ({
      planet:            md.lord,
      start_date:        fmtISO(md.start),
      end_date:          fmtISO(md.end),
      age_start:         +((md.start - birthDate) / YEAR_MS).toFixed(2),
      duration_years:    +md.years.toFixed(4),
      partial_start:     md.fracElap > 0,
      partial_end:       md.isEndTruncated,
      antardashas: md.antardashas.map(ad => ({
        planet:         ad.lord,
        start_date:     fmtISO(ad.start),
        end_date:       fmtISO(ad.end),
        duration_years: +ad.years.toFixed(4),
        is_partial:     ad.isPartial,
      })),
    })),
  }
}

function fmtISO(date) {
  return date.toISOString().split('T')[0]
}

export function fmt(date) {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function yrsReadable(years) {
  const totalDays = Math.abs(years) * 365.25
  const y  = Math.floor(totalDays / 365.25)
  const remD = totalDays - y * 365.25
  const m  = Math.floor(remD / 30.4375)
  const d  = Math.round(remD - m * 30.4375)
  const parts = []
  if (y) parts.push(y + 'y')
  if (m) parts.push(m + 'm')
  if (d || parts.length === 0) parts.push(d + 'd')
  return parts.join(' ')
}
