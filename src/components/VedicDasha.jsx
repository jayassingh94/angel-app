import { useState, useMemo, useEffect } from 'react'
import { computeDasha, buildPADs, toTimelineJSON, PLANET_META, fmt, yrsReadable } from '../utils/dasha.js'
import { dashaInterpretations } from '../utils/dashaInterpretations.js'

const YEAR_MS = 365.25 * 24 * 3600 * 1000

// ── Shared sub-components ──────────────────────────────────────────────────────

function ProgressBar({ pct, color }) {
  return (
    <div className="relative h-1 rounded-full overflow-hidden" style={{ background: 'var(--btn-subtle-border)' }}>
      <div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          width: `${Math.min(100, Math.max(0, pct))}%`,
          background: `linear-gradient(90deg, ${color}50, ${color})`,
        }}
      />
    </div>
  )
}

function CurrentCard({ label, title, symbol, color, start, end, pct }) {
  const remMs  = end - new Date()
  const remYrs = remMs > 0 ? remMs / YEAR_MS : 0
  return (
    <div
      className="flex-1 min-w-0 rounded-xl p-4 flex flex-col gap-2"
      style={{ background: `${color}0b`, border: `1px solid ${color}30` }}
    >
      <p className="text-[9px] uppercase tracking-[0.2em] font-semibold" style={{ color: `${color}88` }}>
        {label}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-xl leading-none" style={{ color, filter: `drop-shadow(0 0 5px ${color})` }}>
          {symbol}
        </span>
        <span className="text-sm font-bold truncate" style={{ color: 'var(--text-h)' }}>{title}</span>
      </div>
      <p className="text-[9px] font-mono text-slate-600">{fmt(start)} → {fmt(end)}</p>
      <ProgressBar pct={pct} color={color} />
      <div className="flex justify-between">
        <span className="text-[9px] text-slate-700">{Math.round(pct)}% elapsed</span>
        {remYrs > 0 && (
          <span className="text-[9px]" style={{ color: `${color}bb` }}>{yrsReadable(remYrs)} left</span>
        )}
      </div>
    </div>
  )
}

// ── Interpretation block ───────────────────────────────────────────────────────

function InterpBlock({ planet, interp, color }) {
  if (!interp) return null
  return (
    <div
      className="mx-3 mt-1 mb-2 px-3 py-3 rounded-lg"
      style={{ background: 'var(--card-inner)', borderLeft: `2px solid ${color}40` }}
    >
      <p className="text-xs uppercase tracking-[0.18em] mb-2 font-semibold" style={{ color: 'var(--text-h)' }}>
        ✦ {planet} Mahadasha
      </p>
      <p className="text-base leading-[1.7] mb-3" style={{ color: 'var(--text-body)' }}>{interp.theme}</p>
      <p className="text-xs uppercase tracking-[0.15em] mb-1.5 font-semibold" style={{ color: 'var(--text-soft)' }}>Points to navigate</p>
      <p className="text-base leading-[1.7]" style={{ color: 'var(--text-body)' }}>{interp.challenges}</p>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function VedicDasha({ moonSidLon, birthDate }) {
  const dasha = useMemo(() => computeDasha(moonSidLon, birthDate), [moonSidLon, birthDate])
  const now   = useMemo(() => new Date(), [])

  const currentMDIdx = useMemo(
    () => dasha.mahadashas.findIndex(md => now >= md.start && now < md.end),
    [dasha, now]
  )
  const currentMD = currentMDIdx >= 0 ? dasha.mahadashas[currentMDIdx] : null
  const currentAD = currentMD?.antardashas.find(ad => now >= ad.start && now < ad.end) ?? null

  const [expandedMD, setExpandedMD] = useState(null)
  const [expandedAD, setExpandedAD] = useState(null)
  const [copied,     setCopied]     = useState(false)

  // Auto-expand current MD when chart changes
  useEffect(() => {
    setExpandedMD(currentMDIdx >= 0 ? currentMDIdx : null)
    setExpandedAD(null)
  }, [currentMDIdx])

  const pct = (s, e) => Math.max(0, Math.min(100, ((now - s) / (e - s)) * 100))

  function handleCopyJSON() {
    const json = JSON.stringify(toTimelineJSON(dasha), null, 2)
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const lordMeta = PLANET_META[dasha.lordName]

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-5"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid rgba(99,102,241,0.18)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-indigo-400/70 font-semibold mb-1">
            Vimshottari Dasha · Full Lifetime Timeline
          </p>
          <p className="font-semibold text-sm" style={{ color: 'var(--text-h)' }}>
            Moon in{' '}
            <span style={{ color: lordMeta.color }}>{dasha.nakName}</span>
            <span className="text-slate-500 font-normal">
              {' '}(Pada {dasha.nakPada}) · {dasha.lordName}-ruled
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="rounded-lg px-3 py-2 text-right"
            style={{ background: 'var(--card-inner)', border: '1px solid var(--card-border-subtle)' }}
          >
            <p className="text-[9px] uppercase tracking-widest text-slate-700">Balance at birth</p>
            <p className="text-xs font-mono" style={{ color: lordMeta.color }}>
              {yrsReadable(dasha.firstYrs)}{' '}
              <span className="text-slate-700">of {dasha.lordName}</span>
            </p>
          </div>
          <button
            onClick={handleCopyJSON}
            className="rounded-lg px-2.5 py-2 text-[9px] font-mono transition-all cursor-pointer"
            style={{
              background: copied ? 'rgba(99,102,241,0.25)' : 'var(--btn-subtle-bg)',
              border: `1px solid ${copied ? 'rgba(99,102,241,0.5)' : 'var(--btn-subtle-border)'}`,
              color: copied ? '#818cf8' : 'var(--text-muted)',
            }}
            title="Copy full timeline as JSON"
          >
            {copied ? '✓ copied' : '{ } JSON'}
          </button>
        </div>
      </div>

      {/* ── Current period cards ── */}
      {currentMD && (
        <div className="flex gap-3 flex-col sm:flex-row">
          <CurrentCard
            label="Mahadasha · running"
            title={`${currentMD.lord} MAHADASHA`}
            symbol={PLANET_META[currentMD.lord].symbol}
            color={PLANET_META[currentMD.lord].color}
            start={currentMD.start}
            end={currentMD.end}
            pct={pct(currentMD.start, currentMD.end)}
          />
          {currentAD && (
            <CurrentCard
              label="Antardasha · running"
              title={`${currentMD.lord}–${currentAD.lord}`}
              symbol={PLANET_META[currentAD.lord].symbol}
              color={PLANET_META[currentAD.lord].color}
              start={currentAD.start}
              end={currentAD.end}
              pct={pct(currentAD.start, currentAD.end)}
            />
          )}
        </div>
      )}

      {/* ── Full Lifetime Timeline ── */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-[9px] uppercase tracking-[0.2em] text-slate-700">
            {dasha.mahadashas.length} periods · birth to {fmt(dasha.lifetime)}
          </p>
          <p className="text-[9px] text-slate-800 font-mono">
            ★ partial &nbsp;› expand Antardashas
          </p>
        </div>

        <div className="flex flex-col">
          {dasha.mahadashas.map((md, mi) => {
            const meta      = PLANET_META[md.lord]
            const isCurrent = mi === currentMDIdx
            const isPast    = md.end   < now
            const expanded  = expandedMD === mi
            const ageStart  = Math.floor((md.start - dasha.birthDate) / YEAR_MS)
            const ageEnd    = Math.floor((md.end   - dasha.birthDate) / YEAR_MS)

            const rowOpacity  = isPast ? 0.32 : 1
            const symbolColor = isPast ? 'var(--text-faint)' : meta.color
            const symbolGlow  = isCurrent ? `drop-shadow(0 0 5px ${meta.color})` : 'none'
            const nameColor   = isPast ? 'var(--text-faint)' : isCurrent ? 'var(--text-h)' : 'var(--text-2)'
            const ageColor    = isPast ? 'var(--text-faint)' : isCurrent ? meta.color : 'var(--text-muted)'
            const dateColor   = isPast ? 'var(--text-faint)' : 'var(--text-soft)'

            const interp = dashaInterpretations[md.lord] ?? null

            return (
              <div key={mi} style={{ opacity: rowOpacity }}>
                {/* Mahadasha row */}
                <div
                  className="grid items-center px-3 py-2.5 rounded-lg cursor-pointer select-none transition-all duration-150"
                  style={{
                    gridTemplateColumns: '1.4rem 1fr 5.5rem 3rem 1rem',
                    columnGap: '0.55rem',
                    background: isCurrent
                      ? `${meta.color}10`
                      : expanded
                        ? 'var(--card-inner)'
                        : 'transparent',
                    border: isCurrent ? `1px solid ${meta.color}2a` : '1px solid transparent',
                  }}
                  onClick={() => {
                    setExpandedMD(expanded ? null : mi)
                    setExpandedAD(null)
                  }}
                >
                  <span
                    className="text-sm text-center leading-none"
                    style={{ color: symbolColor, filter: symbolGlow }}
                  >
                    {meta.symbol}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-semibold" style={{ color: ageColor }}>
                        Age {ageStart}–{ageEnd}
                      </span>
                      <span className="text-[11px]" style={{ color: 'var(--text-faint)' }}>·</span>
                      <span className="text-[12px] font-semibold" style={{ color: nameColor }}>
                        {md.lord}
                      </span>
                      {isCurrent && (
                        <span
                          className="text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                          style={{ background: `${meta.color}22`, color: meta.color }}
                        >
                          NOW
                        </span>
                      )}
                      {isPast && (
                        <span className="text-[7px] uppercase tracking-widest text-slate-800">done</span>
                      )}
                      {(md.fracElap > 0 || md.isEndTruncated) && (
                        <span className="text-[8px]" style={{ color: dateColor }}>★</span>
                      )}
                    </div>
                    <p className="text-[9px] font-mono truncate mt-0.5" style={{ color: dateColor }}>
                      {fmt(md.start)} → {fmt(md.end)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono" style={{ color: isPast ? 'var(--text-faint)' : 'var(--text-soft)' }}>
                      {yrsReadable(md.years)}
                    </span>
                  </div>

                  <div>
                    {isCurrent && <ProgressBar pct={pct(md.start, md.end)} color={meta.color} />}
                    {isPast    && <ProgressBar pct={100} color="#64748b" />}
                  </div>

                  <span
                    className="text-[11px] text-right transition-transform duration-150"
                    style={{ color: isPast ? 'var(--text-faint)' : 'var(--text-muted)', transform: expanded ? 'rotate(90deg)' : 'none' }}
                  >
                    ›
                  </span>
                </div>

                {/* ── Expanded: Antardashas + Interpretation ── */}
                {expanded && (
                  <>
                    {/* Antardashas */}
                    <div
                      className="ml-6 mb-0"
                      style={{ borderLeft: `1px solid ${isPast ? 'var(--btn-subtle-border)' : meta.color + '20'}` }}
                    >
                      {md.antardashas.map((ad, ai) => {
                        const adMeta     = PLANET_META[ad.lord]
                        const isNowAD    = currentAD === ad
                        const adIsPast   = ad.end   < now
                        const adKey      = `${mi}-${ai}`
                        const adExpanded = expandedAD === adKey

                        const adSymColor  = adIsPast ? 'var(--text-faint)' : adMeta.color
                        const adNameColor = adIsPast ? 'var(--text-faint)' : isNowAD ? 'var(--text-h)' : 'var(--text-soft)'
                        const adDateColor = adIsPast ? 'var(--text-faint)' : 'var(--text-soft)'

                        return (
                          <div key={ai} style={{ opacity: adIsPast ? 0.45 : 1 }}>
                            <div
                              className="grid items-center px-3 py-1.5 cursor-pointer select-none transition-all duration-100"
                              style={{
                                gridTemplateColumns: '1.2rem 1fr 4.5rem 3rem 1rem',
                                columnGap: '0.5rem',
                                background: isNowAD ? `${adMeta.color}0e` : 'transparent',
                                borderBottom: '1px solid var(--btn-subtle-border)',
                              }}
                              onClick={e => {
                                e.stopPropagation()
                                setExpandedAD(adExpanded ? null : adKey)
                              }}
                            >
                              <span className="text-[11px] text-center leading-none" style={{ color: adSymColor }}>
                                {adMeta.symbol}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1 flex-wrap">
                                  <span className="text-[11px]" style={{ color: adNameColor }}>
                                    {md.lord}–{ad.lord}
                                  </span>
                                  {isNowAD && (
                                    <span
                                      className="text-[7px] font-bold uppercase tracking-widest px-1 py-0.5 rounded-full"
                                      style={{ background: `${adMeta.color}22`, color: adMeta.color }}
                                    >
                                      NOW
                                    </span>
                                  )}
                                  {adIsPast && (
                                    <span className="text-[7px] uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>done</span>
                                  )}
                                  {ad.isPartial && (
                                    <span className="text-[8px]" style={{ color: adDateColor }}>★</span>
                                  )}
                                </div>
                                <p className="text-[8px] font-mono truncate" style={{ color: adDateColor }}>
                                  {fmt(ad.start)} → {fmt(ad.end)}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] font-mono" style={{ color: adIsPast ? 'var(--text-faint)' : 'var(--text-muted)' }}>
                                  {yrsReadable(ad.years)}
                                </span>
                              </div>
                              <div>
                                {isNowAD  && <ProgressBar pct={pct(ad.start, ad.end)} color={adMeta.color} />}
                                {adIsPast && <ProgressBar pct={100} color="#64748b" />}
                              </div>
                              <span
                                className="text-[10px] text-right transition-transform duration-100"
                                style={{ color: adIsPast ? 'var(--text-faint)' : 'var(--text-soft)', transform: adExpanded ? 'rotate(90deg)' : 'none' }}
                              >
                                ›
                              </span>
                            </div>

                            {/* Pratyantardashas */}
                            {adExpanded && (
                              <div className="ml-4" style={{ borderLeft: `1px solid ${adMeta.color}15` }}>
                                {buildPADs(ad).map((pad, pi) => {
                                  const pMeta = PLANET_META[pad.lord]
                                  const isNow = now >= pad.start && now < pad.end
                                  const padPast = pad.end < now
                                  return (
                                    <div
                                      key={pi}
                                      className="grid items-center px-3 py-1"
                                      style={{
                                        gridTemplateColumns: '1.2rem 1fr 4rem',
                                        columnGap: '0.4rem',
                                        background: isNow ? `${pMeta.color}0a` : 'transparent',
                                        borderBottom: '1px solid var(--btn-subtle-border)',
                                        opacity: padPast ? 0.4 : 1,
                                      }}
                                    >
                                      <span
                                        className="text-[10px] text-center leading-none"
                                        style={{ color: padPast ? 'var(--text-faint)' : pMeta.color, opacity: 0.8 }}
                                      >
                                        {pMeta.symbol}
                                      </span>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1">
                                          <span
                                            className="text-[10px]"
                                            style={{ color: isNow ? pMeta.color : padPast ? 'var(--text-faint)' : 'var(--text-muted)' }}
                                          >
                                            {md.lord}–{ad.lord}–{pad.lord}
                                          </span>
                                          {isNow && (
                                            <span
                                              className="text-[7px] font-bold uppercase px-1 rounded-full"
                                              style={{ background: `${pMeta.color}22`, color: pMeta.color }}
                                            >
                                              NOW
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[8px] font-mono" style={{ color: padPast ? 'var(--text-faint)' : 'var(--text-soft)' }}>
                                          {fmt(pad.start)} → {fmt(pad.end)}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-[9px] font-mono" style={{ color: padPast ? 'var(--text-faint)' : 'var(--text-muted)' }}>
                                          {yrsReadable(pad.years)}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Interpretation block — below Antardashas */}
                    <InterpBlock planet={md.lord} interp={interp} color={meta.color} />
                  </>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-[8px] text-slate-800 mt-2 px-1">
          ★ Partial (started before birth or truncated at 120-year boundary) ·
          Lahiri ayanamsha · 1 year = 365.25 days (Julian)
        </p>
      </div>
    </div>
  )
}
