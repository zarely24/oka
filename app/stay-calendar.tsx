'use client';
import {useEffect,useRef,useState} from 'react';
import {CalendarDays,RotateCw,X} from 'lucide-react';
import RangeCalendar from './range-calendar';
import {useLang} from './language';
import type {Suite} from '@/lib/suites';
import {locale,WEEKDAYS} from '@/lib/i18n';
import {localDate,nightCount,overlapsBlocked,disabledStayDay,monthStart,pretty} from '@/lib/stay-dates';
type Availability={today:string;end:string;unavailable:string[]};
type Props={suite:Suite;arrival:string;departure:string;onChange:(arrival:string,departure:string)=>void};
/** Check-in / checkout fields with an Airbnb-style date picker. Desktop: a popover under the booking bar. Mobile: a full-screen sheet. Selections apply immediately. */
export default function StayCalendar({suite,arrival,departure,onChange}:Props){
 const {lang,t}=useLang();const c=t.calendar,loc=locale(lang);const fmt=(v:string)=>pretty(v,c.addDate,loc);
 const [open,setOpen]=useState(false),[editing,setEditing]=useState<'arrival'|'departure'>('arrival');
 const [data,setData]=useState<Availability|null>(null),[loading,setLoading]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0),[mobile,setMobile]=useState(false);
 const [month,setMonth]=useState(()=>monthStart(new Date()));
 const wrap=useRef<HTMLDivElement>(null);
 useEffect(()=>{const q=window.matchMedia('(max-width:700px)');const sync=()=>setMobile(q.matches);sync();q.addEventListener('change',sync);return()=>q.removeEventListener('change',sync);},[]);
 useEffect(()=>{
 if(!open)return;const ctl=new AbortController();setLoading(true);setError('');
 fetch(`/api/availability?suite=${suite.slug}&calendar=1&lang=${lang}`,{cache:'no-store',signal:ctl.signal}).then(async r=>{const res=await r.json() as Availability&{error?:string};if(!r.ok)throw Error(res.error||'');return res;}).then(res=>{setData(res);setMonth(m=>m<monthStart(localDate(res.today))?monthStart(localDate(res.today)):m);}).catch(e=>{if(e.name!=='AbortError')setError('failed');}).finally(()=>{if(!ctl.signal.aborted)setLoading(false);});
 return()=>ctl.abort();
 },[open,retry,suite.slug,lang]);
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
 const title=nights&&!conflict?c.nights(nights):checkout?c.selectOut:c.selectIn;
 const sub=conflict?c.conflict:nights?`${fmt(arrival)} – ${fmt(departure)} · ${suite.name}`:checkout?c.minStay:c.addDates(suite.name);
 return <div className="stay-wrap" ref={wrap}>
 <button type="button" className={'date-trigger first'+(open&&editing==='arrival'?' active':'')} onClick={()=>show('arrival')} aria-label={`${c.checkinLabel}: ${fmt(arrival)}`} aria-haspopup="dialog" aria-expanded={open}><span>{t.booking.checkin}</span><strong>{fmt(arrival)}</strong><CalendarDays size={18}/></button>
 <button type="button" className={'date-trigger'+(open&&editing==='departure'?' active':'')} onClick={()=>show('departure')} aria-label={`${c.checkoutLabel}: ${fmt(departure)}`} aria-haspopup="dialog" aria-expanded={open}><span>{t.booking.checkout}</span><strong>{fmt(departure)}</strong><CalendarDays size={18}/></button>
 {open&&<div className="stay-panel" role="dialog" aria-label={c.dialog}>
 <button type="button" className="stay-x" onClick={()=>setOpen(false)} aria-label={c.closeCal}><X size={20}/></button>
 <div className="stay-head"><div><h3>{title}</h3><p className={conflict?'stay-conflict':''}>{sub}</p></div>
 <div className="stay-fields"><button type="button" className={editing==='arrival'?'active':''} onClick={()=>setEditing('arrival')}><span>{c.checkin}</span><strong>{fmt(arrival)}</strong></button><button type="button" className={editing==='departure'?'active':''} onClick={()=>setEditing(arrival?'departure':'arrival')}><span>{c.checkout}</span><strong>{fmt(departure)}</strong></button></div></div>
 <div className="stay-body" aria-busy={loading}>
 {loading?<div className="calendar-loading" role="status"><RotateCw size={22}/><p>{c.loading}</p></div>
 :error?<div className="calendar-loading"><p role="alert">{c.failed}</p><button type="button" className="text-link" onClick={()=>setRetry(v=>v+1)}>{c.retry} <RotateCw size={16}/></button></div>
 :data?<RangeCalendar month={month} onMonthChange={setMonth} months={2} minMonth={localDate(data.today)} maxMonth={localDate(data.end)} from={arrival} to={departure} today={data.today} onPick={pick} locale={loc} weekdays={WEEKDAYS[lang]} labels={{prev:c.prevMonth,next:c.nextMonth}}
 dayInfo={key=>{const blocked=data.unavailable.includes(key);const disabled=disabledStayDay(key,data.today,data.end,data.unavailable,arrival,checkout);return {disabled,kind:blocked?(disabled?'unavailable':'checkout-only'):undefined,title:blocked?(disabled?c.unavailable:c.checkoutOnly):undefined};}}/>:null}
 </div>
 <div className="stay-foot"><span>{c.hint}</span><button type="button" className="stay-clear" onClick={()=>{onChange('','');setEditing('arrival');}}>{c.clear}</button><button type="button" className="stay-close" onClick={()=>setOpen(false)}>{c.close}</button></div>
 </div>}
 </div>;
}
