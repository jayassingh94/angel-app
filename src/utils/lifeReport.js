// ── Life Report interpretation tables ────────────────────────────────────────
// Classical Jyotish rules engine: static lookup, no API needed.

const SIGN_LORDS_LR = ['Ma','Ve','Me','Mo','Su','Me','Ve','Ma','Ju','Sa','Sa','Ju']

const PLANET_FULL = {
  Su:'Sun', Mo:'Moon', Ma:'Mars', Me:'Mercury',
  Ju:'Jupiter', Ve:'Venus', Sa:'Saturn', Ra:'Rahu', Ke:'Ketu',
}

// ── Lagna sign personalities (0=Mesh … 11=Meena) ──────────────────────────────

export const LAGNA_PERSONALITY = [
  { // 0 Mesh
    signTitle: 'Mesh (Aries) Lagna',
    archetype: 'The Pioneer',
    keywords:  'Bold · Energetic · Direct',
    paras: [
      'The Mesh ascendant confers a dynamic, pioneering spirit. You possess an innate drive to initiate — projects, conversations, and new chapters of life begin with your energy. Mars as your chart ruler gives physical vitality, directness, and a competitive edge that others notice immediately.',
      'You tend toward action over deliberation, preferring to learn by doing rather than observing. First impressions are strong and often accurate; you are energised by challenge and can accomplish in a day what others take weeks to consider.',
      'The lifelong refinement for Mesh rising is cultivating patience and follow-through. Your strength lies in the spark, and learning to sustain that fire past the initial momentum — to finish as boldly as you begin — is the mature expression of your Mars-ruled chart.',
    ],
  },
  { // 1 Vrishabha
    signTitle: 'Vrishabha (Taurus) Lagna',
    archetype: 'The Builder',
    keywords:  'Patient · Steadfast · Sensory',
    paras: [
      'The Vrishabha ascendant gives an earthy, steadfast presence. You build things — relationships, careers, routines, a beautiful home — with care and deliberation. Venus as your chart ruler inclines you toward beauty, comfort, and sensory richness, and others experience you as grounding and genuinely pleasant to be around.',
      'You possess real staying power: where others abandon efforts at the first difficulty, you persist. Security and loyalty matter deeply, and you give both in generous measure to the people and commitments you have chosen.',
      'The shadow side is a tendency toward inertia and possessiveness. Once you have something of value — an object, a relationship, a belief — releasing it can be the deepest spiritual work of your life, and the practice through which Vrishabha energy reaches its fullest expression.',
    ],
  },
  { // 2 Mithuna
    signTitle: 'Mithuna (Gemini) Lagna',
    archetype: 'The Connector',
    keywords:  'Curious · Communicative · Adaptable',
    paras: [
      'The Mithuna ascendant shapes a curious, communicative, and mentally active personality. Mercury as your chart ruler makes information your primary medium — you gather it, process it, and transmit it with unusual speed.',
      'You have the gift of genuine interest in most people you meet, and conversations feel richer in your presence. Adaptability is a real strength here: you find a way to be at home in most environments and can hold multiple perspectives simultaneously with genuine ease.',
      'Your challenge is depth. The same quickness that makes you agile can also keep you on the surface, moving from idea to idea before any single one has taken root. Sustained inquiry — the willingness to go slow with one thing long enough to truly understand it — is the cultivation Mercury-ruled rising charts call for.',
    ],
  },
  { // 3 Karka
    signTitle: 'Karka (Cancer) Lagna',
    archetype: 'The Nurturer',
    keywords:  'Feeling · Protective · Perceptive',
    paras: [
      'The Karka ascendant produces a deeply feeling, perceptive, and nurturing nature. The Moon as your chart ruler means your inner world is rich and ever-changing — you are exquisitely attuned to the emotional undercurrents in every room you enter.',
      'You have a natural instinct for protection: of family, of memory, of the things and people you love. Others often feel seen and cared for in your company, sometimes before you have said a word. This receptivity is a genuine gift.',
      'The work for this rising sign is learning to hold your sensitivity without being overwhelmed by it. You can feel everything — the practice is remaining anchored in yourself while doing so, so that empathy becomes a strength rather than a weight.',
    ],
  },
  { // 4 Simha
    signTitle: 'Simha (Leo) Lagna',
    archetype: 'The Sovereign',
    keywords:  'Warm · Expressive · Authoritative',
    paras: [
      'The Simha ascendant confers natural authority, warmth, and a desire to shine. The Sun as your chart ruler means your identity is closely tied to self-expression and recognition — you thrive when seen, heard, and genuinely appreciated.',
      'There is a royalty to Simha risings: a quality of natural leadership that others sense and often defer to. Generosity and loyalty are among your finest traits — your people know you will show up, and fully.',
      'The shadow side is pride and difficulty handling criticism. The Sun does not like to dim. The lifelong inquiry is learning which validation must come from within, building the internal ground that makes external recognition a pleasure rather than a need.',
    ],
  },
  { // 5 Kanya
    signTitle: 'Kanya (Virgo) Lagna',
    archetype: 'The Refiner',
    keywords:  'Analytical · Discerning · Service-oriented',
    paras: [
      'The Kanya ascendant gives an analytical, discerning, and service-oriented personality. Mercury here operates with discrimination rather than pure curiosity — you see the flaw, the inefficiency, the way things could be improved, and you feel compelled to act on that vision.',
      'There is a quiet conscientiousness to Kanya risings: you keep your word, attend to the details others miss, and take quality seriously in everything from your work to your relationships. Others lean on your precision and reliability.',
      'The shadow is perfectionism and self-criticism. The healing practice is learning to offer yourself the same precise, compassionate attention you give to the things and people in your care — to hold your own effort with as much regard as the standard you set.',
    ],
  },
  { // 6 Tula
    signTitle: 'Tula (Libra) Lagna',
    archetype: 'The Diplomat',
    keywords:  'Graceful · Relational · Fair-minded',
    paras: [
      'The Tula ascendant confers natural grace, a strong aesthetic sense, and a deep need for harmony and fairness. Venus as your chart ruler inclines you toward beauty in all its forms — visual, social, relational — and others experience you as refined and easy to be with.',
      'You are most alive in partnership and in dialogue, in the interplay between perspectives. Diplomacy comes naturally; conflict feels almost physically painful. Your gift is restoring balance where others only see opposition.',
      'The challenge is decisiveness. When every perspective has merit and harmony is prized above all, making a firm choice — especially one that will displease someone — requires deliberate cultivation. Learning to hold a position with grace is the growth edge of Tula rising.',
    ],
  },
  { // 7 Vrishchika
    signTitle: 'Vrishchika (Scorpio) Lagna',
    archetype: 'The Transformer',
    keywords:  'Intense · Perceptive · Enduring',
    paras: [
      'The Vrishchika ascendant is one of the most penetrating in the zodiac. Mars here operates beneath the surface — your strength is not loud but focused, enduring, and investigative. You read motives and undercurrents that others miss entirely, often well before they reveal themselves.',
      'There is a quality of psychological depth to this rising sign: you have experienced things that have transformed you, and that transformative capacity — the willingness to go through fire and emerge changed — is your greatest gift to offer the world.',
      'The shadow is control and the tendency to hold wounds close. Learning to release — people, outcomes, old grievances — is the central spiritual work of Vrishchika rising, and the path through which your natural regenerative power finds its full expression.',
    ],
  },
  { // 8 Dhanu
    signTitle: 'Dhanu (Sagittarius) Lagna',
    archetype: 'The Seeker',
    keywords:  'Optimistic · Philosophical · Expansive',
    paras: [
      'The Dhanu ascendant confers a broad, philosophical, and naturally optimistic spirit. Jupiter as your chart ruler gives you an expansive worldview, genuine enthusiasm for ideas and experiences, and the gift of inspiring others by your presence and example.',
      'You are drawn toward meaning — toward understanding why things are the way they are and where existence is heading. Travel, study, teaching, and the big questions feel like home to you. Life is most alive when there is a direction to move toward.',
      'The shadow is excess and difficulty with limitation. Jupiter is the planet of expansion, and the work for this rising sign is learning to go deep rather than wide — to develop wisdom from experience rather than continuously seeking the next horizon.',
    ],
  },
  { // 9 Makara
    signTitle: 'Makara (Capricorn) Lagna',
    archetype: 'The Architect',
    keywords:  'Disciplined · Patient · Authoritative',
    paras: [
      'The Makara ascendant is marked by seriousness, discipline, and a clear-eyed relationship with time and effort. Saturn as your chart ruler gives you an innate understanding that worthwhile things are built slowly — that competence, reputation, and real security are earned through consistent, patient work, not shortcut.',
      'You carry a natural authority that tends to increase with age; many Makara risings find that life becomes genuinely more rewarding in the second half. Earlier years are often spent laying foundations that others later admire.',
      'The shadow is austerity and difficulty receiving. You give structure to others\' lives but can struggle to allow yourself warmth, ease, and rest. Softening is not weakness for this rising sign — it is the fullest expression of Saturn\'s maturity.',
    ],
  },
  { // 10 Kumbha
    signTitle: 'Kumbha (Aquarius) Lagna',
    archetype: 'The Visionary',
    keywords:  'Original · Humanitarian · Independent',
    paras: [
      'The Kumbha ascendant produces an original, humanitarian, and somewhat unconventional personality. Saturn here operates in an airy mode — principled, future-oriented, and socially conscious. You think in systems and collectives rather than individuals, and feel a genuine pull toward contributing to something larger than yourself.',
      'There is often a quality of subtle detachment in this rising sign — an ability to observe life from a slight remove that gives perspective, and occasionally makes intimate connection feel more complex than it needs to be.',
      'The work is bridging the universal care you carry with the personal tenderness that real relationships require — learning to be close, not just connected, and to let your revolutionary vision be grounded in love as much as in principle.',
    ],
  },
  { // 11 Meena
    signTitle: 'Meena (Pisces) Lagna',
    archetype: 'The Mystic',
    keywords:  'Empathic · Imaginative · Perceptive',
    paras: [
      'The Meena ascendant is the most permeable of the twelve — sensitive, empathic, imaginative, and attuned to the invisible dimensions of experience. Jupiter as your chart ruler gives you faith, a generous spirit, and a natural connection to the symbolic and sacred.',
      'You absorb the emotional atmosphere of your environment with remarkable sensitivity, which can be both a gift and a weight. Creative expression, spiritual practice, and time in natural settings tend to be genuinely restorative for this rising sign.',
      'The work is developing healthy boundaries without losing the gift of your openness — learning when to be ocean and when to be shore — and discovering that real compassion includes being able to say no when the current would carry you somewhere it should not.',
    ],
  },
]

// ── Lagna lord in house (house 1–12, generic across all planets) ───────────────

export const LAGNA_LORD_IN_HOUSE = {
  1:  'Your Lagna lord returns to the first house, concentrating that planet\'s energy directly in your personality and physical presence. This placement is self-directing and personally empowered — the qualities of your chart ruler are written plainly into your manner, appearance, and the way you engage the world.',
  2:  'Your Lagna lord is placed in the second house, directing your vitality toward accumulated resources, speech, and family matters. You are likely to build material security through your own sustained effort, and your relationship with your birth family carries particular weight in how your sense of self develops over time.',
  3:  'Your Lagna lord placed in the third house channels your core energy into communication, initiative, and close relationships with siblings and neighbours. This position lends courage and a hands-on approach — you learn best by doing, and your willingness to work and communicate directly is one of your defining strengths.',
  4:  'Your Lagna lord in the fourth house orients your fundamental identity toward home, roots, and inner contentment. There is a deep pull toward establishing a secure private life, and the quality of your domestic environment — as a child and as an adult — significantly shapes your sense of who you are.',
  5:  'Your Lagna lord in the fifth house points your life energy toward creative expression, learning, and the cultivation of joy. There is a natural gift for teaching, artistic endeavour, and working with or for children, and your relationship with both intellect and pleasure tends to be particularly alive and generative.',
  6:  'Your Lagna lord in the sixth house directs your core vitality toward overcoming obstacles, service, and matters of health and daily discipline. Life may present recurring challenges that call for active problem-solving; through that process you develop unusual resilience and practical capability. There is real potential for success in medicine, law, or any field that requires focused effort against difficulty.',
  7:  'Your Lagna lord in the seventh house makes relationships the central arena of your life and self-discovery. Partnerships — romantic, professional, and social — are where your identity is most fully expressed and tested. You often attract partners who embody qualities you are actively developing within yourself.',
  8:  'Your Lagna lord in the eighth house draws your life force toward depth, transformation, and the hidden dimensions of experience. This placement often coincides with periods of profound inner change, an interest in research or esoteric knowledge, and a need to move through what is concealed before what is truly possible can open.',
  9:  'Your Lagna lord in the ninth house aligns your essential self with purpose, spiritual seeking, and long journeys — physical, philosophical, or both. Luck tends to flow through right action and alignment with your values, and connection with a teacher or wisdom tradition often plays a formative and sustaining role.',
  10: 'Your Lagna lord in the tenth house is one of the strongest placements for professional achievement and public recognition. Your identity and your vocation are closely intertwined — who you are and what you do feel inseparable — and this typically produces genuine authority and reputation in your chosen field over time.',
  11: 'Your Lagna lord in the eleventh house directs your personal energy toward fulfilling desires, building networks, and material gain. Social connection comes naturally, and there is often a real capacity to turn relationships into lasting opportunity. Aspirations tend to be large, and the persistence to pursue them over the long arc is one of your underlying strengths.',
  12: 'Your Lagna lord in the twelfth house takes your core vitality behind the visible world — into retreat, foreign experience, spiritual practice, or work that involves sacrifice and service to those at the edges. This placement can indicate a life partly away from the land of birth, or a path that leads through periods of loss toward genuine liberation and inner depth.',
}

// ── Moon sign emotional nature overlay (0=Mesh … 11=Meena) ───────────────────

export const MOON_SIGN_OVERLAY = [
  { label: 'Moon in Mesh (Aries)',       body: 'Your mind moves quickly and decisively, firing up in response to challenge and cooling as quickly. Emotionally, you process best through action — sitting with uncertainty feels uncomfortable, and you typically feel better once you have responded rather than waited. Courage is a genuine emotional resource for you.' },
  { label: 'Moon in Vrishabha (Taurus)', body: 'Your inner world is steady, sensory, and deeply attached to what is familiar. You are reassured by the physical — good food, touch, beauty, natural surroundings — and your moods stabilise in environments that feel safe and predictable. Change, even welcome change, typically requires more adjustment time than you might expect of yourself.' },
  { label: 'Moon in Mithuna (Gemini)',   body: 'Your mind is quick, curious, and in need of stimulation. You process emotions through talking and thinking, and connecting with others about your inner life is genuinely helpful. Restlessness can be a recurring pattern — when surroundings grow too predictable, your thoughts begin looking for the next interesting thing.' },
  { label: 'Moon in Karka (Cancer)',     body: 'The Moon is at home in Karka, and this placement produces a deeply feeling, nurturing, and memory-rich inner life. You are exquisitely attuned to the emotional atmosphere around you and can read others\' needs almost instinctively. Your relationship with the past — family, home, childhood — remains alive and relevant throughout your life.' },
  { label: 'Moon in Simha (Leo)',        body: 'Your inner life has a dramatic quality — feelings arrive with full intensity and colour, and you need them to be witnessed and acknowledged. Emotionally, recognition matters: when you feel seen and appreciated, your warmth and generosity flow freely; when overlooked, a quiet hurt can settle and linger.' },
  { label: 'Moon in Kanya (Virgo)',      body: 'Your mind tends toward analysis of emotional experience — you want to understand what you feel and why. There is a gentle self-critic at work in your inner life, and learning to soften that voice is often key emotional work. Service and usefulness to others provide real nourishment for this Moon placement.' },
  { label: 'Moon in Tula (Libra)',       body: 'Your emotional equilibrium depends on harmony in your environment. Conflict or dissonance is felt as genuine inner disturbance, and you have a natural gift for restoring relational balance. You thrive with a partner or close collaborator, and the quality of your closest relationships significantly shapes your general wellbeing.' },
  { label: 'Moon in Vrishchika (Scorpio)', body: 'Emotionally, very little passes through your awareness without being registered at depth. You feel intensely and remember acutely — especially what has wounded or moved you. There is a powerful instinct for psychological truth in this Moon placement, and a capacity for endurance and regeneration that few others match.' },
  { label: 'Moon in Dhanu (Sagittarius)', body: 'Your inner life reaches toward meaning, adventure, and the possibility of something more. You recover from setbacks by zooming out — finding the larger perspective that puts difficulty in context. Freedom is a genuine emotional need: when you feel constrained or without a horizon to move toward, mood and vitality both drop noticeably.' },
  { label: 'Moon in Makara (Capricorn)', body: 'Your emotional landscape is composed, sometimes to a degree that surprises even you. Feelings are processed quietly and practically — you find it easier to take action than to sit with unresolved emotion, and there can be a tendency to carry more than you outwardly show. As you allow yourself warmth and acknowledgment, the natural authority of this Moon placement finds its full expression.' },
  { label: 'Moon in Kumbha (Aquarius)',  body: 'Your emotional life has a somewhat objective quality — you can feel things deeply and still stand apart from them, observing rather than being consumed. There is genuine humanitarian warmth here, combined with a slight resistance to the ordinary forms of intimacy. Friendship and collective belonging are your steadiest emotional anchors.' },
  { label: 'Moon in Meena (Pisces)',     body: 'Your inner world is vast, fluid, and richly imaginative. You absorb the feelings of those around you as though they were your own, and discerning what is yours to carry versus what belongs to someone else is often the central emotional learning of your life. Creative expression and solitude are equally important to your wellbeing.' },
]

// ── Computation ───────────────────────────────────────────────────────────────

export function computePersonality(chart) {
  const { lagnaRashi, grahas } = chart
  const lordId    = SIGN_LORDS_LR[lagnaRashi]
  const lordGraha = grahas.find(g => g.id === lordId)
  const lordHouse = lordGraha?.houseNum ?? 1
  const moon      = grahas.find(g => g.id === 'Mo')
  const moonRashi = moon?.rashiIdx ?? 0

  return {
    lagnaRashi,
    lagnaPersonality: LAGNA_PERSONALITY[lagnaRashi],
    lordId,
    lordName:   PLANET_FULL[lordId] ?? lordId,
    lordHouse,
    lordInHouse: LAGNA_LORD_IN_HOUSE[lordHouse],
    moonRashi,
    moonOverlay: MOON_SIGN_OVERLAY[moonRashi],
  }
}
