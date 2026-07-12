// Children — Full Life Report
// Lookup by 5th house sign + 5th lord's house (whole-sign, Lahiri).

const SIGN_LORDS = ['Ma','Ve','Me','Mo','Su','Me','Ve','Ma','Ju','Sa','Sa','Ju']
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

export const fifthHouseSignTraits = {
  Aries: "With Aries in your 5th house, your relationship with children (your own, or your inner creative/playful side) likely carries an energetic, spirited quality — children in your life may be independent and headstrong, and you likely encourage their courage and initiative rather than overprotecting them.",
  Taurus: "With Taurus in your 5th house, your relationship with children likely emphasizes stability, comfort, and patient nurturing — you probably create a secure, steady environment for them, valuing consistency over constant novelty in how you raise or relate to them.",
  Gemini: "With Gemini in your 5th house, your relationship with children likely involves lots of conversation, learning, and mental stimulation — children in your life may be quick-witted and curious, and you probably enjoy engaging their minds as much as caring for them.",
  Cancer: "With Cancer in your 5th house, your relationship with children likely carries deep emotional warmth — nurturing comes naturally, and creating a genuinely safe emotional environment for children is probably a core priority for you, sometimes to the point of being protective.",
  Leo: "With Leo in your 5th house, your relationship with children likely carries pride, warmth, and encouragement — you probably delight in their achievements and enjoy celebrating them, sometimes needing to balance genuine pride with giving them room to be their own person.",
  Virgo: "With Virgo in your 5th house, your relationship with children likely emphasizes practical guidance and genuine attentiveness to their wellbeing — you probably pay close attention to their development and habits, sometimes needing to relax perfectionism around their growth.",
  Libra: "With Libra in your 5th house, your relationship with children likely emphasizes fairness, harmony, and shared activities — you probably work to create balanced, cooperative relationships with them, valuing partnership even in parenting or mentoring.",
  Scorpio: "With Scorpio in your 5th house, your relationship with children likely carries real depth and intensity — bonds here tend to be profound and protective, sometimes requiring conscious effort to give children enough independence alongside that intensity.",
  Sagittarius: "With Sagittarius in your 5th house, your relationship with children likely involves shared adventure, learning, and philosophical conversation — you probably encourage their independence and broad worldview, valuing their freedom to explore over rigid structure.",
  Capricorn: "With Capricorn in your 5th house, your relationship with children likely emphasizes responsibility and long-term guidance — you probably take parenting or mentoring seriously and steadily, sometimes needing to consciously bring in more lightness and play alongside the structure.",
  Aquarius: "With Aquarius in your 5th house, your relationship with children likely emphasizes independence and individuality — you probably encourage them to think for themselves and be unconventional, valuing their uniqueness over conformity to expectation.",
  Pisces: "With Pisces in your 5th house, your relationship with children likely carries an imaginative, deeply empathetic quality — creativity and emotional attunement come naturally, though clear boundaries alongside that compassion tend to serve both you and them well.",
}

export const fifthLordHouseModifier = {
  1:  "With your 5th house lord placed in the 1st house, matters of creativity and children are likely closely tied to your own identity and self-expression — being a parent or creative figure may feel deeply central to who you are.",
  2:  "With your 5th house lord placed in the 2nd house, matters of children or creativity may connect closely to family resources and values — supporting children financially or passing on family values likely matters significantly to you.",
  3:  "With your 5th house lord placed in the 3rd house, matters of children or creativity may connect to communication and short-distance connection — you may bond with children through conversation, storytelling, or shared learning.",
  4:  "With your 5th house lord placed in the 4th house, matters of children or creativity are likely closely tied to home life — creating a stable domestic environment for children or creative pursuits at home may matter significantly.",
  5:  "With your 5th house lord placed in its own 5th house, themes of creativity and children are especially emphasized — this placement often points to a strong, central role for children or creative expression throughout your life.",
  6:  "With your 5th house lord placed in the 6th house, matters of children or creativity may involve some challenges or require sustained effort — this placement sometimes points to health considerations around childbearing or creative blocks worth working through.",
  7:  "With your 5th house lord placed in the 7th house, matters of children or creativity are likely closely tied to partnership — shared parenting or creative collaboration with a partner may feature meaningfully in this area of your life.",
  8:  "With your 5th house lord placed in the 8th house, matters of children or creativity may carry a transformative quality — significant life changes are sometimes associated with this area, worth approaching with patience rather than rigid expectation.",
  9:  "With your 5th house lord placed in the 9th house, matters of children or creativity may connect to higher learning, travel, or philosophy — children who are curious about the world, or creative work connected to teaching/belief, may feature here.",
  10: "With your 5th house lord placed in the 10th house, matters of children or creativity may become intertwined with your career — creative work as a profession, or balancing parenting with career ambition, is a common theme with this placement.",
  11: "With your 5th house lord placed in the 11th house, matters of children or creativity may connect to community, friendships, or long-term gains — children or creative projects may bring you into wider social circles or long-term fulfillment.",
  12: "With your 5th house lord placed in the 12th house, matters of children or creativity may involve distance, privacy, or a more introspective quality — creative work done away from public attention, or a quieter relationship with children, may be more natural for you.",
}

export function computeChildren(chart) {
  const { lagnaRashi, grahas } = chart
  const fifthRashi = (lagnaRashi + 4) % 12
  const lordId     = SIGN_LORDS[fifthRashi]
  const lordGraha  = grahas.find(g => g.id === lordId)
  const lordHouse  = lordGraha?.houseNum ?? 5

  const signName    = RASHIS_EN[fifthRashi]
  const signDisplay = RASHIS_DISPLAY[fifthRashi] + ' in H5'
  const lordName    = PLANET_FULL[lordId] ?? lordId

  return {
    signDisplay,
    lordName,
    lordHouse,
    baseText:     fifthHouseSignTraits[signName]    ?? '',
    modifierText: fifthLordHouseModifier[lordHouse] ?? '',
  }
}
