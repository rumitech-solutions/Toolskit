import React from 'react';

// Custom SVG icons for tool categories and key tools

// Text Tools
const TextToolsIcons = {
  wordCount: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/></svg>,
  caseConvert: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v14a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm0 18a3 3 0 0 0 3-3"/><path d="M12 12a3 3 0 0 0-3 3h6a3 3 0 0 0 3-3z"/><path d="M12 6a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V9a3 3 0 0 0-3-3z"/></svg>,
  slug: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/></svg>,
};

// Developer Tools
const DeveloperToolsIcons = {
  json: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/></svg>,
  base64: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><circle cx="12" cy="12" r="2"/></svg>,
  url: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 6l-4 4"/><path d="M12 6l4 4"/></svg>,
};

// PDF Tools
const PDFToolsIcons = {
  mergePdf: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4 4"/></svg>,
  splitPdf: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4-4"/><path d="M12 12l-4-4"/></svg>,
  compressPdf: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4-4"/><path d="M12 12v-4"/><path d="M12 12h4"/></svg>,
};

// Image Tools
const ImageToolsIcons = {
  imageCompress: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4-4"/><path d="M12 12v-4"/><path d="M12 12h-4"/></svg>,
  imageResize: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4-4"/><path d="M12 12v-4"/><path d="M12 12h4"/><path d="M12 12h-4"/></svg>,
  imageCrop: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4-4"/><path d="M12 12v-4"/><path d="M12 12h-4"/><path d="M12 12h4"/><path d="M12 12v4"/></svg>,
};

// Calculator Tools
const CalculatorToolsIcons = {
  percentage: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4-4"/><path d="M12 12v-4"/><path d="M12 12h-4"/><path d="M12 12h4"/><path d="M12 12v4"/><path d="M12 12l-2 2"/><path d="M12 12l2 2"/></svg>,
  discount: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4-4"/><path d="M12 12v-4"/><path d="M12 12h-4"/><path d="M12 12h4"/><path d="M12 12v4"/><circle cx="12" cy="12" r="2"/></svg>,
  age: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4-4"/><path d="M12 12v-4"/><path d="M12 12h-4"/><path d="M12 12h4"/><path d="M12 12v4"/><path d="M12 12l-2-2"/><path d="M12 12l2-2"/></svg>,
};

// Security Tools
const SecurityToolsIcons = {
  password: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4-4"/><path d="M12 12v-4"/><path d="M12 12h-4"/><path d="M12 12h4"/><path d="M12 12v4"/><path d="M12 12l-2-2"/><path d="M12 12l2-2"/><path d="M12 12l-2 2"/><path d="M12 12l2 2"/></svg>,
  sha256: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4-4"/><path d="M12 12v-4"/><path d="M12 12h-4"/><path d="M12 12h4"/><path d="M12 12v4"/><circle cx="12" cy="12" r="2"/></svg>,
};

// Category Icons
const CategoryIcons = {
  text: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4-4"/></svg>,
  developer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4-4"/><path d="M12 12v-4"/><path d="M12 12h-4"/><path d="M12 12h4"/></svg>,
  pdf: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4-4"/><path d="M12 12v-4"/><path d="M12 12h-4"/><path d="M12 12h4"/></svg>,
  image: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4-4"/><path d="M12 12v-4"/><path d="M12 12h-4"/><path d="M12 12h4"/></svg>,
  calculator: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4-4"/><path d="M12 12v-4"/><path d="M12 12h-4"/><path d="M12 12h4"/><path d="M12 12v4"/></svg>,
  security: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 20a6 6 0 0 0 12 0"/><path d="M10 16a4 4 0 0 1-8 0"/><path d="M10 12a2 2 0 0 0-4 0"/><path d="M10 8a2 2 0 0 1-4 0"/><path d="M12 2l3 18"/><path d="M12 22l-3-18"/><path d="M12 12l-4 4"/><path d="M12 12l4-4"/><path d="M12 12v-4"/><path d="M12 12h-4"/><path d="M12 12h4"/><path d="M12 12v4"/><path d="M12 12l-2-2"/><path d="M12 12l2-2"/></svg>
};

// Export the icons
export { TextToolsIcons, DeveloperToolsIcons, PDFToolsIcons, ImageToolsIcons, CalculatorToolsIcons, SecurityToolsIcons, CategoryIcons };