'use client';
import {useEffect,useRef,useState} from 'react';
import {CalendarDays,RotateCw,X} from 'lucide-react';
import RangeCalendar from './range-calendar';
import type {Suite} from '@/lib/suites';
import {localDate,nightCount,overlapsBlocked,disabledStayDay,monthStart,pretty} from '@/lib/stay-dates';
type Availability={today:string;end:string;unavailable:string[]};
type Props={suite:Suite;arrival:string;departure:string;onChange:(arrival:string,departure:string)=>void};
/** Check-in / checkout fields with an Airbnb-style date picker. Desktop: a popover under the booking bar. Mobile: a full-screen sheet. Selections apply immediately. */
export default function StayCalendar({suite,arrival,departure,onChange}:Props){
 const [open,setOpen]=useState(false),[editing,setEditing]=useState<'arrival'|'departure'>('arrival');
 const [data,setData]=useState<Availability|null>(null),[loading,setLoading]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0),[mobile,setMobile]=useState(false);
 const [month,setMonth]=useState(()=>monthStart(new Date()));
 const wrap=useRef<HTMLDivElement>(null);
 useEffect(()=>{const q=window.matchMedia('(max-width:700px)');const sync=()=>setMobile(q.matches);sync();q.addEventListener('change',sync);return()=>q.removeEventListener('change',sync);},[]);
 useEffect(()=>{
 if(!open)return;const c=new AbortController();setLoading(true);setError('');
 fetch(`/api/availability?suite=${suite.slug}&calendar=1`,{cache:'no-store',signal:c.signal}).then(async r=>{const res=await r.json() as Availability&{error?:string};if(!r.ok)throw Error(res.error||'Availability could not be loaded.');return res;}).then(res=>{setData(res);setMonth(m=>m<monthStart(localDate(res.today))?monthStart(localDate(res.today)):m);}).catch(e=>{if(e.name!=='AbortError')setError('We couldn’t load availability. Please try again.');}).finally(()=>{if(!c.signal.aborted)setLoading(false);});
 return()=>c.abort();
 },[open,retry,suite.slug]);
 useEffect(()=>{
 if(!open)return;
 const down=(e:MouseEvent)=>{if(wrap.current&&!wrap.current.contains(e.target as Node))setOpen(false);};
 const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false);};
 document.addEventListener('mousedown',down);document.addEventListener('keydown',key);
 return()=>{document.removeEventListener('mousedown',down);document.removeEventListener('keydown',key);};
 },[open]);
 useEffect(()=>{if(!(open&&mobile))return;const prev=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=prev;};},[open,mobile]);
 function show(field:'arrival'|'departure'){setEditing(field==='departure'&&arrival?'departure':'arrival');setMonth(monthStart(arrival?localDate(arrival):new Date()));setOpen(true);}
 const checkout=editing==='departure'&&!!arrival;
 const nights=arrival&&departure?nightCount(arrival,departure):0;
 const conflict=!!(data&&arrival&&departure&&(arrival<data.today||departure>data.end||overlapsBlocked(arrival,departure,data.unavailable)));
 function pick(key:string){
 if(!data)return;
 if(!checkout||key<=arrival){onChange(key,'');setEditing('departure');return;}
 onChange(arrival,key);setEditing('arrival');if(!mobile)setOpen(false);
 }
 const title=nights&&!conflict?`${nights} ${nights===1?'night':'nights'} in Kastella`:checkout?'Select checkout date':'Select check-in date';
 const sub=conflict?'Those dates aren’t available in this suite. Please choose a new stay.':nights?`${pretty(arrival)} – ${pretty(departure)} · ${suite.name}`:checkout?'Minimum stay: 1 night':`Add your travel dates to check ${suite.name}`;
 return <div className="stay-wrap" ref={wrap}>
 <button type="button" className={'date-trigger first'+(open&&editing==='arrival'?' active':'')} onClick={()=>show('arrival')} aria-label={`Check-in: ${pretty(arrival)}`} aria-haspopup="dialog" aria-expanded={open}><span>CHECK-IN</span><strong>{pretty(arrival)}</strong><CalendarDays size={18}/></button>
 <button type="button" className={'date-trigger'+(open&&editing==='departure'?' active':'')} onClick={()=>show('departure')} aria-label={`Check-out: ${pretty(departure)}`} aria-haspopup="dialog" aria-expanded={open}><span>CHECK-OUT</span><strong>{pretty(departure)}</strong><CalendarDays size={18}/></button>
 {open&&<div className="stay-panel" role="dialog" aria-label="Choose your dates">
 <button type="button" className="stay-x" onClick={()=>setOpen(false)} aria-label="Close calendar"><X size={20}/></button>
 <div className="stay-head"><div><h3>{title}</h3><p className={conflict?'stay-conflict':''}>{sub}</p></div>
 <div className="stay-fields"><button type="button" className={editing==='arrival'?'active':''} onClick={()=>setEditing('arrival')}><span>CHECK-IN</span><strong>{pretty(arrival)}</strong></button><button type="button" className={editing==='departure'?'active':''} onClick={()=>setEditing(arrival?'departure':'arrival')}><span>CHECKOUT</span><strong>{pretty(departure)}</strong></button></div></div>
 <div className="stay-body" aria-busy={loading}>
 {loading?<div className="calendar-loading" role="status"><RotateCw size={22}/><p>Checking available dates…</p></div>
 :error?<div className="calendar-loading"><p role="alert">{error}</p><button type="button" className="text-link" onClick={()=>setRetry(v=>v+1)}>Try again <RotateCw size={16}/></button></div>
 :data?<RangeCalendar month={month} onMonthChange={setMonth} months={2} minMonth={localDate(data.today)} maxMonth={localDate(data.end)} from={arrival} to={departure} today={data.today} onPick={pick}
 dayInfo={key=>{const blocked=data.unavailable.includes(key);const disabled=disabledStayDay(key,data.today,data.end,data.unavailable,arrival,checkout);return {disabled,kind:blocked?(disabled?'unavailable':'checkout-only'):undefined,title:blocked?(disabled?'unavailable':'checkout only'):undefined};}}/>:null}
 </div>
 <div className="stay-foot"><span>Crossed-out dates are unavailable. Your host confirms the final price.</span><button type="button" className="stay-clear" onClick={()=>{onChange('','');setEditing('arrival');}}>Clear dates</button><button type="button" className="stay-close" onClick={()=>setOpen(false)}>Close</button></div>
 </div>}
 </div>;
}
