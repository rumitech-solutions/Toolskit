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
 Finance:'/finance-tools',
 Health:'/health-tools',
 Design:'/design-tools',
 Productivity:'/productivity-tools',
 Converters:'/converter-tools',
}

const categoryIcons:Record<string,IconName>={
 Text:'text',
 Developer:'developer',
 PDF:'pdf',
 Image:'image',
 Calculators:'calculator',
 Security:'security',
 Finance:'finance',
 Health:'health',
 Design:'design',
 Productivity:'productivity',
 Converters:'converters',
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
 const visibleCategories=useMemo(
  ()=>categories.slice(1).filter(category=>activeCategory==='All'||category===activeCategory),
  [activeCategory]
 )
 const filteredCount=useMemo(()=>tools.filter(tool=>{
  const categoryMatches=activeCategory==='All'||tool.category===activeCategory
  const searchText=`${tool.name} ${tool.description} ${tool.keywords.join(' ')}`.toLowerCase()
  return categoryMatches&&(!normalized||searchText.includes(normalized))
 }).length,[activeCategory,normalized])

 return <main className="tools-landing tk-catalog-page">
  <section className="tk-catalog-hero">
   <div className="info-shell">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><strong>Tools</strong></nav>
    <div className="tk-catalog-hero-grid">
     <div className="tk-catalog-copy">
      <span className="info-kicker"><Icon name="sparkles" size={13}/> ToolsKit · Tool library</span>
      <h1>Useful tools,<br/><em>without the clutter.</em></h1>
      <p>Search the library, choose a category, and open the exact tool you need. Clean interfaces, practical workflows, and browser-based processing.</p>
      <div className="tk-catalog-metrics" aria-label="Toolkit statistics">
       <span><strong>{tools.length}</strong><small>tools</small></span>
       <span><strong>{categories.length-1}</strong><small>categories</small></span>
       <span><strong>Local</strong><small>core tools</small></span>
      </div>
     </div>
     <div className="tk-catalog-summary" aria-label="Toolkit overview">
      <div className="tk-summary-top"><span>TOOLKIT OVERVIEW</span><Icon name="grid" size={17}/></div>
      <div className="tk-summary-number">{tools.length}<small> focused utilities</small></div>
      <div className="tk-summary-line"/>
      {categories.slice(1).map(category=><a key={category} href={categoryPaths[category]}><span className="tk-summary-icon" data-cat={category}><Icon name={categoryIcons[category]} size={14}/></span><span>{category}</span><b>{tools.filter(t=>t.category===category).length}</b></a>)}
     </div>
    </div>
   </div>
  </section>

  <section className="info-shell tools-catalog tk-catalog-content">
   <div className="tk-toolbar">
    <div className="tk-search">
     <Icon name="search" size={18}/>
     <input value={query} onChange={e=>setQuery(e.target.value)} aria-label="Search tools" placeholder="Search tools..." />
     {query&&<button type="button" aria-label="Clear search" onClick={()=>setQuery('')}><Icon name="close" size={15}/></button>}
    </div>
    <span className="tk-results">{filteredCount} {filteredCount===1?'result':'results'}</span>
   </div>

   <nav className="tk-filters" aria-label="Filter tools by category">
    <button type="button" className={activeCategory==='All'?'is-active':''} onClick={()=>setActiveCategory('All')}><Icon name="grid" size={15}/> All <b>{tools.length}</b></button>
    {categories.slice(1).map(category=><button key={category} type="button" className={activeCategory===category?'is-active':''} onClick={()=>setActiveCategory(category)}><Icon name={categoryIcons[category]} size={15}/>{category}<b>{tools.filter(t=>t.category===category).length}</b></button>)}
   </nav>

   <div className="tk-library-heading">
    <div><span className="section-kicker">Tool directory</span><h2>Find the tool, not the interface.</h2><p>Every card opens a dedicated workspace. The compact layout keeps the directory fast to scan.</p></div>
    <span className="tk-local"><span/> Browser-based</span>
   </div>

   {visibleCategories.map(category=>{
    const categoryTools=tools.filter(tool=>{
     const searchText=`${tool.name} ${tool.description} ${tool.keywords.join(' ')}`.toLowerCase()
     return tool.category===category&&(!normalized||searchText.includes(normalized))
    })
    if(!categoryTools.length)return null
    return <section className="tk-category" id={`catalog-${category.toLowerCase()}`} key={category}>
     <div className="tk-category-head">
      <a href={categoryPaths[category]} className="tk-category-icon" data-cat={category} aria-label={`${category} tools`}><Icon name={categoryIcons[category]} size={18}/></a>
      <div><span>{category}</span><h3><a href={categoryPaths[category]}>{category} tools</a></h3></div>
      <a className="tk-category-link" href={categoryPaths[category]}>View all <Icon name="arrow" size={14}/></a>
     </div>

     <div className="tk-tool-grid">
      {categoryTools.map(tool=><a href={`/tools/${tool.id}`} className="tk-tool-card" key={tool.id}>
       <span className="tk-tool-icon" data-cat={category}><Icon name={getToolIcon(tool.id,tool.category)} size={16}/></span>
       <span className="tk-tool-body"><strong>{tool.name}</strong><span>{tool.description}</span></span>
       <span className="tk-tool-arrow"><Icon name="arrow" size={14}/></span>
      </a>)}
     </div>
    </section>
   })}

   {!filteredCount&&<div className="tk-empty"><span><Icon name="search" size={21}/></span><strong>No tools found</strong><p>Try a broader search such as PDF, image, JSON, calculator, or password.</p><button type="button" onClick={()=>{setQuery('');setActiveCategory('All')}}>Reset filters <Icon name="arrow" size={14}/></button></div>}

   <div className="tk-catalog-cta">
    <div><span className="section-kicker">ToolsKit</span><h3>Small task. Clear tool. Done.</h3><p>Keep the utility directory simple and jump straight into the work.</p></div>
    <a href="/">Back to home <Icon name="arrow" size={14}/></a>
   </div>
  </section>
 </main>
}
