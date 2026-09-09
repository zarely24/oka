import { siteBase, BUSINESS } from '@/lib/seo';
import { suites } from '@/lib/suites';
export async function GET() {
 const base = await siteBase(), today = new Date().toISOString().slice(0, 10);
 const alternates = `<xhtml:link rel="alternate" hreflang="en" href="${base}/"/><xhtml:link rel="alternate" hreflang="el" href="${base}/?lang=el"/><xhtml:link rel="alternate" hreflang="x-default" href="${base}/"/>`;
 const images = [BUSINESS.ogImage, ...suites.flatMap(s => s.grid.map(i => '/images/' + s.photos[i].file))].map(p => `<image:image><image:loc>${base}${p}</image:loc></image:image>`).join('');
 const url = (loc: string) => `<url><loc>${loc}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority>${alternates}${images}</url>`;
 const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${url(`${base}/`)}${url(`${base}/?lang=el`)}</urlset>`;
 return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
