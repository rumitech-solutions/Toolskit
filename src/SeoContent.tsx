import {useEffect,useState} from 'react'
import {getTool,tools} from './toolRegistry'
import {getRelatedTools,getToolSeoProfile} from './toolSeo'
import './seo-content.css'
import WorkflowLinks from './WorkflowLinks'

const categoryPaths:Record<string,string>={
 Text:'/text-tools',
 Developer:'/developer-tools',
 PDF:'/pdf-tools',
 Image:'/image-tools',
 Calculators:'/calculator-tools',
 Security:'/security-tools',
}

const categoryDescriptions:Record<string,string>={
 Text:'Count, clean, compare, sort, and transform text for writing, editing, and data preparation.',
 Developer:'Format, validate, encode, convert, and inspect common developer data and code.',
 PDF:'Merge, split, compress, rotate, extract, watermark, and convert PDF files in your browser.',
 Image:'Compress, resize, crop, convert, and inspect common image files locally.',
 Calculators:'Handle percentage, date, finance, health-reference, time, and unit calculations quickly.',
 Security:'Generate passwords, hashes, identifiers, and encoding results with browser-based helpers.',
}

export default function SeoContent(){
 const [path,setPath]=useState(()=>window.location.pathname.replace(/\/$/,'')||'/')
 useEffect(()=>{
  const onPop=()=>setPath(window.location.pathname.replace(/\/$/,'')||'/')
  window.addEventListener('popstate',onPop)
  return()=>window.removeEventListener('popstate',onPop)
 },[])
 const slug=path.startsWith('/tools/')?path.slice(7):''
 const tool=slug?getTool(slug):undefined
 const relatedTools=tool?getRelatedTools(slug):[]
 const profile=tool?getToolSeoProfile(tool):null

 useEffect(()=>{
  if(!tool||!profile)return
  const old=document.getElementById('toolkit-seo-jsonld')
  old?.remove()
  const json={'@context':'https://schema.org','@graph':[
   {'@type':'WebPage','@id':`${location.origin}${path}#webpage`,name:`${tool.name} Online`,description:tool.description,url:`${location.origin}${path}`},
   {'@type':'WebApplication','@id':`${location.origin}${path}#app`,name:tool.name,description:tool.description,url:`${location.origin}${path}`,applicationCategory:'UtilitiesApplication',operatingSystem:'Any',offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}},
   {'@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:'ToolsKit',item:location.origin+'/'},
    {'@type':'ListItem',position:2,name:`${tool.category} Tools`,item:`${location.origin}${categoryPaths[tool.category]||'/tools'}`},
    {'@type':'ListItem',position:3,name:tool.name}
   ]}
  ]}
  const script=document.createElement('script')
  script.id='toolkit-seo-jsonld'
  script.type='application/ld+json'
  script.textContent=JSON.stringify(json)
  document.head.appendChild(script)
  return()=>script.remove()
 },[path,tool,profile])

 if(!tool||!profile)return null

 return <section className="seo-content" aria-label={`${tool.name} information`}>
  <div className="seo-content-inner">
   <nav className="seo-breadcrumb" aria-label="Breadcrumb">
    <a href="/">ToolsKit</a><span>›</span>
    <a href={categoryPaths[tool.category]||'/tools'}>{tool.category} Tools</a><span>›</span>
    <strong>{tool.name}</strong>
   </nav>

   <div className="seo-copy">
    <span className="seo-kicker">Free online {tool.category.toLowerCase()} tool</span>
    <h1>{tool.name} Online</h1>
    <p className="seo-lead">{profile.intro} {tool.description}</p>
    <WorkflowLinks toolId={tool.id}/>

    <div className="seo-grid">
     <article>
      <h2>What is {tool.name} used for?</h2>
      <p>{profile.intro}</p>
      <ul className="seo-bullets">{profile.bestFor.map(item=><li key={item}>{item}</li>)}</ul>
     </article>
     <article>
      <h2>How to use {tool.name}</h2>
      <ol>{profile.workflow.map((step,i)=><li key={`${i}-${step}`}>{step}</li>)}</ol>
     </article>
    </div>

    <article className="seo-tips">
     <h2>Tips for better results</h2>
     <ul>{profile.tips.map(tip=><li key={tip}>{tip}</li>)}</ul>
    </article>

    <article className="seo-faq">
     <h2>Frequently asked questions</h2>
     {profile.faq.map(item=><details key={item.question}>
      <summary>{item.question}</summary>
      <p>{item.answer}</p>
     </details>)}
    </article>

    {relatedTools.length>0&&<article className="seo-related">
     <h2>Related {tool.category.toLowerCase()} tools</h2>
     <p>Continue the same workflow with another focused ToolsKit utility.</p>
     <div>{relatedTools.map(t=><a key={t.id} href={`/tools/${t.id}`}>
      <strong>{t.name}</strong><span>{t.description}</span>
     </a>)}</div>
    </article>}

    <div className="seo-categories">
     <strong>Explore tool categories</strong>
     {Object.keys(categoryPaths).map(c=><a key={c} href={categoryPaths[c]}>
      {c} — {categoryDescriptions[c]}
     </a>)}
    </div>
   </div>
  </div>
 </section>
}
