import {useEffect,useRef} from 'react'
import {envValue,isAdsenseClientId,isAdsenseSlotId} from './siteIntegrations'

const client=envValue(import.meta.env.VITE_ADSENSE_CLIENT)
const slot=envValue(import.meta.env.VITE_ADSENSE_SLOT_AFTER_CONTENT)

declare global {
  interface Window {
    adsbygoogle?:unknown[]
  }
}

function loadAdSense(){
  if(typeof window==='undefined'||!isAdsenseClientId(client))return
  const scriptId='toolskit-adsense'
  if(document.getElementById(scriptId))return
  const script=document.createElement('script')
  script.id=scriptId
  script.async=true
  script.crossOrigin='anonymous'
  script.src=`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`
  document.head.appendChild(script)
}

export default function AdSense(){
  const adRef=useRef<HTMLModElement|null>(null)

  useEffect(()=>{
    if(!isAdsenseClientId(client))return
    loadAdSense()
  },[])

  useEffect(()=>{
    if(!isAdsenseClientId(client)||!isAdsenseSlotId(slot)||!adRef.current)return
    try{
      ;(window.adsbygoogle=window.adsbygoogle||[]).push({})
    }catch{
      // AdSense can reject an ad request when the slot is not ready; keep the tool UI usable.
    }
  },[])

  if(!isAdsenseClientId(client)||!isAdsenseSlotId(slot))return null

  return <aside className="ad-shell" aria-label="Advertisement">
    <span className="ad-label">Advertisement</span>
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{display:'block',minHeight:90}}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  </aside>
}
