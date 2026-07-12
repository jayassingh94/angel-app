// Marriage — Full Life Report
// Lookup by 7th house sign + 7th lord's house (whole-sign, Lahiri).

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

export const seventhHouseSignTraits = {
  Aries: "With Aries in your 7th house, you're likely drawn to a partner who is confident, direct, and independent — someone with real drive of their own. Relationships may start quickly and passionately, though learning patience and compromise with a strong-willed partner is often part of the growth this placement asks for.",
  Taurus: "With Taurus in your 7th house, you're likely drawn to a partner who values stability, loyalty, and shared comfort — steady, dependable relationships tend to suit you far more than dramatic or unpredictable ones. Once committed, this placement often points to long-lasting, deeply loyal partnerships.",
  Gemini: "With Gemini in your 7th house, you're likely drawn to a partner who is intellectually engaging, communicative, and a little playful — conversation and mental connection often matter as much as romantic chemistry. Variety and good communication tend to be essential ingredients for lasting satisfaction in this area.",
  Cancer: "With Cancer in your 7th house, you're likely drawn to a partner who is emotionally nurturing and family-oriented — a strong home life and emotional security are often central to what you look for in marriage. This placement often points to deep emotional bonding, though moodiness on either side needs gentle handling.",
  Leo: "With Leo in your 7th house, you're likely drawn to a partner who is confident, warm, and a little larger-than-life — admiration and mutual pride in each other often matter in this pairing. Relationships here tend to be passionate, though both partners may need to consciously share the spotlight.",
  Virgo: "With Virgo in your 7th house, you're likely drawn to a partner who is practical, detail-oriented, and genuinely helpful — a relationship built on mutual usefulness and care for daily life details rather than pure romantic drama. Being appreciated for effort, not just affection, matters here.",
  Libra: "With Libra in your 7th house, this placement is traditionally considered especially favorable for marriage, since Libra naturally rules partnership. You're likely drawn to balance, harmony, and genuine partnership as an equal — relationships here tend to be graceful, though conflict-avoidance can sometimes delay necessary honest conversations.",
  Scorpio: "With Scorpio in your 7th house, you're likely drawn to a partner who is intense, deeply loyal, and emotionally profound — surface-level relationships rarely satisfy you here. Trust runs deep once established, and this placement often points to transformative, deeply bonded partnerships, sometimes with real emotional intensity along the way.",
  Sagittarius: "With Sagittarius in your 7th house, you're likely drawn to a partner who is adventurous, honest, and philosophically compatible — shared beliefs or a love of exploration often matter as much as romantic chemistry. Freedom within the relationship, not restriction, tends to keep this pairing thriving.",
  Capricorn: "With Capricorn in your 7th house, you're likely drawn to a partner who is mature, responsible, and long-term minded — this placement often favors marriages built more on steady commitment and shared goals than early romantic intensity. Respect and reliability often matter more here than grand gestures.",
  Aquarius: "With Aquarius in your 7th house, you're likely drawn to a partner who is independent-minded, a little unconventional, and intellectually stimulating — friendship often forms the real foundation beneath the romance. Giving each other genuine space tends to be essential for this pairing to last.",
  Pisces: "With Pisces in your 7th house, you're likely drawn to a partner who is compassionate, imaginative, and emotionally sensitive — a deep, almost spiritual connection often matters more here than practical compatibility alone. Clear boundaries help this naturally empathetic pairing avoid losing themselves in each other.",
}

export const seventhLordHouseModifier = {
  1:  "With your 7th house lord placed in the 1st house, marriage and partnership are likely to feel closely tied to your own personal identity — who you are and who you partner with may feel almost inseparable.",
  2:  "With your 7th house lord placed in the 2nd house, marriage is likely to bring financial or family considerations into close focus — shared resources and family values often play a significant role in this partnership.",
  3:  "With your 7th house lord placed in the 3rd house, marriage is likely to involve strong communication or even a partner who feels like a close friend or intellectual match — everyday conversation matters a great deal here.",
  4:  "With your 7th house lord placed in the 4th house, marriage is likely to be closely tied to home and emotional security — building a stable domestic life together often becomes a central relationship theme.",
  5:  "With your 7th house lord placed in the 5th house, marriage is likely to carry a romantic, creative quality — genuine love and shared joy, rather than pure practicality, often characterize this partnership.",
  6:  "With your 7th house lord placed in the 6th house, marriage may involve working through real challenges together — this placement sometimes points to a partnership tested by obstacles, health matters, or service to one another.",
  7:  "With your 7th house lord placed in its own 7th house, partnership themes are especially strong and central — relationships likely play an unusually significant role in shaping your overall life path.",
  8:  "With your 7th house lord placed in the 8th house, marriage may carry an intense, transformative quality — deep emotional bonding, shared secrets, or significant life changes often accompany this partnership.",
  9:  "With your 7th house lord placed in the 9th house, marriage is likely to involve shared beliefs, travel, or higher learning — a partner who expands your worldview or comes from a different background may feature here.",
  10: "With your 7th house lord placed in the 10th house, marriage and career may become closely intertwined — a partner who supports or is involved in your professional life, or a relationship that becomes publicly visible, is common with this placement.",
  11: "With your 7th house lord placed in the 11th house, marriage is likely to bring gains — socially, through community, or toward long-term goals — this placement often favors a partner who feels like a genuine ally toward your ambitions.",
  12: "With your 7th house lord placed in the 12th house, marriage may involve distance at some point — a partner from far away, a quieter/more private partnership, or periods of separation are sometimes associated with this placement.",
}

export function computeMarriage(chart) {
  const { lagnaRashi, grahas } = chart
  const seventhRashi = (lagnaRashi + 6) % 12
  const lordId       = SIGN_LORDS[seventhRashi]
  const lordGraha    = grahas.find(g => g.id === lordId)
  const lordHouse    = lordGraha?.houseNum ?? 7

  const signName    = RASHIS_EN[seventhRashi]
  const signDisplay = RASHIS_DISPLAY[seventhRashi] + ' in H7'
  const lordName    = PLANET_FULL[lordId] ?? lordId

  return {
    signDisplay,
    lordName,
    lordHouse,
    baseText:     seventhHouseSignTraits[signName]    ?? '',
    modifierText: seventhLordHouseModifier[lordHouse] ?? '',
  }
}
