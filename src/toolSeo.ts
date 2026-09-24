import type {ToolDefinition} from './types'

export type ToolSeoProfile = {
  intro:string
  bestFor:string[]
  workflow:string[]
  tips:string[]
  faq:{question:string;answer:string}[]
}

const categoryGuidance:Record<ToolDefinition['category'],Omit<ToolSeoProfile,'faq'>>={
 Text:{
  intro:'A focused browser utility for cleaning, counting, comparing, and transforming text without installing a separate editor.',
  bestFor:['content cleanup','editing and proofreading workflows','quick text transformations'],
  workflow:['Paste or type your text into the editor.','Choose the transformation or options you need.','Run the tool and review the result.','Copy the finished text into your document, CMS, or project.'],
  tips:['Paste representative text rather than a small sample when checking counts or formatting.','Review the result before replacing your original content.','Keep a copy of important source text before bulk transformations.']
 },
 Developer:{
  intro:'A browser-based developer utility for common formatting, encoding, conversion, inspection, and debugging tasks.',
  bestFor:['API and payload cleanup','debugging and development workflows','quick data transformations'],
  workflow:['Paste the data, code, token, or value you need to inspect.','Set any format, encoding, or validation options.','Run the tool and inspect the result or diagnostic output.','Copy the output into your terminal, editor, API client, or project.'],
  tips:['Validate the output before using it in production code.','Treat tokens, credentials, and secrets as sensitive even when processing happens locally.','For large payloads, keep an original copy so you can compare changes.']
 },
 PDF:{
  intro:'A browser-first PDF utility for common document operations, with supported file processing performed locally in the browser.',
  bestFor:['quick document preparation','page-level PDF changes','private browser-based file workflows'],
  workflow:['Choose one or more PDF files from your device.','Set the page, order, quality, or watermark options where available.','Run the operation and wait for processing to finish.','Download the resulting PDF or ZIP package.'],
  tips:['Keep the original PDF until you have checked the result.','Large PDFs can use significant browser memory during processing.','Local processing means the selected file can stay on your device for supported tools.']
 },
 Image:{
  intro:'A browser-based image utility for common compression, resizing, cropping, conversion, and metadata tasks.',
  bestFor:['web image preparation','format conversion','quick size and quality adjustments'],
  workflow:['Choose an image from your device.','Set quality, dimensions, or output format when available.','Run the image operation.','Download and inspect the converted image.'],
  tips:['Use a copy when experimenting with aggressive compression.','Check dimensions and visual quality after resizing.','Choose WebP for compatible web workflows when smaller files are useful.']
 },
 Calculators:{
  intro:'A focused calculator for getting a quick numerical answer without opening a spreadsheet or installing an app.',
  bestFor:['everyday calculations','planning and estimation','quick reference while working or studying'],
  workflow:['Enter the values required by the calculator.','Check the selected units or assumptions.','Run the calculation and review the result.','Recheck important figures independently before making decisions.'],
  tips:['Use the same units throughout the inputs.','Double-check percentages, rates, and dates before relying on the result.','Treat financial and health-related outputs as estimates, not professional advice.']
 },
 Security:{
  intro:'A lightweight browser utility for password generation, hashing, encoding, identifiers, and related technical tasks.',
  bestFor:['development and testing','local security helpers','quick hashing or generation tasks'],
  workflow:['Enter the value or choose the generation settings you need.','Run the operation in the browser.','Review the generated or transformed result.','Copy or download only what you actually need.'],
  tips:['Never paste private credentials or secrets unnecessarily.','Use cryptographically secure generation for passwords and identifiers when the tool provides it.','Hashing is not encryption, and a digest should not be treated as reversible.']
 }
}

const overrides:Record<string,Partial<ToolSeoProfile>>={
 'word-counter':{
  intro:'Count words, characters, lines, sentences, and estimated reading time from a text sample in one place.',
  bestFor:['essay and article checks','social media and copy length checks','draft editing before publishing'],
  tips:['Reading time is an estimate based on an average reading pace.','Check the no-spaces character count when a platform has a character limit.']
 },
 'json-formatter':{
  intro:'Turn compact or hard-to-read JSON into an indented structure that is easier to inspect, debug, and copy.',
  bestFor:['API response inspection','configuration files','debugging nested JSON'],
  workflow:['Paste valid JSON into the editor.','Choose the indentation level.','Run the formatter and inspect the structured output.','Copy the formatted JSON into your editor or API workflow.'],
  tips:['Formatting does not change the JSON data itself; it changes its whitespace and presentation.','Run the JSON validator first when you suspect syntax problems.']
 },
 'json-validator':{
  intro:'Check whether a JSON value can be parsed as valid JSON before you send, store, or transform it.',
  bestFor:['API request and response checks','configuration validation','debugging syntax errors'],
  workflow:['Paste the JSON you want to check.','Run validation.','If it fails, inspect the input for quoting, commas, brackets, or value syntax.','Re-run validation after making the correction.']
 },
 'json-minifier':{
  intro:'Remove unnecessary JSON whitespace to produce a compact representation that is easier to transmit or embed.',
  bestFor:['API payload cleanup','compact configuration snippets','reducing readable JSON whitespace'],
 },
 'base64':{
  intro:'Encode or decode UTF-8 text as Base64 for common development, debugging, and data-transformation workflows.',
  bestFor:['API and HTTP debugging','embedded text values','development and test data'],
  tips:['Base64 is an encoding, not encryption.','Do not use Base64 to protect passwords, tokens, or other secrets.']
 },
 'url-encoder':{
  intro:'Encode or decode URL components so reserved characters can be represented safely in links and query values.',
  bestFor:['query string values','API request construction','debugging encoded URLs'],
 },
 'jwt-decoder':{
  intro:'Decode the readable header and payload portions of a JSON Web Token locally so you can inspect its claims during development.',
  bestFor:['debugging authentication flows','checking JWT claims and timestamps','development and test environments'],
  tips:['Decoding a JWT does not verify its signature.','Never paste a live production token into an unnecessary third-party service.']
 },
 'regex-tester':{
  intro:'Test JavaScript regular expressions against sample text and inspect matched values and capture groups.',
  bestFor:['form validation rules','log and text parsing','debugging regular expression behavior'],
 },
 'sql-formatter':{
  intro:'Reformat SQL into a more readable structure so clauses, joins, and expressions are easier to inspect and edit.',
  bestFor:['reviewing complex queries','cleaning copied SQL','preparing SQL for documentation'],
 },
 'merge-pdf':{
  intro:'Combine multiple PDF files into a single document directly in your browser for quick local document assembly.',
  bestFor:['combining reports and attachments','creating a submission packet','joining scanned pages into one PDF'],
 },
 'split-pdf':{
  intro:'Create a new PDF from selected pages of an existing document without sending the file to a remote processing service.',
  bestFor:['extracting chapters or sections','sharing selected pages','removing unrelated pages from a copy'],
 },
 'compress-pdf':{
  intro:'Create a smaller PDF by rasterizing pages into compressed images in the browser. The workflow can reduce size, but it can also remove selectable text and form structure.',
  bestFor:['sharing scanned documents','reducing image-heavy PDFs','quick size reduction when editability is not required'],
  tips:['This workflow rasterizes pages, so selectable text and forms are not preserved.','Compare the resulting file size and visual quality before replacing the original.']
 },
 'pdf-to-jpg':{
  intro:'Render PDF pages to JPG images locally and package the results for download.',
  bestFor:['turning document pages into images','sharing individual page previews','creating image assets from PDFs'],
 },
 'jpg-to-pdf':{
  intro:'Combine JPG, PNG, and WebP images into a PDF directly in the browser.',
  bestFor:['photo-to-document workflows','scanned image collections','creating a single shareable PDF'],
 },
 'image-compressor':{
  intro:'Reduce an image file size in the browser with adjustable quality while keeping the original file on your device.',
  bestFor:['website uploads','email and messaging attachments','making large photos easier to share'],
 },
 'image-resizer':{
  intro:'Resize an image in the browser with optional width and height controls for common publishing and upload requirements.',
  bestFor:['social and website dimensions','profile and thumbnail preparation','meeting upload limits'],
 },
 'image-converter':{
  intro:'Convert browser-supported images between common formats without a server-side upload step.',
  bestFor:['JPG, PNG, and WebP workflows','web asset preparation','compatibility fixes between apps'],
 },
 'jpg-to-png':{
  intro:'Convert JPG images to PNG in the browser when you need lossless-style PNG output or broader support for transparency-aware workflows.',
  bestFor:['web graphics preparation','editing workflows that expect PNG','moving JPG assets into a PNG pipeline'],
 },
 'png-to-jpg':{
  intro:'Convert PNG images to JPG in the browser when a smaller photographic format is more practical.',
  bestFor:['photo uploads','reducing PNG file sizes','systems that require JPG input'],
  tips:['JPG does not preserve transparency, so transparent PNG backgrounds will be flattened by the conversion.']
 },
 'percentage-calculator':{
  intro:'Calculate percentages and percentage changes quickly for everyday math, reports, comparisons, and planning.',
  bestFor:['percentage-of-total questions','percentage change','quick report calculations'],
 },
 'discount-calculator':{
  intro:'Work out discount savings and the final sale price from an original amount and percentage discount.',
  bestFor:['shopping comparisons','sale-price checks','pricing and invoice calculations'],
 },
 'age-calculator':{
  intro:'Calculate an age from a birth date using the current date in your browser.',
  bestFor:['birthday and age checks','form preparation','date-based planning'],
 },
 'date-calculator':{
  intro:'Calculate the number of days between two dates for scheduling, planning, and date-based comparisons.',
  bestFor:['deadline checks','project planning','date difference calculations'],
 },
 'bmi-calculator':{
  intro:'Calculate body mass index from weight and height as a quick reference value.',
  bestFor:['general health reference','classroom examples','quick BMI calculations'],
  tips:['BMI is a screening measure rather than a complete health assessment.','Use professional medical guidance for health decisions.']
 },
 'loan-calculator':{
  intro:'Estimate a monthly loan payment from principal, annual rate, and repayment months using a standard installment formula.',
  bestFor:['loan scenario comparisons','budget planning','quick repayment estimates'],
 },
 'emi-calculator':{
  intro:'Estimate an equated monthly installment from principal, annual rate, and loan duration.',
  bestFor:['loan affordability checks','repayment comparisons','quick finance estimates'],
 },
 'unit-converter':{
  intro:'Convert common length, weight, temperature, and volume units without opening a separate conversion app.',
  bestFor:['travel and shopping conversions','school and study tasks','technical and everyday unit checks'],
 },
 'password-generator':{
  intro:'Generate strong random passwords locally with adjustable length using browser cryptographic randomness.',
  bestFor:['new account passwords','development test credentials','temporary secure strings'],
  tips:['Store passwords in a password manager rather than in plain text notes.','Never reuse an important password across services.']
 },
 'sha-256':{
  intro:'Generate a SHA-256 digest from text in your browser for common development, integrity, and learning workflows.',
  bestFor:['checksum-style comparisons','API signature debugging','hashing demonstrations'],
  tips:['A SHA-256 digest is one-way; it is not encryption.']
 },
 'sha-512':{
  intro:'Generate a SHA-512 digest from text locally for development, integrity checks, and hashing experiments.',
  bestFor:['integrity comparisons','development diagnostics','hashing demonstrations'],
 },
 'md5':{
  intro:'Generate an MD5 digest from text for legacy compatibility and debugging workflows.',
  bestFor:['legacy checksum comparisons','debugging existing MD5-based systems','learning hash output'],
  tips:['MD5 is not suitable for modern password storage or security-sensitive collision resistance.']
 },
 'color-contrast-checker':{
  intro:'Measure the contrast ratio between foreground and background colors and compare it with common WCAG thresholds.',
  bestFor:['accessible UI checks','design handoff reviews','website text contrast testing'],
 }
}

export function getToolSeoProfile(tool:ToolDefinition):ToolSeoProfile{
 const base=categoryGuidance[tool.category]
 const custom=overrides[tool.id]??{}
 const intro=custom.intro??`${tool.name} is a ${base.intro.charAt(0).toLowerCase()}${base.intro.slice(1)}`
 const bestFor=custom.bestFor??[`${tool.category.toLowerCase()} workflows`,`quick ${tool.name.toLowerCase()} tasks`,`browser-based utility work`]
 const workflow=custom.workflow??base.workflow
 const tips=[...(custom.tips??[]),...base.tips].slice(0,4)
 const faq=custom.faq??[
  {question:`Who is ${tool.name} useful for?`,answer:`It is useful when you need ${bestFor[0]} or another quick browser-based workflow related to this task.`},
  {question:`Does ${tool.name} require an account?`,answer:'No account is required for the core ToolsKit workflow.'},
  tool.file
   ? {question:'Are files uploaded?',answer:'This tool is designed to process the selected file in your browser rather than relying on a dedicated ToolsKit upload-processing server.'}
   : {question:`Can I use ${tool.name} without installing software?`,answer:'Yes. The core workflow runs in a modern web browser.'}
 ]
 return {intro,bestFor,workflow,tips,faq}
}

export function getRelatedTools(currentId:string){
 const current=tools.find(tool=>tool.id===currentId)
 if(!current)return []
 return tools
  .filter(tool=>tool.id!==currentId)
  .map(tool=>{
   const sameCategory=tool.category===current.category?4:0
   const overlap=tool.keywords.filter(keyword=>current.keywords.includes(keyword)).length
   const nameOverlap=tool.name.toLowerCase().split(/\s+/).filter(word=>current.name.toLowerCase().includes(word)).length
   return {tool,score:sameCategory+overlap*3+nameOverlap}
  })
  .sort((a,b)=>b.score-a.score||a.tool.name.localeCompare(b.tool.name))
  .slice(0,6)
  .map(item=>item.tool)
}
