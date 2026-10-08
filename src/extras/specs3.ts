// Third batch: productivity, text, developer, security and calculators.
import { fmt, num, type Row, type Spec } from './specs'
import { addDays, clockMin, need, parseDate, showDate, sig, todayStr } from './specs2'

const rand = (n: number) => { const b = new Uint32Array(1); const lim = Math.floor(0x100000000 / n) * n; do crypto.getRandomValues(b); while (b[0] >= lim); return b[0] % n }
const lines = (t: string) => (t ?? '').split(/\r?\n/)
const TA = (key: string, label: string, def = '', placeholder?: string) => ({ key, label, type: 'textarea' as const, def, placeholder })

/* ---------- Productivity ---------- */
const businessDays: Spec = {
  fields: [{ key: 'a', label: 'Start date', type: 'date', def: todayStr() }, { key: 'b', label: 'End date', type: 'date', def: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) }, { key: 'inc', label: 'Count the end date', type: 'select', options: [['yes', 'Yes'], ['no', 'No']], def: 'yes' }],
  run: (v) => {
    let a = parseDate(v.a), b = parseDate(v.b)
    if (b < a) [a, b] = [b, a]
    let biz = 0, total = 0
    for (let d = a; d <= b; d = addDays(d, 1)) { if (v.inc === 'no' && d.getTime() === b.getTime()) break; total++; const w = d.getUTCDay(); if (w !== 0 && w !== 6) biz++ }
    need(total <= 36600, 'Choose a range under 100 years.')
    return { rows: [['Business days (Mon–Fri)', String(biz)], ['Weekend days', String(total - biz)], ['Total calendar days', String(total)]], note: 'Public holidays are not excluded.' }
  },
}
const isoWeek = (d: Date) => { const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())); const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return [t.getUTCFullYear(), Math.ceil(((t.getTime() - y0.getTime()) / 86400000 + 1) / 7)] as const }
const dateFacts = (d: Date): Row[] => {
  const y = d.getUTCFullYear(), start = Date.UTC(y, 0, 1), doy = Math.floor((d.getTime() - start) / 86400000) + 1
  const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0, [wy, w] = isoWeek(d)
  return [['Day of the week', d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })], ['ISO week number', `Week ${w} of ${wy}`], ['Day of the year', `${doy} of ${leap ? 366 : 365}`], ['Quarter', `Q${Math.floor(d.getUTCMonth() / 3) + 1}`], ['Days left in the year', String((leap ? 366 : 365) - doy)], ['Leap year', leap ? 'Yes' : 'No']]
}
const weekNumber: Spec = { fields: [{ key: 'd', label: 'Date', type: 'date', def: todayStr() }], run: (v) => ({ rows: dateFacts(parseDate(v.d)) }) }
const dayOfWeek: Spec = { fields: [{ key: 'd', label: 'Date', type: 'date', def: '2000-01-01' }], run: (v) => { const d = parseDate(v.d); return { rows: [['Full date', showDate(d)], ...dateFacts(d)] } } }
const meetingCost: Spec = {
  fields: [{ key: 'n', label: 'Attendees', type: 'number', def: '8', min: 1 }, { key: 'rate', label: 'Average hourly cost per person', type: 'number', def: '40', min: 0 }, { key: 'min', label: 'Meeting length (minutes)', type: 'number', def: '60', min: 1 }],
  run: (v) => { const n = num(v, 'n'), r = num(v, 'rate'), m = num(v, 'min'); need(n >= 1 && m > 0 && r >= 0, 'Enter positive values.'); const c = n * r * (m / 60); return { rows: [['Meeting cost', fmt(c)], ['Cost per minute', fmt(c / m)], ['Person-hours spent', fmt((n * m) / 60)]] } },
}
const workHours: Spec = {
  fields: [{ key: 'start', label: 'Start time (HH:MM)', type: 'text', def: '09:00' }, { key: 'end', label: 'End time (HH:MM)', type: 'text', def: '17:30' }, { key: 'brk', label: 'Unpaid break (minutes)', type: 'number', def: '30', min: 0 }, { key: 'days', label: 'Days worked per week', type: 'number', def: '5', min: 1, max: 7 }],
  run: (v) => {
    let m = clockMin(v.end) - clockMin(v.start); if (m < 0) m += 1440
    m -= num(v, 'brk'); need(m > 0, 'The break is longer than the shift.')
    const h = m / 60, d = num(v, 'days')
    return { rows: [['Hours per day', `${Math.floor(m / 60)}h ${Math.round(m % 60)}m (${fmt(h)} h)`], ['Hours per week', fmt(h * d)], ['Hours per month (avg.)', fmt((h * d * 52) / 12)], ['Hours per year', fmt(h * d * 52)]] }
  },
}
const lottery: Spec = {
  manual: true, runLabel: 'Generate numbers',
  fields: [{ key: 'count', label: 'Numbers per line', type: 'number', def: '6', min: 1, max: 20 }, { key: 'max', label: 'Highest number', type: 'number', def: '49', min: 2, max: 1000 }, { key: 'sets', label: 'Number of lines', type: 'number', def: '5', min: 1, max: 20 }],
  run: (v) => {
    const c = Math.floor(num(v, 'count')), m = Math.floor(num(v, 'max')), s = Math.floor(num(v, 'sets'))
    need(c <= m, 'You cannot pick more unique numbers than the highest number.')
    return { rows: Array.from({ length: s }, (_, i): Row => { const set = new Set<number>(); while (set.size < c) set.add(rand(m) + 1); return [`Line ${i + 1}`, [...set].sort((a, b) => a - b).join(' – ')] }), note: 'Numbers are random and unique within each line. They do not improve your odds.' }
  },
}

/* ---------- Text ---------- */
const repeater: Spec = {
  fields: [TA('text', 'Text to repeat', 'Hello! '), { key: 'n', label: 'Repeat times (max 1000)', type: 'number', def: '5', min: 1, max: 1000 }, { key: 'sep', label: 'Separator', type: 'select', options: [['', 'None'], [' ', 'Space'], ['\n', 'New line'], [', ', 'Comma']], def: '\n' }],
  run: (v) => { const n = Math.floor(num(v, 'n')); need(n >= 1 && n <= 1000 && (v.text ?? '') !== '', 'Enter text and a repeat count from 1 to 1000.'); return { text: Array(n).fill(v.text).join(v.sep ?? '') } },
}
const letters = (s: string) => (s ?? '').toLowerCase().normalize('NFD').replace(/[^\p{L}\p{N}]/gu, '').split('').sort().join('')
const anagram: Spec = {
  fields: [{ key: 'a', label: 'First word or phrase', type: 'text', def: 'Listen' }, { key: 'b', label: 'Second word or phrase', type: 'text', def: 'Silent' }],
  run: (v) => { need(letters(v.a) !== '' && letters(v.b) !== '', 'Enter two words or phrases.'); const ok = letters(v.a) === letters(v.b); return { rows: [['Anagrams?', ok ? 'Yes — they use the same letters' : 'No — the letters differ']], note: 'Ignores case, spaces and punctuation.' } },
}
const accents: Spec = { fields: [TA('t', 'Text with accents', 'Crème brûlée à la façon de Zoë — São Paulo')], run: (v) => ({ text: (v.t ?? '').normalize('NFD').replace(/\p{M}/gu, '').normalize('NFC').replace(/ß/g, 'ss').replace(/[æÆ]/g, (c) => (c === 'æ' ? 'ae' : 'AE')).replace(/[øØ]/g, (c) => (c === 'ø' ? 'o' : 'O')).replace(/[łŁ]/g, (c) => (c === 'ł' ? 'l' : 'L')) }) }
const lineNumbers: Spec = {
  fields: [TA('t', 'Text', 'First line\nSecond line\nThird line'), { key: 'start', label: 'Start at', type: 'number', def: '1' }, { key: 'sep', label: 'After the number', type: 'select', options: [['. ', 'Period (1. )'], [') ', 'Bracket (1) )'], [': ', 'Colon (1: )'], ['\t', 'Tab']], def: '. ' }],
  run: (v) => { const s = Math.floor(num(v, 'start')); return { text: lines(v.t).map((l, i) => `${s + i}${v.sep ?? '. '}${l}`).join('\n') } },
}
const FLIP: Record<string, string> = { a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z', A: '∀', B: 'ᗺ', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'Ⅎ', G: '⅁', H: 'H', I: 'I', J: 'ſ', K: 'ꓘ', L: '⅂', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Ό', R: 'ꓤ', S: 'S', T: '⊥', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0', '.': '˙', ',': "'", '?': '¿', '!': '¡', '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', _: '‾', "'": ',', '"': '„' }
const upside: Spec = { fields: [TA('t', 'Your text', 'Hello World!')], run: (v) => ({ text: [...(v.t ?? '')].map((c) => FLIP[c] ?? c).reverse().join('') }) }
const emojiRemover: Spec = { fields: [TA('t', 'Text with emoji', 'Launch day 🚀🎉 is here ❤️ — see you 👋🏽!')], run: (v) => { const t = (v.t ?? '').replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}‍️⃣]/gu, '').replace(/[ \t]{2,}/g, ' ').replace(/ +([,.!?])/g, '$1'); return { text: t.trim(), note: 'Plain digits and symbols such as # and * are kept.' } } }
const SMALL = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'vs', 'via'])
const titleCase: Spec = {
  fields: [TA('t', 'Text', 'the quick brown fox jumps over the lazy dog'), { key: 'style', label: 'Style', type: 'select', options: [['ap', 'Headline style (small words lowercase)'], ['all', 'Capitalize every word']], def: 'ap' }],
  run: (v) => { const w = (v.t ?? '').split(/(\s+)/); let first = true; return { text: w.map((p) => { if (/^\s*$/.test(p)) return p; const lower = p.toLowerCase(); const keep = v.style !== 'all' && !first && SMALL.has(lower); first = false; return keep ? lower : lower.charAt(0).toUpperCase() + lower.slice(1) }).join('') } },
}
const hashtags: Spec = {
  fields: [TA('t', 'Phrases (one per line or comma separated)', 'summer sale\nnew product launch, small business tips'), { key: 'style', label: 'Style', type: 'select', options: [['camel', 'CamelCase (#SummerSale)'], ['lower', 'lowercase (#summersale)']], def: 'camel' }],
  run: (v) => {
    const tags = (v.t ?? '').split(/[\n,]+/).map((p) => p.trim()).filter(Boolean).map((p) => { const w = p.normalize('NFD').replace(/\p{M}/gu, '').split(/[^\p{L}\p{N}]+/u).filter(Boolean); return '#' + (v.style === 'lower' ? w.join('').toLowerCase() : w.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join('')) }).filter((t) => t.length > 1)
    need(tags.length > 0, 'Enter at least one phrase.')
    return { text: tags.join(' '), note: `${tags.length} hashtag${tags.length > 1 ? 's' : ''}. Most platforms work best with 3–10.` }
  },
}

/* ---------- Developer ---------- */
const urlParser: Spec = {
  fields: [{ key: 'u', label: 'URL', type: 'text', def: 'https://user@example.com:8080/path/page?x=1&y=two#section' }],
  run: (v) => {
    let u: URL; try { u = new URL((v.u ?? '').trim()) } catch { throw new Error('Enter a full URL including https://') }
    const rows: Row[] = [['Protocol', u.protocol], ['Username', u.username || '—'], ['Hostname', u.hostname], ['Port', u.port || '(default)'], ['Path', u.pathname], ['Query string', u.search || '—'], ['Hash', u.hash || '—'], ['Origin', u.origin]]
    u.searchParams.forEach((val, k) => rows.push([`Param: ${k}`, val]))
    return { rows }
  },
}
const stringEscape: Spec = {
  fields: [TA('t', 'Text', 'He said "hello"\nNew line'), { key: 'mode', label: 'Mode', type: 'select', options: [['jsonE', 'Escape for JSON / JavaScript string'], ['jsonU', 'Unescape JSON / JavaScript string'], ['regex', 'Escape for regular expression'], ['sql', "Escape for SQL (single quotes)"]], def: 'jsonE' }],
  run: (v) => {
    const t = v.t ?? ''
    if (v.mode === 'jsonU') { try { const r = JSON.parse(`"${t.replace(/^"|"$/g, '').replace(/(?<!\\)"/g, '\\"')}"`); return { text: String(r) } } catch { throw new Error('That is not a valid escaped string.') } }
    if (v.mode === 'regex') return { text: t.replace(/[.*+?^${}()|[\]\\\/-]/g, '\\$&') }
    if (v.mode === 'sql') return { text: t.replace(/'/g, "''") }
    return { text: JSON.stringify(t).slice(1, -1) }
  },
}
const MIME: [string, string][] = [['html', 'text/html'], ['htm', 'text/html'], ['css', 'text/css'], ['js', 'text/javascript'], ['mjs', 'text/javascript'], ['json', 'application/json'], ['xml', 'application/xml'], ['csv', 'text/csv'], ['txt', 'text/plain'], ['md', 'text/markdown'], ['pdf', 'application/pdf'], ['zip', 'application/zip'], ['gz', 'application/gzip'], ['tar', 'application/x-tar'], ['7z', 'application/x-7z-compressed'], ['rar', 'application/vnd.rar'], ['doc', 'application/msword'], ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], ['xls', 'application/vnd.ms-excel'], ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'], ['ppt', 'application/vnd.ms-powerpoint'], ['pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'], ['png', 'image/png'], ['jpg', 'image/jpeg'], ['jpeg', 'image/jpeg'], ['gif', 'image/gif'], ['webp', 'image/webp'], ['avif', 'image/avif'], ['svg', 'image/svg+xml'], ['ico', 'image/x-icon'], ['bmp', 'image/bmp'], ['tiff', 'image/tiff'], ['mp3', 'audio/mpeg'], ['wav', 'audio/wav'], ['ogg', 'audio/ogg'], ['m4a', 'audio/mp4'], ['flac', 'audio/flac'], ['mp4', 'video/mp4'], ['webm', 'video/webm'], ['mov', 'video/quicktime'], ['avi', 'video/x-msvideo'], ['mkv', 'video/x-matroska'], ['woff', 'font/woff'], ['woff2', 'font/woff2'], ['ttf', 'font/ttf'], ['otf', 'font/otf'], ['wasm', 'application/wasm'], ['yaml', 'application/yaml'], ['yml', 'application/yaml'], ['sh', 'application/x-sh'], ['apk', 'application/vnd.android.package-archive'], ['epub', 'application/epub+zip'], ['ics', 'text/calendar'], ['rtf', 'application/rtf'], ['webmanifest', 'application/manifest+json']]
const mimeLookup: Spec = {
  fields: [{ key: 'q', label: 'File extension or MIME type', type: 'text', def: 'png', placeholder: 'e.g. pdf, .mp4 or image/' }],
  run: (v) => { const q = (v.q ?? '').trim().toLowerCase().replace(/^\./, ''); const hits = MIME.filter(([e, m]) => q === '' || e.includes(q) || m.includes(q)); need(hits.length > 0, 'No match. Try another extension.'); return { rows: hits.slice(0, 30).map(([e, m]): Row => [`.${e}`, m]) } },
}
const PORTS: [number, string][] = [[20, 'FTP data'], [21, 'FTP control'], [22, 'SSH / SFTP'], [23, 'Telnet'], [25, 'SMTP'], [53, 'DNS'], [67, 'DHCP server'], [68, 'DHCP client'], [69, 'TFTP'], [80, 'HTTP'], [110, 'POP3'], [119, 'NNTP'], [123, 'NTP'], [143, 'IMAP'], [161, 'SNMP'], [389, 'LDAP'], [443, 'HTTPS'], [445, 'SMB'], [465, 'SMTPS'], [514, 'Syslog'], [587, 'SMTP submission'], [636, 'LDAPS'], [993, 'IMAPS'], [995, 'POP3S'], [1080, 'SOCKS proxy'], [1433, 'Microsoft SQL Server'], [1521, 'Oracle Database'], [1883, 'MQTT'], [2049, 'NFS'], [2181, 'ZooKeeper'], [2375, 'Docker (unencrypted)'], [3000, 'Node / React dev servers'], [3306, 'MySQL / MariaDB'], [3389, 'Remote Desktop (RDP)'], [4200, 'Angular dev server'], [5000, 'Flask / dev servers'], [5173, 'Vite dev server'], [5432, 'PostgreSQL'], [5672, 'RabbitMQ (AMQP)'], [5900, 'VNC'], [6379, 'Redis'], [6443, 'Kubernetes API'], [8000, 'Django / HTTP alt'], [8080, 'HTTP alternate / proxy'], [8443, 'HTTPS alternate'], [9000, 'PHP-FPM / SonarQube'], [9092, 'Apache Kafka'], [9200, 'Elasticsearch'], [11211, 'Memcached'], [27017, 'MongoDB']]
const portLookup: Spec = {
  fields: [{ key: 'q', label: 'Port number or service name', type: 'text', def: '443', placeholder: 'e.g. 5432 or redis' }],
  run: (v) => { const q = (v.q ?? '').trim().toLowerCase(); const hits = PORTS.filter(([p, s]) => q === '' || String(p) === q || String(p).startsWith(q) || s.toLowerCase().includes(q)); need(hits.length > 0, 'No match in the common-ports list.'); return { rows: hits.slice(0, 30).map(([p, s]): Row => [String(p), s]) } },
}
const ipv4 = (s: string) => { const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(s); if (!m) return null; const o = m.slice(1).map(Number); return o.every((x, i) => x <= 255 && String(x) === m[i + 1]) ? o : null }
const ipValidator: Spec = {
  fields: [{ key: 'ip', label: 'IP address', type: 'text', def: '192.168.1.10', placeholder: 'IPv4 or IPv6' }],
  run: (v) => {
    const s = (v.ip ?? '').trim(); const o = ipv4(s)
    if (o) {
      const [a, b] = o
      const kind = a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) ? 'Private (RFC 1918)' : a === 127 ? 'Loopback' : a === 169 && b === 254 ? 'Link-local' : a >= 224 && a <= 239 ? 'Multicast' : a === 0 ? 'Unspecified' : a === 100 && b >= 64 && b <= 127 ? 'Carrier-grade NAT' : 'Public'
      return { rows: [['Valid', 'Yes — IPv4'], ['Type', kind], ['Class', a < 128 ? 'A' : a < 192 ? 'B' : a < 224 ? 'C' : a < 240 ? 'D (multicast)' : 'E (reserved)'], ['Binary', o.map((x) => x.toString(2).padStart(8, '0')).join('.')], ['Integer', String(((o[0] * 256 + o[1]) * 256 + o[2]) * 256 + o[3])]] }
    }
    const v6 = /^[0-9a-f:.]+$/i.test(s) && s.includes(':') && (() => { try { new URL(`http://[${s}]/`); return true } catch { return false } })()
    need(v6, 'Not a valid IPv4 or IPv6 address.')
    const l = s.toLowerCase()
    return { rows: [['Valid', 'Yes — IPv6'], ['Type', l === '::1' ? 'Loopback' : l.startsWith('fe80') ? 'Link-local' : /^f[cd]/.test(l) ? 'Unique local (private)' : l.startsWith('ff') ? 'Multicast' : l === '::' ? 'Unspecified' : 'Global / other']] }
  },
}
const diffJson = (a: unknown, b: unknown, path: string, out: Row[]) => {
  if (JSON.stringify(a) === JSON.stringify(b)) return
  const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null
  if (isObj(a) && isObj(b) && Array.isArray(a) === Array.isArray(b)) {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const p = Array.isArray(a) ? `${path}[${k}]` : path ? `${path}.${k}` : k
      if (!(k in a)) out.push([`+ ${p}`, `added: ${JSON.stringify(b[k])}`])
      else if (!(k in b)) out.push([`− ${p}`, `removed: ${JSON.stringify(a[k])}`])
      else diffJson(a[k], b[k], p, out)
    }
  } else out.push([`~ ${path || '(root)'}`, `${JSON.stringify(a)} → ${JSON.stringify(b)}`])
}
const jsonDiff: Spec = {
  fields: [TA('a', 'Original JSON', '{"name":"Ada","age":36,"tags":["a","b"]}'), TA('b', 'Changed JSON', '{"name":"Ada","age":37,"tags":["a","c"],"city":"London"}')],
  run: (v) => {
    let a: unknown, b: unknown
    try { a = JSON.parse(v.a) } catch { throw new Error('The original JSON is not valid.') }
    try { b = JSON.parse(v.b) } catch { throw new Error('The changed JSON is not valid.') }
    const out: Row[] = []; diffJson(a, b, '', out)
    return out.length ? { rows: out.slice(0, 200), note: `${out.length} difference${out.length > 1 ? 's' : ''}. + added, − removed, ~ changed.` } : { rows: [['Result', 'The two JSON documents are identical.']] }
  },
}
const b64url = (b: ArrayBuffer | Uint8Array) => { const u = b instanceof Uint8Array ? b : new Uint8Array(b); let s = ''; u.forEach((c) => (s += String.fromCharCode(c))); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') }
const jwtGen: Spec = {
  fields: [{ key: 'alg', label: 'Algorithm', type: 'select', options: ['HS256', 'HS384', 'HS512'], def: 'HS256' }, TA('payload', 'Payload (JSON)', '{"sub":"1234567890","name":"Ada","iat":1700000000}'), { key: 'secret', label: 'Secret', type: 'text', def: 'your-256-bit-secret' }],
  run: async (v) => {
    let payload: unknown; try { payload = JSON.parse(v.payload) } catch { throw new Error('The payload is not valid JSON.') }
    need(typeof payload === 'object' && payload !== null && !Array.isArray(payload), 'The payload must be a JSON object.')
    need((v.secret ?? '') !== '', 'Enter a secret.')
    const enc = new TextEncoder(), alg = v.alg || 'HS256', hash = `SHA-${alg.slice(2)}`
    const head = b64url(enc.encode(JSON.stringify({ alg, typ: 'JWT' }))), body = b64url(enc.encode(JSON.stringify(payload)))
    const key = await crypto.subtle.importKey('raw', enc.encode(v.secret), { name: 'HMAC', hash }, false, ['sign'])
    const sig = b64url(await crypto.subtle.sign('HMAC', key, enc.encode(`${head}.${body}`)))
    return { text: `${head}.${body}.${sig}`, note: 'Signed in your browser. Use test secrets only — never paste production keys into any website.' }
  },
}
export const parseUserAgent = (ua: string) => {
  const pick = (list: [string, RegExp][]) => { for (const [n, r] of list) { const m = r.exec(ua); if (m) return m[1] ? `${n} ${m[1]}` : n } return 'Unknown' }
  const browser = pick([['Edge', /Edg(?:e|A|iOS)?\/([\d.]+)/], ['Opera', /(?:OPR|Opera)\/([\d.]+)/], ['Samsung Internet', /SamsungBrowser\/([\d.]+)/], ['Firefox', /(?:Firefox|FxiOS)\/([\d.]+)/], ['Chrome', /(?:Chrome|CriOS)\/([\d.]+)/], ['Safari', /Version\/([\d.]+).*Safari/], ['Internet Explorer', /(?:MSIE |rv:)([\d.]+)\) like Gecko|MSIE ([\d.]+)/]])
  const os = pick([['Windows', /Windows NT ([\d.]+)/], ['Android', /Android ([\d.]+)/], ['iOS', /(?:iPhone|iPad).*OS ([\d_]+)/], ['macOS', /Mac OS X ([\d_]+)/], ['Chrome OS', /CrOS/], ['Linux', /Linux/]]).replace(/_/g, '.')
  const device = /iPad|Tablet/i.test(ua) ? 'Tablet' : /Mobi|iPhone|Android.*Mobile/i.test(ua) ? 'Mobile' : /bot|crawl|spider/i.test(ua) ? 'Bot' : 'Desktop'
  const engine = /Gecko\/\d/.test(ua) && /Firefox/.test(ua) ? 'Gecko' : /AppleWebKit/.test(ua) ? (/Chrome|Chromium|Edg|OPR/.test(ua) ? 'Blink' : 'WebKit') : /Trident/.test(ua) ? 'Trident' : 'Unknown'
  return { browser, os, device, engine }
}
const uaParser: Spec = {
  fields: [TA('ua', 'User-agent string', typeof navigator !== 'undefined' ? navigator.userAgent : '')],
  run: (v) => { const ua = (v.ua ?? '').trim(); need(ua !== '', 'Paste a user-agent string.'); const r = parseUserAgent(ua); return { rows: [['Browser', r.browser], ['Operating system', r.os], ['Device type', r.device], ['Rendering engine', r.engine]] } },
}

/* ---------- Security ---------- */
const WORDS = 'able acid aged also area army away baby back ball band bank base bath bear beat bell belt best bike bird blue boat body bold bone book boot born boss bowl bulb burn bush busy cafe cake calm camp card care cart case cash cast cave cell chef chip city clay clip club coal coat code coin cold cook cool copy cord core corn cost crew crop dark data dawn deal deep deer desk dial dice dish dive door dove down draw drum duck dust duty each earn east easy edge epic even evil face fact fair fall farm fast fate fern film fire firm fish five flag flat flow foam fold folk food fork form fort four free frog fuel full fund gain game gate gear gift glad glow goal goat gold golf good grab gray grid grow gulf hair half hall hand hard harp hawk heat help herb hero high hill hint hold home hope horn host huge hunt idea inch iron isle jade jazz jump june jury keen keep kind king kite knee lake lamp land lane last lawn leaf lend lens life lift lime line link lion list live load loan lock loft long loop lord loud love luck lung made mail main map mark mask mast math meal mean melt menu mesh mild milk mind mint mist moon moss move much nail name navy neat nest next nice node noon north note oath ocean once only open oval pace pack page pair palm park part path peak pear pine pink pipe plan play plot plum pond pool port pure quiz race rain rank rare reed rice ride ring rise road rock roof room root rope rose ruby rule rush safe sage sail salt sand seal seed shop silk sing site skin slow snow soft soil song soul star stem sun swan tall tank team tent tide tile time tiny tone tool tree trip true tune twin vast view vine wall warm wave west wide wild wind wing wise wolf wood wool yard year zero zone'.split(' ')
const passphrase: Spec = {
  manual: true, runLabel: 'Generate passphrase',
  fields: [{ key: 'n', label: 'Number of words', type: 'number', def: '5', min: 3, max: 12 }, { key: 'sep', label: 'Separator', type: 'select', options: [['-', 'Hyphen (-)'], [' ', 'Space'], ['.', 'Period (.)'], ['_', 'Underscore (_)'], ['', 'None']], def: '-' }, { key: 'cap', label: 'Capitalize words', type: 'select', options: [['no', 'No'], ['yes', 'Yes']], def: 'no' }, { key: 'num', label: 'Add a number at the end', type: 'select', options: [['no', 'No'], ['yes', 'Yes']], def: 'no' }],
  run: (v) => {
    const n = Math.floor(num(v, 'n')); need(n >= 3 && n <= 12, 'Choose 3 to 12 words.')
    const w = Array.from({ length: n }, () => { const x = WORDS[rand(WORDS.length)]; return v.cap === 'yes' ? x[0].toUpperCase() + x.slice(1) : x })
    const pw = w.join(v.sep ?? '-') + (v.num === 'yes' ? (v.sep ?? '-') + String(rand(100)) : '')
    const bits = n * Math.log2(WORDS.length) + (v.num === 'yes' ? Math.log2(100) : 0)
    return { text: pw, rows: [['Estimated strength', `${Math.round(bits)} bits of entropy`], ['Word list size', String(WORDS.length)]], note: 'Generated with your browser’s secure random generator. 70+ bits is strong for most accounts.' }
  },
}
const pinGen: Spec = {
  manual: true, runLabel: 'Generate PINs',
  fields: [{ key: 'len', label: 'PIN length', type: 'number', def: '6', min: 3, max: 16 }, { key: 'n', label: 'How many', type: 'number', def: '5', min: 1, max: 50 }, { key: 'weak', label: 'Avoid easy patterns (1234, 1111)', type: 'select', options: [['yes', 'Yes'], ['no', 'No']], def: 'yes' }],
  run: (v) => {
    const len = Math.floor(num(v, 'len')), n = Math.floor(num(v, 'n')); need(len >= 3 && len <= 16 && n >= 1 && n <= 50, 'Choose a length from 3 to 16 and 1 to 50 PINs.')
    const weak = (p: string) => /^(\d)\1+$/.test(p) || '01234567890123456789'.includes(p) || '98765432109876543210'.includes(p)
    const out: string[] = []
    while (out.length < n) { const p = Array.from({ length: len }, () => rand(10)).join(''); if (v.weak === 'yes' && weak(p)) continue; out.push(p) }
    return { rows: out.map((p, i): Row => [`PIN ${i + 1}`, p]) }
  },
}
const hashId: Spec = {
  fields: [{ key: 'h', label: 'Hash', type: 'text', def: '5d41402abc4b2a76b9719d911017c592', placeholder: 'Paste a hash' }],
  run: (v) => {
    const h = (v.h ?? '').trim(); need(h !== '', 'Paste a hash to identify.')
    const guesses: string[] = []
    if (/^\$2[abxy]?\$\d{2}\$[./A-Za-z0-9]{53}$/.test(h)) guesses.push('bcrypt')
    else if (/^\$argon2(id|i|d)\$/.test(h)) guesses.push('Argon2')
    else if (/^\$6\$/.test(h)) guesses.push('SHA-512 crypt (Unix)')
    else if (/^\$5\$/.test(h)) guesses.push('SHA-256 crypt (Unix)')
    else if (/^\$1\$/.test(h)) guesses.push('MD5 crypt (Unix)')
    else if (/^\$P\$|^\$H\$/.test(h)) guesses.push('phpass (WordPress / phpBB)')
    else if (/^\$?pbkdf2/i.test(h)) guesses.push('PBKDF2')
    else if (/^[0-9a-f]+$/i.test(h)) {
      const map: Record<number, string[]> = { 8: ['CRC-32'], 16: ['MySQL 3.x', 'Half MD5'], 32: ['MD5', 'NTLM', 'MD4'], 40: ['SHA-1', 'RIPEMD-160'], 56: ['SHA-224'], 64: ['SHA-256', 'SHA3-256', 'BLAKE2s'], 96: ['SHA-384'], 128: ['SHA-512', 'SHA3-512', 'Whirlpool'] }
      guesses.push(...(map[h.length] ?? []))
    }
    need(guesses.length > 0, 'Could not match that hash to a common format.')
    return { rows: guesses.map((g, i): Row => [i === 0 ? 'Most likely' : 'Also possible', g]), note: 'Length and format only suggest a type — different algorithms can share a length.' }
  },
}

/* ---------- Calculators ---------- */
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))
const frac: Spec = {
  fields: [{ key: 'an', label: 'First numerator', type: 'number', def: '1' }, { key: 'ad', label: 'First denominator', type: 'number', def: '2' }, { key: 'op', label: 'Operation', type: 'select', options: [['+', 'Add (+)'], ['-', 'Subtract (−)'], ['*', 'Multiply (×)'], ['/', 'Divide (÷)']], def: '+' }, { key: 'bn', label: 'Second numerator', type: 'number', def: '1' }, { key: 'bd', label: 'Second denominator', type: 'number', def: '3' }],
  run: (v) => {
    const [an, ad, bn, bd] = ['an', 'ad', 'bn', 'bd'].map((k) => Math.round(num(v, k)))
    need(ad !== 0 && bd !== 0, 'A denominator cannot be zero.')
    let n: number, d: number
    if (v.op === '+') { n = an * bd + bn * ad; d = ad * bd } else if (v.op === '-') { n = an * bd - bn * ad; d = ad * bd } else if (v.op === '*') { n = an * bn; d = ad * bd } else { need(bn !== 0, 'You cannot divide by zero.'); n = an * bd; d = ad * bn }
    const g = gcd(n, d) || 1; n /= g; d /= g; if (d < 0) { n = -n; d = -d }
    const whole = Math.trunc(n / d), rem = Math.abs(n % d)
    return { rows: [['Result', d === 1 ? String(n) : `${n}/${d}`], ['Mixed number', rem === 0 ? String(whole) : whole === 0 ? `${n}/${d}` : `${whole} ${rem}/${d}`], ['Decimal', sig(n / d)]] }
  },
}
const quadratic: Spec = {
  fields: [{ key: 'a', label: 'a (x² coefficient)', type: 'number', def: '1' }, { key: 'b', label: 'b (x coefficient)', type: 'number', def: '-3' }, { key: 'c', label: 'c (constant)', type: 'number', def: '2' }],
  run: (v) => {
    const a = num(v, 'a'), b = num(v, 'b'), c = num(v, 'c'); need(a !== 0, 'a cannot be zero — that is not a quadratic equation.')
    const D = b * b - 4 * a * c, rows: Row[] = [['Discriminant (b² − 4ac)', sig(D)]]
    if (D > 0) { rows.push(['Root x₁', sig((-b + Math.sqrt(D)) / (2 * a))], ['Root x₂', sig((-b - Math.sqrt(D)) / (2 * a))]) } else if (D === 0) rows.push(['Root (double)', sig(-b / (2 * a))])
    else { const re = -b / (2 * a), im = Math.sqrt(-D) / (2 * a); rows.push(['Root x₁', `${sig(re)} + ${sig(Math.abs(im))}i`], ['Root x₂', `${sig(re)} − ${sig(Math.abs(im))}i`]) }
    rows.push(['Vertex', `(${sig(-b / (2 * a))}, ${sig(c - (b * b) / (4 * a))})`])
    return { rows }
  },
}
const POINTS: Record<string, number> = { 'A+': 4, A: 4, 'A-': 3.7, 'B+': 3.3, B: 3, 'B-': 2.7, 'C+': 2.3, C: 2, 'C-': 1.7, 'D+': 1.3, D: 1, 'D-': 0.7, F: 0 }
const gpa: Spec = {
  fields: [TA('t', 'One course per line: grade, credits', 'A 3\nB+ 4\nA- 3\nC 2', 'e.g. A 3')],
  run: (v) => {
    let pts = 0, cr = 0
    for (const l of lines(v.t).map((x) => x.trim()).filter(Boolean)) { const m = /^([A-Fa-f][+-]?)\s*[,:\s]\s*(\d+(?:\.\d+)?)$/.exec(l); need(!!m && POINTS[m![1].toUpperCase()] !== undefined, `Could not read "${l}". Use a format like "A- 3".`); pts += POINTS[m![1].toUpperCase()] * +m![2]; cr += +m![2] }
    need(cr > 0, 'Add at least one course.')
    return { rows: [['GPA (4.0 scale)', (pts / cr).toFixed(2)], ['Total credits', sig(cr)], ['Quality points', sig(pts)]], note: 'Uses the common US 4.0 scale (A = 4.0, A- = 3.7 …).' }
  },
}
const gradeCalc: Spec = {
  fields: [TA('t', 'Scores so far: score, weight % (one per line)', '85, 20\n78, 30\n92, 20', 'e.g. 85, 20'), { key: 'target', label: 'Target final grade (%)', type: 'number', def: '85' }],
  run: (v) => {
    let sum = 0, w = 0
    for (const l of lines(v.t).map((x) => x.trim()).filter(Boolean)) { const p = l.split(/[\s,;:]+/).map(Number); need(p.length === 2 && p.every(Number.isFinite), `Could not read "${l}". Use "score, weight".`); sum += p[0] * p[1]; w += p[1] }
    need(w > 0 && w <= 100, 'Weights must total more than 0 and at most 100%.')
    const t = num(v, 'target'), rows: Row[] = [['Current grade', `${fmt(sum / w)}%`], ['Weight completed', `${fmt(w, 0)}%`]]
    if (w < 100) rows.push([`Score needed on the remaining ${fmt(100 - w, 0)}% for ${fmt(t, 0)}%`, `${fmt(((t - sum / 100) / (100 - w)) * 100)}%`])
    return { rows }
  },
}
const ohm: Spec = {
  fields: [{ key: 'v', label: 'Voltage V (volts)', type: 'number', def: '12', placeholder: 'leave empty to solve' }, { key: 'i', label: 'Current I (amps)', type: 'number', def: '2', placeholder: 'leave empty to solve' }, { key: 'r', label: 'Resistance R (ohms)', type: 'number', placeholder: 'leave empty to solve' }, { key: 'p', label: 'Power P (watts)', type: 'number', placeholder: 'leave empty to solve' }],
  empty: 'Fill in any two values and the other two are calculated.',
  run: (x) => {
    const g = (k: string) => ((x[k] ?? '').trim() === '' ? undefined : num(x, k))
    let V = g('v'), I = g('i'), R = g('r'), P = g('p')
    need([V, I, R, P].filter((a) => a !== undefined).length === 2, 'Enter exactly two values.')
    if (V !== undefined && I !== undefined) { R = V / I; P = V * I } else if (V !== undefined && R !== undefined) { I = V / R; P = (V * V) / R } else if (V !== undefined && P !== undefined) { I = P / V; R = (V * V) / P } else if (I !== undefined && R !== undefined) { V = I * R; P = I * I * R } else if (I !== undefined && P !== undefined) { V = P / I; R = P / (I * I) } else if (R !== undefined && P !== undefined) { V = Math.sqrt(P * R); I = Math.sqrt(P / R) }
    need([V, I, R, P].every((a) => a !== undefined && Number.isFinite(a)), 'Those values cannot be solved (check for zero or negative inputs).')
    return { rows: [['Voltage', `${sig(V!)} V`], ['Current', `${sig(I!)} A`], ['Resistance', `${sig(R!)} Ω`], ['Power', `${sig(P!)} W`]] }
  },
}
const fuelCost: Spec = {
  fields: [{ key: 'dist', label: 'Trip distance (km)', type: 'number', def: '250', min: 0 }, { key: 'cons', label: 'Fuel consumption (L per 100 km)', type: 'number', def: '7.5', min: 0, step: 0.1 }, { key: 'price', label: 'Fuel price per liter', type: 'number', def: '1.6', min: 0, step: 0.01 }, { key: 'people', label: 'People sharing the cost', type: 'number', def: '1', min: 1 }],
  run: (v) => { const d = num(v, 'dist'), c = num(v, 'cons'), p = num(v, 'price'), n = Math.max(1, Math.floor(num(v, 'people'))); const l = (d * c) / 100; return { rows: [['Fuel needed', `${fmt(l)} L`], ['Total fuel cost', fmt(l * p)], ['Cost per person', fmt((l * p) / n)], ['Cost per km', fmt(d ? (l * p) / d : 0, 3)]] } },
}
const geometry: Spec = {
  fields: [{ key: 'shape', label: 'Shape', type: 'select', options: [['circle', 'Circle (radius)'], ['rect', 'Rectangle (length, width)'], ['tri', 'Triangle (sides a, b, c)'], ['sphere', 'Sphere (radius)'], ['cyl', 'Cylinder (radius, height)'], ['cube', 'Cube (length)'], ['cone', 'Cone (radius, height)']], def: 'circle' }, { key: 'a', label: 'Value 1 (radius / length / side a)', type: 'number', def: '5', min: 0 }, { key: 'b', label: 'Value 2 (width / height / side b)', type: 'number', def: '3', min: 0 }, { key: 'c', label: 'Value 3 (side c, triangles only)', type: 'number', def: '4', min: 0 }],
  run: (v) => {
    const a = num(v, 'a'), b = num(v, 'b'), c = (v.c ?? '') === '' ? 0 : num(v, 'c'), PI = Math.PI; need(a > 0, 'Value 1 must be above 0.')
    switch (v.shape) {
      case 'rect': need(b > 0, 'Value 2 must be above 0.'); return { rows: [['Area', sig(a * b)], ['Perimeter', sig(2 * (a + b))], ['Diagonal', sig(Math.hypot(a, b))]] }
      case 'tri': { need(b > 0 && c > 0 && a + b > c && a + c > b && b + c > a, 'These sides cannot form a triangle.'); const s = (a + b + c) / 2; return { rows: [['Area (Heron)', sig(Math.sqrt(s * (s - a) * (s - b) * (s - c)))], ['Perimeter', sig(a + b + c)]] } }
      case 'sphere': return { rows: [['Volume', sig((4 / 3) * PI * a ** 3)], ['Surface area', sig(4 * PI * a * a)]] }
      case 'cyl': need(b > 0, 'Value 2 (height) must be above 0.'); return { rows: [['Volume', sig(PI * a * a * b)], ['Surface area', sig(2 * PI * a * (a + b))]] }
      case 'cube': return { rows: [['Volume', sig(a ** 3)], ['Surface area', sig(6 * a * a)], ['Space diagonal', sig(a * Math.sqrt(3))]] }
      case 'cone': need(b > 0, 'Value 2 (height) must be above 0.'); return { rows: [['Volume', sig((PI * a * a * b) / 3)], ['Surface area', sig(PI * a * (a + Math.hypot(a, b)))], ['Slant height', sig(Math.hypot(a, b))]] }
      default: return { rows: [['Area', sig(PI * a * a)], ['Circumference', sig(2 * PI * a)], ['Diameter', sig(2 * a)]] }
    }
  },
}
const ratio: Spec = {
  fields: [{ key: 'a', label: 'A', type: 'number', def: '3' }, { key: 'b', label: 'B', type: 'number', def: '4' }, { key: 'c', label: 'C', type: 'number', def: '9' }],
  run: (v) => { const a = num(v, 'a'), b = num(v, 'b'), c = num(v, 'c'); need(a !== 0, 'A cannot be zero.'); const g = Number.isInteger(a) && Number.isInteger(b) ? gcd(a, b) || 1 : 0; return { rows: [[`${sig(a)} : ${sig(b)} = ${sig(c)} : ?`, sig((b * c) / a)], ['Simplified ratio A : B', g ? `${a / g} : ${b / g}` : `1 : ${sig(b / a)}`], ['Decimal (B ÷ A)', sig(b / a)]] } },
}
const average: Spec = {
  fields: [TA('t', 'Numbers (separated by commas, spaces or new lines)', '12, 18, 18, 25, 31', 'e.g. 12 18 25')],
  run: (v) => {
    const xs = (v.t ?? '').split(/[\s,;]+/).filter(Boolean).map(Number); need(xs.length > 0 && xs.every(Number.isFinite), 'Enter numbers separated by commas or spaces.')
    const s = [...xs].sort((a, b) => a - b), n = s.length, sum = s.reduce((a, b) => a + b, 0), mid = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2
    const freq = new Map<number, number>(); s.forEach((x) => freq.set(x, (freq.get(x) ?? 0) + 1)); const top = Math.max(...freq.values())
    const mode = top === 1 ? 'No repeated value' : [...freq].filter(([, c]) => c === top).map(([x]) => sig(x)).join(', ')
    const rows: Row[] = [['Count', String(n)], ['Sum', sig(sum)], ['Mean (average)', sig(sum / n)], ['Median', sig(mid)], ['Mode', mode], ['Range', sig(s[n - 1] - s[0])], ['Minimum', sig(s[0])], ['Maximum', sig(s[n - 1])]]
    if (s[0] > 0) rows.push(['Geometric mean', sig(Math.exp(s.reduce((a, b) => a + Math.log(b), 0) / n))])
    return { rows }
  },
}

export const specs3: Record<string, Spec> = {
  'business-days-calculator': businessDays, 'week-number-calculator': weekNumber, 'day-of-week-calculator': dayOfWeek, 'meeting-cost-calculator': meetingCost, 'work-hours-calculator': workHours, 'lottery-number-generator': lottery,
  'text-repeater': repeater, 'anagram-checker': anagram, 'remove-accents': accents, 'add-line-numbers': lineNumbers, 'upside-down-text': upside, 'emoji-remover': emojiRemover, 'title-case-converter': titleCase, 'hashtag-generator': hashtags,
  'url-parser': urlParser, 'string-escape': stringEscape, 'mime-type-lookup': mimeLookup, 'port-number-lookup': portLookup, 'ip-address-validator': ipValidator, 'json-diff': jsonDiff, 'jwt-generator': jwtGen, 'user-agent-parser': uaParser,
  'passphrase-generator': passphrase, 'pin-generator': pinGen, 'hash-identifier': hashId,
  'fraction-calculator': frac, 'quadratic-equation-solver': quadratic, 'gpa-calculator': gpa, 'grade-calculator': gradeCalc, 'ohms-law-calculator': ohm, 'fuel-cost-calculator': fuelCost, 'geometry-calculator': geometry, 'ratio-calculator': ratio, 'average-calculator': average,
}
export { clockMin as _clockMin }
