// Career — Full Life Report
// Lookup by 10th house sign + 10th lord's house (whole-sign, Lahiri).

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

export const tenthHouseSignTraits = {
  Aries: "With Aries in your 10th house, your career path likely favors action, initiative, and being first — roles where you can lead, compete, or pioneer something new tend to suit you better than slow, repetitive work. You probably do your best professional work when given real autonomy rather than close supervision.",
  Taurus: "With Taurus in your 10th house, your career path likely favors stability, steady growth, and tangible results — fields connected to finance, resources, or craft-based skill often suit you well. You probably build your professional reputation slowly but durably, rather than through quick, flashy wins.",
  Gemini: "With Gemini in your 10th house, your career path likely favors communication, versatility, and variety — roles in writing, media, sales, or anything involving constant information exchange tend to suit you. You probably thrive more in dynamic, changing environments than in a single fixed routine.",
  Cancer: "With Cancer in your 10th house, your career path likely favors nurturing, caregiving, or emotionally attuned work — fields like healthcare, education, hospitality, or anything involving looking after others often resonate. Your professional reputation is probably built on trust and genuine care rather than pure ambition.",
  Leo: "With Leo in your 10th house, your career path likely favors visibility, leadership, and creative self-expression — roles where you're seen, whether in management, performance, or public-facing work, often suit you. You probably do your best work when your contributions are genuinely recognized.",
  Virgo: "With Virgo in your 10th house, your career path likely favors precision, analysis, and service-oriented work — fields like health, editing, quality control, or detailed technical roles often suit you well. Your professional reputation is probably built on reliability and getting the details right.",
  Libra: "With Libra in your 10th house, your career path likely favors partnership, diplomacy, and aesthetic sensibility — roles in law, design, PR, negotiation, or client-facing work often resonate. You probably do your best work in collaborative settings rather than working entirely alone.",
  Scorpio: "With Scorpio in your 10th house, your career path likely favors depth, research, or transformation-oriented work — fields like investigation, psychology, finance, or anything requiring you to dig beneath the surface often suit you. Your professional reputation is probably built quietly but powerfully over time.",
  Sagittarius: "With Sagittarius in your 10th house, your career path likely favors exploration, teaching, or big-picture thinking — fields like travel, education, publishing, or international work often resonate. You probably do your best work when there's room to think broadly rather than being confined to narrow tasks.",
  Capricorn: "With Capricorn in your 10th house, your career path likely favors structure, long-term ambition, and disciplined effort — this placement is traditionally considered especially strong for career success, often rewarding patience with real authority over time. Your professional reputation is probably built through consistent, visible achievement.",
  Aquarius: "With Aquarius in your 10th house, your career path likely favors innovation, technology, or community-oriented work — fields involving new ideas, networks, or unconventional approaches often suit you. You probably do your best work when given freedom to think differently rather than following rigid convention.",
  Pisces: "With Pisces in your 10th house, your career path likely favors creativity, compassion, or work connected to healing and imagination — fields like the arts, counseling, spirituality, or humanitarian work often resonate. Your professional reputation is probably built on empathy and vision rather than pure competitiveness.",
}

export const tenthLordHouseModifier = {
  1:  "With your 10th house lord placed in the 1st house, your career is closely tied to your personal identity — professional success and your sense of self likely feel deeply intertwined, for better or worse.",
  2:  "With your 10th house lord placed in the 2nd house, your career is closely tied to earning and building resources — financial reward is likely a strong motivator and outcome of your professional path.",
  3:  "With your 10th house lord placed in the 3rd house, your career is closely tied to communication, initiative, and short-term effort — skills in writing, speaking, or quick decisive action likely serve your career well.",
  4:  "With your 10th house lord placed in the 4th house, your career is closely tied to home, roots, or property — work connected to real estate, domestic life, or your local community may play a bigger role than expected.",
  5:  "With your 10th house lord placed in the 5th house, your career is closely tied to creativity, intellect, or teaching — your professional path likely benefits from self-expression and the confidence to showcase your ideas.",
  6:  "With your 10th house lord placed in the 6th house, your career is closely tied to service, competition, or overcoming obstacles — this placement often points to career growth achieved through real effort against real challenges, not easy wins.",
  7:  "With your 10th house lord placed in the 7th house, your career is closely tied to partnerships — business partners, clients, or a spouse's influence may play a meaningful role in your professional trajectory.",
  8:  "With your 10th house lord placed in the 8th house, your career is closely tied to transformation, research, or others' resources — sudden career shifts, inheritance-linked work, or deeply investigative fields may feature prominently.",
  9:  "With your 10th house lord placed in the 9th house, your career is closely tied to higher learning, travel, or belief systems — teaching, publishing, law, or international work are commonly favored under this placement.",
  10: "With your 10th house lord placed in its own 10th house, your career path is unusually strong and central to your life — professional identity and personal ambition are tightly, directly connected.",
  11: "With your 10th house lord placed in the 11th house, your career is closely tied to networks, larger goals, and gains — career growth often comes through connections, communities, or long-term ambitions paying off.",
  12: "With your 10th house lord placed in the 12th house, your career is closely tied to behind-the-scenes work, foreign connections, or solitary effort — you may find more professional fulfillment working away from the spotlight than in it.",
}

export function computeCareer(chart) {
  const { lagnaRashi, grahas } = chart
  const tenthRashi = (lagnaRashi + 9) % 12
  const lordId     = SIGN_LORDS[tenthRashi]
  const lordGraha  = grahas.find(g => g.id === lordId)
  const lordHouse  = lordGraha?.houseNum ?? 10

  const signName    = RASHIS_EN[tenthRashi]
  const signDisplay = RASHIS_DISPLAY[tenthRashi] + ' in H10'
  const lordName    = PLANET_FULL[lordId] ?? lordId

  return {
    signDisplay,
    lordName,
    lordHouse,
    baseText:     tenthHouseSignTraits[signName]    ?? '',
    modifierText: tenthLordHouseModifier[lordHouse] ?? '',
  }
}
