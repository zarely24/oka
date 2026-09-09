import { z } from 'zod';
import { db, days, isAdmin, sameOrigin, suiteOf, today, horizon, userError } from '@/lib/booking';
import { suiteSlugs } from '@/lib/suites';
const noCache={headers:{'Cache-Control':'no-store'}};
const forbidden=()=>Response.json({error:'Owner access required.'},{status:403});
/** GET /api/admin → all reservations plus every occupied night (blocked or confirmed) from the start of this month onward, for the owner calendar. */
export async function GET(){if(!await isAdmin())return forbidden();try{
 const from=today().slice(0,7)+'-01',end=horizon();
 const [bookings,nights]=await Promise.all([db().prepare('SELECT * FROM bookings ORDER BY created DESC LIMIT 500').all(),db().prepare('SELECT suite,day,booking_id AS bookingId FROM nights WHERE day>=? AND day<=? ORDER BY day').bind(from,end).all()]);
 return Response.json({today:today(),end,bookings:bookings.results,nights:nights.results},noCache);
 }catch(e){console.error(e);return Response.json({error:'Could not load reservations.'},{status:503});}}
/**
 * POST /api/admin
 *  { action:'block',   suite, arrival, departure }  — marks nights unavailable (owner use / Airbnb stays). Refuses ranges that contain a confirmed reservation.
 *  { action:'unblock', suite, arrival, departure }  — releases owner blocks in the range (confirmed reservations are untouched).
 *  { action:'confirm', id }                          — reserves the nights for a pending request.
 *  { action:'cancel',  id }                          — releases the nights and marks the reservation cancelled.
 */
export async function POST(r:Request){if(!sameOrigin(r)||!await isAdmin())return forbidden();try{
 const b=z.object({action:z.enum(['block','unblock','confirm','cancel']),suite:z.enum(suiteSlugs as [string,...string[]]).default('portside'),arrival:z.string().default(''),departure:z.string().default(''),day:z.string().default(''),id:z.string().default('')}).parse(await r.json());
 if(b.action==='block'||b.action==='unblock'){
 const suite=suiteOf(b.suite);
 // Legacy single-day unblock keeps the old dashboard working.
 const range=b.day?[b.day]:days(b.arrival,b.departure,{past:true});const first=range[0],last=range[range.length-1];
 if(b.action==='block'){
 const taken=await db().prepare("SELECT day FROM nights WHERE suite=? AND day>=? AND day<=? AND booking_id!='blocked' LIMIT 1").bind(suite.slug,first,last).first<{day:string}>();
 if(taken)return Response.json({error:`${taken.day} already has a confirmed reservation in ${suite.name}. Cancel it first or choose other dates.`},{status:409});
 await db().batch(range.map(day=>db().prepare("INSERT OR IGNORE INTO nights (suite,day,booking_id) VALUES (?,?,'blocked')").bind(suite.slug,day)));
 }else await db().prepare("DELETE FROM nights WHERE suite=? AND day>=? AND day<=? AND booking_id='blocked'").bind(suite.slug,first,last).run();
 return Response.json({ok:true});
 }
 const row=await db().prepare('SELECT * FROM bookings WHERE id=?').bind(b.id).first<{suite:string;arrival:string;departure:string;status:string}>();
 if(!row)return Response.json({error:'Reservation not found.'},{status:404});
 if(b.action==='confirm'){
 if(row.status!=='pending')return Response.json({error:'Only pending requests can be confirmed.'},{status:409});
 const clash=await db().prepare('SELECT day FROM nights WHERE suite=? AND day>=? AND day<? LIMIT 1').bind(row.suite,row.arrival,row.departure).first<{day:string}>();
 if(clash)return Response.json({error:`${clash.day} is no longer free. Release the overlapping block or reservation first.`},{status:409});
 await db().batch([...days(row.arrival,row.departure,{past:true}).map(day=>db().prepare('INSERT INTO nights (suite,day,booking_id) VALUES (?,?,?)').bind(row.suite,day,b.id)),db().prepare("UPDATE bookings SET status='confirmed' WHERE id=?").bind(b.id)]);
 }else{
 await db().batch([db().prepare('DELETE FROM nights WHERE booking_id=?').bind(b.id),db().prepare("UPDATE bookings SET status='cancelled' WHERE id=?").bind(b.id)]);
 }
 return Response.json({ok:true});
 }catch(e){console.error(e);return Response.json({error:userError(e,'Could not save. Dates may overlap an existing reservation or block.')},{status:409});}}
