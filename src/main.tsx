import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import SitePage from './SitePage'
import SiteChrome from './SiteChrome'
import ToolsLanding from './ToolsLanding'
import SeoContent from './SeoContent'
import {getSitePage} from './siteNavigation'
import './premium.css'
import './sitePages.css'
import './ui-refresh.css'
import './ux-polish.css'
import './tool-workspace.css'
import './page-mode.css'
import './typography-consistency.css'
import './spacing-consistency.css'
import './light-theme.css'
import './public-chrome-polish.css'
import './ui-polish.css'

const path=window.location.pathname.replace(/\/$/,'')||'/'
const syncPageMode=()=>{
 const current=window.location.pathname.replace(/\/$/,'')||'/'
 document.body.classList.toggle('home-route',current==='/')
 document.body.classList.toggle('tool-route',current.startsWith('/tools/'))
}
syncPageMode()
const originalPushState=window.history.pushState.bind(window.history)
window.history.pushState=(...args)=>{
 originalPushState(...args)
 syncPageMode()
 window.dispatchEvent(new PopStateEvent('popstate'))
}
window.addEventListener('popstate',syncPageMode)

const isTool=path.startsWith('/tools/')
const infoPage=getSitePage(path)
const page=path==='/tools'?<ToolsLanding/>:infoPage?<SitePage page={infoPage}/>:<App/>
const content=isTool?<>{page}<SeoContent/></>:page

const root=ReactDOM.createRoot(document.getElementById('root')!)
root.render(<React.StrictMode><SiteChrome>{content}</SiteChrome></React.StrictMode>)
