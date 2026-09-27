export type IconName =
  // General UI
  'grid' | 'search' | 'sparkles' | 'arrow' | 'mail' | 'heart' | 'chevron' | 'chat' | 'send' | 'close' | 'menu' | 'x' | 'menu-open' | 'menu-close' |
  // Social
  'facebook' | 'instagram' | 'youtube' | 'linkedin' | 'github' | 'x-twitter' |
  // Tool Categories
  'text' | 'developer' | 'pdf' | 'image' | 'calculator' | 'security' |
  // Text Tools
  'word-count' | 'case-convert' | 'slug' | 'lorem' | 'find-replace' | 'word-frequency' | 'html-tag' | 'duplicate-lines' | 'sort' | 'reverse' | 'line-break' | 'extra-spaces' | 'diff' | 'character-count' | 'sentence-count' |
  // Developer Tools
  'json' | 'base64' | 'url' | 'jwt' | 'regex' | 'sql' | 'html' | 'css' | 'javascript' | 'xml' | 'markdown' | 'cron' | 'uuid' | 'number-base' | 'timestamp' | 'color' | 'binary' | 'contrast' |
  // PDF Tools
  'merge-pdf' | 'split-pdf' | 'compress-pdf' | 'rotate-pdf' | 'pdf-to-jpg' | 'jpg-to-pdf' | 'extract-pdf' | 'delete-pdf' | 'reorder-pdf' | 'watermark-pdf' |
  // Image Tools
  'image-compress' | 'image-resize' | 'image-crop' | 'image-convert' | 'jpg-to-png' | 'png-to-jpg' | 'webp-to-jpg' | 'jpg-to-webp' | 'png-to-webp' | 'image-metadata' |
  // Calculator Tools
  'percentage' | 'discount' | 'age' | 'date' | 'time' | 'bmi' | 'loan' | 'emi' | 'compound-interest' | 'tax' | 'unit-converter' | 'simple-interest' | 'tip' | 'countdown' |
  // Security Tools
  'password' | 'sha-256' | 'sha-512' | 'md5' | 'html-encode' | 'html-decode' | 'random-number' | 'sun' | 'moon'

export function Icon({name,size=18}:{name:IconName;size?:number}){
 const common={width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.9,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,ariaHidden:true}
 switch(name){
  case'grid':return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>
  case'search':return <svg {...common}><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
  case'sparkles':return <svg {...common}><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></svg>
  case'arrow':return <svg {...common}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
  case'mail':return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>
  case'heart':return <svg {...common}><path d="M20.8 8.7c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.7 4.7 0 0 1 12 6.3a4.7 4.7 0 0 1 8.8 2.4Z"/></svg>
  case'facebook':return <svg {...common}><path d="M14 8h2V4.5a14.4 14.4 0 0 0-3-.3c-3 0-5 1.8-5 5.1V12H5v4h3v8h4v-8h3.3l.7-4H12V9.7c0-1.2.5-1.7 2-1.7Z"/></svg>
  case'instagram':return <svg {...common}><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>
  case'youtube':return <svg {...common}><path d="m10 15 5-3-5-3v6Z"/><path d="M21 12c0 4.2-.5 6-1.1 6.7C19.3 19.4 17.8 20 12 20s-7.3-.6-7.9-1.3C3.5 18 3 16.2 3 12s.5-6 1.1-6.7C4.7 4.6 6.2 4 12 4s7.3.6 7.9 1.3C20.5 6 21 7.8 21 12Z"/></svg>
  case'linkedin':return <svg {...common}><path d="M6 9v9"/><path d="M6 6.2v.1"/><path d="M10 18v-5a4 4 0 0 1 8 0v5"/><path d="M10 9v9"/></svg>
  case'github':return <svg {...common}><path d="M9 19c-4.3 1.4-4.3-2.2-6-2.7"/><path d="M15 19v-2.3c0-.7.1-1.4.5-1.9 3.3-.4 4.8-1.6 4.8-4.9a4.8 4.8 0 0 0-1.2-3.3A4.6 4.6 0 0 0 19 3.3s-1.1-.4-3.6 1.3a12.4 12.4 0 0 0-6.8 0C6.1 2.9 5 3.3 5 3.3a4.6 4.6 0 0 0-.1 3.3 4.8 4.8 0 0 0-1.2 3.3c0 3.3 1.5 4.5 4.8 4.9.3.4.5 1 .5 1.9V19"/></svg>
  case'x':return <svg {...common}><path d="M5 4 19 20"/><path d="M19 4 5 20"/></svg>
  case'chat':return <svg {...common}><path d="M4 5h16v11H9l-5 4v-4H4Z"/><path d="M8 9h8M8 12.5h5"/></svg>
  case'send':return <svg {...common}><path d="M21 3 3 10.5l7 2.5 2 7L21 3Z"/><path d="M10 13 21 3"/></svg>
  case'close':return <svg {...common}><path d="M6 6 18 18"/><path d="M18 6 6 18"/></svg>
  case'menu':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
  case'x-twitter':return <svg {...common}><path d="M5 4 19 20"/><path d="M19 4 5 20"/></svg>
	  case'menu-open':return <svg {...common}><path d="M3 6h18"/></svg>
	  case'menu-close':return <svg {...common}><path d="M6 6 18 18"/><path d="M18 6 6 18"/></svg>
	  // Tool Categories
	  case'text':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'developer':return <svg {...common}><path d="M9 4h6l1 7H9zM12 11l2 4M12 8a2 2 0 100 4 2 2 0 000-4z"/></svg>
	  case'pdf':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'image':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'calculator':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'security':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  // Text Tools
	  case'word-count':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'case-convert':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'slug':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'lorem':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'find-replace':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'word-frequency':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'html-tag':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'duplicate-lines':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'sort':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'reverse':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'line-break':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'extra-spaces':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'diff':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'character-count':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'sentence-count':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  // Developer Tools
	  case'json':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'base64':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'url':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'jwt':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'regex':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'sql':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'html':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'css':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'javascript':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'xml':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'markdown':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'cron':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'uuid':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'number-base':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'timestamp':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'color':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'binary':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'contrast':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  // PDF Tools
	  case'merge-pdf':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'split-pdf':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'compress-pdf':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'rotate-pdf':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'pdf-to-jpg':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'jpg-to-pdf':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'extract-pdf':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'delete-pdf':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'reorder-pdf':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'watermark-pdf':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  // Image Tools
	  case'image-compress':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'image-resize':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'image-crop':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'image-convert':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'jpg-to-png':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'png-to-jpg':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'webp-to-jpg':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'jpg-to-webp':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'png-to-webp':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'image-metadata':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  // Calculator Tools
	  case'percentage':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'discount':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'age':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'date':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'time':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'bmi':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'loan':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'emi':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'compound-interest':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'tax':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'unit-converter':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'simple-interest':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'tip':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'countdown':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  // Security Tools
	  case'password':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'sha-256':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'sha-512':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'md5':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'html-encode':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'html-decode':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'random-number':return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
	  case'sun':return <svg {...common}><circle cx="12" cy="12" r="5"/><path d="M12 1l0 4"/><path d="M12 19l0 4"/><path d="M4.22 4.22l1.42 1.42"/><path d="M16.36 16.36l1.42 1.42"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.64 19.36l1.42-1.42"/><path d="M16.36 7.64l1.42-1.42"/></svg>
  case'moon':return <svg {...common}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  default:return <svg {...common}><path d="m8 10 4 4 4-4"/></svg>
 }
}

/** label, icon, url ('' = coming soon), brand color used for the icon chip */
export const socialLinks:[string,IconName,string,string][]=[
 ['Facebook','facebook','','#1877f2'],
 ['Instagram','instagram','','#e1306c'],
 ['YouTube','youtube','','#ff0000'],
 ['LinkedIn','linkedin','','#0a66c2'],
 ['X','x','','#0f1419'],
 ['GitHub','github','https://github.com/muhammadnaumantahir/ToolNest','#6d5ef8'],
]

/** Shared social icon row used by both the home footer and the site-page footer */
export function SocialLinks({className='socials'}:{className?:string}){
 return <div className={className}>{socialLinks.map(([label,icon,url,color])=>url
  ?<a key={label} href={url} target="_blank" rel="noreferrer" aria-label={label} style={{['--brand' as never]:color}}><Icon name={icon} size={17}/></a>
  :<span key={label} className="social-placeholder" title={`${label} link coming soon`} aria-label={`${label} link coming soon`} style={{['--brand' as never]:color}}><Icon name={icon} size={17}/></span>
 )}</div>
}
