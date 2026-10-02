// Routes served by <App/>: '/' and '/tools/:id' (and unknown paths). Everything else is a
// dedicated page (/tools landing, info and category pages).
// App switches tools with history.pushState (no reload), so a visit can start on '/' and end on
// a tool URL. The tool SEO sections (explore categories, FAQ, related tools) must therefore be
// mounted for every App route rather than only when the first load was a tool URL.
export const isAppRoute = (path: string, hasInfoPage: boolean) => path !== '/tools' && !hasInfoPage
