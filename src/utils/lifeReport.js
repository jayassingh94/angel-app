// ── Life Report interpretation tables ─────────────────────────────────────────
// Rules engine: static lookup by Lagna sign + Lagna lord's house.
// Usage: lagnaSignTraits[signName] + lagnaLordHouseModifier[houseNum]

const SIGN_LORDS_LR  = ['Ma','Ve','Me','Mo','Su','Me','Ve','Ma','Ju','Sa','Sa','Ju']
const RASHIS_EN      = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const RASHIS_DISPLAY = [
  'Mesh (Aries)','Vrishabha (Taurus)','Mithuna (Gemini)','Karka (Cancer)',
  'Simha (Leo)','Kanya (Virgo)','Tula (Libra)','Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)','Makara (Capricorn)','Kumbha (Aquarius)','Meena (Pisces)',
]
const PLANET_FULL = {
  Su:'Sun', Mo:'Moon', Ma:'Mars', Me:'Mercury',
  Ju:'Jupiter', Ve:'Venus', Sa:'Saturn', Ra:'Rahu', Ke:'Ketu',
}

// ── Layer 1: Lagna sign base traits ───────────────────────────────────────────

export const lagnaSignTraits = {
  Aries: "With Aries rising, there's a natural directness and courage to how you move through the world. You tend to act first and reflect after, which gives you real momentum but sometimes means you leap before fully weighing the landing. People likely experience you as energetic, confident, and quick to take the lead — someone who isn't afraid to go first.",
  Taurus: "With Taurus rising, you carry a steady, grounded presence — someone who values comfort, consistency, and doing things at your own unhurried pace. There's a quiet determination here; once you commit to something, you rarely abandon it. Others likely experience you as reliable and calm, though also firm once your mind is made up.",
  Gemini: "With Gemini rising, your mind moves quickly and curiously, often juggling multiple interests or conversations at once. You likely communicate easily and adapt fast to new situations, though staying focused on one thing for too long can feel restrictive. People probably see you as witty, sociable, and mentally quick on your feet.",
  Cancer: "With Cancer rising, there's a strong emotional undercurrent to how you experience the world — sensitive, intuitive, and often protective of the people close to you. Home and a sense of emotional safety likely matter more to you than they might let on. Others probably see you as caring, a little private, and deeply loyal once trust is built.",
  Leo: "With Leo rising, there's a natural warmth and presence that tends to draw attention, whether you're seeking it or not. Confidence and a sense of personal dignity run through how you carry yourself. People likely experience you as generous, expressive, and someone who leads more through charisma than force.",
  Virgo: "With Virgo rising, you likely approach life with a sharp, analytical eye — noticing details others miss and often holding yourself to high standards. There's a genuine desire to be useful and to do things properly, sometimes at the cost of being overly self-critical. Others probably see you as thoughtful, precise, and quietly dependable.",
  Libra: "With Libra rising, there's a natural pull toward balance, fairness, and pleasant surroundings — you likely dislike conflict and work hard to keep relationships harmonious. Charm and diplomacy come easily, though decision-making can sometimes feel harder than it should. People probably experience you as gracious, sociable, and genuinely fair-minded.",
  Scorpio: "With Scorpio rising, there's an intensity beneath the surface — you likely feel things deeply even when you don't show it outright, and you have sharp instincts about people and situations. Privacy matters to you, and trust isn't given lightly. Others probably experience you as magnetic, perceptive, and quietly powerful.",
  Sagittarius: "With Sagittarius rising, there's an optimistic, freedom-loving energy to how you approach life — a genuine love of exploration, whether physical travel or exploring ideas. You likely speak your mind candidly, sometimes more bluntly than intended. People probably see you as adventurous, honest, and refreshingly unpretentious.",
  Capricorn: "With Capricorn rising, there's a serious, responsible undertone to your presence — you likely take on responsibility early and value long-term achievement over quick wins. Patience and discipline come more naturally to you than to most. Others probably experience you as mature, hardworking, and someone who leads by quiet example.",
  Aquarius: "With Aquarius rising, you likely think independently and sometimes unconventionally, more drawn to ideas and principles than to fitting in. There's a genuine care for community or humanity broadly, even if one-on-one closeness feels harder to navigate. People probably see you as original, intellectually curious, and a little hard to pin down.",
  Pisces: "With Pisces rising, there's a dreamy, empathetic quality to how you experience the world — sensitive to others' emotions, sometimes to the point of absorbing them. Imagination and intuition run strong, and practical matters can feel secondary to your inner world. Others probably experience you as gentle, compassionate, and quietly perceptive.",
}

// ── Layer 2: Lagna lord house modifiers ───────────────────────────────────────

export const lagnaLordHouseModifier = {
  1:  "With your Ascendant's ruling planet placed in your own 1st house, your core personality tends to express itself directly and strongly — what you see is largely what you get, with less filtering between your inner nature and outward behavior.",
  2:  "With your Ascendant's ruling planet placed in the 2nd house, your personality tends to express itself through your relationship with resources, family values, and how you speak — financial security and family often shape your sense of self more than most.",
  3:  "With your Ascendant's ruling planet placed in the 3rd house, your personality tends to express itself through communication, courage, and initiative — you likely find your voice through speaking up, writing, or short bursts of bold action.",
  4:  "With your Ascendant's ruling planet placed in the 4th house, your personality tends to express itself through emotional roots — home, family, and inner peace matter deeply to your sense of who you are, even if that's not always visible outwardly.",
  5:  "With your Ascendant's ruling planet placed in the 5th house, your personality tends to express itself through creativity, intellect, and self-expression — you likely feel most yourself when creating, learning, or mentoring.",
  6:  "With your Ascendant's ruling planet placed in the 6th house, your personality tends to express itself through overcoming challenges — a fighter's instinct, service to others, or resilience through difficulty often defines how you show up in the world.",
  7:  "With your Ascendant's ruling planet placed in the 7th house, your personality tends to express itself strongly through relationships and partnership — you likely understand yourself most clearly in relation to others, rather than in isolation.",
  8:  "With your Ascendant's ruling planet placed in the 8th house, your personality tends to express itself through depth, transformation, and an interest in what lies beneath the surface — you likely have a more private, intense inner world than others realize.",
  9:  "With your Ascendant's ruling planet placed in the 9th house, your personality tends to express itself through beliefs, philosophy, or a search for larger meaning — higher learning, travel, or spirituality often shape your core identity.",
  10: "With your Ascendant's ruling planet placed in the 10th house, your personality tends to express itself strongly through career and public life — how you're seen professionally often becomes closely tied to your personal sense of identity.",
  11: "With your Ascendant's ruling planet placed in the 11th house, your personality tends to express itself through goals, social networks, and larger ambitions — friendships and long-term aspirations often shape how you see yourself.",
  12: "With your Ascendant's ruling planet placed in the 12th house, your personality tends to express itself through introspection, solitude, or spiritual inclination — you may feel more like an observer of life than a constant participant in its noise.",
}

// ── Computation ───────────────────────────────────────────────────────────────

export function computePersonality(chart) {
  const { lagnaRashi, grahas } = chart
  const lordId    = SIGN_LORDS_LR[lagnaRashi]
  const lordGraha = grahas.find(g => g.id === lordId)
  const lordHouse = lordGraha?.houseNum ?? 1

  const signName    = RASHIS_EN[lagnaRashi]
  const signDisplay = RASHIS_DISPLAY[lagnaRashi]
  const lordName    = PLANET_FULL[lordId] ?? lordId

  return {
    signDisplay,
    lordName,
    lordHouse,
    baseText:     lagnaSignTraits[signName]          ?? '',
    modifierText: lagnaLordHouseModifier[lordHouse]  ?? '',
  }
}
