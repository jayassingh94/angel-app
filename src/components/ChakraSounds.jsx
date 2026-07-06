// Chakra Sounds — Cosmic Meditation Station
// YouTube Solfeggio embeds, one per chakra, no external audio files needed.

const CHAKRAS = [
  {
    id:         'root',
    num:        1,
    name:       'Root Chakra',
    sanskrit:   'Muladhara',
    hz:         396,
    color:      '#f87171',
    element:    'Earth',
    purpose:    'Liberating guilt and fear — grounding, safety & primal belonging',
    videoId:    'ZSc48owdG9A',
    videoTitle: '396 Hz — Let Go of Fear, Guilt & Negative Emotions',
  },
  {
    id:         'sacral',
    num:        2,
    name:       'Sacral Chakra',
    sanskrit:   'Svadhisthana',
    hz:         417,
    color:      '#fb923c',
    element:    'Water',
    purpose:    'Undoing situations & facilitating change — creativity & flow',
    videoId:    'QkacJy3KVQ4',
    videoTitle: '417 Hz — Balances & Heals the Sacral Chakra',
  },
  {
    id:         'solar',
    num:        3,
    name:       'Solar Plexus',
    sanskrit:   'Manipura',
    hz:         528,
    color:      '#facc15',
    element:    'Fire',
    purpose:    'Transformation & miracles — the Love Frequency, DNA repair',
    videoId:    'FpDOFlSZnIw',
    videoTitle: '528 Hz — The Miracle Tone, Transformation & Miracles',
  },
  {
    id:         'heart',
    num:        4,
    name:       'Heart Chakra',
    sanskrit:   'Anahata',
    hz:         639,
    color:      '#4ade80',
    element:    'Air',
    purpose:    'Connecting relationships — unconditional love & heart coherence',
    videoId:    '5T_QxR8aclQ',
    videoTitle: '639 Hz — Pure Positive Love Energy',
  },
  {
    id:         'throat',
    num:        5,
    name:       'Throat Chakra',
    sanskrit:   'Vishuddha',
    hz:         741,
    color:      '#38bdf8',
    element:    'Ether',
    purpose:    'Awakening expression — authentic voice, clarity & detoxification',
    videoId:    'blbSwNKnhp8',
    videoTitle: '741 Hz — Throat Chakra Healing, Remove Toxins',
  },
  {
    id:         'thirdeye',
    num:        6,
    name:       'Third Eye',
    sanskrit:   'Ajna',
    hz:         852,
    color:      '#818cf8',
    element:    'Light',
    purpose:    'Returning to spiritual order — intuition & inner vision',
    videoId:    'A41WDf_E3tg',
    videoTitle: '852 Hz — Activate Crystal Clear Intuition',
  },
  {
    id:         'crown',
    num:        7,
    name:       'Crown Chakra',
    sanskrit:   'Sahasrara',
    hz:         963,
    color:      '#c084fc',
    element:    'Thought',
    purpose:    'Divine consciousness — enlightenment, oneness & pineal activation',
    videoId:    'YixvPvBYhL0',
    videoTitle: '963 Hz — Connect to Divine Consciousness',
  },
]

function ChakraCard({ chakra, index, spanFull }) {
  const c = chakra.color

  return (
    <div
      className={`chakra-card-in rounded-2xl overflow-hidden border flex flex-col${spanFull ? ' sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full' : ''}`}
      style={{
        animationDelay: `${index * 0.08}s`,
        borderColor: `${c}28`,
        boxShadow: `0 4px 28px rgba(0,0,0,0.45), 0 0 48px ${c}0c`,
        background: 'rgba(6,4,18,0.85)',
      }}
    >
      {/* ── Colored header strip ── */}
      <div
        className="px-4 py-3 flex items-center gap-3 shrink-0"
        style={{
          background: `linear-gradient(120deg, ${c}20 0%, ${c}0a 55%, transparent 100%)`,
          borderBottom: `1px solid ${c}1c`,
        }}
      >
        {/* Numbered orb */}
        <div
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold select-none"
          style={{
            background: `radial-gradient(circle at 38% 32%, ${c}dd, ${c}44)`,
            border: `1.5px solid ${c}60`,
            boxShadow: `0 0 14px ${c}50, inset 0 0 8px ${c}20`,
            color: 'rgba(255,255,255,0.95)',
            textShadow: `0 0 10px ${c}`,
          }}
        >
          {chakra.num}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-white text-sm font-bold leading-tight">{chakra.name}</p>
              <p className="text-[11px] mt-0.5 italic" style={{ color: `${c}99` }}>
                {chakra.sanskrit} · {chakra.element}
              </p>
            </div>

            {/* Hz badge */}
            <span
              className="shrink-0 text-xs font-bold tabular-nums px-2.5 py-1 rounded-xl"
              style={{
                background: `${c}18`,
                color: c,
                border: `1px solid ${c}35`,
                boxShadow: `0 0 10px ${c}20`,
              }}
            >
              {chakra.hz} Hz
            </span>
          </div>
        </div>
      </div>

      {/* ── Purpose line ── */}
      <div
        className="px-4 py-2 shrink-0"
        style={{ background: `linear-gradient(180deg, ${c}07 0%, rgba(6,4,18,0.7) 100%)` }}
      >
        <p className="text-[11px] text-slate-500 text-center italic leading-snug">
          {chakra.purpose}
        </p>
      </div>

      {/* ── YouTube iframe — 16:9 responsive ── */}
      <div className="relative w-full flex-1" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${chakra.videoId}?rel=0&modestbranding=1&color=white`}
          title={chakra.videoTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: 'none', display: 'block' }}
          loading="lazy"
        />
      </div>

      {/* ── Footer glow strip ── */}
      <div
        className="px-4 py-2 flex items-center justify-between shrink-0"
        style={{
          background: `linear-gradient(0deg, ${c}10 0%, rgba(6,4,18,0.9) 100%)`,
          borderTop: `1px solid ${c}12`,
        }}
      >
        <p className="text-[10px] text-slate-700 tracking-wide">🎧 Headphones recommended</p>
        <p className="text-[10px] font-medium" style={{ color: `${c}60` }}>
          Solfeggio · Sine
        </p>
      </div>
    </div>
  )
}

export default function ChakraSounds() {
  const lastIsOdd = CHAKRAS.length % 2 !== 0

  return (
    <div className="flex flex-col items-center px-6 py-12 w-full">
      <div className="w-full max-w-3xl flex flex-col gap-8">

        {/* ── Section header ── */}
        <div className="text-center flex flex-col gap-2">
          <p className="text-violet-400/70 text-xs uppercase tracking-[0.3em] font-medium">
            Cosmic Frequencies
          </p>
          <h2 className="text-3xl font-bold text-white">
            <span className="shimmer-text">Cosmic Meditation Station</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mt-1">
            Seven sacred Solfeggio frequencies, one for each energy centre.
            Press play, close your eyes, and let the vibration carry you.
          </p>
          <div
            className="inline-flex items-center gap-2 mx-auto mt-1 px-4 py-1.5 rounded-full text-[11px] text-slate-500"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span>🎧</span>
            Headphones recommended for the deepest effect
          </div>
        </div>

        {/* ── Chakra frequency legend ── */}
        <div
          className="rounded-2xl px-5 py-4 flex flex-wrap justify-center gap-x-4 gap-y-2"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {CHAKRAS.map((ch) => (
            <div key={ch.id} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: ch.color, boxShadow: `0 0 6px ${ch.color}` }}
              />
              <span className="text-[10px] text-slate-500 tabular-nums">{ch.hz} Hz</span>
              <span className="text-[10px] text-slate-700">·</span>
              <span className="text-[10px] text-slate-600">{ch.name}</span>
            </div>
          ))}
        </div>

        {/* ── 2-column grid of chakra players ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CHAKRAS.map((chakra, i) => (
            <ChakraCard
              key={chakra.id}
              chakra={chakra}
              index={i}
              spanFull={lastIsOdd && i === CHAKRAS.length - 1}
            />
          ))}
        </div>

        {/* ── Footer note ── */}
        <p className="text-center text-slate-700 text-[11px] leading-relaxed px-4">
          Tracks are embedded directly from YouTube. For the deepest healing session, listen in a quiet space for 15–30 minutes per frequency, from Root to Crown.
        </p>

      </div>
    </div>
  )
}
