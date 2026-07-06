// Named-export enums from @swisseph/core are broken when Vite pre-bundles this
// package (CJS-in-ESM packaging bug). Use raw SE constants instead:
//   Planets: Sun=0, Moon=1, Mercury=2, Venus=3, Mars=4, Jupiter=5, Saturn=6
//   House systems: 'P'=Placidus, 'W'=Whole-Sign, 'E'=Equal, 'K'=Koch
import { SwissEphemeris } from '@swisseph/browser'

const SE_BODIES = [
  [0, 'Sun    '],
  [1, 'Moon   '],
  [2, 'Mercury'],
  [3, 'Venus  '],
  [4, 'Mars   '],
  [5, 'Jupiter'],
  [6, 'Saturn '],
]

/**
 * Diagnostic: run SE WASM and log raw tropical positions for the
 * verification date July 3 1992 01:42 AM IST = July 2 1992 20:12 UTC.
 *
 * Open http://localhost:5174/test-eph.html in the browser to see output.
 */
export async function runEphTest() {
  const swe = new SwissEphemeris()
  await swe.init()

  console.log('=== @swisseph/browser WASM diagnostic ===')
  console.log('SE version:', swe.version())

  // Birth: July 3 1992, 01:42 AM IST → subtract 5.5h → UTC July 2 20:12:00
  // Use julianDay() with explicit calendarType=1 (Gregorian) to bypass the broken
  // (void 0).Gregorian default parameter in the Vite pre-bundle of @swisseph/browser
  const utcDate = new Date(Date.UTC(1992, 6, 2, 20, 12, 0))
  const utcHour = utcDate.getUTCHours() + utcDate.getUTCMinutes() / 60
  const jd = swe.julianDay(1992, 7, 2, utcHour, 1)

  console.log('UTC :', utcDate.toISOString())
  console.log('JD  :', jd.toFixed(5))
  console.log('')

  console.log('--- Tropical Longitudes (geocentric, ecliptic of date) ---')
  const positions = {}
  // SE_FLG_MOSEPH (4) | SE_FLG_SPEED (256) = 260 — matches CalculationFlag.DefaultMoshier
  const FLAGS_MOSHIER = 4 | 256

  for (const [body, label] of SE_BODIES) {
    const pos = swe.calculatePosition(jd, body, FLAGS_MOSHIER)
    positions[label.trim()] = pos.longitude
    console.log(
      `${label}: ${pos.longitude.toFixed(4).padStart(10)}°` +
      `  lat ${pos.latitude.toFixed(4)}°  dist ${pos.distance.toFixed(5)} AU`
    )
  }

  console.log('')
  // 'W' = Whole-Sign house system (SE single-char code)
  console.log('--- House data: Whole-Sign, Mumbai lat=19.076° lon=72.878° ---')
  const houses = swe.calculateHouses(jd, 19.076, 72.8777, 'W')
  console.log('Ascendant (tropical):', houses.ascendant.toFixed(4) + '°')
  console.log('MC (tropical)       :', houses.mc.toFixed(4) + '°')
  console.log('ARMC                :', houses.armc.toFixed(4))
  for (let i = 1; i <= 12; i++) {
    console.log(`  House ${String(i).padStart(2)}: ${(houses.cusps[i] ?? 0).toFixed(4)}°`)
  }

  swe.close()
  console.log('')
  console.log('=== done ===')

  return { jd, utcISO: utcDate.toISOString(), positions, ascendant: houses.ascendant, mc: houses.mc }
}
