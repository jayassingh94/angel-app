import { useState } from 'react'

// ── Data ─────────────────────────────────────────────────────────────────────

const CHAKRA_DATA = [
  {
    id: 'root', num: 1,
    name: 'Root Chakra', sanskrit: 'Muladhara',
    location: 'Base of spine · Perineum',
    color: '#e11d48', glyph: '▼',
    tagline: 'Foundation, safety & primal belonging',
    significance: 'The Muladhara is the foundation upon which all other chakras are built. It governs our most basic survival instincts — safety, food, shelter, and belonging. When fully activated, it anchors us to the Earth with a profound sense of security, physical vitality, and unshakeable trust in life\'s abundance. A balanced root chakra allows us to move through the world grounded, present, and rooted in our physical identity.',
    symptoms: {
      physical: [
        'Lower back, hip or knee pain',
        'Chronic fatigue and persistently low energy',
        'Weakened immune system or frequent illness',
        'Constipation or digestive sluggishness',
        'Unexplained weight fluctuations',
      ],
      emotional: [
        'Persistent anxiety, fear or paranoia',
        'Deep financial insecurity or constant money worry',
        'Feeling disconnected from your body or reality',
        'Inability to trust others or life itself',
        'Hoarding tendencies or extreme scarcity mindset',
      ],
    },
    remedies: {
      affirmation: 'I am safe, grounded, and deeply supported by the Earth beneath me. I trust in the natural abundance of life.',
      crystals: ['Red Jasper', 'Black Tourmaline', 'Smoky Quartz', 'Hematite', 'Red Garnet'],
      foods: ['Beets', 'Red apples', 'Root vegetables', 'Red beans', 'Pomegranate', 'Tomatoes'],
      exercises: [
        'Walk barefoot on grass or soil for 10 minutes daily',
        'Mountain Pose (Tadasana) — stand still, breathe deeply for 2 minutes',
        'Body scan meditation from feet upward each night',
        'Journal 3 things you feel safe and grateful for each morning',
      ],
    },
  },
  {
    id: 'sacral', num: 2,
    name: 'Sacral Chakra', sanskrit: 'Svadhisthana',
    location: 'Lower abdomen · 2" below navel',
    color: '#ea580c', glyph: '◈',
    tagline: 'Creativity, pleasure & emotional flow',
    significance: 'Svadhisthana is the sacred home of creativity, sensuality, and emotional intelligence. It governs our capacity to experience pleasure, connect authentically with others, and express our unique creative force. When balanced, this chakra flows like water — fluid, adaptive, and nourishing. It enables us to embrace change, experience joy without guilt, and relate to others with genuine warmth and openness.',
    symptoms: {
      physical: [
        'Lower abdominal pain or persistent cramping',
        'Reproductive or hormonal imbalances',
        'Bladder or urinary tract issues',
        'Persistent hip tightness or stiffness',
        'Low libido or sexual dysfunction',
      ],
      emotional: [
        'Creative blocks and complete lack of inspiration',
        'Deep guilt or shame around pleasure and enjoyment',
        'Emotional numbness or sudden volatility',
        'Difficulty with intimacy or close relationships',
        'Addictive tendencies or compulsive behaviors',
      ],
    },
    remedies: {
      affirmation: 'I embrace my creativity fully. Pleasure, joy and abundance flow freely and naturally through my life.',
      crystals: ['Carnelian', 'Orange Calcite', "Tiger's Eye", 'Sunstone', 'Amber'],
      foods: ['Mangoes', 'Oranges', 'Carrots', 'Sweet potato', 'Apricots', 'Coconut water'],
      exercises: [
        'Slow hip circles or flowing hip-opening yoga sequences',
        'Expressive, unstructured dancing to music you love',
        'Creative journaling or visual art with absolutely no agenda',
        'Pigeon Pose held for 5 deep breaths per side',
      ],
    },
  },
  {
    id: 'solar', num: 3,
    name: 'Solar Plexus', sanskrit: 'Manipura',
    location: 'Upper abdomen · Navel to sternum',
    color: '#ca8a04', glyph: '◉',
    tagline: 'Personal power, will & authentic self-esteem',
    significance: 'Manipura is the blazing seat of personal power, identity, and self-determination. Known as the "city of jewels," it is the engine of your willpower, your ability to act decisively, and your sense of authentic self-worth. A radiant solar plexus chakra empowers you to set boundaries with confidence, pursue your ambitions unapologetically, and take full ownership of your life\'s direction without seeking external validation.',
    symptoms: {
      physical: [
        'Digestive disorders or chronic stomach pain',
        'Nausea, bloating or frequent indigestion',
        'Liver sensitivity or blood sugar irregularity',
        'Chronic tiredness and heaviness after eating',
        'Eating disorders or body image distress',
      ],
      emotional: [
        'Persistent low self-esteem and deep self-doubt',
        'Difficulty setting personal boundaries with others',
        'Feeling powerless, controlled or like a perpetual victim',
        'Chronic indecision and collapse of willpower',
        'Compulsive need for external approval or people-pleasing',
      ],
    },
    remedies: {
      affirmation: 'I am powerful, confident, and deeply worthy. I stand in my authentic power and claim my rightful place.',
      crystals: ['Citrine', 'Yellow Jasper', 'Pyrite', "Yellow Tiger's Eye", 'Yellow Calcite'],
      foods: ['Bananas', 'Yellow peppers', 'Ginger', 'Turmeric', 'Corn', 'Chamomile tea'],
      exercises: [
        'Core-strengthening poses: Boat Pose, Plank Hold, Warrior III',
        'Deep belly breathing — 10 counts in, hold 4, release 8',
        'Power pose practice for 2 minutes every morning',
        'Confidence journaling — write 5 personal strengths each day',
      ],
    },
  },
  {
    id: 'heart', num: 4,
    name: 'Heart Chakra', sanskrit: 'Anahata',
    location: 'Centre of chest · Heart space',
    color: '#16a34a', glyph: '♡',
    tagline: 'Unconditional love, compassion & forgiveness',
    significance: 'Anahata is the sacred bridge between the lower physical chakras and the upper spiritual chakras — the cosmic meeting point of earth and heaven within us. It governs our capacity for unconditional love, deep compassion, genuine forgiveness, and authentic human connection. A fully open heart chakra allows love to move through us freely — both outward toward others and inward toward ourselves — dissolving all barriers built by past pain.',
    symptoms: {
      physical: [
        'Chest tightness or unexplained heart palpitations',
        'Shortness of breath or chronic shallow breathing',
        'Elevated blood pressure or poor circulation',
        'Upper back, shoulder blade or neck tension',
        'Weakened immune response to emotional stress',
      ],
      emotional: [
        'Deep loneliness or persistent emotional isolation',
        'Inability to forgive yourself or those who have hurt you',
        'Fear of vulnerability, intimacy or emotional rejection',
        'Bitterness, resentment or unresolved grief you carry',
        'Codependency or complete lack of self-compassion',
      ],
    },
    remedies: {
      affirmation: 'I give and receive love freely and without fear. My heart is wide open to life\'s deepest gifts of connection.',
      crystals: ['Rose Quartz', 'Green Aventurine', 'Malachite', 'Rhodonite', 'Jade'],
      foods: ['Leafy greens', 'Broccoli', 'Kale', 'Avocado', 'Green tea', 'Spirulina'],
      exercises: [
        'Camel Pose or supported heart-opening backbend for 3 minutes',
        'Loving-kindness (Metta) meditation — 10 minutes daily',
        'Write a forgiveness letter (sent or unsent) to release resentment',
        'Gratitude journaling — 3 things you love about your life each night',
      ],
    },
  },
  {
    id: 'throat', num: 5,
    name: 'Throat Chakra', sanskrit: 'Vishuddha',
    location: 'Throat · Neck and jaw',
    color: '#0284c7', glyph: '◇',
    tagline: 'Authentic expression, truth & clear communication',
    significance: 'Vishuddha is the sacred portal of authentic self-expression and truth. It governs not only our spoken word but every way we communicate — through writing, art, and sacred silence. A clear throat chakra enables us to express our deepest truth with courageous clarity, to listen with genuine presence, and to align our outer voice with our inner knowing. It is the chakra of the poet, the teacher, and the spiritual communicator.',
    symptoms: {
      physical: [
        'Frequent sore throats or recurring throat infections',
        'Neck stiffness, jaw tension or TMJ pain',
        'Thyroid imbalances or throat sensitivity',
        'Hearing difficulties or ringing in the ears (tinnitus)',
        'Dental or gum issues',
      ],
      emotional: [
        'Fear of speaking your truth or being harshly judged',
        'Difficulty expressing emotions clearly to others',
        'Feeling chronically misunderstood by everyone around you',
        'Compulsive over-talking or total inability to listen',
        'Habitual dishonesty or difficulty keeping commitments',
      ],
    },
    remedies: {
      affirmation: 'I speak my truth with clarity, courage, and grace. My voice is sacred and deserves to be fully heard.',
      crystals: ['Aquamarine', 'Lapis Lazuli', 'Blue Lace Agate', 'Turquoise', 'Sodalite'],
      foods: ['Blueberries', 'Figs', 'Sea vegetables', 'Herbal teas', 'Raw honey', 'Coconut water'],
      exercises: [
        "Lion's Breath (Simhasana) — repeat 5 times each morning",
        'Gentle neck rolls and slow jaw-release massage',
        'Chanting, humming or sacred toning — 5 minutes daily',
        'Stream-of-consciousness journaling with zero self-editing',
      ],
    },
  },
  {
    id: 'thirdeye', num: 6,
    name: 'Third Eye', sanskrit: 'Ajna',
    location: 'Centre of forehead · Between brows',
    color: '#4f46e5', glyph: '◎',
    tagline: 'Intuition, inner vision & higher wisdom',
    significance: 'Ajna is the seat of transcendent wisdom and inner seeing — the eye that perceives what is invisible to ordinary sight. It governs our intuition, our inner vision, and our ability to perceive the deeper patterns of reality. A fully awakened third eye dissolves the illusion of separation, granting access to profound clarity, prophetic insight, and the direct perception of spiritual truths beyond rational understanding.',
    symptoms: {
      physical: [
        'Frequent headaches or debilitating migraines',
        'Vision changes, eye strain or pressure behind the eyes',
        'Chronic sinus congestion or facial pressure',
        'Sleep disturbances, insomnia or intense nightmares',
        'Brain fog and pronounced difficulty concentrating',
      ],
      emotional: [
        'Deep distrust of your own intuition or gut feelings',
        'Overwhelming overthinking and analysis paralysis',
        'Inability to visualize or plan for your future clearly',
        'Rigid closed-mindedness to new perspectives or ideas',
        'Feeling mentally scattered and easily manipulated by others',
      ],
    },
    remedies: {
      affirmation: 'I trust my inner wisdom completely. My intuition is a precise, powerful guide leading me to my highest truth.',
      crystals: ['Amethyst', 'Lapis Lazuli', 'Labradorite', 'Purple Fluorite', 'Iolite'],
      foods: ['Blueberries', 'Purple grapes', 'Eggplant', 'Walnuts', 'Dark chocolate', 'Lavender tea'],
      exercises: [
        'Trataka (candle-gazing) meditation — 5 minutes nightly in darkness',
        'Alternate nostril breathing (Nadi Shodhana) — 10 rounds',
        'Dream journaling — record and reflect on dreams each morning',
        'Vivid visualization meditation — see your ideal future in full detail',
      ],
    },
  },
  {
    id: 'crown', num: 7,
    name: 'Crown Chakra', sanskrit: 'Sahasrara',
    location: 'Top of the head · Crown',
    color: '#9333ea', glyph: '✦',
    tagline: 'Divine consciousness, unity & enlightenment',
    significance: 'Sahasrara is the gateway to universal consciousness — the thousand-petalled lotus that blooms when we surrender fully to the divine intelligence flowing through all existence. It transcends all duality and connects us to the infinite source of creation itself. A fully open crown chakra fills our being with profound peace, universal compassion, and the unshakeable knowing that we are eternally one with all that is.',
    symptoms: {
      physical: [
        'Chronic headaches or extreme light sensitivity',
        'Neurological issues or pronounced cognitive difficulties',
        'Dizziness or persistent dissociation from the body',
        'Severe, unexplained fatigue with no physical cause',
        'Unusual sensitivity to electromagnetic frequencies',
      ],
      emotional: [
        'Deep spiritual disconnection or existential emptiness',
        'Persistent depression or overwhelming meaninglessness',
        'Complete closed-mindedness to all spiritual perspectives',
        'Feeling utterly and cosmically alone in the universe',
        'Obsessive materialism and rigid attachment to physical reality',
      ],
    },
    remedies: {
      affirmation: 'I am one with the universe. I am divinely guided, infinitely loved, and always connected to the sacred source of all life.',
      crystals: ['Clear Quartz', 'Selenite', 'White Howlite', 'Moonstone', 'Lepidolite'],
      foods: ['Clean filtered water', 'Light fresh fruits', 'Purple grapes', 'Herbal teas', 'Mindful fasting'],
      exercises: [
        'Silent meditation — 20 minutes in complete, dedicated stillness',
        'Savasana (Corpse Pose) with full, conscious surrender',
        'Spend time beneath the open sky, gazing into infinite space',
        'Sacred study and quiet contemplation of spiritual wisdom',
      ],
    },
  },
]

// ── Derived symptom lists ─────────────────────────────────────────────────────

const ALL_SYMPTOMS = CHAKRA_DATA.flatMap(ch => [
  ...ch.symptoms.physical.map((text, i) => ({
    id: `${ch.id}-p${i}`, chakraId: ch.id, type: 'physical',
    text, color: ch.color, chakraName: ch.name,
  })),
  ...ch.symptoms.emotional.map((text, i) => ({
    id: `${ch.id}-e${i}`, chakraId: ch.id, type: 'emotional',
    text, color: ch.color, chakraName: ch.name,
  })),
])
const PHYSICAL_SYMPTOMS  = ALL_SYMPTOMS.filter(s => s.type === 'physical')
const EMOTIONAL_SYMPTOMS = ALL_SYMPTOMS.filter(s => s.type === 'emotional')

// ── Helpers ───────────────────────────────────────────────────────────────────

function getChakraScores(checked) {
  const scores = Object.fromEntries(CHAKRA_DATA.map(c => [c.id, 0]))
  checked.forEach(id => {
    const s = ALL_SYMPTOMS.find(x => x.id === id)
    if (s) scores[s.chakraId]++
  })
  return scores
}

function statusInfo(score) {
  if (score === 0) return { label: 'Balanced',          level: 0, textColor: '#4ade80' }
  if (score <= 2)  return { label: 'Mildly Imbalanced', level: 1, textColor: '#facc15' }
  if (score <= 5)  return { label: 'Needs Attention',   level: 2, textColor: '#fb923c' }
  return               { label: 'Blocked',              level: 3, textColor: '#f87171' }
}

// ── Shared micro-components ───────────────────────────────────────────────────

function GlowOrb({ num, color, size = 40 }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center font-bold select-none"
      style={{
        width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle at 38% 32%, ${color}dd, ${color}44)`,
        border: `1.5px solid ${color}60`,
        boxShadow: `0 0 16px ${color}50, inset 0 0 10px ${color}20`,
        color: 'rgba(255,255,255,0.95)',
        textShadow: `0 0 10px ${color}`,
        fontSize: size > 36 ? 14 : 12,
      }}
    >
      {num}
    </div>
  )
}

function Pill({ label, color, variant = 'crystal' }) {
  const bg = variant === 'food'
    ? `rgba(16,185,129,0.12)`
    : `${color}18`
  const border = variant === 'food'
    ? `rgba(16,185,129,0.3)`
    : `${color}35`
  const text = variant === 'food' ? '#34d399' : color

  return (
    <span
      className="inline-block text-[11px] font-medium px-2.5 py-1 rounded-lg"
      style={{ background: bg, border: `1px solid ${border}`, color: text }}
    >
      {label}
    </span>
  )
}

function SectionLabel({ label, color }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span
        className="text-xs font-bold uppercase tracking-[0.18em]"
        style={{ color }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }} />
    </div>
  )
}

// ── Sub-tab bar ───────────────────────────────────────────────────────────────

function SubTabBar({ active, onChange }) {
  const tabs = [
    { id: 'overview',    label: 'Overview & Remedies' },
    { id: 'assessment',  label: 'Symptom Assessment'  },
  ]
  return (
    <div
      className="flex rounded-xl p-1 gap-1"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {tabs.map(t => {
        const isActive = active === t.id
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="relative flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
            style={{
              color: isActive ? '#fff' : 'rgba(148,163,184,0.7)',
              background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: isActive ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
            }}
          >
            {t.label}
            {isActive && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full"
                style={{
                  background: 'linear-gradient(90deg,#e11d48,#ea580c,#ca8a04,#16a34a,#0284c7,#4f46e5,#9333ea)',
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── Chakra card (expandable accordion) ───────────────────────────────────────

function ChakraCard({ chakra, isExpanded, onToggle }) {
  const c = chakra.color

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: isExpanded
          ? `linear-gradient(135deg, ${c}0d 0%, rgba(6,4,18,0.92) 100%)`
          : 'rgba(10,8,28,0.65)',
        border: `1px solid ${isExpanded ? c + '40' : c + '1a'}`,
        backdropFilter: 'blur(12px)',
        boxShadow: isExpanded
          ? `0 8px 32px rgba(0,0,0,0.5), 0 0 56px ${c}18, inset 0 0 32px ${c}06`
          : `0 4px 20px rgba(0,0,0,0.4), 0 0 32px ${c}08`,
      }}
    >
      {/* ── Collapsed header (always visible) ── */}
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-center gap-4 cursor-pointer"
        style={{ background: 'transparent' }}
      >
        <GlowOrb num={chakra.num} color={c} size={44} />

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-white font-bold text-base leading-tight">{chakra.name}</span>
            <span className="text-[11px] italic" style={{ color: `${c}90` }}>{chakra.sanskrit}</span>
          </div>
          <p className="text-xs uppercase tracking-[0.15em] text-slate-600 mt-0.5 leading-tight">
            {chakra.location}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug hidden sm:block">
            {chakra.tagline}
          </p>
        </div>

        {/* Chevron */}
        <span
          className="shrink-0 text-slate-600 transition-transform duration-300"
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: 18 }}
        >
          ⌄
        </span>
      </button>

      {/* ── Expanded body (accordion) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: isExpanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.45s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div className="px-5 pb-6 flex flex-col gap-6 pt-1">

            {/* Divider */}
            <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${c}30, transparent)` }} />

            {/* ── Significance ── */}
            <div>
              <SectionLabel label="Core Identity" color={c} />
              <p
                className="text-base text-slate-400 leading-relaxed pl-3 border-l-2"
                style={{ borderColor: `${c}40` }}
              >
                {chakra.significance}
              </p>
            </div>

            {/* ── Symptoms ── */}
            <div>
              <SectionLabel label="Signs of Imbalance" color={c} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">Physical</p>
                  <ul className="flex flex-col gap-1.5">
                    {chakra.symptoms.physical.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-[0.8125rem] text-slate-400 leading-snug">
                        <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: c }} />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">Emotional</p>
                  <ul className="flex flex-col gap-1.5">
                    {chakra.symptoms.emotional.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-[0.8125rem] text-slate-400 leading-snug">
                        <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ── Affirmation ── */}
            <div>
              <SectionLabel label="Daily Affirmation" color={c} />
              <div
                className="px-4 py-3 rounded-xl text-sm italic text-slate-300 leading-relaxed text-center"
                style={{
                  background: `${c}10`,
                  border: `1px solid ${c}28`,
                  boxShadow: `inset 0 0 20px ${c}08`,
                }}
              >
                "{chakra.remedies.affirmation}"
              </div>
            </div>

            {/* ── Remedies grid ── */}
            <div>
              <SectionLabel label="Holistic Remedies" color={c} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">Healing Crystals</p>
                  <div className="flex flex-wrap gap-1.5">
                    {chakra.remedies.crystals.map(cr => (
                      <Pill key={cr} label={cr} color={c} variant="crystal" />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">Balancing Foods</p>
                  <div className="flex flex-wrap gap-1.5">
                    {chakra.remedies.foods.map(f => (
                      <Pill key={f} label={f} color={c} variant="food" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Exercises ── */}
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">Mindfulness Practices</p>
              <ol className="flex flex-col gap-2">
                {chakra.remedies.exercises.map((ex, i) => (
                  <li key={i} className="flex items-start gap-3 text-[0.8125rem] text-slate-400 leading-snug">
                    <span
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ background: `${c}25`, color: c, border: `1px solid ${c}35` }}
                    >
                      {i + 1}
                    </span>
                    {ex}
                  </li>
                ))}
              </ol>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

// ── Overview panel ────────────────────────────────────────────────────────────

function OverviewPanel({ expandedId, setExpandedId }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-slate-600 text-[11px] text-center mb-1">
        Select any chakra to reveal its full healing profile
      </p>
      {CHAKRA_DATA.map(ch => (
        <ChakraCard
          key={ch.id}
          chakra={ch}
          isExpanded={expandedId === ch.id}
          onToggle={() => setExpandedId(expandedId === ch.id ? null : ch.id)}
        />
      ))}
    </div>
  )
}

// ── Assessment panel ──────────────────────────────────────────────────────────

function SymptomItem({ symptom, checked, onChange }) {
  return (
    <label
      className="flex items-start gap-2.5 cursor-pointer group py-1"
      style={{ userSelect: 'none' }}
    >
      {/* Custom checkbox */}
      <div
        className="shrink-0 mt-0.5 w-4 h-4 rounded flex items-center justify-center transition-all duration-150"
        style={{
          background: checked ? symptom.color : 'rgba(255,255,255,0.04)',
          border: `1.5px solid ${checked ? symptom.color : 'rgba(255,255,255,0.12)'}`,
          boxShadow: checked ? `0 0 8px ${symptom.color}60` : 'none',
        }}
      >
        {checked && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />

      <div className="flex items-start gap-1.5 flex-1">
        <span
          className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
          style={{ background: symptom.color, opacity: 0.7 }}
        />
        <span className="text-[0.8125rem] leading-snug text-slate-400 group-hover:text-slate-300 transition-colors duration-150">
          {symptom.text}
        </span>
      </div>
    </label>
  )
}

function ResultBar({ chakra, score, maxScore }) {
  const info = statusInfo(score)
  const pct  = maxScore > 0 ? Math.min(score / maxScore, 1) * 100 : 0
  const c    = chakra.color

  return (
    <div
      className="flex items-center gap-3 py-2.5 px-4 rounded-xl"
      style={{
        background: score > 0 ? `${c}0c` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${score > 0 ? c + '25' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      <GlowOrb num={chakra.num} color={c} size={32} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[0.8125rem] font-medium text-slate-300 truncate">{chakra.name}</span>
          <span className="text-xs font-bold ml-2 shrink-0" style={{ color: info.textColor }}>
            {info.label}
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: pct > 0
                ? `linear-gradient(90deg, ${c}99, ${c})`
                : 'transparent',
              boxShadow: pct > 0 ? `0 0 8px ${c}60` : 'none',
            }}
          />
        </div>
      </div>

      <span className="text-xs text-slate-700 shrink-0 tabular-nums">
        {score}/{maxScore}
      </span>
    </div>
  )
}

function AssessmentPanel({ checked, onToggle, onClear, onAnalyze, showResults }) {
  const scores     = getChakraScores(checked)
  const maxScore   = Math.max(...Object.values(scores), 1)
  const totalSel   = checked.size
  const imbalanced = Object.values(scores).filter(s => s > 0).length

  const sortedChakras = [...CHAKRA_DATA].sort((a, b) => scores[b.id] - scores[a.id])

  return (
    <div className="flex flex-col gap-6">

      {/* Intro */}
      <div
        className="rounded-xl px-5 py-4 text-center"
        style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <p className="text-slate-400 text-base leading-relaxed">
          Check every symptom you are currently experiencing. Your selections will reveal which energy centres may be blocked or in need of healing attention.
        </p>
      </div>

      {/* Symptom columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500">Physical Symptoms</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>
          <div className="flex flex-col gap-0.5">
            {PHYSICAL_SYMPTOMS.map(s => (
              <SymptomItem
                key={s.id}
                symptom={s}
                checked={checked.has(s.id)}
                onChange={() => onToggle(s.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500">Emotional Symptoms</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>
          <div className="flex flex-col gap-0.5">
            {EMOTIONAL_SYMPTOMS.map(s => (
              <SymptomItem
                key={s.id}
                symptom={s}
                checked={checked.has(s.id)}
                onChange={() => onToggle(s.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onClear}
          disabled={totalSel === 0}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-default"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(148,163,184,0.8)',
          }}
        >
          Clear All
        </button>
        <button
          onClick={onAnalyze}
          disabled={totalSel === 0}
          className="flex-[2] py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-default"
          style={{
            background: totalSel > 0
              ? 'linear-gradient(135deg, #9333ea, #4f46e5)'
              : 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(147,51,234,0.5)',
            color: '#fff',
            boxShadow: totalSel > 0 ? '0 0 20px rgba(147,51,234,0.4)' : 'none',
          }}
        >
          ◎ Analyze My Chakras
        </button>
      </div>

      {/* Results panel */}
      {showResults && totalSel > 0 && (
        <div className="flex flex-col gap-4 chakra-card-in">

          {/* Summary header */}
          <div
            className="rounded-2xl px-5 py-4 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(147,51,234,0.12), rgba(79,70,229,0.08))',
              border: '1px solid rgba(147,51,234,0.25)',
            }}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500 mb-1">Your Chakra Reading</p>
            <p className="text-white font-bold text-lg">
              {imbalanced === 0
                ? 'All chakras appear balanced'
                : `${imbalanced} of 7 energy centres show signs of imbalance`}
            </p>
            <p className="text-slate-500 text-xs mt-1.5 leading-snug">
              {imbalanced > 0
                ? 'Explore the Overview tab for targeted healing remedies for each affected centre.'
                : 'Wonderful — continue your current practices to maintain this harmony.'}
            </p>
          </div>

          {/* Per-chakra result bars */}
          <div className="flex flex-col gap-2">
            {sortedChakras.map(ch => (
              <ResultBar
                key={ch.id}
                chakra={ch}
                score={scores[ch.id]}
                maxScore={maxScore}
              />
            ))}
          </div>

          <p className="text-center text-slate-700 text-[11px]">
            Results are for guidance only — always consult a qualified wellness practitioner for medical concerns.
          </p>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ChakraAlignment() {
  const [activePane,  setActivePane]  = useState('overview')
  const [expandedId,  setExpandedId]  = useState(null)
  const [checked,     setChecked]     = useState(new Set())
  const [showResults, setShowResults] = useState(false)

  function toggleSymptom(id) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setShowResults(false)
  }

  function clearAll() {
    setChecked(new Set())
    setShowResults(false)
  }

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 py-12 w-full">
      <div className="w-full max-w-2xl flex flex-col gap-8">

        {/* ── Section header ── */}
        <div className="text-center flex flex-col gap-2">
          <p className="text-violet-400/70 text-xs uppercase tracking-[0.3em] font-medium">
            Energy Medicine
          </p>
          <h2 className="text-3xl font-bold text-white">
            <span className="shimmer-text">Chakra Alignment</span>
          </h2>
          <p className="text-slate-500 text-base max-w-md mx-auto leading-relaxed mt-1">
            Explore all seven energy centres in depth, or use the Symptom Assessment to discover which chakras may need your healing attention today.
          </p>

          {/* Chakra spectrum bar */}
          <div className="flex justify-center mt-2">
            <div className="flex gap-1.5 items-center">
              {CHAKRA_DATA.map(ch => (
                <div
                  key={ch.id}
                  className="w-3 h-3 rounded-full"
                  style={{ background: ch.color, boxShadow: `0 0 8px ${ch.color}80` }}
                  title={ch.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Sub-tab bar ── */}
        <SubTabBar active={activePane} onChange={pane => { setActivePane(pane); setExpandedId(null) }} />

        {/* ── Pane content ── */}
        {activePane === 'overview' && (
          <OverviewPanel expandedId={expandedId} setExpandedId={setExpandedId} />
        )}
        {activePane === 'assessment' && (
          <AssessmentPanel
            checked={checked}
            onToggle={toggleSymptom}
            onClear={clearAll}
            onAnalyze={() => setShowResults(true)}
            showResults={showResults}
          />
        )}

      </div>
    </div>
  )
}
