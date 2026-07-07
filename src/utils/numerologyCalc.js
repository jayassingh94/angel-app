// ── Pythagorean (used for Life Path) ──────────────────────────────────────────
const PYTHAGOREAN = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8,
}

function sumDigits(n) {
  return String(n).split('').reduce((acc, d) => acc + Number(d), 0)
}

// Reduce preserving master numbers 11, 22, 33
export function reduce(n) {
  if (n === 11 || n === 22 || n === 33) return n
  if (n < 10) return n
  return reduce(sumDigits(n))
}

// Life Path = reduce(month) + reduce(day) + reduce(year-digit-sum)
export function computeLifePath(day, month, year) {
  const d = reduce(day)
  const m = reduce(month)
  const y = reduce(sumDigits(year))
  return reduce(d + m + y)
}

// ── Chaldean (used for name numbers) ──────────────────────────────────────────
// 9 is considered sacred in Chaldean — not assigned to any letter
const CHALDEAN = {
  A:1,B:2,C:3,D:4,E:5,F:8,G:3,H:5,I:1,J:1,K:2,L:3,M:4,N:5,O:7,P:8,Q:1,R:2,S:3,T:4,U:6,V:6,W:6,X:5,Y:1,Z:7,
}

function reduceChaldean(n) {
  if (n < 10) return n
  return reduceChaldean(sumDigits(n))
}

export function computeNameNumber(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '').split('')
  if (letters.length === 0) return null
  const sum = letters.reduce((acc, c) => acc + (CHALDEAN[c] ?? 0), 0)
  return reduceChaldean(sum)
}

// ── Compatibility map (Life Path → compatible Name Numbers) ───────────────────
export const COMPATIBLE = {
  1:  new Set([1, 5, 3]),
  2:  new Set([2, 7, 6]),
  3:  new Set([3, 6, 9]),
  4:  new Set([4, 8]),
  5:  new Set([1, 5, 3]),
  6:  new Set([6, 3, 9]),
  7:  new Set([7, 2, 5]),
  8:  new Set([8, 4]),
  9:  new Set([9, 3, 6]),
  11: new Set([2, 7, 6]),   // LP 11 reduces to 2
  22: new Set([4, 8]),      // LP 22 reduces to 4
  33: new Set([6, 3, 9]),   // LP 33 reduces to 6
}

// ── Spelling variation generators ─────────────────────────────────────────────
const VOWELS = new Set('AEIOU')

function wordVariants(word) {
  const wu = word.toUpperCase()
  const last = wu.slice(-1)
  const isVowelEnd = VOWELS.has(last)
  const variants = []

  // 1. Double final vowel: Priya → Priyaa, Neha → Nehaa
  if (isVowelEnd) {
    variants.push(word + word.slice(-1).toLowerCase())
  }

  // 2. Add silent 'h': Priya → Priyah, Ravi → Ravih
  if (last !== 'H') {
    variants.push(word + 'h')
  }

  // 3. i → y at end: Ravi → Ravy
  if (last === 'I') {
    variants.push(word.slice(0, -1) + 'y')
  }

  // 4. y → i at end: Ravy → Ravi
  if (last === 'Y') {
    variants.push(word.slice(0, -1) + 'i')
  }

  // 5. i → ie at end: Ravi → Ravie
  if (last === 'I') {
    variants.push(word.slice(0, -1) + 'ie')
  }

  // 6. Add 'a' if not ending in 'a': Ravi → Ravia
  if (last !== 'A') {
    variants.push(word + 'a')
  }

  // 7. Double last internal vowel: Neha → Neeha, Ravi → Raavi
  for (let i = wu.length - 2; i >= 1; i--) {
    if (VOWELS.has(wu[i])) {
      variants.push(word.slice(0, i + 1) + word[i].toLowerCase() + word.slice(i + 1))
      break
    }
  }

  // 8. Double last consonant: Karan → Karran
  for (let i = wu.length - 1; i >= 0; i--) {
    if (!VOWELS.has(wu[i]) && wu[i] !== 'H') {
      variants.push(word.slice(0, i) + word[i].toLowerCase() + word.slice(i))
      break
    }
  }

  // 9. Add 'n' to vowel-ending name: Priya → Priyan
  if (isVowelEnd && word.length >= 3) {
    variants.push(word + 'n')
  }

  // 10. Remove trailing 'h' (Priyah → Priya) — inverse of #2
  if (last === 'H' && word.length > 3) {
    variants.push(word.slice(0, -1))
  }

  return variants.filter(v =>
    v.toUpperCase() !== wu &&
    v.length > 2 &&
    v.length <= wu.length + 3
  )
}

function editDist(a, b) {
  const s = a.toUpperCase()
  const t = b.toUpperCase()
  const m = s.length
  const n = t.length
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = s[i - 1] === t[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

// Generate candidate spellings whose Chaldean number is compatible with lifePathNumber.
// Applies variations to each word position; returns top 5 by fewest character changes.
export function generateSuggestions(fullName, lifePathNumber) {
  const compatible = COMPATIBLE[lifePathNumber] ?? new Set()
  const words = fullName.trim().split(/\s+/)
  const seen = new Set([fullName.toUpperCase()])
  const results = []

  for (let wi = 0; wi < words.length; wi++) {
    for (const variant of wordVariants(words[wi])) {
      const candidate = [...words.slice(0, wi), variant, ...words.slice(wi + 1)].join(' ')
      if (seen.has(candidate.toUpperCase())) continue
      seen.add(candidate.toUpperCase())

      const num = computeNameNumber(candidate)
      if (num && compatible.has(num)) {
        results.push({
          spelling: candidate,
          nameNumber: num,
          editDistance: editDist(fullName, candidate),
        })
      }
    }
  }

  results.sort((a, b) => a.editDistance - b.editDistance || a.spelling.localeCompare(b.spelling))

  // Deduplicate: keep one entry per spelling
  const dedupSeen = new Set()
  return results
    .filter(r => {
      const k = r.spelling.toUpperCase()
      if (dedupSeen.has(k)) return false
      dedupSeen.add(k)
      return true
    })
    .slice(0, 5)
}
