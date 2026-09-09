import { cookies, headers } from 'next/headers';
import type { Metadata } from 'next';
import { isLang, type Lang } from './i18n';
import { suites } from './suites';
export const BUSINESS = {
 name: 'Green & Blue Castella Luxury Suites',
 shortName: 'Green & Blue Luxury Suites',
 phone: '+30 694 677 8666',
 email: 'greenandbluesuites@gmail.com',
 street: 'Riga Fereou 28', city: 'Piraeus', postalCode: '185 33', region: 'Attica', country: 'GR',
 // Approximate pin for Riga Fereou 28 on the Kastella hill. Adjust if Google shows the wrong spot.
 lat: 37.9385, lng: 23.658,
 registration: '00003061932',
 ogImage: '/images/portside/02.jpg',
};
const copy = {
 en: { title: 'Green & Blue Luxury Suites Kastella | Apartments in Piraeus near the port', description: 'Three luxury suites in Kastella, Piraeus: The Portside, Saronic Pearl and Odyssey Suite. Port views, private balconies, fast Wi-Fi and self check-in, five minutes from the port of Piraeus. Check availability and request your stay.', keywords: ['Kastella apartments', 'Piraeus luxury suites', 'Piraeus accommodation', 'apartment near Piraeus port', 'Castella Piraeus suite', 'sea view apartment Piraeus', 'Mikrolimano accommodation', 'Green & Blue Castella Luxury Suites'], ogLocale: 'en_GB' },
 el: { title: 'Green & Blue Luxury Suites Καστέλλα | Διαμερίσματα στον Πειραιά κοντά στο λιμάνι', description: 'Τρεις πολυτελείς σουίτες στην Καστέλλα του Πειραιά: The Portside, Saronic Pearl και Odyssey Suite. Θέα στο λιμάνι, ιδιωτικά μπαλκόνια, γρήγορο Wi-Fi και αυτόνομο check-in, πέντε λεπτά από το λιμάνι του Πειραιά. Δείτε διαθεσιμότητα και ζητήστε τη διαμονή σας.', keywords: ['Καστέλλα διαμερίσματα', 'Πειραιάς σουίτες', 'διαμονή Πειραιάς', 'διαμέρισμα κοντά στο λιμάνι Πειραιά', 'Καστέλλα Πειραιάς', 'διαμέρισμα με θέα θάλασσα Πειραιάς', 'Μικρολίμανο διαμονή', 'Green & Blue Castella Luxury Suites'], ogLocale: 'el_GR' },
};
const BOT = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|twitterbot|linkedinbot|embedly|quora link preview|pinterest|applebot|duckduck|yandex|baidu|petalbot/i;
/** Public origin of the site: SITE_URL if configured, otherwise derived from the request. */
export async function siteBase() {
 const env = (process.env.SITE_URL || '').replace(/\/$/, '');
 if (env) return env;
 const h = await headers();
 const host = h.get('x-forwarded-host') || h.get('host') || 'localhost';
 const proto = h.get('x-forwarded-proto') || (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
 return `${proto}://${host}`;
}
/** Which language to render: ?lang= wins, then the cookie, then English. Crawlers never see the language gate. */
export async function resolveLang(param?: string): Promise<{ lang: Lang; chosen: boolean; fromUrl: boolean }> {
 if (isLang(param)) return { lang: param, chosen: true, fromUrl: true };
 const cookie = (await cookies()).get('lang')?.value;
 if (isLang(cookie)) return { lang: cookie, chosen: true, fromUrl: false };
 const bot = BOT.test((await headers()).get('user-agent') || '');
 return { lang: 'en', chosen: bot, fromUrl: false };
}
export async function homeMetadata(lang: Lang, fromUrl: boolean): Promise<Metadata> {
 const base = await siteBase(), c = copy[lang], image = `${base}${BUSINESS.ogImage}`;
 const canonical = fromUrl && lang === 'el' ? '/?lang=el' : '/';
 return {
  metadataBase: new URL(base),
  title: c.title,
  description: c.description,
  keywords: c.keywords,
  applicationName: BUSINESS.shortName,
  alternates: { canonical, languages: { en: '/', el: '/?lang=el', 'x-default': '/' } },
  openGraph: { type: 'website', url: canonical, siteName: BUSINESS.shortName, title: c.title, description: c.description, locale: c.ogLocale, alternateLocale: lang === 'el' ? ['en_GB'] : ['el_GR'], images: [{ url: image, width: 1200, height: 800, alt: 'The Portside suite living room, Green & Blue Luxury Suites, Kastella' }] },
  twitter: { card: 'summary_large_image', title: c.title, description: c.description, images: [image] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  icons: { icon: '/favicon.svg' },
  other: { 'geo.region': 'GR-A1', 'geo.placename': 'Piraeus', 'geo.position': `${BUSINESS.lat};${BUSINESS.lng}`, ICBM: `${BUSINESS.lat}, ${BUSINESS.lng}` },
 };
}
const amenity = (name: string) => ({ '@type': 'LocationFeatureSpecification', name, value: true });
/** schema.org structured data: the business plus its three suites. */
export function structuredData(lang: Lang, base: string) {
 const abs = (p: string) => `${base}/images/${p}`;
 return {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  '@id': `${base}/#business`,
  name: BUSINESS.name,
  alternateName: `${BUSINESS.shortName} Kastella`,
  description: copy[lang].description,
  inLanguage: lang === 'el' ? 'el' : 'en',
  url: `${base}/`,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  image: suites.map(s => abs(s.photos[s.cover].file)),
  address: { '@type': 'PostalAddress', streetAddress: BUSINESS.street, addressLocality: BUSINESS.city, postalCode: BUSINESS.postalCode, addressRegion: BUSINESS.region, addressCountry: BUSINESS.country },
  geo: { '@type': 'GeoCoordinates', latitude: BUSINESS.lat, longitude: BUSINESS.lng },
  checkinTime: '15:00', checkoutTime: '11:00', numberOfRooms: suites.length, priceRange: '€€', currenciesAccepted: 'EUR', petsAllowed: false, smokingAllowed: false,
  identifier: { '@type': 'PropertyValue', name: 'Greek property registration number (AMA)', value: BUSINESS.registration },
  sameAs: suites.map(s => s.airbnb),
  amenityFeature: ['Free Wi-Fi', 'Air conditioning', 'Kitchen', 'Self check-in', 'Free parking nearby'].map(amenity),
  containsPlace: suites.map(s => ({
   '@type': 'Accommodation', '@id': `${base}/#${s.slug}`, name: `${BUSINESS.name}: ${s.name}`, url: `${base}/#${s.slug}`, sameAs: s.airbnb,
   description: s.text[lang].summary, image: s.grid.map(i => abs(s.photos[i].file)),
   floorSize: { '@type': 'QuantitativeValue', value: s.size, unitCode: 'MTK' },
   occupancy: { '@type': 'QuantitativeValue', maxValue: s.guests }, numberOfBedrooms: s.bedrooms, numberOfBathroomsTotal: s.baths,
   amenityFeature: s.text[lang].highlights.map(amenity),
  })),
 };
}
