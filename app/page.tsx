import type { Metadata } from 'next';
import Home from './home';
import { LanguageProvider } from './language';
import { resolveLang, homeMetadata, structuredData, siteBase } from '@/lib/seo';
type Props = { searchParams: Promise<{ lang?: string }> };
export const dynamic = 'force-dynamic';
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> { const { lang, fromUrl } = await resolveLang((await searchParams).lang); return homeMetadata(lang, fromUrl); }
export default async function Page({ searchParams }: Props) {
 const { lang, chosen, fromUrl } = await resolveLang((await searchParams).lang);
 const json = JSON.stringify(structuredData(lang, await siteBase())).replace(/</g, '\\u003c');
 return <LanguageProvider initial={lang} chosen={chosen} persist={fromUrl}><Home /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} /></LanguageProvider>;
}
