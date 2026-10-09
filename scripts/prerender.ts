import {mkdirSync,readFileSync,writeFileSync} from 'node:fs'
import {dirname,join} from 'node:path'
import {allRoutes,fileFor,renderPage} from './prerender-lib'

const dist='dist'
const template=readFileSync(join(dist,'index.html'),'utf8')
const routes=allRoutes()
for(const path of routes){
 const out=join(dist,fileFor(path))
 mkdirSync(dirname(out),{recursive:true})
 writeFileSync(out,renderPage(template,path))
}
console.log(`Pre-rendered ${routes.length} pages into dist/`)
