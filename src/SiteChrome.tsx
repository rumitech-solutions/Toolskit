import {ReactNode,useEffect,useState} from 'react'
import {siteNavigation} from './siteNavigation'
import {Icon,SocialLinks} from './Icons'
import ChatWidget from './ChatWidget'

export default function SiteChrome({children}:{children:ReactNode}){
 const [menuOpen,setMenuOpen]=useState(false)
 const [path,setPath]=useState(()=>window.location.pathname.replace(/\/$/,'')||'/')
 useEffect(()=>{
  const sync=()=>setPath(window.location.pathname.replace(/\/$/,'')||'/')
  window.addEventListener('popstate',sync)
  return()=>window.removeEventListener('popstate',sync)
 },[])
 const isActive=(itemPath:string)=>path===itemPath
 const closeMenu=()=>setMenuOpen(false)
 return <div className="public-app">
  <header className="topbar">
   <a className="brand" href="/" onClick={closeMenu} aria-label="ToolsKit home">
    <span className="brand-mark"><Icon name="sparkles" size={17}/></span>
    <span>Tools<span>Kit</span></span>
   </a>
   <button className="public-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="site-primary-nav" aria-label={menuOpen?'Close navigation':'Open navigation'} onClick={()=>setMenuOpen(open=>!open)}>
    <Icon name={menuOpen?'x':'menu'} size={19}/>
   </button>
   <nav id="site-primary-nav" className={`main-nav${menuOpen?' is-open':''}`} aria-label="Primary">
    <a href="/" className={isActive('/')?'is-active':''} onClick={closeMenu}><Icon name="grid" size={15}/>Home</a>
    <a href="/tools" className={isActive('/tools')?'is-active':''} onClick={closeMenu}><Icon name="grid" size={15}/>Tools / Categories</a>
    <a href="/about" className={isActive('/about')?'is-active':''} onClick={closeMenu}>About Us</a>
    <a href="/contact" className={isActive('/contact')?'is-active':''} onClick={closeMenu}><Icon name="mail" size={15}/>Contact Us</a>
    <a href="/privacy-policy" className={isActive('/privacy-policy')?'is-active':''} onClick={closeMenu}>Privacy Policy</a>
    <a href="/terms-and-conditions" className={isActive('/terms-and-conditions')?'is-active':''} onClick={closeMenu}>Terms & Conditions</a>
   </nav>
   <label className="header-search" aria-label="Search tools">
    <Icon name="search" size={18}/>
    <input
     type="search"
     placeholder="Search tools..."
     onFocus={()=>{if(path!=='/') window.location.href='/'}}
     onKeyDown={event=>{if(event.key==='Enter'){event.currentTarget.blur();window.location.href='/'}}}
    />
   </label>
  </header>
  {children}
  <footer className="public-footer"><div className="public-footer-shell"><div className="public-footer-main"><div><a className="public-brand public-footer-brand" href="/"><span className="public-brand-mark"><Icon name="sparkles" size={16}/></span><span>Tools<span>Kit</span></span></a><p>Practical web tools organized for writing, coding, documents, images, calculations, and everyday tasks.</p><a href="mailto:rumitech.solutions00@gmail.com"><Icon name="mail" size={14}/> rumitech.solutions00@gmail.com</a></div><div><h3>Navigate</h3>{siteNavigation.map(item=><a href={item.path} key={item.path}>{item.label}</a>)}</div><div><h3>Connect</h3><SocialLinks className="public-socials"/></div></div><div className="public-footer-bottom"><span>© 2026 Tools Kit. All rights reserved.</span><span>Created with <Icon name="heart" size={12}/> by <strong>RumiTech Solutions</strong></span></div></div></footer><ChatWidget/>
 </div>
}
