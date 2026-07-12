// Physical Characteristics — Full Life Report
// Base: Lagna sign. Modifiers: any planets placed in the 1st house.

const RASHIS_EN  = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const RASHIS_DISPLAY = [
  'Mesh (Aries)','Vrishabha (Taurus)','Mithuna (Gemini)','Karka (Cancer)',
  'Simha (Leo)','Kanya (Virgo)','Tula (Libra)','Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)','Makara (Capricorn)','Kumbha (Aquarius)','Meena (Pisces)',
]
const PLANET_FULL = {
  Su:'Sun', Mo:'Moon', Ma:'Mars', Me:'Mercury',
  Ju:'Jupiter', Ve:'Venus', Sa:'Saturn', Ra:'Rahu', Ke:'Ketu',
}

export const lagnaPhysicalTraits = {
  Aries: "Aries rising is traditionally associated with a medium build, a strong or prominent forehead, and an energetic, quick way of moving — often with a sharp, alert look in the eyes and a naturally athletic or lean frame.",
  Taurus: "Taurus rising is traditionally associated with a sturdy, well-built frame, a strong neck, and pleasant, often attractive features — overall presence tends to feel grounded and physically solid rather than delicate.",
  Gemini: "Gemini rising is traditionally associated with a tall or lanky build, expressive hands and quick gestures, and a youthful appearance that often persists later into life — movement tends to be light and quick.",
  Cancer: "Cancer rising is traditionally associated with a rounder face, a softer overall build, and expressive, often watery or soulful eyes — physical appearance here tends to shift noticeably with mood or life phase.",
  Leo: "Leo rising is traditionally associated with a commanding presence, broad shoulders, and a naturally upright, confident posture — hair is often a notable feature, and the overall look tends to draw attention.",
  Virgo: "Virgo rising is traditionally associated with a neat, well-proportioned frame and a youthful, often delicate appearance — attention to grooming and a tidy overall presentation tends to be a natural trait.",
  Libra: "Libra rising is traditionally associated with a well-proportioned, graceful build and generally pleasant, symmetrical features — an overall aesthetic sense often shows in how one dresses and carries themselves.",
  Scorpio: "Scorpio rising is traditionally associated with intense, penetrating eyes and a magnetic, somewhat mysterious presence — build can vary, but the overall impression tends to be striking rather than easily forgotten.",
  Sagittarius: "Sagittarius rising is traditionally associated with a tall frame, a bright and open facial expression, and often a naturally athletic build — an energetic, outdoorsy quality often shows in overall bearing.",
  Capricorn: "Capricorn rising is traditionally associated with a leaner frame in youth that tends to fill out with age, along with prominent bone structure — features often carry a serious or mature quality even from a younger age.",
  Aquarius: "Aquarius rising is traditionally associated with a tall or unusually proportioned frame and distinctive, sometimes unconventional features — overall appearance tends to stand out as individual rather than following typical patterns.",
  Pisces: "Pisces rising is traditionally associated with soft, dreamy eyes and a gentle, somewhat fluid quality to build and movement — overall appearance often has a softness or otherworldly quality to it.",
}

export const firstHousePlanetModifier = {
  Sun:     "With the Sun in your 1st house, your presence likely carries added confidence and visibility — a naturally commanding or noticeable quality to how you show up physically.",
  Moon:    "With the Moon in your 1st house, your appearance may fluctuate more with emotional state, and there's often a naturally soft, appealing quality to your face and expressions.",
  Mars:    "With Mars in your 1st house, your build likely carries extra strength, sharpness, or athleticism — a more angular or intense physical quality than the base Lagna sign alone would suggest.",
  Mercury: "With Mercury in your 1st house, you likely retain a youthful, quick appearance, with expressive, animated features and gestures.",
  Jupiter: "With Jupiter in your 1st house, your frame likely trends fuller or more substantial, often with a warm, benevolent, easily approachable quality to your presence.",
  Venus:   "With Venus in your 1st house, your appearance likely carries added charm, attractiveness, and grace — a naturally pleasant or magnetic quality to your features.",
  Saturn:  "With Saturn in your 1st house, your build may lean leaner and your features more serious or mature-looking than your actual age, sometimes with a more reserved physical presence.",
  Rahu:    "With Rahu in your 1st house, your appearance may carry an unconventional or striking quality — something about your look that stands out or is hard to categorize in a typical way.",
  Ketu:    "With Ketu in your 1st house, your presence may carry a more understated, detached quality — sometimes with distinctive features that others notice but you yourself may underplay.",
}

export function computePhysical(chart) {
  const { lagnaRashi, grahas } = chart

  // Planets in 1st house (exclude nodes if you prefer, but include per spec)
  const h1Grahas    = grahas.filter(g => g.houseNum === 1 && PLANET_FULL[g.id])
  const planetNames = h1Grahas.map(g => PLANET_FULL[g.id])
  const modifierText = planetNames
    .map(name => firstHousePlanetModifier[name] ?? '')
    .filter(Boolean)
    .join(' ')

  const signName    = RASHIS_EN[lagnaRashi]
  const signDisplay = RASHIS_DISPLAY[lagnaRashi]

  return {
    signDisplay,
    planetNames,
    baseText: lagnaPhysicalTraits[signName] ?? '',
    modifierText,
    // ReportContent compat
    lordName:  planetNames.length > 0 ? planetNames.join(', ') : 'None',
    lordHouse: 1,
  }
}
