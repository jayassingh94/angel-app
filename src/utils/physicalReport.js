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
  Aries: "Aries rising is traditionally associated with a medium build carried with real energy — quick, purposeful movement rather than a slow or languid presence. A prominent or strong-looking forehead is often noted, along with a sharp, alert quality to the eyes that tends to give away an active mind even at rest.\n\nOverall bearing tends to read as athletic or lean, with a kind of forward-leaning posture, as though always slightly ready to move. This placement is often associated with a naturally quick metabolism and a build that stays fit with relatively less deliberate effort than other placements.",

  Taurus: "Taurus rising is traditionally associated with a sturdy, well-built frame and a strong, often notably attractive neck and throat area. Features tend to be pleasant and even, with an overall physical presence that feels grounded and solid rather than delicate or angular.\n\nMovement tends to be unhurried and deliberate rather than quick, and this placement is often associated with a build that fills out steadily over the years, favoring comfort and durability. A warm, sensory quality to one's presence — a pleasant voice, an appreciation for touch and texture — is also commonly noted.",

  Gemini: "Gemini rising is traditionally associated with a tall or lanky build, along with notably expressive hands and quick, animated gestures while speaking. A youthful appearance that persists well into later life is a commonly noted trait of this placement.\n\nMovement tends to be light, quick, and almost restless — sitting fully still for long periods rarely comes naturally. Facial expressions tend to shift rapidly and visibly, mirroring the quick mental activity typically associated with this rising sign.",

  Cancer: "Cancer rising is traditionally associated with a rounder face and a softer overall build, often with expressive, deeply emotive eyes that seem to hold a lot beneath the surface. Appearance under this placement is often noted to shift more visibly with mood, weight, or life phase than most other risings.\n\nA certain protective, slightly guarded quality often shows in body language — arms crossed, a tendency to hang back initially in unfamiliar settings — before warming considerably once comfort is established.",

  Leo: "Leo rising is traditionally associated with a commanding, confident presence, often with broad shoulders and a naturally upright, dignified posture. Hair is frequently noted as a distinctive feature under this placement — thick, notable, or styled with evident care.\n\nOverall, this placement tends to draw the eye in a room without necessarily trying to — a kind of natural radiance or warmth in expression and bearing that others notice even from a distance.",

  Virgo: "Virgo rising is traditionally associated with a neat, well-proportioned frame and often a youthful, somewhat delicate appearance that can make one look younger than their actual age. Meticulous grooming and a tidy, put-together presentation tend to be a natural, almost automatic habit under this placement.\n\nMovement and gesture tend to be precise rather than expansive, and there's often a quality of quiet, careful attentiveness in how one carries themselves — nothing thrown together carelessly.",

  Libra: "Libra rising is traditionally associated with a well-proportioned, graceful build and generally pleasant, symmetrical features that are often considered classically attractive. An overall aesthetic sense — in how one dresses, styles their hair, or decorates their space — tends to be a genuinely natural extension of this placement.",

  Scorpio: "Scorpio rising is traditionally associated with intense, penetrating eyes that are often described as the most memorable feature of this placement — magnetic, a little unreadable, and hard to look away from. Build can vary considerably, but the overall impression under this rising tends to be striking rather than easily forgotten.\n\nA certain economy of expression and gesture is common — less outwardly animated than some other placements, which paradoxically tends to add to the sense of quiet intensity.",

  Sagittarius: "Sagittarius rising is traditionally associated with a tall frame and a bright, open facial expression that often reads as genuinely friendly even to strangers. An athletic build is common under this placement, often maintained through an active, outdoorsy lifestyle rather than deliberate gym discipline.\n\nMovement tends to be expansive and energetic, and there's frequently an easy, hearty laugh or smile that's noted as a defining feature of one's overall presence.",

  Capricorn: "Capricorn rising is traditionally associated with a leaner frame in youth that tends to fill out and gain a kind of settled substance with age — prominent bone structure, particularly in the face, is a commonly noted trait. Features often carry a serious or notably mature quality even from a younger age, sometimes making one look older than their actual years early on, though this often reverses later in life.",

  Aquarius: "Aquarius rising is traditionally associated with a tall or unusually proportioned frame and genuinely distinctive, sometimes unconventional features that don't neatly fit typical categories of appearance. Overall presence under this placement tends to stand out as individual rather than blending easily into a crowd, often without any deliberate effort to be noticed.",

  Pisces: "Pisces rising is traditionally associated with soft, dreamy eyes that often carry a somewhat otherworldly or faraway quality, along with a gentle, somewhat fluid ease to build and movement. This placement is often noted for a physical presence that seems to shift subtly depending on mood or environment, almost chameleon-like.",
}

export const firstHousePlanetModifier = {
  Sun:     "With the Sun also placed in your 1st house, your presence likely carries added confidence and visibility — a naturally commanding, sometimes radiant quality to how you show up physically, as though a bit of extra light follows you into a room.",
  Moon:    "With the Moon also placed in your 1st house, your appearance may fluctuate more noticeably with emotional state, and there's often a naturally soft, appealing quality to your face and expressions, sometimes described as having a particularly gentle or luminous quality.",
  Mars:    "With Mars also placed in your 1st house, your build likely carries extra strength, sharpness, or athleticism — a more angular, energetic physical quality layered on top of your base Lagna traits, along with a naturally quick, sometimes forceful way of moving.",
  Mercury: "With Mercury also placed in your 1st house, you likely retain an especially youthful, quick appearance well into later life, with expressive, animated features and gestures that mirror an active, curious mind.",
  Jupiter: "With Jupiter also placed in your 1st house, your frame likely trends fuller or more substantial than the base Lagna trait alone would suggest, often with a warm, benevolent, easily approachable quality to your overall presence.",
  Venus:   "With Venus also placed in your 1st house, your appearance likely carries noticeably added charm, attractiveness, and grace — a naturally pleasant, magnetic quality to your features that others tend to comment on.",
  Saturn:  "With Saturn also placed in your 1st house, your build may lean leaner and your features more serious or mature-looking than your actual age would suggest, sometimes accompanied by a more reserved, understated physical presence overall.",
  Rahu:    "With Rahu also placed in your 1st house, your appearance may carry an unconventional or striking quality — something about your look that stands out or is genuinely hard to categorize in a typical way, sometimes becoming more pronounced later in life.",
  Ketu:    "With Ketu also placed in your 1st house, your presence may carry a more understated, detached quality — sometimes with distinctive features that others notice readily even though you yourself tend to underplay your own appearance.",
}

export function computePhysical(chart) {
  const { lagnaRashi, grahas } = chart

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
    lordName:  planetNames.length > 0 ? planetNames.join(', ') : 'None',
    lordHouse: 1,
  }
}
