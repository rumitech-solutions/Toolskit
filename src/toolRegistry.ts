import type { Category, ToolDefinition } from './types'

export const tools: ToolDefinition[] = [
  // Text Tools (15 tools)
  { id: 'word-counter', name: 'Word Counter', description: 'Count words, characters, lines, sentences and reading time.', category: 'Text', keywords: ['count', 'words', 'text'], shortcuts: ['Cmd+Shift+W'] },
  { id: 'case-converter', name: 'Case Converter', description: 'Convert text to upper, lower, title, camel, or snake case.', category: 'Text', keywords: ['case', 'format'] },
  { id: 'slug-generator', name: 'Slug Generator', description: 'Convert text into clean, URL-friendly slugs.', category: 'Text', keywords: ['slug', 'url'] },
  { id: 'lorem-ipsum-generator', name: 'Lorem Ipsum Generator', description: 'Generate placeholder Lorem Ipsum paragraphs.', category: 'Text', keywords: ['lorem', 'placeholder'] },
  { id: 'find-replace', name: 'Find & Replace', description: 'Find and replace text with regex support.', category: 'Text', keywords: ['find', 'replace', 'regex'] },
  { id: 'word-frequency-counter', name: 'Word Frequency', description: 'Count and rank word occurrences.', category: 'Text', keywords: ['frequency', 'words'] },
  { id: 'html-tag-remover', name: 'HTML Tag Remover', description: 'Strip HTML tags and return plain text.', category: 'Text', keywords: ['html', 'strip'] },
  { id: 'duplicate-lines', name: 'Remove Duplicates', description: 'Remove repeated lines from text.', category: 'Text', keywords: ['duplicate', 'unique'] },
  { id: 'text-sorter', name: 'Text Sorter', description: 'Sort lines in ascending or descending order.', category: 'Text', keywords: ['sort', 'order'] },
  { id: 'text-reverser', name: 'Text Reverser', description: 'Reverse text character by character.', category: 'Text', keywords: ['reverse'] },
  { id: 'line-break-remover', name: 'Line Break Remover', description: 'Convert multiline text into paragraphs.', category: 'Text', keywords: ['newlines', 'break'] },
  { id: 'extra-spaces', name: 'Remove Extra Spaces', description: 'Normalize repeated spaces and whitespace.', category: 'Text', keywords: ['spaces', 'clean'] },
  { id: 'text-diff', name: 'Text Diff', description: 'Compare two texts line by line.', category: 'Text', keywords: ['diff', 'compare'] },
  { id: 'character-counter', name: 'Character Counter', description: 'Count characters with and without spaces.', category: 'Text', keywords: ['characters'] },
  { id: 'sentence-counter', name: 'Sentence Counter', description: 'Count sentences in text.', category: 'Text', keywords: ['sentences'] },

  // Developer Tools (23 tools)
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Beautify and validate JSON with indentation.', category: 'Developer', keywords: ['json', 'format'], shortcuts: ['Cmd+Shift+J'] },
  { id: 'json-validator', name: 'JSON Validator', description: 'Validate JSON syntax locally.', category: 'Developer', keywords: ['json', 'validate'] },
  { id: 'json-minifier', name: 'JSON Minifier', description: 'Remove JSON whitespace for compact payloads.', category: 'Developer', keywords: ['json', 'compress'] },
  { id: 'csv-to-json', name: 'CSV to JSON', description: 'Convert CSV data with headers into JSON array.', category: 'Developer', keywords: ['csv', 'json', 'convert'] },
  { id: 'json-csv', name: 'JSON to CSV', description: 'Convert a JSON array of objects into CSV data.', category: 'Developer', keywords: ['json', 'csv', 'convert', 'export'] },
  { id: 'json-yaml', name: 'JSON to YAML', description: 'Convert JSON data into readable YAML.', category: 'Developer', keywords: ['json', 'yaml', 'convert'] },
  { id: 'base64', name: 'Base64 Encoder/Decoder', description: 'Encode or decode UTF-8 text as Base64.', category: 'Developer', keywords: ['base64', 'encode', 'decode'] },
  { id: 'url-encoder', name: 'URL Encoder/Decoder', description: 'Encode or decode URL components.', category: 'Developer', keywords: ['url', 'encode'] },
  { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode JWT header and payload.', category: 'Developer', keywords: ['jwt', 'token', 'decode'] },
  { id: 'regex-tester', name: 'Regex Tester', description: 'Test JavaScript regex patterns.', category: 'Developer', keywords: ['regex', 'pattern'] },
  { id: 'sql-formatter', name: 'SQL Formatter', description: 'Format SQL queries with proper indentation.', category: 'Developer', keywords: ['sql', 'format'] },
  { id: 'html-formatter', name: 'HTML Formatter', description: 'Format HTML markup locally.', category: 'Developer', keywords: ['html', 'format'] },
  { id: 'css-formatter', name: 'CSS Formatter', description: 'Format CSS declarations.', category: 'Developer', keywords: ['css', 'format'] },
  { id: 'javascript-formatter', name: 'JavaScript Formatter', description: 'Format JavaScript code with indentation.', category: 'Developer', keywords: ['javascript', 'js', 'format'] },
  { id: 'xml-formatter', name: 'XML Formatter', description: 'Format XML markup.', category: 'Developer', keywords: ['xml', 'format'] },
  { id: 'markdown-previewer', name: 'Markdown Previewer', description: 'Preview Markdown syntax safely.', category: 'Developer', keywords: ['markdown', 'md'] },
  { id: 'cron-generator', name: 'Cron Generator', description: 'Generate cron expressions from presets.', category: 'Developer', keywords: ['cron', 'schedule'] },
  { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate UUID v4 values.', category: 'Developer', keywords: ['uuid', 'id'] },
  { id: 'number-base-converter', name: 'Number Base Converter', description: 'Convert between binary, octal, decimal, hex.', category: 'Developer', keywords: ['binary', 'hex', 'convert'] },
  { id: 'timestamp-converter', name: 'Timestamp Converter', description: 'Convert Unix timestamps to readable dates.', category: 'Developer', keywords: ['timestamp', 'unix', 'date'] },
  { id: 'color-converter', name: 'Color Converter', description: 'Convert between HEX, RGB, HSL colors.', category: 'Developer', keywords: ['color', 'hex', 'rgb'] },
  { id: 'text-to-binary', name: 'Text to Binary', description: 'Convert text to binary representation.', category: 'Developer', keywords: ['binary', 'text'] },
  { id: 'color-contrast-checker', name: 'Color Contrast Checker', description: 'Check WCAG color contrast ratios.', category: 'Developer', keywords: ['contrast', 'accessibility', 'wcag'] },

  // PDF Tools (10 tools)
  { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDF files locally in your browser.', category: 'PDF', keywords: ['pdf', 'merge'], file: true },
  { id: 'split-pdf', name: 'Split PDF', description: 'Extract specific PDF pages locally in your browser.', category: 'PDF', keywords: ['pdf', 'split'], file: true },
  { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce PDF file size locally in your browser.', category: 'PDF', keywords: ['pdf', 'compress'], file: true },
  { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate PDF pages locally in your browser by 90/180/270 degrees.', category: 'PDF', keywords: ['pdf', 'rotate'], file: true },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF pages to JPG images locally in your browser.', category: 'PDF', keywords: ['pdf', 'jpg', 'convert'], file: true },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Combine images into a PDF locally in your browser.', category: 'PDF', keywords: ['pdf', 'jpg', 'image'], file: true },
  { id: 'extract-pdf-pages', name: 'Extract PDF Pages', description: 'Extract a page range from PDF locally in your browser.', category: 'PDF', keywords: ['pdf', 'extract'], file: true },
  { id: 'delete-pdf-pages', name: 'Delete PDF Pages', description: 'Remove specific PDF pages locally in your browser.', category: 'PDF', keywords: ['pdf', 'delete'], file: true },
  { id: 'reorder-pdf-pages', name: 'Reorder PDF Pages', description: 'Rearrange PDF pages in custom order locally in your browser.', category: 'PDF', keywords: ['pdf', 'reorder'], file: true },
  { id: 'watermark-pdf', name: 'Add PDF Watermark', description: 'Add text watermark to PDF pages locally in your browser.', category: 'PDF', keywords: ['pdf', 'watermark'], file: true },

  // Image Tools (10 tools)
  { id: 'image-compressor', name: 'Image Compressor', description: 'Compress images locally in your browser with quality control.', category: 'Image', keywords: ['image', 'compress'], file: true },
  { id: 'image-resizer', name: 'Image Resizer', description: 'Resize images locally in your browser while preserving aspect ratio.', category: 'Image', keywords: ['image', 'resize'], file: true },
  { id: 'image-cropper', name: 'Image Cropper', description: 'Crop images locally in your browser with x/y/width/height controls.', category: 'Image', keywords: ['image', 'crop'], file: true },
  { id: 'image-converter', name: 'Image Converter', description: 'Convert images locally in your browser between formats.', category: 'Image', keywords: ['image', 'convert'], file: true },
  { id: 'jpg-to-png', name: 'JPG to PNG', description: 'Convert JPG images locally in your browser to PNG.', category: 'Image', keywords: ['jpg', 'png', 'convert'], file: true },
  { id: 'png-to-jpg', name: 'PNG to JPG', description: 'Convert PNG images locally in your browser to JPG.', category: 'Image', keywords: ['png', 'jpg', 'convert'], file: true },
  { id: 'webp-to-jpg', name: 'WebP to JPG', description: 'Convert WebP images locally in your browser to JPG.', category: 'Image', keywords: ['webp', 'jpg'], file: true },
  { id: 'jpg-to-webp', name: 'JPG to WebP', description: 'Convert JPG images locally in your browser to WebP.', category: 'Image', keywords: ['jpg', 'webp'], file: true },
  { id: 'png-to-webp', name: 'PNG to WebP', description: 'Convert PNG images locally in your browser to WebP.', category: 'Image', keywords: ['png', 'webp'], file: true },
  { id: 'image-metadata', name: 'Image Metadata', description: 'View image dimensions and file metadata locally in your browser.', category: 'Image', keywords: ['image', 'metadata'], file: true },

  // Calculator Tools (14 tools)
  { id: 'percentage-calculator', name: 'Percentage Calculator', description: 'Calculate percentages and percentage changes.', category: 'Calculators', keywords: ['percent', 'calculate'] },
  { id: 'discount-calculator', name: 'Discount Calculator', description: 'Calculate sale prices and discounts.', category: 'Calculators', keywords: ['discount', 'sale'] },
  { id: 'age-calculator', name: 'Age Calculator', description: 'Calculate age from birth date.', category: 'Calculators', keywords: ['age', 'birthday'] },
  { id: 'date-calculator', name: 'Date Calculator', description: 'Calculate days between dates.', category: 'Calculators', keywords: ['date', 'days'] },
  { id: 'time-calculator', name: 'Time Calculator', description: 'Convert and calculate time values.', category: 'Calculators', keywords: ['time', 'convert'] },
  { id: 'bmi-calculator', name: 'BMI Calculator', description: 'Calculate body mass index.', category: 'Calculators', keywords: ['bmi', 'health'] },
  { id: 'loan-calculator', name: 'Loan Calculator', description: 'Calculate monthly loan payments.', category: 'Calculators', keywords: ['loan', 'payment'] },
  { id: 'emi-calculator', name: 'EMI Calculator', description: 'Calculate equated monthly installment.', category: 'Calculators', keywords: ['emi', 'loan'] },
  { id: 'compound-interest', name: 'Compound Interest', description: 'Calculate compound interest over time.', category: 'Calculators', keywords: ['interest', 'compound'] },
  { id: 'tax-calculator', name: 'Tax Calculator', description: 'Calculate GST and taxes.', category: 'Calculators', keywords: ['tax', 'gst'] },
  { id: 'unit-converter', name: 'Unit Converter', description: 'Convert length, weight, temperature, volume.', category: 'Calculators', keywords: ['unit', 'convert'] },
  { id: 'simple-interest-calculator', name: 'Simple Interest Calculator', description: 'Calculate simple interest over time.', category: 'Calculators', keywords: ['interest', 'simple'] },
  { id: 'tip-calculator', name: 'Tip Calculator', description: 'Calculate tips and split the bill per person.', category: 'Calculators', keywords: ['tip', 'bill', 'split'] },
  { id: 'countdown-calculator', name: 'Countdown Calculator', description: 'Calculate days remaining until a target date.', category: 'Calculators', keywords: ['countdown', 'days', 'date'] },

  // Security Tools (7 tools)
  { id: 'password-generator', name: 'Password Generator', description: 'Generate strong random passwords.', category: 'Security', keywords: ['password', 'generate'], shortcuts: ['Cmd+Shift+P'] },
  { id: 'sha-256', name: 'SHA-256 Generator', description: 'Hash text with SHA-256.', category: 'Security', keywords: ['hash', 'sha256'] },
  { id: 'sha-512', name: 'SHA-512 Generator', description: 'Hash text with SHA-512.', category: 'Security', keywords: ['hash', 'sha512'] },
  { id: 'md5', name: 'MD5 Generator', description: 'Generate MD5 digest.', category: 'Security', keywords: ['hash', 'md5'] },
  { id: 'html-encoder', name: 'HTML Encoder', description: 'Encode HTML special characters.', category: 'Security', keywords: ['html', 'encode'] },
  { id: 'html-decoder', name: 'HTML Decoder', description: 'Decode common HTML entities.', category: 'Security', keywords: ['html', 'decode'] },
  { id: 'random-number-generator', name: 'Random Number Generator', description: 'Generate random numbers in a range.', category: 'Security', keywords: ['random', 'number'] },

  // Expansion pack: Text Tools (+6)
  { id: 'palindrome-checker', name: 'Palindrome Checker', description: 'Check whether text reads the same backwards.', category: 'Text', keywords: ['palindrome', 'check'] },
  { id: 'remove-punctuation', name: 'Remove Punctuation', description: 'Strip punctuation marks from text.', category: 'Text', keywords: ['punctuation', 'clean'] },
  { id: 'remove-numbers', name: 'Remove Numbers', description: 'Strip all digits from text.', category: 'Text', keywords: ['numbers', 'digits', 'remove'] },
  { id: 'vowel-consonant-counter', name: 'Vowel & Consonant Counter', description: 'Count vowels and consonants in text.', category: 'Text', keywords: ['vowels', 'consonants', 'count'] },
  { id: 'shuffle-lines', name: 'Shuffle Lines', description: 'Randomly shuffle the order of lines.', category: 'Text', keywords: ['shuffle', 'random', 'lines'] },
  { id: 'text-truncator', name: 'Text Truncator', description: 'Trim text to a maximum length with an ellipsis.', category: 'Text', keywords: ['truncate', 'trim', 'shorten'] },

  // Expansion pack: Developer Tools (+6)
  { id: 'base32', name: 'Base32 Encoder/Decoder', description: 'Encode or decode text as Base32.', category: 'Developer', keywords: ['base32', 'encode', 'decode'] },
  { id: 'hex-text-converter', name: 'Hex ↔ Text Converter', description: 'Convert text to hex bytes and back.', category: 'Developer', keywords: ['hex', 'text', 'convert'] },
  { id: 'css-minifier', name: 'CSS Minifier', description: 'Remove comments and whitespace from CSS.', category: 'Developer', keywords: ['css', 'minify'] },
  { id: 'html-minifier', name: 'HTML Minifier', description: 'Remove comments and extra whitespace from HTML.', category: 'Developer', keywords: ['html', 'minify'] },
  { id: 'query-string-parser', name: 'Query String Parser', description: 'Parse a URL query string into JSON.', category: 'Developer', keywords: ['query', 'url', 'parse'] },
  { id: 'markdown-table-generator', name: 'Markdown Table Generator', description: 'Convert CSV data into a Markdown table.', category: 'Developer', keywords: ['markdown', 'table', 'csv'] },

  // Expansion pack: Security Tools (+6)
  { id: 'rot13-cipher', name: 'ROT13 Cipher', description: 'Encode or decode text with the ROT13 cipher.', category: 'Security', keywords: ['rot13', 'cipher'] },
  { id: 'caesar-cipher', name: 'Caesar Cipher', description: 'Shift letters to encode or decode text.', category: 'Security', keywords: ['caesar', 'cipher', 'shift'] },
  { id: 'password-strength-checker', name: 'Password Strength Checker', description: 'Check password strength and get suggestions.', category: 'Security', keywords: ['password', 'strength'] },
  { id: 'morse-code-translator', name: 'Morse Code Translator', description: 'Translate text to Morse code and back.', category: 'Security', keywords: ['morse', 'code'] },
  { id: 'nato-alphabet-converter', name: 'NATO Phonetic Alphabet', description: 'Convert text into the NATO phonetic alphabet.', category: 'Security', keywords: ['nato', 'phonetic', 'alphabet'] },
  { id: 'sha-1', name: 'SHA-1 Generator', description: 'Generate a SHA-1 hash of text.', category: 'Security', keywords: ['hash', 'sha1', 'sha-1'] },

  // Expansion pack: Calculators (+7)
  { id: 'percentage-change-calculator', name: 'Percentage Change Calculator', description: 'Calculate percentage increase or decrease.', category: 'Calculators', keywords: ['percentage', 'change'] },
  { id: 'gcd-lcm-calculator', name: 'GCD & LCM Calculator', description: 'Find the greatest common divisor and least common multiple.', category: 'Calculators', keywords: ['gcd', 'lcm', 'factor'] },
  { id: 'prime-checker', name: 'Prime Number Checker', description: 'Check whether a number is prime.', category: 'Calculators', keywords: ['prime', 'number'] },
  { id: 'factorial-calculator', name: 'Factorial Calculator', description: 'Calculate the factorial of a number exactly.', category: 'Calculators', keywords: ['factorial'] },
  { id: 'roman-numeral-converter', name: 'Roman Numeral Converter', description: 'Convert between numbers and Roman numerals.', category: 'Calculators', keywords: ['roman', 'numeral'] },
  { id: 'statistics-calculator', name: 'Statistics Calculator', description: 'Get mean, median, mode and standard deviation.', category: 'Calculators', keywords: ['statistics', 'mean', 'median'] },
  { id: 'aspect-ratio-calculator', name: 'Aspect Ratio Calculator', description: 'Simplify width and height into a ratio.', category: 'Calculators', keywords: ['aspect', 'ratio'] },

  // Expansion pack: PDF Tools (+1)
  { id: 'pdf-page-counter', name: 'PDF Page Counter', description: 'Count the number of pages in a PDF locally in your browser.', category: 'PDF', keywords: ['pdf', 'pages', 'count'], file: true },
]

export const categories: Category[] = [
  'All',
  'Text',
  'Developer',
  'PDF',
  'Image',
  'Calculators',
  'Security',
]

export const getTool = (id: string): ToolDefinition | undefined => {
  return tools.find((t) => t.id === id)
}

export const getToolsByCategory = (category: Category): ToolDefinition[] => {
  if (category === 'All') return tools
  return tools.filter((t) => t.category === category)
}
