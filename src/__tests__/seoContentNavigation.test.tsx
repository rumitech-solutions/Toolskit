// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import SeoContent from '../SeoContent'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

// main.tsx mounts <SeoContent/> for every App route ('/' and '/tools/:id') because App switches
// tools with history.pushState (no reload). That only works if SeoContent follows the URL itself
// and renders nothing unless the URL is a tool page, which is what this file pins down.
describe('SeoContent follows client-side navigation', () => {
  let container: HTMLDivElement
  let root: Root

  const goto = (path: string) =>
    act(() => {
      window.history.pushState({}, '', path)
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

  beforeEach(() => {
    window.history.pushState({}, '', '/')
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    act(() => root.render(<SeoContent />))
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    document.getElementById('toolkit-seo-jsonld')?.remove()
  })

  it('renders nothing on the home page', () => {
    expect(container.querySelector('.seo-content')).toBeNull()
  })

  it('shows tool sections after navigating to a tool without a reload', () => {
    goto('/tools/age-calculator')
    const section = container.querySelector('.seo-content')
    expect(section?.getAttribute('aria-label')).toBe('Age Calculator information')
    expect(container.textContent).toContain('Frequently asked questions')
  })

  it('updates when switching between tools and hides again on home', () => {
    goto('/tools/age-calculator')
    goto('/tools/bmi-calculator')
    expect(container.querySelector('.seo-content')?.getAttribute('aria-label')).toBe('BMI Calculator information')
    goto('/')
    expect(container.querySelector('.seo-content')).toBeNull()
  })

  it('renders nothing for an unknown tool slug', () => {
    goto('/tools/does-not-exist')
    expect(container.querySelector('.seo-content')).toBeNull()
  })
})
