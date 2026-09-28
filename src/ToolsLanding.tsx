import {useEffect,useMemo,useState} from 'react'
import {categories,tools} from './toolRegistry'
import {Icon,IconName} from './Icons'

const categoryPaths:Record<string,string>={
 Text:'/text-tools',
 Developer:'/developer-tools',
 PDF:'/pdf-tools',
 Image:'/image-tools',
 Calculators:'/calculator-tools',
 Security:'/security-tools',
}

const categoryIcons:Record<string,IconName>={
 Text:'text',
 Developer:'developer',
 PDF:'pdf',
 Image:'image',
 Calculators:'calculator',
 Security:'security',
}

const toolIcons:Record<string,IconName>={
 'word-counter':'word-count','case-converter':'case-convert','slug-generator':'slug','lorem-ipsum-generator':'lorem','find-replace':'find-replace','word-frequency-counter':'word-frequency','html-tag-remover':'html-tag','duplicate-lines':'duplicate-lines','text-sorter':'sort','text-reverser':'reverse','line-break-remover':'line-break','extra-spaces':'extra-spaces','text-diff':'diff','character-counter':'character-count','sentence-counter':'sentence-count',
 'json-formatter':'json','json-validator':'json','json-minifier':'json','csv-to-json':'json','json-csv':'json','json-yaml':'json','base64':'base64','url-encoder':'url','jwt-decoder':'jwt','regex-tester':'regex','sql-formatter':'sql','html-formatter':'html','css-formatter':'css','javascript-formatter':'javascript','xml-formatter':'xml','markdown-previewer':'markdown','cron-generator':'cron','uuid-generator':'uuid','number-base-converter':'number-base','timestamp-converter':'timestamp','color-converter':'color','text-to-binary':'binary','color-contrast-checker':'contrast',
 'merge-pdf':'merge-pdf','split-pdf':'split-pdf','compress-pdf':'compress-pdf','rotate-pdf':'rotate-pdf','pdf-to-jpg':'pdf-to-jpg','jpg-to-pdf':'jpg-to-pdf','extract-pdf-pages':'extract-pdf','delete-pdf-pages':'delete-pdf','reorder-pdf-pages':'reorder-pdf','watermark-pdf':'watermark-pdf',
 'image-compressor':'image-compress','image-resizer':'image-resize','image-cropper':'image-crop','image-converter':'image-convert','jpg-to-png':'jpg-to-png','png-to-jpg':'png-to-jpg','webp-to-jpg':'webp-to-jpg','jpg-to-webp':'jpg-to-webp','png-to-webp':'png-to-webp','image-metadata':'image-metadata',
 'percentage-calculator':'percentage','discount-calculator':'discount','age-calculator':'age','date-calculator':'date','time-calculator':'time','bmi-calculator':'bmi','loan-calculator':'loan','emi-calculator':'emi','compound-interest':'compound-interest','tax-calculator':'tax','unit-converter':'unit-converter','simple-interest-calculator':'simple-interest','tip-calculator':'tip','countdown-calculator':'countdown',
 'password-generator':'password','sha-256':'sha-256','sha-512':'sha-512','md5':'md5','html-encoder':'html-encode','html-decoder':'html-decode','random-number-generator':'random-number'
}

const getToolIcon=(id:string,category:string):IconName=>toolIcons[id]??categoryIcons[category]??'grid'

export default function ToolsLanding(){
 const [query,setQuery]=useState('')
 const [activeCategory,setActiveCategory]=useState('All')

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

 const normalized=query.trim().toLowerCase()
 const visibleCategories=useMemo(()=>categories.slice(1).filter(category=>activeCategory==='All'||category===activeCategory),[activeCategory])
 const filteredCount=useMemo(()=>tools.filter(tool=>{
  const categoryMatches=activeCategory==='All'||tool.category===activeCategory
  const searchText=`${tool.name} ${tool.description} ${tool.keywords.join(' ')}`.toLowerCase()
  return categoryMatches&&(!normalized||searchText.includes(normalized))
 }).length,[activeCategory,normalized])

 const scrollToCategory=(category:string)=>{
  setActiveCategory(category)
  const target=document.getElementById(`catalog-${category.toLowerCase()}`)
  requestAnimationFrame(()=>target?.scrollIntoView({behavior:'smooth',block:'start'}))
 }

 return <main className="tools-landing">
  <section className="tools-landing-hero">
   <div className="info-shell">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><strong>Tools / Categories</strong></nav>
    <div className="catalog-hero-grid">
     <div className="catalog-hero-copy">
      <span className="info-kicker"><Icon name="sparkles" size={14}/> ToolsKit · Browse the toolkit</span>
      <h1>Everyday tools.<br/><em>Beautifully organized.</em></h1>
      <p>Find the right utility in seconds. Explore focused tools for text, developers, PDFs, images, calculations and security—built to work quickly in your browser.</p>
      <div className="catalog-hero-stats" aria-label="Toolkit statistics">
       <span><strong>{tools.length}</strong><small>tools</small></span>
       <i/>
       <span><strong>{categories.length-1}</strong><small>categories</small></span>
       <i/>
       <span><strong>Local</strong><small>core processing</small></span>
      </div>
     </div>
     <div className="catalog-hero-orbit" aria-hidden="true">
      <div className="catalog-orbit orbit-a"/><div className="catalog-orbit orbit-b"/><div className="catalog-orbit orbit-c"/>
      <div className="catalog-hero-center"><Icon name="grid" size={30}/><strong>{tools.length}</strong><span>focused utilities</span></div>
     </div>
    </div>
   </div>
  </section>

  <section className="info-shell tools-catalog">
   <div className="catalog-toolbar">
    <div className="catalog-search">
     <Icon name="search" size={19}/>
     <input value={query} onChange={e=>setQuery(e.target.value)} aria-label="Search tools" placeholder="Search tools by name, task, or keyword..." />
     {query&&<button type="button" aria-label="Clear search" onClick={()=>setQuery('')}><Icon name="close" size={16}/></button>}
    </div>
    <div className="catalog-result-count">{filteredCount} matching {filteredCount===1?'tool':'tools'}</div>
   </div>

   <nav className="catalog-category-nav" aria-label="Tool categories">
    <button type="button" className={activeCategory==='All'?'is-active':''} onClick={()=>setActiveCategory('All')}><Icon name="grid" size={16}/> All <span>{tools.length}</span></button>
    {categories.slice(1).map(category=><button type="button" key={category} className={activeCategory===category?'is-active':''} onClick={()=>setActiveCategory(category)}><Icon name={categoryIcons[category]} size={16}/>{category}<span>{tools.filter(t=>t.category===category).length}</span></button>)}
   </nav>

   <div className="catalog-intro-row">
    <div><span className="section-kicker">Tool library</span><h2>Pick a task. Get it done.</h2><p>Each card opens a dedicated workspace. No account required for the core browser tools.</p></div>
    <span className="catalog-local-badge"><span/> Runs locally</span>
   </div>

   {visibleCategories.map(category=>{
    const categoryTools=tools.filter(tool=>{
     const categoryMatches=tool.category===category
     const searchText=`${tool.name} ${tool.description} ${tool.keywords.join(' ')}`.toLowerCase()
     return categoryMatches&&(!normalized||searchText.includes(normalized))
    })
    if(!categoryTools.length)return null
    return <section className="catalog-category catalog-category-modern" id={`catalog-${category.toLowerCase()}`} key={category}>
     <div className="catalog-heading catalog-heading-modern">
      <a className="catalog-icon" data-cat={category} href={categoryPaths[category]} aria-label={`${category} tools`}><Icon name={categoryIcons[category]} size={22}/></a>
      <div><span>{category}</span><h2><a href={categoryPaths[category]}>{category} tools</a></h2><p>{categoryTools.length} focused {category.toLowerCase()} {categoryTools.length===1?'tool':'tools'}</p></div>
      <a className="catalog-section-link" href={categoryPaths[category]}>Explore category <Icon name="arrow" size={14}/></a>
     </div>

     <div className="catalog-grid catalog-grid-modern">
      {categoryTools.map((tool,index)=><a className="catalog-card catalog-card-modern" href={`/tools/${tool.id}`} key={tool.id} style={{'--delay':`${Math.min(index,8)*35}ms`}}>
       <span className="catalog-card-top">
        <span className="catalog-card-icon" data-cat={category}><Icon name={getToolIcon(tool.id,tool.category)} size={20}/></span>
        <span className="catalog-card-category">{category}</span>
       </span>
       <strong>{tool.name}</strong>
       <span className="catalog-card-description">{tool.description}</span>
       <span className="catalog-card-bottom"><b>Open tool</b><span className="catalog-card-arrow"><Icon name="arrow" size={15}/></span></span>
      </a>)}
     </div>
    </section>
   })}

   {!filteredCount&&<div className="catalog-empty"><span className="catalog-empty-icon"><Icon name="search" size={24}/></span><strong>No tools match “{query}”</strong><p>Try a broader term such as PDF, image, JSON, calculator, or password.</p><button type="button" onClick={()=>{setQuery('');setActiveCategory('All')}}>Show all tools <Icon name="arrow" size={15}/></button></div>}

   <div className="catalog-footer-cta">
    <div><span className="section-kicker">Need something specific?</span><h3>Search, open, and finish the job.</h3><p>ToolsKit keeps common utility work one click away without burying the useful stuff.</p></div>
    <a href="/">Back to home <Icon name="arrow" size={15}/></a>
   </div>
  </section>
 </main>
}
