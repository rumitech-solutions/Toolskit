import {useEffect} from 'react'
import {categories,tools} from './toolRegistry'

const icons:{[key:string]:string}={Text:'✎',Developer:'</>',PDF:'▱',Image:'◈',Calculators:'∑',Security:'⌘'}
const categoryPaths:Record<string,string>={
 Text:'/text-tools',
 Developer:'/developer-tools',
 PDF:'/pdf-tools',
 Image:'/image-tools',
 Calculators:'/calculator-tools',
 Security:'/security-tools',
}

export default function ToolsLanding(){
 useEffect(()=>{
  const old=document.getElementById('toolskit-tools-jsonld')
  old?.remove()
  const categoryItems=categories.slice(1).map((category,index)=>({
   '@type':'ListItem',
   position:index+1,
   name:`${category} Tools`,
   url:`${location.origin}${categoryPaths[category]}`
  }))
  const json={'@context':'https://schema.org','@graph':[
   {'@type':'WebPage','@id':location.origin+'/tools#webpage',name:'All Tools & Categories | ToolsKit',description:'Browse all ToolsKit utilities by category and open a dedicated browser workspace for each task.',url:location.origin+'/tools'},
   {'@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:'ToolsKit',item:location.origin+'/'},
    {'@type':'ListItem',position:2,name:'Tools & Categories'}
   ]},
   {'@type':'ItemList','@id':location.origin+'/tools#categories',name:'ToolsKit categories',itemListElement:categoryItems}
  ]}
  const script=document.createElement('script')
  script.id='toolskit-tools-jsonld'
  script.type='application/ld+json'
  script.textContent=JSON.stringify(json)
  document.head.appendChild(script)
  return()=>script.remove()
 },[])

 return <main className="tools-landing">
  <section className="tools-landing-hero">
   <div className="info-shell">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><strong>Tools / Categories</strong></nav>
    <span className="info-kicker">ToolsKit · Browse the toolkit</span>
    <h1>Free online tools, organized by task.</h1>
    <p>Explore the full ToolsKit collection by category. Each utility has a dedicated page with its own workspace, instructions, and related tools so you can solve a specific task quickly.</p>
   </div>
  </section>
  <section className="info-shell tools-catalog">
   {categories.slice(1).map(category=><section className="catalog-category" key={category}>
    <div className="catalog-heading">
     <a className="catalog-icon" data-cat={category} href={categoryPaths[category]} aria-label={`${category} tools`}>{icons[category]??'✦'}</a>
     <div><span>{category}</span><h2><a href={categoryPaths[category]}>{category} tools</a></h2></div>
     <small>{tools.filter(t=>t.category===category).length} tools</small>
    </div>
    <div className="catalog-grid">
     {tools.filter(t=>t.category===category).map(tool=><a className="catalog-card" href={`/tools/${tool.id}`} key={tool.id}>
      <strong>{tool.name}</strong><span>{tool.description}</span><b>Open tool →</b>
     </a>)}
    </div>
   </section>)}
  </section>
 </main>
}
