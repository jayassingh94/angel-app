// Gochar (Vedic transit) calculator — reuses same SE + Lahiri setup as VedicKundali

const SE_BODY      = { Sun: 0, Moon: 1, Mercury: 2, Venus: 3, Mars: 4, Jupiter: 5, Saturn: 6 }
const SE_MEAN_NODE = 10
const SE_FLAGS     = 4 | 256   // SE_FLG_MOSEPH | SE_FLG_SPEED

function julianDay(date) {
  return date.getTime() / 86400000.0 + 2440587.5
}

function getLahiriAyanamsha(jd) {
  const T = (jd - 2451545.0) / 36525.0
  return 23.853167 + T * 1.39657
}

export const SIGN_EN  = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
export const SIGN_SYM = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']

// Classical simplified Gochar house rules (from natal Moon)
const GOCHAR_RULES = {
  Sun:     { favorable: new Set([3,6,10,11]),           challenging: new Set([1,2,4,5,7,8,9,12]) },
  Moon:    { favorable: new Set([1,3,6,7,10,11]),       challenging: new Set([2,4,5,8,9,12]) },
  Mars:    { favorable: new Set([3,6,10,11]),            challenging: new Set([1,2,4,7,8,9,12]) },
  Mercury: { favorable: new Set([2,4,6,10,11]),         challenging: new Set([1,3,5,7,8,9,12]) },
  Jupiter: { favorable: new Set([2,5,7,9,11]),          challenging: new Set([6,8,12]) },
  Venus:   { favorable: new Set([1,2,3,4,5,8,9,11,12]), challenging: new Set([6,7,10]) },
  Saturn:  { favorable: new Set([3,6,11]),               challenging: new Set([1,2,4,5,8,10,12]) },
  Rahu:    { favorable: new Set([3,6,11]),               challenging: new Set([1,2,4,5,7,8,9,10,12]) },
  Ketu:    { favorable: new Set([3,6,11]),               challenging: new Set([1,2,4,5,7,8,9,10,12]) },
}

export const TRANSIT_PLANETS = [
  { id: 'Su', name: 'Sun',     symbol: '☉', bodyKey: 'Sun',     color: '#facc15' },
  { id: 'Mo', name: 'Moon',    symbol: '☽', bodyKey: 'Moon',    color: '#e2e8f0' },
  { id: 'Ma', name: 'Mars',    symbol: '♂', bodyKey: 'Mars',    color: '#f87171' },
  { id: 'Me', name: 'Mercury', symbol: '☿', bodyKey: 'Mercury', color: '#4ade80' },
  { id: 'Ju', name: 'Jupiter', symbol: '♃', bodyKey: 'Jupiter', color: '#fb923c' },
  { id: 'Ve', name: 'Venus',   symbol: '♀', bodyKey: 'Venus',   color: '#f9a8d4' },
  { id: 'Sa', name: 'Saturn',  symbol: '♄', bodyKey: 'Saturn',  color: '#94a3b8' },
  { id: 'Ra', name: 'Rahu',    symbol: '☊', bodyKey: null,      color: '#a78bfa' },
  { id: 'Ke', name: 'Ketu',    symbol: '☋', bodyKey: null,      color: '#6ee7b7' },
]

export function computeTransits(swe, transitDate, natalMoonRashiIdx) {
  const jd    = julianDay(transitDate)
  const ay    = getLahiriAyanamsha(jd)
  const toSid = trop => ((trop - ay) % 360 + 360) % 360

  const rahuTrop = swe.calculatePosition(jd, SE_MEAN_NODE, SE_FLAGS).longitude
  const ketuTrop = (rahuTrop + 180) % 360

  return TRANSIT_PLANETS.map(p => {
    const tropLon = p.bodyKey !== null
      ? swe.calculatePosition(jd, SE_BODY[p.bodyKey], SE_FLAGS).longitude
      : (p.id === 'Ra' ? rahuTrop : ketuTrop)

    const sidLon        = toSid(tropLon)
    const transitRashi  = Math.floor(sidLon / 30) % 12
    const houseFromMoon = ((transitRashi - natalMoonRashiIdx + 12) % 12) + 1

    const rules  = GOCHAR_RULES[p.name]
    const nature = rules.favorable.has(houseFromMoon) ? 'favorable'
                 : rules.challenging.has(houseFromMoon) ? 'challenging'
                 : 'neutral'

    const isSadeSati    = p.name === 'Saturn' && [12, 1, 2].includes(houseFromMoon)
    const sadeSatiPhase = isSadeSati
      ? houseFromMoon === 12 ? 'rising'
        : houseFromMoon === 1  ? 'peak'
        : 'setting'
      : null

    return { ...p, sidLon, transitRashi, transitSign: SIGN_EN[transitRashi], transitSymbol: SIGN_SYM[transitRashi], houseFromMoon, nature, isSadeSati, sadeSatiPhase }
  })
}
