import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib'
import JSZip from 'jszip'

export function validatePageNumbers(pageNumbers:number[],pageCount:number,emptyMessage='Select at least one page.'){
 if(!pageNumbers.length)throw new Error(emptyMessage)
 if(!Number.isInteger(pageCount)||pageCount<1)throw new Error('The PDF does not contain any pages.')
 if(pageNumbers.some(n=>!Number.isInteger(n)||n<1||n>pageCount))throw new Error(`Page numbers must be between 1 and ${pageCount}.`)
 if(new Set(pageNumbers).size!==pageNumbers.length)throw new Error('Page numbers must be unique.')
 return pageNumbers.map(n=>n-1)
}

export function pdfImageStrategy(type:string){
 if(type==='image/png')return 'png'
 if(type==='image/jpeg')return 'jpg'
 if(type==='image/webp')return 'convert-to-jpg'
 return 'unsupported'
}

export async function loadPdf(bytes:Uint8Array){return PDFDocument.load(bytes)}
export async function mergePdfs(files:File[]){
 if(files.length<2)throw new Error('Select at least two PDF files.')
 const out=await PDFDocument.create()
 for(const file of files){
  const src=await PDFDocument.load(await file.arrayBuffer())
  const pages=await out.copyPages(src,src.getPageIndices())
  pages.forEach(p=>out.addPage(p))
 }
 return out.save()
}
export async function selectPdfPages(file:File,pageNumbers:number[]){
 const src=await PDFDocument.load(await file.arrayBuffer())
 const valid=validatePageNumbers(pageNumbers,src.getPageCount())
 const out=await PDFDocument.create()
 const pages=await out.copyPages(src,valid)
 pages.forEach(p=>out.addPage(p))
 return out.save()
}
export async function deletePdfPages(file:File,pageNumbers:number[]){
 const src=await PDFDocument.load(await file.arrayBuffer())
 const remove=validatePageNumbers(pageNumbers,src.getPageCount())
 if(remove.length>=src.getPageCount())throw new Error('At least one PDF page must remain.')
 const removeSet=new Set(remove)
 const out=await PDFDocument.create()
 const keep=src.getPageIndices().filter(i=>!removeSet.has(i))
 const pages=await out.copyPages(src,keep)
 pages.forEach(p=>out.addPage(p))
 return out.save()
}
export async function reorderPdfPages(file:File,order:number[]){
 const src=await PDFDocument.load(await file.arrayBuffer())
 if(order.length!==src.getPageCount())throw new Error(`Provide exactly ${src.getPageCount()} page numbers.`)
 const indexes=validatePageNumbers(order,src.getPageCount())
 const out=await PDFDocument.create()
 const pages=await out.copyPages(src,indexes)
 pages.forEach(p=>out.addPage(p))
 return out.save()
}
export async function rotatePdf(file:File,angle:90|180|270){
 const doc=await PDFDocument.load(await file.arrayBuffer())
 doc.getPages().forEach(p=>p.setRotation(degrees((p.getRotation().angle+angle)%360)))
 return doc.save()
}
export async function watermarkPdf(file:File,text:string,opacity=0.3){
 if(!text.trim())throw new Error('Enter watermark text.')
 const clampedOpacity=Math.min(0.9,Math.max(0.05,opacity))
 const doc=await PDFDocument.load(await file.arrayBuffer())
 const font=await doc.embedFont(StandardFonts.HelveticaBold)
 doc.getPages().forEach(page=>{
  const {width,height}=page.getSize()
  const fontSize=Math.max(24,Math.min(width,height)/8)
  const textWidth=font.widthOfTextAtSize(text,fontSize)
  page.drawText(text,{
   x:width/2-textWidth/2,
   y:height/2,
   size:fontSize,
   font,
   color:rgb(0.55,0.55,0.55),
   opacity:clampedOpacity,
   rotate:degrees(45)
  })
 })
 return doc.save()
}
async function pdfJs(){const mod=await import('pdfjs-dist');return mod}
export async function renderPdfToJpg(file:File,quality=.82){
 const pdfjs=await pdfJs()
 const pdf=await pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise
 const zip=new JSZip()
 for(let i=1;i<=pdf.numPages;i++){
  const page=await pdf.getPage(i)
  const viewport=page.getViewport({scale:1.5})
  const canvas=document.createElement('canvas')
  canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height)
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas is unavailable.')
  await page.render({canvas,canvasContext:ctx,viewport}).promise
  const blob=await new Promise<Blob|null>(r=>canvas.toBlob(r,'image/jpeg',quality))
  if(blob)zip.file(`page-${i}.jpg`,blob)
 }
 return zip.generateAsync({type:'blob'})
}
async function webpToJpg(file:File){
 if(typeof createImageBitmap!=='function')throw new Error('WebP conversion is not supported by this browser.')
 const bitmap=await createImageBitmap(file)
 try{
  const canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas is unavailable.')
  ctx.drawImage(bitmap,0,0)
  const blob=await new Promise<Blob|null>(r=>canvas.toBlob(r,'image/jpeg',.95))
  if(!blob)throw new Error('Could not convert WebP image.')
  return new Uint8Array(await blob.arrayBuffer())
 }finally{bitmap.close()}
}
export async function imagesToPdf(files:File[]){
 if(!files.length)throw new Error('Select at least one image.')
 const out=await PDFDocument.create()
 for(const file of files){
  const strategy=pdfImageStrategy(file.type)
  if(strategy==='unsupported')throw new Error('Only PNG, JPG and WebP images are supported.')
  const bytes=strategy==='convert-to-jpg'?await webpToJpg(file):new Uint8Array(await file.arrayBuffer())
  const image=strategy==='png'?await out.embedPng(bytes):await out.embedJpg(bytes)
  const page=out.addPage([image.width,image.height])
  page.drawImage(image,{x:0,y:0,width:image.width,height:image.height})
 }
 return out.save()
}
export async function compressPdf(file:File,quality=.72,scale=1.25){
 const pdfjs=await pdfJs();const pdf=await pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise
 const out=await PDFDocument.create()
 for(let i=1;i<=pdf.numPages;i++){
  const page=await pdf.getPage(i);const viewport=page.getViewport({scale})
  const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height)
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas is unavailable.')
  await page.render({canvas,canvasContext:ctx,viewport}).promise
  const blob=await new Promise<Blob|null>(r=>canvas.toBlob(r,'image/jpeg',quality));if(!blob)throw new Error('Could not rasterize PDF page.')
  const image=await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));const p=out.addPage([image.width,image.height]);p.drawImage(image,{x:0,y:0,width:image.width,height:image.height})
 }
 return out.save()
}
