import { z } from 'zod';
import { db, days, sameOrigin } from '@/lib/booking';
export async function POST(r:Request){
 if(!sameOrigin(r))return Response.json({error:'Invalid request.'},{status:403});
 try{const b=z.object({arrival:z.string(),departure:z.string(),name:z.string().min(2).max(120),email:z.string().email().max(254),phone:z.string().min(1).max(40),guests:z.number().int().min(1).max(3),note:z.string().max(2000)}).parse(await r.json()); days(b.arrival,b.departure); if(typeof b.name!=='string'||b.name.trim().length<2||b.name.length>120||typeof b.email!=='string'||!/^\S+@\S+\.\S+$/.test(b.email)||b.email.length>254||typeof b.phone!=='string'||b.phone.length>40||!Number.isInteger(b.guests)||b.guests<1||b.guests>3||typeof b.note!=='string'||b.note.length>2000) return Response.json({error:'Please check your contact details and guest count.'},{status:400});
 const id=crypto.randomUUID(); const result=await db().prepare("INSERT INTO bookings (id,name,email,phone,arrival,departure,guests,note,status,created) SELECT ?,?,?,?,?,?,?,?,'pending',? WHERE NOT EXISTS (SELECT 1 FROM nights WHERE day>=? AND day<?)").bind(id,b.name.trim(),b.email.trim(),b.phone,b.arrival,b.departure,b.guests,b.note,new Date().toISOString(),b.arrival,b.departure).run();
 if(!result.meta.changes)return Response.json({error:'These dates are no longer available. Please choose another stay.'},{status:409}); return Response.json({id});
 }catch(e){ console.error(e);return Response.json({error:e instanceof Error&&e.message.startsWith('Choose')?e.message:'We could not save your request. Please try again or call us.'},{status:400}); }
}

