# 🧰 ToolsKit

**ToolsKit** is a fast, modern collection of free web utilities for everyday work, development, documents, images, calculations, and security-related tasks.

The project is built around a simple idea: **find a tool, do the job, get the result — without unnecessary complexity.**

🌐 Website: https://toolskit.sbs  
💻 Repository: https://github.com/rumitech-solutions/Toolskit

## ✨ Highlights

- 🚀 **75+ useful tools** organized into focused categories
- 🧩 **Text utilities** for counting, cleaning, sorting, comparing, and transforming text
- 👨‍💻 **Developer tools** for JSON, Base64, URLs, JWTs, regex, SQL, HTML, CSS, JavaScript, XML, Markdown, UUIDs, cron, and more
- 📄 **PDF tools** for merging, splitting, extracting, deleting, reordering, rotating, compressing, watermarking, and PDF/image conversion
- 🖼️ **Image tools** for compression, resizing, cropping, format conversion, and metadata inspection
- 🧮 **Calculators** for percentages, discounts, dates, age, time, loans, EMI, interest, tax, tips, countdowns, and unit conversion
- 🔐 **Security helpers** for password generation, hashing, HTML encoding/decoding, and random-number utilities
- 🌐 **Browser-first processing** for supported file tools, helping keep local file workflows close to the user's device
- 📱 **Responsive UI** designed for desktop, tablet, and mobile screens
- 🔎 **Tool search** for quickly finding utilities by name, category, and keywords
- 🧭 **Shared navigation and footer** across public pages for a consistent experience
- ⚡ **Vite + React** frontend with TypeScript and production-oriented build checks
- 🧪 **Automated tests** with Vitest for important utility functions and registry integrity
- 🗺️ **SEO-ready structure** with dedicated tool/category URLs, metadata, and sitemap generation
- ☁️ **Cloudflare Pages friendly** deployment setup with SPA routing and security/cache headers

## 📚 Tool Categories

### 📝 Text Tools

- Word Counter
- Case Converter
- Slug Generator
- Lorem Ipsum Generator
- Find & Replace
- Word Frequency
- HTML Tag Remover
- Remove Duplicate Lines
- Text Sorter
- Text Reverser
- Line Break Remover
- Remove Extra Spaces
- Text Diff
- Character Counter
- Sentence Counter

### 👨‍💻 Developer Tools

- JSON Formatter
- JSON Validator
- JSON Minifier
- CSV to JSON
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

### 📄 PDF Tools

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

### 🖼️ Image Tools

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

### 🧮 Calculator Tools

- Percentage Calculator
- Discount Calculator
- Age Calculator
- Date Calculator
- Time Calculator
- BMI Calculator
- Loan Calculator
- EMI Calculator
- Compound Interest Calculator
- Tax Calculator
- Unit Converter
- Simple Interest Calculator
- Tip Calculator
- Countdown Calculator

### 🔐 Security Tools

- Password Generator
- SHA-256 Generator
- SHA-512 Generator
- MD5 Generator
- HTML Encoder
- HTML Decoder
- Random Number Generator

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
├── public/              # Static files, sitemap, headers, SPA fallback
├── scripts/             # Build-time utilities such as sitemap generation
├── src/
│   ├── App.tsx          # Main application/tool workspace
│   ├── SiteChrome.tsx   # Shared header, footer, navigation, search
│   ├── Icons.tsx        # Shared icon and social components
│   ├── toolRegistry.ts  # Tool definitions and categories
│   ├── tools.ts         # Text/developer/security utility functions
│   ├── pdfTools.ts      # PDF processing helpers
│   ├── imageTools.ts    # Image processing helpers
│   ├── seo.ts           # Dynamic SEO metadata
│   ├── siteNavigation.ts# Public pages/navigation content
│   ├── types.ts         # Shared TypeScript types
│   └── ...              # UI, hooks, styles, and supporting modules
├── tests/               # Automated tests
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Getting Started

### Requirements

- Node.js 20+ recommended
- npm 10+

### Install

```bash
npm install
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

The production build runs the TypeScript check before the Vite build and also generates the sitemap during the `prebuild` step.

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

ToolsKit is suitable for deployment on **Cloudflare Pages**.

Recommended settings:

```text
Framework preset: Vite
Build command: npm run build
Output directory: dist
```

The repository includes the supporting public files needed for SPA-style deep links and static asset handling.

## 🧪 Testing

The project includes automated tests covering core utilities and registry behavior, including:

- ✅ Text counting and transformation helpers
- ✅ JSON formatting/validation/minification
- ✅ Base64 and URL encoding/decoding
- ✅ JSON-to-CSV/YAML conversion
- ✅ Regex behavior
- ✅ Hashing helpers such as MD5
- ✅ Security random-index behavior
- ✅ Calculator functions
- ✅ Tool registry categories, unique IDs, and file-tool metadata

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

## 🤝 Contributing

Ideas, bug reports, corrections, and useful feature suggestions are welcome.

Before opening a change, please keep the existing architecture and UI patterns consistent, avoid unnecessary dependencies, and run the relevant checks locally.

## 📌 Status

🚧 **Active development / preparing for public launch**

The project is being polished toward a production release, including build stability, UI consistency, SEO, deployment configuration, and future monetization readiness.

## 📄 License

Add the project's chosen license here before publishing the repository as an open-source project.

---

Built with ❤️ by **RumiTech Solutions**.
