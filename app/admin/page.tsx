import Admin from './panel';
import Login from './login';
import { isAdmin } from '@/lib/booking';
export const dynamic = 'force-dynamic';
export default async function Page() { return await isAdmin() ? <Admin /> : <Login />; }
