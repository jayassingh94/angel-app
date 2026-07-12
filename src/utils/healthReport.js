// Health — Full Life Report
// Lookup by 6th house sign + 6th lord's house (whole-sign, Lahiri).

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

export const sixthHouseSignTraits = {
  Aries: "With Aries in your 6th house, your body likely runs on quick energy bursts — you may be prone to minor injuries from overexertion, headaches, or inflammation-related issues when stressed. Regular physical activity that channels this fiery energy tends to serve you better than a sedentary routine.",
  Taurus: "With Taurus in your 6th house, health matters may show up around the throat, neck, or through habits connected to food and comfort — steady routines around diet and rest tend to serve you well, while overindulgence is the pattern most worth watching.",
  Gemini: "With Gemini in your 6th house, health concerns may relate to the nervous system, respiratory issues, or restlessness/anxiety from mental overactivity — building in real downtime for your mind, not just your body, is often the more overlooked need here.",
  Cancer: "With Cancer in your 6th house, health matters may connect closely to digestion, emotional stress, or fluid retention — your physical wellbeing is often closely tied to emotional wellbeing, so addressing stress directly tends to have real physical benefits too.",
  Leo: "With Leo in your 6th house, health concerns may relate to the heart, back, or spine — issues here sometimes flare when pride or overexertion pushes you past sensible limits. Consistent, moderate exercise tends to serve you better than occasional intense bursts.",
  Virgo: "With Virgo in your 6th house, this placement is traditionally associated with heightened health-consciousness, sometimes tipping into over-worry about minor symptoms — digestive sensitivity is common, and a structured, balanced routine around diet tends to genuinely help.",
  Libra: "With Libra in your 6th house, health matters may relate to kidney function or issues arising from imbalance — in diet, in work-rest ratio, or in emotional give-and-take within relationships. Finding genuine equilibrium in daily routine tends to be the key theme here.",
  Scorpio: "With Scorpio in your 6th house, health matters may relate to reproductive health or issues that build up quietly before becoming noticeable — this placement often points to a body that hides discomfort until it can't be ignored, so regular checkups matter more than usual.",
  Sagittarius: "With Sagittarius in your 6th house, health concerns may relate to the hips, thighs, or liver — often connected to overindulgence while traveling or during periods of restlessness. A grounded routine, even amid a naturally adventurous lifestyle, helps balance this out.",
  Capricorn: "With Capricorn in your 6th house, health matters may relate to bones, joints, or teeth — chronic, slow-developing issues are more likely here than sudden acute ones. Consistent, disciplined self-care over the long term tends to pay off significantly with this placement.",
  Aquarius: "With Aquarius in your 6th house, health concerns may relate to circulation or issues that are harder to diagnose through conventional means — an unconventional approach to wellness (outside standard advice) sometimes genuinely suits you better here.",
  Pisces: "With Pisces in your 6th house, health matters may relate to the immune system or issues with an emotional/psychosomatic root — stress and physical health are often deeply linked for you, and addressing emotional wellbeing directly tends to have real physical payoff.",
}

export const sixthLordHouseModifier = {
  1:  "With your 6th house lord placed in the 1st house, health and daily routine are likely closely tied to your overall sense of self — how you feel physically often directly shapes your confidence and daily outlook.",
  2:  "With your 6th house lord placed in the 2nd house, health matters may connect to diet, finances, or family stress — money worries or family-related stress can sometimes show up physically for you.",
  3:  "With your 6th house lord placed in the 3rd house, health matters may connect to nervous energy, communication-related stress, or short trips — mental restlessness is often the root worth addressing before it manifests physically.",
  4:  "With your 6th house lord placed in the 4th house, health matters may connect to home environment or emotional security — an unsettled living situation or family stress can meaningfully affect your physical wellbeing.",
  5:  "With your 6th house lord placed in the 5th house, health matters may connect to stress from creative blocks, romantic disappointment, or matters involving children — emotional outlets through creativity often genuinely help here.",
  6:  "With your 6th house lord placed in its own 6th house, health-related themes are especially emphasized — this placement often points to a lifelong relationship with health-consciousness, for better (discipline) or worse (anxiety), worth being mindful of either direction.",
  7:  "With your 6th house lord placed in the 7th house, health matters may connect to relationship stress — conflict or imbalance with a partner can show up as physical tension or fatigue more than you might expect.",
  8:  "With your 6th house lord placed in the 8th house, health matters may involve issues that develop gradually or connect to deeper transformation — regular checkups are especially worth prioritizing with this placement, since issues can be slow to surface.",
  9:  "With your 6th house lord placed in the 9th house, health matters may connect to travel, overexertion during long journeys, or stress from belief conflicts — moderation while traveling is a genuinely useful habit here.",
  10: "With your 6th house lord placed in the 10th house, health matters may connect to work-related stress or overexertion in career pursuits — burnout is the pattern most worth watching and actively managing.",
  11: "With your 6th house lord placed in the 11th house, health matters may connect to stress from unmet goals or social overcommitment — learning to say no to some obligations may genuinely serve your physical wellbeing.",
  12: "With your 6th house lord placed in the 12th house, health matters may connect to sleep quality, subconscious stress, or issues that are harder to trace to an obvious cause — attention to rest and mental rest specifically tends to help.",
}

export function computeHealth(chart) {
  const { lagnaRashi, grahas } = chart
  const sixthRashi = (lagnaRashi + 5) % 12
  const lordId     = SIGN_LORDS[sixthRashi]
  const lordGraha  = grahas.find(g => g.id === lordId)
  const lordHouse  = lordGraha?.houseNum ?? 6

  const signName    = RASHIS_EN[sixthRashi]
  const signDisplay = RASHIS_DISPLAY[sixthRashi] + ' in H6'
  const lordName    = PLANET_FULL[lordId] ?? lordId

  return {
    signDisplay,
    lordName,
    lordHouse,
    baseText:     sixthHouseSignTraits[signName]    ?? '',
    modifierText: sixthLordHouseModifier[lordHouse] ?? '',
  }
}
