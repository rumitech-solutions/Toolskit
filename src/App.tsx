import {FavButton,QuickAccess,toast,trackRecent} from './Enhancements'
import {useEffect,useMemo,useState} from 'react'
import {categories,getTool,tools} from './toolRegistry'
import {ageFromDate,binaryToText,bmi,characterCount,characterCountNoSpaces,colorConvert,compoundInterest,contrastRatio,convertCase,convertNumberBase,convertTimestamp,csvToJson,dateDifference,daysUntil,decodeBase64,decodeHtml,decodeJwt,decodeUrl,discount,diffLines,encodeBase64,encodeHtml,encodeUrl,emi,findReplace,formatCss,formatHtml,formatJs,formatJson,formatSql,formatXml,generatePassword,generateUuid,isValidJson,jsonToCsv,jsonToYaml,lineCount,loremIpsum,markdownPreview,md5,minifyJson,percentage,randomNumbers,readingTime,regexTest,removeDuplicateLines,removeExtraSpaces,removeLineBreaks,reverseText,sentenceCount,sha256,sha512,simpleInterest,slugify,sortLines,stripHtmlTags,tax,textToBinary,tipSplit,unitConversions,wordCount,wordFrequency,aspectRatio,caesarCipher,csvToMarkdownTable,decodeBase32,encodeBase32,factorial,fromRoman,gcdLcm,hexToTextValue,isPalindrome,isPrime,minifyCss,minifyHtml,morseToText,parseQueryString,passwordStrength,percentageChange,removeNumbers,removePunctuation,rot13,sha1,shuffleLines,textStatistics,textToHex,textToMorse,toNato,toRoman,truncateText,vowelConsonantCount} from './tools'
import {compressPdf,deletePdfPages,getPdfPageCount,imagesToPdf,mergePdfs,reorderPdfPages,renderPdfToJpg,rotatePdf,selectPdfPages,watermarkPdf} from './pdfTools'
import {imageMetadata,processImage} from './imageTools'
import {Icon,IconName} from './Icons'
import {SocialLinks} from './Icons'
import WorkflowLinks from './WorkflowLinks'
import {validateFileCollection} from './resourceLimits'
import ExtraToolPanel,{isExtraTool} from './extras/ExtraToolPanel'
import './styles.css'
import './hero-section.css'
import './tool-grid.css'
import './animations.css'
import './dark-mode.css' // Add dark mode styles

type Values=Record<string,string>
const initialValues:Values={mode:'encode',spaces:'2',descending:'false',pattern:'\\d+',flags:'g',cron:'0 0 * * *',pages:'1',order:'1',angle:'90',quality:'82',width:'',height:'',cropX:'0',cropY:'0',cropWidth:'',cropHeight:'',format:'image/jpeg',amount:'1000',rate:'5',months:'12',years:'5',tax:'15',kg:'70',cm:'175',percent:'10',total:'100',birth:'2000-01-01',dateA:'2026-01-01',dateB:'2026-09-09',hours:'1',minutes:'30',from:'km',to:'miles',unitValue:'1',length:'24',count:'5',findText:'',replaceText:'',matchCase:'false',useRegexFR:'false',loremParagraphs:'3',fromBase:'10',toBase:'2',tsMode:'toDate',colorFg:'#111111',colorBg:'#ffffff',randMin:'1',randMax:'100',randCount:'5',targetDate:'2026-12-31',people:'2',watermarkText:'CONFIDENTIAL',watermarkOpacity:'30',maxLength:'100',shift:'3',oldValue:'100',newValue:'120',numListInput:'12, 18, 24',primeNumber:'17',factorialN:'10',romanMode:'toRoman',arWidth:'1920',arHeight:'1080'}
const fileExt=(mime:string)=>mime==='image/png'?'png':mime==='image/webp'?'webp':'jpg'
function downloadBlob(blob:Blob,name:string){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)}
function downloadBytes(bytes:Uint8Array,name:string,type:string){const copy=new Uint8Array(bytes);downloadBlob(new Blob([copy.buffer as ArrayBuffer],{type}),name)}

const DEFAULT_TOOL_ID='word-counter'
const resolveToolId=(slug:string)=>getTool(slug)?.id??DEFAULT_TOOL_ID

const categoryMeta:Record<string,{icon:IconName;description:string}>= {All:{icon:'grid',description:'Everything in one place'},Text:{icon:'text',description:'Write and clean text faster'},Developer:{icon:'developer',description:'Format, encode and inspect code'},PDF:{icon:'pdf',description:'Work with documents locally'},Image:{icon:'image',description:'Resize and convert images'},Calculators:{icon:'calculator',description:'Fast everyday calculations'},Security:{icon:'security',description:'Encoding and security helpers'},Finance:{icon:'finance',description:'Money, tax and returns'},Health:{icon:'health',description:'Fitness and wellness'},Design:{icon:'design',description:'Color, CSS and visuals'},Productivity:{icon:'productivity',description:'Everyday helpers'},Converters:{icon:'converters',description:'Units and number conversions'}}

const toolIconMap:Record<string,IconName>={
 'word-counter':'word-count','case-converter':'case-convert','slug-generator':'slug','lorem-ipsum-generator':'lorem','find-replace':'find-replace','word-frequency-counter':'word-frequency','html-tag-remover':'html-tag','duplicate-lines':'duplicate-lines','text-sorter':'sort','text-reverser':'reverse','line-break-remover':'line-break','extra-spaces':'extra-spaces','text-diff':'diff','character-counter':'character-count','sentence-counter':'sentence-count',
 'json-formatter':'json','json-validator':'json','json-minifier':'json','csv-to-json':'json','json-csv':'json','json-yaml':'json','base64':'base64','url-encoder':'url','jwt-decoder':'jwt','regex-tester':'regex','sql-formatter':'sql','html-formatter':'html','css-formatter':'css','javascript-formatter':'javascript','xml-formatter':'xml','markdown-previewer':'markdown','cron-generator':'cron','uuid-generator':'uuid','number-base-converter':'number-base','timestamp-converter':'timestamp','color-converter':'color','text-to-binary':'binary','color-contrast-checker':'contrast',
 'merge-pdf':'merge-pdf','split-pdf':'split-pdf','compress-pdf':'compress-pdf','rotate-pdf':'rotate-pdf','pdf-to-jpg':'pdf-to-jpg','jpg-to-pdf':'jpg-to-pdf','extract-pdf-pages':'extract-pdf','delete-pdf-pages':'delete-pdf','reorder-pdf-pages':'reorder-pdf','watermark-pdf':'watermark-pdf',
 'image-compressor':'image-compress','image-resizer':'image-resize','image-cropper':'image-crop','image-converter':'image-convert','jpg-to-png':'jpg-to-png','png-to-jpg':'png-to-jpg','webp-to-jpg':'webp-to-jpg','jpg-to-webp':'jpg-to-webp','png-to-webp':'png-to-webp','image-metadata':'image-metadata',
 'percentage-calculator':'percentage','discount-calculator':'discount','age-calculator':'age','date-calculator':'date','time-calculator':'time','bmi-calculator':'bmi','loan-calculator':'loan','emi-calculator':'emi','compound-interest':'compound-interest','tax-calculator':'tax','unit-converter':'unit-converter','simple-interest-calculator':'simple-interest','tip-calculator':'tip','countdown-calculator':'countdown',
 'password-generator':'password','sha-256':'sha-256','sha-512':'sha-512','md5':'md5','html-encoder':'html-encode','html-decoder':'html-decode','random-number-generator':'random-number'
};
const getToolIcon=(id:string,category:string):IconName=>toolIconMap[id]??categoryMeta[category]?.icon??'grid';

function App(){
 const path = window.location.pathname
const slug=path.startsWith('/tools/')?path.slice(7).replace(/\/$/,''):DEFAULT_TOOL_ID
 const [active,setActive]=useState(resolveToolId(slug)),[category,setCategory]=useState('All'),[query,setQuery]=useState(()=>new URLSearchParams(window.location.search).get('q')||''),[input,setInput]=useState(''),[right,setRight]=useState(''),[output,setOutput]=useState(''),[error,setError]=useState(''),[values,setValues]=useState<Values>(initialValues),[files,setFiles]=useState<File[]>([])

 // Hero section content
 const heroContent = {
   title: 'One focused toolkit.',
   subtitle: '206+ tools for everyday work.',
   description: 'ToolsKit brings practical tools for text, developers, PDFs, images, calculations and security into one fast, focused workspace.',
   primaryButton: {
     text: 'Explore tools',
     icon: 'arrow',
     link: '#tools'
   },
   secondaryButton: {
     text: 'Contact us',
     icon: 'mail',
     link: 'mailto:rumitech.solutions00@gmail.com'
   },
   stats: [
     { value: tools.length, label: 'focused utilities' },
     { value: 11, label: 'smart categories' },
     { value: '100%', label: 'client-side core tools' }
   ]
 }

 // Popular tools
 const popularTools = tools.filter(t => ['word-counter', 'json-formatter', 'image-compressor', 'percentage-calculator', 'password-generator', 'merge-pdf', 'uuid-generator', 'base64'].includes(t.id))

 const home = window.location.pathname === '/'
 const tool=getTool(active)!
 useEffect(()=>{const onPop=()=>{setActive(resolveToolId(window.location.pathname.slice(7).replace(/\/$/,'')));setQuery(new URLSearchParams(window.location.search).get('q')||'')};window.addEventListener('popstate',onPop);return()=>window.removeEventListener('popstate',onPop)},[])
 const visible=useMemo(()=>tools.filter(t=>(category==='All'||t.category===category)&&`${t.name} ${t.description} ${t.keywords.join(' ')}`.toLowerCase().includes(query.toLowerCase().trim())),[category,query])
 const setV=(k:string,v:string)=>setValues(x=>({...x,[k]:v}))
 const select=(id:string)=>{setActive(resolveToolId(id));setOutput('');setError('');window.history.pushState({},'',`/tools/${id}`);window.scrollTo({top:0,behavior:'smooth'})}
 const calculator=['percentage-calculator','discount-calculator','age-calculator','date-calculator','time-calculator','bmi-calculator','loan-calculator','emi-calculator','compound-interest','tax-calculator','unit-converter','simple-interest-calculator','tip-calculator','countdown-calculator','percentage-change-calculator','gcd-lcm-calculator','prime-checker','factorial-calculator','aspect-ratio-calculator'].includes(active)
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
 case'pdf-page-counter':if(!files[0])throw new Error('Select a PDF file.');out=`Page count: ${await getPdfPageCount(files[0])}`;break
 case'palindrome-checker':out=isPalindrome(input)?'✓ This is a palindrome.':'✗ This is not a palindrome.';break
 case'remove-punctuation':out=removePunctuation(input);break
 case'remove-numbers':out=removeNumbers(input);break
 case'vowel-consonant-counter':{const r=vowelConsonantCount(input);out=`Vowels: ${r.vowels}\nConsonants: ${r.consonants}\nTotal letters: ${r.letters}`;break}
 case'shuffle-lines':out=shuffleLines(input);break
 case'text-truncator':out=truncateText(input,Number(values.maxLength)||100);break
 case'base32':out=values.mode==='decode'?decodeBase32(input):encodeBase32(input);break
 case'hex-text-converter':out=values.mode==='decode'?hexToTextValue(input):textToHex(input);break
 case'css-minifier':out=minifyCss(input);break
 case'html-minifier':out=minifyHtml(input);break
 case'query-string-parser':out=parseQueryString(input);break
 case'markdown-table-generator':out=csvToMarkdownTable(input);break
 case'rot13-cipher':out=rot13(input);break
 case'caesar-cipher':out=values.mode==='decode'?caesarCipher(input,-Number(values.shift)||0):caesarCipher(input,Number(values.shift)||0);break
 case'password-strength-checker':out=passwordStrength(input);break
 case'morse-code-translator':out=values.mode==='decode'?morseToText(input):textToMorse(input);break
 case'nato-alphabet-converter':out=toNato(input);break
 case'sha-1':out=await sha1(input);break
 case'percentage-change-calculator':{const v=percentageChange(Number(values.oldValue),Number(values.newValue));out=`${v>=0?'Increase':'Decrease'} of ${Math.abs(v).toFixed(2)}%`;break}
 case'gcd-lcm-calculator':{const nums=values.numListInput.split(/[,\s]+/).map(Number).filter(n=>!isNaN(n));const r=gcdLcm(nums);out=`GCD: ${r.gcd}\nLCM: ${r.lcm}`;break}
 case'prime-checker':out=isPrime(Number(values.primeNumber))?`${values.primeNumber} is a prime number.`:`${values.primeNumber} is not a prime number.`;break
 case'factorial-calculator':out=`${values.factorialN}! = ${factorial(Number(values.factorialN))}`;break
 case'roman-numeral-converter':out=values.romanMode==='toDecimal'?String(fromRoman(input)):toRoman(Number(input));break
 case'statistics-calculator':out=textStatistics(input);break
 case'aspect-ratio-calculator':out=aspectRatio(Number(values.arWidth),Number(values.arHeight));break
 default:throw new Error('This tool is not implemented yet.')}
 setOutput(out)}catch(e){setError(e instanceof Error?e.message:'Could not process this input.')}}
 const clear=()=>{setInput('');setRight('');setOutput('');setError('');setFiles([])}
 const menuTools=category==='All'?tools:tools.filter(t=>t.category===category)
  useEffect(()=>{const els=document.querySelectorAll('.n-reveal');if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});els.forEach(e=>io.observe(e));return()=>io.disconnect()},[])
  useEffect(()=>{if(window.location.pathname.startsWith('/tools/'))trackRecent(active)},[active])
 return <div className="app ui-premium">

  <main>

   <section className="hero" id="about"><div className="hero-glow glow-one"/><div className="hero-glow glow-two"/><div className="hero-inner"><div className="hero-layout"><div className="hero-copy"><div className="hero-kicker"><span><Icon name="sparkles" size={13}/> Tools that work for you</span></div><h1>Small tasks.<br/><em>Handled beautifully.</em></h1><p>ToolsKit brings practical tools for text, development, PDFs, images, calculations and security into one fast, focused workspace.</p><div className="hero-actions"><a className="hero-cta" href="#tools">Explore tools <Icon name="arrow" size={17}/></a><a className="hero-secondary" href="mailto:rumitech.solutions00@gmail.com"><Icon name="mail" size={16}/> Contact</a></div><div className="hero-proof"><span><b>{tools.length}+</b> focused utilities</span><span className="dot"/><span><b>11</b> smart categories</span><span className="dot"/><span><b>Local</b> browser processing</span></div></div><div className="hero-preview" aria-label="ToolsKit product preview"><div className="hero-preview-head"><span><span className="preview-status"/><b>ToolsKit workspace</b></span><small>Ready</small></div><div className="hero-preview-search"><Icon name="search" size={15}/><span>Search a tool...</span></div><div className="hero-preview-list"><a href="/tools/json-formatter"><span className="preview-icon" data-cat="Developer"><Icon name="json" size={15}/></span><span><b>JSON Formatter</b><small>Format and validate JSON</small></span><Icon name="arrow" size={13}/></a><a href="/tools/image-compressor"><span className="preview-icon" data-cat="Image"><Icon name="image-compress" size={15}/></span><span><b>Image Compressor</b><small>Reduce image size locally</small></span><Icon name="arrow" size={13}/></a><a href="/tools/merge-pdf"><span className="preview-icon" data-cat="PDF"><Icon name="merge-pdf" size={15}/></span><span><b>Merge PDF</b><small>Combine documents in browser</small></span><Icon name="arrow" size={13}/></a></div><div className="hero-preview-footer"><span><span className="preview-lock"><Icon name="security" size={13}/></span> Core tools run locally</span><span>{tools.length} tools</span></div></div></div></div></section>
   <section className="quick-section" id="tools"><div className="section-shell"><div className="section-heading"><div><span className="section-kicker">Browse the toolkit</span><h2>Everything organized. Nothing overwhelming.</h2><p>Pick a category to open its focused tool menu, then jump straight into the workspace.</p></div><div className="section-note"><Icon name="sparkles" size={16}/> Built for everyday speed</div></div>
    <div className="category-row">{categories.map(c=>{const meta=categoryMeta[c];return <button className={category===c?'category-tile active':'category-tile'} key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}><span className="category-icon" data-cat={c}><Icon name={meta.icon} size={18}/></span><span><b>{c}</b><small>{c==='All'?tools.length:tools.filter(t=>t.category===c).length} tools</small></span><Icon name="arrow" size={15}/></button>})}</div>
    <div className="tool-menu-panel"><div className="menu-panel-head"><div><span className="section-kicker">{category==='All'?'All tools':category}</span><h3>{category==='All'?'Explore the full collection':categoryMeta[category]?.description}</h3></div><span className="menu-count">{menuTools.length} tools</span></div><div className="menu-grid">{visible.map(t=><button className={active===t.id?'menu-tool active':'menu-tool'} key={t.id} aria-current={active===t.id} onClick={()=>select(t.id)}><span className="menu-tool-icon" data-cat={t.category}><Icon name={getToolIcon(t.id,t.category)} size={16}/></span><span><b>{t.name}</b><small>{t.description}</small></span><Icon name="arrow" size={14}/></button>)}</div>{!visible.length&&<div className="empty-state"><Icon name="search" size={18}/><strong>No tools found</strong><span>Try a different search term.</span></div>}</div>
   </div></section>
   <QuickAccess/>
   <section className="popular-section" id="popular"><div className="section-shell"><div className="section-heading compact"><div><span className="section-kicker">Popular right now</span><h2>Start with a favorite.</h2></div><span className="micro-note">Quick access to common tasks</span></div><div className="popular-grid">{popularTools.map(t=><button key={t.id} className="popular-card" onClick={()=>select(t.id)}><span className="popular-icon" data-cat={t.category}><Icon name={getToolIcon(t.id,t.category)} size={17}/></span><span><b>{t.name}</b><small>{t.category}</small></span><Icon name="arrow" size={15}/></button>)}</div></div></section>
   <section className="workspace-section"><div className="section-shell"><article className="tool-panel"><div className="panel-head"><div><span className="section-kicker">{tool.category}</span><h2>{tool.name}</h2><p>{tool.description}</p></div><div className="panel-actions"><FavButton id={tool.id}/><span className="local-pill"><span/> Local</span></div></div>{isExtraTool(active)?<ExtraToolPanel key={active} id={active}/>:active==='text-diff'?<div className="diff-grid"><textarea aria-label="Original text" value={input} onChange={e=>setInput(e.target.value)} placeholder="Original text"/><textarea aria-label="Changed text" value={right} onChange={e=>setRight(e.target.value)} placeholder="Changed text"/><div className="diff-result">{diffLines(input,right).map(r=><div className={r.same?'same':'changed'} key={r.line}><b>{r.line}</b><span>{r.left}</span><span>{r.right}</span></div>)}</div></div>:<><ToolControls active={active} values={values} setV={setV} setFiles={setFiles}/>{textInput&&<textarea className="editor" aria-label={`${tool.name} input`} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();run()}}} spellCheck={false} placeholder="Enter or paste your content here…"/>}<div className="actions"><button className="primary" onClick={run}>{tool.file?'Process files':active.includes('generator')||active.includes('hash')?'Generate':'Run tool'} <Icon name="arrow" size={16}/></button><button className="secondary" onClick={clear}>Clear</button>{textInput&&<span className="run-hint"><kbd>Ctrl</kbd>+<kbd>Enter</kbd> to run</span>}</div>{error&&<div className="error" role="alert">{error}</div>}{!output&&!error&&<div className="result-empty" aria-hidden="true"><Icon name="sparkles" size={22}/><strong>Your result appears here</strong><span>Add your input, then press run.</span></div>}{output&&<div className="result" aria-live="polite"><div className="result-head"><span>Result</span><button onClick={e=>{navigator.clipboard?.writeText(output);const b=e.currentTarget;b.textContent='Copied ✓';toast('Copied to clipboard');setTimeout(()=>{b.textContent='Copy'},1400)}}>Copy</button></div>{active==='markdown-previewer'?<div className="markdown" dangerouslySetInnerHTML={{__html:`<p>${output}</p>`}}/>:<pre>{output}</pre>}</div>}</>}</article><WorkflowLinks toolId={active} onSelect={select}/></div></section>
   <div className="n-band n-reveal"><div><b>{tools.length}+</b><span>Free tools</span></div><div><b>0</b><span>Sign-ups needed</span></div><div><b>100%</b><span>Browser-based files</span></div><div><b>&lt;1s</b><span>To get started</span></div></div>
   <section className="n-why n-reveal"><header><span className="section-kicker"><Icon name="sparkles" size={13}/> Why ToolsKit</span><h2>Built to feel instant. Designed to feel effortless.</h2><p>No clutter, no accounts, no waiting. Just a clean workspace for the small jobs that fill your day.</p></header><div className="n-grid"><div className="n-card wide"><i><Icon name="security" size={22}/></i><h3>Private by design</h3><p>Supported PDF and image tools process files locally in your browser, so your documents stay on your device.</p></div><div className="n-card wide"><i><Icon name="sparkles" size={22}/></i><h3>Lightning fast</h3><p>Lean code, smart chunking and zero sign-up friction mean you go from idea to result in seconds.</p></div><div className="n-card"><i><Icon name="search" size={22}/></i><h3>Find anything</h3><p>Search by name or keyword and jump straight into the right tool.</p></div><div className="n-card"><i><Icon name="grid" size={22}/></i><h3>Works everywhere</h3><p>Polished on phones, tablets and desktops, with light and dark themes.</p></div><div className="n-card"><i><Icon name="heart" size={22}/></i><h3>Free forever</h3><p>Every tool is free to use, with no limits on everyday tasks.</p></div></div></section>
   <section className="n-compare n-reveal"><header><span className="section-kicker"><Icon name="sparkles" size={13}/> ToolsKit vs. AI chat</span><h2>Why not just ask an AI chatbot?</h2><p>AI chat is great for open-ended questions. For everyday file and text jobs, a purpose-built tool is faster, more private and gets the exact same result every time.</p></header>
    <div className="compare-table" role="table">
     <div className="compare-row compare-head" role="row"><span role="columnheader">&nbsp;</span><span role="columnheader" className="compare-col-us"><Icon name="sparkles" size={14}/> ToolsKit</span><span role="columnheader">AI chatbot</span></div>
     <div className="compare-row" role="row"><span role="rowheader">Your files</span><span className="yes">Stay on your device for local tools</span><span className="no">Usually uploaded to a server first</span></div>
     <div className="compare-row" role="row"><span role="rowheader">Speed</span><span className="yes">Instant — no prompt, no generation wait</span><span className="no">Type a prompt, then wait for a reply</span></div>
     <div className="compare-row" role="row"><span role="rowheader">Accuracy</span><span className="yes">Same exact, deterministic result every time</span><span className="no">Can vary or misread edge cases</span></div>
     <div className="compare-row" role="row"><span role="rowheader">File handling</span><span className="yes">Real PDF/image processing, any size tools allow</span><span className="no">Often limited by upload size or plan</span></div>
     <div className="compare-row" role="row"><span role="rowheader">Account</span><span className="yes">None needed, ever</span><span className="no">Sign-up usually required</span></div>
     <div className="compare-row" role="row"><span role="rowheader">Cost</span><span className="yes">Free, no usage limits</span><span className="no">Free tiers cap usage or quality</span></div>
    </div>
   </section>
   <div className="n-steps n-reveal"><div><h3>Pick a tool</h3><p>Browse categories or search from {tools.length}+ utilities for text, code, PDFs, images and more.</p></div><div><h3>Drop in your input</h3><p>Paste text, set a few options or choose a file. Everything is clearly labelled.</p></div><div><h3>Copy or download</h3><p>Get your result instantly, then copy it or save the file. Done.</p></div></div>
   <section className="n-faq n-reveal"><header><span className="section-kicker"><Icon name="search" size={13}/> Good to know</span><h2>Quick answers</h2></header><div className="n-faq-list">
    <details><summary>Are all the tools really free?</summary><p>Yes. Every tool on ToolsKit is free to use, with no account, trial or hidden limits for everyday tasks.</p></details>
    <details><summary>Are my files uploaded anywhere?</summary><p>Supported PDF, image and text tools run directly in your browser, so your content stays on your device while you work.</p></details>
    <details><summary>Can I use ToolsKit on my phone?</summary><p>Absolutely. The layout adapts to phones and tablets, and there is a light and a dark theme.</p></details>
    <details><summary>What shortcuts are available?</summary><p>Press <kbd>Ctrl</kbd> + <kbd>K</kbd> (or <kbd>/</kbd>) to search every tool instantly, and <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run the tool you are using.</p></details>
    <details><summary>Can I save my favourite tools?</summary><p>Open any tool and press Save. Your favourites and recently used tools appear at the top of the home page.</p></details>
   </div></section>
   <section className="n-cta n-reveal"><h2>Ready to get things done faster?</h2><p>Jump into the full toolkit and handle your next task in seconds.</p><a href="#tools">Explore all tools <Icon name="arrow" size={17}/></a></section>
  </main>
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
 if(['base64','url-encoder','text-to-binary','base32','hex-text-converter','morse-code-translator'].includes(active))return <div className="chips">{['encode','decode'].map(x=><button className={values.mode===x?'chip active':'chip'} key={x} onClick={()=>setV('mode',x)}>{x}</button>)}</div>
 if(active==='caesar-cipher')return <div className="controls"><label>Shift<input type="number" min="1" max="25" value={values.shift} onChange={e=>setV('shift',e.target.value)}/></label><label>Mode<select value={values.mode} onChange={e=>setV('mode',e.target.value)}><option value="encode">Encode</option><option value="decode">Decode</option></select></label></div>
 if(active==='text-truncator')return <div className="controls"><label>Max length<input type="number" min="1" max="5000" value={values.maxLength} onChange={e=>setV('maxLength',e.target.value)}/></label></div>
 if(active==='percentage-change-calculator')return <div className="controls"><label>Old value<input type="number" value={values.oldValue} onChange={e=>setV('oldValue',e.target.value)}/></label><label>New value<input type="number" value={values.newValue} onChange={e=>setV('newValue',e.target.value)}/></label></div>
 if(active==='gcd-lcm-calculator')return <div className="controls"><label>Numbers (comma separated)<input value={values.numListInput} onChange={e=>setV('numListInput',e.target.value)}/></label></div>
 if(active==='prime-checker')return <div className="controls"><label>Number<input type="number" value={values.primeNumber} onChange={e=>setV('primeNumber',e.target.value)}/></label></div>
 if(active==='factorial-calculator')return <div className="controls"><label>Number<input type="number" min="0" max="5000" value={values.factorialN} onChange={e=>setV('factorialN',e.target.value)}/></label></div>
 if(active==='roman-numeral-converter')return <div className="chips">{[['toRoman','Number → Roman'],['toDecimal','Roman → Number']].map(([v,l])=><button className={values.romanMode===v?'chip active':'chip'} key={v} onClick={()=>setV('romanMode',v)}>{l}</button>)}</div>
 if(active==='aspect-ratio-calculator')return <div className="controls"><label>Width<input type="number" value={values.arWidth} onChange={e=>setV('arWidth',e.target.value)}/></label><label>Height<input type="number" value={values.arHeight} onChange={e=>setV('arHeight',e.target.value)}/></label></div>
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
