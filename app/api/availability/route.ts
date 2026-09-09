import { db, days, today, horizon, suiteOf, userError } from '@/lib/booking';
const noCache={'Cache-Control':'no-store'};
/**
 * GET /api/availability?suite=portside&calendar=1        → { suite, today, end, unavailable: [YYYY-MM-DD…] }
 * GET /api/availability?suite=portside&arrival=…&departure=… → { available, nights }
 */
export async function GET(r:Request){try{
 const u=new URL(r.url);const suite=suiteOf(u.searchParams.get('suite')||'portside');
 if(u.searchParams.get('calendar')==='1'){
 const from=today(),end=horizon(from);
 const result=await db().prepare('SELECT day FROM nights WHERE suite=? AND day>=? AND day<=? ORDER BY day').bind(suite.slug,from,end).all<{day:string}>();
 return Response.json({suite:suite.slug,today:from,end,unavailable:result.results.map(row=>row.day)},{headers:noCache});
 }
 const a=u.searchParams.get('arrival')||'',b=u.searchParams.get('departure')||'';const nights=days(a,b);
 const hit=await db().prepare('SELECT day FROM nights WHERE suite=? AND day>=? AND day<? LIMIT 1').bind(suite.slug,a,b).first();
 return Response.json({available:!hit,nights:nights.length},{headers:noCache});
 }catch(e){return Response.json({error:userError(e,'Availability could not be checked. Please try again.')},{status:400,headers:noCache});}
}
