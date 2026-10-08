export type IconName =
  'grid'|'search'|'sparkles'|'arrow'|'mail'|'info'|'heart'|'chevron'|'chat'|'send'|'close'|'menu'|'x'|'menu-open'|'menu-close'|'sun'|'moon'|
  'facebook'|'instagram'|'youtube'|'linkedin'|'github'|'x-twitter'|
  'text'|'developer'|'pdf'|'image'|'calculator'|'security'|'finance'|'health'|'design'|'productivity'|
  'word-count'|'case-convert'|'slug'|'lorem'|'find-replace'|'word-frequency'|'html-tag'|'duplicate-lines'|'sort'|'reverse'|'line-break'|'extra-spaces'|'diff'|'character-count'|'sentence-count'|
  'json'|'base64'|'url'|'jwt'|'regex'|'sql'|'html'|'css'|'javascript'|'xml'|'markdown'|'cron'|'uuid'|'number-base'|'timestamp'|'color'|'binary'|'contrast'|
  'merge-pdf'|'split-pdf'|'compress-pdf'|'rotate-pdf'|'pdf-to-jpg'|'jpg-to-pdf'|'extract-pdf'|'delete-pdf'|'reorder-pdf'|'watermark-pdf'|
  'image-compress'|'image-resize'|'image-crop'|'image-convert'|'jpg-to-png'|'png-to-jpg'|'webp-to-jpg'|'jpg-to-webp'|'png-to-webp'|'image-metadata'|
  'percentage'|'discount'|'age'|'date'|'time'|'bmi'|'loan'|'emi'|'compound-interest'|'tax'|'unit-converter'|'simple-interest'|'tip'|'countdown'|
  'password'|'sha-256'|'sha-512'|'md5'|'html-encode'|'html-decode'|'random-number'

export function Icon({name,size=18}:{name:IconName;size?:number}){
  const p={width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.9,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,'aria-hidden':true}
  switch(name){
    case'grid':return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>
    case'search':return <svg {...p}><circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>
    case'sparkles':return <svg {...p}><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></svg>
    case'arrow':return <svg {...p}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
    case'info':return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.8h.01"/></svg>
    case'mail':return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>
    case'heart':return <svg {...p}><path d="M20.8 8.7c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.7 4.7 0 0 1 12 6.3a4.7 4.7 0 0 1 8.8 2.4Z"/></svg>
    case'chevron':return <svg {...p}><path d="m7 10 5 5 5-5"/></svg>
    case'chat':return <svg {...p}><path d="M4 5h16v11H9l-5 4v-4H4Z"/><path d="M8 9h8M8 12.5h5"/></svg>
    case'send':return <svg {...p}><path d="m21 3-18 7.5 7 2.5 2 7L21 3Z"/><path d="m10 13 11-10"/></svg>
    case'close':case'x':case'x-twitter':case'menu-close':return <svg {...p}><path d="M6 6 18 18"/><path d="M18 6 6 18"/></svg>
    case'menu':case'menu-open':return <svg {...p}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
    case'sun':return <svg {...p}><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
    case'moon':return <svg {...p}><path d="M20.5 14.2A8.4 8.4 0 0 1 9.8 3.5 8.4 8.4 0 1 0 20.5 14.2Z"/></svg>
    case'facebook':return <svg {...p}><path d="M14 8h2V4.5a14.4 14.4 0 0 0-3-.3c-3 0-5 1.8-5 5.1V12H5v4h3v8h4v-8h3.3l.7-4H12V9.7c0-1.2.5-1.7 2-1.7Z"/></svg>
    case'instagram':return <svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>
    case'youtube':return <svg {...p}><path d="m10 15 5-3-5-3v6Z"/><path d="M21 12c0 4.2-.5 6-1.1 6.7C19.3 19.4 17.8 20 12 20s-7.3-.6-7.9-1.3C3.5 18 3 16.2 3 12s.5-6 1.1-6.7C4.7 4.6 6.2 4 12 4s7.3.6 7.9 1.3C20.5 6 21 7.8 21 12Z"/></svg>
    case'linkedin':return <svg {...p}><path d="M6 9v9"/><path d="M6 6.2v.1"/><path d="M10 18v-5a4 4 0 0 1 8 0v5"/><path d="M10 9v9"/></svg>
    case'github':return <svg {...p}><path d="M9 19c-4.3 1.4-4.3-2.2-6-2.7"/><path d="M15 19v-2.3c0-.7.1-1.4.5-1.9 3.3-.4 4.8-1.6 4.8-4.9a4.8 4.8 0 0 0-1.2-3.3A4.6 4.6 0 0 0 19 3.3s-1.1-.4-3.6 1.3a12.4 12.4 0 0 0-6.8 0C6.1 2.9 5 3.3 5 3.3a4.6 4.6 0 0 0-.1 3.3 4.8 4.8 0 0 0-1.2 3.3c0 3.3 1.5 4.5 4.8 4.9.3.4.5 1 .5 1.9V19"/></svg>

    case'text':case'word-count':case'character-count':case'sentence-count':return <svg {...p}><path d="M5 6h14M5 10h10M5 14h14M5 18h8"/><path d="M18 10v8"/></svg>
    case'developer':case'json':case'html-tag':case'html':case'xml':return <svg {...p}><path d="m9 6-6 6 6 6M15 6l6 6-6 6"/><path d="m13 4-2 16"/></svg>
    case'pdf':return <svg {...p}><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h5"/><path d="M8.5 13h2.2a1.8 1.8 0 0 0 0-3.6H8.5V17M13 17v-7.6h2a2.8 2.8 0 0 1 0 5.6h-2"/></svg>
    case'image':case'image-metadata':return <svg {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m5 17 4-4 3 3 2-2 5 5"/></svg>
    case'calculator':case'percentage':case'discount':case'age':case'date':case'time':case'bmi':case'loan':case'emi':case'compound-interest':case'tax':case'unit-converter':case'simple-interest':case'tip':case'countdown':return <svg {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M7 7h10M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg>
    case'finance':return <svg {...p}><circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.2c-.5-.9-1.5-1.4-2.8-1.4-1.6 0-2.7.8-2.7 2s1 1.7 2.7 2.1c1.7.4 2.7.9 2.7 2.1s-1.2 2-2.8 2c-1.3 0-2.4-.6-2.9-1.6M12 6v1.8m0 8.6V18"/></svg>
    case'health':return <svg {...p}><path d="M12 20.5S3.5 15.6 3.5 9.2A4.7 4.7 0 0 1 12 6.8a4.7 4.7 0 0 1 8.5 2.4c0 6.4-8.5 11.3-8.5 11.3z"/><path d="M7 12h2.6l1.4-2.6 2 5 1.4-2.4H17"/></svg>
    case'design':return <svg {...p}><path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.3 0 2-.8 2-1.7 0-.5-.2-.9-.5-1.3-.3-.4-.5-.8-.5-1.3 0-.9.8-1.7 1.7-1.7H17a3.5 3.5 0 0 0 3.5-3.5C20.5 6.7 16.7 3.5 12 3.5z"/><circle cx="7.8" cy="11" r="1"/><circle cx="10.5" cy="7.4" r="1"/><circle cx="15" cy="7.8" r="1"/></svg>
    case'productivity':return <svg {...p}><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.2 2"/></svg>
    case'security':case'password':return <svg {...p}><path d="M12 3 20 6v5.5c0 4.6-3.1 7.8-8 9.5-4.9-1.7-8-4.9-8-9.5V6z"/><rect x="9" y="10" width="6" height="5" rx="1"/><path d="M10.5 10V8.8A1.5 1.5 0 0 1 12 7.3a1.5 1.5 0 0 1 1.5 1.5V10"/></svg>
    case'case-convert':return <svg {...p}><path d="M5 18 9 6l4 12M7 14h5M15 8h4M17 8v10M15 18h4"/></svg>
    case'slug':case'url':return <svg {...p}><path d="M9 15 7.5 16.5a3.5 3.5 0 0 1-5-5L6 8a3.5 3.5 0 0 1 5 0"/><path d="m15 9 1.5-1.5a3.5 3.5 0 0 1 5 5L18 16a3.5 3.5 0 0 1-5 0"/><path d="m8 12 8 0"/></svg>
    case'lorem':case'markdown':return <svg {...p}><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>
    case'find-replace':return <svg {...p}><circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 5 5M7.5 10.5h6"/></svg>
    case'word-frequency':return <svg {...p}><path d="M5 19V9M10 19V5M15 19v-8M20 19v-13"/></svg>
    case'duplicate-lines':return <svg {...p}><rect x="6" y="5" width="12" height="14" rx="2"/><path d="M9 3h9a2 2 0 0 1 2 2v12"/><path d="M9 9h6M9 13h6"/></svg>
    case'sort':return <svg {...p}><path d="M7 5h10M7 10h7M7 15h4M4 5l2-2 2 2M4 15l2 2 2-2"/></svg>
    case'reverse':case'line-break':return <svg {...p}><path d="M5 7h14M5 17h14"/><path d="m9 10-3 2 3 2M15 10l3 2-3 2"/></svg>
    case'extra-spaces':return <svg {...p}><circle cx="6" cy="12" r="1"/><circle cx="10" cy="12" r="1"/><circle cx="14" cy="12" r="1"/><circle cx="18" cy="12" r="1"/><path d="M3 19h18"/></svg>
    case'diff':return <svg {...p}><path d="M5 7h14M5 17h14"/><path d="M9 11v4M7 13h4M17 11v4"/></svg>
    case'base64':case'jwt':case'regex':case'sql':case'css':case'javascript':case'cron':case'uuid':case'number-base':case'timestamp':case'color':case'binary':case'contrast':case'sha-256':case'sha-512':case'md5':case'html-encode':case'html-decode':case'random-number':return <svg {...p}><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h8M8 13h5M8 16h8"/></svg>

    case'merge-pdf':case'jpg-to-pdf':return <svg {...p}><path d="M6 4h8l4 4v12H6z"/><path d="M14 4v5h5M12 12v6M9 15h6"/></svg>
    case'split-pdf':return <svg {...p}><path d="M6 4h12v16H6z"/><path d="M12 4v16M8 9l-2 2 2 2M16 9l2 2-2 2"/></svg>
    case'compress-pdf':return <svg {...p}><path d="M6 4h12v16H6z"/><path d="m9 10 3 3 3-3M9 14l3-3 3 3"/></svg>
    case'rotate-pdf':return <svg {...p}><path d="M7 7a7 7 0 1 1-1 9"/><path d="M7 3v5h5"/></svg>
    case'pdf-to-jpg':case'extract-pdf':return <svg {...p}><path d="M6 4h8l4 4v12H6z"/><path d="M14 4v5h5M9 16h6M12 13v6"/></svg>
    case'delete-pdf':return <svg {...p}><path d="M6 7h12M9 7V4h6v3M8 10v8M12 10v8M16 10v8M7 20h10"/></svg>
    case'reorder-pdf':return <svg {...p}><path d="M6 6h12M6 12h12M6 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>
    case'watermark-pdf':return <svg {...p}><path d="M5 5h14v14H5z"/><path d="m7 16 10-8M8 18l8-8"/></svg>

    case'image-compress':return <svg {...p}><rect x="4" y="5" width="16" height="14" rx="2"/><path d="m9 11 3 3 3-3M12 14V7"/></svg>
    case'image-resize':return <svg {...p}><rect x="5" y="5" width="14" height="14" rx="2"/><path d="m9 9-3 3 3 3M15 9l3 3-3 3M12 6v12"/></svg>
    case'image-crop':return <svg {...p}><path d="M7 3v14a4 4 0 0 0 4 4h10M3 7h14a4 4 0 0 1 4 4v10"/></svg>
    case'image-convert':case'jpg-to-png':case'png-to-jpg':case'webp-to-jpg':case'jpg-to-webp':case'png-to-webp':return <svg {...p}><rect x="4" y="5" width="7" height="14" rx="2"/><rect x="13" y="5" width="7" height="14" rx="2"/><path d="M11 9h2M11 15h2"/></svg>
    default:return <svg {...p}><circle cx="12" cy="12" r="8"/><path d="M9 12h6"/></svg>
  }
}

export const socialLinks:[string,IconName,string,string][]=[
  ['Facebook','facebook','','#1877f2'],['Instagram','instagram','','#e1306c'],['YouTube','youtube','','#ff0000'],
  ['LinkedIn','linkedin','','#0a66c2'],['X','x','','#0f1419'],['GitHub','github','https://github.com/rumitech-solutions/Toolskit','#6d5ef8']
]

export function SocialLinks({className='socials'}:{className?:string}){
  return <div className={className}>{socialLinks.map(([label,icon,url,color])=>url
    ?<a key={label} href={url} target="_blank" rel="noreferrer" aria-label={label} style={{['--brand' as never]:color}}><Icon name={icon} size={17}/></a>
    :<span key={label} className="social-placeholder" title={label+' link coming soon'} aria-label={label+' link coming soon'} style={{['--brand' as never]:color}}><Icon name={icon} size={17}/></span>
  )}</div>
}
