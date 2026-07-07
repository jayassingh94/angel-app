const DOSHA_HOUSES  = new Set([1, 2, 4, 7, 8, 12])
const EXCEPT_SIGNS  = new Set([0, 7, 9])   // Aries (own), Scorpio (own), Capricorn (exalted)

const SIGN_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

const ORD = [
  '', '1st', '2nd', '3rd', '4th', '5th', '6th',
  '7th', '8th', '9th', '10th', '11th', '12th',
]

const HOUSE_THEME = {
  1:  'self and body',
  2:  'family and speech',
  4:  'home and happiness',
  7:  'partnerships and marriage',
  8:  'longevity and hidden matters',
  12: 'loss and liberation',
}

export function computeMangalDosha(chart) {
  const mars = chart.grahas.find(g => g.name === 'Mars')
  const moon = chart.grahas.find(g => g.name === 'Moon')
  if (!mars || !moon) return null

  const marsRashi          = mars.rashiIdx
  const marsSign           = SIGN_EN[marsRashi]
  const marsHouseFromLagna = mars.houseNum
  const marsHouseFromMoon  = ((marsRashi - moon.rashiIdx + 12) % 12) + 1

  const fromLagna = DOSHA_HOUSES.has(marsHouseFromLagna)
  const fromMoon  = DOSHA_HOUSES.has(marsHouseFromMoon)
  const hasDosha  = fromLagna || fromMoon

  // ── Exception checks ──────────────────────────────────────────────────────
  let exception = null

  if (hasDosha) {
    // 1. Mars in own sign or exaltation
    if (EXCEPT_SIGNS.has(marsRashi)) {
      const reason = marsRashi === 9 ? 'exalted' : 'in its own sign'
      exception = `Mars is ${reason} in ${marsSign}, which traditional texts consider a significant reducer of this dosha.`
    }

    // 2. Mars in the 2nd house from Lagna or Moon while placed in Gemini or Virgo
    //    (Mercury-ruled signs where Mars's aggression is tempered)
    if (!exception) {
      const in2nd = marsHouseFromLagna === 2 || marsHouseFromMoon === 2
      if (in2nd && (marsRashi === 2 || marsRashi === 5)) {
        exception = `Mars in the 2nd house in ${marsSign} (a Mercury sign) is traditionally considered exempt from Mangal Dosha.`
      }
    }
  }

  // ── Severity ──────────────────────────────────────────────────────────────
  const severity = !hasDosha ? 'none' : exception ? 'mild' : 'significant'

  // ── Explanation ───────────────────────────────────────────────────────────
  let explanation
  if (!hasDosha) {
    explanation =
      `Mars is in the ${ORD[marsHouseFromLagna]} house from Lagna and the ` +
      `${ORD[marsHouseFromMoon]} house from Moon. Neither placement falls in a ` +
      `dosha-activating house (1, 2, 4, 7, 8, or 12), so no Mangal Dosha is present.`
  } else {
    const triggers = []
    if (fromLagna) triggers.push(`${ORD[marsHouseFromLagna]} house from Lagna (${HOUSE_THEME[marsHouseFromLagna]})`)
    if (fromMoon)  triggers.push(`${ORD[marsHouseFromMoon]} house from Moon (${HOUSE_THEME[marsHouseFromMoon]})`)

    explanation =
      `Mars is placed in ${marsSign} in the ${triggers.join(' and the ')}. ` +
      `This activates Mangal Dosha, traditionally associated with intensity and friction ` +
      `in the areas of partnerships and marriage.`

    if (exception) explanation += ` ${exception}`
  }

  return {
    hasDosha,
    severity,
    fromLagna,
    fromMoon,
    marsHouseFromLagna,
    marsHouseFromMoon,
    marsRashi,
    marsSign,
    exception,
    explanation,
  }
}
