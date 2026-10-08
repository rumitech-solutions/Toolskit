// Declarative definitions for the extra tools: fields + a pure run() function.
// ExtraToolPanel renders them; tests call run() directly.
import { qrMatrix, qrSvg, type EcLevel } from './qr'

export type Values = Record<string, string>
export type Row = [label: string, value: string, swatch?: string]
export type Result = string | { rows?: Row[]; text?: string; note?: string; previewCss?: string; html?: string; svg?: string }
export interface Field {
  key: string
  label: string
  type?: 'text' | 'number' | 'textarea' | 'select' | 'file' | 'color' | 'range' | 'datetime' | 'date' | 'password'
  options?: (string | [string, string])[]
  def?: string
  min?: number
  max?: number
  step?: number
  placeholder?: string
  accept?: string
}
export interface Spec {
  fields: Field[]
  run: (v: Values, files: File[]) => Result | Promise<Result>
  manual?: boolean
  runLabel?: string
  empty?: string
}

export const num = (v: Values, k: string): number => {
  const raw = (v[k] ?? '').trim()
  const n = Number(raw)
  if (raw === '' || !Number.isFinite(n)) throw new Error(`Enter a valid number for "${k}".`)
  return n
}
export const fmt = (n: number, d = 2) => (Number.isFinite(n) ? n.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d }) : '—')
const need = (cond: boolean, msg: string) => { if (!cond) throw new Error(msg) }
const words = (t: string) => t.trim().match(/[\p{L}\p{N}'’-]+/gu) ?? []
const rand = (n: number) => { const b = new Uint32Array(1); const lim = Math.floor(0x100000000 / n) * n; do crypto.getRandomValues(b); while (b[0] >= lim); return b[0] % n }

/* ---------- Finance & business ---------- */
const gst: Spec = {
  fields: [
    { key: 'amount', label: 'Amount', type: 'number', def: '1000', min: 0 },
    { key: 'rate', label: 'Tax rate (%)', type: 'number', def: '18', min: 0, max: 100, step: 0.1 },
    { key: 'mode', label: 'Calculation', type: 'select', options: [['add', 'Add tax to amount'], ['remove', 'Amount already includes tax']] },
  ],
  run: (v) => {
    const a = num(v, 'amount'), r = num(v, 'rate')
    need(a >= 0 && r >= 0, 'Amount and rate must be zero or more.')
    const net = v.mode === 'remove' ? a / (1 + r / 100) : a
    const tax = net * (r / 100)
    return { rows: [['Net amount (before tax)', fmt(net)], [`Tax (${fmt(r, 2)}%)`, fmt(tax)], ['Gross total (with tax)', fmt(net + tax)]] }
  },
}
const margin: Spec = {
  fields: [
    { key: 'cost', label: 'Cost per unit', type: 'number', def: '60', min: 0 },
    { key: 'price', label: 'Selling price', type: 'number', def: '100', min: 0 },
    { key: 'target', label: 'Target margin % (optional)', type: 'number', placeholder: 'e.g. 40' },
  ],
  run: (v) => {
    const cost = num(v, 'cost'), price = num(v, 'price')
    need(cost >= 0 && price > 0, 'Cost must be 0 or more and the selling price above 0.')
    const profit = price - cost
    const rows: Row[] = [['Profit per unit', fmt(profit)], ['Profit margin', `${fmt((profit / price) * 100)}%`], ['Markup on cost', cost > 0 ? `${fmt((profit / cost) * 100)}%` : '—']]
    if ((v.target ?? '').trim() !== '') {
      const t = num(v, 'target')
      need(t < 100, 'Target margin must be below 100%.')
      rows.push([`Price needed for ${fmt(t, 1)}% margin`, fmt(cost / (1 - t / 100))])
    }
    return { rows }
  },
}
const roi: Spec = {
  fields: [
    { key: 'invested', label: 'Amount invested', type: 'number', def: '10000', min: 0 },
    { key: 'final', label: 'Final value', type: 'number', def: '15000', min: 0 },
    { key: 'years', label: 'Years held', type: 'number', def: '3', min: 0.1, step: 0.1 },
  ],
  run: (v) => {
    const i = num(v, 'invested'), f = num(v, 'final'), y = num(v, 'years')
    need(i > 0 && y > 0 && f >= 0, 'Invested amount and years must be above 0.')
    return { rows: [['Net gain / loss', fmt(f - i)], ['Total ROI', `${fmt(((f - i) / i) * 100)}%`], ['Annualized return (CAGR)', f > 0 ? `${fmt((Math.pow(f / i, 1 / y) - 1) * 100)}% per year` : '−100%']] }
  },
}
const sip: Spec = {
  fields: [
    { key: 'monthly', label: 'Monthly investment', type: 'number', def: '500', min: 0 },
    { key: 'rate', label: 'Expected annual return (%)', type: 'number', def: '12', min: 0, max: 60, step: 0.1 },
    { key: 'years', label: 'Years', type: 'number', def: '10', min: 1, max: 60 },
  ],
  run: (v) => {
    const p = num(v, 'monthly'), r = num(v, 'rate'), y = num(v, 'years')
    need(p >= 0 && r >= 0 && y > 0, 'Enter positive values.')
    const n = Math.round(y * 12), i = r / 12 / 100
    const total = i === 0 ? p * n : p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i)
    return { rows: [['Total invested', fmt(p * n)], ['Estimated returns', fmt(total - p * n)], ['Estimated total value', fmt(total)]], note: 'Illustration only. Real returns vary and are not guaranteed. Assumes a constant return and investment at the start of each month.' }
  },
}
const FACTOR: Record<string, (hpw: number, wpy: number) => number> = { hour: () => 1, day: (h) => h / 5, week: (h) => h, month: (h, w) => (h * w) / 12, year: (h, w) => h * w }
const salary: Spec = {
  fields: [
    { key: 'amount', label: 'Pay amount', type: 'number', def: '25', min: 0 },
    { key: 'unit', label: 'Per', type: 'select', options: [['hour', 'Hour'], ['day', 'Day'], ['week', 'Week'], ['month', 'Month'], ['year', 'Year']] },
    { key: 'hpw', label: 'Hours per week', type: 'number', def: '40', min: 1, max: 100 },
    { key: 'wpy', label: 'Weeks per year', type: 'number', def: '52', min: 1, max: 52 },
  ],
  run: (v) => {
    const a = num(v, 'amount'), h = num(v, 'hpw'), w = num(v, 'wpy')
    need(a >= 0 && h > 0 && w > 0, 'Enter positive values.')
    const hourly = a / FACTOR[v.unit || 'hour'](h, w)
    return { rows: (['hour', 'day', 'week', 'month', 'year'] as const).map((u): Row => [`Per ${u}`, fmt(hourly * FACTOR[u](h, w))]) }
  },
}

/* ---------- Health & fitness ---------- */
const ACTIVITY: [string, string, number][] = [['1.2', 'Sedentary (little or no exercise)', 1.2], ['1.375', 'Light (1–3 days/week)', 1.375], ['1.55', 'Moderate (3–5 days/week)', 1.55], ['1.725', 'Very active (6–7 days/week)', 1.725], ['1.9', 'Extra active (physical job + training)', 1.9]]
const calorie: Spec = {
  fields: [
    { key: 'sex', label: 'Sex', type: 'select', options: [['male', 'Male'], ['female', 'Female']] },
    { key: 'age', label: 'Age (years)', type: 'number', def: '30', min: 15, max: 100 },
    { key: 'height', label: 'Height (cm)', type: 'number', def: '175', min: 100, max: 250 },
    { key: 'weight', label: 'Weight (kg)', type: 'number', def: '70', min: 30, max: 300 },
    { key: 'activity', label: 'Activity level', type: 'select', options: ACTIVITY.map(([k, l]) => [k, l] as [string, string]), def: '1.375' },
  ],
  run: (v) => {
    const age = num(v, 'age'), h = num(v, 'height'), w = num(v, 'weight')
    need(age >= 15 && age <= 100 && h >= 100 && h <= 250 && w >= 30 && w <= 300, 'Enter realistic values (age 15–100, height 100–250 cm, weight 30–300 kg).')
    const bmr = 10 * w + 6.25 * h - 5 * age + (v.sex === 'female' ? -161 : 5)
    const tdee = bmr * Number(v.activity || 1.375)
    return { rows: [['Basal metabolic rate (BMR)', `${fmt(bmr, 0)} kcal/day`], ['Maintenance calories (TDEE)', `${fmt(tdee, 0)} kcal/day`], ['Gentle deficit (−250)', `${fmt(tdee - 250, 0)} kcal/day`], ['Gentle surplus (+250)', `${fmt(tdee + 250, 0)} kcal/day`]], note: 'Mifflin–St Jeor estimate for adults. Individual needs vary; this is not medical advice. Talk to a doctor or registered dietitian before making big diet changes.' }
  },
}
const water: Spec = {
  fields: [
    { key: 'weight', label: 'Weight (kg)', type: 'number', def: '70', min: 20, max: 300 },
    { key: 'exercise', label: 'Exercise (minutes per day)', type: 'number', def: '30', min: 0, max: 600 },
    { key: 'climate', label: 'Climate', type: 'select', options: [['mild', 'Mild / indoors'], ['hot', 'Hot or humid']] },
  ],
  run: (v) => {
    const w = num(v, 'weight'), e = num(v, 'exercise')
    need(w >= 20 && e >= 0, 'Enter a realistic weight and exercise time.')
    const litres = w * 0.033 + (e / 30) * 0.35 + (v.climate === 'hot' ? 0.5 : 0)
    return { rows: [['Estimated daily water', `${fmt(litres)} L`], ['In glasses (250 ml)', fmt((litres * 1000) / 250, 1)], ['In US fl oz', fmt(litres * 33.814, 0)]], note: 'A general estimate that includes water from food and drinks. Needs vary with health, pregnancy and medication; follow your doctor’s advice.' }
  },
}
const hhmmss = (sec: number) => { const s = Math.round(sec); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return `${h ? h + ':' : ''}${String(m).padStart(h ? 2 : 1, '0')}:${String(s % 60).padStart(2, '0')}` }
const pace: Spec = {
  fields: [
    { key: 'dist', label: 'Distance', type: 'number', def: '5', min: 0.01, step: 0.01 },
    { key: 'unit', label: 'Unit', type: 'select', options: [['km', 'Kilometres'], ['mi', 'Miles']] },
    { key: 'h', label: 'Hours', type: 'number', def: '0', min: 0 },
    { key: 'm', label: 'Minutes', type: 'number', def: '25', min: 0 },
    { key: 's', label: 'Seconds', type: 'number', def: '0', min: 0 },
  ],
  run: (v) => {
    const d = num(v, 'dist'), t = num(v, 'h') * 3600 + num(v, 'm') * 60 + num(v, 's')
    need(d > 0 && t > 0, 'Enter a distance and a time above zero.')
    const km = v.unit === 'mi' ? d * 1.609344 : d
    const perKm = t / km
    const rows: Row[] = [['Pace per km', hhmmss(perKm)], ['Pace per mile', hhmmss(perKm * 1.609344)], ['Speed', `${fmt((km / t) * 3600)} km/h (${fmt((km / t) * 3600 / 1.609344)} mph)`]]
    for (const [name, k] of [['5K', 5], ['10K', 10], ['Half marathon', 21.0975], ['Marathon', 42.195]] as const) rows.push([`${name} at this pace`, hhmmss(perKm * k)])
    return { rows }
  },
}
const zones: Spec = {
  fields: [
    { key: 'age', label: 'Age (years)', type: 'number', def: '35', min: 10, max: 100 },
    { key: 'rest', label: 'Resting heart rate (optional)', type: 'number', placeholder: 'e.g. 60' },
  ],
  run: (v) => {
    const age = num(v, 'age')
    need(age >= 10 && age <= 100, 'Enter an age between 10 and 100.')
    const max = Math.round(208 - 0.7 * age)
    const rest = (v.rest ?? '').trim() === '' ? null : num(v, 'rest')
    need(rest === null || (rest > 25 && rest < max), 'Resting heart rate looks unrealistic.')
    const at = (p: number) => Math.round(rest === null ? max * p : rest + (max - rest) * p)
    const rows: Row[] = [['Estimated max heart rate', `${max} bpm`]]
    for (const [name, a, b] of [['Zone 1 · Very light', 0.5, 0.6], ['Zone 2 · Light (fat burn / base)', 0.6, 0.7], ['Zone 3 · Moderate (aerobic)', 0.7, 0.8], ['Zone 4 · Hard (threshold)', 0.8, 0.9], ['Zone 5 · Maximum', 0.9, 1]] as const) rows.push([name, `${at(a)}–${at(b)} bpm`])
    return { rows, note: `Max heart rate estimated with the Tanaka formula (208 − 0.7 × age)${rest === null ? '' : '; zones use the Karvonen method with your resting rate'}. Individuals differ — consult a doctor before intense training.` }
  },
}

/* ---------- Design & color ---------- */
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))
const hexRgb = (hex: string): [number, number, number] => {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) throw new Error('Enter a valid hex color such as #6366f1.')
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1]
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}
const rgbHex = (r: number, g: number, b: number) => '#' + [r, g, b].map((x) => clamp(Math.round(x), 0, 255).toString(16).padStart(2, '0')).join('')
const rgbHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255; g /= 255; b /= 255
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn
  if (!d) return [0, 0, l * 100]
  const s = d / (1 - Math.abs(2 * l - 1))
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [(h * 60 + 360) % 360, s * 100, l * 100]
}
const hslHex = (h: number, s: number, l: number) => {
  h = ((h % 360) + 360) % 360; s = clamp(s, 0, 100) / 100; l = clamp(l, 0, 100) / 100
  const k = (n: number) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return rgbHex(f(0) * 255, f(8) * 255, f(4) * 255)
}
const SCHEMES: Record<string, [string, number][]> = {
  complementary: [['Base', 0], ['Complementary', 180]],
  analogous: [['Analogous −30°', -30], ['Base', 0], ['Analogous +30°', 30]],
  triadic: [['Base', 0], ['Triadic +120°', 120], ['Triadic +240°', 240]],
  tetradic: [['Base', 0], ['Tetradic +90°', 90], ['Tetradic +180°', 180], ['Tetradic +270°', 270]],
  split: [['Base', 0], ['Split +150°', 150], ['Split +210°', 210]],
}
const palette: Spec = {
  fields: [
    { key: 'color', label: 'Base color', type: 'color', def: '#6366f1' },
    { key: 'scheme', label: 'Color harmony', type: 'select', options: [['complementary', 'Complementary'], ['analogous', 'Analogous'], ['triadic', 'Triadic'], ['tetradic', 'Tetradic (square)'], ['split', 'Split-complementary'], ['mono', 'Monochromatic shades']] },
  ],
  run: (v) => {
    const [r, g, b] = hexRgb(v.color || '#6366f1')
    const [h, s, l] = rgbHsl(r, g, b)
    const rows: Row[] = []
    if (v.scheme === 'mono') for (const L of [15, 30, 45, 60, 75, 90]) { const x = hslHex(h, s, L); rows.push([`Lightness ${L}%`, x, x]) }
    else for (const [name, off] of SCHEMES[v.scheme || 'complementary']) { const x = off === 0 ? rgbHex(r, g, b) : hslHex(h + off, s, l); rows.push([name, x, x]) }
    return { rows, note: `Base color: hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%). Click Copy to copy any hex value.` }
  },
}
const gradient: Spec = {
  fields: [
    { key: 'type', label: 'Type', type: 'select', options: [['linear', 'Linear'], ['radial', 'Radial'], ['conic', 'Conic']] },
    { key: 'angle', label: 'Angle (degrees)', type: 'range', def: '135', min: 0, max: 360 },
    { key: 'stops', label: 'Color stops', type: 'select', options: [['2', '2 colors'], ['3', '3 colors']] },
    { key: 'c1', label: 'Color 1', type: 'color', def: '#6366f1' },
    { key: 'c2', label: 'Color 2', type: 'color', def: '#d946ef' },
    { key: 'c3', label: 'Color 3', type: 'color', def: '#f97316' },
  ],
  run: (v) => {
    const cols = [v.c1, v.c2, ...(v.stops === '3' ? [v.c3] : [])].map((c) => rgbHex(...hexRgb(c || '#000000')))
    const a = clamp(Number(v.angle) || 0, 0, 360)
    const g = v.type === 'radial' ? `radial-gradient(circle, ${cols.join(', ')})` : v.type === 'conic' ? `conic-gradient(from ${a}deg, ${cols.join(', ')})` : `linear-gradient(${a}deg, ${cols.join(', ')})`
    return { text: `background: ${g};`, previewCss: `background:${g}`, note: 'Paste into any CSS rule. Works in all modern browsers.' }
  },
}
const shadow: Spec = {
  fields: [
    { key: 'x', label: 'Horizontal offset (px)', type: 'range', def: '0', min: -50, max: 50 },
    { key: 'y', label: 'Vertical offset (px)', type: 'range', def: '10', min: -50, max: 50 },
    { key: 'blur', label: 'Blur radius (px)', type: 'range', def: '30', min: 0, max: 100 },
    { key: 'spread', label: 'Spread (px)', type: 'range', def: '-5', min: -50, max: 50 },
    { key: 'opacity', label: 'Opacity (%)', type: 'range', def: '25', min: 0, max: 100 },
    { key: 'color', label: 'Shadow color', type: 'color', def: '#000000' },
    { key: 'inset', label: 'Style', type: 'select', options: [['', 'Outer shadow'], ['inset ', 'Inner (inset) shadow']] },
  ],
  run: (v) => {
    const [r, g, b] = hexRgb(v.color || '#000000')
    const css = `box-shadow: ${v.inset ?? ''}${Number(v.x)}px ${Number(v.y)}px ${Number(v.blur)}px ${Number(v.spread)}px rgba(${r}, ${g}, ${b}, ${fmt(clamp(Number(v.opacity), 0, 100) / 100, 2)});`
    return { text: css, previewCss: css.replace(/;$/, '') }
  },
}
const pxRem: Spec = {
  fields: [
    { key: 'value', label: 'Value', type: 'number', def: '24', step: 0.01 },
    { key: 'dir', label: 'Convert', type: 'select', options: [['px2rem', 'px → rem'], ['rem2px', 'rem → px']] },
    { key: 'base', label: 'Base font size (px)', type: 'number', def: '16', min: 1, max: 100 },
  ],
  run: (v) => {
    const x = num(v, 'value'), base = num(v, 'base')
    need(base > 0, 'Base font size must be above 0.')
    const rows: Row[] = [[v.dir === 'rem2px' ? `${fmt(x, 4)} rem` : `${fmt(x, 4)} px`, v.dir === 'rem2px' ? `${+(x * base).toFixed(4)}px` : `${+(x / base).toFixed(4)}rem`]]
    for (const px of [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64]) rows.push([`${px}px`, `${+(px / base).toFixed(4)}rem`])
    return { rows }
  },
}
const imageB64: Spec = {
  fields: [{ key: 'file', label: 'Choose an image (processed locally, never uploaded)', type: 'file', accept: 'image/*' }],
  empty: 'Choose an image to get its Base64 data URI.',
  run: async (_v, files) => {
    const f = files[0]
    if (!f) return ''
    need(f.type.startsWith('image/'), 'Please choose an image file.')
    need(f.size <= 5 * 1024 * 1024, 'Please choose an image under 5 MB.')
    const uri = await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(new Error('Could not read that file.')); r.readAsDataURL(f) })
    return { text: uri, note: `${f.name}: ${fmt(f.size / 1024, 1)} KB → ${fmt(uri.length / 1024, 1)} KB of text. Use it as <img src="…"> or CSS url("…").` }
  },
}

/* ---------- Writing & social ---------- */
const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', a = 'abcdefghijklmnopqrstuvwxyz', D = '0123456789'
const cp = (n: number) => String.fromCodePoint(n)
const block = (up: number, lo: number, dig?: number, holes: Record<string, number> = {}) => (t: string) =>
  [...t].map((ch) => {
    if (holes[ch]) return cp(holes[ch])
    const i = A.indexOf(ch); if (i >= 0) return cp(up + i)
    const j = a.indexOf(ch); if (j >= 0) return cp(lo + j)
    const k = D.indexOf(ch); if (k >= 0 && dig !== undefined) return cp(dig + k)
    return ch
  }).join('')
const SMALLCAPS: Record<string, string> = { a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ' }
const FLIP: Record<string, string> = { a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', m: 'ɯ', n: 'u', p: 'd', q: 'b', r: 'ɹ', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', y: 'ʎ', '.': '˙', ',': "'", '?': '¿', '!': '¡', '6': '9', '9': '6', '(': ')', ')': '(' }
const circled = (t: string) => [...t].map((ch) => { const i = A.indexOf(ch); if (i >= 0) return cp(0x24b6 + i); const j = a.indexOf(ch); if (j >= 0) return cp(0x24d0 + j); const k = D.indexOf(ch); return k < 0 ? ch : k === 0 ? cp(0x24ea) : cp(0x2460 + k - 1) }).join('')
export const FANCY: [string, (t: string) => string][] = [
  ['Bold', block(0x1d400, 0x1d41a, 0x1d7ce)], ['Italic', block(0x1d434, 0x1d44e, undefined, { h: 0x210e })], ['Bold italic', block(0x1d468, 0x1d482)],
  ['Script', block(0x1d49c, 0x1d4b6, undefined, { B: 0x212c, E: 0x2130, F: 0x2131, H: 0x210b, I: 0x2110, L: 0x2112, M: 0x2133, R: 0x211b, e: 0x212f, g: 0x210a, o: 0x2134 })],
  ['Bold script', block(0x1d4d0, 0x1d4ea)], ['Fraktur', block(0x1d504, 0x1d51e, undefined, { C: 0x212d, H: 0x210c, I: 0x2111, R: 0x211c, Z: 0x2128 })], ['Bold fraktur', block(0x1d56c, 0x1d586)],
  ['Double-struck', block(0x1d538, 0x1d552, 0x1d7d8, { C: 0x2102, H: 0x210d, N: 0x2115, P: 0x2119, Q: 0x211a, R: 0x211d, Z: 0x2124 })],
  ['Sans-serif', block(0x1d5a0, 0x1d5ba, 0x1d7e2)], ['Sans-serif bold', block(0x1d5d4, 0x1d5ee, 0x1d7ec)], ['Sans-serif italic', block(0x1d608, 0x1d622)], ['Monospace', block(0x1d670, 0x1d68a, 0x1d7f6)],
  ['Circled', circled], ['Small caps', (t) => [...t].map((c) => SMALLCAPS[c.toLowerCase()] ?? c).join('')],
  ['Upside down', (t) => [...t.toLowerCase()].map((c) => FLIP[c] ?? c).reverse().join('')],
  ['Full-width', (t) => [...t].map((c) => (c === ' ' ? '　' : c >= '!' && c <= '~' ? cp(c.charCodeAt(0) + 0xfee0) : c)).join('')],
  ['Strikethrough', (t) => [...t].map((c) => (c === ' ' ? c : c + '̶')).join('')], ['Underline', (t) => [...t].map((c) => (c === ' ' ? c : c + '̲')).join('')],
]
const fancy: Spec = {
  fields: [{ key: 'text', label: 'Your text', type: 'text', def: 'ToolsKit', placeholder: 'Type your name, bio or caption…' }],
  empty: 'Type some text to see stylish Unicode versions.',
  run: (v) => ((v.text ?? '').trim() ? { rows: FANCY.map(([n, f]): Row => [n, f(v.text)]), note: 'Copy and paste into Instagram, X, TikTok, Discord or anywhere that accepts Unicode text. Some apps or screen readers may not display or read these styles correctly.' } : ''),
}
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
const bionic: Spec = {
  fields: [
    { key: 'text', label: 'Text to convert', type: 'textarea', def: 'Bionic reading bolds the first part of every word so your eyes can glide through text faster.' },
    { key: 'strength', label: 'Bold strength', type: 'select', options: [['0.35', 'Light'], ['0.5', 'Medium'], ['0.7', 'Strong']], def: '0.5' },
  ],
  empty: 'Paste some text to convert it.',
  run: (v) => {
    const s = Number(v.strength) || 0.5
    const parts = (v.text ?? '').split(/([\p{L}\p{N}]+)/gu)
    const cut = (w: string) => { const chars = [...w]; const n = chars.length === 1 ? 1 : Math.max(1, Math.round(chars.length * s)); return [chars.slice(0, n).join(''), chars.slice(n).join('')] }
    let md = '', html = ''
    for (const p of parts) {
      if (/^[\p{L}\p{N}]+$/u.test(p)) { const [x, y] = cut(p); md += `**${x}**${y}`; html += `<b>${esc(x)}</b>${esc(y)}` } else { md += p; html += esc(p) }
    }
    return (v.text ?? '').trim() ? { html: html.replace(/\n/g, '<br>'), text: md, note: 'Copy the Markdown version into editors that support bold (Notion, Obsidian, Reddit, docs).' } : ''
  },
}
const mmss = (min: number) => { const s = Math.round(min * 60); return s >= 60 ? `${Math.floor(s / 60)} min ${s % 60} sec` : `${s} sec` }
const readingTime: Spec = {
  fields: [{ key: 'text', label: 'Paste your text', type: 'textarea', placeholder: 'Paste an article, essay or script…' }],
  empty: 'Paste text to estimate reading and speaking time.',
  run: (v) => {
    const w = words(v.text ?? '').length
    if (!w) return ''
    const sentences = (v.text.match(/[^.!?]+[.!?]*/g) ?? []).filter((s) => s.trim()).length
    return { rows: [['Words', fmt(w, 0)], ['Characters (with spaces)', fmt(v.text.length, 0)], ['Sentences', fmt(sentences, 0)], ['Average reading time (238 wpm)', mmss(w / 238)], ['Slow reader (150 wpm)', mmss(w / 150)], ['Fast reader (300 wpm)', mmss(w / 300)], ['Speaking time (130 wpm)', mmss(w / 130)]] }
  },
}
const syllables = (word: string) => {
  let w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return 0
  if (w.length <= 3) return 1
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '')
  return Math.max(1, (w.match(/[aeiouy]{1,2}/g) ?? []).length)
}
export const readability = (text: string) => {
  const ws = words(text).filter((w) => /[a-z]/i.test(w))
  const sents = Math.max(1, (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? []).filter((s) => /\w/.test(s)).length)
  if (!ws.length) return null
  const syl = ws.reduce((s, w) => s + syllables(w), 0)
  const ease = 206.835 - 1.015 * (ws.length / sents) - 84.6 * (syl / ws.length)
  const grade = 0.39 * (ws.length / sents) + 11.8 * (syl / ws.length) - 15.59
  return { words: ws.length, sentences: sents, syllables: syl, ease, grade }
}
const easeLabel = (e: number) => (e >= 90 ? 'Very easy (≈ 5th grade)' : e >= 80 ? 'Easy (6th grade)' : e >= 70 ? 'Fairly easy (7th grade)' : e >= 60 ? 'Plain English (8th–9th grade)' : e >= 50 ? 'Fairly difficult (10th–12th grade)' : e >= 30 ? 'Difficult (college)' : 'Very difficult (graduate)')
const readabilitySpec: Spec = {
  fields: [{ key: 'text', label: 'Paste your English text', type: 'textarea', placeholder: 'Paste at least a few sentences…' }],
  empty: 'Paste English text to get Flesch reading-ease and grade-level scores.',
  run: (v) => {
    const r = readability(v.text ?? '')
    if (!r) return ''
    return { rows: [['Flesch reading ease', `${fmt(clamp(r.ease, 0, 120), 1)} — ${easeLabel(r.ease)}`], ['Flesch–Kincaid grade level', fmt(Math.max(0, r.grade), 1)], ['Words', fmt(r.words, 0)], ['Sentences', fmt(r.sentences, 0)], ['Average words per sentence', fmt(r.words / r.sentences, 1)], ['Average syllables per word', fmt(r.syllables / r.words, 2)]], note: 'Designed for English. Syllables are estimated, so treat scores as a guide.' }
  },
}
const STOP = new Set('the and for are but not you all can had her was one our out has his how its may new now old see two way who did get let put say she too use that with have this will your from they know want been good much some time very when come here just like long make many over such take than them well were what into only also about after again because could would should their there these those which while where being other still then both each more most must even does done doing'.split(' '))
const keywords: Spec = {
  fields: [{ key: 'text', label: 'Paste your content', type: 'textarea', placeholder: 'Paste an article or page copy…' }],
  empty: 'Paste content to see its most-used keywords and phrases.',
  run: (v) => {
    const ws = words(v.text ?? '').map((w) => w.toLowerCase().replace(/^['’-]+|['’-]+$/g, '')).filter(Boolean)
    if (!ws.length) return ''
    const count = (list: string[]) => { const m = new Map<string, number>(); list.forEach((x) => m.set(x, (m.get(x) ?? 0) + 1)); return [...m.entries()].sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0])) }
    const singles = count(ws.filter((w) => w.length >= 3 && !STOP.has(w) && !/^\d+$/.test(w))).slice(0, 15)
    const pairs = count(ws.slice(1).map((w, i) => [ws[i], w]).filter(([x, y]) => !STOP.has(x) && !STOP.has(y) && x.length > 2 && y.length > 2).map(([x, y]) => `${x} ${y}`)).filter(([, c]) => c >= 2).slice(0, 8)
    const rows: Row[] = [['Total words', fmt(ws.length, 0)], ...singles.map(([w, c]): Row => [w, `${c}× · ${fmt((c / ws.length) * 100)}%`]), ...pairs.map(([w, c]): Row => [`“${w}”`, `${c}× · phrase`])]
    return { rows, note: 'Common filler words are ignored. Density = occurrences ÷ total words.' }
  },
}
const utm: Spec = {
  fields: [
    { key: 'url', label: 'Website URL', type: 'text', def: 'https://example.com/landing', placeholder: 'https://…' },
    { key: 'source', label: 'Campaign source (utm_source)', type: 'text', def: 'instagram' },
    { key: 'medium', label: 'Campaign medium (utm_medium)', type: 'text', def: 'social' },
    { key: 'campaign', label: 'Campaign name (utm_campaign)', type: 'text', def: 'spring_launch' },
    { key: 'term', label: 'Campaign term (optional)', type: 'text' },
    { key: 'content', label: 'Campaign content (optional)', type: 'text' },
  ],
  run: (v) => {
    const raw = (v.url ?? '').trim()
    need(raw !== '', 'Enter the page URL you want to track.')
    let u: URL
    try { u = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`) } catch { throw new Error('That does not look like a valid URL.') }
    need(u.protocol === 'http:' || u.protocol === 'https:', 'Use an http or https URL.')
    need((v.source ?? '').trim() !== '', 'utm_source is required (for example: newsletter, instagram).')
    for (const k of ['source', 'medium', 'campaign', 'term', 'content']) { const x = (v[k] ?? '').trim(); if (x) u.searchParams.set(`utm_${k}`, x) }
    return { text: u.toString(), note: 'Use consistent lowercase names so your analytics reports stay clean.' }
  },
}

/* ---------- Productivity & time ---------- */
export const ZONES = ['UTC', 'America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York', 'America/Sao_Paulo', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Istanbul', 'Africa/Cairo', 'Africa/Lagos', 'Africa/Johannesburg', 'Asia/Dubai', 'Asia/Karachi', 'Asia/Kolkata', 'Asia/Dhaka', 'Asia/Bangkok', 'Asia/Singapore', 'Asia/Shanghai', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Sydney', 'Pacific/Auckland']
const tzOffset = (utcMs: number, tz: string) => {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }).formatToParts(new Date(utcMs))
  const g = (t: string) => Number(p.find((x) => x.type === t)!.value)
  return Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'), g('second')) - Math.floor(utcMs / 1000) * 1000
}
export const zonedToUtc = (y: number, mo: number, d: number, h: number, mi: number, tz: string) => {
  const guess = Date.UTC(y, mo - 1, d, h, mi)
  const t = guess - tzOffset(guess, tz)
  return guess - tzOffset(t, tz)
}
const timezone: Spec = {
  fields: [
    { key: 'when', label: 'Date & time (leave empty for right now)', type: 'datetime' },
    { key: 'from', label: 'Time zone of that date & time', type: 'select', options: ZONES.map((z) => [z, z.replace('_', ' ')] as [string, string]), def: 'UTC' },
  ],
  run: (v) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(v.when ?? '')
    const from = v.from || 'UTC'
    const utc = m ? zonedToUtc(+m[1], +m[2], +m[3], +m[4], +m[5], from) : Date.now()
    return { rows: ZONES.map((z): Row => [z.replace('_', ' '), new Intl.DateTimeFormat('en-GB', { timeZone: z, weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZoneName: 'short' }).format(new Date(utc))]), note: 'Daylight-saving rules are applied automatically using your browser’s time-zone data.' }
  },
}
const picker: Spec = {
  manual: true,
  runLabel: 'Pick',
  fields: [
    { key: 'names', label: 'Names or options (one per line)', type: 'textarea', def: 'Alice\nBob\nCharlie\nDiana\nEthan' },
    { key: 'mode', label: 'What to do', type: 'select', options: [['pick', 'Pick winner(s)'], ['shuffle', 'Shuffle the list'], ['teams', 'Split into teams']] },
    { key: 'count', label: 'How many winners / teams', type: 'number', def: '1', min: 1, max: 100 },
  ],
  run: (v) => {
    const items = (v.names ?? '').split('\n').map((s) => s.trim()).filter(Boolean)
    need(items.length >= 2, 'Add at least two names or options, one per line.')
    const n = Math.floor(num(v, 'count'))
    need(n >= 1, 'Count must be at least 1.')
    const a = [...items]
    for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]] }
    if (v.mode === 'shuffle') return { rows: a.map((x, i): Row => [`#${i + 1}`, x]) }
    if (v.mode === 'teams') { need(n <= a.length, 'You cannot have more teams than names.'); const t: string[][] = Array.from({ length: n }, () => []); a.forEach((x, i) => t[i % n].push(x)); return { rows: t.map((m, i): Row => [`Team ${i + 1}`, m.join(', ')]) } }
    need(n <= a.length, 'You cannot pick more winners than there are names.')
    return { rows: a.slice(0, n).map((x, i): Row => [n === 1 ? 'Winner' : `Winner #${i + 1}`, x]) }
  },
}
const dice: Spec = {
  manual: true,
  runLabel: 'Roll',
  fields: [
    { key: 'kind', label: 'What to roll', type: 'select', options: [['coin', 'Coin flip'], ['4', 'd4'], ['6', 'd6 (standard die)'], ['8', 'd8'], ['10', 'd10'], ['12', 'd12'], ['20', 'd20'], ['100', 'd100']], def: '6' },
    { key: 'count', label: 'How many', type: 'number', def: '2', min: 1, max: 100 },
  ],
  run: (v) => {
    const n = Math.floor(num(v, 'count'))
    need(n >= 1 && n <= 100, 'Roll between 1 and 100 at a time.')
    if (v.kind === 'coin') {
      const r = Array.from({ length: n }, () => (rand(2) ? 'Heads' : 'Tails'))
      return { rows: [['Summary', `${r.filter((x) => x === 'Heads').length} heads · ${r.filter((x) => x === 'Tails').length} tails`], ...r.slice(0, 20).map((x, i): Row => [`Flip ${i + 1}`, x])] }
    }
    const sides = Number(v.kind) || 6
    const r = Array.from({ length: n }, () => rand(sides) + 1)
    return { rows: [['Total', String(r.reduce((s, x) => s + x, 0))], ...r.slice(0, 20).map((x, i): Row => [`Roll ${i + 1}`, String(x)])], note: n > 20 ? `Showing the first 20 of ${n} rolls.` : undefined }
  },
}

/* ---------- Developer utilities ---------- */
const pascal = (s: string) => s.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(' ').filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('') || 'Item'
const singular = (s: string) => (/ies$/i.test(s) ? s.replace(/ies$/i, 'y') : /(ss|us)$/i.test(s) ? s : s.replace(/s$/i, ''))
const propKey = (k: string) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k))
export function jsonToTypeScript(input: string, root = 'Root'): string {
  let data: unknown
  try { data = JSON.parse(input) } catch { throw new Error('That is not valid JSON. Check for missing quotes or trailing commas.') }
  const out: string[] = []
  const used = new Set<string>()
  const unique = (n: string) => { let x = n, i = 2; while (used.has(x)) x = `${n}${i++}`; used.add(x); return x }
  const wrap = (t: string) => (t.includes(' | ') ? `(${t})[]` : `${t}[]`)
  const iface = (objs: Record<string, unknown>[], name: string): string => {
    const nm = unique(name)
    const keys = [...new Set(objs.flatMap((o) => Object.keys(o)))]
    const lines = keys.map((k) => { const present = objs.filter((o) => k in o); return `  ${propKey(k)}${present.length < objs.length ? '?' : ''}: ${merge(present.map((o) => o[k]), pascal(k))};` })
    out.push(`export interface ${nm} {\n${lines.join('\n')}\n}`)
    return nm
  }
  const merge = (vals: unknown[], name: string): string => {
    const parts = new Set<string>(), objs: Record<string, unknown>[] = [], arrs: unknown[][] = []
    for (const v of vals) {
      if (v === null) parts.add('null')
      else if (Array.isArray(v)) arrs.push(v)
      else if (typeof v === 'object') objs.push(v as Record<string, unknown>)
      else parts.add(typeof v === 'number' ? 'number' : typeof v === 'boolean' ? 'boolean' : 'string')
    }
    if (objs.length) parts.add(iface(objs, name))
    if (arrs.length) { const el = arrs.flat(); parts.add(el.length ? wrap(merge(el, singular(name))) : 'unknown[]') }
    return [...parts].join(' | ') || 'unknown'
  }
  const rootName = pascal(root)
  if (data !== null && typeof data === 'object' && !Array.isArray(data)) iface([data as Record<string, unknown>], rootName)
  else out.push(`export type ${unique(rootName)} = ${merge([data], singular(rootName))};`)
  return out.reverse().join('\n\n')
}
const jsonTs: Spec = {
  fields: [
    { key: 'root', label: 'Root type name', type: 'text', def: 'Root' },
    { key: 'json', label: 'Paste JSON', type: 'textarea', def: '{\n  "id": 1,\n  "name": "ToolsKit",\n  "tags": ["tools", "free"],\n  "owner": { "login": "rumitech", "site": null }\n}' },
  ],
  empty: 'Paste JSON to generate TypeScript interfaces.',
  run: (v) => ((v.json ?? '').trim() ? { text: jsonToTypeScript(v.json, v.root || 'Root'), note: 'Types are inferred from the sample. Optional properties (?) appear when a key is missing in some array items.' } : ''),
}
const PERM = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx']
const PERM_WORDS = ['no permissions', 'execute', 'write', 'write + execute', 'read', 'read + execute', 'read + write', 'read + write + execute']
export const chmodInfo = (input: string) => {
  const s = input.trim()
  let special = 0, bits: number[]
  if (/^[0-7]{3,4}$/.test(s)) { const d = s.padStart(4, '0').split('').map(Number); special = d[0]; bits = d.slice(1) }
  else if (/^[-rwx]{9}$/.test(s)) { bits = [0, 3, 6].map((i) => (s[i] === 'r' ? 4 : 0) + (s[i + 1] === 'w' ? 2 : 0) + (s[i + 2] === 'x' ? 1 : 0)) }
  else throw new Error('Enter an octal mode like 755 or 0644, or a 9-character symbolic mode like rwxr-xr-x.')
  const sym = bits.map((b) => PERM[b].split('')).map((c, i) => { if (i === 0 && special & 4) c[2] = c[2] === 'x' ? 's' : 'S'; if (i === 1 && special & 2) c[2] = c[2] === 'x' ? 's' : 'S'; if (i === 2 && special & 1) c[2] = c[2] === 'x' ? 't' : 'T'; return c.join('') }).join('')
  return { octal: (special ? String(special) : '') + bits.join(''), symbolic: sym, bits, special }
}
const chmod: Spec = {
  fields: [{ key: 'mode', label: 'Permissions (octal like 755 or symbolic like rwxr-xr-x)', type: 'text', def: '755' }],
  run: (v) => {
    const r = chmodInfo(v.mode ?? '')
    return { rows: [['Octal', r.octal], ['Symbolic', r.symbolic], ['Command', `chmod ${r.octal} filename`], ['Owner (user)', PERM_WORDS[r.bits[0]]], ['Group', PERM_WORDS[r.bits[1]]], ['Others', PERM_WORDS[r.bits[2]]], ...(r.special ? ([['Special bits', [r.special & 4 ? 'setuid' : '', r.special & 2 ? 'setgid' : '', r.special & 1 ? 'sticky' : ''].filter(Boolean).join(' + ')]] as Row[]) : [])] }
  },
}
const ip2n = (s: string) => { const p = s.trim().split('.'); need(p.length === 4 && p.every((x) => /^\d{1,3}$/.test(x) && +x <= 255), 'Enter a valid IPv4 address, for example 192.168.1.0.'); return p.reduce((acc, x) => acc * 256 + Number(x), 0) }
const n2ip = (n: number) => [24, 16, 8, 0].map((sh) => (n >>> sh) & 255).join('.')
export const cidrInfo = (input: string) => {
  const m = /^\s*([\d.]+)\s*\/\s*(\d{1,2})\s*$/.exec(input)
  need(!!m, 'Use CIDR notation such as 192.168.1.0/24.')
  const ip = ip2n(m![1]), p = Number(m![2])
  need(p >= 0 && p <= 32, 'The prefix length must be between 0 and 32.')
  const mask = p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0
  const net = (ip & mask) >>> 0, bc = (net | (~mask >>> 0)) >>> 0
  const total = 2 ** (32 - p)
  const hosts = p === 32 ? 1 : p === 31 ? 2 : Math.max(total - 2, 0)
  const first = p >= 31 ? net : net + 1, last = p >= 31 ? bc : bc - 1
  const priv = (ip >>> 24 === 10) || (ip >>> 20 === 0xac1) || (ip >>> 16 === 0xc0a8)
  return { ip, p, net: n2ip(net), bc: n2ip(bc), mask: n2ip(mask), wildcard: n2ip(~mask >>> 0), first: n2ip(first), last: n2ip(last), total, hosts, priv }
}
const cidr: Spec = {
  fields: [{ key: 'cidr', label: 'IPv4 address in CIDR notation', type: 'text', def: '192.168.1.0/24', placeholder: '10.0.0.0/16' }],
  run: (v) => {
    const r = cidrInfo(v.cidr ?? '')
    return { rows: [['Network address', r.net], ['Broadcast address', r.bc], ['Subnet mask', r.mask], ['Wildcard mask', r.wildcard], ['First usable host', r.first], ['Last usable host', r.last], ['Total addresses', fmt(r.total, 0)], ['Usable hosts', fmt(r.hosts, 0)], ['Private (RFC 1918) range', r.priv ? 'Yes' : 'No']] }
  },
}
const HTTP: [number, string, string][] = [
  [100, 'Continue', 'The server received the request headers; the client should send the body.'], [101, 'Switching Protocols', 'The server is switching to the protocol requested by the client (e.g. WebSocket).'], [102, 'Processing', 'The server has accepted the request but has not finished (WebDAV).'], [103, 'Early Hints', 'Preload hints sent before the final response.'],
  [200, 'OK', 'The request succeeded.'], [201, 'Created', 'The request succeeded and a new resource was created.'], [202, 'Accepted', 'The request was accepted for processing, but is not complete.'], [203, 'Non-Authoritative Information', 'The response was modified by a transforming proxy.'], [204, 'No Content', 'Success with no body to return.'], [205, 'Reset Content', 'Success; the client should reset the document view.'], [206, 'Partial Content', 'Only part of the resource is returned (range request).'],
  [301, 'Moved Permanently', 'The resource has a new permanent URL.'], [302, 'Found', 'Temporary redirect to another URL.'], [303, 'See Other', 'Redirect to another URL using GET.'], [304, 'Not Modified', 'The cached version is still valid.'], [307, 'Temporary Redirect', 'Temporary redirect; the method and body must not change.'], [308, 'Permanent Redirect', 'Permanent redirect; the method and body must not change.'],
  [400, 'Bad Request', 'The server cannot process the request because of a client error.'], [401, 'Unauthorized', 'Authentication is required or has failed.'], [402, 'Payment Required', 'Reserved for future use; some APIs use it for billing limits.'], [403, 'Forbidden', 'The server understood the request but refuses to authorize it.'], [404, 'Not Found', 'The requested resource could not be found.'], [405, 'Method Not Allowed', 'The HTTP method is not supported for this resource.'], [406, 'Not Acceptable', 'No content matches the Accept headers sent.'], [407, 'Proxy Authentication Required', 'Authenticate with the proxy first.'], [408, 'Request Timeout', 'The server timed out waiting for the request.'], [409, 'Conflict', 'The request conflicts with the current state of the resource.'], [410, 'Gone', 'The resource was permanently removed.'], [411, 'Length Required', 'A Content-Length header is required.'], [412, 'Precondition Failed', 'A condition in the request headers was not met.'], [413, 'Content Too Large', 'The request body is larger than the server allows.'], [414, 'URI Too Long', 'The URL is longer than the server will process.'], [415, 'Unsupported Media Type', 'The payload format is not supported.'], [416, 'Range Not Satisfiable', 'The requested range cannot be served.'], [417, 'Expectation Failed', 'The Expect header cannot be met.'], [418, "I'm a teapot", 'April Fools’ joke status from RFC 2324.'], [421, 'Misdirected Request', 'The request was sent to a server that cannot respond.'], [422, 'Unprocessable Content', 'The request is well-formed but contains semantic errors.'], [423, 'Locked', 'The resource is locked (WebDAV).'], [425, 'Too Early', 'The server will not risk processing a replayable request.'], [426, 'Upgrade Required', 'Switch to a different protocol to continue.'], [428, 'Precondition Required', 'The request must be conditional.'], [429, 'Too Many Requests', 'Rate limit exceeded.'], [431, 'Request Header Fields Too Large', 'The headers are too large.'], [451, 'Unavailable For Legal Reasons', 'Access is denied for legal reasons.'],
  [500, 'Internal Server Error', 'A generic server-side error.'], [501, 'Not Implemented', 'The server does not support the requested functionality.'], [502, 'Bad Gateway', 'A gateway or proxy received an invalid response upstream.'], [503, 'Service Unavailable', 'The server is overloaded or down for maintenance.'], [504, 'Gateway Timeout', 'A gateway or proxy timed out waiting for the upstream server.'], [505, 'HTTP Version Not Supported', 'The HTTP version is not supported.'], [507, 'Insufficient Storage', 'The server cannot store what is needed to complete the request (WebDAV).'], [511, 'Network Authentication Required', 'The client must authenticate to gain network access.'],
]
export const httpCodes = (q: string) => {
  const s = q.trim().toLowerCase()
  return HTTP.filter(([c, n, d]) => !s || String(c).startsWith(s) || n.toLowerCase().includes(s) || d.toLowerCase().includes(s))
}
const http: Spec = {
  fields: [{ key: 'q', label: 'Search by code or keyword', type: 'text', placeholder: '404, redirect, timeout…' }],
  run: (v) => { const r = httpCodes(v.q ?? ''); need(r.length > 0, 'No status code matches that search.'); return { rows: r.map(([c, n, d]): Row => [`${c} ${n}`, d]) } },
}

/* ---------- QR codes ---------- */
const qr: Spec = {
  fields: [
    { key: 'text', label: 'Text or URL to encode', type: 'textarea', def: 'https://toolskit.sbs', placeholder: 'Paste a link, text, Wi-Fi details…' },
    { key: 'level', label: 'Error correction', type: 'select', options: [['L', 'Low (most data)'], ['M', 'Medium (recommended)'], ['Q', 'Quartile'], ['H', 'High (survives damage)']], def: 'M' },
    { key: 'fg', label: 'Code color', type: 'color', def: '#000000' },
    { key: 'bg', label: 'Background color', type: 'color', def: '#ffffff' },
  ],
  empty: 'Enter text or a URL to create a QR code.',
  run: (v) => {
    const t = v.text ?? ''
    if (!t.trim()) return ''
    const level = (['L', 'M', 'Q', 'H'].includes(v.level) ? v.level : 'M') as EcLevel
    const [fr, fg, fb] = hexRgb(v.fg || '#000000'), [br, bgc, bb] = hexRgb(v.bg || '#ffffff')
    const lum = (r: number, g: number, b: number) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    need(lum(br, bgc, bb) - lum(fr, fg, fb) > 0.4, 'Use a dark code color on a light background so phones can scan it.')
    const svg = qrSvg(qrMatrix(t, level), 320, 4, rgbHex(fr, fg, fb), rgbHex(br, bgc, bb))
    return { svg, note: 'Generated in your browser; the text is never uploaded. Always test the code with your phone before printing.' }
  },
}

/* ---------- Privacy & security ---------- */
const SETS: Record<string, string> = { alnum: A + a + D, hex: '0123456789abcdef', base64url: A + a + D + '-_', letters: A + a, digits: D, strong: A + a + D + '!@#$%^&*()-_=+[]{};:,.?' }
const randStr: Spec = {
  manual: true,
  runLabel: 'Generate',
  fields: [
    { key: 'len', label: 'Length', type: 'number', def: '32', min: 1, max: 512 },
    { key: 'set', label: 'Characters', type: 'select', options: [['alnum', 'Letters + numbers'], ['strong', 'Letters + numbers + symbols'], ['hex', 'Hexadecimal'], ['base64url', 'URL-safe Base64 characters'], ['letters', 'Letters only'], ['digits', 'Digits only']] },
    { key: 'count', label: 'How many', type: 'number', def: '5', min: 1, max: 50 },
  ],
  run: (v) => {
    const len = Math.floor(num(v, 'len')), n = Math.floor(num(v, 'count'))
    need(len >= 1 && len <= 512 && n >= 1 && n <= 50, 'Length must be 1–512 and count 1–50.')
    const cs = SETS[v.set || 'alnum'] ?? SETS.alnum
    return { rows: Array.from({ length: n }, (_, i): Row => [`#${i + 1}`, Array.from({ length: len }, () => cs[rand(cs.length)]).join('')]), note: 'Generated locally with your browser’s cryptographically secure random generator. Nothing is sent or stored.' }
  },
}
const toHex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')
const toB64 = (u: Uint8Array) => { let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000)); return btoa(s) }
const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))
const enc = new TextEncoder()
const hmac: Spec = {
  fields: [
    { key: 'key', label: 'Secret key', type: 'text', def: 'secret' },
    { key: 'msg', label: 'Message', type: 'textarea', def: 'The quick brown fox jumps over the lazy dog' },
    { key: 'algo', label: 'Algorithm', type: 'select', options: ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1'], def: 'SHA-256' },
    { key: 'format', label: 'Output format', type: 'select', options: [['hex', 'Hex'], ['base64', 'Base64']] },
  ],
  run: async (v) => {
    need((v.key ?? '') !== '', 'Enter a secret key.')
    const k = await crypto.subtle.importKey('raw', enc.encode(v.key), { name: 'HMAC', hash: v.algo || 'SHA-256' }, false, ['sign'])
    const sig = await crypto.subtle.sign('HMAC', k, enc.encode(v.msg ?? ''))
    return { text: v.format === 'base64' ? toB64(new Uint8Array(sig)) : toHex(sig), note: 'Computed locally with the Web Crypto API.' }
  },
}
const ITER = 600_000
const deriveKey = async (pass: string, salt: BufferSource) => {
  const base = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
}
export async function encryptText(text: string, pass: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await deriveKey(pass, salt), enc.encode(text)))
  const all = new Uint8Array(28 + ct.length); all.set(salt); all.set(iv, 16); all.set(ct, 28)
  return 'tk1.' + toB64(all)
}
export async function decryptText(payload: string, pass: string): Promise<string> {
  try {
    const raw = fromB64(payload.trim().replace(/^tk1\./, ''))
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: raw.slice(16, 28) }, await deriveKey(pass, raw.slice(0, 16)), raw.slice(28))
    return new TextDecoder().decode(pt)
  } catch { throw new Error('Could not decrypt. Check the passphrase and make sure you pasted the full encrypted text.') }
}
const crypt: Spec = {
  manual: true,
  runLabel: 'Encrypt / Decrypt',
  fields: [
    { key: 'mode', label: 'Action', type: 'select', options: [['encrypt', 'Encrypt text'], ['decrypt', 'Decrypt text']] },
    { key: 'pass', label: 'Passphrase', type: 'password', placeholder: 'Choose a strong passphrase' },
    { key: 'text', label: 'Text', type: 'textarea', placeholder: 'Text to encrypt, or the encrypted text to decrypt' },
  ],
  run: async (v) => {
    need((v.pass ?? '').length >= 6, 'Use a passphrase of at least 6 characters (longer is better).')
    need((v.text ?? '') !== '', 'Enter some text first.')
    return v.mode === 'decrypt'
      ? { text: await decryptText(v.text, v.pass) }
      : { text: await encryptText(v.text, v.pass), note: 'AES-256-GCM with a PBKDF2 (600,000 iterations) key. Keep the passphrase safe: it cannot be recovered.' }
  },
}
const checksum: Spec = {
  fields: [
    { key: 'file', label: 'Choose a file (hashed locally, never uploaded)', type: 'file', accept: '*/*' },
    { key: 'algo', label: 'Algorithm', type: 'select', options: ['SHA-256', 'SHA-512', 'SHA-1'], def: 'SHA-256' },
    { key: 'expected', label: 'Expected hash to compare (optional)', type: 'text' },
  ],
  empty: 'Choose a file to calculate its checksum.',
  run: async (v, files) => {
    const f = files[0]
    if (!f) return ''
    need(f.size <= 300 * 1024 * 1024, 'Please choose a file under 300 MB.')
    const hash = toHex(await crypto.subtle.digest(v.algo || 'SHA-256', await f.arrayBuffer()))
    const rows: Row[] = [['File', f.name], ['Size', `${fmt(f.size / 1024, 1)} KB`], [v.algo || 'SHA-256', hash]]
    const exp = (v.expected ?? '').trim().toLowerCase().replace(/\s+/g, '')
    if (exp) rows.push(['Comparison', exp === hash ? 'Match ✓ the file is identical' : 'Does NOT match ✗'])
    return { rows }
  },
}

export const specs: Record<string, Spec> = {
  'gst-vat-calculator': gst, 'profit-margin-calculator': margin, 'roi-calculator': roi, 'sip-calculator': sip, 'salary-converter': salary,
  'calorie-calculator': calorie, 'water-intake-calculator': water, 'pace-calculator': pace, 'heart-rate-zones': zones,
  'color-palette-generator': palette, 'css-gradient-generator': gradient, 'box-shadow-generator': shadow, 'px-to-rem-converter': pxRem, 'image-to-base64': imageB64,
  'fancy-text-generator': fancy, 'bionic-reading-converter': bionic, 'reading-time-calculator': readingTime, 'readability-score-checker': readabilitySpec, 'keyword-density-checker': keywords, 'utm-link-builder': utm,
  'time-zone-converter': timezone, 'random-picker': picker, 'dice-roller-coin-flip': dice,
  'json-to-typescript': jsonTs, 'chmod-calculator': chmod, 'cidr-subnet-calculator': cidr, 'http-status-codes': http,
  'qr-code-generator': qr, 'random-string-generator': randStr, 'hmac-generator': hmac, 'text-encryptor': crypt, 'file-checksum-calculator': checksum,
}
