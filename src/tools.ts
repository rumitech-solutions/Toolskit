export type CaseMode = 'upper'|'lower'|'title'|'sentence'|'camel'|'pascal'|'kebab'|'snake'

export const wordCount=(text:string)=>text.trim()?text.trim().split(/\s+/u).length:0
export const characterCount=(text:string)=>text.length
export const characterCountNoSpaces=(text:string)=>text.replace(/\s/gu,'').length
export const lineCount=(text:string)=>text?text.split(/\r?\n/u).length:0
export const sentenceCount=(text:string)=>text.trim().match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/gu)?.filter(Boolean).length??0
export const readingTime=(text:string)=>Math.max(0,Math.ceil(wordCount(text)/200))
const words=(text:string)=>text.trim().split(/[^\p{L}\p{N}]+/u).filter(Boolean)
export function convertCase(text:string,mode:CaseMode){const ws=words(text);switch(mode){case'upper':return text.toUpperCase();case'lower':return text.toLowerCase();case'title':return text.toLowerCase().replace(/(^|\s)\p{L}/gu,m=>m.toUpperCase());case'sentence':return text.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu,m=>m.toUpperCase());case'camel':return ws.map((w,i)=>i?w[0].toUpperCase()+w.slice(1).toLowerCase():w.toLowerCase()).join('');case'pascal':return ws.map(w=>w[0].toUpperCase()+w.slice(1).toLowerCase()).join('');case'kebab':return ws.map(w=>w.toLowerCase()).join('-');case'snake':return ws.map(w=>w.toLowerCase()).join('_')}}
export const removeDuplicateLines=(text:string)=>{const s=new Set<string>();return text.split(/\r?\n/u).filter(x=>s.has(x)?false:(s.add(x),true)).join('\n')}
export const removeExtraSpaces=(text:string)=>text.replace(/[ \t]+/gu,' ').replace(/^ | $/gmu,'')
export const removeLineBreaks=(text:string)=>text.replace(/\s*\r?\n\s*/gu,' ').trim()
export const reverseText=(text:string)=>Array.from(text).reverse().join('')
export const sortLines=(text:string,descending=false)=>text.split(/\r?\n/u).sort((a,b)=>descending?b.localeCompare(a):a.localeCompare(b)).join('\n')
export function diffLines(left:string,right:string){const a=left.split(/\r?\n/u),b=right.split(/\r?\n/u),max=Math.max(a.length,b.length);return Array.from({length:max},(_,i)=>({line:i+1,left:a[i]??'',right:b[i]??'',same:(a[i]??'')===(b[i]??'')}))}
export const formatJson=(input:string,spaces=2)=>JSON.stringify(JSON.parse(input),null,spaces)
export const isValidJson=(input:string)=>{try{JSON.parse(input);return true}catch{return false}}
export const minifyJson=(input:string)=>JSON.stringify(JSON.parse(input))
const bytesToBase64=(bytes:Uint8Array)=>{let s='';bytes.forEach(b=>s+=String.fromCharCode(b));return btoa(s)}
const base64ToBytes=(value:string)=>{const s=atob(value);return Uint8Array.from(s,c=>c.charCodeAt(0))}
export const encodeBase64=(input:string)=>bytesToBase64(new TextEncoder().encode(input))
export const decodeBase64=(input:string)=>new TextDecoder().decode(base64ToBytes(input))
export const encodeUrl=(input:string)=>encodeURIComponent(input)
export const decodeUrl=(input:string)=>decodeURIComponent(input)
export const encodeHtml=(input:string)=>input.replace(/[&<>"']/gu,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]??c))
export const decodeHtml=(input:string)=>{const t=document.createElement('textarea');t.innerHTML=input;return t.value}
export const generateUuid=()=>crypto.randomUUID()
export function secureRandomIndex(value:number,alphabetLength:number){const limit=Math.floor(2**32/alphabetLength)*alphabetLength;return value<limit?value%alphabetLength:null}
export const generatePassword=(length=20)=>{const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';const target=Math.max(0,Math.floor(length));let out='';while(out.length<target){const values=crypto.getRandomValues(new Uint32Array(Math.max(8,target-out.length)));for(const value of values){const index=secureRandomIndex(value,chars.length);if(index!==null)out+=chars[index];if(out.length===target)break}}return out}
export function jsonToCsv(input:string){const data=JSON.parse(input);if(!Array.isArray(data))throw new Error('JSON must contain an array of objects.');if(!data.length)return '';const keys=Array.from(new Set(data.flatMap(v=>Object.keys(v??{}))));const esc=(v:unknown)=>`"${String(v??'').replace(/"/gu,'""')}"`;return [keys.map(esc).join(','),...data.map(row=>keys.map(k=>esc(row?.[k])).join(','))].join('\n')}
export function jsonToYaml(input:string){const value=JSON.parse(input);const q=(v:unknown)=>typeof v==='string'?JSON.stringify(v):v===null?'null':typeof v==='boolean'||typeof v==='number'?String(v):JSON.stringify(v);const walk=(v:unknown,indent=0):string=>{const pad=' '.repeat(indent);if(Array.isArray(v))return v.length?v.map(x=>typeof x==='object'&&x!==null?`${pad}-\n${walk(x,indent+2)}`:`${pad}- ${q(x)}`).join('\n'):`${pad}[]`;if(v&&typeof v==='object')return Object.entries(v as Record<string,unknown>).map(([k,x])=>typeof x==='object'&&x!==null?`${pad}${k}:\n${walk(x,indent+2)}`:`${pad}${k}: ${q(x)}`).join('\n');return `${pad}${q(v)}`};return walk(value)+'\n'}
export function decodeJwt(input:string){const parts=input.trim().split('.');if(parts.length!==3)throw new Error('A JWT must contain three dot-separated segments.');const payload=decodeBase64(parts[1].replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(parts[1].length/4)*4,'='));return JSON.stringify(JSON.parse(payload),null,2)}
export function regexTest(pattern:string,flags:string,text:string){const re=new RegExp(pattern,flags);if(re.global||re.sticky)return Array.from(text.matchAll(re)).map(m=>({match:m[0],index:m.index??-1,groups:Array.from(m).slice(1)}));const match=re.exec(text);return match?[{match:match[0],index:match.index,groups:Array.from(match).slice(1)}]:[]}
export const formatSql=(input:string)=>input.replace(/\s+/gu,' ').replace(/\s*,\s*/gu,',\n  ').replace(/\b(FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|VALUES|SET|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN|UNION)\b/giu,'\n$1').replace(/\b(SELECT|UPDATE|INSERT INTO|DELETE FROM)\b/giu,'$1').trim()
export const formatHtml=(input:string)=>input.replace(/>\s*</gu,'><').replace(/></gu,'>\n<').trim()
export const formatXml=formatHtml
export const formatCss=(input:string)=>input.replace(/\s*\{\s*/gu,' {\n  ').replace(/;\s*/gu,';\n  ').replace(/\s*\}/gu,'\n}\n').trim()
export const formatJs=(input:string)=>input.replace(/;\s*/gu,';\n').replace(/\{\s*/gu,' {\n  ').replace(/\s*\}/gu,'\n}').trim()
export const markdownPreview=(input:string)=>input.replace(/&/gu,'&amp;').replace(/</gu,'&lt;').replace(/>/gu,'&gt;').replace(/^### (.*)$/gmu,'<h3>$1</h3>').replace(/^## (.*)$/gmu,'<h2>$1</h2>').replace(/^# (.*)$/gmu,'<h1>$1</h1>').replace(/\*\*(.*?)\*\*/gu,'<strong>$1</strong>').replace(/`([^`]+)`/gu,'<code>$1</code>').replace(/\n\n/gu,'</p><p>')
export const cronPresets=['*/5 * * * *','0 * * * *','0 0 * * *','0 0 * * 1','0 0 1 * *']
export const percentage=(value:number,total:number)=>total?value/total*100:0
export const discount=(price:number,percent:number)=>price-price*percent/100
export const bmi=(kg:number,cm:number)=>cm?kg/((cm/100)**2):0
export const emi=(principal:number,annualRate:number,months:number)=>{if(!months)return 0;const r=annualRate/100/12;return r?principal*r*(1+r)**months/((1+r)**months-1):principal/months}
export const compoundInterest=(principal:number,rate:number,years:number,n=12)=>principal*(1+rate/100/n)**(n*years)
export const tax=(amount:number,rate:number)=>amount*rate/100
export const ageFromDate=(birth:string,now=new Date())=>{const d=new Date(birth);let age=now.getFullYear()-d.getFullYear();const m=now.getMonth()-d.getMonth();if(m<0||(m===0&&now.getDate()<d.getDate()))age--;return age}
export const dateDifference=(a:string,b:string)=>Math.abs(new Date(b).getTime()-new Date(a).getTime())/86400000
export const timeToMinutes=(h:number,m:number)=>h*60+m
export const minutesToTime=(total:number)=>`${Math.floor(total/60)%24}`.padStart(2,'0')+':'+String(total%60).padStart(2,'0')
export const unitConversions={kmToMiles:(v:number)=>v*0.621371,milesToKm:(v:number)=>v/0.621371,kgToLb:(v:number)=>v*2.2046226218,lbToKg:(v:number)=>v/2.2046226218,cToF:(v:number)=>v*9/5+32,fToC:(v:number)=>(v-32)*5/9,litersToGallons:(v:number)=>v*0.2641720524,gallonsToLiters:(v:number)=>v/0.2641720524}
export async function sha256(input:string){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(input));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
export async function sha512(input:string){const b=await crypto.subtle.digest('SHA-512',new TextEncoder().encode(input));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
export function md5(input:string){const data=new TextEncoder().encode(input);let a=0x67452301,b=0xefcdab89,c=0x98badcfe,d=0x10325476;const r=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21],k=Array.from({length:64},(_,i)=>Math.floor(Math.abs(Math.sin(i+1))*2**32)>>>0);const len=data.length;const padded=new Uint8Array(((len+9+63)>>6)<<6);padded.set(data);padded[len]=128;const view=new DataView(padded.buffer);view.setUint32(padded.length-8,len*8,true);for(let off=0;off<padded.length;off+=64){const m=Array.from({length:16},(_,i)=>view.getUint32(off+i*4,true));let A=a,B=b,C=c,D=d;for(let i=0;i<64;i++){let f,g;if(i<16){f=(B&C)|(~B&D);g=i}else if(i<32){f=(D&B)|(~D&C);g=(5*i+1)%16}else if(i<48){f=B^C^D;g=(3*i+5)%16}else{f=C^(B|~D);g=(7*i)%16}const x=(A+f+k[i]+m[g])>>>0;A=D;D=C;C=B;B=(B+((x<<r[(i%4)+4*Math.floor(i/16)])|(x>>>(32-r[(i%4)+4*Math.floor(i/16)]))))>>>0}a=(a+A)>>>0;b=(b+B)>>>0;c=(c+C)>>>0;d=(d+D)>>>0}const out=new DataView(new ArrayBuffer(16));[a,b,c,d].forEach((v,i)=>out.setUint32(i*4,v,true));return [...new Uint8Array(out.buffer)].map(x=>x.toString(16).padStart(2,'0')).join('')}

export const slugify=(text:string)=>text.toString().trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-+|-+$/gu,'').replace(/-{2,}/gu,'-')
const loremWords='lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ')
export function loremIpsum(paragraphs=3){const rnd=(n:number)=>Math.floor(Math.random()*n);const sentence=()=>{const len=8+rnd(10);const w=Array.from({length:len},()=>loremWords[rnd(loremWords.length)]);w[0]=w[0][0].toUpperCase()+w[0].slice(1);return w.join(' ')+'.'};const paragraph=()=>Array.from({length:3+rnd(3)},sentence).join(' ');return Array.from({length:Math.max(1,paragraphs)},paragraph).join('\n\n')}
export function findReplace(text:string,find:string,replace:string,matchCase=false,useRegex=false){if(!find)return text;if(useRegex)return text.replace(new RegExp(find,matchCase?'g':'gi'),replace);if(matchCase)return text.split(find).join(replace);const re=new RegExp(find.replace(/[.*+?^${}()|[\]\\]/gu,'\\$&'),'gi');return text.replace(re,replace)}
export function wordFrequency(text:string){const map=new Map<string,number>();words(text).forEach(w=>{const k=w.toLowerCase();map.set(k,(map.get(k)??0)+1)});return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]).map(([w,c])=>`${w}: ${c}`).join('\n')}
export const stripHtmlTags=(html:string)=>html.replace(/<[^>]*>/gu,'')
export function csvToJson(csv:string){const rows=csv.trim().split(/\r?\n/u).map(line=>{const cells:string[]=[];let cur='',inQuotes=false;for(let i=0;i<line.length;i++){const ch=line[i];if(inQuotes){if(ch==='"'){if(line[i+1]==='"'){cur+='"';i++}else inQuotes=false}else cur+=ch}else if(ch==='"')inQuotes=true;else if(ch===','){cells.push(cur);cur=''}else cur+=ch}cells.push(cur);return cells});if(!rows.length)return '[]';const [header,...body]=rows;return JSON.stringify(body.map(r=>Object.fromEntries(header.map((h,i)=>[h,r[i]??'']))),null,2)}
export function convertNumberBase(value:string,fromBase:number,toBase:number){
 const allowedBases=[2,8,10,16]
 if(!allowedBases.includes(fromBase)||!allowedBases.includes(toBase))throw new Error('Choose a base of 2, 8, 10, or 16.')
 const text=value.trim()
 if(!text)throw new Error('Enter a number to convert.')
 const signless=text.replace(/^[+-]/u,'')
 const digits:Record<number,string>={2:'01',8:'01234567',10:'0123456789',16:'0123456789abcdefABCDEF'}
 if(!signless||!Array.from(signless).every(ch=>digits[fromBase].includes(ch)))throw new Error('Enter a valid number for the selected base.')
 const n=parseInt(text,fromBase)
 if(!Number.isSafeInteger(n))throw new Error('That number is outside the safe integer range.')
 return n.toString(toBase).toUpperCase()
}
export function convertTimestamp(value:string,mode:'toDate'|'toTimestamp'){if(mode==='toDate'){const n=Number(value.trim());if(Number.isNaN(n))throw new Error('Enter a valid Unix timestamp.');const ms=value.trim().length>10?n:n*1000;return new Date(ms).toISOString()}const d=new Date(value.trim());if(Number.isNaN(d.getTime()))throw new Error('Enter a valid date.');return String(Math.floor(d.getTime()/1000))}
export function hexToRgb(hex:string){const h=hex.replace('#','').trim();const full=h.length===3?h.split('').map(c=>c+c).join(''):h;if(!/^[0-9a-fA-F]{6}$/u.test(full))throw new Error('Enter a valid hex color, e.g. #3366ff.');const n=parseInt(full,16);return {r:(n>>16)&255,g:(n>>8)&255,b:n&255}}
export const rgbToHex=(r:number,g:number,b:number)=>'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('')
export function rgbToHsl(r:number,g:number,b:number){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b);let h=0,s=0;const l=(max+min)/2;if(max!==min){const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);if(max===r)h=(g-b)/d+(g<b?6:0);else if(max===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60}return {h:Math.round(h),s:Math.round(s*100),l:Math.round(l*100)}}
export function colorConvert(input:string){const rgbMatch=input.match(/rgba?\(([^)]+)\)/iu);let r:number,g:number,b:number;if(rgbMatch){[r,g,b]=rgbMatch[1].split(',').map(x=>Number(x.trim()))}else{({r,g,b}=hexToRgb(input))}const hex=rgbToHex(r,g,b);const hsl=rgbToHsl(r,g,b);return `HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
export const textToBinary=(text:string)=>Array.from(new TextEncoder().encode(text)).map(b=>b.toString(2).padStart(8,'0')).join(' ')
export function binaryToText(binary:string){const bytes=binary.trim().split(/\s+/u).filter(Boolean).map(b=>parseInt(b,2));if(bytes.some(x=>Number.isNaN(x)))throw new Error('Enter valid space-separated 8-bit binary values.');return new TextDecoder().decode(Uint8Array.from(bytes))}
function relativeLuminance(hex:string){const {r,g,b}=hexToRgb(hex);const chan=(v:number)=>{const c=v/255;return c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4};return 0.2126*chan(r)+0.7152*chan(g)+0.0722*chan(b)}
export function contrastRatio(fg:string,bg:string){const l1=relativeLuminance(fg),l2=relativeLuminance(bg);const [lighter,darker]=l1>l2?[l1,l2]:[l2,l1];const ratio=(lighter+0.05)/(darker+0.05);return Math.round(ratio*100)/100}
export const simpleInterest=(principal:number,rate:number,years:number)=>principal*rate*years/100
export function tipSplit(bill:number,tipPercent:number,people:number){const tip=bill*tipPercent/100;const total=bill+tip;const per=people>0?total/people:total;return {tip,total,per}}
export const daysUntil=(target:string,now=new Date())=>Math.ceil((new Date(target).getTime()-now.getTime())/86400000)
export function randomNumbers(min:number,max:number,count:number){
 if(!Number.isSafeInteger(min)||!Number.isSafeInteger(max)||!Number.isSafeInteger(count))throw new Error('Enter whole-number minimum, maximum, and count values.')
 const lo=Math.min(min,max),hi=Math.max(min,max),span=hi-lo+1
 if(span<1||span>2**32)throw new Error('Choose a range containing at most 4,294,967,296 integers.')
 const total=Math.min(1000,Math.max(1,count))
 const next=()=>{
  let index:number|null=null
  while(index===null){
   const value=crypto.getRandomValues(new Uint32Array(1))[0]
   index=secureRandomIndex(value,span)
  }
  return lo+index
 }
 return Array.from({length:total},next).join(', ')
}
export function randomNumbers(min:number,max:number,count:number){const lo=Math.min(min,max),hi=Math.max(min,max);return Array.from({length:Math.max(1,Math.min(1000,count))},()=>Math.floor(Math.random()*(hi-lo+1))+lo).join(', ')}
