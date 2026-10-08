import { useEffect, useMemo, useRef, useState } from 'react'
import { tools } from './toolRegistry'
import { Icon, type IconName } from './Icons'

const catIcon: Record<string, IconName> = { Text: 'text', Developer: 'developer', PDF: 'pdf', Image: 'image', Calculators: 'calculator', Security: 'security', Finance: 'finance', Health: 'health', Design: 'design', Productivity: 'productivity', Converters: 'converters' }
const read = (k: string): string[] => { try { return JSON.parse(localStorage.getItem(k) || '[]') } catch { return [] } }
const write = (k: string, v: string[]) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }

export const toast = (message: string) => window.dispatchEvent(new CustomEvent('tk-toast', { detail: message }))
export const trackRecent = (id: string) => write('tk:recent', [id, ...read('tk:recent').filter(x => x !== id)].slice(0, 8))

export function FavButton({ id }: { id: string }) {
  const [on, setOn] = useState(() => read('tk:fav').includes(id))
  useEffect(() => setOn(read('tk:fav').includes(id)), [id])
  const toggle = () => {
    const f = read('tk:fav')
    const next = f.includes(id) ? f.filter(x => x !== id) : [id, ...f]
    write('tk:fav', next)
    setOn(next.includes(id))
    toast(next.includes(id) ? 'Saved to favorites' : 'Removed from favorites')
    window.dispatchEvent(new Event('tk-fav'))
  }
  return <button type="button" className={`fav-btn${on ? ' on' : ''}`} aria-pressed={on} onClick={toggle} title={on ? 'Remove from favorites' : 'Save to favorites'}><Icon name="heart" size={15} /><span>{on ? 'Saved' : 'Save'}</span></button>
}

export function QuickAccess() {
  const [ids, setIds] = useState<{ fav: string[]; recent: string[] }>({ fav: [], recent: [] })
  useEffect(() => {
    const sync = () => setIds({ fav: read('tk:fav'), recent: read('tk:recent') })
    sync()
    window.addEventListener('tk-fav', sync)
    return () => window.removeEventListener('tk-fav', sync)
  }, [])
  const list = useMemo(() => {
    const seen = new Set<string>()
    return [...ids.fav.map(id => ({ id, fav: true })), ...ids.recent.map(id => ({ id, fav: false }))]
      .filter(x => !seen.has(x.id) && seen.add(x.id))
      .map(x => ({ ...x, tool: tools.find(t => t.id === x.id) }))
      .filter(x => x.tool).slice(0, 6)
  }, [ids])
  if (!list.length) return null
  return <section className="popular-section quick-access" id="your-tools"><div className="section-shell">
    <div className="section-heading compact"><div><span className="section-kicker"><Icon name="heart" size={13} /> Your shortcuts</span><h2>Pick up where you left off</h2></div><span className="section-note">Saved &amp; recent tools</span></div>
    <div className="popular-grid">{list.map(({ tool, fav }) => tool && <a key={tool.id} className="popular-card" href={`/tools/${tool.id}`}>
      <span className="popular-icon" data-cat={tool.category}><Icon name={catIcon[tool.category]} size={20} /></span>
      <span><b>{tool.name}</b><small>{fav ? 'Saved' : 'Recently used'} · {tool.category}</small></span><Icon name="arrow" size={16} /></a>)}</div>
  </div></section>
}

function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<any>(null)
  const [visible, setVisible] = useState(false)
  const [platform, setPlatform] = useState<'android' | 'ios' | null>(null)

  useEffect(() => {
    const dismissed = localStorage.getItem('tk:install-dismissed')
    if (dismissed) return
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone
    if (standalone) return

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setPromptEvent(e)
      setPlatform('android')
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isSafari = /safari/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent)
    let iosTimer: ReturnType<typeof setTimeout> | undefined
    if (isIos && isSafari) {
      iosTimer = setTimeout(() => { setPlatform('ios'); setVisible(true) }, 4000)
    }
    return () => { window.removeEventListener('beforeinstallprompt', onPrompt); if (iosTimer) clearTimeout(iosTimer) }
  }, [])

  const dismiss = () => { setVisible(false); localStorage.setItem('tk:install-dismissed', '1') }
  const install = async () => {
    if (!promptEvent) return
    promptEvent.prompt()
    const choice = await promptEvent.userChoice.catch(() => null)
    if (choice?.outcome === 'accepted') toast('Installing ToolsKit…')
    setVisible(false)
    localStorage.setItem('tk:install-dismissed', '1')
  }

  if (!visible || !platform) return null
  return <div className="install-banner" role="dialog" aria-label="Install ToolsKit">
    <span className="install-icon"><Icon name="sparkles" size={18} /></span>
    <div className="install-text">
      <strong>Install ToolsKit</strong>
      <span>{platform === 'ios' ? 'Tap Share, then "Add to Home Screen" — opens instantly, works offline.' : 'One tap from your home screen. Works offline. No browser tab needed.'}</span>
    </div>
    {platform === 'android' && <button type="button" className="install-btn" onClick={install}>Install</button>}
    <button type="button" className="install-close" aria-label="Dismiss" onClick={dismiss}><Icon name="close" size={15} /></button>
  </div>
}

export default function Enhancements() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const [progress, setProgress] = useState(0)
  const [top, setTop] = useState(false)
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([])
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement)?.tagName || '')
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(o => !o); setQ(''); setSel(0) }
      else if (e.key === '/' && !typing && !open) { e.preventDefault(); setOpen(true); setQ(''); setSel(0) }
      else if (e.key === 'Escape') setOpen(false)
    }
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight
      setProgress(h > 0 ? Math.min(100, (scrollY / h) * 100) : 0)
      setTop(scrollY > 700)
    }
    let n = 0
    const onToast = (e: Event) => {
      const id = ++n
      setToasts(t => [...t, { id, text: String((e as CustomEvent).detail) }])
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2200)
    }
    const onOpenSearch = () => { setOpen(true); setQ(''); setSel(0) }
    addEventListener('keydown', onKey); addEventListener('scroll', onScroll, { passive: true }); addEventListener('tk-toast', onToast); addEventListener('tk-open-search', onOpenSearch)
    onScroll()
    return () => { removeEventListener('keydown', onKey); removeEventListener('scroll', onScroll); removeEventListener('tk-toast', onToast); removeEventListener('tk-open-search', onOpenSearch) }
  }, [open])

  useEffect(() => { if (open) setTimeout(() => input.current?.focus(), 30) }, [open])

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) {
      const pref = [...read('tk:fav'), ...read('tk:recent')]
      const picked = pref.map(id => tools.find(t => t.id === id)).filter(Boolean) as typeof tools
      return [...new Set([...picked, ...tools])].slice(0, 10)
    }
    return tools.map(t => {
      const n = t.name.toLowerCase()
      const score = n.startsWith(s) ? 4 : n.includes(s) ? 3 : t.keywords.some(k => k.includes(s)) ? 2 : t.description.toLowerCase().includes(s) || t.category.toLowerCase().includes(s) ? 1 : 0
      return { t, score }
    }).filter(x => x.score).sort((a, b) => b.score - a.score).map(x => x.t).slice(0, 12)
  }, [q, open])

  const go = (id: string) => { setOpen(false); window.location.assign(`/tools/${id}`) }
  const onInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(results.length - 1, s + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(0, s - 1)) }
    else if (e.key === 'Enter' && results[sel]) go(results[sel].id)
  }

  return <>
    <InstallPrompt />
    <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} aria-hidden="true" />
    <button type="button" className="palette-fab" onClick={() => { setOpen(true); setQ(''); setSel(0) }} aria-label="Search all tools (Ctrl K)"><Icon name="search" size={16} /><span>Search</span><kbd>Ctrl K</kbd></button>
    {top && <button type="button" className="to-top" aria-label="Back to top" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}><Icon name="chevron" size={18} /></button>}
    <div className="toast-stack" role="status" aria-live="polite">{toasts.map(t => <div key={t.id} className="toast"><Icon name="sparkles" size={15} />{t.text}</div>)}</div>
    {open && <div className="palette-backdrop" onMouseDown={() => setOpen(false)}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Search tools" onMouseDown={e => e.stopPropagation()}>
        <div className="palette-input"><Icon name="search" size={18} /><input ref={input} value={q} onChange={e => { setQ(e.target.value); setSel(0) }} onKeyDown={onInput} placeholder="Search 206+ tools…" aria-label="Search tools" /><kbd>Esc</kbd></div>
        <div className="palette-list" role="listbox">
          {!q && <div className="palette-label">Suggested</div>}
          {results.map((t, i) => <button type="button" key={t.id} role="option" aria-selected={i === sel} className={i === sel ? 'palette-item active' : 'palette-item'} onMouseEnter={() => setSel(i)} onClick={() => go(t.id)}>
            <span className="palette-icon" data-cat={t.category}><Icon name={catIcon[t.category]} size={17} /></span>
            <span className="palette-text"><b>{t.name}</b><small>{t.description}</small></span><em>{t.category}</em></button>)}
          {!results.length && <div className="palette-empty">No tools match “{q}”. Try a different keyword.</div>}
        </div>
        <div className="palette-foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div>
      </div>
    </div>}
  </>
}
