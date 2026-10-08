// Second batch of config-driven tools: converters, finance, health and design.
import { fmt, num, type Field, type Row, type Spec, type Values } from './specs'

const need = (cond: boolean, msg: string) => { if (!cond) throw new Error(msg) }
const sig = (n: number) => (Number.isFinite(n) ? Number(n.toPrecision(10)).toLocaleString('en-US', { maximumFractionDigits: 12 }) : '—')
const todayStr = () => new Date().toISOString().slice(0, 10)

/* ---------- Unit converters ---------- */
type Unit = [key: string, label: string, toBase: (x: number) => number, fromBase: (x: number) => number]
const lin = (list: [string, string, number][]): Unit[] => list.map(([k, l, f]) => [k, l, (x) => x * f, (x) => x / f])

const converter = (units: Unit[], def: [string, string, string]): Spec => ({
  fields: [
    { key: 'value', label: 'Value', type: 'number', def: def[0] },
    { key: 'from', label: 'From', type: 'select', options: units.map(([k, l]): [string, string] => [k, l]), def: def[1] },
    { key: 'to', label: 'To', type: 'select', options: units.map(([k, l]): [string, string] => [k, l]), def: def[2] },
  ],
  run: (v) => {
    const x = num(v, 'value')
    const from = units.find((u) => u[0] === v.from) ?? units[0]
    const to = units.find((u) => u[0] === v.to) ?? units[1]
    const base = from[2](x)
    const rows: Row[] = [[`${sig(x)} ${from[1]} =`, `${sig(to[3](base))} ${to[1]}`]]
    for (const u of units) if (u[0] !== from[0] && u[0] !== to[0]) rows.push([u[1], sig(u[3](base))])
    return { rows }
  },
})

const length = converter(lin([['m', 'Meters (m)', 1], ['km', 'Kilometers (km)', 1000], ['cm', 'Centimeters (cm)', 0.01], ['mm', 'Millimeters (mm)', 0.001], ['um', 'Micrometers (µm)', 1e-6], ['mi', 'Miles (mi)', 1609.344], ['yd', 'Yards (yd)', 0.9144], ['ft', 'Feet (ft)', 0.3048], ['in', 'Inches (in)', 0.0254], ['nmi', 'Nautical miles', 1852]]), ['1', 'm', 'ft'])
const weight = converter(lin([['kg', 'Kilograms (kg)', 1], ['g', 'Grams (g)', 0.001], ['mg', 'Milligrams (mg)', 1e-6], ['t', 'Metric tonnes (t)', 1000], ['lb', 'Pounds (lb)', 0.45359237], ['oz', 'Ounces (oz)', 0.028349523125], ['st', 'Stone (st)', 6.35029318], ['ton', 'US tons', 907.18474]]), ['1', 'kg', 'lb'])
const area = converter(lin([['m2', 'Square meters (m²)', 1], ['km2', 'Square kilometers (km²)', 1e6], ['cm2', 'Square centimeters (cm²)', 1e-4], ['ha', 'Hectares (ha)', 1e4], ['ac', 'Acres', 4046.8564224], ['ft2', 'Square feet (ft²)', 0.09290304], ['yd2', 'Square yards (yd²)', 0.83612736], ['in2', 'Square inches (in²)', 6.4516e-4], ['mi2', 'Square miles (mi²)', 2589988.110336]]), ['1', 'ac', 'm2'])
const volume = converter(lin([['l', 'Liters (L)', 1], ['ml', 'Milliliters (mL)', 0.001], ['m3', 'Cubic meters (m³)', 1000], ['gal', 'US gallons', 3.785411784], ['qt', 'US quarts', 0.946352946], ['pt', 'US pints', 0.473176473], ['cup', 'US cups', 0.2365882365], ['floz', 'US fluid ounces', 0.0295735295625], ['tbsp', 'Tablespoons (US)', 0.01478676478125], ['tsp', 'Teaspoons (US)', 0.00492892159375], ['igal', 'Imperial gallons', 4.54609]]), ['1', 'gal', 'l'])
const speed = converter(lin([['ms', 'Meters per second (m/s)', 1], ['kmh', 'Kilometers per hour (km/h)', 1 / 3.6], ['mph', 'Miles per hour (mph)', 0.44704], ['kn', 'Knots', 0.514444444], ['fts', 'Feet per second (ft/s)', 0.3048], ['mach', 'Mach (at sea level)', 340.29]]), ['100', 'kmh', 'mph'])
const dataStorage = converter(lin([['bit', 'Bits', 0.125], ['B', 'Bytes (B)', 1], ['KB', 'Kilobytes (KB)', 1e3], ['MB', 'Megabytes (MB)', 1e6], ['GB', 'Gigabytes (GB)', 1e9], ['TB', 'Terabytes (TB)', 1e12], ['PB', 'Petabytes (PB)', 1e15], ['KiB', 'Kibibytes (KiB)', 1024], ['MiB', 'Mebibytes (MiB)', 1048576], ['GiB', 'Gibibytes (GiB)', 1073741824], ['TiB', 'Tebibytes (TiB)', 1099511627776]]), ['1', 'GB', 'MB'])
const pressure = converter(lin([['Pa', 'Pascal (Pa)', 1], ['kPa', 'Kilopascal (kPa)', 1e3], ['MPa', 'Megapascal (MPa)', 1e6], ['bar', 'Bar', 1e5], ['atm', 'Atmosphere (atm)', 101325], ['psi', 'PSI', 6894.757293168], ['mmHg', 'mmHg', 133.322387415], ['torr', 'Torr', 101325 / 760]]), ['1', 'bar', 'psi'])
const energy = converter(lin([['J', 'Joules (J)', 1], ['kJ', 'Kilojoules (kJ)', 1e3], ['cal', 'Calories (cal)', 4.184], ['kcal', 'Food calories (kcal)', 4184], ['Wh', 'Watt-hours (Wh)', 3600], ['kWh', 'Kilowatt-hours (kWh)', 3.6e6], ['BTU', 'BTU', 1055.05585262], ['eV', 'Electronvolts (eV)', 1.602176634e-19], ['ftlbf', 'Foot-pounds (ft·lbf)', 1.3558179483314]]), ['1', 'kcal', 'kJ'])
const angle = converter(lin([['deg', 'Degrees (°)', 1], ['rad', 'Radians (rad)', 180 / Math.PI], ['grad', 'Gradians (grad)', 0.9], ['arcmin', 'Arcminutes (′)', 1 / 60], ['arcsec', 'Arcseconds (″)', 1 / 3600], ['turn', 'Turns', 360]]), ['180', 'deg', 'rad'])
const power = converter(lin([['W', 'Watts (W)', 1], ['kW', 'Kilowatts (kW)', 1e3], ['MW', 'Megawatts (MW)', 1e6], ['hp', 'Horsepower (mechanical)', 745.69987158], ['ps', 'Horsepower (metric, PS)', 735.49875], ['btuh', 'BTU per hour', 0.29307107]]), ['100', 'kW', 'hp'])
const fuelEconomy = converter([
  ['l100', 'Liters per 100 km', (x) => x, (x) => x],
  ['kml', 'Kilometers per liter', (x) => 100 / x, (x) => 100 / x],
  ['mpg', 'Miles per gallon (US)', (x) => 235.214583 / x, (x) => 235.214583 / x],
  ['mpguk', 'Miles per gallon (UK)', (x) => 282.480936 / x, (x) => 282.480936 / x],
], ['30', 'mpg', 'l100'])
const temperature = converter([
  ['c', 'Celsius (°C)', (x) => x, (x) => x],
  ['f', 'Fahrenheit (°F)', (x) => ((x - 32) * 5) / 9, (x) => (x * 9) / 5 + 32],
  ['k', 'Kelvin (K)', (x) => x - 273.15, (x) => x + 273.15],
  ['r', 'Rankine (°R)', (x) => ((x - 491.67) * 5) / 9, (x) => ((x + 273.15) * 9) / 5],
], ['100', 'c', 'f'])

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const SCALES = ['', ' thousand', ' million', ' billion', ' trillion']
const below1000 = (n: number): string => {
  const parts: string[] = []
  if (n >= 100) { parts.push(`${ONES[Math.floor(n / 100)]} hundred`); n %= 100 }
  if (n >= 20) { parts.push(TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '')) } else if (n > 0) parts.push(ONES[n])
  return parts.join(' ')
}
export const numberToWords = (n: bigint): string => {
  if (n === 0n) return 'zero'
  const neg = n < 0n
  let x = neg ? -n : n
  const out: string[] = []
  for (let i = 0; x > 0n; i++) { const chunk = Number(x % 1000n); if (chunk) out.unshift(below1000(chunk) + SCALES[i]); x /= 1000n }
  return (neg ? 'minus ' : '') + out.join(' ')
}
const numberWords: Spec = {
  fields: [{ key: 'n', label: 'Number', type: 'text', def: '1234567.89', placeholder: 'e.g. 1250.50' }],
  run: (v) => {
    const raw = (v.n ?? '').trim().replace(/[,\s]/g, '')
    need(/^-?\d+(\.\d+)?$/.test(raw), 'Enter a number such as 1250 or 1250.50.')
    const [i, d] = raw.replace('-', '').split('.')
    need(i.length <= 15, 'That number is too large (max 15 digits before the decimal point).')
    const sign = raw.startsWith('-') ? 'minus ' : ''
    let words = sign + numberToWords(BigInt(i))
    if (d) words += ` point ${d.split('').map((c) => ONES[Number(c)]).join(' ')}`
    const rows: Row[] = [['In words', words]]
    if (d && d.length <= 2) rows.push(['As a cheque amount', `${sign}${numberToWords(BigInt(i))} and ${d.padEnd(2, '0')}/100`])
    return { text: words.charAt(0).toUpperCase() + words.slice(1), rows: rows.slice(1) }
  },
}

/* ---------- Finance ---------- */
const mortgage: Spec = {
  fields: [
    { key: 'price', label: 'Home price', type: 'number', def: '350000', min: 0 },
    { key: 'down', label: 'Down payment (%)', type: 'number', def: '20', min: 0, max: 100 },
    { key: 'rate', label: 'Interest rate (% per year)', type: 'number', def: '6.5', min: 0, step: 0.01 },
    { key: 'years', label: 'Loan term (years)', type: 'number', def: '30', min: 1, max: 50 },
    { key: 'tax', label: 'Property tax (% of price per year)', type: 'number', def: '1.1', min: 0, step: 0.01 },
    { key: 'ins', label: 'Home insurance per year', type: 'number', def: '1200', min: 0 },
  ],
  run: (v) => {
    const price = num(v, 'price'), down = num(v, 'down'), rate = num(v, 'rate'), years = num(v, 'years'), tax = num(v, 'tax'), ins = num(v, 'ins')
    need(price > 0 && years > 0 && down >= 0 && down < 100, 'Enter a price above 0 and a down payment below 100%.')
    const loan = price * (1 - down / 100), n = Math.round(years * 12), i = rate / 1200
    const pi = i === 0 ? loan / n : (loan * i) / (1 - Math.pow(1 + i, -n))
    const extra = (price * tax) / 1200 + ins / 12
    return { rows: [['Loan amount', fmt(loan)], ['Monthly principal & interest', fmt(pi)], ['Monthly tax & insurance', fmt(extra)], ['Total monthly payment', fmt(pi + extra)], ['Total interest over the loan', fmt(pi * n - loan)], ['Total paid (principal + interest)', fmt(pi * n)]], note: 'Estimate only. Excludes HOA fees, PMI and closing costs.' }
  },
}
const savingsGoal: Spec = {
  fields: [
    { key: 'goal', label: 'Savings goal', type: 'number', def: '20000', min: 0 },
    { key: 'cur', label: 'Already saved', type: 'number', def: '2000', min: 0 },
    { key: 'rate', label: 'Interest rate (% per year)', type: 'number', def: '4', min: 0, step: 0.1 },
    { key: 'years', label: 'Years to reach goal', type: 'number', def: '3', min: 0.25, step: 0.25 },
  ],
  run: (v) => {
    const goal = num(v, 'goal'), cur = num(v, 'cur'), rate = num(v, 'rate'), years = num(v, 'years')
    need(goal > 0 && years > 0 && cur >= 0 && rate >= 0, 'Enter a goal and a time period above 0.')
    const n = Math.round(years * 12), i = rate / 1200
    const grown = cur * Math.pow(1 + i, n)
    const pay = i === 0 ? (goal - cur) / n : ((goal - grown) * i) / (Math.pow(1 + i, n) - 1)
    const m = Math.max(0, pay)
    return { rows: [['Save each month', fmt(m)], ['Total you contribute', fmt(m * n)], ['Interest earned', fmt(goal - cur - m * n)]], note: m === 0 ? 'Your current savings will already reach the goal.' : 'Assumes deposits at the end of each month with monthly compounding.' }
  },
}
const inflation: Spec = {
  fields: [
    { key: 'amount', label: 'Amount today', type: 'number', def: '1000', min: 0 },
    { key: 'rate', label: 'Average inflation (% per year)', type: 'number', def: '3', step: 0.1 },
    { key: 'years', label: 'Years', type: 'number', def: '10', min: 0 },
  ],
  run: (v) => {
    const a = num(v, 'amount'), r = num(v, 'rate'), y = num(v, 'years')
    need(a >= 0 && y >= 0 && r > -100, 'Enter valid values.')
    const f = Math.pow(1 + r / 100, y)
    return { rows: [[`Cost of the same things in ${sig(y)} years`, fmt(a * f)], [`Buying power of ${fmt(a)} in ${sig(y)} years`, fmt(a / f)], ['Total price increase', `${fmt((f - 1) * 100)}%`]] }
  },
}
const breakEven: Spec = {
  fields: [
    { key: 'fixed', label: 'Fixed costs', type: 'number', def: '10000', min: 0 },
    { key: 'price', label: 'Selling price per unit', type: 'number', def: '50', min: 0 },
    { key: 'var', label: 'Variable cost per unit', type: 'number', def: '30', min: 0 },
  ],
  run: (v) => {
    const fixed = num(v, 'fixed'), price = num(v, 'price'), vc = num(v, 'var')
    need(price > vc, 'The selling price must be higher than the variable cost per unit.')
    const units = fixed / (price - vc)
    return { rows: [['Contribution per unit', fmt(price - vc)], ['Break-even units', fmt(Math.ceil(units), 0)], ['Break-even revenue', fmt(Math.ceil(units) * price)], ['Contribution margin', `${fmt(((price - vc) / price) * 100)}%`]] }
  },
}
const cagr: Spec = {
  fields: [
    { key: 'start', label: 'Starting value', type: 'number', def: '10000', min: 0 },
    { key: 'end', label: 'Ending value', type: 'number', def: '18000', min: 0 },
    { key: 'years', label: 'Years', type: 'number', def: '5', min: 0 },
  ],
  run: (v) => {
    const s = num(v, 'start'), e = num(v, 'end'), y = num(v, 'years')
    need(s > 0 && e > 0 && y > 0, 'Enter starting value, ending value and years above 0.')
    return { rows: [['CAGR (per year)', `${fmt((Math.pow(e / s, 1 / y) - 1) * 100, 3)}%`], ['Total growth', `${fmt((e / s - 1) * 100)}%`], ['Absolute gain', fmt(e - s)]] }
  },
}
const retirement: Spec = {
  fields: [
    { key: 'age', label: 'Current age', type: 'number', def: '30', min: 16, max: 90 },
    { key: 'ret', label: 'Retirement age', type: 'number', def: '60', min: 17, max: 100 },
    { key: 'saved', label: 'Current savings', type: 'number', def: '25000', min: 0 },
    { key: 'monthly', label: 'Monthly contribution', type: 'number', def: '500', min: 0 },
    { key: 'rate', label: 'Expected return (% per year)', type: 'number', def: '7', min: 0, step: 0.1 },
  ],
  run: (v) => {
    const age = num(v, 'age'), ret = num(v, 'ret'), saved = num(v, 'saved'), m = num(v, 'monthly'), r = num(v, 'rate')
    need(ret > age, 'Retirement age must be above your current age.')
    const n = Math.round((ret - age) * 12), i = r / 1200
    const fv = saved * Math.pow(1 + i, n) + (i === 0 ? m * n : m * ((Math.pow(1 + i, n) - 1) / i))
    return { rows: [['Years until retirement', sig(ret - age)], ['Estimated savings at retirement', fmt(fv)], ['Total you contribute', fmt(saved + m * n)], ['Sustainable income (4% rule, per month)', fmt((fv * 0.04) / 12)]], note: 'Estimate only. Ignores inflation, taxes and market swings.' }
  },
}
const cardPayoff: Spec = {
  fields: [
    { key: 'bal', label: 'Card balance', type: 'number', def: '5000', min: 0 },
    { key: 'apr', label: 'APR (%)', type: 'number', def: '22', min: 0, step: 0.1 },
    { key: 'pay', label: 'Monthly payment', type: 'number', def: '200', min: 0 },
  ],
  run: (v) => {
    const bal = num(v, 'bal'), apr = num(v, 'apr'), pay = num(v, 'pay')
    need(bal > 0 && pay > 0, 'Enter a balance and monthly payment above 0.')
    const i = apr / 1200
    need(pay > bal * i, `Your payment must be above the monthly interest (${fmt(bal * i)}), or the balance never shrinks.`)
    const months = i === 0 ? Math.ceil(bal / pay) : Math.ceil(-Math.log(1 - (bal * i) / pay) / Math.log(1 + i))
    const total = Math.min(pay * months, pay * months)
    return { rows: [['Months to pay off', String(months)], ['Time', `${Math.floor(months / 12)} years ${months % 12} months`], ['Total interest (approx.)', fmt(Math.max(0, total - bal))], ['Total paid (approx.)', fmt(total)]], note: 'The final payment is usually smaller, so real totals are slightly lower.' }
  },
}
const fixedDeposit: Spec = {
  fields: [
    { key: 'p', label: 'Deposit amount', type: 'number', def: '10000', min: 0 },
    { key: 'rate', label: 'Interest rate (% per year)', type: 'number', def: '6.5', min: 0, step: 0.05 },
    { key: 'years', label: 'Years', type: 'number', def: '5', min: 0, step: 0.25 },
    { key: 'freq', label: 'Compounding', type: 'select', options: [['1', 'Yearly'], ['2', 'Half-yearly'], ['4', 'Quarterly'], ['12', 'Monthly']], def: '4' },
  ],
  run: (v) => {
    const p = num(v, 'p'), r = num(v, 'rate'), y = num(v, 'years'), f = Number(v.freq) || 4
    need(p > 0 && y > 0 && r >= 0, 'Enter values above 0.')
    const m = p * Math.pow(1 + r / 100 / f, f * y)
    return { rows: [['Maturity amount', fmt(m)], ['Interest earned', fmt(m - p)], ['Effective annual yield', `${fmt((Math.pow(1 + r / 100 / f, f) - 1) * 100, 3)}%`]] }
  },
}

/* ---------- Health ---------- */
const SEX: Field = { key: 'sex', label: 'Sex', type: 'select', options: [['m', 'Male'], ['f', 'Female']], def: 'm' }
const bmr: Spec = {
  fields: [SEX, { key: 'age', label: 'Age (years)', type: 'number', def: '30', min: 10, max: 100 }, { key: 'h', label: 'Height (cm)', type: 'number', def: '175', min: 80, max: 250 }, { key: 'w', label: 'Weight (kg)', type: 'number', def: '72', min: 20, max: 300 }],
  run: (v) => {
    const age = num(v, 'age'), h = num(v, 'h'), w = num(v, 'w')
    const b = 10 * w + 6.25 * h - 5 * age + (v.sex === 'f' ? -161 : 5)
    const rows: Row[] = [['BMR (Mifflin-St Jeor)', `${fmt(b, 0)} kcal/day`]]
    for (const [l, f] of [['Sedentary', 1.2], ['Lightly active', 1.375], ['Moderately active', 1.55], ['Very active', 1.725]] as [string, number][]) rows.push([`Maintenance — ${l}`, `${fmt(b * f, 0)} kcal/day`])
    return { rows, note: 'Estimate only. Not medical advice.' }
  },
}
const bodyFat: Spec = {
  fields: [SEX, { key: 'h', label: 'Height (cm)', type: 'number', def: '175', min: 100, max: 250 }, { key: 'neck', label: 'Neck (cm)', type: 'number', def: '38', min: 20 }, { key: 'waist', label: 'Waist at navel (cm)', type: 'number', def: '85', min: 40 }, { key: 'hip', label: 'Hip (cm, women only)', type: 'number', def: '95', min: 40 }],
  run: (v) => {
    const h = num(v, 'h'), neck = num(v, 'neck'), waist = num(v, 'waist'), hip = v.sex === 'f' ? num(v, 'hip') : 0
    const d = v.sex === 'f' ? waist + hip - neck : waist - neck
    need(d > 0, 'Waist (plus hip for women) must be larger than the neck measurement.')
    const bf = v.sex === 'f' ? 495 / (1.29579 - 0.35004 * Math.log10(d) + 0.221 * Math.log10(h)) - 450 : 495 / (1.0324 - 0.19077 * Math.log10(d) + 0.15456 * Math.log10(h)) - 450
    need(bf > 0 && bf < 70, 'Those measurements give an unrealistic result. Check them and try again.')
    const cat = v.sex === 'f' ? (bf < 14 ? 'Essential fat' : bf < 21 ? 'Athletic' : bf < 25 ? 'Fitness' : bf < 32 ? 'Average' : 'Obese') : (bf < 6 ? 'Essential fat' : bf < 14 ? 'Athletic' : bf < 18 ? 'Fitness' : bf < 25 ? 'Average' : 'Obese')
    return { rows: [['Estimated body fat', `${fmt(bf, 1)}%`], ['Category (ACE)', cat]], note: 'US Navy method estimate. Not a medical measurement.' }
  },
}
const idealWeight: Spec = {
  fields: [SEX, { key: 'h', label: 'Height (cm)', type: 'number', def: '175', min: 100, max: 250 }],
  run: (v) => {
    const inches = num(v, 'h') / 2.54 - 60, m = v.sex !== 'f', over = Math.max(0, inches)
    const f: [string, number][] = [['Devine', (m ? 50 : 45.5) + 2.3 * over], ['Robinson', (m ? 52 : 49) + (m ? 1.9 : 1.7) * over], ['Miller', (m ? 56.2 : 53.1) + (m ? 1.41 : 1.36) * over], ['Hamwi', (m ? 48 : 45.5) + (m ? 2.7 : 2.2) * over]]
    const avg = f.reduce((s, [, x]) => s + x, 0) / f.length
    return { rows: [...f.map(([n, x]): Row => [n, `${fmt(x, 1)} kg (${fmt(x * 2.20462, 1)} lb)`]), ['Average', `${fmt(avg, 1)} kg (${fmt(avg * 2.20462, 1)} lb)`]], note: 'Formulas are rough guides and ignore build and muscle mass.' }
  },
}
const SPLITS: Record<string, [number, number, number]> = { balanced: [40, 30, 30], lowcarb: [25, 35, 40], protein: [35, 40, 25], keto: [5, 25, 70] }
const macros: Spec = {
  fields: [{ key: 'kcal', label: 'Daily calories', type: 'number', def: '2200', min: 800 }, { key: 'plan', label: 'Diet style', type: 'select', options: [['balanced', 'Balanced (40/30/30)'], ['lowcarb', 'Lower carb (25/35/40)'], ['protein', 'High protein (35/40/25)'], ['keto', 'Keto (5/25/70)']], def: 'balanced' }],
  run: (v) => {
    const k = num(v, 'kcal'); need(k >= 800, 'Enter at least 800 calories.')
    const [c, p, f] = SPLITS[v.plan] ?? SPLITS.balanced
    return { rows: [['Carbohydrates', `${fmt((k * c) / 400, 0)} g (${c}%)`], ['Protein', `${fmt((k * p) / 400, 0)} g (${p}%)`], ['Fat', `${fmt((k * f) / 900, 0)} g (${f}%)`]], note: 'Carbs and protein = 4 kcal/g, fat = 9 kcal/g.' }
  },
}
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000)
const parseDate = (s: string) => { need(/^\d{4}-\d{2}-\d{2}$/.test(s ?? ''), 'Choose a date.'); const d = new Date(`${s}T00:00:00Z`); need(!Number.isNaN(d.getTime()), 'Choose a valid date.'); return d }
const showDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
const dueDate: Spec = {
  fields: [{ key: 'lmp', label: 'First day of last period', type: 'date', def: todayStr() }],
  run: (v) => {
    const lmp = parseDate(v.lmp), due = addDays(lmp, 280)
    const days = Math.floor((new Date(`${todayStr()}T00:00:00Z`).getTime() - lmp.getTime()) / 86400000)
    const rows: Row[] = [['Estimated due date', showDate(due)], ['End of first trimester (week 13)', showDate(addDays(lmp, 91))], ['End of second trimester (week 27)', showDate(addDays(lmp, 189))]]
    if (days >= 0 && days <= 300) rows.unshift(['Pregnancy today', `${Math.floor(days / 7)} weeks ${days % 7} days`])
    return { rows, note: 'Based on a 280-day cycle (Naegele’s rule). Your doctor’s dating is more accurate.' }
  },
}
const clockMin = (s: string) => { const m = /^(\d{1,2}):(\d{2})$/.exec((s ?? '').trim()); need(!!m && +m[1] < 24 && +m[2] < 60, 'Enter a time like 07:00 (24-hour).'); return +m![1] * 60 + +m![2] }
const hhmm = (m: number) => { const x = ((m % 1440) + 1440) % 1440; return `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}` }
const sleep: Spec = {
  fields: [{ key: 'mode', label: 'I want to…', type: 'select', options: [['wake', 'Wake up at a set time (find bedtimes)'], ['bed', 'Go to bed at a set time (find wake-up times)']], def: 'wake' }, { key: 'time', label: 'Time (24-hour, HH:MM)', type: 'text', def: '07:00' }],
  run: (v) => {
    const t = clockMin(v.time), rows: Row[] = []
    for (const c of [6, 5, 4, 3]) rows.push(v.mode === 'bed' ? [`${c} cycles (${c * 1.5} h of sleep)`, hhmm(t + 15 + c * 90)] : [`${c} cycles (${c * 1.5} h of sleep)`, hhmm(t - 15 - c * 90)])
    return { rows, note: 'Assumes 90-minute sleep cycles and about 15 minutes to fall asleep. Waking at the end of a cycle feels easier.' }
  },
}
const protein: Spec = {
  fields: [{ key: 'w', label: 'Body weight (kg)', type: 'number', def: '70', min: 20, max: 300 }, { key: 'goal', label: 'Activity / goal', type: 'select', options: [['0.8', 'Sedentary adult (0.8 g/kg)'], ['1.2', 'Active (1.2 g/kg)'], ['1.6', 'Endurance athlete (1.6 g/kg)'], ['2.0', 'Muscle gain (2.0 g/kg)']], def: '1.2' }],
  run: (v) => { const w = num(v, 'w'), g = Number(v.goal) || 1.2; return { rows: [['Daily protein', `${fmt(w * g, 0)} g`], ['Per meal (4 meals)', `${fmt((w * g) / 4, 0)} g`], ['Calories from protein', `${fmt(w * g * 4, 0)} kcal`]], note: 'General guidance only. Check with a dietitian if you have kidney or other conditions.' } },
}
const whr: Spec = {
  fields: [SEX, { key: 'waist', label: 'Waist (cm)', type: 'number', def: '82', min: 30 }, { key: 'hip', label: 'Hip (cm)', type: 'number', def: '98', min: 30 }],
  run: (v) => {
    const w = num(v, 'waist'), h = num(v, 'hip'); need(h > 0, 'Enter your hip measurement.')
    const r = w / h, hi = v.sex === 'f' ? 0.85 : 0.9
    return { rows: [['Waist-to-hip ratio', r.toFixed(2)], ['WHO health-risk threshold', `above ${hi.toFixed(2)}`], ['Result', r > hi ? 'Higher risk range' : 'Within the lower-risk range']], note: 'A screening indicator, not a diagnosis.' }
  },
}

/* ---------- Design ---------- */
const hexToRgb = (hex: string): [number, number, number] => { const m = /^#?([0-9a-f]{6})$/i.exec(hex ?? ''); need(!!m, 'Use a 6-digit hex color like #6366f1.'); const n = parseInt(m![1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255] }
const toHex = (r: number, g: number, b: number) => '#' + [r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('')
const toHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255; g /= 255; b /= 255
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn
  if (d === 0) return [0, 0, l * 100]
  const s = d / (1 - Math.abs(2 * l - 1))
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [(h * 60 + 360) % 360, s * 100, l * 100]
}
const fromHsl = (h: number, s: number, l: number) => {
  s /= 100; l /= 100
  const k = (n: number) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return toHex(f(0) * 255, f(8) * 255, f(4) * 255)
}
const shades: Spec = {
  fields: [{ key: 'c', label: 'Base color', type: 'color', def: '#6366f1' }],
  run: (v) => {
    const [h, s] = toHsl(...hexToRgb(v.c))
    return { rows: [95, 85, 75, 65, 55, 45, 35, 25, 15, 8].map((l, i): Row => { const x = fromHsl(h, s, l); return [`${(i + 1) * 100 - (i === 0 ? 50 : 0)}`, x, x] }), note: 'A 10-step tint-to-shade scale you can use as design tokens.' }
  },
}
const clampN = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x))
const glass: Spec = {
  fields: [
    { key: 'blur', label: 'Blur (px)', type: 'range', min: 0, max: 40, step: 1, def: '14' },
    { key: 'alpha', label: 'Background opacity (%)', type: 'range', min: 0, max: 100, step: 1, def: '25' },
    { key: 'color', label: 'Glass color', type: 'color', def: '#ffffff' },
    { key: 'radius', label: 'Corner radius (px)', type: 'range', min: 0, max: 60, step: 1, def: '18' },
  ],
  run: (v) => {
    const [r, g, b] = hexToRgb(v.color), blur = clampN(num(v, 'blur'), 0, 40), a = clampN(num(v, 'alpha'), 0, 100) / 100, rad = clampN(num(v, 'radius'), 0, 60)
    const css = `background: rgba(${r}, ${g}, ${b}, ${a});\nborder-radius: ${rad}px;\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(${r}, ${g}, ${b}, ${Math.min(1, a + 0.15).toFixed(2)});\nbox-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);`
    const html = `<div style="padding:28px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#ec4899 55%,#f59e0b)"><div style="padding:22px;color:#111;font-weight:700;background:rgba(${r},${g},${b},${a});border-radius:${rad}px;backdrop-filter:blur(${blur}px);-webkit-backdrop-filter:blur(${blur}px);border:1px solid rgba(${r},${g},${b},${Math.min(1, a + 0.15).toFixed(2)})">Glassmorphism preview</div></div>`
    return { text: css, html }
  },
}
const borderRadius: Spec = {
  fields: [
    { key: 'tl', label: 'Top-left (px)', type: 'number', def: '24', min: 0 }, { key: 'tr', label: 'Top-right (px)', type: 'number', def: '24', min: 0 },
    { key: 'br', label: 'Bottom-right (px)', type: 'number', def: '24', min: 0 }, { key: 'bl', label: 'Bottom-left (px)', type: 'number', def: '24', min: 0 },
  ],
  run: (v) => {
    const [a, b, c, d] = ['tl', 'tr', 'br', 'bl'].map((k) => clampN(num(v, k), 0, 500))
    const css = `border-radius: ${a}px ${b}px ${c}px ${d}px;`
    return { text: css, html: `<div style="height:120px;margin:4px;background:linear-gradient(135deg,#6366f1,#a855f7);border-radius:${a}px ${b}px ${c}px ${d}px"></div>` }
  },
}
const textShadow: Spec = {
  fields: [
    { key: 'x', label: 'Horizontal offset (px)', type: 'range', min: -30, max: 30, def: '3' }, { key: 'y', label: 'Vertical offset (px)', type: 'range', min: -30, max: 30, def: '3' },
    { key: 'blur', label: 'Blur (px)', type: 'range', min: 0, max: 40, def: '6' }, { key: 'color', label: 'Shadow color', type: 'color', def: '#6366f1' },
    { key: 'alpha', label: 'Opacity (%)', type: 'range', min: 0, max: 100, def: '60' },
  ],
  run: (v) => {
    const [r, g, b] = hexToRgb(v.color), x = clampN(num(v, 'x'), -50, 50), y = clampN(num(v, 'y'), -50, 50), bl = clampN(num(v, 'blur'), 0, 60), a = clampN(num(v, 'alpha'), 0, 100) / 100
    const css = `text-shadow: ${x}px ${y}px ${bl}px rgba(${r}, ${g}, ${b}, ${a});`
    return { text: css, html: `<div style="padding:22px;font-size:44px;font-weight:800;text-align:center;text-shadow:${x}px ${y}px ${bl}px rgba(${r},${g},${b},${a})">Text shadow</div>` }
  },
}
const clampGen: Spec = {
  fields: [
    { key: 'min', label: 'Minimum size (px)', type: 'number', def: '16', min: 1 }, { key: 'max', label: 'Maximum size (px)', type: 'number', def: '32', min: 1 },
    { key: 'vmin', label: 'Min viewport width (px)', type: 'number', def: '375', min: 1 }, { key: 'vmax', label: 'Max viewport width (px)', type: 'number', def: '1280', min: 1 },
  ],
  run: (v) => {
    const mn = num(v, 'min'), mx = num(v, 'max'), a = num(v, 'vmin'), b = num(v, 'vmax')
    need(b > a, 'Max viewport must be larger than min viewport.'); need(mx >= mn, 'Maximum must be at least the minimum.')
    const slope = (mx - mn) / (b - a), base = mn - slope * a, r = (n: number) => Number((n / 16).toFixed(4))
    const css = `font-size: clamp(${r(mn)}rem, ${r(base)}rem + ${Number((slope * 100).toFixed(4))}vw, ${r(mx)}rem);`
    return { text: css, note: 'Fluid size scales smoothly between the two viewport widths (1rem = 16px).' }
  },
}
const rgbHex: Spec = {
  fields: [{ key: 'r', label: 'Red (0–255)', type: 'number', def: '99', min: 0, max: 255 }, { key: 'g', label: 'Green (0–255)', type: 'number', def: '102', min: 0, max: 255 }, { key: 'b', label: 'Blue (0–255)', type: 'number', def: '241', min: 0, max: 255 }],
  run: (v) => {
    const [r, g, b] = ['r', 'g', 'b'].map((k) => Math.round(num(v, k)))
    need([r, g, b].every((x) => x >= 0 && x <= 255), 'Each channel must be between 0 and 255.')
    const hex = toHex(r, g, b), [h, s, l] = toHsl(r, g, b)
    return { rows: [['HEX', hex, hex], ['RGB', `rgb(${r}, ${g}, ${b})`], ['HSL', `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`]] }
  },
}

export const specs2: Record<string, Spec> = {
  'length-converter': length, 'weight-converter': weight, 'temperature-converter': temperature, 'area-converter': area, 'volume-converter': volume, 'speed-converter': speed,
  'data-storage-converter': dataStorage, 'pressure-converter': pressure, 'energy-converter': energy, 'angle-converter': angle, 'fuel-economy-converter': fuelEconomy, 'power-converter': power, 'number-to-words': numberWords,
  'mortgage-calculator': mortgage, 'savings-goal-calculator': savingsGoal, 'inflation-calculator': inflation, 'break-even-calculator': breakEven, 'cagr-calculator': cagr, 'retirement-calculator': retirement, 'credit-card-payoff-calculator': cardPayoff, 'fixed-deposit-calculator': fixedDeposit,
  'bmr-calculator': bmr, 'body-fat-calculator': bodyFat, 'ideal-weight-calculator': idealWeight, 'macro-calculator': macros, 'due-date-calculator': dueDate, 'sleep-calculator': sleep, 'protein-intake-calculator': protein, 'waist-hip-ratio-calculator': whr,
  'color-shades-generator': shades, 'glassmorphism-generator': glass, 'border-radius-generator': borderRadius, 'text-shadow-generator': textShadow, 'css-clamp-generator': clampGen, 'rgb-to-hex-converter': rgbHex,
}
export { parseDate, showDate, clockMin, hhmm, todayStr, addDays, need, sig }
