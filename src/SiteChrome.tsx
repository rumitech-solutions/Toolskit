import { createElement, type ReactNode, useEffect, useRef, useState } from 'react'
import { categories, tools } from './toolRegistry'
import { Icon, IconName, SocialLinks } from './Icons'
import ChatWidget from './ChatWidget'
import AdSense from './AdSense'
import AnalyticsTracker from './analytics'
import './site-chrome.css'

const categoryPaths: Record<string, string> = {
  Text: '/text-tools',
  Developer: '/developer-tools',
  PDF: '/pdf-tools',
  Image: '/image-tools',
  Calculators: '/calculator-tools',
  Security: '/security-tools',
}

const categoryIcon: Record<string, IconName> = {
  Text: 'text',
  Developer: 'developer',
  PDF: 'pdf',
  Image: 'image',
  Calculators: 'calculator',
  Security: 'security',
}

const categoryTagline: Record<string, string> = {
  Text: 'Write and clean text faster',
  Developer: 'Format, encode and inspect code',
  PDF: 'Work with documents locally',
  Image: 'Resize and convert images',
  Calculators: 'Fast everyday calculations',
  Security: 'Encoding and security helpers',
}

export default function SiteChrome({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [path, setPath] = useState(() => window.location.pathname || '/')
  const [query, setQuery] = useState(() => {
    return new URLSearchParams(window.location.search).get('q') || ''
  })
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const syncLocation = () => {
      setPath(window.location.pathname || '/')
      setQuery(new URLSearchParams(window.location.search).get('q') || '')
    }
    window.addEventListener('popstate', syncLocation)
    return () => window.removeEventListener('popstate', syncLocation)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const home = path === '/'
  const closeMenu = () => setMenuOpen(false)
  const active = (target: string) => (path === target ? 'is-active' : '')
  const [menuCategory, setMenuCategory] = useState<string>(categories[1])
  const [megaOpen, setMegaOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMegaOpen(true)
  }
  const scheduleCloseMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setMegaOpen(false), 160)
  }
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current) }, [])
  useEffect(() => { setMegaOpen(false) }, [path])

  const updateSearch = (value: string) => {
    setQuery(value)
    if (home) {
      const next = value ? '/?q=' + encodeURIComponent(value) : '/'
      window.history.replaceState({}, '', next)
      window.dispatchEvent(new PopStateEvent('popstate'))
      return
    }
    if (value.trim()) {
      window.location.href = '/?q=' + encodeURIComponent(value)
    }
  }

  const submitSearch = () => {
    const value = query.trim()
    if (value) {
      window.location.href = '/?q=' + encodeURIComponent(value)
    } else {
      window.location.href = '/'
    }
  }

  const navLink = (href: string, label: ReactNode, icon?: ReactNode) =>
    createElement(
      'a',
      { href, className: active(href), onClick: closeMenu, key: href },
      icon,
      label,
    )

  const megaPanel = createElement(
    'div',
    {
      className: 'mega-menu',
      onMouseEnter: openMega,
      onMouseLeave: scheduleCloseMega,
    },
    createElement(
      'div',
      { className: 'mega-menu-cats' },
      categories.slice(1).map((cat) =>
        createElement(
          'button',
          {
            type: 'button',
            key: cat,
            className: 'mega-cat' + (menuCategory === cat ? ' active' : ''),
            onMouseEnter: () => setMenuCategory(cat),
            onClick: () => { window.location.href = categoryPaths[cat] || '/tools'; closeMenu() },
          },
          createElement('span', { className: 'mega-cat-icon' }, createElement(Icon, { name: categoryIcon[cat], size: 16 })),
          createElement(
            'span',
            { className: 'mega-cat-text' },
            createElement('b', null, cat),
            createElement('small', null, tools.filter((t) => t.category === cat).length, ' tools'),
          ),
          createElement('span', { className: 'mega-cat-chevron' }, createElement(Icon, { name: 'chevron', size: 14 })),
        ),
      ),
    ),
    createElement(
      'div',
      { className: 'mega-menu-tools' },
      createElement(
        'div',
        { className: 'mega-menu-tools-head' },
        createElement('span', { className: 'mega-menu-icon' }, createElement(Icon, { name: categoryIcon[menuCategory], size: 18 })),
        createElement('div', null, createElement('strong', null, menuCategory, ' Tools'), createElement('small', null, categoryTagline[menuCategory])),
        createElement('a', { className: 'mega-view-all', href: categoryPaths[menuCategory] || '/tools', onClick: closeMenu }, 'View all', createElement(Icon, { name: 'arrow', size: 13 })),
      ),
      createElement(
        'div',
        { className: 'mega-menu-grid' },
        tools
          .filter((t) => t.category === menuCategory)
          .slice(0, 12)
          .map((t) =>
            createElement(
              'a',
              { href: `/tools/${t.id}`, key: t.id, className: 'mega-tool-link', onClick: closeMenu },
              t.name,
            ),
          ),
      ),
    ),
  )

  const nav = createElement(
    'nav',
    {
      id: 'site-primary-nav',
      className: 'main-nav' + (menuOpen ? ' is-open' : ''),
      'aria-label': 'Primary',
    },
    navLink('/', 'Home', createElement(Icon, { name: 'grid', size: 15 })),
    createElement(
      'div',
      {
        className: 'nav-mega-trigger' + (megaOpen ? ' is-open' : ''),
        key: 'tools-mega',
        onMouseEnter: openMega,
        onMouseLeave: scheduleCloseMega,
      },
      createElement(
        'a',
        { href: '/tools', className: active('/tools'), onClick: closeMenu },
        createElement(Icon, { name: 'grid', size: 15 }),
        'Tools',
        createElement('span', { className: 'nav-caret' }, createElement(Icon, { name: 'chevron', size: 12 })),
      ),
      megaOpen ? megaPanel : null,
    ),
    navLink('/about', 'About'),
    navLink('/contact', 'Contact', createElement(Icon, { name: 'mail', size: 15 })),
  )

  const header = createElement(
    'header',
    { className: `topbar ${scrolled ? 'scrolled' : ''}` },
    createElement(
      'a',
      { className: 'brand', href: '/', onClick: closeMenu, 'aria-label': 'ToolsKit home' },
      createElement('span', { className: 'brand-mark' }, createElement(Icon, { name: 'sparkles', size: 17 })),
      createElement('span', null, 'Tools', createElement('span', null, 'Kit')),
    ),
    createElement(
      'button',
      {
        className: 'public-menu-toggle',
        type: 'button',
        'aria-expanded': menuOpen,
        'aria-controls': 'site-primary-nav',
        'aria-label': menuOpen ? 'Close navigation' : 'Open navigation',
        onClick: () => setMenuOpen(!menuOpen),
      },
      createElement(Icon, { name: menuOpen ? 'x' : 'menu', size: 19 }),
    ),
    nav,
    createElement(
      'label',
      { className: 'header-search', 'aria-label': 'Search tools' },
      createElement(Icon, { name: 'search', size: 18 }),
      createElement('input', {
        type: 'search',
        value: query,
        placeholder: 'Search tools...',
        onChange: (event) => updateSearch(event.target.value),
        onKeyDown: (event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            submitSearch()
          }
        },
      }),
    ),
  )

  const explore = createElement(
    'div',
    { className: 'footer-links' },
    createElement('h3', null, 'Explore'),
    createElement('a', { href: '/tools' }, 'All tools'),
    createElement('a', { href: '/#popular' }, 'Popular tools'),
    createElement('a', { href: '/about' }, 'About ToolsKit'),
  )

  const categoryLinks = categories.slice(1).map((category) =>
    createElement(
      'a',
      { href: categoryPaths[category] || '/tools', key: category },
      category,
    ),
  )

  const footer = createElement(
    'footer',
    { className: 'site-footer' },
    createElement(
      'div',
      { className: 'footer-shell' },
      createElement(
        'div',
        { className: 'footer-main' },
        createElement(
          'div',
          { className: 'footer-brand' },
          createElement(
            'a',
            { className: 'brand footer-logo', href: '/', 'aria-label': 'ToolsKit home' },
            createElement('span', { className: 'brand-mark' }, createElement(Icon, { name: 'sparkles', size: 16 })),
            createElement('span', null, 'Tools', createElement('span', null, 'Kit')),
          ),
          createElement('p', null, 'A modern collection of useful web tools designed to help you get small jobs done quickly.'),
          createElement(
            'a',
            { className: 'email-link', href: 'mailto:rumitech.solutions00@gmail.com' },
            createElement(Icon, { name: 'mail', size: 16 }),
            'rumitech.solutions00@gmail.com',
          ),
        ),
        explore,
        createElement(
          'div',
          { className: 'footer-links' },
          createElement('h3', null, 'Categories'),
          categoryLinks,
        ),
        createElement(
          'div',
          { className: 'footer-contact' },
          createElement('h3', null, 'Stay connected'),
          createElement('p', { className: 'social-copy' }, 'Follow ToolsKit for updates, new tools, and improvements.'),
          createElement(SocialLinks),
        ),
      ),
      createElement(
        'div',
        { className: 'footer-bottom' },
        createElement('span', null, '© 2026 Tools Kit. All rights reserved.'),
        createElement(
          'span',
          { className: 'footer-legal-inline' },
          createElement('a', { href: '/privacy-policy' }, 'Privacy Policy'),
          createElement('a', { href: '/terms-and-conditions' }, 'Terms & Conditions'),
        ),
        createElement(
          'span',
          { className: 'footer-credit' },
          'Created with ',
          createElement(Icon, { name: 'heart', size: 13 }),
          ' by ',
          createElement('strong', null, 'RumiTech Solutions'),
        ),
      ),
    ),
  )

  return createElement(
    'div',
    { className: 'public-app' },
    createElement(AnalyticsTracker),
    createElement('a',{className:'skip-link',href:'#page-content'},'Skip to content'),
    header,
    createElement('div',{id:'page-content',tabIndex:-1},children),
    createElement(AdSense),
    footer,
    createElement(ChatWidget),
  )
}
