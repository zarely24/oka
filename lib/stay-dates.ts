export function dateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function localDate(value: string) { const [year,month,day]=value.split('-').map(Number); return new Date(year,month-1,day); }
export function nightCount(from: string,to: string) { return Math.round((Date.parse(to)-Date.parse(from))/86400000); }
export function addDays(key: string,n: number) { const d=localDate(key); d.setDate(d.getDate()+n); return dateKey(d); }
export function monthStart(d: Date) { return new Date(d.getFullYear(),d.getMonth(),1); }
export function addMonths(d: Date,n: number) { return new Date(d.getFullYear(),d.getMonth()+n,1); }
/** Days of a month, padded with nulls so the first cell is a Monday. */
export function monthCells(month: Date): (Date|null)[] { const first=monthStart(month); const lead=(first.getDay()+6)%7; const count=new Date(first.getFullYear(),first.getMonth()+1,0).getDate(); return [...Array<null>(lead).fill(null),...Array.from({length:count},(_,i)=>new Date(first.getFullYear(),first.getMonth(),i+1))]; }
export const pretty=(value: string,fallback='Add date',loc='en-GB')=>value?localDate(value).toLocaleDateString(loc,{day:'numeric',month:'short',year:'numeric'}):fallback;
export function overlapsBlocked(from: string,to: string,blocked: readonly string[]) { return blocked.some(day=>day>=from&&day<to); }
export function disabledStayDay(day:string,today:string,end:string,blocked:readonly string[],from:string,checkout:boolean) {
 if(day<today||day>end)return true;
 if(!checkout||!from||day<from)return day===end||blocked.includes(day);
 const firstBlocked=blocked.filter(d=>d>=from).sort()[0];
 // A booked night may be a checkout boundary, but cannot be stayed through.
 return day===from||nightCount(from,day)>60||!!(firstBlocked&&day>firstBlocked);
}
