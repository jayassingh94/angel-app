// Pythagorean letter-to-digit map
const PYTHAGOREAN = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8,
}

function sumDigits(n) {
  return String(n).split('').reduce((acc, d) => acc + Number(d), 0)
}

// Reduce to single digit, preserving master numbers 11, 22, 33
export function reduce(n) {
  if (n === 11 || n === 22 || n === 33) return n
  if (n < 10) return n
  return reduce(sumDigits(n))
}

// Life Path = reduce(month) + reduce(day) + reduce(year digits)
export function computeLifePath(day, month, year) {
  const d = reduce(day)
  const m = reduce(month)
  const y = reduce(sumDigits(year))
  return reduce(d + m + y)
}

// Name Number = reduce(sum of Pythagorean values of all letters)
export function computeNameNumber(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '').split('')
  if (letters.length === 0) return null
  const sum = letters.reduce((acc, c) => acc + (PYTHAGOREAN[c] || 0), 0)
  return reduce(sum)
}
