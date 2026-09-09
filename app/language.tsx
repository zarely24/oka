'use client';
import {createContext,useContext,useState,type ReactNode} from 'react';
import {dictionaries,type Lang,type Dictionary} from '@/lib/i18n';
type Ctx={lang:Lang;t:Dictionary;setLang:(l:Lang)=>void;chosen:boolean};
const LangContext=createContext<Ctx>({lang:'en',t:dictionaries.en,setLang:()=>{},chosen:true});
/** Holds the visitor's language. The server passes the cookie value so the first render is already in the right language. */
export function LanguageProvider({initial,chosen:initialChosen,children}:{initial:Lang;chosen:boolean;children:ReactNode}){
 const [lang,setLangState]=useState<Lang>(initial),[chosen,setChosen]=useState(initialChosen);
 function setLang(l:Lang){setLangState(l);setChosen(true);document.cookie=`lang=${l}; path=/; max-age=31536000; SameSite=Lax`;document.documentElement.lang=l;}
 return <LangContext.Provider value={{lang,t:dictionaries[lang],setLang,chosen}}>{children}</LangContext.Provider>;
}
export const useLang=()=>useContext(LangContext);
/** EN / ΕΛ switch for the header. */
export function LanguageToggle(){
 const {lang,setLang,t}=useLang();
 return <div className="lang-toggle" role="group" aria-label={t.nav.language}>{(['en','el'] as Lang[]).map(l=><button key={l} type="button" className={l===lang?'active':''} aria-pressed={l===lang} onClick={()=>setLang(l)} lang={l}>{l==='en'?'EN':'ΕΛ'}</button>)}</div>;
}
/** Full-screen language choice shown until the visitor picks a language once. */
export function LanguageGate(){
 const {chosen,setLang}=useLang();
 if(chosen)return null;
 return <div className="lang-gate" role="dialog" aria-modal="true" aria-label="Choose your language / Επιλέξτε γλώσσα"><div className="lang-card">
 <span className="brand">green<span>&</span>blue<small>LUXURY SUITES · KASTELLA</small></span>
 <h2>Welcome<br/><em lang="el">Καλώς ήρθατε</em></h2>
 <p>Choose your language · <span lang="el">Επιλέξτε γλώσσα</span></p>
 <div className="lang-options"><button type="button" onClick={()=>setLang('en')} lang="en"><strong>English</strong><span>Continue in English</span></button><button type="button" onClick={()=>setLang('el')} lang="el"><strong>Ελληνικά</strong><span>Συνέχεια στα Ελληνικά</span></button></div>
 </div></div>;
}
