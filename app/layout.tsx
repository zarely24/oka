import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Green & Blue Luxury Suites | Your Kastella Stay',description:'Discover The Portside suite in Kastella, Piraeus. A thoughtful 50 m² retreat for up to three guests. Explore the space and request your stay.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
