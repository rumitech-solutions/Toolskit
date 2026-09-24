import {useEffect} from 'react'
import {tools} from './toolRegistry'
import type {Category} from './types'
import {siteNavigation,type SitePage as SitePageData} from './siteNavigation'

type Props={page:SitePageData}

const categoryRouteByPage:Record<string,Category>={
 '/developer-tools':'Developer',
 '/text-tools':'Text',
 '/pdf-tools':'PDF',
 '/image-tools':'Image',
 '/calculator-tools':'Calculators',
 '/security-tools':'Security',
}

export default function SitePage({page}:Props){
 const category=categoryRouteByPage[page.path]
 const categoryTools=category?tools.filter(tool=>tool.category===category):[]

 useEffect(()=>{
  document.title=page.title
  document.querySelector('meta[name="description"]')?.setAttribute('content',page.description)

  const old=document.getElementById('toolskit-sitepage-jsonld')
  old?.remove()

  const graph:any[]=[
   {'@type':'WebPage','@id':`${location.origin}${page.path}#webpage`,name:page.title.split(' | ')[0],description:page.description,url:`${location.origin}${page.path}`},
   {'@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:'ToolsKit',item:location.origin+'/'},
    {'@type':'ListItem',position:2,name:page.title.split(' | ')[0]}
   ]}
  ]

  if(category){
   graph.push({
    '@type':'ItemList',
    '@id':`${location.origin}${page.path}#tools`,
    name:`${category} tools`,
    itemListElement:categoryTools.map((tool,index)=>({
     '@type':'ListItem',
     position:index+1,
     name:tool.name,
     url:`${location.origin}/tools/${tool.id}`
    }))
   })
  }

  const script=document.createElement('script')
  script.id='toolskit-sitepage-jsonld'
  script.type='application/ld+json'
  script.textContent=JSON.stringify({'@context':'https://schema.org','@graph':graph})
  document.head.appendChild(script)
  return()=>script.remove()
 },[page,category,categoryTools.length])

 return <main className="info-page">
  <div className="info-hero">
   <div className="info-hero-grid"/>
   <div className="info-shell">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><strong>{page.title.split(' | ')[0]}</strong></nav>
    <span className="info-kicker">ToolsKit · {page.title.split(' | ')[0]}</span>
    <h1>{page.title.split(' | ')[0]}</h1>
    <p>{page.description}</p>
   </div>
  </div>

  <div className="info-shell info-body">
   <aside className="info-toc" aria-label="On this page">
    <span>On this page</span>
    {page.sections.map((section,i)=><a href={`#section-${i+1}`} key={section.heading}>{section.heading}</a>)}
    {category&&<a href="#category-tools">Browse {category} tools</a>}
   </aside>
   <article className="info-content">
    {page.sections.map((section,i)=><section id={`section-${i+1}`} className="info-section" key={section.heading}>
     <div className="info-section-number">{String(i+1).padStart(2,'0')}</div>
     <div><h2>{section.heading}</h2>{section.body.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div>
    </section>)}

    {category&&<section id="category-tools" className="category-tools-hub">
     <div className="category-tools-heading">
      <div><span className="info-kicker">Browse the collection</span><h2>{category} tools</h2><p>Open a dedicated page for any {category.toLowerCase()} task and jump straight into its browser workspace.</p></div>
      <a href="/tools">View all tools →</a>
     </div>
     <div className="category-tools-grid">
      {categoryTools.map(tool=><a className="category-tool-card" href={`/tools/${tool.id}`} key={tool.id}>
       <strong>{tool.name}</strong><span>{tool.description}</span><b>Open tool →</b>
      </a>)}
     </div>
    </section>}

    <div className="info-cta"><strong>Need help or have a suggestion?</strong><a href="mailto:rumitech.solutions00@gmail.com">Contact ToolsKit</a></div>
   </article>
  </div>

  <div className="info-shell info-links">
   <span>Explore</span>
   {siteNavigation.filter(item=>!['/privacy-policy','/terms-and-conditions'].includes(item.path)).map(item=><a href={item.path} key={item.path}>{item.label}</a>)}
  </div>
 </main>
}
