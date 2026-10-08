# 🧰 ToolsKit

**ToolsKit** is a fast, modern collection of free web utilities for everyday work, development, documents, images, calculations, and security-related tasks.

The project is built around a simple idea: **find a tool, do the job, get the result — without unnecessary complexity.**

🌐 Website: https://toolskit.sbs  
💻 Repository: https://github.com/rumitech-solutions/Toolskit

## ✨ Highlights

- 🚀 **137 useful tools** organized into ten focused categories (Text, Developer, PDF, Image, Calculators, Security, Finance, Health, Design, Productivity)
- 🧩 **Text utilities** for counting, cleaning, sorting, comparing, and transforming text
- 👨‍💻 **Developer tools** for JSON, Base64, URLs, JWTs, regex, SQL, HTML, CSS, JavaScript, XML, Markdown, UUIDs, cron, and more
- 📄 **PDF tools** for merging, splitting, extracting, deleting, reordering, rotating, compressing, watermarking, and PDF/image conversion
- 🖼️ **Image tools** for compression, resizing, cropping, format conversion, and metadata inspection
- 🧮 **Calculators** for percentages, discounts, dates, age, time, loans, EMI, interest, tax, tips, countdowns, and unit conversion
- 🔐 **Security helpers** for password generation, hashing, HTML encoding/decoding, and random-number utilities
- 🌐 **Browser-first processing** for supported file tools, helping keep local file workflows close to the user's device
- 📱 **Responsive UI** designed for desktop, tablet, and mobile screens
- 🔎 **Tool search** for quickly finding utilities by name, category, and keywords
- ⌨️ **Command palette** (`Ctrl/Cmd + K`), favorites, and recently used tools
- 🔗 **Related-tool workflows** that link tools commonly used together
- 🌗 **Dark mode**, an install prompt, and service-worker caching (production builds)
- 🧭 **Shared navigation and footer** across public pages for a consistent experience
- ⚡ **Vite + React** frontend with TypeScript and production-oriented build checks
- 🧪 **Automated tests** with Vitest for important utility functions and registry integrity
- 🗺️ **SEO-ready structure** with dedicated tool/category URLs, metadata, and sitemap generation
- ☁️ **Cloudflare Pages friendly** deployment setup with SPA routing and security/cache headers

## 📚 Tool Categories

### 📝 Text Tools (21)

- Word Counter
- Case Converter
- Slug Generator
- Lorem Ipsum Generator
- Find & Replace
- Word Frequency
- HTML Tag Remover
- Remove Duplicates
- Text Sorter
- Text Reverser
- Line Break Remover
- Remove Extra Spaces
- Text Diff
- Character Counter
- Sentence Counter
- Palindrome Checker
- Remove Punctuation
- Remove Numbers
- Vowel & Consonant Counter
- Shuffle Lines
- Text Truncator

### 👨‍💻 Developer Tools (29)

- JSON Formatter
- JSON Validator
- JSON Minifier
- CSV to JSON
- JSON to CSV
- JSON to YAML
- Base64 Encoder/Decoder
- URL Encoder/Decoder
- JWT Decoder
- Regex Tester
- SQL Formatter
- HTML Formatter
- CSS Formatter
- JavaScript Formatter
- XML Formatter
- Markdown Previewer
- Cron Generator
- UUID Generator
- Number Base Converter
- Timestamp Converter
- Color Converter
- Text to Binary
- Color Contrast Checker
- Base32 Encoder/Decoder
- Hex ↔ Text Converter
- CSS Minifier
- HTML Minifier
- Query String Parser
- Markdown Table Generator

### 📄 PDF Tools (11)

- Merge PDF
- Split PDF
- Compress PDF
- Rotate PDF
- PDF to JPG
- JPG to PDF
- Extract PDF Pages
- Delete PDF Pages
- Reorder PDF Pages
- Add PDF Watermark
- PDF Page Counter

### 🖼️ Image Tools (10)

- Image Compressor
- Image Resizer
- Image Cropper
- Image Converter
- JPG to PNG
- PNG to JPG
- WebP to JPG
- JPG to WebP
- PNG to WebP
- Image Metadata

### 🧮 Calculator Tools (21)

- Percentage Calculator
- Discount Calculator
- Age Calculator
- Date Calculator
- Time Calculator
- BMI Calculator
- Loan Calculator
- EMI Calculator
- Compound Interest
- Tax Calculator
- Unit Converter
- Simple Interest Calculator
- Tip Calculator
- Countdown Calculator
- Percentage Change Calculator
- GCD & LCM Calculator
- Prime Number Checker
- Factorial Calculator
- Roman Numeral Converter
- Statistics Calculator
- Aspect Ratio Calculator

### 💼 Finance, Health, Design & Productivity (new)
GST/VAT, profit margin, ROI, SIP and salary calculators; calorie, water, running-pace and heart-rate-zone calculators; color palette, CSS gradient, box-shadow, px↔rem and image→Base64; QR code generator, time zone converter, random picker and dice roller. Plus new Text (fancy text, bionic reading, reading time, readability, keyword density), Developer (JSON→TypeScript, chmod, CIDR, HTTP status codes, UTM builder) and Security (random string, HMAC, AES text encryptor, file checksum) tools. They are config-driven: see `src/extras/`.

### 🔐 Security Tools (13)

- Password Generator
- SHA-256 Generator
- SHA-512 Generator
- MD5 Generator
- HTML Encoder
- HTML Decoder
- Random Number Generator
- ROT13 Cipher
- Caesar Cipher
- Password Strength Checker
- Morse Code Translator
- NATO Phonetic Alphabet
- SHA-1 Generator

The tool registry in `src/toolRegistry.ts` is the source of truth for the full list.

## 🔒 Privacy & Local Processing

ToolsKit is designed to use browser-side processing where the tool supports it. File utilities marked as local/browser tools are intended to process selected content directly in the browser instead of requiring a dedicated upload-processing service.

For important or sensitive work, users should still review the behavior of the specific tool and avoid submitting secrets, credentials, API keys, or confidential information unnecessarily.

## 🛠️ Tech Stack

- ⚛️ **React 19**
- 📘 **TypeScript 5**
- ⚡ **Vite 8**
- 🧪 **Vitest** + JSDOM
- 📑 **pdf-lib** for PDF manipulation
- 🖥️ **pdfjs-dist** for PDF rendering workflows
- 📦 **JSZip** for packaged downloadable results
- ☁️ **Cloudflare Pages** for deployment

## 📁 Project Structure

```text
Toolskit/
├── public/              # Static files: sitemap, headers (CSP/cache), service worker, SPA fallback
├── scripts/             # Build-time scripts (sitemap generation, Cloudflare cleanup)
├── src/
│   ├── main.tsx         # Entry: page selection, CSS import order, service worker registration
│   ├── App.tsx          # Tool workspace (tool state and execution)
│   ├── toolRegistry.ts  # Tool definitions and categories (source of truth)
│   ├── tools.ts         # Text/developer/security/calculator utility functions
│   ├── pdfTools.ts      # PDF processing helpers
│   ├── imageTools.ts    # Image processing helpers
│   ├── resourceLimits.ts# Browser file-size, page and pixel limits
│   ├── SiteChrome.tsx   # Shared header, footer, navigation, dark mode
│   ├── SitePage.tsx     # About, contact, legal and category pages
│   ├── ToolsLanding.tsx # /tools catalog page
│   ├── seo.ts, toolSeo.ts, SeoContent.tsx  # Metadata and per-tool SEO content
│   ├── siteNavigation.ts# Navigation and public page content
│   ├── workflows.ts     # Related-tool workflows
│   ├── types.ts         # Shared TypeScript types
│   ├── __tests__/       # Additional Vitest suites
│   └── *.css            # Layered stylesheets
├── tests/               # Vitest suites
├── docs/                # Launch checklist, AI coding reference, historical plans
├── AGENTS.md            # Instructions for AI coding agents
├── CLAUDE.md            # Claude Code additions (imports AGENTS.md)
├── wrangler.jsonc       # Static-assets deployment config (./dist, SPA fallback)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Getting Started

### Requirements

- Node.js 22 (the version used in CI)
- npm

### Install

```bash
npm ci
```

### Start the development server

```bash
npm run dev
```

### Type-check

```bash
npm run typecheck
```

### Run tests

```bash
npm test
```

### Production build

```bash
npm run build
```

The build regenerates `public/sitemap.xml` (`prebuild`), runs the TypeScript check, builds with Vite, and removes a stale `dist/_redirects` file (`postbuild`). Preview the result with `npm run preview`.

There is no lint script; CI runs tests, a production dependency audit, the type check, and the build on every push and pull request to `master`.

### Configuration

All variables are optional, are read at build time, and are listed in `.env.example`. Leave them blank until the matching Google account is ready, and never commit real values.

| Variable | Purpose |
| -------- | ------- |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID (`G-...`) |
| `VITE_ADSENSE_CLIENT` | AdSense publisher client (`ca-pub-...`) |
| `VITE_ADSENSE_SLOT_AFTER_CONTENT` | Optional manual ad-unit slot ID |
| `VITE_GOOGLE_SITE_VERIFICATION` | Optional Search Console verification value |

## 🔎 SEO & Discoverability

ToolsKit is structured so individual utilities can be discovered through dedicated routes and metadata rather than relying only on the homepage.

Current SEO-oriented features include:

- 🏷️ Unique tool-page titles and descriptions
- 🔗 Dedicated tool URLs such as `/tools/json-formatter`
- 🗺️ Automated sitemap generation
- 📄 Public category pages for major tool groups
- 🧭 Consistent internal navigation and footer links
- 📱 Responsive pages for mobile visitors
- ⚡ Static asset caching and basic security headers
- 🚫 SPA fallback support for deep links on Cloudflare Pages

## ☁️ Deployment

ToolsKit is a static site and is suitable for deployment on **Cloudflare Pages**.

Recommended settings:

```text
Framework preset: Vite
Build command: npm run build
Output directory: dist
```

`wrangler.jsonc` serves `./dist` with single-page-app fallback for deep links, and `public/_headers` sets cache rules, security headers, and the Content-Security-Policy. Any new third-party host must be added to that policy. Set the optional `VITE_*` variables in the hosting environment before building. See `docs/LAUNCH-CHECKLIST.md` for the launch steps.

## 🧪 Testing

The Vitest suites in `tests/` and `src/__tests__/` (73 tests) cover:

- ✅ Text, developer, security, and calculator utility functions
- ✅ JSON, Base64, URL, CSV/YAML conversion, regex, and hashing helpers
- ✅ Browser file, image, and PDF resource limits
- ✅ Tool registry integrity: categories, unique IDs, and local-processing metadata for file tools
- ✅ SEO routes: unique titles and descriptions, canonical URLs, and a sitemap URL for every tool
- ✅ Navigation, public information pages, workflows, branding, and analytics/ads ID validation

Run the suite with:

```bash
npm test
```

## 🎯 Project Goals

ToolsKit is being developed with a long-term focus on:

- 💡 Adding genuinely useful tools instead of unnecessary features
- 🎨 Keeping the interface clean, consistent, and easy to understand
- 📱 Making every important workflow work well on smaller screens
- ⚡ Keeping common tasks fast and lightweight
- 🔐 Favoring privacy-conscious, browser-side workflows where practical
- 🔎 Growing organic traffic through useful pages, strong metadata, and discoverable tools
- 🧹 Maintaining a reliable codebase with tests and production build checks

## 🤖 AI-Assisted Development

Instructions for AI coding agents (ChatGPT, Claude, Claude Code) live in the repository:

- [`AGENTS.md`](AGENTS.md): architecture, commands, conventions, and the safe-change workflow
- [`CLAUDE.md`](CLAUDE.md): Claude Code additions (imports `AGENTS.md`)
- [`docs/AI-CODING.md`](docs/AI-CODING.md): search patterns and recipes, such as adding a tool

## 🤝 Contributing

Ideas, bug reports, corrections, and useful feature suggestions are welcome.

Before opening a change, please keep the existing architecture and UI patterns consistent, avoid unnecessary dependencies, and run `npm test`, `npm run typecheck`, and `npm run build` locally. `docs/AI-CODING.md` also documents how to add a tool.

## 📌 Status

🚧 **Active development / preparing for public launch**

The project is being polished toward a production release, including build stability, UI consistency, SEO, deployment configuration, and future monetization readiness.

## 📄 License

Add the project's chosen license here before publishing the repository as an open-source project.

---

Built with ❤️ by **RumiTech Solutions**.
