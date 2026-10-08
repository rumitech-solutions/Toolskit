/* Phase 2 SEO profiles: task-focused content and related-tool discovery. */
import {tools} from './toolRegistry'
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
,
 Finance:{
  intro:'A focused finance calculator for quick estimates of tax, margin, return or pay without a spreadsheet.',
  bestFor:['pricing and budgeting','investment planning','quick money checks'],
  workflow:['Enter your figures.','Check the rate, period and assumptions.','Review the result breakdown.','Confirm important numbers independently.'],
  tips:['Results are estimates, not financial advice.','Use consistent currency and periods.','Rates and fees vary, so verify with your provider.']
 },
 Health:{
  intro:'A simple health and fitness calculator that turns well-known formulas into a quick estimate.',
  bestFor:['fitness planning','training sessions','daily wellness habits'],
  workflow:['Enter your measurements.','Select your activity level or goal.','Review the estimate.','Adjust over time based on real results.'],
  tips:['Estimates vary between individuals.','This is not medical advice.','Consult a professional for health conditions.']
 },
 Design:{
  intro:'A browser-based design utility for colors, CSS and web visuals with instant previews.',
  bestFor:['web and UI design','front-end development','branding experiments'],
  workflow:['Choose your colors or values.','Preview the result live.','Tweak until it looks right.','Copy the CSS or code into your project.'],
  tips:['Check color contrast for accessibility.','Test designs on light and dark backgrounds.','Keep a copy of final values in your design system.']
 },
 Productivity:{
  intro:'A quick everyday helper that works instantly in your browser without an account.',
  bestFor:['everyday tasks','sharing and scheduling','games and decisions'],
  workflow:['Enter your input.','Choose the options you need.','Review the result.','Copy or download it.'],
  tips:['Double-check results before sharing them.','Test QR codes before printing.','Confirm time zones for the exact date.']
 }
}

const overrides:Record<string,Partial<ToolSeoProfile>>={
 'gst-vat-calculator':{
  intro:'Add GST, VAT or sales tax to a net price, or work backwards from a tax-inclusive total to find the original price and the tax amount.',
  bestFor:['invoices and quotes','shopping and price checks','small-business bookkeeping'],
  tips:['Check your local rules: some items are zero-rated or use reduced rates.'],
  faq:[{question:'How do I remove GST or VAT from a price?',answer:'Choose the "remove tax" mode, enter the tax-inclusive price and the rate. The tool divides by 1 + rate and shows the net price and the tax portion.'},{question:'Which tax rate should I enter?',answer:'Use the rate that applies in your country or for your product category. The calculator works with any percentage.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'profit-margin-calculator':{
  intro:'Work out gross profit, profit margin and markup from your cost and selling price, or find the price needed to reach a target margin.',
  bestFor:['pricing products','resellers and shops','freelancers quoting work'],
  tips:['Include shipping, fees and packaging in your cost for a realistic margin.'],
  faq:[{question:'What is the difference between margin and markup?',answer:'Margin is profit as a percentage of the selling price; markup is profit as a percentage of the cost. A 50% markup equals a 33.3% margin.'},{question:'Does this include taxes and fees?',answer:'No. Enter your total cost including fees to get an accurate margin.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'roi-calculator':{
  intro:'Measure how much an investment or campaign earned relative to its cost, including an annualized figure when you enter the time held.',
  bestFor:['investment comparison','marketing campaign results','business decisions'],
  tips:['Include all costs and fees in the amount invested.'],
  faq:[{question:'How is ROI calculated?',answer:'ROI = (final value − amount invested) ÷ amount invested × 100.'},{question:'What is annualized ROI?',answer:'It converts the total return into an equivalent yearly rate so investments held for different periods can be compared.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'sip-calculator':{
  intro:'Estimate how a fixed monthly investment could grow over time at an assumed annual return rate.',
  bestFor:['retirement and goal planning','mutual fund SIP planning','comparing savings plans'],
  tips:['Try conservative return rates to see a range of outcomes.'],
  faq:[{question:'Are the returns guaranteed?',answer:'No. The result is an estimate based on the constant return you enter. Real markets fluctuate.'},{question:'How is the future value calculated?',answer:'It uses the standard annuity-due formula with monthly compounding at the rate you provide.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'salary-converter':{
  intro:'Convert pay between hourly, daily, weekly, bi-weekly, monthly and yearly figures using your own working schedule.',
  bestFor:['comparing job offers','freelance rate setting','budgeting'],
  tips:['Adjust weeks worked per year to account for unpaid leave.'],
  faq:[{question:'How are hourly and yearly pay related?',answer:'Yearly pay = hourly rate × hours per week × weeks per year. You can adjust both values.'},{question:'Is the result before or after tax?',answer:'It converts whatever figure you enter, so it is gross if you enter gross pay.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'calorie-calculator':{
  intro:'Estimate your basal metabolic rate, total daily energy expenditure and a calorie target for your goal using the Mifflin-St Jeor equation.',
  bestFor:['diet planning','fitness goals','understanding energy needs'],
  tips:['Re-check your numbers after significant weight changes.'],
  faq:[{question:'How accurate is a calorie calculator?',answer:'It gives an estimate. Individual metabolism varies, so adjust based on real-world progress over a few weeks.'},{question:'Is this medical advice?',answer:'No. Speak to a doctor or dietitian before making major diet changes.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'water-intake-calculator':{
  intro:'Get a simple estimate of daily water intake based on body weight, exercise and climate.',
  bestFor:['hydration habits','exercise planning','hot-weather days'],
  tips:['Drink more when exercising or in hot weather.'],
  faq:[{question:'How much water should I drink a day?',answer:'Needs vary by body size, activity and climate. This tool gives a reasonable estimate, not a medical target.'},{question:'Do other drinks and food count?',answer:'Yes, a portion of daily fluid comes from food and other beverages.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'pace-calculator':{
  intro:'Calculate your pace per kilometre or mile, finish time or speed from any two of distance, time and pace.',
  bestFor:['race planning','training runs','treadmill workouts'],
  tips:['Use the pace for race distance to plan even splits.'],
  faq:[{question:'How do I calculate my running pace?',answer:'Pace = total time ÷ distance. Enter your time and distance and the tool gives pace per km and per mile.'},{question:'Can I plan a race finish time?',answer:'Yes, enter a target pace and the distance to see the predicted finish time.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'heart-rate-zones':{
  intro:'Estimate maximum heart rate and the five training zones from your age and optional resting heart rate.',
  bestFor:['cardio training','weight-loss workouts','endurance building'],
  tips:['Use a lab test or a hard effort test for a precise maximum.'],
  faq:[{question:'How is max heart rate estimated?',answer:'The tool uses 220 − age, which is a population average. Individuals can differ.'},{question:'What is the Karvonen method?',answer:'It uses your heart-rate reserve (max − resting) so zones reflect your fitness level.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'color-palette-generator':{
  intro:'Build harmonious palettes from a base color using complementary, analogous, triadic, tetradic and monochrome rules.',
  bestFor:['brand and web design','UI mockups','presentations and posters'],
  tips:['Check text contrast with the Color Contrast Checker.'],
  faq:[{question:'What is a complementary color?',answer:'A color on the opposite side of the color wheel, which creates strong contrast.'},{question:'Can I copy the codes?',answer:'Yes, each swatch has a HEX value you can copy with one click.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'css-gradient-generator':{
  intro:'Design linear or radial gradients, preview them live and copy the CSS.',
  bestFor:['website backgrounds','buttons and cards','design prototypes'],
  tips:['Use subtle angle changes for polished backgrounds.'],
  faq:[{question:'Which browsers support CSS gradients?',answer:'All modern browsers support linear-gradient and radial-gradient.'},{question:'How do I use the CSS?',answer:'Paste the generated declaration into a rule such as background on any element.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'box-shadow-generator':{
  intro:'Tune offset, blur, spread, color and opacity of a box-shadow and copy the finished CSS.',
  bestFor:['cards and buttons','depth in UI design','neumorphism experiments'],
  tips:['Keep shadow opacity low for a natural look.'],
  faq:[{question:'What does blur radius do?',answer:'A larger blur makes the shadow softer and more spread out.'},{question:'Can I make an inset shadow?',answer:'Yes, toggle the inset option to place the shadow inside the box.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'px-to-rem-converter':{
  intro:'Convert between px, rem and em using a custom root font size and see a quick table of common values.',
  bestFor:['responsive design','accessible font sizing','CSS refactoring'],
  tips:['Set the base size to match your project root.'],
  faq:[{question:'How many px is 1rem?',answer:'By default 1rem is 16px, but it depends on the root font size of the page.'},{question:'Why use rem instead of px?',answer:'Rem units scale with user font-size settings, which improves accessibility.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'image-to-base64':{
  intro:'Convert an image into a Base64 data URI and ready-made HTML and CSS snippets, processed locally in your browser.',
  bestFor:['embedding small icons','email templates','single-file prototypes'],
  tips:['Compress large images before encoding.'],
  faq:[{question:'Is my image uploaded?',answer:'No. The file is read and encoded locally in your browser.'},{question:'When should I use Base64 images?',answer:'For small images only; Base64 adds about 33% to the size.'},{question:'Are files uploaded?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'fancy-text-generator':{
  intro:'Convert normal text into bold, italic, script, gothic, circled and many other Unicode styles that work in social bios and chat apps.',
  bestFor:['social media bios','usernames and captions','chat messages'],
  tips:['Avoid fancy text for important content because screen readers may not read it well.'],
  faq:[{question:'Where can I paste fancy text?',answer:'Almost anywhere that accepts Unicode, such as Instagram, X, Discord and WhatsApp.'},{question:'Why do some characters look like boxes?',answer:'A few apps or fonts do not support every Unicode character.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'bionic-reading-converter':{
  intro:'Emphasise the first part of every word so the eye can glide through text more quickly.',
  bestFor:['skimming long articles','study notes','reading comfort'],
  tips:['Adjust the fixation strength to suit your reading style.'],
  faq:[{question:'Does bionic reading really work?',answer:'Research is mixed. Some people find it more comfortable, others see no benefit, so try it yourself.'},{question:'Can I copy the result?',answer:'Yes, copy the formatted text for your own use.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'reading-time-calculator':{
  intro:'Estimate how long a text takes to read silently or speak aloud, using your own words-per-minute pace.',
  bestFor:['blog posts','speeches and presentations','video scripts'],
  tips:['Add pauses for slides or demos when timing a talk.'],
  faq:[{question:'What reading speed is used?',answer:'The default is around 238 words per minute for silent reading, and you can change it.'},{question:'How is speaking time estimated?',answer:'At about 150 words per minute, adjustable in the tool.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'readability-score-checker':{
  intro:'Score your writing with Flesch reading ease and Flesch-Kincaid grade level, plus word and sentence stats.',
  bestFor:['blog and SEO writing','student essays','plain-language checks'],
  tips:['Shorter sentences and simpler words raise the score.'],
  faq:[{question:'What is a good Flesch score?',answer:'Scores of 60–70 are considered plain English; higher is easier to read.'},{question:'Does it work for other languages?',answer:'The formulas are tuned for English, so results for other languages are only approximate.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'keyword-density-checker':{
  intro:'Analyse the most frequent words and phrases in your copy, excluding common stop words if you choose.',
  bestFor:['SEO content review','avoiding keyword stuffing','editing drafts'],
  tips:['Use phrases of two or three words for better insight.'],
  faq:[{question:'What keyword density is ideal?',answer:'There is no fixed number. Write naturally and avoid obvious repetition.'},{question:'Are stop words removed?',answer:'You can toggle stop-word filtering on or off.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'utm-link-builder':{
  intro:'Add UTM source, medium, campaign, term and content parameters to a URL so campaigns are tracked correctly in analytics.',
  bestFor:['marketing campaigns','newsletters','social media links'],
  tips:['Agree a naming convention with your team before launching.'],
  faq:[{question:'What are UTM parameters?',answer:'They are query-string tags that tell analytics tools where a visit came from.'},{question:'Are UTM values case-sensitive?',answer:'Yes. Keep naming consistent, for example always lowercase.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'time-zone-converter':{
  intro:'Convert a specific date and time between time zones and compare several cities at once, with daylight saving applied automatically.',
  bestFor:['scheduling meetings','remote teams','travel planning'],
  tips:['Pick the date of the event; offsets can differ across the year.'],
  faq:[{question:'Does it handle daylight saving time?',answer:'Yes. Conversions use the browser time zone database, so DST rules for the selected date apply.'},{question:'Which zones are supported?',answer:'Major cities and IANA time zones across the world.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'random-picker':{
  intro:'Draw one or several random winners from a list using the browser’s secure random generator.',
  bestFor:['giveaways and raffles','classroom choices','deciding where to eat'],
  tips:['Put one option per line.'],
  faq:[{question:'Is the pick really random?',answer:'Yes. It uses crypto.getRandomValues, a cryptographically secure source.'},{question:'Can I pick more than one?',answer:'Yes, choose how many winners to draw without repeats.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'dice-roller-coin-flip':{
  intro:'Roll any number of dice from d4 to d100 or flip a coin, with totals shown instantly.',
  bestFor:['board and tabletop games','quick decisions','teaching probability'],
  tips:['Use multiple dice for roleplaying games.'],
  faq:[{question:'Which dice are supported?',answer:'d4, d6, d8, d10, d12, d20 and d100, in any quantity.'},{question:'Is it fair?',answer:'Yes. Results use a cryptographically secure random source.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'qr-code-generator':{
  intro:'Create a QR code from any text or link, choose colors and error correction, and download it as SVG or PNG.',
  bestFor:['sharing links and menus','business cards and flyers','Wi-Fi and contact sharing'],
  tips:['Test the QR code with a phone before printing.'],
  faq:[{question:'Does the QR code expire?',answer:'No. The code simply encodes your text, so it never expires.'},{question:'Is my data sent to a server?',answer:'No. The QR code is generated entirely in your browser.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'json-to-typescript':{
  intro:'Paste JSON and generate TypeScript interfaces that match nested objects, arrays and mixed types.',
  bestFor:['typing API responses','prototyping models','migrating JavaScript projects'],
  tips:['Review generated types for fields that may be null.'],
  faq:[{question:'Does it detect optional fields?',answer:'Where array items differ, missing keys are marked optional.'},{question:'Is the JSON sent anywhere?',answer:'No. The conversion runs in your browser.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'chmod-calculator':{
  intro:'Toggle read, write and execute for owner, group and others and get both the octal and symbolic chmod value.',
  bestFor:['server administration','deployment scripts','learning Linux'],
  tips:['Avoid 777 on production systems.'],
  faq:[{question:'What does chmod 755 mean?',answer:'Owner can read, write and execute; group and others can read and execute.'},{question:'What does chmod 644 mean?',answer:'Owner can read and write; group and others can only read.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'cidr-subnet-calculator':{
  intro:'Enter an IPv4 address with a prefix length to see netmask, network and broadcast addresses, usable host range and host count.',
  bestFor:['network design','cloud VPC planning','certification study'],
  tips:['Remember that cloud providers often reserve extra addresses.'],
  faq:[{question:'What does /24 mean?',answer:'The first 24 bits are the network portion, giving 256 addresses and 254 usable hosts.'},{question:'Does it support IPv6?',answer:'Not yet, this tool covers IPv4.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'http-status-codes':{
  intro:'Search a reference of HTTP status codes from 1xx to 5xx with plain-English explanations.',
  bestFor:['API debugging','web development','SEO audits'],
  tips:['Return the most specific status code your API can.'],
  faq:[{question:'What is the difference between 301 and 302?',answer:'301 is a permanent redirect; 302 is temporary.'},{question:'What does 429 mean?',answer:'Too Many Requests: the client has been rate limited.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'random-string-generator':{
  intro:'Generate secure random strings, tokens and keys with your choice of length and character sets.',
  bestFor:['API keys and tokens','test data','temporary secrets'],
  tips:['Use at least 32 characters for secrets.'],
  faq:[{question:'Is the string cryptographically secure?',answer:'Yes. It is generated with crypto.getRandomValues in your browser.'},{question:'Is anything stored?',answer:'No. Generated strings are not saved or sent anywhere.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'hmac-generator':{
  intro:'Create HMAC signatures from a message and a secret key using SHA-256, SHA-384 or SHA-512.',
  bestFor:['webhook verification','API signing','debugging signatures'],
  tips:['Do not paste production secrets into any tool unnecessarily.'],
  faq:[{question:'What is HMAC used for?',answer:'HMAC verifies message integrity and authenticity using a shared secret.'},{question:'Is my secret key uploaded?',answer:'No. Everything is computed locally with the Web Crypto API.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'text-encryptor':{
  intro:'Encrypt a message with a password using AES-GCM and PBKDF2, then decrypt it later with the same password.',
  bestFor:['sharing private notes','protecting small secrets','learning cryptography'],
  tips:['Choose a long, unique passphrase.'],
  faq:[{question:'Can you recover a lost password?',answer:'No. The password is never stored, so lost passwords cannot be recovered.'},{question:'Which algorithm is used?',answer:'AES-GCM with a key derived via PBKDF2 and a random salt and IV.'},{question:'Is my data sent to a server?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
 'file-checksum-calculator':{
  intro:'Compute SHA-1, SHA-256, SHA-384 and SHA-512 checksums for a file, processed locally in your browser.',
  bestFor:['verifying downloads','file integrity checks','software releases'],
  tips:['Prefer SHA-256 or stronger over SHA-1.'],
  faq:[{question:'Is my file uploaded?',answer:'No. The file is hashed locally in your browser.'},{question:'How do I verify a download?',answer:'Compare the hash with the one published by the source; they must match exactly.'},{question:'Are files uploaded?',answer:'No. This tool runs in your browser, so what you enter stays on your device.'}]
 },
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
