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
  Aries: "Your career path tends to favor action over analysis — you probably do your best work when you're allowed to move fast, take initiative, and go first, rather than waiting for consensus or detailed instructions. Roles where you can lead, compete, or pioneer something genuinely new tend to bring out your strongest professional self.\n\nDay to day, this likely shows up as a low tolerance for bureaucracy or excessive planning before action. You'd rather learn by doing, and you probably build your professional reputation through visible results and speed rather than through slow, careful positioning.\n\nThe career growth edge here is usually sustainability — the same drive that gets you moving fast can burn out just as quickly without a longer-term structure underneath it. Learning to pace big pushes of energy, rather than sprinting constantly, tends to serve your career better over the long run.",

  Taurus: "Your career path tends to favor stability, tangible results, and steady growth over quick wins — fields connected to finance, resources, land, or hands-on craft often genuinely suit your temperament. You probably build your professional reputation slowly, but what you build tends to actually last.\n\nDay to day, this likely shows up as a preference for security and known processes over constant reinvention. You're probably the person colleagues rely on to actually finish what's started, and you likely value fair, consistent compensation as much as prestige or recognition.\n\nThe career growth edge here is usually adaptability — the same steadiness that makes you dependable can make career pivots or necessary change feel more threatening than they need to. Learning to see change as an opportunity rather than a disruption tends to open doors this placement might otherwise keep closed.",

  Gemini: "Your career path tends to favor communication, variety, and constant information exchange — fields like writing, media, sales, teaching, or anything involving frequent new input often suit you well. You probably thrive in dynamic environments more than in a single fixed routine.\n\nDay to day, this likely shows up as genuine restlessness with repetitive tasks and a real gift for explaining, connecting, or translating ideas between people. You probably juggle multiple projects or roles more comfortably than most, and networking likely comes to you with less effort than it takes others.\n\nThe career growth edge here is usually depth and follow-through — the same versatility that makes you valuable can also scatter your focus across too many directions at once. Learning to commit to fewer things long enough to build real expertise tends to meaningfully deepen your professional impact.",

  Cancer: "Your career path tends to favor nurturing or emotionally attuned work — fields like healthcare, education, hospitality, counseling, or anything involving genuinely looking after other people often resonate with you. Your professional reputation is probably built on trust and real care rather than pure competitive ambition.\n\nDay to day, this likely shows up as a strong instinct to protect your team or the people you serve, sometimes more fiercely than you protect your own interests. Emotional safety at work matters to you — a toxic environment will drain you far more than it would someone else, regardless of the paycheck.\n\nThe career growth edge here is usually self-advocacy — the same caretaking instinct that makes you valued by others can mean you undersell your own needs or contributions. Learning to ask directly for what you deserve, rather than hoping it's noticed, tends to open career growth this placement might otherwise stall.",

  Leo: "Your career path tends to favor visibility, leadership, and creative self-expression — roles where your work is genuinely seen, whether in management, performance, or public-facing positions, often suit you well. You probably do your best work when your contributions are actually recognized, not buried in a team credit line.\n\nDay to day, this likely shows up as natural confidence in front of others and a genuine enjoyment of responsibility, even when it comes with pressure. You probably lead through charisma and example more than through rigid authority, and you likely take real pride in doing visible, quality work.\n\nThe career growth edge here is usually humility in collaboration — the same need for recognition that fuels your ambition can create friction with colleagues who feel overshadowed. Learning to share credit generously, even when you did the heavy lifting, tends to make your leadership more durable and more trusted.",

  Virgo: "Your career path tends to favor precision, analysis, and service-oriented work — fields like healthcare, editing, quality assurance, or detailed technical roles often suit you particularly well. Your professional reputation is probably built on reliability and genuinely getting the details right, not on flash.\n\nDay to day, this likely shows up as a habit of noticing what's broken or inefficient and quietly fixing it, often before anyone else even registers the problem. You probably hold your own work to a higher standard than most managers would ever ask of you.\n\nThe career growth edge here is usually visibility — the same modesty and precision that makes your work excellent can also make it invisible if you never point out what you've actually accomplished. Learning to advocate for your own contributions, without waiting for someone else to notice, tends to accelerate the recognition this placement otherwise delays.",

  Libra: "Your career path tends to favor partnership, diplomacy, and aesthetic or relational sensibility — fields like law, design, public relations, negotiation, or client-facing roles often resonate strongly with you. You probably do your best work in collaborative settings rather than working entirely alone.\n\nDay to day, this likely shows up as a genuine talent for smoothing tension between people and finding solutions that feel fair to everyone involved. You probably read a room's social dynamics quickly, and people likely trust your judgment on anything requiring tact.\n\nThe career growth edge here is usually decisiveness under pressure — the same fairness-mindedness that makes you a great mediator can slow you down when a fast, unilateral call is actually needed. Learning to make the tough call without waiting for full consensus tends to strengthen how far your career can go.",

  Scorpio: "Your career path tends to favor depth, research, or transformation-oriented work — fields like investigation, psychology, finance, strategy, or anything requiring you to dig well beneath the surface often suit you strongly. Your professional reputation is probably built quietly, but it tends to carry real weight once established.\n\nDay to day, this likely shows up as an instinct to understand the real story behind a situation, not just the version presented on the surface. You probably work with real intensity once genuinely engaged, and half-hearted commitment to a role rarely sits well with you.\n\nThe career growth edge here is usually openness — the same guardedness that protects your work can also isolate you from mentorship or collaboration that would genuinely help. Learning to let a few trusted people into your process, rather than working entirely alone, tends to open career doors this placement can otherwise keep shut.",

  Sagittarius: "Your career path tends to favor exploration, teaching, or big-picture thinking — fields like travel, education, publishing, or international work often resonate deeply with you. You probably do your best work when there's genuine room to think broadly, rather than being confined to narrow, repetitive tasks.\n\nDay to day, this likely shows up as a natural enthusiasm that's genuinely contagious to colleagues, along with a strong preference for roles that let you keep learning. You probably get restless in jobs that feel like they've stopped teaching you anything new.\n\nThe career growth edge here is usually structure — the same big-picture enthusiasm that makes you inspiring can leave important details or follow-through underdeveloped. Learning to pair your vision with consistent execution tends to be what actually turns your ideas into lasting career results.",

  Capricorn: "Your career path tends to favor structure, long-term ambition, and disciplined effort — this placement is traditionally considered especially strong for career success, often rewarding patience with real authority and recognition over time. Your professional reputation is probably built through consistent, visible achievement rather than lucky breaks.\n\nDay to day, this likely shows up as a genuine willingness to do the unglamorous, difficult work that others avoid, trusting that it compounds over time. You probably think in years and decades about your career, not just the next promotion cycle.\n\nThe career growth edge here is usually work-life balance — the same discipline that drives real achievement can crowd out rest, relationships, or joy if left unchecked. Learning that slowing down occasionally won't undo years of hard-earned progress tends to be the harder lesson for this placement to accept.",

  Aquarius: "Your career path tends to favor innovation, technology, or community-oriented work — fields involving new ideas, networks, or genuinely unconventional approaches often suit you especially well. You probably do your best work when given real freedom to think differently, rather than following rigid convention for its own sake.\n\nDay to day, this likely shows up as a habit of questioning \"how things have always been done\" and proposing better alternatives, sometimes before your workplace is ready to hear it. You likely build a strong professional network around shared ideas or causes rather than pure hierarchy.\n\nThe career growth edge here is usually patience with implementation — the same originality that generates your best ideas can clash with the slower pace most organizations move at. Learning to bring others along gradually, rather than expecting instant buy-in, tends to help your innovations actually land.",

  Pisces: "Your career path tends to favor creativity, compassion, or work connected to healing and imagination — fields like the arts, counseling, spirituality, or humanitarian work often resonate strongly with you. Your professional reputation is probably built on genuine empathy and vision rather than pure competitive drive.\n\nDay to day, this likely shows up as real sensitivity to the emotional undercurrents of your workplace, sometimes absorbing stress that isn't even yours to carry. You probably do your most meaningful work when it feels connected to something larger than a paycheck.\n\nThe career growth edge here is usually practical boundaries — the same imaginative, giving quality that makes your work meaningful can leave you under-compensated or overextended if you're not careful. Learning to treat your creative or caregiving work as genuinely valuable, worth being paid fairly for, tends to be the harder-won lesson here.",
}

export const tenthLordHouseModifier = {
  1:  "Your 10th house lord sits in your 1st house, which means career success and personal identity are likely closely fused for you — professional achievement (or the lack of it) probably affects your overall confidence more directly than it would for most people.",

  2:  "Your 10th house lord sits in your 2nd house, which ties your career closely to earning and building resources. Financial reward is likely both a strong motivator for your work and a natural outcome of the path you tend to follow professionally.",

  3:  "Your 10th house lord sits in your 3rd house, which channels your career through communication, initiative, and decisive short-term action. Skills in writing, speaking, or simply being willing to act quickly likely serve your professional path especially well.",

  4:  "Your 10th house lord sits in your 4th house, which quietly connects your career to home, roots, or property. Work involving real estate, your local community, or something tied to domestic life may play a bigger role in your professional path than you'd initially expect.",

  5:  "Your 10th house lord sits in your 5th house, which channels your career through creativity, intellect, or teaching. Your professional path likely benefits significantly from genuine self-expression and the confidence to put your own ideas forward rather than staying safely in the background.",

  6:  "Your 10th house lord sits in your 6th house, which often points to career growth earned through real effort against real obstacles, not easy wins. Service to others, competitive drive, or simply persistence through difficulty tends to define your professional trajectory more than raw luck.",

  7:  "Your 10th house lord sits in your 7th house, which means business partners, key clients, or even a spouse's influence may play a meaningful, sometimes pivotal role in your career. Your professional path is less of a solo journey than it might be for others.",

  8:  "Your 10th house lord sits in your 8th house, which often points to sudden career shifts, inheritance-linked work, or deeply investigative fields. Transformation — sometimes unexpected — tends to be a recurring theme in how your professional life actually unfolds.",

  9:  "Your 10th house lord sits in your 9th house, which connects your career to higher learning, travel, or belief systems. Teaching, publishing, law, or international work are commonly favored under this placement, and a sense of purpose beyond the paycheck likely matters to you.",

  10: "Your 10th house lord sits in its own 10th house, which makes your career path unusually strong and central to your overall life story. Professional identity and personal ambition are tightly, directly connected for you — this is rarely a placement associated with a purely quiet, low-key working life.",

  11: "Your 10th house lord sits in your 11th house, which connects career growth closely to networks, communities, and long-term goals. Gains through connections — the right introduction, the right community — likely matter as much to your trajectory as raw individual talent.",

  12: "Your 10th house lord sits in your 12th house, which often points to fulfillment found in behind-the-scenes work, foreign connections, or solitary effort. You may genuinely do your best professional work away from the spotlight, even if outward recognition takes longer to arrive.",
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
