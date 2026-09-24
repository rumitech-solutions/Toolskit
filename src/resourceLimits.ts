export const MAX_FILE_SIZE_BYTES=25*1024*1024
export const MAX_TOTAL_FILE_SIZE_BYTES=60*1024*1024
export const MAX_IMAGE_PIXELS=40_000_000
export const MAX_PDF_PAGES=300

export function validateFileSize(file:File){
 if(file.size>MAX_FILE_SIZE_BYTES)throw new Error(`File "${file.name}" is too large. Maximum size is 25 MB.`)
}

export function validateFileCollection(files:File[],minimumCount=1){
 if(files.length<minimumCount)throw new Error(`Select at least ${minimumCount} file${minimumCount===1?'':'s'}.`)
 files.forEach(validateFileSize)
 const total=files.reduce((sum,file)=>sum+file.size,0)
 if(total>MAX_TOTAL_FILE_SIZE_BYTES)throw new Error('Selected files exceed the 60 MB total processing limit.')
}

export function validatePdfPageCount(pageCount:number){
 if(pageCount>MAX_PDF_PAGES)throw new Error(`This PDF has ${pageCount} pages. The browser version supports up to 300 pages per operation.`)
}

export function validateImageDimensions(width:number,height:number){
 if(!Number.isSafeInteger(width)||!Number.isSafeInteger(height)||width<1||height<1)throw new Error('The image dimensions are invalid.')
 if(width*height>MAX_IMAGE_PIXELS)throw new Error('This image is too large to process safely in the browser. Maximum is 40 megapixels.')
}
