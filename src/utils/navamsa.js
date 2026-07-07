// Navamsa (D9) sign calculation
// Each 30° sign is split into 9 equal parts of 3°20' (3.333°).
// The starting sign of the count depends on the natal sign's modality:
//   Movable (Ar,Ca,Li,Cp): same sign | Fixed (Ta,Le,Sc,Aq): 9th | Mutable (Ge,Vi,Sg,Pi): 5th

const NAVAMSA_START = [0, 9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3]  // indexed by natal rashiIdx
const NAV_DEG = 30 / 9  // 3.3333...°

const SIGN_EN  = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const SIGN_SYM = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']

export function getD9Sign(sidLon) {
  const rashiIdx  = Math.floor(sidLon / 30) % 12
  const lonInSign = sidLon % 30
  const division  = Math.min(Math.floor(lonInSign / NAV_DEG), 8)  // 0–8
  return (NAVAMSA_START[rashiIdx] + division) % 12
}

export function computeNavamsa(chart) {
  const lagnaD9 = getD9Sign(chart.lagnaSidLon)

  const grahas = chart.grahas.map(g => {
    const d9Sign = getD9Sign(g.sidLon)
    return {
      ...g,
      d1RashiIdx: g.rashiIdx,
      rashiIdx:   d9Sign,
      houseNum:   ((d9Sign - lagnaD9 + 12) % 12) + 1,
    }
  })

  return {
    ...chart,
    lagnaRashi:     lagnaD9,
    lagnaRashiName: SIGN_EN[lagnaD9],
    lagnaSymbol:    SIGN_SYM[lagnaD9],
    lagnaDegs:      null,  // no meaningful degree position in D9
    grahas,
    isD9: true,
  }
}
