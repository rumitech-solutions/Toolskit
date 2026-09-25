# ToolsKit launch checklist

This checklist separates code that is already prepared from the external account and deployment steps that require the site owner.

## Code readiness

- [x] SPA deep-link routing and Cloudflare Pages fallback
- [x] 79+ tool routes with unique SEO metadata
- [x] Sitemap and robots.txt
- [x] Security headers and production dependency audit
- [x] Browser-side file/resource limits
- [x] Accessibility skip link and live result feedback
- [x] Multi-step task workflows
- [x] Optional Google Analytics 4 event tracking
- [x] Optional AdSense integration and a visually separated post-content slot
- [x] Optional Google Search Console verification metadata
- [x] Public environment-variable example
- [x] Automated tests, typecheck, production build and production dependency audit in CI

## Before publishing

1. Connect the production domain to the Cloudflare Pages project and confirm HTTPS works.
2. Create a Google Analytics 4 web data stream and put its G- Measurement ID into VITE_GA_MEASUREMENT_ID.
3. Verify the site in Google Search Console. The HTML-tag verification value can be supplied with VITE_GOOGLE_SITE_VERIFICATION for a production build.
4. Create the AdSense account, add the domain as the site, and complete Google's requested account and site verification steps.
5. Copy the AdSense publisher client (ca-pub-...) into VITE_ADSENSE_CLIENT.
6. When using a manually positioned responsive ad unit, create the ad unit in AdSense and put its numeric slot ID into VITE_ADSENSE_SLOT_AFTER_CONTENT. Keep the slot empty when using Auto ads only.
7. Publish the root ads.txt entry supplied by AdSense. Do not guess or commit a publisher ID; the entry must use the exact ID shown in the account.
8. Review the privacy policy, consent configuration, and advertising settings before enabling analytics or advertising for visitors in jurisdictions where consent is required.
9. Run production smoke tests on desktop and mobile:
   - homepage, category pages, every tool route
   - search and browser back/forward
   - text tools and developer tools
   - PDF/image upload, processing, download, and resource-limit errors
   - contact and legal pages
   - analytics events in Tag Assistant and GA4
   - ad loading and the production ads.txt URL after AdSense configuration
10. Submit the sitemap in Search Console and monitor indexing, coverage, Core Web Vitals, and real search queries after launch.

## Environment variables

See .env.example. All variables use the VITE_ prefix because Vite embeds them into the client bundle. They are identifiers/configuration, not secrets; never put private API keys or passwords in them.

## AdSense note

Google says the site must be connected and approved before ads can show. The AdSense publisher ID must appear correctly in the site's ads.txt, and Google can take time to recrawl changes.

## Measurement note

The analytics integration intentionally sends page paths, tool identifiers, tool names/categories, run status, and search-query length rather than the user's tool input. This keeps measurements useful without sending the text or file contents users are processing.
