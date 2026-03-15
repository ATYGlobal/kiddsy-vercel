/**
 * src/pages/Education.jsx — Kiddsy (ABC Explorer)
 * Solo UI + estado. Datos → src/data/educationData.js
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Globe, ChevronDown, BookOpen, Hash, MessageCircle } from "lucide-react";
import { LearnBg }      from "../components/PageBg.jsx";
import { RainbowTitle } from "../components/KiddsyFont.jsx";
import EmojiSvg          from "../utils/EmojiSvg.jsx";
import { LANGUAGES, getLang } from "../utils/langConfig.js";
import { C } from "../utils/designConfig.js";
import { motion, AnimatePresence } from "framer-motion";
import { StoryCoverCard } from "./StoryReader.jsx"; // Ajusta la ruta si es necesario

// ── Speech ────────────────────────────────────────────────────────────────────
function speak(text,voice="en-US"){
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang=voice; u.rate=0.8; u.pitch=1.1;
  window.speechSynthesis.speak(u);
}

// ── Confetti ───────────────────────────────────────────────────────────────────
function Confetti({active}){
  const ps=Array.from({length:20},(_,i)=>({id:i,x:Math.random()*100,
    color:[C.blue,C.red,C.yellow,C.green,C.magenta,C.cyan][i%6],
    delay:Math.random()*0.4,size:Math.random()*10+7}));
  if (!active) return null;
  return <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
    {ps.map(p=><motion.div key={p.id} className="absolute rounded-sm top-0"
      style={{left:`${p.x}%`,width:p.size,height:p.size,background:p.color}}
      initial={{y:-20,opacity:1,rotate:0}} animate={{y:"110vh",opacity:0,rotate:720}}
      transition={{duration:1.5+Math.random(),delay:p.delay,ease:"easeIn"}}/>)}
  </div>;
}

// ── Lang Dropdown ─────────────────────────────────────────────────────────────
function LangDropdown({value,onChange}){
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  const sel=LANGUAGES.find(l=>l.code===value)||LANGUAGES[0];
  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h);
  },[]);
  return (
    <div ref={ref} style={{position:"relative",zIndex:40}}>
      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={()=>setOpen(o=>!o)}
        style={{display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:999,
          border:"2.5px solid white",background:"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",
          boxShadow:"0 4px 20px rgba(230,81,0,0.18)",cursor:"pointer",
          fontFamily:"var(--font-display,'Nunito',sans-serif)",fontWeight:700,fontSize:14,color:C.orange,
          whiteSpace:"nowrap",minWidth:170,justifyContent:"space-between"}}>
        <span style={{display:"flex",alignItems:"center",gap:7}}>
          <Globe size={14} style={{flexShrink:0}}/>
          <span style={{fontSize:20,lineHeight:1}}>
            <EmojiSvg code={sel.flagCode} size={20} />
          </span>
          <span>{sel.label}</span>
        </span>
        <motion.span animate={{rotate:open?180:0}} transition={{duration:0.2}} style={{display:"flex"}}>
          <ChevronDown size={13}/>
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {open&&<motion.div initial={{opacity:0,y:-8,scale:0.97}} animate={{opacity:1,y:0,scale:1}}
          exit={{opacity:0,y:-8,scale:0.97}} transition={{duration:0.15}}
          style={{position:"absolute",top:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",
            width:215,background:"white",borderRadius:18,
            border:"2px solid rgba(230,81,0,0.12)",boxShadow:"0 16px 48px rgba(230,81,0,0.16)",
            overflow:"hidden",maxHeight:320,overflowY:"auto",scrollbarWidth:"thin"}}>
          <div style={{padding:"8px 14px 6px",borderBottom:"1.5px solid #FFF3E0",
            fontFamily:"var(--font-display,'Nunito',sans-serif)",fontWeight:700,fontSize:10,
            color:C.orange,letterSpacing:"0.08em",textTransform:"uppercase",
            display:"flex",alignItems:"center",gap:5}}>
            <Globe size={10}/> Translation language
          </div>
          {LANGUAGES.map(l=>{
            const isA=l.code===value;
            return <button key={l.code} onClick={()=>{onChange(l.code);setOpen(false);}}
              style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"8px 14px",
                border:"none",background:isA?C.orangeSoft:"transparent",cursor:"pointer",
                fontFamily:"var(--font-body,'Nunito',sans-serif)",fontWeight:isA?700:500,fontSize:13,
                color:isA?C.orange:"#374151",textAlign:"left",
                borderLeft:isA?`3px solid ${C.orange}`:"3px solid transparent"}}
              onMouseEnter={e=>{if(!isA)e.currentTarget.style.background="#FFF8F0";}}
              onMouseLeave={e=>{if(!isA)e.currentTarget.style.background="transparent";}}>
              <span style={{fontSize:18,lineHeight:1,flexShrink:0}}>
                <EmojiSvg code={l.flagCode} size={18} />
              </span>
              <span style={{flex:1}}>{l.label}</span>
              {isA&&<span style={{width:6,height:6,borderRadius:"50%",background:C.orange,flexShrink:0}}/>}
            </button>;
          })}
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

// ── Letter Card ───────────────────────────────────────────────────────────────
function LetterCard({item,lang,langMeta,active,onClick}){
  return (
    <motion.div whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}}
      onClick={onClick} style={{cursor:"pointer"}}>
      <div className="rounded-3xl border-4 p-4 text-center shadow-lg transition-all"
        style={{borderColor:active?item.color:"white",
          background:active?`${item.color}18`:"white",
          boxShadow:active?`0 8px 32px ${item.color}40`:"0 4px 16px rgba(0,0,0,0.08)"}}>
        <div className="text-4xl mb-1"><EmojiSvg code={item.emojiCode} size={24}/></div>
        <div className="font-display text-4xl font-black mb-1" style={{color:item.color}}>
          {item.letter}
        </div>
        <div className="font-display text-sm text-slate-600">{item.word}</div>
        <div className="font-body text-xs mt-1" style={{color:item.color,direction:langMeta.dir}}>
          {item[lang]||item.word}
        </div>
        <motion.button whileHover={{scale:1.15}} whileTap={{scale:0.9}}
          onClick={e=>{e.stopPropagation();speak(item.word,"en-US");setTimeout(()=>speak(item[lang]||item.word,langMeta.voice),600);}}
          className="mt-2 w-8 h-8 rounded-full flex items-center justify-center mx-auto"
          style={{background:item.color,color:"white"}}>
          <Volume2 size={13}/>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Number Card ───────────────────────────────────────────────────────────────
const NUM_COLORS=[C.red,C.orange,C.yellow,C.green,C.cyan,C.blue,"#6A1B9A",C.magenta,"#795548","#546E7A"];
function NumberCard({item,lang,langMeta,active,onClick}){
  const color=NUM_COLORS[item.n];
  return (
    <motion.div whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}}
      onClick={onClick} style={{cursor:"pointer"}}>
      <div className="rounded-3xl border-4 p-4 text-center shadow-lg transition-all"
        style={{borderColor:active?color:"white",
          background:active?`${color}18`:"white",
          boxShadow:active?`0 8px 32px ${color}40`:"0 4px 16px rgba(0,0,0,0.08)"}}>
        <div className="font-display text-5xl font-black mb-1" style={{color}}>{item.n}</div>
        <div className="text-3xl mb-1"><EmojiSvg code={item.emojiCode} size={24}/></div>
        <div className="font-display text-base" style={{color}}>
          {Array.from({length:Math.max(item.n,1)},(_,i)=>"⭐").join(" ").slice(0,item.n===0?0:undefined)||"—"}
        </div>
        <div className="font-body text-sm mt-1 text-slate-600">{item[lang]||""}</div>
        <motion.button whileHover={{scale:1.15}} whileTap={{scale:0.9}}
          onClick={e=>{e.stopPropagation();speak(String(item.n),"en-US");setTimeout(()=>speak(item[lang]||"",langMeta.voice),600);}}
          className="mt-2 w-8 h-8 rounded-full flex items-center justify-center mx-auto"
          style={{background:color,color:"white"}}>
          <Volume2 size={13}/>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Word Card ─────────────────────────────────────────────────────────────────
function WordCard({item,lang,langMeta,active,onClick}){
  return (
    <motion.div whileHover={{scale:1.03,y:-2}} whileTap={{scale:0.97}}
      onClick={onClick} style={{cursor:"pointer"}}>
      <div className="rounded-3xl border-4 p-5 shadow-lg transition-all"
        style={{borderColor:active?item.color:"white",
          background:active?`${item.color}14`:"white",
          boxShadow:active?`0 8px 32px ${item.color}35`:"0 4px 16px rgba(0,0,0,0.07)"}}>
        <div className="flex items-center gap-3">
          <span style={{fontSize:32}}><EmojiSvg code={item.emojiCode} size={24}/></span>
          <div className="flex-1 min-w-0">
            <div className="font-display text-lg font-bold" style={{color:item.color}}>{item.en}</div>
            <div className="font-body text-base text-slate-700" dir={langMeta.dir}>
              {item[lang]||item.en}
            </div>
          </div>
          <motion.button whileHover={{scale:1.15}} whileTap={{scale:0.9}}
            onClick={e=>{e.stopPropagation();speak(item.en,"en-US");setTimeout(()=>speak(item[lang]||item.en,langMeta.voice),700);}}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{background:item.color,color:"white"}}>
            <Volume2 size={14}/>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Detail Panel (shown when a card is active) ────────────────────────────────
function DetailPanel({item,lang,langMeta,type,onClose}){
  if (!item) return null;
  const color = type==="numbers" ? NUM_COLORS[item.n] : item.color;
  const englishText = type==="letters"?item.word : type==="numbers"?String(item.n) : item.en;
  const localText   = item[lang] || englishText;

  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:16}}
      className="rounded-3xl border-4 p-6 shadow-2xl" style={{borderColor:color,background:"white"}}>
      {/* Main display */}
      <div className="text-center mb-5">
        <div style={{fontSize:56,marginBottom:4}}><EmojiSvg code={item.emojiCode} size={48}/></div>
        {type==="letters"&&<div className="font-display text-6xl font-black mb-1" style={{color}}>{item.letter}</div>}
        {type==="numbers"&&<div className="font-display text-6xl font-black mb-1" style={{color}}>{item.n}</div>}
        <div className="font-display text-xl" style={{color}}>{englishText}</div>
      </div>

      {/* Translation highlight */}
      <div className="rounded-2xl p-4 mb-4 text-center" style={{background:`${color}18`,border:`2px solid ${color}50`}}>
        <div className="font-body text-xs text-slate-400 mb-1">
          <EmojiSvg code={langMeta.flagCode} size={14} /> {langMeta.label}
        </div>
        <div className="font-display text-2xl font-bold" style={{color,direction:langMeta.dir}}>{localText}</div>
      </div>

      {/* All 16 translations */}
      <div className="grid grid-cols-2 gap-1.5 mb-4">
        {LANGUAGES.map(l=>(
          <div key={l.code} className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{background:l.code===lang?`${color}18`:"#F8FAFC",border:l.code===lang?`1.5px solid ${color}60`:"1.5px solid transparent"}}>
            <span style={{fontSize:16,lineHeight:1,flexShrink:0}}>
              <EmojiSvg code={l.flagCode} size={16} />
            </span>
            <span className="font-body text-xs truncate" style={{color:l.code===lang?color:"#64748B",direction:l.dir}}>
              {item[l.code]||"—"}
            </span>
          </div>
        ))}
      </div>

      {/* Speak buttons */}
      <div className="flex gap-3 justify-center">
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
          onClick={()=>speak(englishText,"en-US")}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-display text-sm"
          style={{background:"#37474F"}}>
          <Volume2 size={14}/> <EmojiSvg code="1f1ec-1f1e7" size={14} /> English
        </motion.button>
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
          onClick={()=>speak(localText,langMeta.voice)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-display text-sm"
          style={{background:color}}>
          <Volume2 size={14}/> <EmojiSvg code={langMeta.flagCode} size={14} /> {langMeta.label}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── TABS config ───────────────────────────────────────────────────────────────
const TABS = [
  { id:"letters", label:"Alphabet", icon:BookOpen,  color:C.orange  },
  { id:"numbers", label:"Numbers",  icon:Hash,      color:C.blue    },
  { id:"words",   label:"Words",    icon:MessageCircle,color:C.green },
  { id:"stories", label:"My Stories", icon:BookOpen, color:C.purple },
];

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function Education({ lang = "en", onLangChange, stories = [], onSelectStory }) {
  const setLang = v => onLangChange?.(v);
  const [tab,setTab]         = useState("letters");
  const [active,setActive]   = useState(null);
  const [confetti,setConfetti]=useState(false);
  const [learned,setLearned] = useState({letters:new Set(),numbers:new Set(),words:new Set()});
  const tabColor = TABS.find(t=>t.id===tab)?.color || C.orange;

  const handleCardClick=(item,key)=>{
    const isSame = active && (active.letter===item.letter||active.n===item.n||active.en===item.en);
    setActive(isSame?null:item);
    if (!isSame){
      const newKey = key ?? (tab==="letters"?item.letter:tab==="numbers"?item.n:item.en);
      const prev = learned[tab];
      if (!prev.has(newKey)){
        const next=new Set([...prev,newKey]);
        setLearned(l=>({...l,[tab]:next}));
        if (next.size===({letters:ALPHABET,numbers:NUMBERS,words:COMMON_WORDS}[tab].length)){
          setConfetti(true); setTimeout(()=>setConfetti(false),2500);
        }
      }
    }
  };

  const dataset      = tab==="letters"?ALPHABET:tab==="numbers"?NUMBERS:COMMON_WORDS;
  const totalLearned = learned[tab].size;
  const totalItems   = dataset.length;

// ── RENDER ────────────────────────────────────────────────────────────
return (
  <div className="relative min-h-screen overflow-hidden">
    {/* Fondo temático de Pizarra y Lápices animados */}
    <LearnBg />

    <Confetti active={confetti}/>

    {/* Contenido (z-10) */}
    <div className="relative z-10">
      
      {/* Header */}
      <div className="text-center py-10 px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="mb-6"
        >
          {/* Título Arcoiris con el nuevo nombre: ABC Explorer */}
          <h1 style={{ lineHeight: 1.2 }}>
            <RainbowTitle size={56}>
              ABC Explorer
            </RainbowTitle>
          </h1>
        </motion.div>

        <p className="font-display text-slate-700 text-lg font-medium bg-white/50 backdrop-blur-sm inline-block px-6 py-2 rounded-full shadow-sm">
          Learn English with <EmojiSvg code={langMeta.flagCode} size={18} /> {langMeta.label} translations! <EmojiSvg code="1f30d" size={16} />
        </p>
      </div>
      {/* Top controls */}
      <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:10,padding:"0 16px 20px"}}>
        {/* Tabs */}
        <div className="flex bg-white/80 rounded-full p-1 shadow-sm gap-1">
          {TABS.map(t=>{
            const Icon=t.icon;
            return <button key={t.id} onClick={()=>{setTab(t.id);setActive(null);}}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-display text-sm transition-all"
              style={{background:tab===t.id?t.color:"transparent",color:tab===t.id?"white":"#6B7280"}}>
              <Icon size={14}/>{t.label}
            </button>;
          })}
        </div>
        {/* Language picker */}
        <LangDropdown value={lang} onChange={setLang}/>
      </div>

      {/* Progress bar */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-display text-sm" style={{color:tabColor}}>
            Progress: {totalLearned} / {totalItems}
          </span>
          {totalLearned===totalItems&&totalItems>0&&
            <span className="font-display text-sm text-white px-3 py-1 rounded-full" style={{background:tabColor}}>
              <EmojiSvg code="2b50" size={12} /> All done!
            </span>}
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{background:`${tabColor}20`}}>
          <motion.div className="h-full rounded-full"
            style={{background:tabColor}}
            initial={{width:0}}
            animate={{width:`${totalItems>0?(totalLearned/totalItems)*100:0}%`}}
            transition={{duration:0.5,ease:"easeOut"}}/>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-24">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Cards grid */}
          <div className={`${active?"lg:col-span-2":"lg:col-span-3"}`}>
            <AnimatePresence mode="wait">
              <motion.div key={tab}
                initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                transition={{duration:0.2}}>
                  {tab === "stories" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {stories.length === 0 ? (
                        <div className="col-span-full text-center py-16 text-slate-400 font-body">
                          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl mb-3">📚</motion.div>
                          <p>Your story card will arrive soon!✨</p>
                        </div>
                      ) : (
                        stories.map((story, i) => (
                          <StoryCoverCard
                            key={story.id}
                            story={story}
                            index={i}
                            onClick={() => onSelectStory(story)}
                          />
                        ))
                      )}
                    </div>
                  )}
                {tab==="letters"&&(
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {ALPHABET.map(item=>(
                      <LetterCard key={item.letter} item={item} lang={lang} langMeta={langMeta}
                        active={active?.letter===item.letter}
                        onClick={()=>handleCardClick(item,item.letter)}/>
                    ))}
                  </div>
                )}
                {tab==="numbers"&&(
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {NUMBERS.map(item=>(
                      <NumberCard key={item.n} item={item} lang={lang} langMeta={langMeta}
                        active={active?.n===item.n}
                        onClick={()=>handleCardClick(item,item.n)}/>
                    ))}
                  </div>
                )}
                {tab==="words"&&(
                  <div className="grid sm:grid-cols-2 gap-3">
                    {COMMON_WORDS.map(item=>(
                      <WordCard key={item.en} item={item} lang={lang} langMeta={langMeta}
                        active={active?.en===item.en}
                        onClick={()=>handleCardClick(item,item.en)}/>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Detail panel */}
          <AnimatePresence>
            {active&&(
              <div className="lg:col-span-1">
                <DetailPanel item={active} lang={lang} langMeta={langMeta} type={tab}
                  onClose={()=>setActive(null)}/>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Tip */}
        <div className="mt-8 rounded-3xl p-4 border-2 border-white shadow-sm text-center" style={{background:C.yellowSoft}}>
          <p className="font-body text-sm text-slate-600">
            <EmojiSvg code="1f4a1" size={14} /> Tap any card to see all 16 language translations + hear the pronunciation!
          </p>
        </div>
      </div>
    </div>
  </div>
);
}