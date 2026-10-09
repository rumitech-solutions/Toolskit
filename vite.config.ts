import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: false,
    // pdf-lib, pdf.js and jszip are only reached through dynamic import(), so Vite already splits them into
    // lazy chunks. A manualChunks rule here pulled Vite's preload helper into the pdf.js chunk, which then
    // had to be downloaded on every page.
  }
})
