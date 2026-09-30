import { describe, it, expect } from 'vitest'
import {
  aspectRatio, caesarCipher, csvToMarkdownTable, decodeBase32, encodeBase32, factorial,
  fromRoman, gcdLcm, hexToTextValue, isPalindrome, isPrime, minifyCss, minifyHtml,
  morseToText, parseQueryString, passwordStrength, percentageChange, removeNumbers,
  removePunctuation, rot13, sha1, textStatistics, textToHex, textToMorse, toNato, toRoman,
  truncateText, vowelConsonantCount,
} from '../tools'
import { tools, getTool } from '../toolRegistry'

describe('expansion pack: text tools', () => {
  it('detects palindromes ignoring case and punctuation', () => {
    expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true)
    expect(isPalindrome('hello')).toBe(false)
  })
  it('removes punctuation and numbers', () => {
    expect(removePunctuation('Hi! there, friend.')).toBe('Hi there friend')
    expect(removeNumbers('abc123def456')).toBe('abcdef')
  })
  it('counts vowels and consonants', () => {
    const r = vowelConsonantCount('Hello World')
    expect(r.vowels).toBe(3)
    expect(r.consonants).toBe(7)
  })
  it('truncates text with ellipsis', () => {
    expect(truncateText('hello world', 5)).toBe('hello…')
    expect(truncateText('hi', 10)).toBe('hi')
  })
})

describe('expansion pack: developer tools', () => {
  it('round-trips base32', () => {
    expect(decodeBase32(encodeBase32('Hello, ToolsKit!'))).toBe('Hello, ToolsKit!')
  })
  it('round-trips hex/text', () => {
    expect(hexToTextValue(textToHex('abc'))).toBe('abc')
  })
  it('minifies css and html', () => {
    expect(minifyCss('.a { color: red; /* c */ }')).toBe('.a{color:red}')
    expect(minifyHtml('<div>  <p>hi</p>  </div>')).toBe('<div><p>hi</p></div>')
  })
  it('parses query strings', () => {
    expect(JSON.parse(parseQueryString('?a=1&b=2'))).toEqual({ a: '1', b: '2' })
  })
  it('builds markdown tables from csv', () => {
    expect(csvToMarkdownTable('a,b\n1,2')).toBe('| a | b |\n| --- | --- |\n| 1 | 2 |')
  })
})

describe('expansion pack: security tools', () => {
  it('rot13 is self-inverse', () => {
    expect(rot13(rot13('Hello World'))).toBe('Hello World')
  })
  it('caesar cipher round-trips with inverse shift', () => {
    const enc = caesarCipher('Attack at dawn', 5)
    expect(caesarCipher(enc, -5)).toBe('Attack at dawn')
  })
  it('scores password strength', () => {
    expect(passwordStrength('weak')).toContain('Very weak')
    expect(passwordStrength('Str0ng!Password2024')).toContain('strong')
  })
  it('round-trips morse code', () => {
    expect(morseToText(textToMorse('SOS'))).toBe('SOS')
  })
  it('converts to nato alphabet', () => {
    expect(toNato('AB')).toBe('Alfa Bravo')
  })
  it('generates sha-1 hashes of correct length', async () => {
    expect(await sha1('hello')).toHaveLength(40)
  })
})

describe('expansion pack: calculators', () => {
  it('calculates percentage change', () => {
    expect(percentageChange(100, 120)).toBeCloseTo(20)
    expect(percentageChange(100, 80)).toBeCloseTo(-20)
  })
  it('calculates gcd and lcm', () => {
    expect(gcdLcm([12, 18])).toEqual({ gcd: 6, lcm: 36 })
  })
  it('checks primality', () => {
    expect(isPrime(17)).toBe(true)
    expect(isPrime(18)).toBe(false)
  })
  it('calculates exact factorials with BigInt precision', () => {
    expect(factorial(10)).toBe('3628800')
    expect(factorial(20)).toBe('2432902008176640000')
  })
  it('round-trips roman numerals', () => {
    expect(toRoman(1994)).toBe('MCMXCIV')
    expect(fromRoman('MCMXCIV')).toBe(1994)
  })
  it('computes statistics', () => {
    const out = textStatistics('1, 2, 3, 4, 5')
    expect(out).toContain('Mean: 3.0000')
    expect(out).toContain('Median: 3')
  })
  it('simplifies aspect ratios', () => {
    expect(aspectRatio(1920, 1080)).toBe('16:9')
  })
})

describe('expansion pack: registry wiring', () => {
  const newIds = [
    'palindrome-checker', 'remove-punctuation', 'remove-numbers', 'vowel-consonant-counter',
    'shuffle-lines', 'text-truncator', 'base32', 'hex-text-converter', 'css-minifier',
    'html-minifier', 'query-string-parser', 'markdown-table-generator', 'rot13-cipher',
    'caesar-cipher', 'password-strength-checker', 'morse-code-translator',
    'nato-alphabet-converter', 'sha-1', 'percentage-change-calculator', 'gcd-lcm-calculator',
    'prime-checker', 'factorial-calculator', 'roman-numeral-converter', 'statistics-calculator',
    'aspect-ratio-calculator', 'pdf-page-counter',
  ]
  it('registers all 26 new tools with valid categories', () => {
    for (const id of newIds) {
      const t = getTool(id)
      expect(t, `missing tool: ${id}`).toBeDefined()
      expect(['Text', 'Developer', 'PDF', 'Image', 'Calculators', 'Security']).toContain(t!.category)
    }
  })
  it('brings total tool count to 105', () => {
    expect(tools.length).toBe(105)
  })
})
