'use client';
import {useMemo,useState} from 'react';
import RangeCalendar from '../range-calendar';
import type {Suite} from '@/lib/suites';
import {localDate,monthStart,nightCount,addDays,pretty} from '@/lib/stay-dates';
export type Night={suite:string;day:string;bookingId:string};
export type Booking={id:string;suite:string;name:string;email:string;phone:string;arrival:string;departure:string;guests:number;note:string;status:string;created:string};
type Props={suite:Suite;nights:Night[];bookings:Booking[];today:string;end:string;busy:boolean;onAction:(body:object)=>Promise<boolean>};
/** Owner's availability calendar for one suite. Select a check-in and a checkout day to block or release those nights. */
export default function OwnerCalendar({suite,nights,bookings,today,end,busy,onAction}:Props){
 const [from,setFrom]=useState(''),[to,setTo]=useState(''),[month,setMonth]=useState(()=>monthStart(new Date()));
 const map=useMemo(()=>{
 const m=new Map<string,{kind:string;title:string}>();const names=new Map(bookings.map(b=>[b.id,b.name]));
 for(const n of nights)if(n.suite===suite.slug)m.set(n.day,n.bookingId==='blocked'?{kind:'blocked',title:'blocked'}:{kind:'confirmed',title:'confirmed: '+(names.get(n.bookingId)||'guest')});
 for(const b of bookings)if(b.suite===suite.slug&&b.status==='pending')for(let d=b.arrival;d<b.departure;d=addDays(d,1))if(!m.has(d))m.set(d,{kind:'pending',title:'request: '+b.name});
 return m;
 },[nights,bookings,suite.slug]);
 const selected=from&&to?Array.from({length:nightCount(from,to)},(_,i)=>addDays(from,i)):[];
 const blocked=selected.filter(d=>map.get(d)?.kind==='blocked').length,confirmed=selected.filter(d=>map.get(d)?.kind==='confirmed').length;
 function pick(key:string){if(!from||to||key<from){setFrom(key);setTo('');}else setTo(key===from?addDays(key,1):key);}
 async function run(action:'block'|'unblock'){if(await onAction({action,suite:suite.slug,arrival:from,departure:to})){setFrom('');setTo('');}}
 return <div className="owner-cal">
 <RangeCalendar month={month} onMonthChange={setMonth} months={2} minMonth={monthStart(localDate(today))} maxMonth={localDate(end)} from={from} to={to} today={today} onPick={pick}
 dayInfo={key=>{const i=map.get(key);return {disabled:key<today||key>end,kind:key<today?'past':i?.kind,title:i?.title};}}/>
 <div className="owner-legend"><span><i className="lg-available"/>Available</span><span><i className="lg-pending"/>Pending request</span><span><i className="lg-confirmed"/>Confirmed stay</span><span><i className="lg-blocked"/>Blocked</span></div>
 <div className="owner-actions">
 {from&&to?<>
 <p><strong>{pretty(from)} → {pretty(to)}</strong> · {selected.length} {selected.length===1?'night':'nights'}{blocked?` · ${blocked} blocked`:''}{confirmed?` · ${confirmed} confirmed`:''}</p>
 <button type="button" className="button" disabled={busy||confirmed>0||blocked===selected.length} onClick={()=>run('block')}>Block {selected.length-blocked||selected.length} {selected.length-blocked===1?'night':'nights'}</button>
 {blocked>0&&<button type="button" className="button outline" disabled={busy} onClick={()=>run('unblock')}>Release {blocked} blocked</button>}
 <button type="button" className="stay-clear" onClick={()=>{setFrom('');setTo('');}}>Clear</button>
 {confirmed>0&&<small>This range includes a confirmed reservation. Cancel it from the list below before blocking these dates.</small>}
 </>:<p>{from?`Check-in ${pretty(from)}. Now choose the checkout day.`:'Click a check-in day, then a checkout day, to block or release those nights. Click the same day twice for a single night.'}</p>}
 </div>
 </div>;
}
