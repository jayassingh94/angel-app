import { ANGEL_NUMBERS } from '../data.js'

const CATEGORY_META = {
  Love:   { glow: 'rgba(244,114,182,0.35)', ring: 'rgba(244,114,182,0.15)' },
  Money:  { glow: 'rgba(251,191,36,0.35)',  ring: 'rgba(251,191,36,0.15)'  },
  Health: { glow: 'rgba(52,211,153,0.35)',  ring: 'rgba(52,211,153,0.15)'  },
}

function NumberCard({ entry, index }) {
  const meta = CATEGORY_META[entry.category]
  return (
    <div
      className={`card-appear relative rounded-2xl border ${entry.borderColor} backdrop-blur-sm bg-white/4 p-6 flex flex-col gap-4 transition-transform duration-200 hover:scale-[1.02] hover:-translate-y-0.5`}
      style={{
        animationDelay: `${index * 0.06}s`,
        boxShadow: `0 0 30px ${meta.glow}, inset 0 0 30px ${meta.ring}`,
      }}
    >
      {/* Number */}
      <div className="text-center">
        <div
          className={`text-5xl font-bold tracking-tighter bg-gradient-to-br ${entry.color} bg-clip-text text-transparent`}
          style={{
            textShadow: 'none',
            filter: `drop-shadow(0 0 12px ${meta.glow})`,
          }}
        >
          {entry.number}
        </div>
      </div>

      {/* Category badge */}
      <div className="flex justify-center">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${entry.color} text-white/90`}
        >
          {entry.emoji} {entry.category}
        </span>
      </div>

      {/* Divider */}
      <div className={`w-10 h-px mx-auto bg-gradient-to-r from-transparent via-current to-transparent opacity-30`} />

      {/* Message */}
      <p className="text-slate-400 text-base leading-relaxed text-center">
        {entry.message}
      </p>
    </div>
  )
}

export default function AngelDictionary() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12">
      {/* Section header */}
      <div className="text-center mb-10">
        <p className="text-violet-400/70 text-xs uppercase tracking-[0.3em] mb-2">Complete Reference</p>
        <h2 className="text-3xl font-bold text-white">
          <span className="shimmer-text">Angel Number Dictionary</span>
        </h2>
        <p className="mt-3 text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
          Every number the universe sends carries a precise message. Browse all 11 sacred codes and their meanings below.
        </p>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ANGEL_NUMBERS.map((entry, i) => (
          <NumberCard key={entry.number} entry={entry} index={i} />
        ))}
      </div>
    </div>
  )
}
