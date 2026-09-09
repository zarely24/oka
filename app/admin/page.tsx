import { requireChatGPTUser } from '@/app/chatgpt-auth';
import { isAdmin } from '@/lib/booking';
import Admin from './panel';
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/admin');if(!await isAdmin())return <main className="access"><a href="/">Green & Blue</a><h1>Owner access</h1><p>This account is not authorized. Sign in with the owner email configured for this property.</p><a className="button" href="/signout-with-chatgpt?return_to=/admin" target="_top">Switch account</a></main>;return <Admin/>;}
