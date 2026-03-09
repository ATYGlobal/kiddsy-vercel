/**
 * src/pages/AnimalPuzzle.jsx — Kiddsy
 * ────────────────────────────────────────────────────────
 * ✅ 16 idiomas: ES FR AR DE IT PT RU ZH JA KO BN HI NL PL NO SV
 * ✅ Acepta prop  lang / onLangChange  desde App.jsx
 * ✅ Dropdown elegante para idioma (reemplaza los 3 flag-buttons)
 * ✅ Lógica de puzzle, fotos Unsplash y estilo "Burbuja" intactos
 * ────────────────────────────────────────────────────────
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight, Volume2, Globe, ChevronDown } from "lucide-react";

const C = {
  blue:"#1565C0", blueSoft:"#E3F2FD", red:"#E53935",
  yellow:"#F9A825", yellowSoft:"#FFFDE7",
  green:"#43A047", greenSoft:"#E8F5E9", magenta:"#D81B60", cyan:"#00ACC1",
};

// ── 16 idiomas ─────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code:"es", label:"Español",    flag:"🇪🇸", dir:"ltr", voice:"es-ES" },
  { code:"fr", label:"Français",   flag:"🇫🇷", dir:"ltr", voice:"fr-FR" },
  { code:"ar", label:"العربية",    flag:"🇸🇦", dir:"rtl", voice:"ar-SA" },
  { code:"de", label:"Deutsch",    flag:"🇩🇪", dir:"ltr", voice:"de-DE" },
  { code:"it", label:"Italiano",   flag:"🇮🇹", dir:"ltr", voice:"it-IT" },
  { code:"pt", label:"Português",  flag:"🇧🇷", dir:"ltr", voice:"pt-BR" },
  { code:"ru", label:"Русский",    flag:"🇷🇺", dir:"ltr", voice:"ru-RU" },
  { code:"zh", label:"中文",        flag:"🇨🇳", dir:"ltr", voice:"zh-CN" },
  { code:"ja", label:"日本語",      flag:"🇯🇵", dir:"ltr", voice:"ja-JP" },
  { code:"ko", label:"한국어",      flag:"🇰🇷", dir:"ltr", voice:"ko-KR" },
  { code:"bn", label:"বাংলা",     flag:"🇧🇩", dir:"ltr", voice:"bn-BD" },
  { code:"hi", label:"हिंदी",     flag:"🇮🇳", dir:"ltr", voice:"hi-IN" },
  { code:"nl", label:"Nederlands", flag:"🇳🇱", dir:"ltr", voice:"nl-NL" },
  { code:"pl", label:"Polski",     flag:"🇵🇱", dir:"ltr", voice:"pl-PL" },
  { code:"no", label:"Norsk",      flag:"🇳🇴", dir:"ltr", voice:"nb-NO" },
  { code:"sv", label:"Svenska",    flag:"🇸🇪", dir:"ltr", voice:"sv-SE" },
];

// ── Animales — nombres en 16 idiomas ────────────────────────────────────────
const ANIMALS = [
  {
    name:"Lion", emoji:"🦁", color:"#F9A825",
    img:"https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&h=600&fit=crop&auto=format",
    fact:"Lions can sleep up to 20 hours a day!",
    es:"León",    fr:"Lion",     ar:"أسد",    de:"Löwe",    it:"Leone",   pt:"Leão",
    ru:"Лев",     zh:"狮子",     ja:"ライオン",ko:"사자",    bn:"সিংহ",   hi:"शेर",
    nl:"Leeuw",   pl:"Lew",      no:"Løve",   sv:"Lejon",
  },
  {
    name:"Elephant", emoji:"🐘", color:"#78909C",
    img:"https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&h=600&fit=crop&auto=format",
    fact:"Elephants are the largest land animals on Earth!",
    es:"Elefante", fr:"Éléphant", ar:"فيل",  de:"Elefant",  it:"Elefante",pt:"Elefante",
    ru:"Слон",     zh:"大象",      ja:"ゾウ",  ko:"코끼리",   bn:"হাতি",   hi:"हाथी",
    nl:"Olifant",  pl:"Słoń",     no:"Elefant",sv:"Elefant",
  },
  {
    name:"Penguin", emoji:"🐧", color:"#37474F",
    img:"https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=600&h=600&fit=crop&auto=format",
    fact:"Penguins cannot fly but are amazing swimmers!",
    es:"Pingüino", fr:"Manchot",  ar:"بطريق", de:"Pinguin",  it:"Pinguino",pt:"Pinguim",
    ru:"Пингвин",  zh:"企鹅",      ja:"ペンギン",ko:"펭귄",   bn:"পেঙ্গুইন",hi:"पेंगुइन",
    nl:"Pinguïn",  pl:"Pingwin",  no:"Pingvin",sv:"Pingvin",
  },
  {
    name:"Giraffe", emoji:"🦒", color:"#F4A435",
    img:"https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=600&h=600&fit=crop&auto=format",
    fact:"Giraffes are the tallest animals — up to 6 meters!",
    es:"Jirafa",  fr:"Girafe",   ar:"زرافة", de:"Giraffe",  it:"Giraffa", pt:"Girafa",
    ru:"Жираф",   zh:"长颈鹿",    ja:"キリン", ko:"기린",     bn:"জিরাফ",  hi:"जिराफ",
    nl:"Giraf",   pl:"Żyrafa",   no:"Sjiraff",sv:"Giraff",
  },
  {
    name:"Tiger", emoji:"🐯", color:"#EF6C00",
    img:"https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600&h=600&fit=crop&auto=format",
    fact:"No two tigers have the same stripe pattern!",
    es:"Tigre",   fr:"Tigre",    ar:"نمر",   de:"Tiger",    it:"Tigre",   pt:"Tigre",
    ru:"Тигр",    zh:"老虎",      ja:"トラ",   ko:"호랑이",   bn:"বাঘ",     hi:"बाघ",
    nl:"Tijger",  pl:"Tygrys",   no:"Tiger",  sv:"Tiger",
  },
  {
    name:"Dolphin", emoji:"🐬", color:"#0288D1",
    img:"https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=600&h=600&fit=crop&auto=format",
    fact:"Dolphins call each other by name using unique whistles!",
    es:"Delfín",  fr:"Dauphin",  ar:"دلفين", de:"Delfin",   it:"Delfino", pt:"Golfinho",
    ru:"Дельфин", zh:"海豚",      ja:"イルカ", ko:"돌고래",   bn:"ডলফিন",  hi:"डॉल्फिन",
    nl:"Dolfijn", pl:"Delfin",   no:"Delfin", sv:"Delfin",
  },
  {
    name:"Panda", emoji:"🐼", color:"#546E7A",
    img:"https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&h=600&fit=crop&auto=format",
    fact:"A panda eats up to 40 kg of bamboo per day!",
    es:"Panda",   fr:"Panda",    ar:"الباندا",de:"Panda",   it:"Panda",   pt:"Panda",
    ru:"Панда",   zh:"熊猫",      ja:"パンダ",  ko:"판다",     bn:"পান্ডা",  hi:"पांडा",
    nl:"Panda",   pl:"Panda",    no:"Panda",  sv:"Panda",
  },
  {
    name:"Parrot", emoji:"🦜", color:"#2E7D32",
    img:"https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&h=600&fit=crop&auto=format",
    fact:"Parrots can learn and repeat human words!",
    es:"Loro",    fr:"Perroquet",ar:"ببغاء",  de:"Papagei",  it:"Pappagallo",pt:"Papagaio",
    ru:"Попугай", zh:"鹦鹉",      ja:"オウム",  ko:"앵무새",   bn:"টিয়া",   hi:"तोता",
    nl:"Papegaai",pl:"Papuga",   no:"Papegøye",sv:"Papegoja",
  },
  {
    name:"Koala", emoji:"🐨", color:"#8E24AA",
    img:"https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?w=600&h=600&fit=crop&auto=format",
    fact:"Koalas sleep up to 22 hours a day!",
    es:"Koala",   fr:"Koala",    ar:"كوالا",  de:"Koala",    it:"Koala",   pt:"Coala",
    ru:"Коала",   zh:"考拉",      ja:"コアラ",  ko:"코알라",   bn:"কোয়ালা", hi:"कोआला",
    nl:"Koala",   pl:"Koala",    no:"Koala",  sv:"Koala",
  },
  {
    name:"Fox", emoji:"🦊", color:"#E65100",
    img:"https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&h=600&fit=crop&auto=format",
    fact:"Foxes use Earth's magnetic field to hunt prey!",
    es:"Zorro",   fr:"Renard",   ar:"ثعلب",  de:"Fuchs",    it:"Volpe",   pt:"Raposa",
    ru:"Лиса",    zh:"狐狸",      ja:"キツネ", ko:"여우",     bn:"শেয়াল",  hi:"लोमड़ी",
    nl:"Vos",     pl:"Lis",      no:"Rev",    sv:"Räv",
  },
  {
    name:"Owl", emoji:"🦉", color:"#795548",
    img:"https://images.unsplash.com/photo-1490718720478-364a07a997cd?w=600&h=600&fit=crop&auto=format",
    fact:"Owls can rotate their heads 270 degrees!",
    es:"Búho",    fr:"Hibou",    ar:"بومة",  de:"Eule",     it:"Gufo",    pt:"Coruja",
    ru:"Сова",    zh:"猫头鹰",    ja:"フクロウ",ko:"부엉이",  bn:"পেঁচা",   hi:"उल्लू",
    nl:"Uil",     pl:"Sowa",     no:"Ugle",  sv:"Uggla",
  },
  {
    name:"Frog", emoji:"🐸", color:"#2E7D32",
    img:"https://images.unsplash.com/photo-1516901408945-6cf8e2b2e00b?w=600&h=600&fit=crop&auto=format",
    fact:"Frogs can jump 20 times their own body length!",
    es:"Rana",    fr:"Grenouille",ar:"ضفدع", de:"Frosch",   it:"Rana",    pt:"Sapo",
    ru:"Лягушка", zh:"青蛙",      ja:"カエル", ko:"개구리",   bn:"ব্যাঙ",   hi:"मेंढक",
    nl:"Kikker",  pl:"Żaba",     no:"Frosk", sv:"Groda",
  },
];

// ── Puzzle helpers ───────────────────────────────────────────────────────────
function buildPuzzle(size) {
  const tiles = Array.from({length:size*size},(_,i)=>i);
  for (let i=tiles.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[tiles[i],tiles[j]]=[tiles[j],tiles[i]];}
  return tiles;
}
function isSolved(tiles){return tiles.every((t,i)=>t===i);}

// ── Speech ───────────────────────────────────────────────────────────────────
function speak(text, voice="en-US"){
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang=voice; u.rate=0.85; u.pitch=1.1;
  window.speechSynthesis.speak(u);
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti({active}){
  const ps=Array.from({length:24},(_,i)=>({id:i,x:Math.random()*100,
    color:[C.blue,C.red,C.yellow,C.green,C.magenta,C.cyan][i%6],
    delay:Math.random()*0.5,size:Math.random()*10+7}));
  if (!active) return null;
  return <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
    {ps.map(p=><motion.div key={p.id} className="absolute rounded-sm top-0"
      style={{left:`${p.x}%`,width:p.size,height:p.size,background:p.color}}
      initial={{y:-20,opacity:1,rotate:0}} animate={{y:"110vh",opacity:0,rotate:720}}
      transition={{duration:1.5+Math.random(),delay:p.delay,ease:"easeIn"}}/>)}
  </div>;
}

// ── Language Dropdown ─────────────────────────────────────────────────────────
function LangDropdown({value, onChange}){
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
        style={{display:"flex",alignItems:"center",gap:8,padding:"9px 16px",borderRadius:999,
          border:"2.5px solid white",background:"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",
          boxShadow:"0 4px 16px rgba(67,160,71,0.18)",cursor:"pointer",
          fontFamily:"var(--font-display,'Nunito',sans-serif)",fontWeight:700,fontSize:13,color:C.green,
          whiteSpace:"nowrap",minWidth:165,justifyContent:"space-between"}}>
        <span style={{display:"flex",alignItems:"center",gap:6}}>
          <Globe size={13} style={{flexShrink:0}}/>
          <span style={{fontSize:18,lineHeight:1}}>{sel.flag}</span>
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
            width:210,background:"white",borderRadius:18,border:"2px solid rgba(67,160,71,0.15)",
            boxShadow:"0 16px 48px rgba(67,160,71,0.18)",overflow:"hidden",
            maxHeight:320,overflowY:"auto",scrollbarWidth:"thin"}}>
          <div style={{padding:"8px 14px 6px",borderBottom:"1.5px solid #E8F5E9",
            fontFamily:"var(--font-display,'Nunito',sans-serif)",fontWeight:700,fontSize:10,
            color:C.green,letterSpacing:"0.08em",textTransform:"uppercase",
            display:"flex",alignItems:"center",gap:5}}>
            <Globe size={10}/> Language
          </div>
          {LANGUAGES.map(l=>{
            const isA=l.code===value;
            return <button key={l.code} onClick={()=>{onChange(l.code);setOpen(false);}}
              style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"8px 14px",
                border:"none",background:isA?C.greenSoft:"transparent",cursor:"pointer",
                fontFamily:"var(--font-body,'Nunito',sans-serif)",fontWeight:isA?700:500,fontSize:13,
                color:isA?C.green:"#374151",textAlign:"left",
                borderLeft:isA?`3px solid ${C.green}`:"3px solid transparent"}}
              onMouseEnter={e=>{if(!isA)e.currentTarget.style.background="#F1F8E9";}}
              onMouseLeave={e=>{if(!isA)e.currentTarget.style.background="transparent";}}>
              <span style={{fontSize:18,lineHeight:1,flexShrink:0}}>{l.flag}</span>
              <span style={{flex:1}}>{l.label}</span>
              {isA&&<span style={{width:6,height:6,borderRadius:"50%",background:C.green,flexShrink:0}}/>}
            </button>;
          })}
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AnimalPuzzle({ lang:propLang, onLangChange }){
  const [animalIdx,setAnimalIdx] = useState(0);
  const [gridSize,setGridSize]   = useState(3);
  const [tiles,setTiles]         = useState(()=>buildPuzzle(3));
  const [selected,setSelected]   = useState(null);
  const [dragOver,setDragOver]   = useState(null);
  const [won,setWon]             = useState(false);
  const [confetti,setConfetti]   = useState(false);
  const [localLang,setLocalLang] = useState("es");
  const [moves,setMoves]         = useState(0);
  const [imgLoaded,setImgLoaded] = useState(false);
  const GRID_PX = 288;

  const lang    = propLang || localLang;
  const setLang = v=>{ setLocalLang(v); onLangChange?.(v); };

  const langMeta = LANGUAGES.find(l=>l.code===lang)||LANGUAGES[0];
  const animal   = ANIMALS[animalIdx];

  const reset=useCallback((aIdx=animalIdx,gSize=gridSize)=>{
    setTiles(buildPuzzle(gSize)); setSelected(null); setDragOver(null);
    setWon(false); setMoves(0); setImgLoaded(false);
  },[animalIdx,gridSize]);

  useEffect(()=>{ reset(animalIdx,gridSize); },[animalIdx,gridSize]);

  const handleTileDown=idx=>{
    if (won) return;
    if (selected===null){setSelected(idx);}
    else {
      const t=[...tiles]; [t[selected],t[idx]]=[t[idx],t[selected]];
      setTiles(t); setMoves(m=>m+1); setSelected(null); setDragOver(null);
      if (isSolved(t)) setTimeout(()=>{setWon(true);setConfetti(true);setTimeout(()=>setConfetti(false),2500);},200);
    }
  };

  const prev=()=>setAnimalIdx(i=>(i-1+ANIMALS.length)%ANIMALS.length);
  const next=()=>setAnimalIdx(i=>(i+1)%ANIMALS.length);

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{background:"linear-gradient(150deg,#E8F5E9 0%,#FFFDE7 50%,#E3F2FD 100%)"}}>
      <Confetti active={confetti}/>

      {/* Header */}
      <div className="text-center py-10 px-4">
        <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring"}}
          className="text-6xl mb-3 inline-block">🧩</motion.div>
        <motion.h1 initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}}
          className="font-display text-4xl md:text-5xl mb-2" style={{color:C.green}}>Animal Puzzle</motion.h1>
        <p className="font-body text-slate-500 text-lg">Tap two pieces to swap them — build the animal! 🎨</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-3 px-4 mb-6">
        {/* Grid size */}
        <div className="flex bg-white/80 rounded-full p-1 shadow-sm gap-1">
          {[3,4].map(s=>(
            <button key={s} onClick={()=>setGridSize(s)}
              className="px-5 py-2 rounded-full font-display text-sm transition-all"
              style={{background:gridSize===s?C.green:"transparent",color:gridSize===s?"white":"#6B7280"}}>
              {s}×{s}
            </button>
          ))}
        </div>
        {/* Lang dropdown */}
        <LangDropdown value={lang} onChange={setLang}/>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Left — Puzzle */}
          <div className="flex flex-col items-center">
            {/* Animal nav */}
            <div className="flex items-center gap-4 mb-5 bg-white/80 rounded-full px-5 py-3 shadow-sm">
              <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={prev}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{background:C.green,color:"white"}}><ChevronLeft size={18}/></motion.button>
              <div className="text-center">
                <div className="font-display text-xl" style={{color:C.green}}>{animal.emoji} {animal.name}</div>
                <div className="font-body text-sm text-slate-400" dir={langMeta.dir}>{animal[lang]||animal.name}</div>
              </div>
              <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={next}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{background:C.green,color:"white"}}><ChevronRight size={18}/></motion.button>
            </div>

            {/* Stats */}
            <div className="flex gap-3 mb-4">
              <div className="px-4 py-2 bg-white rounded-full font-display text-sm shadow-sm" style={{color:C.green}}>
                🎯 {moves} swaps
              </div>
              {won&&<motion.div initial={{scale:0}} animate={{scale:1}}
                className="px-4 py-2 rounded-full font-display text-sm text-white shadow-lg"
                style={{background:C.green}}>🏆 Solved!</motion.div>}
            </div>

            {/* Win banner */}
            <AnimatePresence>
              {won&&<motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                className="w-full text-center py-4 rounded-3xl font-display text-xl text-white mb-4 shadow-lg"
                style={{background:`linear-gradient(135deg,${C.green},#1B5E20)`}}>
                🎉 You built the {animal.name}! Amazing!
              </motion.div>}
            </AnimatePresence>

            {/* Puzzle grid */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
              style={{width:GRID_PX,height:GRID_PX,background:C.blueSoft}}>
              <img src={animal.img} alt="" className="hidden" onLoad={()=>setImgLoaded(true)}/>
              {!imgLoaded&&<div className="absolute inset-0 flex items-center justify-center">
                <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}}
                  className="text-4xl">{animal.emoji}</motion.div>
              </div>}
              {imgLoaded&&<div className="grid gap-0.5 p-0.5"
                style={{gridTemplateColumns:`repeat(${gridSize},1fr)`,width:"100%",height:"100%",background:"#CBD5E1"}}>
                {tiles.map((tile,idx)=>{
                  const srcCol=tile%gridSize, srcRow=Math.floor(tile/gridSize);
                  const isSel=selected===idx, isDO=dragOver===idx;
                  return <motion.div key={idx}
                    className="relative cursor-pointer overflow-hidden rounded-sm border-2 transition-all"
                    style={{borderColor:isSel?C.yellow:isDO?C.green:"transparent",
                      boxShadow:isSel?`0 0 0 2px ${C.yellow},0 4px 16px rgba(0,0,0,0.3)`:"none",zIndex:isSel?10:1}}
                    whileHover={{scale:won?1:1.04}} whileTap={{scale:won?1:0.95}}
                    onClick={()=>handleTileDown(idx)}
                    onMouseEnter={()=>{if(selected!==null&&selected!==idx)setDragOver(idx);}}
                    onMouseLeave={()=>setDragOver(null)}>
                    <div className="w-full h-full" style={{
                      backgroundImage:`url(${animal.img})`,backgroundSize:`${gridSize*100}%`,
                      backgroundPosition:`${srcCol*100/Math.max(gridSize-1,1)}% ${srcRow*100/Math.max(gridSize-1,1)}%`,
                      backgroundRepeat:"no-repeat",aspectRatio:"1"}}/>
                    {!won&&<div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white font-display"
                      style={{background:"rgba(0,0,0,0.25)",fontSize:9}}>{tile+1}</div>}
                  </motion.div>;
                })}
              </div>}
            </div>

            {/* Reference */}
            <div className="mt-4 flex items-center gap-3">
              <div className="rounded-2xl overflow-hidden border-2 border-white shadow-md" style={{width:64,height:64}}>
                <img src={animal.img} alt={animal.name} className="w-full h-full object-cover"/>
              </div>
              <p className="font-body text-xs text-slate-400">Reference image</p>
            </div>

            <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}} onClick={()=>reset()}
              className="mt-4 flex items-center gap-2 px-6 py-3 rounded-2xl font-display text-white shadow-md"
              style={{background:C.red}}><RotateCcw size={16}/> Shuffle</motion.button>
          </div>

          {/* Right — Info */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl" style={{color:C.green}}>{animal.emoji} {animal.name}</h3>

            {/* How to say it — muestra idioma activo + inglés */}
            <div className="bg-white/90 rounded-3xl p-6 shadow-md border-2 border-white">
              <h4 className="font-display text-base mb-3 text-slate-500">How to say it</h4>

              {/* Active language highlighted */}
              <div className="flex items-center justify-between py-3 px-4 rounded-2xl mb-2"
                style={{background:C.greenSoft,border:`2px solid ${C.green}`}}>
                <div className="flex items-center gap-2">
                  <span style={{fontSize:20}}>{langMeta.flag}</span>
                  <span className="font-body text-sm text-slate-500">{langMeta.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl" style={{color:C.green}} dir={langMeta.dir}>
                    {animal[lang]||animal.name}
                  </span>
                  <button onClick={()=>speak(animal[lang]||animal.name, langMeta.voice)}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{background:C.green,color:"white"}}><Volume2 size={13}/></button>
                </div>
              </div>

              {/* English always */}
              <div className="flex items-center justify-between py-2.5">
                <span className="font-body text-sm text-slate-400">English 🇬🇧</span>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg" style={{color:C.blue}}>{animal.name}</span>
                  <button onClick={()=>speak(animal.name,"en-US")}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{background:C.blueSoft,color:C.blue}}><Volume2 size={13}/></button>
                </div>
              </div>

              {/* 3 other langs as teasers */}
              {LANGUAGES.filter(l=>l.code!==lang).slice(0,3).map(l=>(
                <div key={l.code} className="flex items-center justify-between py-2 border-t border-slate-50">
                  <span className="font-body text-sm text-slate-300">{l.flag} {l.label}</span>
                  <span className="font-body text-sm text-slate-400" dir={l.dir}>{animal[l.code]||""}</span>
                </div>
              ))}
            </div>

            {/* Fun fact */}
            <div className="rounded-3xl p-5 border-2 border-white shadow-sm" style={{background:C.yellowSoft}}>
              <div className="font-display text-sm mb-1" style={{color:C.yellow}}>🌟 Fun fact!</div>
              <p className="font-body text-slate-600 text-sm leading-relaxed">{animal.fact}</p>
            </div>

            {/* Gallery */}
            <div>
              <h4 className="font-display text-base mb-3" style={{color:C.green}}>More animals</h4>
              <div className="grid grid-cols-4 gap-2">
                {ANIMALS.map((a,i)=>(
                  <motion.button key={i} whileHover={{scale:1.08}} whileTap={{scale:0.94}}
                    onClick={()=>setAnimalIdx(i)}
                    className="aspect-square rounded-2xl overflow-hidden"
                    style={{border:animalIdx===i?`3px solid ${C.green}`:"3px solid white",
                      boxShadow:animalIdx===i?`0 0 0 2px ${C.green}`:"0 2px 8px rgba(0,0,0,0.08)"}}>
                    <img src={a.img} alt={a.name} className="w-full h-full object-cover"/>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* How to play */}
            <div className="rounded-3xl p-4 border-2 border-white shadow-sm" style={{background:C.blueSoft}}>
              <p className="font-display text-sm mb-1" style={{color:C.blue}}>💡 How to play</p>
              <p className="font-body text-xs text-slate-600">
                Tap a piece to select it (it glows yellow), then tap another to swap. Keep swapping until you build the complete animal!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
