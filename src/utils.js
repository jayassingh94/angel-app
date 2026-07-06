import { PARTICLE_COLORS } from './data.js'

export function playChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    // C pentatonic arpeggio — C5 E5 G5 C6 E6
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      const t = ctx.currentTime + i * 0.16
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.22, t + 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.1)
      osc.start(t)
      osc.stop(t + 1.2)
    })
  } catch (_) { /* AudioContext unavailable in this environment */ }
}

export function makeParticles() {
  return Array.from({ length: 60 }, (_, id) => {
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * 280 + 60
    return {
      id,
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      size: Math.random() * 10 + 3,
      dur: (Math.random() * 0.5 + 0.85).toFixed(2),
      delay: (Math.random() * 0.3).toFixed(2),
    }
  })
}
