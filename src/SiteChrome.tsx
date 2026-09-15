import {ReactNode,useEffect,useState} from 'react'
import {siteNavigation} from './siteNavigation'
import {categories} from './toolRegistry'
import {Icon,SocialLinks} from './Icons'
import ChatWidget from './ChatWidget'

const categoryPaths:Record<string,string>={
 Text:'/text-tools',
 Developer:'/developer-tools',
 PDF:'/pdf-tools',
 Image:'/image-tools',
 Calculators:'/calculator-tools',
 Security:'/security-tools'
}

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
     onKeyDown={event=>{if(event.key==='Enter'){event.currentTarget.blur();window.location.href='/'}}
    />
   </label>
  </header>
  {children}
  <footer className="site-footer">
   <div className="footer-shell">
    <div className="footer-main">
     <div className="footer-brand">
      <a className="brand footer-logo" href="/" aria-label="ToolsKit home"><span className="brand-mark"><Icon name="sparkles" size={16}/></span><span>Tools<span>Kit</span></span></a>
      <p>A modern collection of useful web tools designed to help you get small jobs done quickly.</p>
      <a className="email-link" href="mailto:rumitech.solutions00@gmail.com"><Icon name="mail" size={16}/>rumitech.solutions00@gmail.com</a>
     </div>
     <div className="footer-links">
      <h3>Explore</h3>
      <a href="/tools">All tools</a>
      <a href="/#popular">Popular tools</a>
      <a href="/about">About ToolsKit</a>
     </div>
     <div className="footer-links">
      <h3>Categories</h3>
      {categories.slice(1).map(category=><a href={categoryPaths[category]??'/tools'} key={category}>{category}</a>)}
     </div>
     <div className="footer-contact">
      <h3>Stay connected</h3>
      <p className="social-copy">Follow ToolsKit for updates, new tools, and improvements.</p>
      <SocialLinks/>
     </div>
    </div>
    <div className="footer-bottom">
     <span>© 2026 Tools Kit. All rights reserved.</span>
     <span className="footer-credit">Created with <Icon name="heart" size={13}/> by <strong>RumiTech Solutions</strong></span>
     <span className="footer-mail"><Icon name="mail" size={13}/> rumitech.solutions00@gmail.com</span>
    </div>
   </div>
  </footer>
  <ChatWidget/>
 </div>
}
