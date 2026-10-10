import {readFileSync} from 'node:fs'
import {describe,expect,it} from 'vitest'
import {allRoutes,fileFor,renderPage,ORIGIN} from '../scripts/prerender-lib'
import {tools} from '../src/toolRegistry'
import {getToolSeoProfile} from '../src/toolSeo'
import {getSeoDataForPath} from '../src/seo'

const template=readFileSync(new URL('../index.html',import.meta.url),'utf8')
const routes=allRoutes()

describe('pre-rendered pages (SEO)',()=>{
 it('covers the home page, listing, info pages and every tool',()=>{
  expect(routes).toContain('/')
  expect(routes).toContain('/tools')
  expect(routes).toContain('/about')
  for(const t of tools)expect(routes).toContain(`/tools/${t.id}`)
  expect(new Set(routes.map(fileFor)).size).toBe(routes.length)
 })

 it('matches the URLs in public/sitemap.xml exactly',()=>{
  const xml=readFileSync(new URL('../public/sitemap.xml',import.meta.url),'utf8')
  const locs=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]).sort()
  const expected=routes.map(p=>p==='/'?`${ORIGIN}/`:`${ORIGIN}${p}`).sort()
  expect(locs).toEqual(expected)
 })

 it('sitemap-index.xml parts add up to sitemap.xml',()=>{
  const read=(f:string)=>readFileSync(new URL(`../public/${f}`,import.meta.url),'utf8')
  const locs=(x:string)=>[...x.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1])
  expect(locs(read('sitemap-index.xml'))).toEqual([`${ORIGIN}/sitemap-pages.xml`,`${ORIGIN}/sitemap-tools.xml`])
  expect([...locs(read('sitemap-pages.xml')),...locs(read('sitemap-tools.xml'))].sort()).toEqual(locs(read('sitemap.xml')).sort())
 })

 it('does not set Content-Type in _headers (Cloudflare adds its own; a second one corrupts the value)',()=>{
  expect(readFileSync(new URL('../public/_headers',import.meta.url),'utf8')).not.toMatch(/content-type\s*:/i)
 })

 it('gives every page its own title, canonical, one H1 and valid JSON-LD',()=>{
  const titles=new Set<string>()
  for(const path of routes){
   const html=renderPage(template,path)
   const title=/<title>([^<]*)<\/title>/.exec(html)![1].replace(/&amp;/g,'&')
   expect(titles.has(title),`duplicate title on ${path}`).toBe(false)
   titles.add(title)
   expect(title.length,path).toBeLessThanOrEqual(70)
   const expectedUrl=path==='/'?`${ORIGIN}/`:`${ORIGIN}${path}`
   expect(html).toContain(`<link rel="canonical" href="${expectedUrl}" />`)
   expect(html).toContain(`<meta property="og:url" content="${expectedUrl}" />`)
   expect(html).toContain(`${ORIGIN}/og-image.png`)
   expect((html.match(/<h1>/g)??[]).length,`h1 count on ${path}`).toBe(1)
   expect(html).toContain('<div id="seo-static">')
   for(const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g))expect(()=>JSON.parse(m[1])).not.toThrow()
   expect(getSeoDataForPath(path).description.length,path).toBeGreaterThan(40)
  }
 })

 it('tool pages include FAQ content, related links and FAQPage + WebApplication data',()=>{
  const html=renderPage(template,'/tools/age-calculator')
  expect(html).toContain('Frequently asked questions')
  expect(html).toContain('Related tools')
  expect(html).toContain('"@type":"FAQPage"')
  expect(html).toContain('"@type":"WebApplication"')
  expect(html).toContain('"@type":"BreadcrumbList"')
 })

 it('every tool has its own FAQ (no boilerplate) and a unique intro',()=>{
  const intros=new Set<string>()
  for(const tool of tools){
   const p=getToolSeoProfile(tool)
   expect(p.faq.length,tool.id).toBeGreaterThanOrEqual(3)
   expect(p.faq[0].question.startsWith('Who is '),`${tool.id} still uses the generic FAQ`).toBe(false)
   expect(intros.has(p.intro),`duplicate intro on ${tool.id}`).toBe(false)
   intros.add(p.intro)
  }
 })

 it('installs the Google tag once per page, via an external init file allowed by the CSP',()=>{
  const html=renderPage(template,'/tools/age-calculator')
  expect((html.match(/googletagmanager\.com\/gtag\/js\?id=G-D6ZECZMKTT/g)??[]).length).toBe(1)
  expect(html).toContain('<script src="/gtag-init.js"></script>')
  expect(readFileSync(new URL('../public/gtag-init.js',import.meta.url),'utf8')).toContain("gtag('config', 'G-D6ZECZMKTT'")
  const headers=readFileSync(new URL('../public/_headers',import.meta.url),'utf8')
  expect(headers).toMatch(/script-src 'self' https:\/\/www\.googletagmanager\.com/)
  expect(headers).not.toMatch(/script-src[^;]*'unsafe-inline'/)
 })

 it('home page links to every tool so crawlers can discover them',()=>{
  const html=renderPage(template,'/')
  for(const t of tools)expect(html).toContain(`href="/tools/${t.id}"`)
  expect(html).toContain('"@type":"SearchAction"')
 })
})
