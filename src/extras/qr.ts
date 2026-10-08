// Minimal dependency-free QR Code encoder: byte mode, versions 1-10, error correction L/M/Q/H.
export type EcLevel = 'L' | 'M' | 'Q' | 'H'

// Per version 1..10: [EC codewords per block, [[blocks, data codewords per block], ...]]
const EC: Record<EcLevel, [number, [number, number][]][]> = {
  L: [[7, [[1, 19]]], [10, [[1, 34]]], [15, [[1, 55]]], [20, [[1, 80]]], [26, [[1, 108]]], [18, [[2, 68]]], [20, [[2, 78]]], [24, [[2, 97]]], [30, [[2, 116]]], [18, [[2, 68], [2, 69]]]],
  M: [[10, [[1, 16]]], [16, [[1, 28]]], [26, [[1, 44]]], [18, [[2, 32]]], [24, [[2, 43]]], [16, [[4, 27]]], [18, [[4, 31]]], [22, [[2, 38], [2, 39]]], [22, [[3, 36], [2, 37]]], [26, [[4, 43], [1, 44]]]],
  Q: [[13, [[1, 13]]], [22, [[1, 22]]], [18, [[2, 17]]], [26, [[2, 24]]], [18, [[2, 15], [2, 16]]], [24, [[4, 19]]], [18, [[2, 14], [4, 15]]], [22, [[4, 18], [2, 19]]], [20, [[4, 16], [4, 17]]], [24, [[6, 19], [2, 20]]]],
  H: [[17, [[1, 9]]], [28, [[1, 16]]], [22, [[2, 13]]], [16, [[4, 9]]], [22, [[2, 11], [2, 12]]], [28, [[4, 15]]], [26, [[4, 13], [1, 14]]], [26, [[4, 14], [2, 15]]], [24, [[4, 12], [4, 13]]], [28, [[6, 15], [2, 16]]]],
}
const FORMAT_BITS: Record<EcLevel, number> = { L: 1, M: 0, Q: 3, H: 2 }
const ALIGN = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]]

const EXP: number[] = []
const LOG: number[] = []
for (let i = 0, x = 1; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d }
const gmul = (a: number, b: number) => (a && b ? EXP[(LOG[a] + LOG[b]) % 255] : 0)

function rsEncode(data: number[], ecLen: number): number[] {
  let gen = [1]
  for (let i = 0; i < ecLen; i++) {
    const next = new Array(gen.length + 1).fill(0)
    gen.forEach((c, j) => { next[j] ^= c; next[j + 1] ^= gmul(c, EXP[i]) })
    gen = next
  }
  const rem = new Array(ecLen).fill(0)
  for (const b of data) {
    const f = b ^ rem.shift()!
    rem.push(0)
    gen.slice(1).forEach((c, j) => { rem[j] ^= gmul(c, f) })
  }
  return rem
}

const totalData = (level: EcLevel, v: number) => EC[level][v - 1][1].reduce((s, [n, d]) => s + n * d, 0)
export const qrMaxBytes = (level: EcLevel) => totalData(level, 10) - 3 // 4-bit mode + 16-bit count at v10 = 20 bits -> 3 bytes

export function qrMatrix(text: string, level: EcLevel = 'M'): boolean[][] {
  const bytes = Array.from(new TextEncoder().encode(text))
  let version = 0
  for (let v = 1; v <= 10 && !version; v++) {
    const countBits = v < 10 ? 8 : 16
    if (4 + countBits + bytes.length * 8 <= totalData(level, v) * 8) version = v
  }
  if (!version) throw new Error(`Text is too long for this QR generator (max ${qrMaxBytes(level)} bytes at level ${level}). Shorten it or choose a lower error-correction level.`)

  // Data bit stream
  const bits: number[] = []
  const push = (val: number, len: number) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1) }
  push(4, 4); push(bytes.length, version < 10 ? 8 : 16); bytes.forEach((b) => push(b, 8))
  const cap = totalData(level, version) * 8
  for (let i = 0; i < 4 && bits.length < cap; i++) bits.push(0)
  while (bits.length % 8) bits.push(0)
  const data: number[] = []
  for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(''), 2))
  for (let pad = 0xec; data.length < cap / 8; pad ^= 0xec ^ 0x11) data.push(pad)

  // Split into blocks, add error correction, interleave
  const [ecLen, groups] = EC[level][version - 1]
  const blocks: { d: number[]; e: number[] }[] = []
  let pos = 0
  for (const [count, size] of groups) for (let i = 0; i < count; i++) { const d = data.slice(pos, pos + size); pos += size; blocks.push({ d, e: rsEncode(d, ecLen) }) }
  const out: number[] = []
  for (let i = 0; i < Math.max(...blocks.map((b) => b.d.length)); i++) blocks.forEach((b) => { if (i < b.d.length) out.push(b.d[i]) })
  for (let i = 0; i < ecLen; i++) blocks.forEach((b) => out.push(b.e[i]))

  // Matrix
  const size = 17 + 4 * version
  const mod: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false))
  const fn: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false))
  const set = (x: number, y: number, dark: boolean) => { mod[y][x] = dark; fn[y][x] = true }
  const bit = (n: number, i: number) => ((n >>> i) & 1) === 1

  for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0) }
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]]) {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const x = cx + dx, y = cy + dy, d = Math.max(Math.abs(dx), Math.abs(dy))
      if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, d !== 2 && d !== 4)
    }
  }
  const al = ALIGN[version - 1]
  al.forEach((ax, i) => al.forEach((ay, j) => {
    if ((i === 0 && j === 0) || (i === 0 && j === al.length - 1) || (i === al.length - 1 && j === 0)) return
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
  }))

  const drawFormat = (mask: number) => {
    const d = (FORMAT_BITS[level] << 3) | mask
    let rem = d
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537)
    const f = ((d << 10) | rem) ^ 0x5412
    for (let i = 0; i <= 5; i++) set(8, i, bit(f, i))
    set(8, 7, bit(f, 6)); set(8, 8, bit(f, 7)); set(7, 8, bit(f, 8))
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(f, i))
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(f, i))
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(f, i))
    set(8, size - 8, true)
  }
  drawFormat(0)
  if (version >= 7) {
    let rem = version
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25)
    const v = (version << 12) | rem
    for (let i = 0; i < 18; i++) { const a = size - 11 + (i % 3), b = Math.floor(i / 3); set(a, b, bit(v, i)); set(b, a, bit(v, i)) }
  }

  // Place data bits in the zigzag pattern
  let k = 0
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) {
      const x = right - j, y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert
      if (!fn[y][x] && k < out.length * 8) { mod[y][x] = bit(out[k >>> 3], 7 - (k & 7)); k++ }
    }
  }

  const MASKS = [
    (x: number, y: number) => (x + y) % 2 === 0, (_x: number, y: number) => y % 2 === 0, (x: number) => x % 3 === 0,
    (x: number, y: number) => (x + y) % 3 === 0, (x: number, y: number) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
    (x: number, y: number) => ((x * y) % 2) + ((x * y) % 3) === 0, (x: number, y: number) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
    (x: number, y: number) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
  ]
  const applyMask = (m: number) => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && MASKS[m](x, y)) mod[y][x] = !mod[y][x] }
  const penalty = () => {
    let p = 0
    const lines: boolean[][] = []
    for (let i = 0; i < size; i++) { lines.push(mod[i]); lines.push(mod.map((r) => r[i])) }
    for (const line of lines) {
      let run = 1
      for (let i = 1; i <= size; i++) {
        if (i < size && line[i] === line[i - 1]) run++
        else { if (run >= 5) p += run - 2; run = 1 }
      }
      const s = line.map((b) => (b ? '1' : '0')).join('')
      for (const pat of ['10111010000', '00001011101']) { let at = s.indexOf(pat); while (at >= 0) { p += 40; at = s.indexOf(pat, at + 1) } }
    }
    for (let y = 0; y < size - 1; y++) for (let x = 0; x < size - 1; x++) if (mod[y][x] === mod[y][x + 1] && mod[y][x] === mod[y + 1][x] && mod[y][x] === mod[y + 1][x + 1]) p += 3
    const dark = mod.flat().filter(Boolean).length
    return p + Math.floor(Math.abs((dark * 100) / (size * size) - 50) / 5) * 10
  }
  let best = 0, bestScore = Infinity
  for (let m = 0; m < 8; m++) {
    applyMask(m); drawFormat(m)
    const s = penalty()
    if (s < bestScore) { bestScore = s; best = m }
    applyMask(m)
  }
  applyMask(best); drawFormat(best)
  return mod
}

export function qrSvg(matrix: boolean[][], px = 256, margin = 4, fg = '#000000', bg = '#ffffff'): string {
  const n = matrix.length + margin * 2
  let path = ''
  matrix.forEach((row, y) => row.forEach((d, x) => { if (d) path += `M${x + margin} ${y + margin}h1v1h-1z` }))
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges"><rect width="${n}" height="${n}" fill="${bg}"/><path d="${path}" fill="${fg}"/></svg>`
}
