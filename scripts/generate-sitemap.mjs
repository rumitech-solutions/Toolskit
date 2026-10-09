import {readFileSync,writeFileSync} from 'node:fs'
import {execSync} from 'node:child_process'

const base='https://toolskit.sbs'
const registry=readFileSync(new URL('../src/toolRegistry.ts',import.meta.url),'utf8')

// Keep sitemap generation independent from the TypeScript tool registry module.
// Tool IDs are defined as object properties in src/toolRegistry.ts.
const ids=[...registry.matchAll(/\bid:\s*['"]([^'"]+)['"]/g)].map(match=>match[1])

if(!ids.length){
  throw new Error('Sitemap generation found no tool IDs in src/toolRegistry.ts.')
}
if(new Set(ids).size!==ids.length){
  throw new Error('Sitemap generation found duplicate tool IDs.')
}

const staticPaths=[
  '/',
  '/tools',
  '/developer-tools',
  '/text-tools',
  '/pdf-tools',
  '/image-tools',
  '/calculator-tools',
  '/security-tools',
  '/finance-tools',
  '/health-tools',
  '/design-tools',
  '/productivity-tools',
  '/converter-tools',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions',
]

const paths=[...new Set([...staticPaths,...ids.map(id=>`/tools/${id}`)])]
// Use the last commit date (stable between builds) so <lastmod> only changes when the site does.
let lastmod=new Date().toISOString().slice(0,10)
try{const d=execSync('git log -1 --format=%cs',{stdio:['ignore','pipe','ignore']}).toString().trim();if(/^\d{4}-\d{2}-\d{2}$/.test(d))lastmod=d}catch{/* not a git checkout */}

const urlset=list=>`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${list.map(path=>`  <url><loc>${base}${path}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}
</urlset>
`
const toolPaths=paths.filter(p=>p.startsWith('/tools/'))
const pagePaths=paths.filter(p=>!p.startsWith('/tools/'))
const out=name=>new URL(`../public/${name}`,import.meta.url)

// sitemap.xml: everything in one file. sitemap-index.xml + the two parts are an alternative entry point:
// submitting a different URL in Search Console clears a stuck "Couldn't fetch" state.
writeFileSync(out('sitemap.xml'),urlset(paths))
writeFileSync(out('sitemap-pages.xml'),urlset(pagePaths))
writeFileSync(out('sitemap-tools.xml'),urlset(toolPaths))
writeFileSync(out('sitemap-index.xml'),`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${base}/sitemap-pages.xml</loc><lastmod>${lastmod}</lastmod></sitemap>
  <sitemap><loc>${base}/sitemap-tools.xml</loc><lastmod>${lastmod}</lastmod></sitemap>
</sitemapindex>
`)
console.log(`Generated sitemaps with ${paths.length} URLs (${ids.length} tools).`)
