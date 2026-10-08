import { describe, expect, it } from 'vitest'
import { allSpecs } from '../extras/all'
import { specs2 } from '../extras/specs2'
import { specs3 } from '../extras/specs3'
import { numberToWords } from '../extras/specs2'
import { parseUserAgent } from '../extras/specs3'
import type { Result, Row } from '../extras/specs'

const run = async (id: string, v: Record<string, string> = {}) => {
  const spec = allSpecs[id]
  const values = Object.fromEntries(spec.fields.map((f) => [f.key, f.def ?? (f.type === 'select' ? String(Array.isArray(f.options?.[0]) ? f.options[0][0] : f.options?.[0] ?? '') : '')]))
  return spec.run({ ...values, ...v }, [])
}
const rows = (r: Result): Row[] => (typeof r === 'string' ? [] : r.rows ?? [])
const val = (r: Result, label: string) => rows(r).find(([l]) => l.startsWith(label))?.[1]
const text = (r: Result) => (typeof r === 'string' ? r : r.text ?? '')

describe('every default input produces a result without throwing', () => {
  for (const [id, spec] of Object.entries({ ...specs2, ...specs3 })) {
    if (spec.fields.some((f) => f.type === 'file')) continue
    it(id, async () => { const r = await run(id); expect(r).toBeTruthy() })
  }
})

describe('converters', () => {
  it('converts length, weight, temperature, data and fuel economy', async () => {
    expect(await run('length-converter', { value: '1', from: 'm', to: 'ft' })).toMatchObject({ rows: [['1 Meters (m) =', '3.280839895 Feet (ft)'], expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything()] })
    expect(val(await run('temperature-converter', { value: '100', from: 'c', to: 'f' }), '100')).toBe('212 Fahrenheit (°F)')
    expect(val(await run('temperature-converter', { value: '0', from: 'c', to: 'k' }), '0')).toBe('273.15 Kelvin (K)')
    expect(val(await run('data-storage-converter', { value: '1', from: 'GiB', to: 'MiB' }), '1')).toBe('1,024 Mebibytes (MiB)')
    expect(val(await run('fuel-economy-converter', { value: '30', from: 'mpg', to: 'l100' }), '30')).toMatch(/^7\.84/)
  })
  it('spells numbers', async () => {
    expect(numberToWords(1234567n)).toBe('one million two hundred thirty-four thousand five hundred sixty-seven')
    expect(text(await run('number-to-words', { n: '21.05' }))).toBe('Twenty-one point zero five')
    await expect(run('number-to-words', { n: 'abc' })).rejects.toThrow()
  })
})

describe('finance & health', () => {
  it('mortgage payment', async () => { expect(val(await run('mortgage-calculator', { price: '300000', down: '20', rate: '6', years: '30', tax: '0', ins: '0' }), 'Monthly principal')).toBe('1,438.92') })
  it('CAGR', async () => { expect(val(await run('cagr-calculator', { start: '100', end: '200', years: '1' }), 'CAGR')).toBe('100.000%') })
  it('break-even', async () => { expect(val(await run('break-even-calculator', { fixed: '1000', price: '20', var: '10' }), 'Break-even units')).toBe('100') })
  it('card payoff rejects a payment below the interest', async () => { await expect(run('credit-card-payoff-calculator', { bal: '10000', apr: '24', pay: '100' })).rejects.toThrow(/interest/) })
  it('BMR (Mifflin-St Jeor)', async () => { expect(val(await run('bmr-calculator', { sex: 'm', age: '30', h: '180', w: '80' }), 'BMR')).toBe('1,780 kcal/day') })
  it('sleep calculator', async () => { expect(rows(await run('sleep-calculator', { mode: 'wake', time: '07:00' }))[0][1]).toBe('21:45') })
  it('due date', async () => { expect(val(await run('due-date-calculator', { lmp: '2026-01-01' }), 'Estimated')).toContain('October 8, 2026') })
})

describe('design', () => {
  it('shades, clamp and rgb→hex', async () => {
    expect(rows(await run('color-shades-generator')).length).toBe(10)
    expect(text(await run('css-clamp-generator'))).toBe('font-size: clamp(1rem, 0.5856rem + 1.768vw, 2rem);')
    expect(val(await run('rgb-to-hex-converter', { r: '255', g: '0', b: '0' }), 'HEX')).toBe('#ff0000')
  })
})

describe('productivity, text, developer, security, calculators', () => {
  it('business days', async () => { expect(val(await run('business-days-calculator', { a: '2026-10-05', b: '2026-10-11', inc: 'yes' }), 'Business')).toBe('5') })
  it('week number / weekday', async () => {
    expect(val(await run('week-number-calculator', { d: '2026-01-01' }), 'ISO')).toBe('Week 1 of 2026')
    expect(val(await run('day-of-week-calculator', { d: '2000-01-01' }), 'Day of the week')).toBe('Saturday')
  })
  it('text tools', async () => {
    expect(text(await run('title-case-converter', { t: 'the lord of the rings', style: 'ap' }))).toBe('The Lord of the Rings')
    expect(text(await run('remove-accents', { t: 'Crème brûlée' }))).toBe('Creme brulee')
    expect(text(await run('emoji-remover', { t: 'Hi 🚀 there' }))).toBe('Hi there')
    expect(text(await run('hashtag-generator', { t: 'summer sale', style: 'camel' }))).toBe('#SummerSale')
    expect(val(await run('anagram-checker', { a: 'Listen', b: 'Silent' }), 'Anagrams')).toMatch(/^Yes/)
    expect(text(await run('upside-down-text', { t: 'hello' }))).toBe('ollǝɥ')
    expect(text(await run('text-repeater', { text: 'ab', n: '3', sep: '-' }))).toBe('ab-ab-ab')
  })
  it('developer tools', async () => {
    expect(val(await run('url-parser', { u: 'https://a.com:81/p?x=1' }), 'Port')).toBe('81')
    expect(text(await run('string-escape', { t: 'a"b\nc', mode: 'jsonE' }))).toBe('a\\"b\\nc')
    expect(val(await run('ip-address-validator', { ip: '10.0.0.5' }), 'Type')).toContain('Private')
    expect(val(await run('ip-address-validator', { ip: '2001:db8::1' }), 'Valid')).toContain('IPv6')
    await expect(run('ip-address-validator', { ip: '999.1.1.1' })).rejects.toThrow()
    expect(rows(await run('json-diff', { a: '{"a":1}', b: '{"a":2,"b":3}' })).length).toBe(2)
    const jwt = text(await run('jwt-generator', { alg: 'HS256', payload: '{"sub":"1"}', secret: 's' }))
    expect(jwt.split('.').length).toBe(3)
    expect(parseUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')).toMatchObject({ browser: 'Safari 17.0', os: 'iOS 17.0', device: 'Mobile' })
  })
  it('security tools', async () => {
    expect(text(await run('passphrase-generator', { n: '4', sep: '-' })).split('-').length).toBe(4)
    expect(rows(await run('pin-generator', { len: '4', n: '10', weak: 'yes' })).every(([, p]) => /^\d{4}$/.test(p) && !/^(\d)\1+$/.test(p))).toBe(true)
    expect(rows(await run('hash-identifier', { h: '5d41402abc4b2a76b9719d911017c592' }))[0][1]).toBe('MD5')
  })
  it('calculators', async () => {
    expect(val(await run('fraction-calculator', { an: '1', ad: '2', op: '+', bn: '1', bd: '3' }), 'Result')).toBe('5/6')
    expect(rows(await run('quadratic-equation-solver', { a: '1', b: '-3', c: '2' })).map((r) => r[1])).toContain('2')
    expect(val(await run('gpa-calculator', { t: 'A 3\nB 3' }), 'GPA')).toBe('3.50')
    expect(val(await run('ohms-law-calculator', { v: '12', i: '2', r: '', p: '' }), 'Resistance')).toBe('6 Ω')
    expect(val(await run('geometry-calculator', { shape: 'circle', a: '1' }), 'Area')).toBe('3.141592654')
    expect(val(await run('ratio-calculator', { a: '3', b: '4', c: '9' }), '3 : 4')).toBe('12')
    expect(val(await run('average-calculator', { t: '1 2 3 4 10' }), 'Median')).toBe('3')
    expect(val(await run('grade-calculator', { t: '80, 50', target: '90' }), 'Score needed')).toBe('100.00%')
  })
})
