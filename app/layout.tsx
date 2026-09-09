import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import { LanguageProvider } from './language';
import { isLang, type Lang } from '@/lib/i18n';
async function currentLang(): Promise<{ lang: Lang; chosen: boolean }> { const value = (await cookies()).get('lang')?.value; return isLang(value) ? { lang: value, chosen: true } : { lang: 'en', chosen: false }; }
export async function generateMetadata(): Promise<Metadata> {
 const { lang } = await currentLang();
 return lang === 'el'
  ? { title: 'Green & Blue Luxury Suites | Καστέλλα, Πειραιάς', description: 'Τρεις προσεγμένες σουίτες στην Καστέλλα του Πειραιά: The Portside, Saronic Pearl και Odyssey Suite. Θέα στο λιμάνι, ιδιωτικά μπαλκόνια και αυτόνομο check-in. Δείτε τους χώρους και ζητήστε τη διαμονή σας.', icons: { icon: '/favicon.svg' } }
  : { title: 'Green & Blue Luxury Suites | Kastella, Piraeus', description: 'Three thoughtfully designed suites in Kastella, Piraeus: The Portside, Saronic Pearl and the Odyssey Suite. Port views, private balconies and self check-in. Explore the spaces and request your stay.', icons: { icon: '/favicon.svg' } };
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
 const { lang, chosen } = await currentLang();
 return <html lang={lang}><body><LanguageProvider initial={lang} chosen={chosen}>{children}</LanguageProvider></body></html>;
}
