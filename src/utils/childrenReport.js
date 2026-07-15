// Children — Full Life Report
// Lookup by 5th house sign + 5th lord's house (whole-sign, Lahiri).
// Covers child temperament + traditional timing indicators (not medical/fertility advice).

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

export const DISCLAIMER = "This section reflects traditional astrological frameworks around children and family — not a medical or fertility prediction. Timing of children depends on many personal, medical, and life circumstances; please treat this as a reflective, traditional lens rather than a forecast, and consult a doctor for anything related to fertility or family planning."

export const childNatureBySign = {
  Aries: "Traditionally, this placement is associated with children who bring an energetic, headstrong spirit into the family — often independent-minded from a young age, quick to assert what they want, and drawn to physical activity and competition. They're often described as natural leaders among their peers, sometimes testing boundaries simply to understand where they stand.",
  Taurus: "Traditionally, this placement is associated with children who are calm, steady, and comfort-seeking — often slower to warm up in new situations but deeply loyal once settled. They tend to value routine and physical comfort, and often show an early appreciation for food, music, or tactile creative pursuits.",
  Gemini: "Traditionally, this placement is associated with children who are curious, chatty, and quick learners — often asking endless questions and picking up new information with real ease. They tend to have varied interests rather than one fixed passion, and communication or storytelling often comes naturally to them.",
  Cancer: "Traditionally, this placement is associated with children who are emotionally sensitive and deeply attached to home and family — often intuitive about others' feelings from a young age, and happiest in a secure, nurturing environment. They tend to form close, lasting bonds with family members.",
  Leo: "Traditionally, this placement is associated with children who have a natural confidence and warmth — often drawn to performance, leadership among peers, or simply being the center of attention in a likeable way. They tend to have a generous spirit and a strong, visible sense of pride in their own achievements.",
  Virgo: "Traditionally, this placement is associated with children who are thoughtful, detail-oriented, and often mature for their age — frequently helpful, observant, and inclined toward order. They tend to take instructions seriously and may be more self-critical than parents would expect at a young age.",
  Libra: "Traditionally, this placement is associated with children who are sociable, fair-minded, and drawn to harmony — often peacemakers among siblings or friend groups, and sensitive to an unfair or unpleasant atmosphere. Aesthetic sensibility, from clothing choices to their surroundings, often shows up early.",
  Scorpio: "Traditionally, this placement is associated with children who are intense, perceptive, and privately deep-feeling — often more observant of what's really going on around them than they let on. They tend to form very strong, loyal attachments to a small circle rather than broad social groups.",
  Sagittarius: "Traditionally, this placement is associated with children who are adventurous, optimistic, and freedom-loving — often restless if kept too confined, and drawn to exploring, questioning, and learning about the wider world from an early age. Humor and honesty tend to be notable traits.",
  Capricorn: "Traditionally, this placement is associated with children who are unusually serious, responsible, or mature for their age — often taking on responsibility early and approaching challenges with real patience and discipline. They may need gentle encouragement to embrace play and lightness alongside their natural earnestness.",
  Aquarius: "Traditionally, this placement is associated with children who are independent-minded and a little unconventional — often marching to their own drum, with original ideas and interests that may not match their peers. They tend to value fairness and individuality strongly, even from a young age.",
  Pisces: "Traditionally, this placement is associated with children who are imaginative, gentle, and emotionally sensitive — often deeply affected by their surroundings and drawn to creative or make-believe play. They tend to be compassionate toward others, sometimes more attuned to others' feelings than their own.",
}

export const timingModifierByLordHouse = {
  1:  "With your 5th house lord placed in the 1st house, matters of having children are traditionally read as closely tied to your own personal life path and readiness — this placement is often associated with children coming at a point when your own sense of identity and direction feels more settled.",
  2:  "With your 5th house lord placed in the 2nd house, matters of having children are traditionally linked to family and financial stability — some traditions associate this placement with children arriving once resources or family foundations feel more secure.",
  3:  "With your 5th house lord placed in the 3rd house, matters of having children are traditionally linked to a period of initiative or a fresh personal chapter — some traditions read this as children arriving somewhat unexpectedly or during an active, fast-moving period of life.",
  4:  "With your 5th house lord placed in the 4th house, matters of having children are traditionally linked closely to home and domestic stability — some traditions associate this placement with children arriving once a stable home base is genuinely established.",
  5:  "With your 5th house lord placed in its own 5th house, this is traditionally considered a strong, favorable placement for having children — often associated with a comparatively smoother path in this area of life, though individual circumstances always vary.",
  6:  "With your 5th house lord placed in the 6th house, matters of having children are traditionally associated with requiring more patience or effort — some classical texts read this placement as one where family planning may take a bit more time or care, without this being a fixed outcome.",
  7:  "With your 5th house lord placed in the 7th house, matters of having children are traditionally linked closely to the marriage or partnership itself — some traditions associate this placement with children arriving in connection with significant developments in the partnership.",
  8:  "With your 5th house lord placed in the 8th house, matters of having children are traditionally associated with a less predictable timeline — some classical texts note this placement as one where family planning may not follow the expected schedule, without this being a fixed outcome either way.",
  9:  "With your 5th house lord placed in the 9th house, matters of having children are traditionally linked to a period involving belief, travel, or a broadening of perspective — some traditions read this as children arriving during a phase of expanding life outlook.",
  10: "With your 5th house lord placed in the 10th house, matters of having children are traditionally linked closely to career developments — some traditions associate this placement with children arriving around a significant professional milestone or shift.",
  11: "With your 5th house lord placed in the 11th house, matters of having children are traditionally linked to the fulfillment of long-held goals or hopes — some traditions read this placement favorably, associating it with children arriving as one of several life goals coming together.",
  12: "With your 5th house lord placed in the 12th house, matters of having children are traditionally associated with a more private, sometimes delayed, or unconventional timeline — some classical texts note this placement as one worth approaching with extra patience and, where relevant, professional guidance.",
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
    baseText:     childNatureBySign[signName]        ?? '',
    modifierText: timingModifierByLordHouse[lordHouse] ?? '',
  }
}
