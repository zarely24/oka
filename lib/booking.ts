import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { findSuite, type Suite } from './suites';
export const MAX_NIGHTS = 60;
export function db() { if (!env.DB) throw new Error('Booking service unavailable'); return env.DB; }
export async function isAdmin() { const user = await getChatGPTUser(); const email = (env as unknown as {ADMIN_EMAIL?:string}).ADMIN_EMAIL; return !!(email && user && user.email.toLowerCase() === email.toLowerCase()); }
/** Today's date in Athens as YYYY-MM-DD. */
export function today() { return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Athens',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); }
/** Last bookable day (18 months out). */
export function horizon(from = today()) { const h=new Date(from); h.setUTCMonth(h.getUTCMonth()+18,1); return h.toISOString().slice(0,10); }
export const validDay = (s:string) => /^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
/** Nights between arrival and departure. Throws a user-facing 'Choose…' error for invalid stays. */
export function days(a:string,b:string,{past=false}:{past?:boolean}={}) { if(!validDay(a)||!validDay(b))throw new Error('Choose valid dates.'); const count=(Date.parse(b)-Date.parse(a))/86400000; if(count<1||count>MAX_NIGHTS||(!past&&a<today()))throw new Error(`Choose a future stay of 1–${MAX_NIGHTS} nights.`); return Array.from({length:count},(_,i)=>new Date(Date.parse(a)+i*86400000).toISOString().slice(0,10)); }
/** Resolve a suite slug or throw a user-facing error. */
export function suiteOf(slug:unknown):Suite { const s=findSuite(typeof slug==='string'?slug:''); if(!s)throw new Error('Choose one of our suites.'); return s; }
export const userError = (e:unknown,fallback:string) => e instanceof Error&&e.message.startsWith('Choose')?e.message:fallback;
export function sameOrigin(r:Request){return r.headers.get('origin')===new URL(r.url).origin;}
