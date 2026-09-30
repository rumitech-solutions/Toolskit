export type SiteNavigationItem={label:string;path:string}

// Primary navigation stays focused on product discovery. Legal pages remain available
// in the footer and on the individual site pages, keeping the header compact and useful.
export const primaryNavigation:SiteNavigationItem[]=[
 {label:'Home',path:'/'},
 {label:'Tools',path:'/tools'},
 {label:'Developer Tools',path:'/developer-tools'},
 {label:'Text Tools',path:'/text-tools'},
 {label:'PDF Tools',path:'/pdf-tools'},
 {label:'Image Tools',path:'/image-tools'},
 {label:'Calculator Tools',path:'/calculator-tools'},
 {label:'Security Tools',path:'/security-tools'},
 {label:'About Us',path:'/about'},
 {label:'Contact Us',path:'/contact'},
]

export const siteNavigation:SiteNavigationItem[]=[
 ...primaryNavigation,
 {label:'Privacy Policy',path:'/privacy-policy'},
 {label:'Terms & Conditions',path:'/terms-and-conditions'},
]

type SiteSection={heading:string;body:string[]}
export type SitePage={path:string;title:string;description:string;sections:SiteSection[]}

export const sitePages:SitePage[]=[
 {path:'/developer-tools',title:'Developer Tools | ToolsKit',description:'Free online developer tools for JSON, Base64, URLs, JWTs, regex, SQL, HTML, CSS, JavaScript, XML, Markdown, cron and UUIDs.',sections:[
  {heading:'Fast developer utilities in your browser',body:['ToolsKit brings common developer utilities into one focused workspace. Format JSON, validate data, encode URLs, inspect JWT payloads, test regular expressions, format markup, and handle everyday developer text without installing a desktop utility.','Core browser workflows are designed to be fast and convenient for development, debugging, testing, and small data transformations.']},
  {heading:'JSON, encoding and debugging tools',body:['Use the JSON formatter, validator, minifier, JSON to CSV, and JSON to YAML tools for common API and data tasks. Base64 and URL encoder/decoder tools help with everyday encoding work, while the JWT decoder can inspect token headers and payloads locally.']},
  {heading:'Code formatting and utility tools',body:['ToolsKit also includes SQL, HTML, CSS, JavaScript, XML, Markdown, regex, cron, and UUID utilities. Explore the full developer collection from the Tools / Categories page and choose the tool that matches your task.']}
 ]},
 {path:'/text-tools',title:'Text Tools | ToolsKit',description:'Free online text tools for counting, cleaning, sorting, comparing, reversing and converting text.',sections:[
  {heading:'Everyday text tools',body:['ToolsKit text utilities are designed for writers, students, developers, editors, researchers, and anyone who needs to clean or transform text quickly.']},
  {heading:'Count, clean and transform',body:['Count words, characters, sentences and lines; remove duplicate lines and extra spaces; sort or reverse text; remove line breaks; and convert between common writing and programming case styles.']},
  {heading:'Compare text with less friction',body:['The text diff tool makes it easier to inspect changes between two pieces of text. Use these utilities for editing, content cleanup, data preparation, code snippets, and other small text tasks.']}
 ]},
 {path:'/pdf-tools',title:'PDF Tools | ToolsKit',description:'Free browser-based PDF tools to merge, split, compress, rotate, extract, delete, reorder and convert PDF pages.',sections:[
  {heading:'Work with PDFs locally',body:['ToolsKit provides practical PDF utilities for common document tasks. Where supported, files are processed in the browser so you can work without sending the document to a separate processing service.']},
  {heading:'Merge, split and organize pages',body:['Merge PDF files, split or extract selected pages, delete pages, reorder page sequences, rotate documents, and create smaller PDFs with the available compression workflow.']},
  {heading:'Convert between PDFs and images',body:['Convert PDF pages to JPG images and combine JPG, PNG, and WebP images into a PDF. These tools are useful for quick document preparation, sharing, and image-to-document workflows.']}
 ]},
 {path:'/image-tools',title:'Image Tools | ToolsKit',description:'Free online image tools for compression, resizing, cropping, conversion and basic image metadata inspection.',sections:[
  {heading:'Simple image processing',body:['ToolsKit image utilities help with common image preparation tasks without requiring a desktop editor. Choose an image, adjust the available settings, and process it in your browser.']},
  {heading:'Compress, resize and crop',body:['Reduce image file size with adjustable quality, resize images while preserving proportions, or crop using straightforward dimensions. These tools are useful for websites, documents, social posts, and everyday file sharing.']},
  {heading:'Convert common formats',body:['Convert between JPG, PNG, and WebP formats and inspect basic image dimensions and metadata. The goal is a quick utility workflow rather than a complicated editing suite.']}
 ]},
 {path:'/calculator-tools',title:'Online Calculators | ToolsKit',description:'Free online calculators for percentages, discounts, age, dates, time, loans, EMI, compound interest, tax and unit conversion.',sections:[
  {heading:'Quick calculations without spreadsheets',body:['ToolsKit calculators are built for small everyday questions where opening a spreadsheet is unnecessary. Enter the values, run the calculation, and review a clear result.']},
  {heading:'Money, percentage and date calculations',body:['Calculate percentages, discounts, loan and EMI payments, compound interest, taxes, age, date differences, and time totals. Results are intended as convenient estimates and should be independently checked for important decisions.']},
  {heading:'Convert common units',body:['The unit converter supports common length, weight, temperature, and volume conversions. Use it for quick reference while working, studying, shopping, cooking, traveling, or preparing content.']}
 ]},
 {path:'/security-tools',title:'Security Tools | ToolsKit',description:'Free browser-based security utilities for password generation, hashing, HTML encoding and decoding, UUIDs and related tasks.',sections:[
  {heading:'Practical security helpers',body:['ToolsKit includes lightweight browser utilities for common encoding, hashing, password-generation, and identifier tasks. They are intended as convenient helpers rather than a replacement for a full security platform.']},
  {heading:'Generate and hash locally',body:['Generate strong random passwords and UUID v4 values, or create SHA-256, SHA-512, and MD5 digests from text. Browser-based processing helps keep these simple inputs close to your device.']},
  {heading:'Encode and decode safely',body:['HTML encoder and decoder tools help transform common HTML entities, while other developer utilities provide Base64 and URL encoding. Always verify security-sensitive results and never expose secrets unnecessarily.']}
 ]},
 {path:'/about',title:'About Us | ToolsKit',description:'Learn what ToolsKit is, why it exists, and how we design practical browser tools around clarity, speed, and useful everyday work.',sections:[
  {heading:'A toolkit built for real work',body:['ToolsKit is a focused collection of practical web utilities for writing, development, documents, images, calculations, and everyday security tasks. The goal is simple: make small jobs easier without forcing people through unnecessary accounts or complicated workflows.','We organize the experience around clear categories and dedicated tool workspaces so you can understand what a tool does before you use it and move quickly from discovery to result.']},
  {heading:'Our product principles',body:['Useful before flashy. Every tool should solve a recognizable problem and communicate its purpose clearly.','Fast and focused. Core browser-based tools are designed to keep processing close to the user wherever the task allows it.','Clear by design. Navigation, labels, actions, feedback, and supporting information should remain understandable on desktop and mobile.']},
  {heading:'What we are building toward',body:['ToolsKit is designed to grow as a coherent toolkit rather than a collection of disconnected pages. New utilities should fit the same information architecture, visual language, and quality expectations.']}
 ]},
 {path:'/contact',title:'Contact Us | ToolsKit',description:'Contact ToolsKit for questions, feedback, suggestions, corrections, or partnership enquiries.',sections:[
  {heading:'We would like to hear from you',body:['Have feedback about a tool, spotted something that needs improvement, or have an idea for a useful addition? Get in touch and tell us what you would like to see.']},
  {heading:'Email',body:['For support, feedback, suggestions, or general enquiries, contact us at rumitech.solutions00@gmail.com.']},
  {heading:'What to include',body:['For a tool issue, include the tool name, what you entered, what you expected, and what happened. Avoid sending passwords, private documents, API keys, or other sensitive information.']}
 ]},
 {path:'/privacy-policy',title:'Privacy Policy | ToolsKit',description:'Read how ToolsKit handles information when you use our website and browser-based utilities.',sections:[
  {heading:'Privacy by design',body:['Many ToolsKit utilities are designed to process content directly in your browser. When a tool operates locally, the content you enter or files you select are processed on your device rather than uploaded to a ToolsKit processing server.','Some browser capabilities, hosting infrastructure, analytics, advertising, or third-party services may have their own technical requirements and privacy practices. Review the relevant third-party terms when they apply.']},
  {heading:'Information you provide',body:['If you contact us by email, we receive the information included in your message so we can respond. We do not need your tool input to answer a general support request.','Do not submit confidential information through public feedback, email, or any form unless it is necessary for your request.']},
  {heading:'Cookies and advertising',body:['ToolsKit may use essential browser storage or third-party services needed for hosting, security, or measurement.','We may show advertising on ToolsKit through third-party vendors, including Google. These vendors, including Google, use cookies to serve ads based on a visitor\'s prior visits to this and other websites. Google\'s use of advertising cookies allows it and its partners to serve ads based on your visit to this site and/or other sites on the internet.','You can opt out of personalized advertising by visiting Google\'s Ads Settings at adssettings.google.com. You can also review the Network Advertising Initiative opt-out page for other participating vendors.']},
  {heading:'Policy updates',body:['This policy may be updated as ToolsKit evolves. The current version published on this page is the version that applies to visitors using the site.']}
 ]},
 {path:'/terms-and-conditions',title:'Terms & Conditions | ToolsKit',description:'Read the terms that apply when you access and use the ToolsKit website and utilities.',sections:[
  {heading:'Using ToolsKit',body:['ToolsKit provides web-based utilities for general informational and productivity purposes. You are responsible for reviewing results and deciding whether they are appropriate for your specific use case.','Do not use ToolsKit to process material you are not authorized to handle.']},
  {heading:'Accuracy and availability',body:['We aim to keep tools useful and functional, but we cannot guarantee that every calculation, conversion, format, or transformation will be correct for every edge case. Check important results independently before relying on them.','Features may change, be improved, temporarily unavailable, or removed as the service evolves.']},
  {heading:'User responsibility',body:['You remain responsible for the files, text, code, or other content you process with the site and for complying with applicable laws, licenses, privacy obligations, and organizational policies.']},
  {heading:'Contact',body:['Questions about these terms can be sent to rumitech.solutions00@gmail.com.']}
 ]}
]

export function getSitePage(path:string){return sitePages.find(page=>page.path===path)}
