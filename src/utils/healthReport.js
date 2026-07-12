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
  Aries: "Your body likely runs on quick bursts of energy rather than slow, steady output — you probably feel restless if you sit still too long, and physical activity likely genuinely improves your mood, not just your fitness. Minor injuries from overexertion, tension headaches, or inflammation-related flare-ups tend to be the more common pattern when stress builds up.\n\nDay to day, this shows up as impatience with recovery time — you probably push through discomfort rather than resting properly, which can turn small issues into recurring ones. Vigorous, high-intensity movement tends to suit you better than gentle, slow-paced routines.\n\nThe pattern worth watching here is burnout disguised as productivity — the same drive that gets you moving can override your body's actual signals to slow down. Building in real recovery time, not just more activity, tends to be the more overlooked need.",

  Taurus: "Health matters for you may show up around the throat, neck, or through habits connected to food and comfort — steady, unhurried routines around diet and rest tend to genuinely serve you well. Your body likely responds better to gradual lifestyle changes than to sudden, drastic ones.\n\nDay to day, this shows up as real comfort-seeking through food, which can be a genuine source of pleasure but also the pattern most worth watching if it tips into overindulgence. You probably do better with a consistent routine than with constantly changing diet or exercise plans.\n\nThe pattern worth watching here is resistance to necessary change — even when a habit clearly isn't serving you, the same steadiness that usually helps you can make it harder to actually shift course. Small, gradual adjustments tend to work far better for you than an abrupt overhaul.",

  Gemini: "Health concerns for you may relate to the nervous system, respiratory issues, or a kind of restlessness and anxiety that comes from mental overactivity rather than physical exertion. Your mind likely runs faster than your body most of the time, and that gap can genuinely show up as physical tension.\n\nDay to day, this shows up as difficulty truly switching off — even rest can feel mentally busy for you, scrolling or multitasking rather than actually resting. Breathing-related practices or anything that calms an overactive mind tends to have real physical benefit for you specifically.\n\nThe pattern worth watching here is treating mental rest as optional. Building in real downtime for your mind, not just your body, is often the more overlooked need — sleep quality in particular is worth paying attention to.",

  Cancer: "Health matters for you may connect closely to digestion, emotional stress, or fluid retention — your physical wellbeing is often closely tied to your emotional wellbeing in ways that are easy to underestimate. Stress you're not consciously processing tends to eventually show up in your body.\n\nDay to day, this shows up as digestive sensitivity that tracks fairly closely with your emotional state — a stressful week likely affects your stomach as much as your mood. Comfort eating during emotional lows is a genuinely common pattern worth being gentle with yourself about, while still watching.\n\nThe pattern worth watching here is unprocessed emotion showing up as physical symptoms. Addressing stress directly — through talking, journaling, or whatever genuinely helps you process feelings — tends to have real, measurable physical benefits for you, not just emotional ones.",

  Leo: "Health concerns for you may relate to the heart, back, or spine — issues here sometimes flare when pride or overexertion pushes you past sensible limits, especially if you're trying to prove something to yourself or others. Consistent, moderate exercise tends to serve you better than occasional intense bursts meant to compensate for inactivity.\n\nDay to day, this shows up as a reluctance to admit when you're genuinely tired or need to rest — appearing capable and strong matters to you, sometimes at the cost of actually resting when you should. Posture and spine health are worth genuine attention given how much this area is emphasized for your placement.\n\nThe pattern worth watching here is pride overriding actual physical need. Learning to rest without feeling like you're failing or falling behind tends to be the harder-won lesson, but a genuinely important one.",

  Virgo: "This placement is traditionally associated with heightened health-consciousness, which can be a real asset — but sometimes tips into over-worry about minor symptoms that don't actually warrant concern. Digestive sensitivity is common, and a structured, balanced routine around diet genuinely tends to help you specifically.\n\nDay to day, this shows up as close attention to how your body feels, sometimes to the point of anxiety over small changes. You're probably more disciplined about health habits than most people, though that discipline can occasionally shade into excessive self-monitoring.\n\nThe pattern worth watching here is anxiety about health becoming its own stressor. Trusting your body a bit more, and seeking reassurance from a professional rather than repeated self-diagnosis, tends to genuinely ease this pattern.",

  Libra: "Health matters for you may relate to kidney function or issues arising from imbalance — in diet, in work-rest ratio, or in emotional give-and-take within relationships. Finding genuine equilibrium in your daily routine tends to be the key theme running through this placement.\n\nDay to day, this shows up as health habits that fluctuate along with your social life and relationships — you may eat and rest well when things are harmonious, and let habits slip when there's relational stress. Balance really is the operative word for your physical wellbeing.\n\nThe pattern worth watching here is letting relationship stress quietly erode your own self-care. Protecting a baseline routine, even when your social or emotional world gets bumpy, tends to keep you considerably steadier.",

  Scorpio: "Health matters for you may relate to reproductive health or issues that build up quietly before becoming noticeable — this placement often points to a body that hides discomfort until it genuinely can't be ignored anymore. Regular checkups matter more than usual for you specifically, even when you feel fine.\n\nDay to day, this shows up as a tendency to push through pain or symptoms rather than addressing them early, partly because you're genuinely private about vulnerability, including physical vulnerability. Intensity in how you approach fitness or recovery, when you do engage with it, tends to be real.\n\nThe pattern worth watching here is silence about symptoms until a small issue becomes a bigger one. Being proactive about checkups, even without obvious symptoms prompting you, tends to be the harder but more important habit to build.",

  Sagittarius: "Health concerns for you may relate to the hips, thighs, or liver — often connected to overindulgence while traveling or during periods of restlessness, when routine naturally falls away. A grounded routine, even amid a naturally adventurous lifestyle, helps genuinely balance this out.\n\nDay to day, this shows up as health habits that hold up fine when life is structured, but slip noticeably during travel or big life changes. Moderation, especially around food and drink while away from your normal routine, is worth conscious attention.\n\nThe pattern worth watching here is treating travel or excitement as a free pass from usual self-care. Carrying a few non-negotiable habits with you wherever you go tends to keep this placement's natural restlessness from taking a real physical toll.",

  Capricorn: "Health matters for you may relate to bones, joints, or teeth — chronic, slow-developing issues are more likely here than sudden, acute ones. Consistent, disciplined self-care over the long term tends to pay off significantly with this placement, more so than for most.\n\nDay to day, this shows up as a tendency to push through physical discomfort in service of responsibility or work, sometimes for longer than is genuinely wise. You probably have real staying power physically, but that endurance can mask problems building slowly underneath.\n\nThe pattern worth watching here is deferring your own care indefinitely in favor of duty. Treating rest and preventive care as part of your responsibilities, not a departure from them, tends to serve you considerably better over time.",

  Aquarius: "Health concerns for you may relate to circulation or issues that are harder to diagnose through conventional means — an unconventional approach to wellness, outside standard advice, sometimes genuinely suits you better here than a one-size-fits-all plan.\n\nDay to day, this shows up as health habits that don't necessarily follow trends or convention — you may respond better to an unusual routine than to whatever's currently popular. Trusting your own experimentation, within reason, tends to serve you.\n\nThe pattern worth watching here is dismissing symptoms simply because they don't fit a standard diagnostic picture. Advocating clearly for yourself with healthcare providers, even when your experience doesn't match textbook patterns, tends to matter more for you than most.",

  Pisces: "Health matters for you may relate to the immune system or issues with an emotional or psychosomatic root — stress and physical health are often deeply linked for you, more so than for many other placements. Addressing emotional wellbeing directly tends to have real, tangible physical payoff.\n\nDay to day, this shows up as a body that seems to reflect your emotional state closely — feeling run down when you're emotionally overwhelmed, even without an obvious physical cause. Rest and genuine downtime aren't optional luxuries for you; they're closer to a real physical necessity.\n\nThe pattern worth watching here is absorbing others' stress until it becomes your own physical burden. Protecting your emotional bandwidth is, quite literally, a health practice for you, not just a nice-to-have.",
}

export const sixthLordHouseModifier = {
  1:  "Your 6th house lord sits in your 1st house, which means health and daily routine are likely closely tied to your overall sense of self. How you feel physically often directly shapes your confidence and daily outlook far more than it would for most people.",

  2:  "Your 6th house lord sits in your 2nd house, which connects health matters to diet, finances, or family stress. Money worries or family-related tension can genuinely show up physically for you in ways worth noticing before they escalate.",

  3:  "Your 6th house lord sits in your 3rd house, which connects health matters to nervous energy, communication-related stress, or short trips. Mental restlessness is often the actual root worth addressing before it manifests as physical tension.",

  4:  "Your 6th house lord sits in your 4th house, which connects health matters to home environment or emotional security. An unsettled living situation or family stress can meaningfully affect your physical wellbeing more than you might expect.",

  5:  "Your 6th house lord sits in your 5th house, which connects health matters to stress from creative blocks, romantic disappointment, or matters involving children. Emotional outlets through genuine creative expression often help here in a real, physical way.",

  6:  "Your 6th house lord sits in its own 6th house, which especially emphasizes health-related themes throughout your life. This placement often points to a lifelong relationship with health-consciousness — worth channeling toward genuine discipline rather than anxious over-monitoring.",

  7:  "Your 6th house lord sits in your 7th house, which connects health matters to relationship stress. Conflict or imbalance with a partner can show up as physical tension or fatigue more directly than you might initially realize.",

  8:  "Your 6th house lord sits in your 8th house, which often involves health issues that develop gradually or connect to deeper transformation. Regular checkups are especially worth prioritizing with this placement, since issues can be slow to surface until they're significant.",

  9:  "Your 6th house lord sits in your 9th house, which connects health matters to travel, overexertion during long journeys, or stress from belief conflicts. Moderation while traveling is a genuinely useful habit for you specifically.",

  10: "Your 6th house lord sits in your 10th house, which connects health matters to work-related stress or overexertion in career pursuits. Burnout is the pattern most worth watching and actively managing for you, more than most other health themes.",

  11: "Your 6th house lord sits in your 11th house, which connects health matters to stress from unmet goals or social overcommitment. Learning to decline some obligations may genuinely serve your physical wellbeing more than any specific diet or exercise change.",

  12: "Your 6th house lord sits in your 12th house, which connects health matters to sleep quality, subconscious stress, or issues that are harder to trace to an obvious cause. Attention to rest and mental rest specifically tends to help more than physical intervention alone.",
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
