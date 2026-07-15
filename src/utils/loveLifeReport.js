// Love Life — Full Life Report
// Lookup by Venus's sign + Venus's house (distinct from Marriage's 7th house logic).

const RASHIS_EN  = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const RASHIS_DISPLAY = [
  'Mesh (Aries)','Vrishabha (Taurus)','Mithuna (Gemini)','Karka (Cancer)',
  'Simha (Leo)','Kanya (Virgo)','Tula (Libra)','Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)','Makara (Capricorn)','Kumbha (Aquarius)','Meena (Pisces)',
]

export const venusSignTraits = {
  Aries: "You likely fall in love quickly and passionately — attraction tends to be immediate and instinctive for you rather than something that slowly builds over time. There's an excitement in the chase and the early stages of romance that genuinely energizes you.\n\nDay to day, this shows up as directness in how you pursue someone you're interested in, and a preference for partners who are equally upfront about their feelings. Playing games or waiting around for someone else to make the first move rarely suits your temperament.\n\nThe pattern worth noticing is sustaining that same intensity once the initial excitement fades. Learning to nurture a relationship through its quieter, steadier phases — not just the thrilling beginning — tends to be the real growth area here.",

  Taurus: "Love for you is likely sensual, steady, and rooted in genuine loyalty. You probably show affection through consistency, physical comfort, and small tangible gestures — a home-cooked meal, a comfortable space together — rather than through grand romantic declarations.\n\nDay to day, this shows up as real patience in romance; you're probably not in a rush to define things quickly, preferring to let attraction deepen naturally over time. Once attached, you tend to stay attached, sometimes long after a relationship has stopped serving you.\n\nThe pattern worth noticing is possessiveness or resistance to change within a relationship. Learning that love doesn't require holding on tightly to feel secure tends to be the quieter lesson here.",

  Gemini: "Romance for you likely thrives on conversation, wit, and mental connection. You're probably drawn to partners who can hold your interest intellectually as much as romantically, and variety in how affection is expressed genuinely matters to you.\n\nDay to day, this shows up as flirtation through words — clever texts, engaging conversation, playful banter — probably being one of your primary love languages. Boredom, more than conflict, is likely the bigger threat to your romantic satisfaction.\n\nThe pattern worth noticing is depth versus stimulation. The same need for mental variety that makes you an engaging partner can also mean you drift toward the next interesting person before real intimacy has had a chance to develop. Staying curious about one person, specifically, tends to be the growth area here.",

  Cancer: "Love for you is likely deeply emotional and nurturing. You probably express affection through care, protection, and creating a genuine sense of home together, and you likely seek a partner who reciprocates that same emotional depth rather than staying guarded.\n\nDay to day, this shows up as real attentiveness to a partner's emotional needs, sometimes anticipating them before they're voiced. You probably give generously in relationships, and feeling truly needed likely matters as much to you as feeling loved.\n\nThe pattern worth noticing is emotional guardedness when hurt. The same sensitivity that makes you a deeply caring partner can also mean you withdraw rather than communicate when you feel wounded. Learning to voice hurt directly, rather than retreating, tends to serve your relationships better.",

  Leo: "Romance for you likely carries warmth, generosity, and a flair for the dramatic. You probably enjoy being adored and enjoy adoring in turn, expressing love boldly — grand gestures, public affection, genuine enthusiasm — rather than subtly or quietly.\n\nDay to day, this shows up as a real need to feel special and appreciated in a relationship, not just comfortably settled. You probably show love generously, and you likely expect that same generosity reflected back to you.\n\nThe pattern worth noticing is needing constant validation. The same warmth that makes you a passionate partner can tip into insecurity if attention or admiration ever feels like it's fading. Learning that quieter, steadier affection is just as real as the dramatic kind tends to be the growth area here.",

  Virgo: "Love for you is likely expressed through practical acts of care and genuine attentiveness. You probably show affection by being helpful and detail-oriented about a partner's needs — remembering small preferences, quietly solving problems — sometimes needing to consciously add more overt romantic expression alongside this.\n\nDay to day, this shows up as noticing and responding to what a partner actually needs, even unspoken, more than grand romantic talk. You probably hold yourself to high standards in relationships, sometimes being your own harshest critic about how you're showing up.\n\nThe pattern worth noticing is criticism overshadowing warmth. The same attentiveness that makes you a genuinely thoughtful partner can come across as nitpicking if it's not balanced with clear appreciation. Voicing love out loud, not just through acts of service, tends to matter here.",

  Libra: "Romance is likely central to how you experience life — you probably value partnership, charm, and aesthetic harmony in love, and being in a relationship, rather than being alone, tends to genuinely suit your temperament.\n\nDay to day, this shows up as real ease in courtship — you're probably naturally charming, socially graceful, and drawn to creating pleasant, harmonious romantic experiences. Compromise likely comes easily to you in relationships, sometimes almost too easily.\n\nThe pattern worth noticing is losing your own preferences in the effort to keep a partner happy. Learning to voice what you actually want, rather than automatically deferring, tends to be the quieter lesson here.",

  Scorpio: "Love for you is likely intense, passionate, and deeply private. Surface-level romance rarely satisfies you, and you probably crave a profound, transformative emotional and physical connection with a partner rather than something casual.\n\nDay to day, this shows up as an all-or-nothing quality to how you love — half-measures in romance genuinely frustrate you. You probably sense a partner's true feelings with real accuracy, and trust, once given, tends to run remarkably deep.\n\nThe pattern worth noticing is jealousy or a need for control disguised as devotion. The same intensity that makes your love powerful can tip into possessiveness if left unchecked. Learning that real intimacy includes trusting a partner's independence tends to be the growth area here.",

  Sagittarius: "Romance for you likely thrives on freedom, adventure, and shared exploration. You probably fall for partners who expand your world — intellectually, geographically, philosophically — and feeling caged in a relationship is likely your biggest romantic turn-off.\n\nDay to day, this shows up as a preference for a partner who's genuinely excited to explore alongside you, rather than one who wants to stay comfortably settled. You probably value honesty in romance above almost anything, even when it's blunt.\n\nThe pattern worth noticing is commitment anxiety. The same love of freedom that makes you an exciting partner can make settling into deeper commitment feel unexpectedly threatening. Learning that commitment doesn't have to mean losing your freedom tends to be the growth area here.",

  Capricorn: "Love for you is likely serious, committed, and slow-building rather than impulsive. You probably show affection through reliability and long-term investment, valuing a partner who takes the relationship as seriously as you do, rather than treating it casually.\n\nDay to day, this shows up as caution in the early stages of romance — you probably don't fall quickly, preferring to see real consistency before fully investing your feelings. Once committed, though, you tend to stay committed with genuine seriousness.\n\nThe pattern worth noticing is emotional guardedness. The same seriousness that makes you a dependable partner can leave someone wondering whether you actually feel as much as you do beneath the surface. Voicing affection more openly, not just demonstrating it through steadiness, tends to matter here.",

  Aquarius: "Romance for you likely values friendship and independence as much as passion. You probably fall for partners who respect your individuality, and unconventional relationship structures or arrangements may appeal more to you than traditional expectations.\n\nDay to day, this shows up as valuing a partner who's genuinely interesting and independent-minded, someone you'd choose as a friend even without the romance. You probably need real space within a relationship to feel comfortable.\n\nThe pattern worth noticing is emotional distance. The same independence that makes you a respectful partner can create real distance if a partner needs more overt emotional closeness than you naturally offer. Being vulnerable, not just companionable, tends to be the growth area here.",

  Pisces: "Love for you is likely dreamy, compassionate, and almost boundless. You probably give deeply and romantically, sometimes to a fault, and finding a partner who reciprocates that same emotional generosity matters greatly to you.\n\nDay to day, this shows up as a tendency to idealize a partner, especially early on, and to give more emotionally than may be coming back your way. You probably sense a partner's unspoken feelings with real accuracy and empathy.\n\nThe pattern worth noticing is losing yourself in a relationship. The same compassion that makes you a deeply loving partner can mean overlooking real incompatibilities or red flags for too long. Staying gently grounded in reality, even while loving fully, tends to be the growth area here.",
}

export const venusHouseModifier = {
  1:  "With Venus placed in your 1st house, charm and attractiveness are likely a visible, natural part of your overall presence — love and self-image are closely linked for you, and how you feel about your romantic life tends to shape your broader confidence.",

  2:  "With Venus placed in your 2nd house, love is likely connected to material comfort and family values. You may express and receive affection partly through gifts, shared resources, or a partner's approval from your family.",

  3:  "With Venus placed in your 3rd house, love likely thrives through communication. Flirtation, witty conversation, and connecting through words probably play a genuinely significant role in your romantic life, more than physical gestures alone.",

  4:  "With Venus placed in your 4th house, love is likely deeply connected to home and emotional roots. You probably feel most romantic in a comfortable domestic setting, and family approval of a partner may matter more to you than you'd initially admit.",

  5:  "With Venus placed in your 5th house, this is traditionally considered a strong placement for romance. Love, creativity, and playful courtship likely come easily and pleasurably to you, with genuine joy often present in your romantic life.",

  6:  "With Venus placed in your 6th house, love may involve working through friction or require conscious effort. Relationships here sometimes start through service, routine, or even minor conflict before genuinely settling into affection.",

  7:  "With Venus placed in your 7th house, this is traditionally considered a favorable placement for partnership generally. Charm, grace, and a natural instinct for relationships likely serve you especially well here.",

  8:  "With Venus placed in your 8th house, love likely carries real intensity and depth. Attraction to mystery, transformation, or deeply private emotional bonds is common with this placement, rather than anything casual or surface-level.",

  9:  "With Venus placed in your 9th house, love may connect to travel, philosophy, or partners from different backgrounds. Romance that genuinely expands your worldview is likely appealing to you, more than a partner who's simply familiar.",

  10: "With Venus placed in your 10th house, love and public or professional life may intersect. You may meet romantic partners through career circles, or charm may play a visible role in how you're seen professionally.",

  11: "With Venus placed in your 11th house, love may develop through friendship first. Romantic partners who start as friends, or relationships nurtured through shared social circles and community, are common with this placement.",

  12: "With Venus placed in your 12th house, love may carry a private, even secretive quality. Quiet, behind-the-scenes romance, or a genuine need for emotional privacy within relationships, often accompanies this placement.",
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
