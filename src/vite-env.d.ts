/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string
  readonly VITE_ADSENSE_CLIENT?: string
  readonly VITE_ADSENSE_SLOT_AFTER_CONTENT?: string
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
