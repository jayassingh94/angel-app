// Love Life — Full Life Report
// Lookup by Venus's sign + Venus's house (distinct from Marriage's 7th house logic).

const RASHIS_EN  = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const RASHIS_DISPLAY = [
  'Mesh (Aries)','Vrishabha (Taurus)','Mithuna (Gemini)','Karka (Cancer)',
  'Simha (Leo)','Kanya (Virgo)','Tula (Libra)','Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)','Makara (Capricorn)','Kumbha (Aquarius)','Meena (Pisces)',
]

export const venusSignTraits = {
  Aries: "With Venus in Aries, you likely fall in love quickly and passionately — attraction tends to be immediate and instinctive rather than slow-building. You probably enjoy the chase and the excitement of new romance, though sustaining that same intensity long-term may take conscious effort.",
  Taurus: "With Venus in Taurus, love for you is likely sensual, steady, and rooted in genuine loyalty — you probably show affection through consistency, physical comfort, and small tangible gestures rather than grand romantic declarations. Once attached, you tend to stay attached.",
  Gemini: "With Venus in Gemini, romance for you likely thrives on conversation, wit, and mental connection — you're probably drawn to partners who can hold your interest intellectually as much as romantically, and variety in how affection is expressed matters to you.",
  Cancer: "With Venus in Cancer, love for you is likely deeply emotional and nurturing — you probably express affection through care, protection, and creating a sense of home together, and you likely seek a partner who reciprocates that same emotional depth.",
  Leo: "With Venus in Leo, romance for you likely carries warmth, generosity, and a flair for the dramatic — you probably enjoy being adored and enjoy adoring in turn, expressing love boldly rather than subtly.",
  Virgo: "With Venus in Virgo, love for you is likely expressed through practical acts of care and genuine attentiveness — you probably show affection by being helpful and detail-oriented about a partner's needs, sometimes needing to consciously add more overt romantic expression.",
  Libra: "With Venus in Libra, romance is likely central to how you experience life — you probably value partnership, charm, and aesthetic harmony in love, and being in a relationship (rather than being alone) tends to genuinely suit your temperament.",
  Scorpio: "With Venus in Scorpio, love for you is likely intense, passionate, and deeply private — surface-level romance rarely satisfies you, and you probably crave a profound, transformative emotional and physical connection with a partner.",
  Sagittarius: "With Venus in Sagittarius, romance for you likely thrives on freedom, adventure, and shared exploration — you probably fall for partners who expand your world, and feeling caged in a relationship is likely your biggest turn-off.",
  Capricorn: "With Venus in Capricorn, love for you is likely serious, committed, and slow-building rather than impulsive — you probably show affection through reliability and long-term investment, valuing a partner who takes the relationship as seriously as you do.",
  Aquarius: "With Venus in Aquarius, romance for you likely values friendship and independence as much as passion — you probably fall for partners who respect your individuality, and unconventional relationship structures may appeal more to you than traditional ones.",
  Pisces: "With Venus in Pisces, love for you is likely dreamy, compassionate, and almost boundless — you probably give deeply and romantically, sometimes to a fault, and finding a partner who reciprocates that same emotional generosity matters greatly to you.",
}

export const venusHouseModifier = {
  1:  "With Venus placed in your 1st house, charm and attractiveness are likely a visible, natural part of your overall presence — love and self-image are closely linked for you.",
  2:  "With Venus placed in your 2nd house, love is likely connected to material comfort and family values — you may express and receive affection partly through gifts, shared resources, or family approval.",
  3:  "With Venus placed in your 3rd house, love likely thrives through communication — flirtation, witty conversation, and connecting through words probably play a big role in your romantic life.",
  4:  "With Venus placed in your 4th house, love is likely deeply connected to home and emotional roots — you probably feel most romantic in a comfortable domestic setting, and family approval of a partner may matter to you.",
  5:  "With Venus placed in your 5th house, this is traditionally considered a strong placement for romance — love, creativity, and playful courtship likely come easily and pleasurably to you.",
  6:  "With Venus placed in your 6th house, love may involve working through friction or require conscious effort — relationships here sometimes start through service, routine, or even minor conflict before settling into affection.",
  7:  "With Venus placed in your 7th house, this is traditionally considered a favorable placement for partnership generally — charm, grace, and a natural instinct for relationships likely serve you well here.",
  8:  "With Venus placed in your 8th house, love likely carries intensity and depth — attraction to mystery, transformation, or deeply private emotional bonds is common with this placement.",
  9:  "With Venus placed in your 9th house, love may connect to travel, philosophy, or partners from different backgrounds — romance that expands your worldview is likely appealing to you.",
  10: "With Venus placed in your 10th house, love and public/professional life may intersect — you may meet romantic partners through career circles, or charm may play a visible role in your public reputation.",
  11: "With Venus placed in your 11th house, love may develop through friendship first — romantic partners who start as friends, or relationships nurtured through shared social circles, are common with this placement.",
  12: "With Venus placed in your 12th house, love may carry a private, even secretive quality — quiet, behind-the-scenes romance, or a deep need for emotional privacy within relationships, often accompanies this placement.",
}

export function computeLoveLife(chart) {
  const { grahas } = chart
  const venus = grahas.find(g => g.id === 'Ve')
  const rashiIdx   = venus?.rashiIdx  ?? 0
  const venusHouse = venus?.houseNum  ?? 1

  const signName    = RASHIS_EN[rashiIdx]
  const signDisplay = RASHIS_DISPLAY[rashiIdx]

  return {
    signDisplay,
    lordName:     'Venus',
    lordHouse:    venusHouse,
    baseText:     venusSignTraits[signName]       ?? '',
    modifierText: venusHouseModifier[venusHouse]  ?? '',
  }
}
