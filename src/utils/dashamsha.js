// Dashamsha (D10) — career / profession divisional chart
// Each 30° sign is divided into 10 equal parts of 3° each.
// Odd signs  (Ar,Ge,Le,Li,Sg,Aq): count starts from the SAME sign
// Even signs (Ta,Ca,Vi,Sc,Cp,Pi): count starts from the 9th sign forward

// D10_START[rashiIdx] = starting rashi index (0-based) for counting
// Odd  signs: D10_START[i] = i
// Even signs: D10_START[i] = (i + 8) % 12  (9th from sign, inclusive)
const D10_START = [0, 9, 2, 11, 4, 1, 6, 3, 8, 5, 10, 7]

const D10_DEG = 3  // 30° ÷ 10

const SIGN_EN  = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const SIGN_SYM = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']

export function getD10Sign(sidLon) {
  const rashiIdx  = Math.floor(sidLon / 30) % 12
  const lonInSign = sidLon % 30
  const division  = Math.min(Math.floor(lonInSign / D10_DEG), 9)  // 0–9
  return (D10_START[rashiIdx] + division) % 12
}

export function computeDashamsha(chart) {
  const lagnaD10 = getD10Sign(chart.lagnaSidLon)

  const grahas = chart.grahas.map(g => {
    const d10Sign = getD10Sign(g.sidLon)
    return {
      ...g,
      d1RashiIdx: g.rashiIdx,
      rashiIdx:   d10Sign,
      houseNum:   ((d10Sign - lagnaD10 + 12) % 12) + 1,
    }
  })

  return {
    ...chart,
    lagnaRashi:     lagnaD10,
    lagnaRashiName: SIGN_EN[lagnaD10],
    lagnaSymbol:    SIGN_SYM[lagnaD10],
    lagnaDegs:      null,
    grahas,
    isD10: true,
  }
}
