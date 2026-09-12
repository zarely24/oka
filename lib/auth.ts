import { env } from 'cloudflare:workers';
import { headers } from 'next/headers';
/**
 * Owner sign-in for /admin: a single password (ADMIN_PASSWORD) and a signed, expiring session cookie.
 * Server-only. No third-party identity provider is involved.
 */
const COOKIE = 'owner_session';
const SESSION_DAYS = 30;
const enc = new TextEncoder();
function config() { const e = env as unknown as { ADMIN_PASSWORD?: string; ADMIN_SESSION_SECRET?: string }; return { password: e.ADMIN_PASSWORD || '', secret: e.ADMIN_SESSION_SECRET || e.ADMIN_PASSWORD || '' }; }
async function sign(data: string, secret: string) {
 const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
 return [...new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(data)))].map(b => b.toString(16).padStart(2, '0')).join('');
}
function equal(a: string, b: string) { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
/** True when the submitted password matches ADMIN_PASSWORD (constant-time). Always false when no password is configured. */
export function checkPassword(candidate: string) { const { password } = config(); return !!password && equal(candidate, password); }
/** Set-Cookie value for a fresh owner session. */
export async function sessionCookie(request: Request) {
 const { secret } = config(); const exp = Date.now() + SESSION_DAYS * 86400000;
 const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
 return `${COOKIE}=${exp}.${await sign(String(exp), secret)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${secure}`;
}
export const clearCookie = `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
async function verify(cookieHeader: string | null) {
 const { secret } = config(); if (!secret || !cookieHeader) return false;
 const raw = cookieHeader.split(';').map(c => c.trim()).find(c => c.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1);
 if (!raw) return false;
 const [exp, sig] = raw.split('.'); if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
 return equal(sig, await sign(exp, secret));
}
/** Is the current request from a signed-in owner? */
export async function isOwnerRequest() { return verify((await headers()).get('cookie')); }
