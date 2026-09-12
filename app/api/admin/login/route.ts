import { z } from 'zod';
import { sameOrigin } from '@/lib/booking';
import { checkPassword, sessionCookie } from '@/lib/auth';
/** POST /api/admin/login { password } → sets the owner session cookie. */
export async function POST(r: Request) {
 if (!sameOrigin(r)) return Response.json({ error: 'Invalid request.' }, { status: 403 });
 const b = z.object({ password: z.string().max(200) }).safeParse(await r.json().catch(() => null));
 if (!b.success || !checkPassword(b.data.password)) { await new Promise(res => setTimeout(res, 800)); return Response.json({ error: 'Wrong password.' }, { status: 401 }); }
 return Response.json({ ok: true }, { headers: { 'Set-Cookie': await sessionCookie(r), 'Cache-Control': 'no-store' } });
}
