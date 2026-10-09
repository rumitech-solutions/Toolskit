// Structured data shared by the browser (SeoContent) and the build-time pre-renderer
// (scripts/prerender-lib.ts), so both emit identical JSON-LD.
import type {ToolDefinition} from './types'
import type {ToolSeoProfile} from './toolSeo'

export const categoryPaths:Record<string,string>={
 Text:'/text-tools',Developer:'/developer-tools',PDF:'/pdf-tools',Image:'/image-tools',Calculators:'/calculator-tools',Security:'/security-tools',
 Finance:'/finance-tools',Health:'/health-tools',Design:'/design-tools',Productivity:'/productivity-tools',Converters:'/converter-tools',
}

export const categoryLabel=(c:string)=>c==='Calculators'?'Calculator Tools':c==='Converters'?'Converter Tools':`${c} Tools`

export function toolJsonLd(tool:ToolDefinition,profile:ToolSeoProfile,origin:string){
 const url=`${origin}/tools/${tool.id}`
 return {'@context':'https://schema.org','@graph':[
  {'@type':'WebPage','@id':`${url}#webpage`,name:`${tool.name} Online`,description:tool.description,url,isPartOf:{'@id':`${origin}/#website`},inLanguage:'en'},
  {'@type':'WebApplication','@id':`${url}#app`,name:tool.name,description:tool.description,url,applicationCategory:'UtilitiesApplication',operatingSystem:'Any',browserRequirements:'Requires a modern web browser',isAccessibleForFree:true,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}},
  {'@type':'BreadcrumbList',itemListElement:[
   {'@type':'ListItem',position:1,name:'ToolsKit',item:`${origin}/`},
   {'@type':'ListItem',position:2,name:categoryLabel(tool.category),item:`${origin}${categoryPaths[tool.category]||'/tools'}`},
   {'@type':'ListItem',position:3,name:tool.name,item:url}
  ]},
  {'@type':'HowTo',name:`How to use ${tool.name}`,step:profile.workflow.map((text,i)=>({'@type':'HowToStep',position:i+1,text}))},
  {'@type':'FAQPage',mainEntity:profile.faq.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))}
 ]}
}

export function websiteJsonLd(origin:string,toolCount:number){
 return {'@context':'https://schema.org','@graph':[
  {'@type':'Organization','@id':`${origin}/#organization`,name:'ToolsKit',url:`${origin}/`,logo:`${origin}/icon-512.png`},
  {'@type':'WebSite','@id':`${origin}/#website`,name:'ToolsKit',url:`${origin}/`,description:`${toolCount} free browser-based tools for text, development, PDFs, images, calculations, finance, health, design and security.`,publisher:{'@id':`${origin}/#organization`},inLanguage:'en',
   potentialAction:{'@type':'SearchAction',target:{'@type':'EntryPoint',urlTemplate:`${origin}/?q={search_term_string}`},'query-input':'required name=search_term_string'}}
 ]}
}
