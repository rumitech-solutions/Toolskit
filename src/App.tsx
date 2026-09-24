import {useEffect,useMemo,useState} from 'react'
import {categories,getTool,tools} from './toolRegistry'
import {ageFromDate,binaryToText,bmi,characterCount,characterCountNoSpaces,colorConvert,compoundInterest,contrastRatio,convertCase,convertNumberBase,convertTimestamp,csvToJson,dateDifference,daysUntil,decodeBase64,decodeHtml,decodeJwt,decodeUrl,discount,diffLines,encodeBase64,encodeHtml,encodeUrl,emi,findReplace,formatCss,formatHtml,formatJs,formatJson,formatSql,formatXml,generatePassword,generateUuid,isValidJson,jsonToCsv,jsonToYaml,lineCount,loremIpsum,markdownPreview,md5,minifyJson,percentage,randomNumbers,readingTime,regexTest,removeDuplicateLines,removeExtraSpaces,removeLineBreaks,reverseText,sentenceCount,sha256,sha512,simpleInterest,slugify,sortLines,stripHtmlTags,tax,textToBinary,tipSplit,unitConversions,wordCount,wordFrequency} from './tools'
import {compressPdf,deletePdfPages,imagesToPdf,mergePdfs,reorderPdfPages,renderPdfToJpg,rotatePdf,selectPdfPages,watermarkPdf} from './pdfTools'
import {imageMetadata,processImage} from './imageTools'
import {Icon,IconName,SocialLinks} from './Icons'
import ChatWidget from './ChatWidget'
import WorkflowLinks from './WorkflowLinks'
import {validateFileCollection} from './resourceLimits'
import './styles.css'

type Values=Record<string,string>
const initialValues:Values={mode:'encode',spaces:'2',descending:'false',pattern:'\\d+',flags:'g',cron:'0 0 * * *',pages:'1',order:'1',angle:'90',quality:'82',width:'',height:'',cropX:'0',cropY:'0',cropWidth:'',cropHeight:'',format:'image/jpeg',amount:'1000',rate:'5',months:'12',years:'5',tax:'15',kg:'70',cm:'175',percent:'10',total:'100',birth:'2000-01-01',dateA:'2026-01-01',dateB:'2026-09-09',hours:'1',minutes:'30',from:'km',to:'miles',unitValue:'1',length:'24',count:'5',findText:'',replaceText:'',matchCase:'false',useRegexFR:'false',loremParagraphs:'3',fromBase:'10',toBase:'2',tsMode:'toDate',colorFg:'#111111',colorBg:'#ffffff',randMin:'1',randMax:'100',randCount:'5',targetDate:'2026-12-31',people:'2',watermarkText:'CONFIDENTIAL',watermarkOpacity:'30'}
const fileExt=(mime:string)=>mime==='image/png'?'png':mime==='image/webp'?'webp':'jpg'
function downloadBlob(blob:Blob,name:string){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)}
function downloadBytes(bytes:Uint8Array,name:string,type:string){const copy=new Uint8Array(bytes);downloadBlob(new Blob([copy.buffer as ArrayBuffer],{type}),name)}

const DEFAULT_TOOL_ID='word-counter'
const resolveToolId=(slug:string)=>getTool(slug)?.id??DEFAULT_TOOL_ID

const categoryMeta:Record<string,{icon:IconName;description:string}>= {All:{icon:'grid',description:'Everything in one place'},Text:{icon:'sparkles',description:'Write and clean text faster'},Developer:{icon:'grid',description:'Format, encode and inspect code'},PDF:{icon:'grid',description:'Work with documents locally'},Image:{icon:'grid',description:'Resize and convert images'},Calculators:{icon:'sparkles',description:'Fast everyday calculations'},Security:{icon:'sparkles',description:'Encoding and security helpers'}}

function App(){
 const slug=window.location.pathname.startsWith('/tools/')?window.location.pathname.slice(7).replace(/\/$/,''):DEFAULT_TOOL_ID
 const [active,setActive]=useState(resolveToolId(slug)),[category,setCategory]=useState('All'),[query,setQuery]=useState(()=>new URLSearchParams(window.location.search).get('q')||''),[input,setInput]=useState(''),[right,setRight]=useState(''),[output,setOutput]=useState(''),[error,setError]=useState(''),[values,setValues]=useState<Values>(initialValues),[files,setFiles]=useState<File[]>([])
 const tool=getTool(active)!
 useEffect(()=>{const onPop=()=>{setActive(resolveToolId(window.location.pathname.slice(7).replace(/\/$/,'')));setQuery(new URLSearchParams(window.location.search).get('q')||'')};window.addEventListener('popstate',onPop);return()=>window.removeEventListener('popstate',onPop)},[])
 const visible=useMemo(()=>tools.filter(t=>(category==='All'||t.category===category)&&`${t.name} ${t.description} ${t.keywords.join(' ')}`.toLowerCase().includes(query.toLowerCase().trim())),[category,query])
 const popular=useMemo(()=>tools.filter(t=>['word-counter','json-formatter','image-compressor','percentage-calculator','password-generator','merge-pdf','uuid-generator','base64'].includes(t.id)),[])
 const setV=(k:string,v:string)=>setValues(x=>({...x,[k]:v}))
 const select=(id:string)=>{setActive(resolveToolId(id));setOutput('');setError('');window.history.pushState({},'',`/tools/${id}`);window.scrollTo({top:0,behavior:'smooth'})}
 const calculator=['percentage-calculator','discount-calculator','age-calculator','date-calculator','time-calculator','bmi-calculator','loan-calculator','emi-calculator','compound-interest','tax-calculator','unit-converter','simple-interest-calculator','tip-calculator','countdown-calculator'].includes(active)
 const textInput=!tool.file&&!calculator&&!['uuid-generator','lorem-ipsum-generator','color-contrast-checker','random-number-generator'].includes(active)
 async function run(){setError('');setOutput('');try{if(tool.file)validateFileCollection(files,active==='merge-pdf'||active==='jpg-to-pdf'?2:1);let out='';switch(active){
 case'word-counter':out=`Words: ${wordCount(input)}\nCharacters: ${characterCount(input)}\nCharacters (no spaces): ${characterCountNoSpaces(input)}\nLines: ${lineCount(input)}\nSentences: ${sentenceCount(input)}\nEstimated reading time: ${readingTime(input)} min`;break
 case'character-counter':out=`Characters: ${characterCount(input)}\nWithout spaces: ${characterCountNoSpaces(input)}`;break
 case'sentence-counter':out=String(sentenceCount(input));break
 case'case-converter':out=convertCase(input,values.mode as never);break
 case'duplicate-lines':out=removeDuplicateLines(input);break
 case'extra-spaces':out=removeExtraSpaces(input);break
 case'text-sorter':out=sortLines(input,values.descending==='true');break
 case'text-reverser':out=reverseText(input);break
 case'text-diff':out=JSON.stringify(diffLines(input,right),null,2);break
 case'line-break-remover':out=removeLineBreaks(input);break
 case'slug-generator':out=slugify(input);break
 case'lorem-ipsum-generator':out=loremIpsum(Number(values.loremParagraphs)||3);break
 case'find-replace':out=findReplace(input,values.findText,values.replaceText,values.matchCase==='true',values.useRegexFR==='true');break
 case'word-frequency-counter':out=wordFrequency(input);break
 case'html-tag-remover':out=stripHtmlTags(input);break
 case'json-formatter':out=formatJson(input,Number(values.spaces)||2);break
 case'json-validator':out=isValidJson(input)?'✓ Valid JSON':'✗ Invalid JSON';break
 case'json-minifier':out=minifyJson(input);break
 case'json-csv':out=jsonToCsv(input);break
 case'json-yaml':out=jsonToYaml(input);break
 case'base64':out=values.mode==='decode'?decodeBase64(input):encodeBase64(input);break
 case'url-encoder':out=values.mode==='decode'?decodeUrl(input):encodeUrl(input);break
 case'jwt-decoder':out=decodeJwt(input);break
 case'regex-tester':out=JSON.stringify(regexTest(values.pattern,values.flags,input),null,2);break
 case'sql-formatter':out=formatSql(input);break
 case'html-formatter':out=formatHtml(input);break
 case'css-formatter':out=formatCss(input);break
 case'javascript-formatter':out=formatJs(input);break
 case'xml-formatter':out=formatXml(input);break
 case'markdown-previewer':out=markdownPreview(input);break
 case'cron-generator':out=values.cron;break
 case'csv-to-json':out=csvToJson(input);break
 case'number-base-converter':out=convertNumberBase(input,Number(values.fromBase)||10,Number(values.toBase)||2);break
 case'timestamp-converter':out=convertTimestamp(input,values.tsMode as 'toDate'|'toTimestamp');break
 case'color-converter':out=colorConvert(input);break
 case'text-to-binary':out=values.mode==='decode'?binaryToText(input):textToBinary(input);break
 case'color-contrast-checker':{const ratio=contrastRatio(values.colorFg,values.colorBg);out=`Contrast ratio: ${ratio}:1\nWCAG AA (normal text): ${ratio>=4.5?'Pass':'Fail'}\nWCAG AA (large text): ${ratio>=3?'Pass':'Fail'}\nWCAG AAA (normal text): ${ratio>=7?'Pass':'Fail'}`;break}
 case'uuid-generator':out=Array.from({length:Number(values.count)||1},()=>generateUuid()).join('\n');break
 case'password-generator':out=generatePassword(Number(values.length)||24);break
 case'random-number-generator':out=randomNumbers(Number(values.randMin),Number(values.randMax),Number(values.randCount));break
 case'html-encoder':out=encodeHtml(input);break
 case'html-decoder':out=decodeHtml(input);break
 case'sha-256':out=await sha256(input);break
 case'sha-512':out=await sha512(input);break
 case'md5':out=md5(input);break
 case'percentage-calculator':out=`${percentage(Number(values.amount),Number(values.total)).toFixed(2)}%`;break
 case'discount-calculator':{const p=Number(values.amount),r=Number(values.percent);out=`Savings: ${(p*r/100).toFixed(2)}\nFinal price: ${discount(p,r).toFixed(2)}`;break}
 case'age-calculator':out=`Age: ${ageFromDate(values.birth)} years`;break
 case'date-calculator':out=`${dateDifference(values.dateA,values.dateB).toFixed(0)} days`;break
 case'time-calculator':out=`${Math.floor(Number(values.hours)||0)*60+(Number(values.minutes)||0)} minutes`;break
 case'bmi-calculator':out=`BMI: ${bmi(Number(values.kg),Number(values.cm)).toFixed(2)}`;break
 case'loan-calculator':case'emi-calculator':out=`Monthly payment: ${emi(Number(values.amount),Number(values.rate),Number(values.months)).toFixed(2)}`;break
 case'compound-interest':{const total=compoundInterest(Number(values.amount),Number(values.rate),Number(values.years));out=`Final amount: ${total.toFixed(2)}\nInterest earned: ${(total-Number(values.amount)).toFixed(2)}`;break}
 case'tax-calculator':{const a=Number(values.amount),r=Number(values.tax),v=tax(a,r);out=`Tax: ${v.toFixed(2)}\nTotal: ${(a+v).toFixed(2)}`;break}
 case'unit-converter':{const v=Number(values.unitValue);const map:{[k:string]:number}={kmToMiles:unitConversions.kmToMiles(v),milesToKm:unitConversions.milesToKm(v),kgToLb:unitConversions.kgToLb(v),lbToKg:unitConversions.lbToKg(v),cToF:unitConversions.cToF(v),fToC:unitConversions.fToC(v),litersToGallons:unitConversions.litersToGallons(v),gallonsToLiters:unitConversions.gallonsToLiters(v)};const key=`${values.from}To${values.to==='km'?'Km':values.to==='miles'?'Miles':values.to==='kg'?'Lb':values.to==='lb'?'Kg':values.to==='c'?'F':values.to==='f'?'C':values.to==='liters'?'Gallons':'Liters'}`;out=String(map[key]??v);break}
 case'simple-interest-calculator':out=`Interest: ${simpleInterest(Number(values.amount),Number(values.rate),Number(values.years)).toFixed(2)}`;break
 case'tip-calculator':{const r=tipSplit(Number(values.amount),Number(values.percent),Number(values.people)||1);out=`Tip: ${r.tip.toFixed(2)}\nTotal: ${r.total.toFixed(2)}\nPer person: ${r.per.toFixed(2)}`;break}
 case'countdown-calculator':{const d=daysUntil(values.targetDate);out=d===0?'Today!':d>0?`${d} day${d===1?'':'s'} remaining`:`${Math.abs(d)} day${Math.abs(d)===1?'':'s'} ago`;break}
 case'merge-pdf':if(files.length<2)throw new Error('Select at least two PDF files.');downloadBytes(await mergePdfs(files),'toolskit-merged.pdf','application/pdf');out='PDF downloaded.';break
 case'split-pdf':case'extract-pdf-pages':{if(!files[0])throw new Error('Select a PDF file.');const nums=values.pages.split(/[,\s]+/).map(Number).filter(Boolean);downloadBytes(await selectPdfPages(files[0],nums),'toolskit-pages.pdf','application/pdf');out='PDF downloaded.';break}
 case'delete-pdf-pages':{if(!files[0])throw new Error('Select a PDF file.');const nums=values.pages.split(/[,\s]+/).map(Number).filter(Boolean);downloadBytes(await deletePdfPages(files[0],nums),'toolskit-deleted-pages.pdf','application/pdf');out='PDF downloaded.';break}
 case'reorder-pdf-pages':{if(!files[0])throw new Error('Select a PDF file.');const nums=values.order.split(/[,\s]+/).map(Number).filter(Boolean);downloadBytes(await reorderPdfPages(files[0],nums),'toolskit-reordered.pdf','application/pdf');out='PDF downloaded.';break}
 case'rotate-pdf':if(!files[0])throw new Error('Select a PDF file.');downloadBytes(await rotatePdf(files[0],Number(values.angle) as 90|180|270),'toolskit-rotated.pdf','application/pdf');out='PDF downloaded.';break
 case'watermark-pdf':if(!files[0])throw new Error('Select a PDF file.');downloadBytes(await watermarkPdf(files[0],values.watermarkText,Number(values.watermarkOpacity)/100),'toolskit-watermarked.pdf','application/pdf');out='PDF downloaded.';break
 case'pdf-to-jpg':if(!files[0])throw new Error('Select a PDF file.');downloadBlob(await renderPdfToJpg(files[0],Number(values.quality)/100),'toolskit-pages.zip');out='ZIP downloaded.';break
 case'compress-pdf':if(!files[0])throw new Error('Select a PDF file.');downloadBytes(await compressPdf(files[0],Number(values.quality)/100),'toolskit-compressed.pdf','application/pdf');out='PDF downloaded. Note: this method rasterizes pages, so selectable text/forms are not preserved.';break
 case'jpg-to-pdf':if(!files.length)throw new Error('Select at least one image.');downloadBytes(await imagesToPdf(files),'toolskit-images.pdf','application/pdf');out='PDF downloaded.';break
 case'image-compressor':case'image-resizer':case'image-cropper':case'image-converter':case'jpg-to-png':case'png-to-jpg':case'webp-to-jpg':case'jpg-to-webp':case'png-to-webp':{
  if(!files[0])throw new Error('Select an image.')
  const format=active.includes('png')?'image/png':active.includes('webp')?'image/webp':active.includes('jpg')?'image/jpeg':values.format as 'image/png'|'image/jpeg'|'image/webp'
  let opts:{format:'image/png'|'image/jpeg'|'image/webp';quality:number;width?:number;height?:number;crop?:{x:number;y:number;width:number;height:number}}={format,quality:Number(values.quality)/100}
  if(active==='image-cropper'){
   opts.crop={x:Number(values.cropX),y:Number(values.cropY),width:Number(values.cropWidth),height:Number(values.cropHeight)}
  }else if(active==='image-resizer'){
   opts.width=values.width?Number(values.width):undefined
   opts.height=values.height?Number(values.height):undefined
  }
  const blob=await processImage(files[0],opts)
  downloadBlob(blob,`toolskit.${fileExt(format)}`)
  out='Image downloaded.'
  break
}
case'image-metadata':if(!files[0])throw new Error('Select an image.');out=JSON.stringify(await imageMetadata(files[0]),null,2);break
 default:throw new Error('This tool is not implemented yet.')}
 setOutput(out)}catch(e){setError(e instanceof Error?e.message:'Could not process this input.')}}
 const clear=()=>{setInput('');setRight('');setOutput('');setError('');setFiles([])}
 const menuTools=category==='All'?tools:tools.filter(t=>t.category===category)
 return <div className="app ui-premium">

  <main>
   <section className="hero" id="about"><div className="hero-glow glow-one"/><div className="hero-glow glow-two"/><div className="hero-inner"><div className="hero-kicker"><span><Icon name="sparkles" size={13}/> Tools that work for you</span></div><h1>One focused toolkit.<br/><em>79+ tools for everyday work.</em></h1><p>ToolsKit brings practical tools for text, developers, PDFs, images, calculations and security into one fast, focused workspace.</p><div className="hero-actions"><a className="hero-cta" href="#tools">Explore tools <Icon name="arrow" size={17}/></a><a className="hero-secondary" href="mailto:rumitech.solutions00@gmail.com"><Icon name="mail" size={16}/> Contact us</a></div><div className="hero-proof"><span><b>{tools.length}+</b> focused utilities</span><span className="dot"/><span><b>6</b> smart categories</span><span className="dot"/><span><b>100%</b> client-side core tools</span></div></div></section>
   <section className="quick-section" id="tools"><div className="section-shell"><div className="section-heading"><div><span className="section-kicker">Browse the toolkit</span><h2>Everything organized. Nothing overwhelming.</h2><p>Pick a category to open its focused tool menu, then jump straight into the workspace.</p></div><div className="section-note"><Icon name="sparkles" size={16}/> Built for everyday speed</div></div>
    <div className="category-row">{categories.map(c=>{const meta=categoryMeta[c];return <button className={category===c?'category-tile active':'category-tile'} key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}><span className="category-icon" data-cat={c}><Icon name={meta.icon} size={18}/></span><span><b>{c}</b><small>{c==='All'?tools.length:tools.filter(t=>t.category===c).length} tools</small></span><Icon name="arrow" size={15}/></button>})}</div>
    <div className="tool-menu-panel"><div className="menu-panel-head"><div><span className="section-kicker">{category==='All'?'All tools':category}</span><h3>{category==='All'?'Explore the full collection':categoryMeta[category]?.description}</h3></div><span className="menu-count">{menuTools.length} tools</span></div><div className="menu-grid">{visible.map(t=><button className={active===t.id?'menu-tool active':'menu-tool'} key={t.id} aria-current={active===t.id} onClick={()=>select(t.id)}><span className="menu-tool-icon" data-cat={t.category}><Icon name={categoryMeta[t.category]?.icon??'grid'} size={16}/></span><span><b>{t.name}</b><small>{t.description}</small></span><Icon name="arrow" size={14}/></button>)}</div>{!visible.length&&<div className="empty-state"><Icon name="search" size={18}/><strong>No tools found</strong><span>Try a different search term.</span></div>}</div>
   </div></section>
   <section className="popular-section" id="popular"><div className="section-shell"><div className="section-heading compact"><div><span className="section-kicker">Popular right now</span><h2>Start with a favorite.</h2></div><span className="micro-note">Quick access to common tasks</span></div><div className="popular-grid">{popular.map(t=><button key={t.id} className="popular-card" onClick={()=>select(t.id)}><span className="popular-icon" data-cat={t.category}><Icon name={categoryMeta[t.category]?.icon??'sparkles'} size={17}/></span><span><b>{t.name}</b><small>{t.category}</small></span><Icon name="arrow" size={15}/></button>)}</div></div></section>
   <section className="workspace-section"><div className="section-shell"><article className="tool-panel"><div className="panel-head"><div><span className="section-kicker">{tool.category}</span><h2>{tool.name}</h2><p>{tool.description}</p></div><span className="local-pill"><span/> Local</span></div>{active==='text-diff'?<div className="diff-grid"><textarea aria-label="Original text" value={input} onChange={e=>setInput(e.target.value)} placeholder="Original text"/><textarea aria-label="Changed text" value={right} onChange={e=>setRight(e.target.value)} placeholder="Changed text"/><div className="diff-result">{diffLines(input,right).map(r=><div className={r.same?'same':'changed'} key={r.line}><b>{r.line}</b><span>{r.left}</span><span>{r.right}</span></div>)}</div></div>:<><ToolControls active={active} values={values} setV={setV} setFiles={setFiles}/>{textInput&&<textarea className="editor" aria-label={`${tool.name} input`} value={input} onChange={e=>setInput(e.target.value)} spellCheck={false} placeholder="Enter or paste your content here…"/>}<div className="actions"><button className="primary" onClick={run}>{tool.file?'Process files':active.includes('generator')||active.includes('hash')?'Generate':'Run tool'} <Icon name="arrow" size={16}/></button><button className="secondary" onClick={clear}>Clear</button></div>{error&&<div className="error" role="alert">{error}</div>}{output&&<div className="result" aria-live="polite"><div className="result-head"><span>Result</span><button onClick={()=>navigator.clipboard?.writeText(output)}>Copy</button></div>{active==='markdown-previewer'?<div className="markdown" dangerouslySetInnerHTML={{__html:`<p>${output}</p>`}}/>:<pre>{output}</pre>}</div>}</>}</article><WorkflowLinks toolId={active} onSelect={select}/></div></section>
  </main>
  <footer className="site-footer"><div className="footer-shell"><div className="footer-main"><div className="footer-brand"><button className="brand footer-logo" onClick={()=>{setCategory('All');select('word-counter')}}><span className="brand-mark"><Icon name="sparkles" size={16}/></span><span>Tools<span>Kit</span></span></button><p>A modern collection of useful web tools designed to help you get small jobs done quickly.</p><a className="email-link" href="mailto:rumitech.solutions00@gmail.com"><Icon name="mail" size={16}/>rumitech.solutions00@gmail.com</a></div><div><h3>Explore</h3><a href="#tools">All tools</a><a href="#popular">Popular tools</a><a href="#about">About ToolsKit</a></div><div><h3>Categories</h3>{categories.slice(1).slice(0,5).map(c=><button key={c} onClick={()=>{setCategory(c);window.location.hash='tools'}}>{c}</button>)}</div><div><h3>Stay connected</h3><p className="social-copy">Social profiles are ready to connect. Links can be added without changing the design.</p><SocialLinks/></div></div><div className="footer-bottom"><span>© 2026 Tools Kit. All rights reserved.</span><span>Created with <Icon name="heart" size={13}/> by <strong>RumiTech Solutions</strong></span><span className="footer-mail"><Icon name="mail" size={13}/> rumitech.solutions00@gmail.com</span></div></div></footer>
 <ChatWidget/>
 </div>
}

 
export default App

function ToolControls({
 active,values,setV,setFiles
}:{active:string;values:Values;setV:(k:string,v:string)=>void;setFiles:(f:File[])=>void}){
 const fileTools=tools.filter(t=>t.file).map(t=>t.id)
 if(fileTools.includes(active)){
  return <div className="controls">
   <label className="file-drop">Choose local files
    <input type="file" multiple={['merge-pdf','jpg-to-pdf'].includes(active)} accept={active.includes('pdf')?'application/pdf':'image/*'} onChange={e=>setFiles(Array.from(e.target.files??[]))}/>
   </label>
   {['split-pdf','extract-pdf-pages','delete-pdf-pages'].includes(active)&&<label>Pages<input value={values.pages} onChange={e=>setV('pages',e.target.value)}/></label>}
   {active==='reorder-pdf-pages'&&<label>Order<input value={values.order} onChange={e=>setV('order',e.target.value)}/></label>}
   {active==='rotate-pdf'&&<label>Angle<select value={values.angle} onChange={e=>setV('angle',e.target.value)}><option>90</option><option>180</option><option>270</option></select></label>}
   {active==='compress-pdf'&&<label>Quality<input type="range" min="30" max="95" value={values.quality} onChange={e=>setV('quality',e.target.value)}/></label>}
   {active==='watermark-pdf'&&<><label>Watermark text<input value={values.watermarkText} onChange={e=>setV('watermarkText',e.target.value)}/></label><label>Opacity %<input type="range" min="10" max="80" value={values.watermarkOpacity} onChange={e=>setV('watermarkOpacity',e.target.value)}/></label></>}
   {active==='image-cropper'&&<><label>X<input type="number" min="0" value={values.cropX} onChange={e=>setV('cropX',e.target.value)}/></label><label>Y<input type="number" min="0" value={values.cropY} onChange={e=>setV('cropY',e.target.value)}/></label><label>Crop width<input type="number" min="1" value={values.cropWidth} onChange={e=>setV('cropWidth',e.target.value)} placeholder="required"/></label><label>Crop height<input type="number" min="1" value={values.cropHeight} onChange={e=>setV('cropHeight',e.target.value)} placeholder="required"/></label><label>Quality<input type="range" min="10" max="100" value={values.quality} onChange={e=>setV('quality',e.target.value)}/></label></>}
   {(active==='image-compressor'||active==='image-resizer'||active==='image-converter'||['jpg-to-png','png-to-jpg','webp-to-jpg','jpg-to-webp','png-to-webp'].includes(active))&&<><label>Quality<input type="range" min="10" max="100" value={values.quality} onChange={e=>setV('quality',e.target.value)}/></label>{active==='image-resizer'&&<><label>Width<input type="number" min="1" value={values.width} onChange={e=>setV('width',e.target.value)} placeholder="auto"/></label><label>Height<input type="number" min="1" value={values.height} onChange={e=>setV('height',e.target.value)} placeholder="auto"/></label></>}</>}
  </div>
 }
 if(active==='case-converter')return <div className="chips">{['upper','lower','title','sentence','camel','pascal','kebab','snake'].map(x=><button className={values.mode===x?'chip active':'chip'} key={x} onClick={()=>setV('mode',x)}>{x}</button>)}</div>
 if(['base64','url-encoder','text-to-binary'].includes(active))return <div className="chips">{['encode','decode'].map(x=><button className={values.mode===x?'chip active':'chip'} key={x} onClick={()=>setV('mode',x)}>{x}</button>)}</div>
 if(active==='json-formatter')return <div className="controls"><label>Indent<input type="number" min="1" max="8" value={values.spaces} onChange={e=>setV('spaces',e.target.value)}/></label></div>
 if(active==='text-sorter')return <label className="check"><input type="checkbox" checked={values.descending==='true'} onChange={e=>setV('descending',String(e.target.checked))}/>Descending</label>
 if(active==='regex-tester')return <div className="controls"><label>Pattern<input value={values.pattern} onChange={e=>setV('pattern',e.target.value)}/></label><label>Flags<input value={values.flags} onChange={e=>setV('flags',e.target.value)}/></label></div>
 if(active==='cron-generator')return <div className="controls"><label>Preset<select value={values.cron} onChange={e=>setV('cron',e.target.value)}><option value="* * * * *">Every minute</option><option value="0 * * * *">Every hour</option><option value="0 0 * * *">Daily at midnight</option><option value="0 9 * * 1">Every Monday at 09:00</option><option value="0 0 1 * *">First day of every month</option></select></label></div>
 if(active==='uuid-generator')return <div className="controls"><label>Count<input type="number" min="1" max="100" value={values.count} onChange={e=>setV('count',e.target.value)}/></label></div>
 if(active==='password-generator')return <div className="controls"><label>Length<input type="number" min="8" max="128" value={values.length} onChange={e=>setV('length',e.target.value)}/></label></div>
 if(['slug-generator','word-frequency-counter','html-tag-remover','csv-to-json','color-converter','image-metadata'].includes(active))return null
 if(active==='lorem-ipsum-generator')return <div className="controls"><label>Paragraphs<input type="number" min="1" max="20" value={values.loremParagraphs} onChange={e=>setV('loremParagraphs',e.target.value)}/></label></div>
 if(active==='find-replace')return <div className="controls"><label>Find<input value={values.findText} onChange={e=>setV('findText',e.target.value)}/></label><label>Replace<input value={values.replaceText} onChange={e=>setV('replaceText',e.target.value)}/></label><label className="check"><input type="checkbox" checked={values.matchCase==='true'} onChange={e=>setV('matchCase',String(e.target.checked))}/>Match case</label><label className="check"><input type="checkbox" checked={values.useRegexFR==='true'} onChange={e=>setV('useRegexFR',String(e.target.checked))}/>Use regex</label></div>
 if(active==='number-base-converter')return <div className="controls"><label>From base<select value={values.fromBase} onChange={e=>setV('fromBase',e.target.value)}><option value="2">Binary (2)</option><option value="8">Octal (8)</option><option value="10">Decimal (10)</option><option value="16">Hex (16)</option></select></label><label>To base<select value={values.toBase} onChange={e=>setV('toBase',e.target.value)}><option value="2">Binary (2)</option><option value="8">Octal (8)</option><option value="10">Decimal (10)</option><option value="16">Hex (16)</option></select></label></div>
 if(active==='timestamp-converter')return <div className="chips">{[['toDate','To date'],['toTimestamp','To timestamp']].map(([v,l])=><button className={values.tsMode===v?'chip active':'chip'} key={v} onClick={()=>setV('tsMode',v)}>{l}</button>)}</div>
 if(active==='color-contrast-checker')return <div className="controls"><label>Foreground<input value={values.colorFg} onChange={e=>setV('colorFg',e.target.value)}/></label><label>Background<input value={values.colorBg} onChange={e=>setV('colorBg',e.target.value)}/></label></div>
 if(active==='random-number-generator')return <div className="controls"><label>Min<input type="number" value={values.randMin} onChange={e=>setV('randMin',e.target.value)}/></label><label>Max<input type="number" value={values.randMax} onChange={e=>setV('randMax',e.target.value)}/></label><label>Count<input type="number" min="1" max="1000" value={values.randCount} onChange={e=>setV('randCount',e.target.value)}/></label></div>
 if(active==='tip-calculator')return <div className="controls"><label>Bill amount<input type="number" value={values.amount} onChange={e=>setV('amount',e.target.value)}/></label><label>Tip %<input type="number" value={values.percent} onChange={e=>setV('percent',e.target.value)}/></label><label>People<input type="number" min="1" value={values.people} onChange={e=>setV('people',e.target.value)}/></label></div>
 if(active==='countdown-calculator')return <div className="controls"><label>Target date<input type="date" value={values.targetDate} onChange={e=>setV('targetDate',e.target.value)}/></label></div>
 if(['percentage-calculator','discount-calculator','loan-calculator','emi-calculator','compound-interest','tax-calculator','simple-interest-calculator'].includes(active))return <div className="controls"><label>Amount<input type="number" value={values.amount} onChange={e=>setV('amount',e.target.value)}/></label><label>Rate / %<input type="number" value={active==='tax-calculator'?values.tax:values.rate} onChange={e=>setV(active==='tax-calculator'?'tax':'rate',e.target.value)}/></label>{active==='percentage-calculator'&&<label>Total<input type="number" value={values.total} onChange={e=>setV('total',e.target.value)}/></label>}{active==='discount-calculator'&&<label>Discount %<input type="number" value={values.percent} onChange={e=>setV('percent',e.target.value)}/></label>}{['loan-calculator','emi-calculator'].includes(active)&&<label>Months<input type="number" value={values.months} onChange={e=>setV('months',e.target.value)}/></label>}{['compound-interest','simple-interest-calculator'].includes(active)&&<label>Years<input type="number" value={values.years} onChange={e=>setV('years',e.target.value)}/></label>}</div>
 if(active==='age-calculator')return <div className="controls"><label>Birth date<input type="date" value={values.birth} onChange={e=>setV('birth',e.target.value)}/></label></div>
 if(active==='date-calculator')return <div className="controls"><label>Start<input type="date" value={values.dateA} onChange={e=>setV('dateA',e.target.value)}/></label><label>End<input type="date" value={values.dateB} onChange={e=>setV('dateB',e.target.value)}/></label></div>
 if(active==='time-calculator')return <div className="controls"><label>Hours<input type="number" min="0" value={values.hours} onChange={e=>setV('hours',e.target.value)}/></label><label>Minutes<input type="number" min="0" value={values.minutes} onChange={e=>setV('minutes',e.target.value)}/></label></div>
 if(active==='bmi-calculator')return <div className="controls"><label>Weight kg<input type="number" value={values.kg} onChange={e=>setV('kg',e.target.value)}/></label><label>Height cm<input type="number" value={values.cm} onChange={e=>setV('cm',e.target.value)}/></label></div>
 if(active==='unit-converter')return <div className="controls"><label>Value<input type="number" value={values.unitValue} onChange={e=>setV('unitValue',e.target.value)}/></label><label>From<select value={values.from} onChange={e=>setV('from',e.target.value)}><option value="km">km</option><option value="miles">miles</option><option value="kg">kg</option><option value="lb">lb</option><option value="c">c</option><option value="f">f</option><option value="liters">liters</option><option value="gallons">gallons</option></select></label><label>To<select value={values.to} onChange={e=>setV('to',e.target.value)}><option value="miles">miles</option><option value="km">km</option><option value="lb">lb</option><option value="kg">kg</option><option value="f">f</option><option value="c">c</option><option value="gallons">gallons</option><option value="liters">liters</option></select></label></div>
 return null
}
