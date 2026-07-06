export const ZODIAC_SIGNS = [
  '♈ Aries', '♉ Taurus', '♊ Gemini', '♋ Cancer',
  '♌ Leo', '♍ Virgo', '♎ Libra', '♏ Scorpio',
  '♐ Sagittarius', '♑ Capricorn', '♒ Aquarius', '♓ Pisces',
]

export const PARTICLE_COLORS = [
  '#c4b5fd', '#e879f9', '#818cf8', '#f9a8d4',
  '#fde68a', '#6ee7b7', '#ffffff', '#a78bfa',
  '#fb7185', '#34d399', '#fbbf24', '#60a5fa',
]

export const ANGEL_NUMBERS = [
  {
    number: '000',
    category: 'Health',
    emoji: '🌿',
    color: 'from-emerald-400 to-teal-400',
    borderColor: 'border-emerald-500/40',
    message:
      'You are entering a period of absolute renewal and a clean slate. Your body and energy are resetting, wiping away past fatigue. Trust the fresh start.',
  },
  {
    number: '111',
    category: 'Money',
    emoji: '✨',
    color: 'from-yellow-400 to-amber-300',
    borderColor: 'border-yellow-500/40',
    message:
      'Your thoughts are acts of instant manifestation. Focus purely on your career ambitions and financial targets right now, as a doorway to abundance is swinging open.',
  },
  {
    number: '222',
    category: 'Love',
    emoji: '💖',
    color: 'from-pink-500 to-rose-400',
    borderColor: 'border-pink-500/40',
    message:
      'A beautiful sign of balance, patience, and harmony. If you are waiting on a relationship shift or searching for your soul circle, trust that things are unfolding exactly as they should behind the scenes.',
  },
  {
    number: '333',
    category: 'Health',
    emoji: '🌿',
    color: 'from-emerald-400 to-teal-400',
    borderColor: 'border-emerald-500/40',
    message:
      'You are fully supported by divine, protective energies. This number is a green light to lean into your creative self-expression to heal your mind, body, and spirit.',
  },
  {
    number: '444',
    category: 'Health',
    emoji: '🌿',
    color: 'from-emerald-400 to-teal-400',
    borderColor: 'border-emerald-500/40',
    message:
      'The ultimate sign of inner strength and stabilization. Your physical foundations are being fortified by protective energies. Keep pushing through, you are safe.',
  },
  {
    number: '555',
    category: 'Money',
    emoji: '✨',
    color: 'from-yellow-400 to-amber-300',
    borderColor: 'border-yellow-500/40',
    message:
      'A major curveball or massive change is on the horizon for your career. Do not fear the disruption; this sudden pivot is the universe clearing a path toward greater prosperity.',
  },
  {
    number: '666',
    category: 'Love',
    emoji: '💖',
    color: 'from-pink-500 to-rose-400',
    borderColor: 'border-pink-500/40',
    message:
      'This is a gentle reminder to bring your life back into emotional balance. Treat yourself with deep kindness, reframe your negative thoughts, and reconnect with your heart.',
  },
  {
    number: '777',
    category: 'Money',
    emoji: '✨',
    color: 'from-yellow-400 to-amber-300',
    borderColor: 'border-yellow-500/40',
    message:
      'Pure luck and spiritual alignment are flowing your way. Your financial instincts are highly accurate right now—expect unexpected luck or recognition for your hard work.',
  },
  {
    number: '888',
    category: 'Money',
    emoji: '✨',
    color: 'from-yellow-400 to-amber-300',
    borderColor: 'border-yellow-500/40',
    message:
      'The classic code of ultimate wealth and infinite abundance. The infinite loop of energy means your past efforts are finally ready to harvest. Financial success is moving toward you.',
  },
  {
    number: '999',
    category: 'Health',
    emoji: '🌿',
    color: 'from-emerald-400 to-teal-400',
    borderColor: 'border-emerald-500/40',
    message:
      'An emotional or spiritual chapter of your life is coming to a complete close. Let go of what no longer serves you to create physical space for a beautiful new era.',
  },
  {
    number: '1111',
    category: 'Love',
    emoji: '💖',
    color: 'from-pink-500 to-rose-400',
    borderColor: 'border-pink-500/40',
    message:
      'The ultimate cosmic green light. Your spiritual and romantic timelines are matching up perfectly. Keep your mindset positive, as love is adjusting to your frequency right now.',
  },
]

// Fixed at module load so stars don't re-randomise on re-renders
export const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  duration: Math.random() * 4 + 2,
  delay: Math.random() * 5,
}))

// Standard Lo Shu magic square layout
// Row 0 = Mental Plane, Row 1 = Emotional Plane, Row 2 = Practical Plane
export const LO_SHU = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
]

export const PLANE_READINGS = [
  {
    label: 'Mental Plane',
    numbers: [4, 9, 2],
    icon: '🧠',
    color: 'from-violet-500 to-indigo-400',
    borderColor: 'border-violet-500/40',
    text: 'Sharp mind and excellent memory. You process information with rare clarity and retain knowledge effortlessly.',
  },
  {
    label: 'Emotional Plane',
    numbers: [3, 5, 7],
    icon: '💜',
    color: 'from-pink-500 to-violet-400',
    borderColor: 'border-pink-500/40',
    text: 'Deeply intuitive and highly compassionate. You sense what others feel before they speak it aloud.',
  },
  {
    label: 'Practical Plane',
    numbers: [8, 1, 6],
    icon: '⚡',
    color: 'from-amber-400 to-yellow-300',
    borderColor: 'border-amber-500/40',
    text: 'Grounded and excellent at real-world success. You turn ideas into results with rare efficiency and drive.',
  },
]
