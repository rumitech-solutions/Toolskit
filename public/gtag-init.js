// Google tag (gtag.js) initialisation. Kept as an external file because the Content-Security-Policy
// in public/_headers does not allow inline scripts. The matching <script async src=".../gtag/js?id=...">
// sits in index.html. page_view events are sent by src/analytics.tsx on every route change, so the
// automatic one is disabled here to avoid counting each visit twice.
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-D6ZECZMKTT', { send_page_view: false });
