export type ImageFormat='image/png'|'image/jpeg'|'image/webp'

export async function loadImage(file:File){
 return new Promise<HTMLImageElement>((resolve,reject)=>{
  const url=URL.createObjectURL(file)
  const img=new Image()
  img.onload=()=>{URL.revokeObjectURL(url);resolve(img)}
  img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Could not read image.'))}
  img.src=url
 })
}

function positiveInteger(value:number|undefined,name:string){
 if(value===undefined)return undefined
 if(!Number.isFinite(value)||value<1)throw new Error(`${name} must be at least 1 pixel.`)
 return Math.round(value)
}

export async function processImage(
 file:File,
 opts:{format?:ImageFormat;quality?:number;width?:number;height?:number;crop?:{x:number;y:number;width:number;height:number}}
){
 const img=await loadImage(file)
 const sourceWidth=img.naturalWidth
 const sourceHeight=img.naturalHeight
 const crop=opts.crop??{x:0,y:0,width:sourceWidth,height:sourceHeight}
 const cropX=Math.round(crop.x)
 const cropY=Math.round(crop.y)
 const cropWidth=Math.round(crop.width)
 const cropHeight=Math.round(crop.height)

 if(!Number.isInteger(cropX)||!Number.isInteger(cropY)||cropX<0||cropY<0)throw new Error('Crop position must use non-negative whole pixels.')
 if(cropWidth<1||cropHeight<1)throw new Error('Crop width and height must be at least 1 pixel.')
 if(cropX+cropWidth>sourceWidth||cropY+cropHeight>sourceHeight)throw new Error(`Crop must stay inside the original image (${sourceWidth} × ${sourceHeight}).`)

 const requestedWidth=positiveInteger(opts.width,'Width')
 const requestedHeight=positiveInteger(opts.height,'Height')
 let width=cropWidth
 let height=cropHeight

 if(requestedWidth!==undefined||requestedHeight!==undefined){
  const scale=requestedWidth!==undefined&&requestedHeight!==undefined
   ?Math.min(requestedWidth/cropWidth,requestedHeight/cropHeight)
   :requestedWidth!==undefined
    ?requestedWidth/cropWidth
    :requestedHeight!/cropHeight
  width=Math.max(1,Math.round(cropWidth*scale))
  height=Math.max(1,Math.round(cropHeight*scale))
 }

 const canvas=document.createElement('canvas')
 canvas.width=width
 canvas.height=height
 const ctx=canvas.getContext('2d')
 if(!ctx)throw new Error('Canvas is unavailable.')
 ctx.drawImage(img,cropX,cropY,cropWidth,cropHeight,0,0,width,height)

 const format=opts.format??file.type as ImageFormat
 const quality=Math.min(1,Math.max(0.05,opts.quality??.82))
 return new Promise<Blob>((resolve,reject)=>
  canvas.toBlob(b=>b?resolve(b):reject(new Error('Image conversion failed.')),format,quality)
 )
}

export async function imageMetadata(file:File){
 const img=await loadImage(file)
 return {
  name:file.name,
  type:file.type||'unknown',
  size:file.size,
  width:img.naturalWidth,
  height:img.naturalHeight,
  lastModified:new Date(file.lastModified).toISOString(),
 }
}
