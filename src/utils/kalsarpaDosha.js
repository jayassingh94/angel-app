const SIGN_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

const KALSARPA_TYPES = [
  '',           // 0 — unused
  'Anant',      // Rahu H1
  'Kulik',      // Rahu H2
  'Vasuki',     // Rahu H3
  'Shankhpal',  // Rahu H4
  'Padma',      // Rahu H5
  'Mahapadma',  // Rahu H6
  'Takshak',    // Rahu H7
  'Karkotak',   // Rahu H8
  'Shankhnaad', // Rahu H9
  'Patak',      // Rahu H10
  'Vishdhar',   // Rahu H11
  'Sheshnag',   // Rahu H12
]

// Is `lon` strictly between `start` and `end` going clockwise?
function inArc(lon, start, end) {
  const span = (end - start + 360) % 360
  const dist = (lon - start + 360) % 360
  return dist > 0 && dist < span
}

export function computeKalsarpaDosha(chart) {
  const rahu = chart.grahas.find(g => g.name === 'Rahu')
  const ketu = chart.grahas.find(g => g.name === 'Ketu')
  if (!rahu || !ketu) return null

  const planets7 = chart.grahas.filter(g => g.name !== 'Rahu' && g.name !== 'Ketu')
  const rahuLon  = rahu.sidLon
  const ketuLon  = ketu.sidLon

  // All planets hemmed between nodes in either direction
  const allRahuKetu = planets7.every(p => inArc(p.sidLon, rahuLon, ketuLon))
  const allKetuRahu = planets7.every(p => inArc(p.sidLon, ketuLon, rahuLon))
  const hasDosha    = allRahuKetu || allKetuRahu

  // Planet in same rashi as Rahu or Ketu → sits in the node's jaws → partial breaking
  const conjunct  = hasDosha
    ? planets7.filter(p => p.rashiIdx === rahu.rashiIdx || p.rashiIdx === ketu.rashiIdx)
    : []
  const isPartial = conjunct.length > 0

  const severity = !hasDosha ? 'none' : isPartial ? 'partial' : 'full'

  const typeName = hasDosha ? (KALSARPA_TYPES[rahu.houseNum] ?? '') : null
  const fullName = typeName ? `${typeName} Kalsarpa Dosha` : null

  let explanation
  if (!hasDosha) {
    explanation =
      `Planets are distributed on both sides of the Rahu–Ketu axis — ` +
      `no Kalsarpa Dosha is present.`
  } else {
    const dir = allRahuKetu
      ? `Rahu in ${SIGN_EN[rahu.rashiIdx]} towards Ketu in ${SIGN_EN[ketu.rashiIdx]}`
      : `Ketu in ${SIGN_EN[ketu.rashiIdx]} towards Rahu in ${SIGN_EN[rahu.rashiIdx]}`
    explanation =
      `All 7 planets are hemmed from ${dir}, forming ${fullName}. ` +
      `This pattern is traditionally linked with delays, karmic intensity, and focused life themes.`
    if (isPartial) {
      const names = conjunct.map(p => p.name).join(' and ')
      const verb  = conjunct.length === 1 ? 'shares' : 'share'
      explanation +=
        ` ${names} ${verb} a sign with a node, which many traditions treat as a partial breaking of the dosha.`
    }
  }

  return {
    hasDosha,
    severity,
    typeName,
    fullName,
    rahuHouse:  rahu.houseNum,
    ketuHouse:  ketu.houseNum,
    rahuSign:   SIGN_EN[rahu.rashiIdx],
    ketuSign:   SIGN_EN[ketu.rashiIdx],
    isPartial,
    conjunctPlanets: conjunct.map(p => p.name),
    explanation,
  }
}
