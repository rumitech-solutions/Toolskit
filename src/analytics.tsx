import {useEffect} from 'react'
import {envValue,isGaMeasurementId} from './siteIntegrations'

const measurementId=envValue(import.meta.env.VITE_GA_MEASUREMENT_ID)

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args:unknown[])=>void
  }
}

function ensureGoogleTag(){
  if(typeof window==='undefined'||!isGaMeasurementId(measurementId))return
  window.dataLayer=window.dataLayer||[]
  window.gtag=window.gtag||((...args:unknown[])=>{window.dataLayer!.push(args)})
  const scriptId='toolskit-google-tag'
  if(!document.getElementById(scriptId)){
    const script=document.createElement('script')
    script.id=scriptId
    script.async=true
    script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
    script.dataset.toolskitGoogleTag='true'
    document.head.appendChild(script)
    window.gtag('js',new Date())
    window.gtag('config',measurementId,{send_page_view:false})
  }
}

export function trackEvent(name:string,params:Record<string,string|number|boolean|undefined>={}){
  if(!isGaMeasurementId(measurementId)||typeof window==='undefined')return
  ensureGoogleTag()
  window.gtag?.('event',name,Object.fromEntries(Object.entries(params).filter(([,value])=>value!==undefined)))
}

function currentToolContext(){
  const match=window.location.pathname.match(/^\/tools\/([^/]+)/)
  const toolId=match?.[1]
  const toolName=document.querySelector('.panel-head h2')?.textContent?.trim()
  const category=document.querySelector('.panel-head .section-kicker')?.textContent?.trim()
  return {tool_id:toolId||'homepage-workspace',tool_name:toolName,tool_category:category}
}

function trackPageView(){
  if(typeof window==='undefined')return
  const context=currentToolContext()
  trackEvent('page_view',{
    page_path:window.location.pathname,
    page_title:document.title,
    page_location:`${window.location.origin}${window.location.pathname}`,
  })
  if(window.location.pathname.startsWith('/tools/')){
    trackEvent('tool_view',context)
  }
}

export default function AnalyticsTracker(){
  useEffect(()=>{
    if(!isGaMeasurementId(measurementId))return
    ensureGoogleTag()
    const onLocation=()=>window.setTimeout(trackPageView,0)
    const onClick=(event:MouseEvent)=>{
      const target=event.target
      if(!(target instanceof Element))return
      const runButton=target.closest<HTMLButtonElement>('.tool-panel .primary')
      if(runButton){
        trackEvent('tool_run_start',currentToolContext())
        return
      }
      const link=target.closest<HTMLAnchorElement>('a')
      if(link&&link.href.startsWith(window.location.origin+'/tools/')){
        const match=new URL(link.href).pathname.match(/^\/tools\/([^/]+)/)
        if(match)trackEvent('tool_select',{tool_id:match[1]})
      }
    }
    let pendingRun:{toolId:string;toolName?:string;toolCategory?:string}|null=null
    const runObserver=new MutationObserver(()=>{
      if(!pendingRun)return
      const error=document.querySelector('.error')
      const result=document.querySelector('.result pre')
      if(error?.textContent?.trim()){
        trackEvent('tool_run_error',{...pendingRun})
        pendingRun=null
      }else if(result?.textContent?.trim()){
        trackEvent('tool_run_success',{...pendingRun})
        pendingRun=null
      }
    })
    const rememberRun=(event:MouseEvent)=>{
      const target=event.target
      if(!(target instanceof Element))return
      if(target.closest('.tool-panel .primary')){
        const context=currentToolContext()
        pendingRun={toolId:context.tool_id,toolName:context.tool_name,toolCategory:context.tool_category}
      }
    }
    document.addEventListener('click',rememberRun,true)
    document.addEventListener('click',onClick)
    const searchHandler=(event:KeyboardEvent)=>{
      const target=event.target
      if(!(target instanceof HTMLInputElement)||target.type!=='search'||event.key!=='Enter')return
      const length=target.value.trim().length
      if(length)trackEvent('site_search',{query_length:length})
    }
    document.addEventListener('keydown',searchHandler)
    window.addEventListener('popstate',onLocation)
    runObserver.observe(document.body,{subtree:true,childList:true,characterData:true})
    trackPageView()
    return()=>{
      document.removeEventListener('click',rememberRun,true)
      document.removeEventListener('click',onClick)
      document.removeEventListener('keydown',searchHandler)
      window.removeEventListener('popstate',onLocation)
      runObserver.disconnect()
    }
  },[])
  return null
}
