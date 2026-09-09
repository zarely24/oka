import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Green & Blue Luxury Suites | Kastella, Piraeus',description:'Three thoughtfully designed suites in Kastella, Piraeus: The Portside, Saronic Pearl and the Odyssey Suite. Port views, private balconies and self check-in. Explore the spaces and request your stay.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
