import {describe,expect,it} from 'vitest'
import {primaryNavigation,siteNavigation,sitePages} from '../src/siteNavigation'

describe('ToolsKit information architecture',()=>{
 it('defines focused primary navigation and required legal/support destinations',()=>{
  expect(primaryNavigation.map(item=>item.label)).toEqual(['Home','Tools','Developer Tools','Text Tools','PDF Tools','Image Tools','Calculator Tools','Security Tools','Finance Tools','Health Tools','Design Tools','Productivity Tools','Converter Tools','About Us','Contact Us'])
  expect(primaryNavigation.map(item=>item.path)).toEqual(['/','/tools','/developer-tools','/text-tools','/pdf-tools','/image-tools','/calculator-tools','/security-tools','/finance-tools','/health-tools','/design-tools','/productivity-tools','/converter-tools','/about','/contact'])
  expect(siteNavigation.map(item=>item.path)).toContain('/privacy-policy')
  expect(siteNavigation.map(item=>item.path)).toContain('/terms-and-conditions')
 })
 it('defines useful indexable copy for every public information page',()=>{
  for(const page of sitePages) {
   expect(page.title.length).toBeGreaterThan(8)
   expect(page.description.length).toBeGreaterThan(40)
   expect(page.sections.length).toBeGreaterThanOrEqual(2)
  }
 })
})
