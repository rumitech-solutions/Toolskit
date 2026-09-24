import {readFileSync,writeFileSync} from 'node:fs'

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
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions',
]

const paths=[...new Set([...staticPaths,...ids.map(id=>`/tools/${id}`)])]
const lastmod=new Date().toISOString().slice(0,10)

const xml=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(path=>`  <url><loc>${base}${path}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}
</urlset>
`

writeFileSync(new URL('../public/sitemap.xml',import.meta.url),xml)
console.log(`Generated sitemap with ${paths.length} URLs (${ids.length} tools).`)
