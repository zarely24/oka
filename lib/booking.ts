import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
export function db() { if (!env.DB) throw new Error('Booking service unavailable'); return env.DB; }
export async function isAdmin() { const user = await getChatGPTUser(); const email = (env as unknown as {ADMIN_EMAIL?:string}).ADMIN_EMAIL; return !!(email && user && user.email.toLowerCase() === email.toLowerCase()); }
export function days(a:string,b:string) { const valid=(s:string)=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s; if(!valid(a)||!valid(b))throw new Error('Choose valid dates.'); const count=(Date.parse(b)-Date.parse(a))/86400000; const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Athens',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); if(count<1||count>60||a<today)throw new Error('Choose a future stay of 1–60 nights.'); return Array.from({length:count},(_,i)=>new Date(Date.parse(a)+i*86400000).toISOString().slice(0,10)); }
export function sameOrigin(r:Request){return r.headers.get('origin')===new URL(r.url).origin;}
