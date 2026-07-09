import { useState } from 'react'
import { LO_SHU, PLANE_READINGS } from '../data.js'

// Meaning of each Lo Shu digit — used to build Superpowers and Missing Numbers
const NUMBER_MEANINGS = {
  1: {
    name: 'Leadership',
    energy: 'Sun / Water Energy',
    missingMeaning: 'Confidence and self-expression may feel suppressed. You might struggle to assert your needs, step into leadership, or project your true identity into the world. Others may find it hard to see your real strengths, not because they are absent, but because this energy has not yet been consciously activated. Building a strong, sovereign sense of self is your most powerful life lesson.',
    frequencies: [
      'Balanced self-expression and comfortable communication.',
      'Excellent communicator, highly confident, and sharp intellect.',
      'Extremely talkative or sometimes struggles to voice their truest inner feelings.',
      'Highly opinionated and independent to a fault; prefers total isolation.',
    ],
    remedies: [
      'Wear a metallic wristwatch on your active hand daily to track time intentionally.',
      'Drink water stored overnight in a pure copper vessel to activate solar energy.',
      'Spend 5 minutes every morning writing down 3 clear, independent career goals.',
      'Place a small mirror facing east in your workspace to amplify confident, solar energy.',
    ],
    gemstones: ['Ruby', 'Red Garnet', 'Red Spinel', 'Sunstone'],
    chakra: {
      name: 'Solar Plexus Chakra — Manipura',
      color: '#f59e0b',
      affirmation: 'I am confident, powerful, and fully worthy of standing in my own light. I lead with clarity and express my truth without apology.',
      activation: 'Sit upright and bring your full awareness to the area just above your navel. Visualise a blazing golden sun rotating clockwise at your solar plexus, growing more radiant with each inhale. As you exhale, consciously release every layer of self-doubt — feeling it dissolve into warmth. Remain here for five minutes, letting the sun\'s energy rebuild your sense of personal authority from the inside out.',
    },
  },
  2: {
    name: 'Intuition',
    energy: 'Moon / Earth Energy',
    missingMeaning: 'Emotional balance and intuitive clarity are areas to consciously develop. Decision-making can feel difficult when logic and feeling pull in opposite directions, and you may habitually dismiss your gut instincts in favour of external opinion. Your growth lies in learning to honour your inner emotional world as a source of profound wisdom rather than a liability.',
    frequencies: [
      'Naturally sensitive, peaceful, and highly empathetic.',
      'Highly intelligent with excellent judgment and deep analytical intuition.',
      'Deeply imaginative but highly moody; easily lets emotions dictate daily actions.',
      'Overly emotional, reacts too fast without thinking, and prone to over-worrying.',
    ],
    remedies: [
      'Drink water from a silver cup or keep a silver object on your bedside table.',
      'Dedicate time each week to listen deeply to your mother or nurturing figures in your life.',
      'Practice 5 minutes of conscious, rhythmic breathing before making any important decision.',
      'Spend time near water — a river, the sea, or even a bowl of still water — to harmonise lunar energy.',
    ],
    gemstones: ['Pearl', 'Moonstone', 'White Coral', 'White Topaz'],
    chakra: {
      name: 'Sacral Chakra — Svadhisthana',
      color: '#f97316',
      affirmation: 'I honour my emotions as sacred guidance. My feelings are valid, and my intuition leads me toward my highest truth.',
      activation: 'Sit comfortably and rest both hands gently below your navel. Close your eyes and imagine a soft, luminous orange moon floating just beneath your belly button, its light expanding and contracting like ocean tides. With each exhale, release emotional tension that you have been holding. Let feelings move through you like water — without resistance, without judgement. Remain with this image for five to seven minutes.',
    },
  },
  3: {
    name: 'Intellect',
    energy: 'Jupiter / Wood Energy',
    missingMeaning: 'Creative thinking, memory retention, and articulate planning may require deliberate effort. Inspired ideas can feel slow to surface, and communicating complex thoughts clearly may feel laboured. You may underestimate your own intelligence or hold back creative expression out of fear of imperfection. Your growth comes from embracing curiosity boldly and trusting the power of your unique mind.',
    frequencies: [
      'Good memory, excellent planning skills, and a naturally positive mindset.',
      'Strong creative spark; an excellent writer, artist, or visual thinker.',
      'Over-imaginative; tends to daydream intensely and emotionally detach from crowds.',
      'Impractical and over-fearful; struggles to separate real life from an imaginary world.',
    ],
    remedies: [
      'Keep a healthy, live green plant on your desk or workspace to stimulate Jupiter\'s expansive energy.',
      'Use wooden writing pens or wear a natural wooden bead bracelet as a grounding talisman.',
      'Read a physical book for at least 15 minutes a day to continuously strengthen your mental field.',
      'Teach or explain something you know to someone else — the act of teaching is the fastest path to mastery.',
    ],
    gemstones: ['Yellow Sapphire', 'Yellow Topaz', 'Citrine', 'Amber'],
    chakra: {
      name: 'Third Eye Chakra — Ajna',
      color: '#818cf8',
      affirmation: 'My mind is clear, expansive, and brilliantly creative. I trust the power of my imagination and express my ideas with courage and precision.',
      activation: 'Soften your gaze and gently draw your attention to the centre of your forehead, just between your eyebrows. Visualise a deep indigo flame slowly brightening at your third eye — steady, luminous, and focused. With each breath, feel your perception expand beyond its ordinary limits. Release the need to overthink and simply allow inspired clarity to rise naturally. Hold this focus for five to eight minutes.',
    },
  },
  4: {
    name: 'Discipline',
    energy: 'Rahu / Wood Energy',
    missingMeaning: 'Structure and consistent follow-through may not come naturally. You might resist routine, leave tasks half-finished, or feel scattered when faced with practical and material responsibilities. This missing energy can create a pattern of grand beginnings without solid completion. Your transformation begins the moment you commit to one daily practice and honour it without exception.',
    frequencies: [
      'Disciplined, deeply hardworking, and highly values structure.',
      'A master doer who finishes every single task with absolute material precision.',
      'Intensely hardworking but heavily stubborn; occasionally refuses to see other views.',
      'Experiences high physical burnout; completely forces themselves to do all the labor.',
    ],
    remedies: [
      'Maintain strict cleanliness in your home — especially the area beneath your bed, which holds stagnant energy.',
      'Use a physical daily planner to map out your three most important tasks every morning before checking your phone.',
      'Wear a Green Aventurine or Moss Agate bracelet on your working hand as a reminder of grounded effort.',
      'Establish one non-negotiable daily habit — even five minutes of structured action retrains this missing energy.',
    ],
    gemstones: ['Hessonite Garnet', 'Spessartite Garnet', 'Orange Zircon', 'Brown Agate'],
    chakra: {
      name: 'Root Chakra — Muladhara',
      color: '#ef4444',
      affirmation: 'I am grounded, stable, and fully supported. My foundations are strong, my efforts are consistent, and I complete what I begin.',
      activation: 'Sit or stand with your feet firmly and consciously planted on the floor. Visualise deep crimson roots extending from the base of your spine down through the floor, reaching into the warm core of the earth. With every exhale, release scattered or restless energy downward into the soil — letting the earth absorb it and return steadiness to you. Feel your body grow heavy, anchored, and completely present. Remain here for five minutes.',
    },
  },
  5: {
    name: 'Adaptability',
    energy: 'Mercury / Central Earth Energy',
    missingMeaning: 'Resilience under pressure and ease with change are areas of active growth. Unexpected life shifts may trigger anxiety, control tendencies, or emotional rigidity that keeps you stuck in what is familiar rather than what is expansive. As the central number of the Lo Shu grid, 5 governs the flow between all other energies — its absence can leave you feeling disconnected from your own centre. Your highest path involves releasing the grip of certainty and trusting the intelligence of flow.',
    frequencies: [
      'Kind, calm natured, emotionally stable, and a natural inspiration to others.',
      'Highly self-confident and driven, though easily emotional under immense stress.',
      'Massive risk-taker; speaks or acts instantly depending on situations without a filter.',
      'Extremely scattered energy; needs to actively slow down and avoid rushing things.',
    ],
    remedies: [
      'Walk barefoot on clean green grass for 5 minutes each morning to reconnect with centred Earth energy.',
      'Place a clear quartz crystal or small crystal pyramid at the centre of your main workspace.',
      'Carry a clean green or earthy-toned item in your daily bag as a symbolic anchor to your centre.',
      'Practice the 4-7-8 breathing technique daily: inhale for 4 counts, hold for 7, exhale for 8.',
    ],
    gemstones: ['Emerald', 'Green Tourmaline', 'Peridot', 'Green Jade'],
    chakra: {
      name: 'Heart Chakra — Anahata',
      color: '#22c55e',
      affirmation: 'I flow with change gracefully and from my centre. I am balanced, open, and at peace with all that is unfolding in my life.',
      activation: 'Place one hand over the centre of your chest and close your eyes. Breathe slowly and deeply, feeling your chest rise and fall with each breath. Visualise a bright emerald green light expanding from your heart with every exhale — first filling your chest, then your entire body, then the space around you. With each breath, consciously soften any rigidity or resistance you are holding. Allow yourself to simply be in the middle of everything, steady and open. Stay here for five to seven minutes.',
    },
  },
  6: {
    name: 'Vision',
    energy: 'Venus / Metal Energy',
    missingMeaning: 'Nurturing relationships and a genuine appreciation for beauty may need intentional cultivation. You might find that home harmony, creative self-expression, and the flow of giving and receiving love feel effortful or even uncomfortable. Artistic sensibility may lie dormant, and intimate relationships may require more conscious attention than they seem to for others. Learning to honour softness, pleasure, and the sacred beauty of everyday life is central to your healing.',
    frequencies: [
      'Deeply cares for home, family, and enjoys a beautiful, comfortable lifestyle.',
      'Highly creative, loves material luxuries, and is fiercely protective of loved ones.',
      'High emotional swings; lets wild romantic notions cloud realistic logic.',
      'Gifted artistically but emotionally fragile when handling personal relationships.',
    ],
    remedies: [
      'Apply a subtle, high-quality fragrance or floral essential oil before leaving your home each day.',
      'Wear clean, well-pressed clothing and incorporate at least one piece of silver jewellery into your style.',
      'Introduce fresh flowers, soft lighting, or a beautiful piece of art into your most-used living space.',
      'Cook or prepare a beautiful meal for someone you love — this directly activates Venus\'s nurturing frequency.',
    ],
    gemstones: ['Diamond', 'White Sapphire', 'Opal', 'White Zircon'],
    chakra: {
      name: 'Heart Chakra — Anahata',
      color: '#22c55e',
      affirmation: 'I give and receive love freely and joyfully. My heart is open to beauty, connection, and the abundant warmth of life.',
      activation: 'Sit in a comfortable position and think of someone or something that fills you with genuine warmth. Place both hands over your heart and breathe into that feeling. Visualise a rose-gold or soft green light blooming from the centre of your chest like a lotus opening petal by petal. With each exhale, allow any walls around your heart to soften. You do not need to protect yourself from love — love is your most natural state. Remain here for five to eight minutes, letting the warmth spread.',
    },
  },
  7: {
    name: 'Wisdom',
    energy: 'Ketu / Metal Energy',
    missingMeaning: 'Spiritual depth, inner reflection, and the willingness to trust the unseen are qualities to actively and patiently cultivate. You may default to pure logic and analysis, dismissing intuitive knowing as impractical or unscientific. Significant lessons may repeat in your life until you are willing to sit with silence and look inward. Your growth path involves creating sacred space for stillness, honouring the wisdom of your lived experience, and developing faith in something greater than the rational mind.',
    frequencies: [
      'Learns beautifully through real experiences and leans toward spiritual growth.',
      'Gains profound wisdom and spiritual awakening after facing major life setbacks.',
      'Prone to deep overthinking, minor disappointments, or heavy trust issues.',
      'Faces severe emotional or financial lessons before discovering their true inner peace.',
    ],
    remedies: [
      'Hang a small metallic wind chime near a window or external door to invite Ketu\'s flowing, releasing energy.',
      'Spend a minimum of 10 minutes daily in complete silence — no phone, no music, no external input.',
      'Keep a dedicated journal beside your bed and write down your raw thoughts and any dreams immediately upon waking.',
      'Spend time in nature at least once a week — forests, mountains, or open sky are particularly activating for this energy.',
    ],
    gemstones: ["Cat's Eye", 'Turquoise', 'Labradorite', "Tiger's Eye"],
    chakra: {
      name: 'Crown Chakra — Sahasrara',
      color: '#a855f7',
      affirmation: 'I am divinely guided and deeply connected to higher wisdom. I trust the intelligence of the universe flowing through me in every moment.',
      activation: 'Sit in stillness and let your breath slow to its most natural rhythm. Bring your awareness to the very top of your head — the crown. Visualise a luminous violet or pure white lotus beginning to unfold there, petal by petal, reaching upward into infinite light. Do not try to think your way through this — simply surrender to the quiet. Release the need to understand, to control, or to know. Let higher intelligence descend through your crown like soft rain. Rest in this open, receptive state for seven to ten minutes.',
    },
  },
  8: {
    name: 'Ambition',
    energy: 'Saturn / Earth Energy',
    missingMeaning: 'Material confidence, financial authority, and a sense of earned power may feel elusive or subject to recurring setbacks. You may encounter themes of delay, financial instability, or difficulty asserting yourself in professional hierarchies. Saturn teaches through time and patience — and its absence in your grid suggests that the lesson of long-term discipline and measured, consistent effort is one your soul has specifically chosen to master in this lifetime.',
    frequencies: [
      'Follows rules, values order, but occasionally struggles with minor delays.',
      'Highly stubborn but deeply wise; masterfully learns from past mistakes.',
      'Highly driven by material success; massive professional growth scales post-40.',
      'Unstoppable, rapid material progress, but struggles heavily to relax or rest.',
    ],
    remedies: [
      'Practice strict punctuality as a spiritual discipline — arrive five minutes early to every commitment.',
      'Organise your financial documents, wallet, and monetary records thoroughly and review them weekly.',
      'Engage in a regular act of selfless service — volunteering, assisting elders, or supporting those doing labour-intensive work.',
      'Wear dark-coloured clothing (navy, charcoal, black) on Saturdays as a conscious alignment with Saturn\'s frequency.',
    ],
    gemstones: ['Blue Sapphire', 'Amethyst', 'Lapis Lazuli', 'Black Tourmaline'],
    chakra: {
      name: 'Root Chakra — Muladhara',
      color: '#ef4444',
      affirmation: 'I am patient, disciplined, and worthy of lasting abundance. My foundations grow stronger with each consistent, intentional action I take.',
      activation: 'Sit on the floor if possible, with your spine tall and your hands resting on your knees. Close your eyes and breathe slowly. Feel the weight of your body against the surface beneath you — gravity itself is Saturn\'s gift. Visualise a deep red or garnet light at the very base of your spine, glowing slowly and steadily like embers. This light does not blaze or race — it endures. With each breath, reaffirm your commitment to patience, consistency, and the long view. Remain here for eight to ten minutes.',
    },
  },
  9: {
    name: 'Compassion',
    energy: 'Mars / Fire Energy',
    missingMeaning: 'Humanitarian drive, the ability to channel passionate energy constructively, and a sense of purposeful completion may be areas that require intentional activation. Suppressed anger, frustration without a clear outlet, or difficulty finishing major life cycles can appear as recurring patterns. The energy of 9 governs endings and the highest expression of human compassion — its absence invites you to discover what it truly means to serve, to release, and to transform raw fire into conscious, directed light.',
    frequencies: [
      'Intelligent, ambitious, and constantly striving for personal self-improvement.',
      'Extremely sharp, clever, and always stays two steps ahead of others.',
      'Deeply helpful and humanitarian, but gets irritated quickly over minor issues.',
      'Intensely idealistic and brutally honest; finds it incredibly difficult to fake anything.',
    ],
    remedies: [
      'Incorporate a deliberate pop of bright red or deep maroon into your daily clothing or workspace to activate Mars energy.',
      'Light a ghee lamp or a red candle in the south corner of your main room each evening.',
      'Commit to a 10-minute daily physical practice — brisk walking, yoga, or exercise — to give suppressed fire a healthy channel.',
      'Perform one conscious act of service or generosity each week with no expectation of recognition or return.',
    ],
    gemstones: ['Red Coral', 'Carnelian', 'Red Jasper', 'Bloodstone'],
    chakra: {
      name: 'Third Eye Chakra — Ajna',
      color: '#818cf8',
      affirmation: 'I see the highest good in all beings and in all situations. My inner fire serves humanity with wisdom, compassion, and unwavering purpose.',
      activation: 'Sit quietly and bring your full attention to the space between your eyebrows. Begin to breathe in a steady, controlled rhythm — inhaling for four counts, exhaling for six. As you breathe, visualise a deep indigo or violet flame at your third eye centre, burning clear and purposeful rather than wild. This flame does not consume — it illuminates. See it casting its light outward into the world, revealing the highest path forward. Affirm your intention to act from wisdom rather than reaction. Hold this focus for five to eight minutes.',
    },
  },
}

function GridCell({ num, count, index, isGhost }) {
  const isLit = !isGhost && count > 0

  return (
    <div
      className={`card-appear relative flex items-center justify-center rounded-2xl aspect-square select-none transition-all duration-500 ${isGhost ? 'opacity-20' : 'opacity-100'}`}
      style={{
        animationDelay: `${index * 0.07}s`,
        background: isLit
          ? 'radial-gradient(circle at center, rgba(139,92,246,0.22) 0%, rgba(109,40,217,0.08) 100%)'
          : 'rgba(255,255,255,0.02)',
        border: isLit
          ? '1px solid rgba(167,139,250,0.55)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: isLit
          ? '0 0 22px rgba(139,92,246,0.45), 0 0 44px rgba(139,92,246,0.15), inset 0 0 22px rgba(139,92,246,0.1)'
          : 'none',
      }}
    >
      <span
        className="text-4xl sm:text-5xl font-bold"
        style={{
          color: isLit ? '#c4b5fd' : 'rgba(255,255,255,0.1)',
          textShadow: isLit
            ? '0 0 20px rgba(196,181,253,0.9), 0 0 40px rgba(167,139,250,0.6)'
            : 'none',
        }}
      >
        {num}
      </span>
      {!isGhost && count > 1 && (
        <span
          className="absolute top-2 right-2.5 text-xs font-bold text-violet-400"
          style={{ textShadow: '0 0 8px rgba(167,139,250,0.8)' }}
        >
          ×{count}
        </span>
      )}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-violet-400/70 text-xs uppercase tracking-[0.28em] text-center font-medium">
      {children}
    </p>
  )
}

function PlaneRow({ plane }) {
  return (
    <div
      className={`flex items-start gap-4 rounded-2xl border ${plane.borderColor} bg-white/4 px-5 py-4`}
      style={{ boxShadow: '0 0 18px rgba(139,92,246,0.12)' }}
    >
      <span className="text-xl mt-0.5 shrink-0">{plane.icon}</span>
      <div className="min-w-0">
        <p className={`text-sm font-semibold bg-gradient-to-r ${plane.color} bg-clip-text text-transparent mb-0.5`}>
          {plane.label}
        </p>
        <p className="text-slate-400 text-base leading-relaxed">{plane.text}</p>
      </div>
    </div>
  )
}

function PowerCard({ title, icon, items, accentColor, borderColor, emptyText }) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border ${borderColor} bg-white/4 p-5`}
      style={{ boxShadow: '0 0 20px rgba(139,92,246,0.1)' }}
    >
      <p className="text-sm font-semibold text-white flex items-center gap-2">
        <span>{icon}</span> {title}
      </p>
      {items.length === 0 ? (
        <p className="text-slate-600 text-xs leading-relaxed">{emptyText}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map(({ num, name, freqLabel, text }) => (
            <li key={num} className="flex items-start gap-2.5">
              <span
                className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5"
                style={{
                  background: accentColor.bg,
                  color: accentColor.text,
                  boxShadow: accentColor.shadow,
                }}
              >
                {num}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold" style={{ color: accentColor.text }}>
                    {name}
                  </span>
                  {freqLabel && (
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                      style={{
                        background: accentColor.bg,
                        color: accentColor.text,
                        opacity: 0.85,
                      }}
                    >
                      {freqLabel}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-[0.8125rem] leading-relaxed mt-0.5">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ── Shared sub-components for MissingNumberCard ──────────────────────────────

function SubLabel({ color, children }) {
  return (
    <div className="flex items-center gap-3 mt-1">
      <span
        className="text-[10px] font-bold uppercase tracking-[0.22em] shrink-0"
        style={{ color }}
      >
        {children}
      </span>
      <div className="flex-1 h-px" style={{ background: `${color}30` }} />
    </div>
  )
}

function MissingNumberCard({ num, name, energy, missingMeaning, remedies, gemstones, chakra }) {
  return (
    <div
      className="rounded-2xl border border-amber-500/20 overflow-hidden"
      style={{ boxShadow: '0 0 32px rgba(251,191,36,0.06), 0 2px 12px rgba(0,0,0,0.4)' }}
    >
      {/* ── Card header banner ─────────────────────────────────── */}
      <div
        className="px-5 pt-5 pb-4"
        style={{
          background: 'linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(251,191,36,0.03) 60%, transparent 100%)',
          borderBottom: '1px solid rgba(251,191,36,0.12)',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{
              background: 'rgba(251,191,36,0.18)',
              color: '#fbbf24',
              boxShadow: '0 0 18px rgba(251,191,36,0.4)',
              border: '1px solid rgba(251,191,36,0.3)',
            }}
          >
            {num}
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-500/70 mb-0.5">
              Missing Number
            </p>
            <p className="text-base font-bold text-white leading-tight">{name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{energy}</p>
          </div>
        </div>
      </div>

      {/* ── Card body ──────────────────────────────────────────── */}
      <div
        className="flex flex-col gap-5 px-5 py-5"
        style={{ background: 'rgba(10,8,24,0.55)' }}
      >

        {/* 1. Significance */}
        <div className="flex flex-col gap-2">
          <SubLabel color="#f59e0b">Significance</SubLabel>
          <p className="text-slate-400 text-sm leading-relaxed pl-0.5">
            {missingMeaning}
          </p>
        </div>

        {/* 2. Remedies */}
        <div className="flex flex-col gap-2">
          <SubLabel color="#2dd4bf">Remedies</SubLabel>
          <ul className="flex flex-col gap-2 pl-0.5">
            {remedies.map((remedy, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full"
                  style={{ background: '#2dd4bf', boxShadow: '0 0 6px #2dd4bf' }}
                />
                <span className="text-slate-400 text-sm leading-relaxed">{remedy}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Gemstones */}
        <div className="flex flex-col gap-2">
          <SubLabel color="#a78bfa">Gemstones</SubLabel>
          <div className="flex flex-wrap gap-2 pl-0.5">
            {gemstones.map((gem, i) => (
              <span
                key={i}
                className="text-xs font-medium px-3 py-1 rounded-lg"
                style={{
                  background: 'rgba(139,92,246,0.13)',
                  color: '#c4b5fd',
                  border: '1px solid rgba(139,92,246,0.28)',
                  boxShadow: '0 0 10px rgba(139,92,246,0.12)',
                }}
              >
                💎 {gem}
              </span>
            ))}
          </div>
        </div>

        {/* 4. Chakra Alignment */}
        <div className="flex flex-col gap-3">
          <SubLabel color={chakra.color}>Chakra Alignment</SubLabel>

          {/* Chakra name pill */}
          <div className="pl-0.5">
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl"
              style={{
                background: `${chakra.color}18`,
                color: chakra.color,
                border: `1px solid ${chakra.color}35`,
                boxShadow: `0 0 12px ${chakra.color}20`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: chakra.color, boxShadow: `0 0 8px ${chakra.color}` }}
              />
              {chakra.name}
            </span>
          </div>

          {/* Affirmation */}
          <div
            className="rounded-xl px-4 py-3 flex flex-col gap-1"
            style={{
              background: `${chakra.color}0d`,
              border: `1px solid ${chakra.color}20`,
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1"
              style={{ color: `${chakra.color}bb` }}
            >
              Affirmation
            </p>
            <p
              className="text-sm leading-relaxed italic font-medium"
              style={{ color: `${chakra.color}dd` }}
            >
              "{chakra.affirmation}"
            </p>
          </div>

          {/* Meditation / Activation */}
          <div
            className="rounded-xl px-4 py-3 flex flex-col gap-1"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1"
              style={{ color: `${chakra.color}99` }}
            >
              Meditation &amp; Activation
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              {chakra.activation}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

function MissingNumbersSection({ items }) {
  if (items.length === 0) {
    return (
      <div
        className="rounded-2xl border border-amber-500/15 p-5 text-center"
        style={{ background: 'rgba(251,191,36,0.03)' }}
      >
        <p className="text-slate-500 text-sm leading-relaxed">
          All nine numbers are present in your date — your grid is remarkably complete.
        </p>
      </div>
    )
  }

  const missingList = items.map(({ num }) => num).join('  ·  ')

  return (
    <div className="flex flex-col gap-5">

      {/* Section intro banner */}
      <div
        className="rounded-2xl border border-amber-500/20 px-5 py-4"
        style={{
          background: 'linear-gradient(135deg, rgba(251,191,36,0.07) 0%, rgba(251,191,36,0.02) 100%)',
          boxShadow: '0 0 20px rgba(251,191,36,0.05)',
        }}
      >
        <div className="flex items-start gap-3">
          <span className="text-lg shrink-0 mt-0.5">🌒</span>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-amber-300 text-sm font-semibold tracking-wide">
              Missing: {missingList}
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Absent numbers are not weaknesses — each one is a precise cosmic invitation to grow, heal, and consciously activate the energy you came here to embody.
            </p>
          </div>
        </div>
      </div>

      {/* One card per missing number */}
      {items.map((item) => (
        <MissingNumberCard key={item.num} {...item} />
      ))}

    </div>
  )
}

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from(
  { length: CURRENT_YEAR - 1940 + 1 },
  (_, i) => CURRENT_YEAR - i  // descending: newest first
)

const SELECT_CLASS =
  'w-full px-3 py-4 rounded-2xl bg-white/5 border border-violet-500/30 text-white ' +
  'appearance-none cursor-pointer focus:outline-none focus:border-violet-400/60 ' +
  'transition-all duration-200 text-sm text-center'

function DateSelect({ value, onChange, placeholder, children }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={SELECT_CLASS}
        style={{ color: value ? 'white' : '#64748b' }}
      >
        <option value="" disabled style={{ color: '#64748b', background: '#0f0a1e' }}>
          {placeholder}
        </option>
        {children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-violet-400 text-sm">
        ▾
      </div>
    </div>
  )
}

export default function LoShuGrid() {
  const [day,   setDay]   = useState('')
  const [month, setMonth] = useState('')
  const [year,  setYear]  = useState('')
  const [gridData, setGridData] = useState(null)

  const canCalculate = day !== '' && month !== '' && year !== ''

  function calculate() {
    if (!canCalculate) return
    // Stitch DD + MM + YYYY into one digit string, e.g. "15" + "8" + "1994" → "1581994"
    const combined = `${day}${month}${year}`
    const counts = {}
    combined.split('').forEach((ch) => {
      const d = Number(ch)
      if (d >= 1 && d <= 9) counts[d] = (counts[d] || 0) + 1
    })
    setGridData(counts)
  }

  function reset() {
    setDay('')
    setMonth('')
    setYear('')
    setGridData(null)
  }

  // Derived state — only computed when gridData exists
  const activePlanes = gridData
    ? PLANE_READINGS.filter((p) => p.numbers.every((n) => (gridData[n] || 0) > 0))
    : []

  const superpowers = gridData
    ? Object.keys(gridData).map(Number).filter(n => n >= 1 && n <= 9)
        .filter(n => (gridData[n] || 0) > 0)
        .map(n => {
          const count = gridData[n]
          const freqIdx = Math.min(count, 4) - 1   // 0=×1, 1=×2, 2=×3, 3=×4+
          return {
            num: n,
            name:      NUMBER_MEANINGS[n].name,
            count,
            freqLabel: count >= 4 ? '×4+' : `×${count}`,
            text:      NUMBER_MEANINGS[n].frequencies[freqIdx],
          }
        })
    : []

  const missingNumbers = gridData
    ? [1,2,3,4,5,6,7,8,9].filter(n => !(gridData[n] > 0))
        .map(n => ({
          num:            n,
          name:           NUMBER_MEANINGS[n].name,
          energy:         NUMBER_MEANINGS[n].energy,
          missingMeaning: NUMBER_MEANINGS[n].missingMeaning,
          remedies:       NUMBER_MEANINGS[n].remedies,
          gemstones:      NUMBER_MEANINGS[n].gemstones,
          chakra:         NUMBER_MEANINGS[n].chakra,
        }))
    : []

  return (
    <div className="flex flex-col items-center px-6 py-12 w-full">
      {/*
        Single centered column — all four sections stack here in order.
        No floating, no conditional repositioning of the grid itself.
      */}
      <div className="w-full max-w-lg flex flex-col gap-8">

        {/* ─── Section header ─────────────────────────────────────────── */}
        <div className="text-center">
          <p className="text-violet-400/70 text-xs uppercase tracking-[0.3em] mb-2">Vedic Numerology</p>
          <h2 className="text-3xl font-bold text-white">
            <span className="shimmer-text">Lo Shu Grid</span>
          </h2>
          <p className="mt-3 text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
            Your date of birth holds a unique cosmic blueprint. Enter it below to illuminate your personal magic square.
          </p>
        </div>

        {/* ─── 1. Day / Month / Year dropdowns + Calculate button ─────── */}
        <div className="flex flex-col gap-3">

          {/* Three dropdowns side-by-side in DD / MM / YYYY order */}
          <div className="grid grid-cols-3 gap-3">

            <DateSelect value={day} onChange={(v) => { setDay(v); setGridData(null) }} placeholder="Day">
              {DAYS.map((d) => (
                <option key={d} value={d} style={{ background: '#0f0a1e', color: 'white' }}>
                  {String(d).padStart(2, '0')}
                </option>
              ))}
            </DateSelect>

            <DateSelect value={month} onChange={(v) => { setMonth(v); setGridData(null) }} placeholder="Month">
              {MONTHS.map((name, i) => (
                <option key={name} value={i + 1} style={{ background: '#0f0a1e', color: 'white' }}>
                  {name}
                </option>
              ))}
            </DateSelect>

            <DateSelect value={year} onChange={(v) => { setYear(v); setGridData(null) }} placeholder="Year">
              {YEARS.map((y) => (
                <option key={y} value={y} style={{ background: '#0f0a1e', color: 'white' }}>
                  {y}
                </option>
              ))}
            </DateSelect>

          </div>

          {/* Calculate button — full width beneath the dropdowns */}
          <button
            onClick={calculate}
            disabled={!canCalculate}
            className={`w-full py-4 rounded-2xl font-semibold text-sm tracking-wide border transition-all duration-200
              ${canCalculate
                ? 'glow-button bg-gradient-to-r from-violet-600 to-indigo-700 border-violet-400/30 text-white cursor-pointer hover:scale-[1.02] active:scale-95'
                : 'bg-white/3 border-white/10 text-slate-600 cursor-not-allowed'
              }`}
          >
            ✦ Calculate Grid
          </button>

        </div>

        {/* ─── 2. The 3×3 Lo Shu Grid ─────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            {LO_SHU.flat().map((num, i) => (
              <GridCell
                key={num}
                num={num}
                count={gridData ? (gridData[num] || 0) : 0}
                index={i}
                isGhost={!gridData}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-violet-500/40 border border-violet-400/60 inline-block" />
              Present in your date
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-white/5 border border-white/10 inline-block" />
              Absent
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-violet-400 font-bold">×2</span>
              Multiple occurrences
            </span>
          </div>
        </div>

        {/* ─── 3 & 4. Results — rendered only after calculation ──────── */}
        {gridData && (
          <div className="flex flex-col gap-6">

            {/* ── 3. Planes of Life ─────────────────────────────────── */}
            <div className="flex flex-col gap-3">
              <SectionLabel>Planes of Life</SectionLabel>
              {activePlanes.length > 0 ? (
                activePlanes.map((plane) => (
                  <PlaneRow key={plane.label} plane={plane} />
                ))
              ) : (
                <p className="text-center text-slate-500 text-sm leading-relaxed px-4 py-2">
                  No planes are fully activated — your grid reveals a{' '}
                  <span className="text-violet-400">unique cosmic signature</span> that transcends a single category.
                  Each gap is an invitation to grow.
                </p>
              )}
            </div>

            {/* ── 4. Superpowers ──────────────────────────────────── */}
            <div className="flex flex-col gap-3">
              <SectionLabel>Your Personal Reading</SectionLabel>
              <PowerCard
                title="Your Cosmic Superpowers"
                icon="✨"
                items={superpowers}
                accentColor={{
                  bg: 'rgba(139,92,246,0.25)',
                  text: '#c4b5fd',
                  shadow: '0 0 10px rgba(139,92,246,0.4)',
                }}
                borderColor="border-violet-500/30"
                emptyText="No digits present — enter your date above."
              />
            </div>

            {/* ── 5. Missing Numbers ──────────────────────────────── */}
            <div className="flex flex-col gap-3">
              <SectionLabel>Missing Numbers</SectionLabel>
              <MissingNumbersSection items={missingNumbers} />
            </div>

            {/* ── Reset ─────────────────────────────────────────────── */}
            <button
              onClick={reset}
              className="w-full px-6 py-3 rounded-2xl border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:text-white transition-all duration-200 text-sm tracking-widest uppercase cursor-pointer"
            >
              ↺ Try Another Date
            </button>

          </div>
        )}

      </div>
    </div>
  )
}
