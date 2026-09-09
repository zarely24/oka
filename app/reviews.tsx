'use client';
import {useEffect,useState} from 'react';
import {ArrowUpRight,PenLine} from 'lucide-react';
import {useLang} from './language';
import {snapshotReviews,type ReviewsPayload} from '@/lib/reviews';
const GoogleG=()=><svg className="google-g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>;
/** Amber Google-style stars with fractional fill. */
function Stars({value,size=18}:{value:number;size?:number}){
 return <span className="stars" role="img" aria-label={`${value} / 5`}>{[0,1,2,3,4].map(i=>{const fill=Math.max(0,Math.min(1,value-i));return <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id={`star-${size}-${i}-${Math.round(fill*100)}`}><stop offset={`${fill*100}%`} stopColor="#fbbc04"/><stop offset={`${fill*100}%`} stopColor="#dadce0"/></linearGradient></defs><path fill={`url(#star-${size}-${i}-${Math.round(fill*100)})`} d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>;})}</span>;
}
/** Google rating + latest reviews panel. Starts with the snapshot and swaps in live data from /api/reviews. */
export default function GoogleReviews(){
 const {lang,t}=useLang();const r=t.reviews;
 const [data,setData]=useState<ReviewsPayload>(()=>snapshotReviews(lang)),[expanded,setExpanded]=useState<number|null>(null);
 useEffect(()=>{const c=new AbortController();fetch(`/api/reviews?lang=${lang}`,{signal:c.signal}).then(res=>res.ok?res.json():null).then(d=>{if(d)setData(d as ReviewsPayload);}).catch(()=>{});return()=>c.abort();},[lang]);
 return <aside className="reviews" aria-label={r.title}>
 <div className="reviews-head"><GoogleG/><div className="reviews-score"><strong>{data.rating.toFixed(1)}</strong><Stars value={data.rating}/><span>{r.basedOn(data.count)}</span></div><a className="reviews-write" href={data.writeUrl} target="_blank" rel="noreferrer"><PenLine size={15}/>{r.write}</a></div>
 <ul className="reviews-list">{data.reviews.slice(0,3).map((v,i)=>{const long=v.text.length>180,open=expanded===i;return <li key={v.author+i}>
 <div className="review-author">{v.avatar?<img src={v.avatar} alt="" width={36} height={36} loading="lazy" referrerPolicy="no-referrer"/>:<i aria-hidden="true">{v.author.charAt(0)}</i>}<div><strong>{v.url?<a href={v.url} target="_blank" rel="noreferrer">{v.author}</a>:v.author}</strong><span>{v.when}{v.rating?<> · <Stars value={v.rating} size={12}/></>:null}</span></div></div>
 <p className={long&&!open?'clamp':''}>{v.text}</p>{long&&<button type="button" className="review-more" onClick={()=>setExpanded(open?null:i)}>{open?r.less:r.more}</button>}
 </li>;})}</ul>
 <a className="text-link" href={data.url} target="_blank" rel="noreferrer">{r.readAll} <ArrowUpRight size={17}/></a>
 </aside>;
}
