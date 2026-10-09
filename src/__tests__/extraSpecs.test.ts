import { describe, expect, it } from 'vitest'
import { chmodInfo, cidrInfo, decryptText, encryptText, FANCY, httpCodes, jsonToTypeScript, readability, specs, type Result, type Row } from '../extras/specs'
import { qrMatrix } from '../extras/qr'

const rows = (r: Result): Row[] => (typeof r === 'string' ? [] : r.rows ?? [])
const val = (r: Result, label: string) => rows(r).find(([l]) => l === label)?.[1]
const text = (r: Result) => (typeof r === 'string' ? r : r.text ?? '')
const run = (id: string, v: Record<string, string>, files: File[] = []) => specs[id].run(v, files)
const fails = (id: string, v: Record<string, string>, re: RegExp) => expect(Promise.resolve().then(() => run(id, v))).rejects.toThrow(re)

describe('finance & business', () => {
  it('adds and removes tax', async () => {
    const add = await run('gst-vat-calculator', { amount: '1000', rate: '18', mode: 'add' })
    expect(val(add, 'Gross total (with tax)')).toBe('1,180.00')
    const rem = await run('gst-vat-calculator', { amount: '1180', rate: '18', mode: 'remove' })
    expect(val(rem, 'Net amount (before tax)')).toBe('1,000.00')
  })
  it('calculates margin, markup and target price', async () => {
    const r = await run('profit-margin-calculator', { cost: '60', price: '100', target: '50' })
    expect(val(r, 'Profit margin')).toBe('40.00%')
    expect(val(r, 'Markup on cost')).toBe('66.67%')
    expect(val(r, 'Price needed for 50.0% margin')).toBe('120.00')
  })
  it('calculates ROI and CAGR', async () => {
    const r = await run('roi-calculator', { invested: '10000', final: '15000', years: '3' })
    expect(val(r, 'Total ROI')).toBe('50.00%')
    expect(val(r, 'Annualized return (CAGR)')).toBe('14.47% per year')
  })
  it('calculates SIP growth (annuity due)', async () => {
    const r = await run('sip-calculator', { monthly: '500', rate: '12', years: '10' })
    expect(val(r, 'Total invested')).toBe('60,000.00')
    expect(val(r, 'Estimated total value')).toBe('116,169.54')
  })
  it('converts salary between units', async () => {
    const r = await run('salary-converter', { amount: '25', unit: 'hour', hpw: '40', wpy: '52' })
    expect(val(r, 'Per year')).toBe('52,000.00')
    expect(val(r, 'Per month')).toBe('4,333.33')
    expect(val(r, 'Per day')).toBe('200.00')
  })
  it('rejects invalid input with a clear message', async () => {
    await fails('gst-vat-calculator', { amount: 'abc', rate: '18', mode: 'add' }, /valid number/)
  })
})

describe('health & fitness', () => {
  it('uses Mifflin–St Jeor for BMR and TDEE', async () => {
    const r = await run('calorie-calculator', { sex: 'male', age: '30', height: '175', weight: '70', activity: '1.375' })
    expect(val(r, 'Basal metabolic rate (BMR)')).toBe('1,649 kcal/day')
    expect(val(r, 'Maintenance calories (TDEE)')).toBe('2,267 kcal/day')
  })
  it('estimates water intake', async () => {
    const r = await run('water-intake-calculator', { weight: '70', exercise: '30', climate: 'mild' })
    expect(val(r, 'Estimated daily water')).toBe('2.66 L')
  })
  it('calculates running pace and race predictions', async () => {
    const r = await run('pace-calculator', { dist: '5', unit: 'km', h: '0', m: '25', s: '0' })
    expect(val(r, 'Pace per km')).toBe('5:00')
    expect(val(r, 'Pace per mile')).toBe('8:03')
    expect(val(r, '10K at this pace')).toBe('50:00')
  })
  it('builds heart-rate zones', async () => {
    const r = await run('heart-rate-zones', { age: '35', rest: '' })
    expect(val(r, 'Estimated max heart rate')).toBe('184 bpm')
  })
})

describe('design & color', () => {
  it('generates harmonies', async () => {
    const r = await run('color-palette-generator', { color: '#ff0000', scheme: 'complementary' })
    expect(rows(r).map((x) => x[1])).toEqual(['#ff0000', '#00ffff'])
    await fails('color-palette-generator', { color: 'nope', scheme: 'triadic' }, /hex color/)
  })
  it('writes gradient and shadow CSS', async () => {
    expect(text(await run('css-gradient-generator', { type: 'linear', angle: '135', stops: '2', c1: '#6366f1', c2: '#d946ef', c3: '#f97316' }))).toBe('background: linear-gradient(135deg, #6366f1, #d946ef);')
    expect(text(await run('box-shadow-generator', { x: '0', y: '10', blur: '30', spread: '-5', opacity: '25', color: '#000000', inset: '' }))).toBe('box-shadow: 0px 10px 30px -5px rgba(0, 0, 0, 0.25);')
  })
  it('converts px and rem', async () => {
    expect(rows(await run('px-to-rem-converter', { value: '24', dir: 'px2rem', base: '16' }))[0][1]).toBe('1.5rem')
    expect(rows(await run('px-to-rem-converter', { value: '2', dir: 'rem2px', base: '16' }))[0][1]).toBe('32px')
  })
})

describe('writing & social', () => {
  const style = (name: string, t: string) => FANCY.find(([n]) => n === name)![1](t)
  it('maps Unicode styles', () => {
    expect(style('Bold', 'Hi')).toBe('𝐇𝐢')
    expect(style('Italic', 'h')).toBe('ℎ')
    expect(style('Circled', 'A1')).toBe('Ⓐ①')
    expect(style('Upside down', 'hello')).toBe('ollǝɥ')
    expect(style('Full-width', 'Ab 1')).toBe('Ａｂ　１')
  })
  it('makes bionic text and escapes HTML', async () => {
    const r = await run('bionic-reading-converter', { text: 'hello world', strength: '0.5' })
    expect(text(r)).toBe('**hel**lo **wor**ld')
    const evil = await run('bionic-reading-converter', { text: '<img src=x onerror=alert(1)>', strength: '0.5' })
    expect(typeof evil !== 'string' && evil.html).not.toContain('<img')
  })
  it('estimates reading time', async () => {
    const r = await run('reading-time-calculator', { text: 'word '.repeat(238) })
    expect(val(r, 'Words')).toBe('238')
    expect(val(r, 'Average reading time (238 wpm)')).toBe('1 min 0 sec')
  })
  it('scores readability', () => {
    expect(readability('The cat sat on the mat.')!.ease).toBeGreaterThan(100)
    expect(readability('Notwithstanding considerable institutional disagreement, comprehensive regulatory harmonisation remained unattainable.')!.ease).toBeLessThan(10)
    expect(readability('')).toBeNull()
  })
  it('counts keywords and ignores stop words', async () => {
    const r = await run('keyword-density-checker', { text: 'apple banana apple cherry apple banana the the the' })
    expect(val(r, 'apple')).toBe('3× · 33.33%')
    expect(val(r, 'the')).toBeUndefined()
  })
  it('builds UTM links and rejects unsafe URLs', async () => {
    const r = await run('utm-link-builder', { url: 'example.com/page?x=1', source: 'instagram', medium: 'social', campaign: 'spring', term: '', content: '' })
    expect(text(r)).toBe('https://example.com/page?x=1&utm_source=instagram&utm_medium=social&utm_campaign=spring')
    await fails('utm-link-builder', { url: 'javascript:alert(1)', source: 'a', medium: '', campaign: '', term: '', content: '' }, /.+/)
  })
})

describe('productivity', () => {
  it('converts time zones, including daylight saving', async () => {
    const r = await run('time-zone-converter', { when: '2024-01-15T12:00', from: 'UTC' })
    expect(val(r, 'Asia/Karachi')).toContain('17:00')
    expect(val(r, 'America/New York')).toContain('07:00')
    expect(val(r, 'Asia/Tokyo')).toContain('21:00')
    const summer = await run('time-zone-converter', { when: '2024-07-01T12:00', from: 'America/New_York' })
    expect(val(summer, 'Europe/London')).toContain('17:00')
    expect(val(summer, 'UTC')).toContain('16:00')
  })
  it('picks distinct winners and splits teams', async () => {
    const r = await run('random-picker', { names: 'a\nb\nc\nd', mode: 'pick', count: '3' })
    expect(new Set(rows(r).map((x) => x[1])).size).toBe(3)
    const t = await run('random-picker', { names: 'a\nb\nc\nd', mode: 'teams', count: '2' })
    expect(rows(t)).toHaveLength(2)
    await fails('random-picker', { names: 'only', mode: 'pick', count: '1' }, /at least two/)
  })
  it('rolls dice within range', async () => {
    const r = await run('dice-roller-coin-flip', { kind: '6', count: '30' })
    const rolls = rows(r).slice(1).map((x) => Number(x[1]))
    expect(rolls).toHaveLength(20)
    expect(rolls.every((n) => n >= 1 && n <= 6)).toBe(true)
  })
})

describe('developer utilities', () => {
  it('generates TypeScript from JSON', () => {
    const ts = jsonToTypeScript('{"id":1,"name":"x","tags":["a"],"owner":{"login":"r","site":null}}')
    expect(ts).toContain('export interface Root {')
    expect(ts).toContain('id: number;')
    expect(ts).toContain('tags: string[];')
    expect(ts).toContain('owner: Owner;')
    expect(ts).toContain('site: null;')
    const arr = jsonToTypeScript('[{"a":1},{"a":2,"b":"x"}]')
    expect(arr).toContain('export type Root = Root2[];')
    expect(arr).toContain('b?: string;')
    expect(() => jsonToTypeScript('{oops')).toThrow(/valid JSON/)
  })
  it('converts chmod modes', () => {
    expect(chmodInfo('755').symbolic).toBe('rwxr-xr-x')
    expect(chmodInfo('rw-r--r--').octal).toBe('644')
    expect(chmodInfo('4755').symbolic).toBe('rwsr-xr-x')
    expect(() => chmodInfo('999')).toThrow()
  })
  it('calculates subnets', () => {
    const a = cidrInfo('192.168.1.0/24')
    expect([a.net, a.bc, a.mask, a.wildcard, a.hosts, a.priv]).toEqual(['192.168.1.0', '192.168.1.255', '255.255.255.0', '0.0.0.255', 254, true])
    const b = cidrInfo('10.0.0.5/30')
    expect([b.net, b.bc, b.first, b.last, b.hosts]).toEqual(['10.0.0.4', '10.0.0.7', '10.0.0.5', '10.0.0.6', 2])
    expect(cidrInfo('8.8.8.8/32').hosts).toBe(1)
    expect(cidrInfo('8.8.8.8/32').priv).toBe(false)
    expect(() => cidrInfo('300.1.1.1/24')).toThrow()
    expect(() => cidrInfo('1.2.3.4/33')).toThrow()
  })
  it('searches HTTP status codes', () => {
    expect(httpCodes('404').map((c) => c[0])).toEqual([404])
    expect(httpCodes('teapot')[0][0]).toBe(418)
    expect(httpCodes('').length).toBeGreaterThan(50)
  })
})

describe('privacy & security', () => {
  it('generates random strings from the chosen set', async () => {
    const r = await run('random-string-generator', { len: '16', set: 'hex', count: '10' })
    expect(rows(r)).toHaveLength(10)
    expect(rows(r).every(([, s]) => /^[0-9a-f]{16}$/.test(s))).toBe(true)
    expect(new Set(rows(r).map((x) => x[1])).size).toBe(10)
  })
  it('matches the RFC 4231 HMAC-SHA256 test vector', async () => {
    const r = await run('hmac-generator', { key: '\u000b'.repeat(20), msg: 'Hi There', algo: 'SHA-256', format: 'hex' })
    expect(text(r)).toBe('b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7')
  })
  it('encrypts and decrypts, and fails on the wrong passphrase', async () => {
    const payload = await encryptText('Secret ✓ message', 'correct horse')
    expect(payload.startsWith('tk1.')).toBe(true)
    expect(payload).not.toContain('Secret')
    expect(await decryptText(payload, 'correct horse')).toBe('Secret ✓ message')
    await expect(decryptText(payload, 'wrong passphrase')).rejects.toThrow(/Could not decrypt/)
    expect(await encryptText('Secret ✓ message', 'correct horse')).not.toBe(payload)
  }, 20000)
  it('hashes files and compares with an expected value', async () => {
    const f = new File(['hello'], 'a.txt')
    const hash = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
    const ok = await run('file-checksum-calculator', { algo: 'SHA-256', expected: hash.toUpperCase() }, [f])
    expect(val(ok, 'SHA-256')).toBe(hash)
    expect(val(ok, 'Comparison')).toContain('Match')
    expect(val(await run('file-checksum-calculator', { algo: 'SHA-256', expected: 'abc' }, [f]), 'Comparison')).toContain('NOT')
  })
})

describe('QR code generator', () => {
  it('produces valid structure', () => {
    const m = qrMatrix('hello', 'L')
    expect(m).toHaveLength(21)
    expect(m[0].slice(0, 7).every(Boolean)).toBe(true)
    expect(m[3][3]).toBe(true)
    expect(qrMatrix('x'.repeat(100), 'M')).toHaveLength(41)
    expect(() => qrMatrix('x'.repeat(400), 'L')).toThrow(/too long/)
  })
  it('returns an SVG for the tool, nothing for empty input, and rejects low contrast', async () => {
    const r = await run('qr-code-generator', { text: 'https://toolskit.sbs', level: 'M', fg: '#000000', bg: '#ffffff' })
    expect(typeof r !== 'string' && r.svg).toMatch(/^<svg /)
    expect(await run('qr-code-generator', { text: '   ', level: 'M', fg: '#000000', bg: '#ffffff' })).toBe('')
    await fails('qr-code-generator', { text: 'x', level: 'M', fg: '#cccccc', bg: '#ffffff' }, /dark code color/)
  })
})

describe('registry wiring', () => {
  it('every spec has a registry entry and every new-category tool has a spec', async () => {
    const { tools } = await import('../toolRegistry')
    const ids = new Set(tools.map((t) => t.id))
    const { allSpecs } = await import('../extras/all')
    for (const id of Object.keys(allSpecs)) expect(ids.has(id), id).toBe(true)
    for (const t of tools.filter((x) => ['Finance', 'Health', 'Design', 'Productivity', 'Converters'].includes(x.category))) expect(allSpecs[t.id], t.id).toBeDefined()
  })
})

describe('extraIds', () => {
  it('lists exactly the ids that have a spec', async () => {
    const { extraToolIds } = await import('../extras/extraIds')
    const { allSpecs } = await import('../extras/all')
    expect([...extraToolIds].sort()).toEqual(Object.keys(allSpecs).sort())
  })
})
