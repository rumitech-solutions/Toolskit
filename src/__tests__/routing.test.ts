import { describe, expect, it } from 'vitest'
import { isAppRoute } from '../routing'

// Regression: tool SEO sections (explore categories, FAQ, related tools) were mounted only when the
// first page load was a /tools/<id> URL, so opening a tool by clicking from the homepage lacked them.
describe('isAppRoute', () => {
  it('includes the homepage, because tools are opened from there via pushState', () => {
    expect(isAppRoute('/', false)).toBe(true)
  })

  it('includes tool URLs', () => {
    expect(isAppRoute('/tools/age-calculator', false)).toBe(true)
  })

  it('excludes the /tools landing page and info/category pages', () => {
    expect(isAppRoute('/tools', false)).toBe(false)
    expect(isAppRoute('/about', true)).toBe(false)
    expect(isAppRoute('/pdf-tools', true)).toBe(false)
  })
})
