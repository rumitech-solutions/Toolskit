// Notify Bing, Yandex, Seznam and other IndexNow engines about every URL in the sitemap.
// Run after a deploy has gone live:  node scripts/indexnow.mjs
// (Google does not support IndexNow; use Search Console for Google.)
import {readFileSync} from 'node:fs'

const host='toolskit.sbs'
const key='3c879ab4fdcd3b8e16b665b3b258b734'
const xml=readFileSync(new URL('../public/sitemap.xml',import.meta.url),'utf8')
const urlList=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1])
if(!urlList.length)throw new Error('No URLs found in public/sitemap.xml')

for(let i=0;i<urlList.length;i+=10000){
  const res=await fetch('https://api.indexnow.org/indexnow',{
    method:'POST',
    headers:{'content-type':'application/json; charset=utf-8'},
    body:JSON.stringify({host,key,keyLocation:`https://${host}/${key}.txt`,urlList:urlList.slice(i,i+10000)}),
  })
  console.log(`IndexNow: submitted ${Math.min(10000,urlList.length-i)} URLs -> HTTP ${res.status}`)
}
