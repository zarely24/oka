import { sameOrigin } from '@/lib/booking';
import { clearCookie } from '@/lib/auth';
/** POST /api/admin/logout → clears the owner session cookie. */
export async function POST(r: Request) {
 if (!sameOrigin(r)) return Response.json({ error: 'Invalid request.' }, { status: 403 });
 return Response.json({ ok: true }, { headers: { 'Set-Cookie': clearCookie, 'Cache-Control': 'no-store' } });
}
