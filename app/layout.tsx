import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import { isLang } from '@/lib/i18n';
export const metadata: Metadata = { title: 'Green & Blue Luxury Suites | Kastella, Piraeus', description: 'Three thoughtfully designed suites in Kastella, Piraeus. Port views, private balconies and self check-in.', icons: { icon: '/favicon.svg' } };
export const viewport: Viewport = { themeColor: '#164650', width: 'device-width', initialScale: 1 };
export default async function RootLayout({ children }: { children: React.ReactNode }) {
 const value = (await cookies()).get('lang')?.value;
 return <html lang={isLang(value) ? value : 'en'}><body>{children}</body></html>;
}
