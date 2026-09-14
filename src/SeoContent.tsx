import {useEffect,useState} from 'react'
import {getTool,tools} from './toolRegistry'
import './seo-content.css'

const categories=['Text','Developer','PDF','Image','Calculators','Security']
const categoryDescriptions:Record<string,string>={
 Text:'Clean, count, compare and transform text quickly.',
 Developer:'Format, validate, encode and inspect common developer data.',
 PDF:'Merge, split, compress, rotate and convert PDF files in your browser.',
 Image:'Resize, crop, compress and convert common image formats locally.',
 Calculators:'Solve common percentage, date, finance and unit calculations.',
 Security:'Generate passwords, hashes and encoding results locally.'
}

function related(currentId:string){
 const current=getTool(currentId)
 if(!current)return []
 return tools.filter(t=>t.id!==currentId&&t.category===current.category).slice(0,5)
}

export default function SeoContent(){
 const [path,setPath]=useState(()=>window.location.pathname.replace(/\/$/,'')||'/')
 useEffect(()=>{const onPop=()=>setPath(window.location.pathname.replace(/\/$/,'')||'/');window.addEventListener('popstate',onPop);return()=>window.removeEventListener('popstate',onPop)},[])
 const slug=path.startsWith('/tools/')?path.slice(7):''
 const tool=slug?getTool(slug):undefined
 const isTool=Boolean(tool)
 const relatedTools=isTool?related(slug):[]
 useEffect(()=>{
  if(!tool)return
  const old=document.getElementById('toolkit-seo-jsonld');old?.remove()
  const faq=[
   {q:`What is ${tool.name}?`,a:tool.description},
   {q:`Is ${tool.name} free?`,a:'Yes. ToolsKit provides this browser tool for free.'},
   {q:'Are my files or text uploaded?',a:'Core ToolsKit processing is designed to run in your browser, so input can stay on your device.'},
   {q:'How do I use this tool?',a:`Open ${tool.name}, enter or select your input, choose any available options, then run the tool and copy or download the result.`}
  ]
  const json={'@context':'https://schema.org','@graph':[
   {'@type':'WebApplication','@id':`${location.origin}${path}#app`,name:tool.name,description:tool.description,url:`${location.origin}${path}`,applicationCategory:'UtilitiesApplication',operatingSystem:'Any',offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}},
   {'@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:'ToolsKit',item:location.origin+'/'},
    {'@type':'ListItem',position:2,name:`${tool.category} Tools`,item:`${location.origin}/tools`},
    {'@type':'ListItem',position:3,name:tool.name,item:`${location.origin}${path}`}
   ]},
   {'@type':'FAQPage',mainEntity:faq.map(x=>({'@type':'Question',name:x.q,acceptedAnswer:{'@type':'Answer',text:x.a}}))}
  ]}
  const script=document.createElement('script');script.id='toolkit-seo-jsonld';script.type='application/ld+json';script.textContent=JSON.stringify(json);document.head.appendChild(script)
  return()=>script.remove()
 },[isTool,path,tool])
 if(!tool)return null
 return <section className="seo-content" aria-label={`${tool.name} information`}>
  <div className="seo-content-inner">
   <nav className="seo-breadcrumb" aria-label="Breadcrumb"><a href="/">ToolsKit</a><span>›</span><a href="/tools">{tool.category} Tools</a><span>›</span><strong>{tool.name}</strong></nav>
   <div className="seo-copy">
    <span className="seo-kicker">Free online {tool.category.toLowerCase()} tool</span>
    <h1>{tool.name} Online</h1>
    <p className="seo-lead">{tool.description} Use ToolsKit to complete this task quickly in your browser without creating an account.</p>
    <div className="seo-grid">
     <article><h2>How to use {tool.name}</h2><ol><li>Enter or select your input above.</li><li>Choose any available options.</li><li>Run the tool and review the result.</li><li>Copy or download the result when finished.</li></ol></article>
     <article><h2>Why use ToolsKit?</h2><ul><li>Fast browser-based workflow.</li><li>No account required for the core tool.</li><li>Simple interface focused on one task.</li><li>Designed to keep core processing local.</li></ul></article>
    </div>
    <article className="seo-faq"><h2>Frequently asked questions</h2>{[
      [`What is ${tool.name}?`,tool.description],
      [`Is ${tool.name} free?`,'Yes. ToolsKit provides this browser tool for free.'],
      ['Are my files or text uploaded?','Core ToolsKit processing is designed to run in your browser, so input can stay on your device.'],
      ['Do I need an account?','No account is required for the core browser-based workflow.']
    ].map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</article>
    {relatedTools.length>0&&<div className="seo-related"><h2>Related {tool.category} tools</h2><div>{relatedTools.map(t=><a key={t.id} href={`/tools/${t.id}`}><strong>{t.name}</strong><span>{t.description}</span></a>)}</div></div>}
   </div>
   <div className="seo-categories"><strong>Explore more tools</strong>{categories.map(c=><a key={c} href="/tools">{c} — {categoryDescriptions[c]}</a>)}</div>
  </div>
 </section>
