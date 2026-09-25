import {tools} from './toolRegistry'

const base='https://toolskit.sbs'

type SeoData={title:string;description:string}

const defaults:SeoData={
 title:'ToolsKit — Free Online Developer, PDF, Image & Text Tools',
 description:'Free online tools for developers, text, PDF, images, calculators and security. Fast, private browser-based tools from ToolsKit.'
}

const seoBySlug:Record<string,SeoData>={
 'word-counter':{title:'Word Counter — Count Words & Characters Online | ToolsKit',description:'Free word counter to count words, characters, lines, sentences and reading time instantly in your browser.'},
 'character-counter':{title:'Character Counter — Count Characters Online | ToolsKit',description:'Count characters with and without spaces instantly. A fast free online character counter.'},
 'json-formatter':{title:'JSON Formatter — Beautify & Format JSON Online | ToolsKit',description:'Format and beautify JSON online with readable indentation. Fast browser-based JSON formatter.'},
 'json-validator':{title:'JSON Validator — Validate JSON Online | ToolsKit',description:'Validate JSON instantly in your browser and quickly find invalid JSON input.'},
 'json-minifier':{title:'JSON Minifier — Minify JSON Online | ToolsKit',description:'Minify JSON online by removing unnecessary whitespace. Fast and free browser-based JSON minifier.'},
 'base64':{title:'Base64 Encoder & Decoder — Online Tool | ToolsKit',description:'Encode or decode UTF-8 text with Base64 instantly. Fast browser-based Base64 encoder and decoder.'},
 'url-encoder':{title:'URL Encoder & Decoder — Encode URLs Online | ToolsKit',description:'Encode or decode URL components online with a fast browser-based URL encoder and decoder.'},
 'jwt-decoder':{title:'JWT Decoder — Decode JSON Web Tokens Online | ToolsKit',description:'Decode JWT headers and payloads locally in your browser. No server upload required.'},
 'regex-tester':{title:'Regex Tester — Test Regular Expressions Online | ToolsKit',description:'Test JavaScript regular expressions and inspect matches instantly with this free regex tester.'},
 'merge-pdf':{title:'Merge PDF — Combine PDF Files Online | ToolsKit',description:'Merge multiple PDF files into one PDF directly in your browser. Fast and private.'},
 'split-pdf':{title:'Split PDF — Extract PDF Pages Online | ToolsKit',description:'Split a PDF and extract selected pages directly in your browser with no required upload.'},
 'compress-pdf':{title:'Compress PDF — Reduce PDF Size Online | ToolsKit',description:'Compress PDF files in your browser with adjustable quality. Fast local PDF compression.'},
 'pdf-to-jpg':{title:'PDF to JPG — Convert PDF Pages to Images | ToolsKit',description:'Convert PDF pages to JPG images directly in your browser. Fast and private.'},
 'jpg-to-pdf':{title:'JPG to PDF — Convert Images to PDF Online | ToolsKit',description:'Combine JPG, PNG and WebP images into a PDF directly in your browser.'},
 'image-compressor':{title:'Image Compressor — Compress Images Online | ToolsKit',description:'Compress images online in your browser with adjustable quality. Fast, free and private.'},
 'image-resizer':{title:'Image Resizer — Resize Images Online | ToolsKit',description:'Resize images online while preserving aspect ratio. Process images directly in your browser.'},
 'image-converter':{title:'Image Converter — Convert Image Formats Online | ToolsKit',description:'Convert browser-supported image formats quickly and privately in your browser.'},
 'jpg-to-png':{title:'JPG to PNG Converter — Convert JPG to PNG Online | ToolsKit',description:'Convert JPG images to PNG online directly in your browser. Fast and free.'},
 'png-to-jpg':{title:'PNG to JPG Converter — Convert PNG to JPG Online | ToolsKit',description:'Convert PNG images to JPG online directly in your browser.'},
 'percentage-calculator':{title:'Percentage Calculator — Calculate Percentages Online | ToolsKit',description:'Calculate percentages and percentage change instantly with this free online percentage calculator.'},
 'discount-calculator':{title:'Discount Calculator — Calculate Sale Price & Savings | ToolsKit',description:'Calculate discounts, savings and final sale prices instantly with a free online calculator.'},
 'age-calculator':{title:'Age Calculator — Calculate Your Age Online | ToolsKit',description:'Calculate age from a birth date instantly with this free online age calculator.'},
 'date-calculator':{title:'Date Calculator — Calculate Days Between Dates | ToolsKit',description:'Calculate the number of days between two dates instantly with a free online date calculator.'},
 'unit-converter':{title:'Unit Converter — Convert Length, Weight, Temperature & Volume | ToolsKit',description:'Convert common units for length, weight, temperature and volume with a fast free online unit converter.'},
 'password-generator':{title:'Password Generator — Create Strong Passwords Online | ToolsKit',description:'Generate strong random passwords locally in your browser. Fast, free and private.'},
 'uuid-generator':{title:'UUID Generator — Generate UUID v4 Online | ToolsKit',description:'Generate cryptographically strong UUID v4 values instantly in your browser.'}
}

const seoByPath:Record<string,SeoData>={
 '/':defaults,
 '/tools':{title:'Free Online Tools & Utilities | ToolsKit',description:'Browse 79+ free browser-based tools for text, development, PDFs, images, calculations and security.'},
 '/developer-tools':{title:'Developer Tools — Free Online Tools for Developers | ToolsKit',description:'Free online developer tools for JSON, Base64, URLs, JWTs, regex, SQL, HTML, CSS, JavaScript, XML, Markdown, cron and UUID workflows.'},
 '/text-tools':{title:'Text Tools — Free Online Text Utilities | ToolsKit',description:'Free text tools for counting, cleaning, comparing, sorting, reversing and converting text in your browser.'},
 '/pdf-tools':{title:'PDF Tools — Free Browser-Based PDF Utilities | ToolsKit',description:'Merge, split, compress, rotate, extract, watermark and convert PDF files in your browser with ToolsKit.'},
 '/image-tools':{title:'Image Tools — Free Online Image Utilities | ToolsKit',description:'Compress, resize, crop and convert images locally in your browser with free ToolsKit image tools.'},
 '/calculator-tools':{title:'Online Calculators — Free Everyday Calculators | ToolsKit',description:'Free calculators for percentages, discounts, age, dates, loans, EMI, interest, tax, tips and unit conversion.'},
 '/security-tools':{title:'Security Tools — Free Browser-Based Security Helpers | ToolsKit',description:'Free password, hash, identifier and encoding utilities designed for quick browser-based technical workflows.'},
 '/about':{title:'About ToolsKit — Free Browser Tools | ToolsKit',description:'Learn what ToolsKit is, how the toolkit is designed, and why browser-first utilities can make everyday tasks faster.'},
 '/contact':{title:'Contact ToolsKit — Support & Feedback | ToolsKit',description:'Contact ToolsKit with questions, feedback, corrections, suggestions, or partnership enquiries.'},
 '/privacy-policy':{title:'Privacy Policy | ToolsKit',description:'Read how ToolsKit handles information, local browser processing, storage, contact messages, and third-party services.'},
 '/terms-and-conditions':{title:'Terms & Conditions | ToolsKit',description:'Read the terms that apply when using the ToolsKit website and its browser-based utilities.'}
}

const buildFallback=(slug:string):SeoData=>{
 const t=tools.find(x=>x.id===slug)
 if(!t)return defaults
 return {
  title:`${t.name} — Free Online Tool | ToolsKit`,
  description:`${t.name}: ${t.description} Use it online with ToolsKit for a fast browser-based workflow without an account.`
 }
}

export const getSeoDataForPath=(path:string):SeoData=>{
 const normalized=normalizePath(path)
 const slug=normalized.startsWith('/tools/')?normalized.slice(7):''
 return slug?seoBySlug[slug]??buildFallback(slug):seoByPath[normalized]??defaults
}

export const normalizePath=(value:string)=>value.replace(/\/$/,'')||'/'
export const canonicalUrl=(path=typeof window==='undefined'?'/':window.location.pathname)=>`${base}${normalizePath(path)}`

function setMeta(selector:string,attribute:string,value:string){
 if(typeof document==='undefined')return
 let meta=document.querySelector<HTMLMetaElement>(selector)
 if(!meta){meta=document.createElement('meta');document.head.appendChild(meta)}
 meta.setAttribute(attribute,value)
}

function sync(){
 if(typeof document==='undefined')return
 const path=normalizePath(window.location.pathname)
 const data=getSeoDataForPath(path)
 const canonical=canonicalUrl(path)
 document.title=data.title
 setMeta('meta[name="description"]','content',data.description)
 setMeta('meta[property="og:title"]','content',data.title)
 setMeta('meta[property="og:description"]','content',data.description)
 setMeta('meta[property="og:type"]','content','website')
 setMeta('meta[property="og:url"]','content',canonical)
 setMeta('meta[property="og:image"]','content',`${base}/og-image.svg`)
 setMeta('meta[name="twitter:title"]','content',data.title)
 setMeta('meta[name="twitter:description"]','content',data.description)
 setMeta('meta[name="twitter:image"]','content',`${base}/og-image.svg`)
 const verification=typeof import.meta.env.VITE_GOOGLE_SITE_VERIFICATION==='string'?import.meta.env.VITE_GOOGLE_SITE_VERIFICATION.trim():''
 const oldVerification=document.querySelector('meta[name="google-site-verification"]')
 if(verification)setMeta('meta[name="google-site-verification"]','content',verification)
 else oldVerification?.remove()
 let link=document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
 if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link)}
 link.href=canonical
}

function syncGlobalStructuredData(path:string){
 if(typeof document==='undefined')return
 const id='toolskit-global-jsonld'
 const old=document.getElementById(id)
 old?.remove()
 if(path!=='/')return
 const popularIds=['word-counter','json-formatter','image-compressor','percentage-calculator','password-generator','merge-pdf','uuid-generator','base64']
 const json={'@context':'https://schema.org','@graph':[
  {'@type':'WebSite','@id':`${location.origin}/#website`,name:'ToolsKit',url:location.origin+'/',description:defaults.description},
  {'@type':'ItemList','@id':`${location.origin}/#popular-tools`,name:'Popular ToolsKit tools',itemListElement:popularIds.map((id,index)=>({
   '@type':'ListItem',
   position:index+1,
   name:tools.find(tool=>tool.id===id)?.name??id,
   url:`${location.origin}/tools/${id}`
  }))}
 ]}
 const script=document.createElement('script')
 script.id=id
 script.type='application/ld+json'
 script.textContent=JSON.stringify(json)
 document.head.appendChild(script)
}

if(typeof window!=='undefined'){
 const syncAll=()=>{
  const path=normalizePath(window.location.pathname)
  sync()
  syncGlobalStructuredData(path)
 }
 syncAll()
 window.addEventListener('popstate',syncAll)
}
