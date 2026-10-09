// Build-time pre-rendering: turns the SPA shell (dist/index.html) into one real HTML document per
// route, each with its own <title>, description, canonical, Open Graph tags, JSON-LD and a crawlable
// text version of the page inside #root. React replaces #root's content as soon as the app boots.
import {tools} from '../src/toolRegistry'
import {getSeoDataForPath} from '../src/seo'
import {getRelatedTools,getToolSeoProfile} from '../src/toolSeo'
import {primaryNavigation,sitePages} from '../src/siteNavigation'
import {categoryLabel,categoryPaths,toolJsonLd,websiteJsonLd} from '../src/seoSchema'

export const ORIGIN='https://toolskit.sbs'
export const OG_IMAGE=`${ORIGIN}/og-image.png`

const esc=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
const jsonScript=(id:string,data:unknown)=>`<script type="application/ld+json" id="${id}">${JSON.stringify(data).replace(/</g,'\\u003c')}</script>`
const categoryOf=(path:string)=>Object.entries(categoryPaths).find(([,p])=>p===path)?.[0]
const link=(href:string,text:string)=>`<a href="${esc(href)}">${esc(text)}</a>`
const toolLinks=(list:{id:string;name:string;description:string}[])=>`<ul>${list.map(t=>`<li>${link('/tools/'+t.id,t.name)} — ${esc(t.description)}</li>`).join('')}</ul>`

export const allRoutes=():string[]=>[
 '/','/tools',...sitePages.map(p=>p.path),'/about','/contact','/privacy-policy','/terms-and-conditions',
 ...tools.map(t=>`/tools/${t.id}`),
].filter((p,i,a)=>a.indexOf(p)===i)

function chrome(inner:string){
 const nav=primaryNavigation.map(n=>link(n.path,n.label)).join(' ')
 return `<div id="seo-static"><header><strong>${link('/','ToolsKit')}</strong><nav aria-label="Primary">${nav}</nav></header><main>${inner}</main><footer><p>${link('/privacy-policy','Privacy Policy')} · ${link('/terms-and-conditions','Terms &amp; Conditions')} · ${link('/contact','Contact')}</p><p>ToolsKit — free browser-based tools. Core tools run locally in your browser.</p></footer></div>`
}

function toolBody(id:string){
 const tool=tools.find(t=>t.id===id)!
 const p=getToolSeoProfile(tool)
 const related=getRelatedTools(id)
 return `<nav aria-label="Breadcrumb">${link('/','ToolsKit')} / ${link(categoryPaths[tool.category],categoryLabel(tool.category))} / ${esc(tool.name)}</nav>
<h1>${esc(tool.name)}</h1><p>${esc(tool.description)}</p><p>${esc(p.intro)}</p>
<p>Loading the interactive tool… This page needs JavaScript to run the ${esc(tool.name)}.</p>
<h2>How to use ${esc(tool.name)}</h2><ol>${p.workflow.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
<h2>Best for</h2><ul>${p.bestFor.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>
<h2>Tips for better results</h2><ul>${p.tips.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>
<h2>Frequently asked questions</h2>${p.faq.map(f=>`<h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p>`).join('')}
<h2>Related tools</h2>${toolLinks(related)}
<h2>Explore tool categories</h2><ul>${Object.entries(categoryPaths).map(([c,path])=>`<li>${link(path,categoryLabel(c))}</li>`).join('')}</ul>`
}

function listing(cat?:string){
 const cats=cat?[cat]:Object.keys(categoryPaths)
 return cats.map(c=>`<h2>${link(categoryPaths[c],categoryLabel(c))}</h2>${toolLinks(tools.filter(t=>t.category===c))}`).join('')
}

function bodyFor(path:string):string{
 if(path==='/'){
  return `<h1>Free online tools — ${tools.length}+ browser-based utilities</h1><p>ToolsKit brings practical tools for text, development, PDFs, images, calculations, finance, health, design, converters and security into one fast, focused workspace. Core tools run locally in your browser, with no sign-up.</p>${listing()}`
 }
 if(path==='/tools')return `<h1>All ToolsKit tools</h1><p>Browse ${tools.length}+ free online tools by category.</p>${listing()}`
 if(path.startsWith('/tools/'))return toolBody(path.slice(7))
 const page=sitePages.find(p=>p.path===path)
 if(!page)return `<h1>ToolsKit</h1>`
 const cat=categoryOf(path)
 const title=page.title.split(' | ')[0]
 return `<nav aria-label="Breadcrumb">${link('/','ToolsKit')} / ${esc(title)}</nav><h1>${esc(title)}</h1><p>${esc(page.description)}</p>${page.sections.map(s=>`<h2>${esc(s.heading)}</h2>${s.body.map(b=>`<p>${esc(b)}</p>`).join('')}`).join('')}${cat?`<h2>${esc(cat)} tools</h2>${toolLinks(tools.filter(t=>t.category===cat))}`:''}`
}

function jsonLdFor(path:string):string{
 const out:string[]=[]
 if(path==='/')out.push(jsonScript('toolskit-site-jsonld',websiteJsonLd(ORIGIN,tools.length)))
 if(path.startsWith('/tools/')){
  const tool=tools.find(t=>t.id===path.slice(7))!
  out.push(jsonScript('toolkit-seo-jsonld',toolJsonLd(tool,getToolSeoProfile(tool),ORIGIN)))
 }
 return out.join('')
}

// !important: the app's global stylesheets also style bare h1/p/a and would otherwise wash this fallback out.
const STATIC_CSS=`#seo-static{max-width:100%;min-height:100vh;box-sizing:border-box;padding:24px max(20px,calc(50% - 440px)) 48px;background:#fff!important;font:16px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}#seo-static *{color:#1d2433!important;font-family:inherit!important;opacity:1!important}#seo-static a{color:#4338ca!important;text-decoration:underline}#seo-static header{display:flex;flex-wrap:wrap;gap:8px 18px;align-items:center;margin-bottom:24px}#seo-static nav a{margin-right:12px}#seo-static h1{font-size:2rem;line-height:1.2;margin:.6em 0}#seo-static h2{font-size:1.4rem;margin:1.4em 0 .4em}#seo-static h3{font-size:1.1rem}#seo-static li{margin:4px 0}`

/** Returns the full HTML document for `path`, derived from the built index.html. */
export function renderPage(template:string,path:string):string{
 const seo=getSeoDataForPath(path)
 const url=path==='/'?`${ORIGIN}/`:`${ORIGIN}${path}`
 const t=esc(seo.title),d=esc(seo.description)
 let html=template
 const swap=(re:RegExp,val:string)=>{ if(!re.test(html))throw new Error(`prerender: template is missing ${re}`); html=html.replace(re,()=>val) }
 swap(/<title>[\s\S]*?<\/title>/,`<title>${t}</title>`)
 swap(/<meta name="description" content="[^"]*"\s*\/?>/,`<meta name="description" content="${d}" />`)
 swap(/<link rel="canonical" href="[^"]*"\s*\/?>/,`<link rel="canonical" href="${url}" />`)
 swap(/<meta property="og:title" content="[^"]*"\s*\/?>/,`<meta property="og:title" content="${t}" />`)
 swap(/<meta property="og:description" content="[^"]*"\s*\/?>/,`<meta property="og:description" content="${d}" />`)
 swap(/<meta property="og:url" content="[^"]*"\s*\/?>/,`<meta property="og:url" content="${url}" />`)
 swap(/<meta property="og:image" content="[^"]*"\s*\/?>/,`<meta property="og:image" content="${OG_IMAGE}" />`)
 swap(/<meta name="twitter:title" content="[^"]*"\s*\/?>/,`<meta name="twitter:title" content="${t}" />`)
 swap(/<meta name="twitter:description" content="[^"]*"\s*\/?>/,`<meta name="twitter:description" content="${d}" />`)
 swap(/<meta name="twitter:image" content="[^"]*"\s*\/?>/,`<meta name="twitter:image" content="${OG_IMAGE}" />`)
 swap(/<\/head>/,`<style>${STATIC_CSS}</style>${jsonLdFor(path)}</head>`)
 swap(/<div id="root"><\/div>/,`<div id="root">${chrome(bodyFor(path))}</div>`)
 return html
}

/** dist-relative file for a route. "/x" -> "x.html" (served at /x with html_handling: drop-trailing-slash). */
export const fileFor=(path:string)=>path==='/'?'index.html':`${path.slice(1)}.html`
