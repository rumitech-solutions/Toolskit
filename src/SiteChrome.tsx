import { createElement, type ReactNode, useEffect, useState } from 'react'
import { categories } from './toolRegistry'
import { Icon, SocialLinks } from './Icons'
import ChatWidget from './ChatWidget'

const categoryPaths: Record<string, string> = {
  Text: '/text-tools',
  Developer: '/developer-tools',
  PDF: '/pdf-tools',
  Image: '/image-tools',
  Calculators: '/calculator-tools',
  Security: '/security-tools',
}

export default function SiteChrome({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [path, setPath] = useState(() => window.location.pathname || '/')
  const [query, setQuery] = useState(() => {
    return new URLSearchParams(window.location.search).get('q') || ''
  })

  useEffect(() => {
    const syncLocation = () => {
      setPath(window.location.pathname || '/')
      setQuery(new URLSearchParams(window.location.search).get('q') || '')
    }
    window.addEventListener('popstate', syncLocation)
    return () => window.removeEventListener('popstate', syncLocation)
  }, [])

  const home = path === '/'
  const closeMenu = () => setMenuOpen(false)
  const active = (target: string) => (path === target ? 'is-active' : '')

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

  const nav = createElement(
    'nav',
    {
      id: 'site-primary-nav',
      className: 'main-nav' + (menuOpen ? ' is-open' : ''),
      'aria-label': 'Primary',
    },
    navLink('/', 'Home', createElement(Icon, { name: 'grid', size: 15 })),
    navLink('/tools', 'Tools / Categories', createElement(Icon, { name: 'grid', size: 15 })),
    navLink('/about', 'About Us'),
    navLink('/contact', 'Contact Us', createElement(Icon, { name: 'mail', size: 15 })),
    navLink('/privacy-policy', 'Privacy Policy'),
    navLink('/terms-and-conditions', 'Terms & Conditions'),
  )

  const header = createElement(
    'header',
    { className: 'topbar' },
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
    createElement(
      'div',
      { className: 'footer-legal' },
      createElement('span', null, 'Legal'),
      createElement('a', { href: '/privacy-policy' }, 'Privacy Policy'),
      createElement('a', { href: '/terms-and-conditions' }, 'Terms & Conditions'),
    ),
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
          { className: 'footer-credit' },
          'Created with ',
          createElement(Icon, { name: 'heart', size: 13 }),
          ' by ',
          createElement('strong', null, 'RumiTech Solutions'),
        ),
        createElement(
          'span',
          { className: 'footer-mail' },
          createElement(Icon, { name: 'mail', size: 13 }),
          ' rumitech.solutions00@gmail.com',
        ),
      ),
    ),
  )

  return createElement(
    'div',
    { className: 'public-app' },
    header,
    children,
    footer,
    createElement(ChatWidget),
  )
}