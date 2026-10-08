import {tools} from './toolRegistry'

const base='https://toolskit.sbs'

type SeoData={title:string;description:string}

const defaults:SeoData={
 title:'ToolsKit — Free Online Developer, PDF, Image & Text Tools',
 description:'Free online tools for developers, text, PDF, images, calculators and security. Fast, private browser-based tools from ToolsKit.'
}

const seoBySlug:Record<string,SeoData>={
 'length-converter':{title:'Length Converter — Free Online, No Sign-up | ToolsKit',description:'Convert meters, kilometers, miles, feet, inches and more. Free online length converter that runs in your browser — no sign-up needed.'},
 'weight-converter':{title:'Weight Converter — Free Online, No Sign-up | ToolsKit',description:'Convert kilograms, pounds, ounces, grams, stone and tonnes. Free online weight converter that runs in your browser — no sign-up needed.'},
 'temperature-converter':{title:'Temperature Converter — Free Online, No Sign-up | ToolsKit',description:'Convert Celsius, Fahrenheit, Kelvin and Rankine. Free online temperature converter that runs in your browser — no sign-up needed.'},
 'area-converter':{title:'Area Converter — Free Online, No Sign-up | ToolsKit',description:'Convert square meters, acres, hectares, square feet and more. Free online area converter that runs in your browser — no sign-up needed.'},
 'volume-converter':{title:'Volume Converter — Free Online, No Sign-up | ToolsKit',description:'Convert liters, gallons, cups, tablespoons and milliliters. Free online volume converter that runs in your browser — no sign-up needed.'},
 'speed-converter':{title:'Speed Converter — Free Online, No Sign-up | ToolsKit',description:'Convert km/h, mph, m/s, knots and Mach. Free online speed converter that runs in your browser — no sign-up needed.'},
 'data-storage-converter':{title:'Data Storage Converter — Free Online, No Sign-up | ToolsKit',description:'Convert bits, bytes, KB, MB, GB, TB and binary KiB, MiB, GiB. Free online data storage converter that runs in your browser — no sign-up needed.'},
 'pressure-converter':{title:'Pressure Converter — Free Online, No Sign-up | ToolsKit',description:'Convert Pa, kPa, bar, psi, atm and mmHg. Free online pressure converter that runs in your browser — no sign-up needed.'},
 'energy-converter':{title:'Energy Converter — Free Online, No Sign-up | ToolsKit',description:'Convert joules, calories, kWh, BTU and foot-pounds. Free online energy converter that runs in your browser — no sign-up needed.'},
 'angle-converter':{title:'Angle Converter — Free Online, No Sign-up | ToolsKit',description:'Convert degrees, radians, gradians, arcminutes and turns. Free online angle converter that runs in your browser — no sign-up needed.'},
 'fuel-economy-converter':{title:'Fuel Economy Converter — Free Online, No Sign-up | ToolsKit',description:'Convert mpg (US and UK), km/L and L/100 km. Free online fuel economy converter that runs in your browser — no sign-up needed.'},
 'power-converter':{title:'Power Converter — Free Online, No Sign-up | ToolsKit',description:'Convert watts, kilowatts, megawatts and horsepower. Free online power converter that runs in your browser — no sign-up needed.'},
 'number-to-words':{title:'Number to Words Converter — Free Online, No Sign-up | ToolsKit',description:'Convert numbers to English words, including cheque amounts. Free online number to words converter that runs in your browser — no sign-up needed.'},
 'mortgage-calculator':{title:'Mortgage Calculator — Free Online, No Sign-up | ToolsKit',description:'Estimate monthly mortgage payments with tax and insurance. Free online mortgage calculator that runs in your browser — no sign-up needed.'},
 'savings-goal-calculator':{title:'Savings Goal Calculator — Free Online, No Sign-up | ToolsKit',description:'Find the monthly saving needed to reach a target amount. Free online savings goal calculator that runs in your browser — no sign-up needed.'},
 'inflation-calculator':{title:'Inflation Calculator — Free Online, No Sign-up | ToolsKit',description:'See how inflation changes prices and buying power over time. Free online inflation calculator that runs in your browser — no sign-up needed.'},
 'break-even-calculator':{title:'Break-Even Calculator — Free Online, No Sign-up | ToolsKit',description:'Find the units and revenue needed to cover your costs. Free online break-even calculator that runs in your browser — no sign-up needed.'},
 'cagr-calculator':{title:'CAGR Calculator — Free Online, No Sign-up | ToolsKit',description:'Calculate compound annual growth rate for investments or revenue. Free online cagr calculator that runs in your browser — no sign-up needed.'},
 'retirement-calculator':{title:'Retirement Calculator — Free Online, No Sign-up | ToolsKit',description:'Estimate retirement savings and sustainable monthly income. Free online retirement calculator that runs in your browser — no sign-up needed.'},
 'credit-card-payoff-calculator':{title:'Credit Card Payoff Calculator — Free Online, No Sign-up | ToolsKit',description:'See how long it takes to clear a card balance and the interest. Free online credit card payoff calculator that runs in your browser — no sign-up needed.'},
 'fixed-deposit-calculator':{title:'Fixed Deposit Calculator — Free Online, No Sign-up | ToolsKit',description:'Calculate maturity value and interest on a fixed deposit. Free online fixed deposit calculator that runs in your browser — no sign-up needed.'},
 'bmr-calculator':{title:'BMR Calculator — Free Online, No Sign-up | ToolsKit',description:'Calculate basal metabolic rate and maintenance calories. Free online bmr calculator that runs in your browser — no sign-up needed.'},
 'body-fat-calculator':{title:'Body Fat Calculator — Free Online, No Sign-up | ToolsKit',description:'Estimate body fat percentage with the US Navy method. Free online body fat calculator that runs in your browser — no sign-up needed.'},
 'ideal-weight-calculator':{title:'Ideal Weight Calculator — Free Online, No Sign-up | ToolsKit',description:'Estimate ideal body weight with four common formulas. Free online ideal weight calculator that runs in your browser — no sign-up needed.'},
 'macro-calculator':{title:'Macro Calculator — Free Online, No Sign-up | ToolsKit',description:'Turn calories into grams of protein, carbs and fat. Free online macro calculator that runs in your browser — no sign-up needed.'},
 'due-date-calculator':{title:'Pregnancy Due Date Calculator — Free Online, No Sign-up | ToolsKit',description:'Estimate a due date from the first day of your last period. Free online pregnancy due date calculator that runs in your browser — no sign-up needed.'},
 'sleep-calculator':{title:'Sleep Calculator — Free Online, No Sign-up | ToolsKit',description:'Find the best bedtime or wake-up time using 90-minute cycles. Free online sleep calculator that runs in your browser — no sign-up needed.'},
 'protein-intake-calculator':{title:'Protein Intake Calculator — Free Online, No Sign-up | ToolsKit',description:'Estimate daily protein needs based on weight and goal. Free online protein intake calculator that runs in your browser — no sign-up needed.'},
 'waist-hip-ratio-calculator':{title:'Waist-to-Hip Ratio Calculator — Free Online, No Sign-up | ToolsKit',description:'Calculate waist-to-hip ratio and a WHO risk reference. Free online waist-to-hip ratio calculator that runs in your browser — no sign-up needed.'},
 'color-shades-generator':{title:'Color Shades Generator — Free Online, No Sign-up | ToolsKit',description:'Generate a 10-step tint and shade scale from any color. Free online color shades generator that runs in your browser — no sign-up needed.'},
 'glassmorphism-generator':{title:'Glassmorphism CSS Generator — Free Online, No Sign-up | ToolsKit',description:'Create frosted-glass CSS with blur, transparency and border. Free online glassmorphism css generator that runs in your browser — no sign-up needed.'},
 'border-radius-generator':{title:'CSS Border Radius Generator — Free Online, No Sign-up | ToolsKit',description:'Design rounded corners per corner and copy the CSS. Free online css border radius generator that runs in your browser — no sign-up needed.'},
 'text-shadow-generator':{title:'CSS Text Shadow Generator — Free Online, No Sign-up | ToolsKit',description:'Build CSS text shadows with a live preview. Free online css text shadow generator that runs in your browser — no sign-up needed.'},
 'css-clamp-generator':{title:'CSS Clamp Generator — Free Online, No Sign-up | ToolsKit',description:'Create fluid font sizes with the CSS clamp() function. Free online css clamp generator that runs in your browser — no sign-up needed.'},
 'rgb-to-hex-converter':{title:'RGB to HEX Converter — Free Online, No Sign-up | ToolsKit',description:'Convert RGB values to HEX and HSL with a color preview. Free online rgb to hex converter that runs in your browser — no sign-up needed.'},
 'business-days-calculator':{title:'Business Days Calculator — Free Online, No Sign-up | ToolsKit',description:'Count working days between two dates, excluding weekends. Free online business days calculator that runs in your browser — no sign-up needed.'},
 'week-number-calculator':{title:'Week Number Calculator — Free Online, No Sign-up | ToolsKit',description:'Find the ISO week number, quarter and day of year for a date. Free online week number calculator that runs in your browser — no sign-up needed.'},
 'day-of-week-calculator':{title:'Day of the Week Calculator — Free Online, No Sign-up | ToolsKit',description:'Find out which weekday any date falls on. Free online day of the week calculator that runs in your browser — no sign-up needed.'},
 'meeting-cost-calculator':{title:'Meeting Cost Calculator — Free Online, No Sign-up | ToolsKit',description:'See how much a meeting costs in salary time. Free online meeting cost calculator that runs in your browser — no sign-up needed.'},
 'work-hours-calculator':{title:'Work Hours Calculator — Free Online, No Sign-up | ToolsKit',description:'Calculate daily, weekly and yearly hours from start and end times. Free online work hours calculator that runs in your browser — no sign-up needed.'},
 'lottery-number-generator':{title:'Lottery Number Generator — Free Online, No Sign-up | ToolsKit',description:'Generate random lottery lines with unique numbers. Free online lottery number generator that runs in your browser — no sign-up needed.'},
 'text-repeater':{title:'Text Repeater — Free Online, No Sign-up | ToolsKit',description:'Repeat any text up to 1,000 times with a separator. Free online text repeater that runs in your browser — no sign-up needed.'},
 'anagram-checker':{title:'Anagram Checker — Free Online, No Sign-up | ToolsKit',description:'Check whether two words or phrases are anagrams. Free online anagram checker that runs in your browser — no sign-up needed.'},
 'remove-accents':{title:'Remove Accents from Text — Free Online, No Sign-up | ToolsKit',description:'Strip diacritics and accents from letters. Free online remove accents from text that runs in your browser — no sign-up needed.'},
 'add-line-numbers':{title:'Add Line Numbers to Text — Free Online, No Sign-up | ToolsKit',description:'Number every line of text with a custom start and separator. Free online add line numbers to text that runs in your browser — no sign-up needed.'},
 'upside-down-text':{title:'Upside Down Text Generator — Free Online, No Sign-up | ToolsKit',description:'Flip your text upside down with Unicode characters. Free online upside down text generator that runs in your browser — no sign-up needed.'},
 'emoji-remover':{title:'Emoji Remover — Free Online, No Sign-up | ToolsKit',description:'Remove emoji and pictographs from text. Free online emoji remover that runs in your browser — no sign-up needed.'},
 'title-case-converter':{title:'Title Case Converter — Free Online, No Sign-up | ToolsKit',description:'Convert text to headline-style Title Case. Free online title case converter that runs in your browser — no sign-up needed.'},
 'hashtag-generator':{title:'Hashtag Generator — Free Online, No Sign-up | ToolsKit',description:'Turn phrases into clean, readable hashtags. Free online hashtag generator that runs in your browser — no sign-up needed.'},
 'url-parser':{title:'URL Parser — Free Online, No Sign-up | ToolsKit',description:'Break a URL into protocol, host, path, query and hash. Free online url parser that runs in your browser — no sign-up needed.'},
 'string-escape':{title:'String Escape & Unescape — Free Online, No Sign-up | ToolsKit',description:'Escape or unescape strings for JSON, regex and SQL. Free online string escape & unescape that runs in your browser — no sign-up needed.'},
 'mime-type-lookup':{title:'MIME Type Lookup — Free Online, No Sign-up | ToolsKit',description:'Look up the MIME type for a file extension or vice versa. Free online mime type lookup that runs in your browser — no sign-up needed.'},
 'port-number-lookup':{title:'Port Number Lookup — Free Online, No Sign-up | ToolsKit',description:'Find common TCP/UDP ports and the services that use them. Free online port number lookup that runs in your browser — no sign-up needed.'},
 'ip-address-validator':{title:'IP Address Validator — Free Online, No Sign-up | ToolsKit',description:'Validate IPv4 and IPv6 addresses and see their type. Free online ip address validator that runs in your browser — no sign-up needed.'},
 'json-diff':{title:'JSON Diff — Free Online, No Sign-up | ToolsKit',description:'Compare two JSON documents and list every difference. Free online json diff that runs in your browser — no sign-up needed.'},
 'jwt-generator':{title:'JWT Generator — Free Online, No Sign-up | ToolsKit',description:'Create signed HS256, HS384 or HS512 JSON Web Tokens. Free online jwt generator that runs in your browser — no sign-up needed.'},
 'user-agent-parser':{title:'User Agent Parser — Free Online, No Sign-up | ToolsKit',description:'Detect browser, OS and device from a user-agent string. Free online user agent parser that runs in your browser — no sign-up needed.'},
 'passphrase-generator':{title:'Passphrase Generator — Free Online, No Sign-up | ToolsKit',description:'Generate memorable, strong passphrases from random words. Free online passphrase generator that runs in your browser — no sign-up needed.'},
 'pin-generator':{title:'PIN Generator — Free Online, No Sign-up | ToolsKit',description:'Generate random numeric PINs that avoid easy patterns. Free online pin generator that runs in your browser — no sign-up needed.'},
 'hash-identifier':{title:'Hash Identifier — Free Online, No Sign-up | ToolsKit',description:'Identify likely hash types such as MD5, SHA-1, SHA-256 and bcrypt. Free online hash identifier that runs in your browser — no sign-up needed.'},
 'fraction-calculator':{title:'Fraction Calculator — Free Online, No Sign-up | ToolsKit',description:'Add, subtract, multiply and divide fractions. Free online fraction calculator that runs in your browser — no sign-up needed.'},
 'quadratic-equation-solver':{title:'Quadratic Equation Solver — Free Online, No Sign-up | ToolsKit',description:'Solve ax² + bx + c = 0 with real or complex roots. Free online quadratic equation solver that runs in your browser — no sign-up needed.'},
 'gpa-calculator':{title:'GPA Calculator — Free Online, No Sign-up | ToolsKit',description:'Calculate GPA on the 4.0 scale from grades and credits. Free online gpa calculator that runs in your browser — no sign-up needed.'},
 'grade-calculator':{title:'Grade Calculator — Free Online, No Sign-up | ToolsKit',description:'Find your weighted grade and the score needed on the final. Free online grade calculator that runs in your browser — no sign-up needed.'},
 'ohms-law-calculator':{title:'Ohm’s Law Calculator — Free Online, No Sign-up | ToolsKit',description:'Solve voltage, current, resistance and power from any two values. Free online ohm’s law calculator that runs in your browser — no sign-up needed.'},
 'fuel-cost-calculator':{title:'Fuel Cost Calculator — Free Online, No Sign-up | ToolsKit',description:'Estimate the fuel needed and cost of a trip. Free online fuel cost calculator that runs in your browser — no sign-up needed.'},
 'geometry-calculator':{title:'Geometry Calculator — Free Online, No Sign-up | ToolsKit',description:'Area, perimeter and volume for common shapes. Free online geometry calculator that runs in your browser — no sign-up needed.'},
 'ratio-calculator':{title:'Ratio Calculator — Free Online, No Sign-up | ToolsKit',description:'Solve A:B = C:? and simplify ratios. Free online ratio calculator that runs in your browser — no sign-up needed.'},
 'average-calculator':{title:'Average Calculator — Free Online, No Sign-up | ToolsKit',description:'Mean, median, mode, range and more for a list of numbers. Free online average calculator that runs in your browser — no sign-up needed.'},
 'gst-vat-calculator':{title:'GST & VAT Calculator — Add or Remove Tax Online | ToolsKit',description:'Free GST and VAT calculator. Add tax to a net price or remove it from a gross price and see the tax amount and totals instantly.'},
 'profit-margin-calculator':{title:'Profit Margin Calculator — Margin & Markup Online | ToolsKit',description:'Free profit margin calculator. Enter cost and price to get gross profit, margin percentage and markup, or find the price for a target margin.'},
 'roi-calculator':{title:'ROI Calculator — Return on Investment Online | ToolsKit',description:'Free ROI calculator. Enter the amount invested and final value to see net profit, ROI percentage and annualized return over any period.'},
 'sip-calculator':{title:'SIP Calculator — Monthly Investment Returns Online | ToolsKit',description:'Free SIP calculator. Estimate the future value of monthly investments with an expected return rate, and see total invested versus gains.'},
 'salary-converter':{title:'Salary Converter — Hourly to Yearly Pay Online | ToolsKit',description:'Free salary converter. Turn hourly, daily, weekly, monthly or yearly pay into every other period based on your working hours.'},
 'calorie-calculator':{title:'Calorie Calculator — Daily Calories & TDEE Online | ToolsKit',description:'Free calorie calculator. Estimate BMR, TDEE and daily calories for weight loss, maintenance or gain based on age, height, weight and activity.'},
 'water-intake-calculator':{title:'Water Intake Calculator — Daily Hydration Guide | ToolsKit',description:'Free water intake calculator. Estimate daily water needs from your weight, activity level and climate, in litres and glasses.'},
 'pace-calculator':{title:'Running Pace Calculator — Pace, Time & Distance | ToolsKit',description:'Free running pace calculator. Work out pace per km or mile, finish time or distance for 5K, 10K, half marathon and marathon goals.'},
 'heart-rate-zones':{title:'Heart Rate Zones Calculator — Training Zones Online | ToolsKit',description:'Free heart rate zones calculator. Estimate your maximum heart rate and five training zones using the standard or Karvonen method.'},
 'color-palette-generator':{title:'Color Palette Generator — Harmonious Color Schemes | ToolsKit',description:'Free color palette generator. Pick a base color and create complementary, analogous, triadic and monochrome palettes with HEX and RGB codes.'},
 'css-gradient-generator':{title:'CSS Gradient Generator — Linear & Radial Gradients | ToolsKit',description:'Free CSS gradient generator. Pick colors and angle, preview linear or radial gradients live and copy the CSS in one click.'},
 'box-shadow-generator':{title:'Box Shadow Generator — CSS Shadow Builder Online | ToolsKit',description:'Free CSS box-shadow generator. Adjust offset, blur, spread, color and opacity with a live preview and copy the CSS.'},
 'px-to-rem-converter':{title:'PX to REM Converter — Pixels to REM & EM Online | ToolsKit',description:'Free px to rem converter. Convert pixels to rem and em and back using any base font size, with a quick reference table.'},
 'image-to-base64':{title:'Image to Base64 Converter — Data URI Online | ToolsKit',description:'Free image to Base64 converter. Turn PNG, JPG, SVG or WebP files into a data URI and CSS or HTML snippet locally in your browser.'},
 'fancy-text-generator':{title:'Fancy Text Generator — Stylish Unicode Fonts | ToolsKit',description:'Free fancy text generator. Convert text into bold, italic, script, gothic, bubble and other Unicode styles and copy it anywhere.'},
 'bionic-reading-converter':{title:'Bionic Reading Converter — Read Faster Online | ToolsKit',description:'Free bionic reading converter. Bold the first letters of words to guide your eyes and make text easier to skim.'},
 'reading-time-calculator':{title:'Reading Time Calculator — Estimate Read & Speak Time | ToolsKit',description:'Free reading time calculator. Paste text to estimate silent reading time and speaking time at any words-per-minute pace.'},
 'readability-score-checker':{title:'Readability Score Checker — Flesch Reading Ease | ToolsKit',description:'Free readability checker. Get Flesch reading ease, Flesch-Kincaid grade level and sentence statistics for your text instantly.'},
 'keyword-density-checker':{title:'Keyword Density Checker — SEO Word Analysis Online | ToolsKit',description:'Free keyword density checker. See the most frequent words and two- and three-word phrases in your content with counts and percentages.'},
 'utm-link-builder':{title:'UTM Link Builder — Campaign URL Generator | ToolsKit',description:'Free UTM link builder. Add source, medium, campaign, term and content parameters to any URL and copy the tracking link.'},
 'time-zone-converter':{title:'Time Zone Converter — World Time Converter Online | ToolsKit',description:'Free time zone converter. Convert any date and time between cities and time zones, with daylight saving handled for you.'},
 'random-picker':{title:'Random Picker — Pick a Random Name or Item | ToolsKit',description:'Free random picker. Paste a list of names or options and draw one or more winners fairly with secure randomness.'},
 'dice-roller-coin-flip':{title:'Dice Roller & Coin Flip — Roll Dice Online | ToolsKit',description:'Free online dice roller and coin flip. Roll d4 to d100 dice in any quantity, or flip a coin, using secure randomness.'},
 'qr-code-generator':{title:'QR Code Generator — Free QR Codes, No Sign-up | ToolsKit',description:'Free QR code generator. Create QR codes for URLs, text and more, choose colors and error correction, and download PNG or SVG.'},
 'json-to-typescript':{title:'JSON to TypeScript — Generate Interfaces Online | ToolsKit',description:'Free JSON to TypeScript converter. Paste JSON and get typed interfaces for nested objects, arrays and optional fields instantly.'},
 'chmod-calculator':{title:'Chmod Calculator — Linux File Permissions Online | ToolsKit',description:'Free chmod calculator. Toggle read, write and execute for owner, group and others and get octal and symbolic permissions.'},
 'cidr-subnet-calculator':{title:'CIDR Subnet Calculator — IPv4 Subnet Online | ToolsKit',description:'Free CIDR subnet calculator. Enter an IPv4 address and prefix to get netmask, network, broadcast, first and last host and host count.'},
 'http-status-codes':{title:'HTTP Status Codes — Searchable Reference | ToolsKit',description:'Free HTTP status code reference. Search 1xx to 5xx codes with plain-English meanings and common causes.'},
 'random-string-generator':{title:'Random String Generator — Secure Tokens Online | ToolsKit',description:'Free random string generator. Create secure random strings, tokens and API-key style values with custom length and character sets.'},
 'hmac-generator':{title:'HMAC Generator — SHA-256 HMAC Online | ToolsKit',description:'Free HMAC generator. Create HMAC-SHA256, SHA-384 or SHA-512 signatures from a message and secret key in hex or Base64.'},
 'text-encryptor':{title:'Text Encryptor — AES-256 Encrypt & Decrypt Online | ToolsKit',description:'Free text encryptor. Encrypt and decrypt messages with a password using AES-GCM and PBKDF2, entirely in your browser.'},
 'file-checksum-calculator':{title:'File Checksum Calculator — SHA-256 of Any File | ToolsKit',description:'Free file checksum calculator. Compute SHA-1, SHA-256, SHA-384 and SHA-512 hashes of a file locally in your browser to verify downloads.'},
 'word-counter':{title:'Word Counter — Count Words & Characters Online | ToolsKit',description:'Free word counter to count words, characters, lines, sentences and reading time instantly in your browser.'},
 'character-counter':{title:'Character Counter — Count Characters Online | ToolsKit',description:'Count characters with and without spaces instantly. A fast free online character counter.'},
 'json-formatter':{title:'JSON Formatter — Beautify & Format JSON Online | ToolsKit',description:'Format and beautify JSON online with readable indentation. Fast browser-based JSON formatter.'},
 'json-validator':{title:'JSON Validator — Validate JSON Online | ToolsKit',description:'Validate JSON instantly in your browser and quickly find invalid JSON input.'},
 'json-minifier':{title:'JSON Minifier — Minify JSON Online | ToolsKit',description:'Minify JSON online by removing unnecessary whitespace. Fast and free browser-based JSON minifier.'},
 'base64':{title:'Base64 Encoder & Decoder — Online Tool | ToolsKit',description:'Encode or decode UTF-8 text with Base64 instantly. Fast browser-based Base64 encoder and decoder.'},
 'url-encoder':{title:'URL Encoder & Decoder — Encode URLs Online | ToolsKit',description:'Encode or decode URL components online with a fast browser-based URL encoder and decoder.'},
 'jwt-decoder':{title:'JWT Decoder — Decode JSON Web Tokens Online | ToolsKit',description:'Decode JWT headers and payloads locally in your browser. No server upload required.'},
 'regex-tester':{title:'Regex Tester — Test Regular Expressions Online | ToolsKit',description:'Test JavaScript regular expressions and inspect matches instantly with this free regex tester.'},
 'merge-pdf':{title:'Merge PDF — Combine PDF Files Online | ToolsKit',description:'Merge multiple PDF files into one PDF directly in your browser. Fast and private.'},
 'split-pdf':{title:'Split PDF — Extract PDF Pages Online | ToolsKit',description:'Split a PDF and extract selected pages directly in your browser with no required upload.'},
 'compress-pdf':{title:'Compress PDF — Reduce PDF Size Online | ToolsKit',description:'Compress PDF files in your browser with adjustable quality. Fast local PDF compression.'},
 'pdf-to-jpg':{title:'PDF to JPG — Convert PDF Pages to Images | ToolsKit',description:'Convert PDF pages to JPG images directly in your browser. Fast and private.'},
 'jpg-to-pdf':{title:'JPG to PDF — Convert Images to PDF Online | ToolsKit',description:'Combine JPG, PNG and WebP images into a PDF directly in your browser.'},
 'image-compressor':{title:'Image Compressor — Compress Images Online | ToolsKit',description:'Compress images online in your browser with adjustable quality. Fast, free and private.'},
 'image-resizer':{title:'Image Resizer — Resize Images Online | ToolsKit',description:'Resize images online while preserving aspect ratio. Process images directly in your browser.'},
 'image-converter':{title:'Image Converter — Convert Image Formats Online | ToolsKit',description:'Convert browser-supported image formats quickly and privately in your browser.'},
 'jpg-to-png':{title:'JPG to PNG Converter — Convert JPG to PNG Online | ToolsKit',description:'Convert JPG images to PNG online directly in your browser. Fast and free.'},
 'png-to-jpg':{title:'PNG to JPG Converter — Convert PNG to JPG Online | ToolsKit',description:'Convert PNG images to JPG online directly in your browser.'},
 'percentage-calculator':{title:'Percentage Calculator — Calculate Percentages Online | ToolsKit',description:'Calculate percentages and percentage change instantly with this free online percentage calculator.'},
 'discount-calculator':{title:'Discount Calculator — Calculate Sale Price & Savings | ToolsKit',description:'Calculate discounts, savings and final sale prices instantly with a free online calculator.'},
 'age-calculator':{title:'Age Calculator — Calculate Your Age Online | ToolsKit',description:'Calculate age from a birth date instantly with this free online age calculator.'},
 'date-calculator':{title:'Date Calculator — Calculate Days Between Dates | ToolsKit',description:'Calculate the number of days between two dates instantly with a free online date calculator.'},
 'unit-converter':{title:'Unit Converter — Convert Length, Weight, Temperature & Volume | ToolsKit',description:'Convert common units for length, weight, temperature and volume with a fast free online unit converter.'},
 'password-generator':{title:'Password Generator — Create Strong Passwords Online | ToolsKit',description:'Generate strong random passwords locally in your browser. Fast, free and private.'},
 'uuid-generator':{title:'UUID Generator — Generate UUID v4 Online | ToolsKit',description:'Generate cryptographically strong UUID v4 values instantly in your browser.'}
}

const seoByPath:Record<string,SeoData>={
 '/':defaults,
 '/tools':{title:'Free Online Tools & Utilities | ToolsKit',description:'Browse 206+ free browser-based tools for text, development, PDFs, images, calculations and security.'},
 '/developer-tools':{title:'Developer Tools — Free Online Tools for Developers | ToolsKit',description:'Free online developer tools for JSON, Base64, URLs, JWTs, regex, SQL, HTML, CSS, JavaScript, XML, Markdown, cron and UUID workflows.'},
 '/text-tools':{title:'Text Tools — Free Online Text Utilities | ToolsKit',description:'Free text tools for counting, cleaning, comparing, sorting, reversing and converting text in your browser.'},
 '/pdf-tools':{title:'PDF Tools — Free Browser-Based PDF Utilities | ToolsKit',description:'Merge, split, compress, rotate, extract, watermark and convert PDF files in your browser with ToolsKit.'},
 '/image-tools':{title:'Image Tools — Free Online Image Utilities | ToolsKit',description:'Compress, resize, crop and convert images locally in your browser with free ToolsKit image tools.'},
 '/calculator-tools':{title:'Online Calculators — Free Everyday Calculators | ToolsKit',description:'Free calculators for percentages, discounts, age, dates, loans, EMI, interest, tax, tips and unit conversion.'},
 '/security-tools':{title:'Security Tools — Free Browser-Based Security Helpers | ToolsKit',description:'Free password, hash, identifier and encoding utilities designed for quick browser-based technical workflows.'},
 '/finance-tools':{title:'Finance Tools — Free GST, ROI, SIP & Margin Calculators | ToolsKit',description:'Free finance calculators for GST and VAT, profit margin, ROI, SIP investment returns and salary conversion.'},
 '/health-tools':{title:'Health & Fitness Tools — Calorie, Pace & Heart Rate Calculators | ToolsKit',description:'Free health and fitness calculators for daily calories, water intake, running pace and heart rate zones.'},
 '/design-tools':{title:'Design Tools — Color Palette, CSS Gradient & Shadow Generators | ToolsKit',description:'Free design tools for color palettes, CSS gradients, box shadows, px to rem conversion and image to Base64.'},
 '/productivity-tools':{title:'Productivity Tools — QR Code, Time Zone & Random Picker | ToolsKit',description:'Free productivity tools: QR code generator, time zone converter, random name picker and dice roller.'},
 '/converter-tools':{title:'Unit Converters — Free Length, Weight, Temperature & Data Converters | ToolsKit',description:'Free unit converters for length, weight, temperature, area, volume, speed, data storage, pressure, energy and more.'},
 '/about':{title:'About ToolsKit — Free Browser Tools | ToolsKit',description:'Learn what ToolsKit is, how the toolkit is designed, and why browser-first utilities can make everyday tasks faster.'},
 '/contact':{title:'Contact ToolsKit — Support & Feedback | ToolsKit',description:'Contact ToolsKit with questions, feedback, corrections, suggestions, or partnership enquiries.'},
 '/privacy-policy':{title:'Privacy Policy | ToolsKit',description:'Read how ToolsKit handles information, local browser processing, storage, contact messages, and third-party services.'},
 '/terms-and-conditions':{title:'Terms & Conditions | ToolsKit',description:'Read the terms that apply when using the ToolsKit website and its browser-based utilities.'}
}

const buildFallback=(slug:string):SeoData=>{
 const t=tools.find(x=>x.id===slug)
 if(!t)return defaults
 return {
  title:`${t.name} — Free Online Tool | ToolsKit`,
  description:`${t.name}: ${t.description} Use it online with ToolsKit for a fast browser-based workflow without an account.`
 }
}

export const getSeoDataForPath=(path:string):SeoData=>{
 const normalized=normalizePath(path)
 const slug=normalized.startsWith('/tools/')?normalized.slice(7):''
 return slug?seoBySlug[slug]??buildFallback(slug):seoByPath[normalized]??defaults
}

export const normalizePath=(value:string)=>value.replace(/\/$/,'')||'/'
export const canonicalUrl=(path=typeof window==='undefined'?'/':window.location.pathname)=>`${base}${normalizePath(path)}`

function setMeta(selector:string,attribute:string,value:string){
 if(typeof document==='undefined')return
 let meta=document.querySelector<HTMLMetaElement>(selector)
 if(!meta){meta=document.createElement('meta');document.head.appendChild(meta)}
 meta.setAttribute(attribute,value)
}

function sync(){
 if(typeof document==='undefined')return
 const path=normalizePath(window.location.pathname)
 const data=getSeoDataForPath(path)
 const canonical=canonicalUrl(path)
 document.title=data.title
 setMeta('meta[name="description"]','content',data.description)
 setMeta('meta[property="og:title"]','content',data.title)
 setMeta('meta[property="og:description"]','content',data.description)
 setMeta('meta[property="og:type"]','content','website')
 setMeta('meta[property="og:url"]','content',canonical)
 setMeta('meta[property="og:image"]','content',`${base}/og-image.svg`)
 setMeta('meta[name="twitter:title"]','content',data.title)
 setMeta('meta[name="twitter:description"]','content',data.description)
 setMeta('meta[name="twitter:image"]','content',`${base}/og-image.svg`)
 const verification=typeof import.meta.env.VITE_GOOGLE_SITE_VERIFICATION==='string'?import.meta.env.VITE_GOOGLE_SITE_VERIFICATION.trim():''
 const oldVerification=document.querySelector('meta[name="google-site-verification"]')
 if(verification)setMeta('meta[name="google-site-verification"]','content',verification)
 else oldVerification?.remove()
 let link=document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
 if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link)}
 link.href=canonical
}

function syncGlobalStructuredData(path:string){
 if(typeof document==='undefined')return
 const id='toolskit-global-jsonld'
 const old=document.getElementById(id)
 old?.remove()
 if(path!=='/')return
 const popularIds=['word-counter','json-formatter','image-compressor','percentage-calculator','password-generator','merge-pdf','uuid-generator','base64']
 const json={'@context':'https://schema.org','@graph':[
  {'@type':'WebSite','@id':`${location.origin}/#website`,name:'ToolsKit',url:location.origin+'/',description:defaults.description},
  {'@type':'ItemList','@id':`${location.origin}/#popular-tools`,name:'Popular ToolsKit tools',itemListElement:popularIds.map((id,index)=>({
   '@type':'ListItem',
   position:index+1,
   name:tools.find(tool=>tool.id===id)?.name??id,
   url:`${location.origin}/tools/${id}`
  }))}
 ]}
 const script=document.createElement('script')
 script.id=id
 script.type='application/ld+json'
 script.textContent=JSON.stringify(json)
 document.head.appendChild(script)
}

if(typeof window!=='undefined'){
 const syncAll=()=>{
  const path=normalizePath(window.location.pathname)
  sync()
  syncGlobalStructuredData(path)
 }
 syncAll()
 window.addEventListener('popstate',syncAll)
}
