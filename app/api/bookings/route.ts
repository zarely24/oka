import { z } from 'zod';
import { db, days, sameOrigin, suiteOf, userError } from '@/lib/booking';
import { suiteSlugs } from '@/lib/suites';
/** POST /api/bookings — creates a pending request. Nights are only reserved once the owner confirms. */
export async function POST(r:Request){
 if(!sameOrigin(r))return Response.json({error:'Invalid request.'},{status:403});
 try{const b=z.object({suite:z.enum(suiteSlugs as [string,...string[]]).default('portside'),arrival:z.string(),departure:z.string(),name:z.string().trim().min(2).max(120),email:z.string().trim().email().max(254),phone:z.string().trim().min(1).max(40),guests:z.number().int().min(1),note:z.string().max(2000).default('')}).safeParse(await r.json());
 if(!b.success)return Response.json({error:'Please check your contact details and guest count.'},{status:400});
 const suite=suiteOf(b.data.suite); days(b.data.arrival,b.data.departure);
 if(b.data.guests>suite.guests)return Response.json({error:`${suite.name} welcomes up to ${suite.guests} guests.`},{status:400});
 const id=crypto.randomUUID();
 const result=await db().prepare("INSERT INTO bookings (id,suite,name,email,phone,arrival,departure,guests,note,status,created) SELECT ?,?,?,?,?,?,?,?,?,'pending',? WHERE NOT EXISTS (SELECT 1 FROM nights WHERE suite=? AND day>=? AND day<?)").bind(id,suite.slug,b.data.name,b.data.email,b.data.phone,b.data.arrival,b.data.departure,b.data.guests,b.data.note,new Date().toISOString(),suite.slug,b.data.arrival,b.data.departure).run();
 if(!result.meta.changes)return Response.json({error:'These dates are no longer available. Please choose another stay.'},{status:409}); return Response.json({id});
 }catch(e){ console.error(e);return Response.json({error:userError(e,'We could not save your request. Please try again or call us.')},{status:400}); }
}
