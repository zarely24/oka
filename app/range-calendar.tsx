'use client';
import {useState} from 'react';
import {ChevronLeft,ChevronRight} from 'lucide-react';
import {dateKey,addMonths,monthStart,monthCells} from '@/lib/stay-dates';
import {WEEKDAYS} from '@/lib/i18n';
export type DayInfo={disabled?:boolean;kind?:string;title?:string};
type Props={month:Date;onMonthChange:(m:Date)=>void;months:number;minMonth:Date;maxMonth:Date;from:string;to:string;today:string;dayInfo:(key:string)=>DayInfo;onPick:(key:string)=>void;locale?:string;weekdays?:string[];labels?:{prev:string;next:string}};
/** Airbnb-style month grid: circular days, a soft band between check-in and checkout, hover preview of the range, struck-through unavailable dates. */
export default function RangeCalendar({month,onMonthChange,months,minMonth,maxMonth,from,to,today,dayInfo,onPick,locale='en-GB',weekdays=WEEKDAYS.en,labels={prev:'Previous month',next:'Next month'}}:Props){
 const [hover,setHover]=useState('');
 const first=monthStart(month);
 const canPrev=first>monthStart(minMonth),canNext=addMonths(first,months-1)<monthStart(maxMonth);
 const end=to||(from&&hover>from?hover:'');const preview=!to&&!!end;
 return <div className="ab-cal" onMouseLeave={()=>setHover('')}>
  <button type="button" className="ab-nav ab-prev" disabled={!canPrev} onClick={()=>onMonthChange(addMonths(first,-1))} aria-label={labels.prev}><ChevronLeft size={18}/></button>
  <button type="button" className="ab-nav ab-next" disabled={!canNext} onClick={()=>onMonthChange(addMonths(first,1))} aria-label={labels.next}><ChevronRight size={18}/></button>
  <div className="ab-months">{Array.from({length:months},(_,i)=>{const m=addMonths(first,i);return <div className="ab-month" key={m.getTime()}>
   <div className="ab-caption">{m.toLocaleDateString(locale,{month:'long',year:'numeric'})}</div>
   <div className="ab-weekdays" aria-hidden="true">{weekdays.map(w=><span key={w}>{w}</span>)}</div>
   <div className="ab-grid">{monthCells(m).map((d,j)=>{if(!d)return <span key={'e'+j} className="ab-empty"/>;const key=dateKey(d),info=dayInfo(key);
    const isStart=key===from,isEnd=!!from&&key===end,mid=!!from&&!!end&&key>from&&key<end;
    const cls=['ab-day',isStart&&'is-start',isStart&&end&&'has-end',isEnd&&'is-end',mid&&'is-middle',preview&&(isEnd||mid)&&'is-preview',key===today&&'is-today',info.kind&&'kind-'+info.kind].filter(Boolean).join(' ');
    return <button type="button" key={key} className={cls} disabled={info.disabled} aria-label={d.toLocaleDateString(locale,{weekday:'long',day:'numeric',month:'long',year:'numeric'})+(info.title?', '+info.title:'')} aria-pressed={isStart||(!!to&&isEnd)} title={info.title} onMouseEnter={()=>setHover(key)} onFocus={()=>setHover(key)} onClick={()=>onPick(key)}><span className="ab-num">{d.getDate()}</span></button>;})}</div>
  </div>;})}</div>
 </div>;
}
