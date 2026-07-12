// ── Life Report interpretation tables ─────────────────────────────────────────
// Rules engine: static lookup by Lagna sign + Lagna lord's house.
// Usage: lagnaSignTraits[signName] + "\n\n" + lagnaLordHouseModifier[houseNum]

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
  Aries: "There's a directness to how you meet the world — a kind of instinctive courage that shows up before you've even had time to think it through. When something needs doing, you're often the one who moves first, and that instinct has probably served you well more times than not. People who know you likely describe you as energetic, a little impatient, and refreshingly honest about what you want.\n\nDay to day, this shows up as a low tolerance for sitting still or waiting on other people's timelines. You'd rather start imperfectly than wait for the perfect moment, and that bias toward action is genuinely one of your biggest strengths — it's how things actually get built, while others are still deliberating.\n\nThe growth edge here is usually patience — not just with other people, but with your own process. The same fire that gets you moving fast can also burn out just as quickly if there's nothing sustaining it underneath. Learning to pace yourself, and to let some things unfold on their own timeline, tends to be the quieter lesson of this placement.",

  Taurus: "There's an unhurried steadiness to how you move through life — you're rarely the loudest person in the room, but you're often the one others quietly rely on. Comfort, consistency, and doing things properly matter more to you than doing them fast, and that patience tends to pay off in ways that are easy to underestimate from the outside.\n\nDay to day, this shows up as a genuine preference for routine and known quantities over constant novelty. You build things slowly and thoroughly — relationships, skills, security — and once something is yours, you hold onto it with real loyalty. Change, especially sudden change, tends to unsettle you more than you let on.\n\nThe growth edge here is usually flexibility. That same steadiness that makes you dependable can tip into stubbornness when circumstances genuinely call for adaptation. Learning to loosen your grip when something isn't working, rather than doubling down out of habit, tends to be the quieter lesson of this placement.",

  Gemini: "There's a quickness to your mind that shows up in everything — how fast you pick up new ideas, how easily you shift between topics, how naturally conversation seems to flow around you. You're probably the person in most rooms who's already three thoughts ahead, genuinely curious about nearly everything, even if you rarely stay fixated on one thing for long.\n\nDay to day, this shows up as a real need for mental variety. Repetitive routines drain you in a way that's hard to explain to people who don't share this trait, and you likely juggle multiple interests, conversations, or projects simultaneously without much effort. Communication — talking, writing, connecting ideas — probably comes to you more naturally than to most.\n\nThe growth edge here is usually depth over breadth. It's easy for you to know a little about a lot, but the real reward often comes from staying with one thing long enough to actually master it. Learning to finish what you start, rather than following the next shiny idea, tends to be the quieter lesson of this placement.",

  Cancer: "There's an emotional undercurrent to everything you do, even when you're not showing it outwardly. You feel things deeply and remember them longer than most people would guess, and a sense of emotional safety — for yourself and the people you love — probably matters more to you than almost anything else.\n\nDay to day, this shows up as a strong protective instinct, especially toward family or anyone you've let close. You likely read the emotional temperature of a room before you've even fully entered it, and you probably give far more care to others than you ask for in return. Home, in whatever form that takes for you, is genuinely a source of strength, not just comfort.\n\nThe growth edge here is usually boundaries. That same sensitivity that makes you deeply caring can also mean you absorb other people's moods and stress as if they were your own. Learning to protect your own emotional space, even while staying open to others, tends to be the quieter lesson of this placement.",

  Leo: "There's a natural warmth and presence to you that tends to draw people in, whether or not you're actively trying. You likely carry yourself with a quiet (or not-so-quiet) confidence, and there's a genuine generosity in how you treat people once they're in your circle — you want the people around you to shine too, not just yourself.\n\nDay to day, this shows up as a strong need to feel genuinely seen and appreciated for what you contribute. You probably lead more through charisma and example than through force or micromanaging, and you likely take real pride — sometimes fierce pride — in your work and in the people you care about. Being ignored or dismissed tends to bother you more than most things.\n\nThe growth edge here is usually ego. The same confidence that makes you a natural leader can tip into needing constant validation, or struggling to share the spotlight. Learning that your worth doesn't depend on being the center of attention tends to be the quieter lesson of this placement.",

  Virgo: "There's a sharp, discerning quality to how you see the world — you notice details other people walk right past, and you hold yourself to standards that would exhaust almost anyone else. There's a real desire underneath this to be genuinely useful, to do things properly, not just adequately.\n\nDay to day, this shows up as a habit of quietly fixing, organizing, or improving things around you, often without being asked. You're probably your own harshest critic long before anyone else gets the chance to criticize you, and you likely feel most at ease when there's a clear, well-executed plan rather than vague chaos. People probably underestimate how much you're doing behind the scenes.\n\nThe growth edge here is usually self-compassion. The same precision that makes you excellent at what you do can turn inward as relentless self-criticism. Learning that \"good enough\" is sometimes genuinely enough — for you, not just for others — tends to be the quieter lesson of this placement.",

  Libra: "There's a natural pull toward balance and fairness in how you engage with the world — conflict genuinely unsettles you, and you probably work harder than most people realize to keep the peace, sometimes at your own expense. Charm and diplomacy come easily to you, and pleasant surroundings and pleasant people both matter to your sense of wellbeing.\n\nDay to day, this shows up as a strong instinct to see multiple sides of any disagreement, sometimes to the point of struggling to land on your own opinion. You probably weigh decisions carefully, wanting to be fair to everyone involved, including yourself. Relationships — romantic, professional, or otherwise — tend to be a central organizing force in how you experience your own life.\n\nThe growth edge here is usually decisiveness. That same fairness that makes you a genuinely good mediator can leave you stuck when a choice actually needs to be made. Learning to trust your own judgment, even when it might disappoint someone, tends to be the quieter lesson of this placement.",

  Scorpio: "There's an intensity beneath your surface that most people only glimpse in pieces — you feel things all the way through, even when your outward expression stays composed or guarded. Trust isn't something you hand out easily, but once it's earned, it tends to run remarkably deep.\n\nDay to day, this shows up as sharp, often uncannily accurate instincts about people and situations — you probably sense what's really going on beneath a surface conversation before anyone says it outright. Privacy matters a great deal to you, and you likely keep more of your inner world to yourself than the people around you realize. Half-measures rarely interest you; when you commit to something, you go all in.\n\nThe growth edge here is usually release. The same depth that makes you powerful can also mean holding onto old wounds, grudges, or control longer than actually serves you. Learning to let go — of hurt, of the need to control outcomes — tends to be the quieter lesson of this placement.",

  Sagittarius: "There's an optimism and restlessness to you that shows up as a genuine love of exploring — new places, new ideas, new philosophies, whatever expands your sense of what's possible. You probably speak your mind candidly, sometimes more bluntly than you meant to, because pretending or holding back doesn't come naturally to you.\n\nDay to day, this shows up as a low tolerance for feeling boxed in — by routine, by other people's expectations, by rules that don't make sense to you. You likely find meaning through movement, whether that's literal travel or intellectual and spiritual exploration, and you probably inspire people around you to think a little bigger than they were before they met you.\n\nThe growth edge here is usually follow-through. The same enthusiasm that makes you exciting to be around can mean you move on before something is fully finished. Learning to commit to depth in at least a few areas, rather than only ever reaching for the next horizon, tends to be the quieter lesson of this placement.",

  Capricorn: "There's a seriousness and steadiness to you that often makes you seem older than your years, even when you were young. Responsibility comes to you early and naturally, and you likely value long-term achievement built patiently over quick wins that don't last.\n\nDay to day, this shows up as real discipline — you're probably the person who shows up consistently, does the unglamorous work, and rarely needs anyone to check on your progress. Ambition runs quietly but persistently through how you approach most things, and you likely measure your own worth partly through what you've actually built or accomplished.\n\nThe growth edge here is usually softness. The same discipline that drives your achievement can crowd out rest, play, or emotional vulnerability if you let it. Learning that you're allowed to slow down, and that your worth isn't only measured by output, tends to be the quieter lesson of this placement.",

  Aquarius: "There's an independent, sometimes unconventional quality to how you think — you're probably more drawn to ideas and principles than to simply fitting in with whatever's expected. A genuine care for people broadly, even humanity as a whole, often runs deeper in you than closeness with any one person might suggest.\n\nDay to day, this shows up as a comfort with being different, even when it would be easier to conform. You probably think several steps ahead of the group, sometimes frustratingly so when others aren't ready to follow. Community, causes, and big-picture ideas likely energize you more than small talk or convention ever could.\n\nThe growth edge here is usually intimacy. The same independence that makes you original can create real distance in close relationships if you're not careful. Learning to let people in emotionally, not just intellectually, tends to be the quieter lesson of this placement.",

  Pisces: "There's a dreamy, deeply empathetic quality to how you move through the world — you likely absorb other people's emotions almost as if they were your own, sometimes without meaning to. Imagination and intuition run strong in you, and your inner world is probably as vivid and real to you as the external one.\n\nDay to day, this shows up as a natural compassion that draws people toward you when they're struggling, along with a tendency to lose yourself a little in whatever — or whoever — you're currently focused on. Practical, concrete matters can feel secondary to the emotional or imaginative reality you're actually living in.\n\nThe growth edge here is usually boundaries, in a slightly different sense than for Cancer — for you, it's less about protecting yourself from others' moods and more about staying anchored to your own reality when it's tempting to drift, escape, or merge entirely into someone else's world. Learning to stay gently grounded, without losing the sensitivity that makes you who you are, tends to be the quieter lesson of this placement.",
}

// ── Layer 2: Lagna lord house modifiers ───────────────────────────────────────

export const lagnaLordHouseModifier = {
  1:  "Your Ascendant's ruling planet sits in your own 1st house, which means your core personality tends to express itself directly and without much filtering — what people see is largely what's actually there. There's an authenticity to this placement; you're not especially good at pretending to be something you're not, for better and occasionally for worse.",

  2:  "Your Ascendant's ruling planet sits in the 2nd house, which pulls your sense of self toward resources, family, and how you communicate day to day. Financial security and a stable family foundation likely shape your confidence more than you might consciously realize — when those feel steady, you feel steady.",

  3:  "Your Ascendant's ruling planet sits in the 3rd house, which channels your personality through communication, courage, and short bursts of decisive action. You probably find and express your sense of self through speaking up, writing, or simply being willing to act while others hesitate.",

  4:  "Your Ascendant's ruling planet sits in the 4th house, which roots your personality in emotional foundations — home, family, and inner peace. Even if you present as capable and put-together outwardly, your real sense of self is likely tied closely to whether you feel emotionally settled underneath.",

  5:  "Your Ascendant's ruling planet sits in the 5th house, which channels your identity through creativity, intellect, and genuine self-expression. You probably feel most like yourself when you're creating something, teaching, or being recognized for your ideas rather than blending into the background.",

  6:  "Your Ascendant's ruling planet sits in the 6th house, which gives your personality a fighter's edge — resilience, service, and the ability to keep going through real difficulty. You likely define yourself partly through what you've overcome, not just what's come easily.",

  7:  "Your Ascendant's ruling planet sits in the 7th house, which means you likely understand yourself most clearly in relation to other people. Partnership isn't peripheral to your identity — it's often central to it; who you're close to genuinely shapes who you become.",

  8:  "Your Ascendant's ruling planet sits in the 8th house, which gives your personality real depth and a pull toward what lies beneath the surface — of situations, of people, of yourself. You likely have a far more private, intense inner life than most people around you ever get to see.",

  9:  "Your Ascendant's ruling planet sits in the 9th house, which channels your identity through belief, philosophy, or a genuine search for meaning beyond the everyday. Higher learning, travel, or a personal belief system likely play a real role in how you understand who you are.",

  10: "Your Ascendant's ruling planet sits in the 10th house, which ties your personality closely to career and public standing. How you're seen professionally probably feeds directly into your personal sense of identity — success out in the world and your own self-image are closely linked for you.",

  11: "Your Ascendant's ruling planet sits in the 11th house, which channels your identity through goals, community, and larger ambitions. Friendships and long-term aspirations likely shape how you see yourself as much as, or more than, any single close relationship does.",

  12: "Your Ascendant's ruling planet sits in the 12th house, which gives your personality an introspective, almost observer-like quality. You may feel more like someone watching life closely than someone constantly performing in it — solitude probably restores you in a way that constant social contact doesn't.",
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
