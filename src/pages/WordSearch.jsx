/**
 * src/pages/WordSearch.jsx — Kiddsy
 * ────────────────────────────────────────────────────────
 * ✅ 16 idiomas: ES FR AR DE IT PT RU ZH JA KO BN HI NL PL NO SV
 * ✅ Acepta prop  lang / onLangChange  desde App.jsx
 * ✅ Dropdown elegante para tema + idioma (reemplaza botones horizontales)
 * ────────────────────────────────────────────────────────
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, CheckCircle, Star, ChevronDown, Globe } from "lucide-react";

const C = {
  blue:"#1565C0", blueSoft:"#E3F2FD", red:"#E53935",
  yellow:"#F9A825", yellowSoft:"#FFFDE7",
  green:"#43A047", magenta:"#D81B60", cyan:"#00ACC1",
};

// ── 16 idiomas ─────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code:"es", label:"Español",    flag:"🇪🇸", dir:"ltr" },
  { code:"fr", label:"Français",   flag:"🇫🇷", dir:"ltr" },
  { code:"ar", label:"العربية",    flag:"🇸🇦", dir:"rtl" },
  { code:"de", label:"Deutsch",    flag:"🇩🇪", dir:"ltr" },
  { code:"it", label:"Italiano",   flag:"🇮🇹", dir:"ltr" },
  { code:"pt", label:"Português",  flag:"🇧🇷", dir:"ltr" },
  { code:"ru", label:"Русский",    flag:"🇷🇺", dir:"ltr" },
  { code:"zh", label:"中文",        flag:"🇨🇳", dir:"ltr" },
  { code:"ja", label:"日本語",      flag:"🇯🇵", dir:"ltr" },
  { code:"ko", label:"한국어",      flag:"🇰🇷", dir:"ltr" },
  { code:"bn", label:"বাংলা",     flag:"🇧🇩", dir:"ltr" },
  { code:"hi", label:"हिंदी",     flag:"🇮🇳", dir:"ltr" },
  { code:"nl", label:"Nederlands", flag:"🇳🇱", dir:"ltr" },
  { code:"pl", label:"Polski",     flag:"🇵🇱", dir:"ltr" },
  { code:"no", label:"Norsk",      flag:"🇳🇴", dir:"ltr" },
  { code:"sv", label:"Svenska",    flag:"🇸🇪", dir:"ltr" },
];

const WORD_COLORS = [
  { bg:"#FFF9C4", border:"#F9A825", text:"#E65100" },
  { bg:"#C8E6C9", border:"#43A047", text:"#1B5E20" },
  { bg:"#BBDEFB", border:"#1565C0", text:"#0D47A1" },
  { bg:"#F8BBD0", border:"#D81B60", text:"#880E4F" },
  { bg:"#B2EBF2", border:"#00ACC1", text:"#006064" },
  { bg:"#E1BEE7", border:"#8E24AA", text:"#4A148C" },
];

// ── Packs de palabras — traducidos a 16 idiomas ────────────────────────────
const PACKS = [
  {
    name:"Animals 🐾", emoji:"🦁",
    words:[
      { en:"CAT",   es:"Gato",    fr:"Chat",    ar:"قطة",   de:"Katze",    it:"Gatto",    pt:"Gato",    ru:"Кошка",   zh:"猫",   ja:"ネコ",    ko:"고양이",  bn:"বিড়াল", hi:"बिल्ली",  nl:"Kat",     pl:"Kot",    no:"Katt",   sv:"Katt"   },
      { en:"DOG",   es:"Perro",   fr:"Chien",   ar:"كلب",   de:"Hund",     it:"Cane",     pt:"Cão",     ru:"Собака",  zh:"狗",   ja:"イヌ",    ko:"개",      bn:"কুকুর",  hi:"कुत्ता",  nl:"Hond",    pl:"Pies",   no:"Hund",   sv:"Hund"   },
      { en:"FISH",  es:"Pez",     fr:"Poisson", ar:"سمكة",  de:"Fisch",    it:"Pesce",    pt:"Peixe",   ru:"Рыба",    zh:"鱼",   ja:"サカナ",  ko:"물고기",  bn:"মাছ",    hi:"मछली",    nl:"Vis",     pl:"Ryba",   no:"Fisk",   sv:"Fisk"   },
      { en:"BIRD",  es:"Pájaro",  fr:"Oiseau",  ar:"طائر",  de:"Vogel",    it:"Uccello",  pt:"Pássaro", ru:"Птица",   zh:"鸟",   ja:"トリ",    ko:"새",      bn:"পাখি",   hi:"पक्षी",   nl:"Vogel",   pl:"Ptak",   no:"Fugl",   sv:"Fågel"  },
      { en:"LION",  es:"León",    fr:"Lion",    ar:"أسد",   de:"Löwe",     it:"Leone",    pt:"Leão",    ru:"Лев",     zh:"狮子", ja:"ライオン",ko:"사자",    bn:"সিংহ",   hi:"शेर",     nl:"Leeuw",   pl:"Lew",    no:"Løve",   sv:"Lejon"  },
      { en:"BEAR",  es:"Oso",     fr:"Ours",    ar:"دب",    de:"Bär",      it:"Orso",     pt:"Urso",    ru:"Медведь", zh:"熊",   ja:"クマ",    ko:"곰",      bn:"ভালুক",  hi:"भालू",    nl:"Beer",    pl:"Niedźwiedź",no:"Bjørn",sv:"Björn" },
    ],
  },
  {
    name:"Family 👪", emoji:"👨‍👩‍👧",
    words:[
      { en:"MOM",  es:"Mamá",  fr:"Maman",    ar:"أم",    de:"Mama",    it:"Mamma",    pt:"Mãe",     ru:"Мама",   zh:"妈妈",  ja:"ママ",    ko:"엄마",   bn:"মা",      hi:"माँ",     nl:"Mama",    pl:"Mama",   no:"Mamma",  sv:"Mamma"  },
      { en:"DAD",  es:"Papá",  fr:"Papa",     ar:"أب",    de:"Papa",    it:"Papà",     pt:"Pai",     ru:"Папа",   zh:"爸爸",  ja:"パパ",    ko:"아빠",   bn:"বাবা",    hi:"पापा",    nl:"Papa",    pl:"Tata",   no:"Pappa",  sv:"Pappa"  },
      { en:"BABY", es:"Bebé",  fr:"Bébé",     ar:"رضيع",  de:"Baby",    it:"Bebè",     pt:"Bebê",    ru:"Малыш",  zh:"宝宝",  ja:"アカちゃん",ko:"아기",  bn:"শিশু",    hi:"शिशु",    nl:"Baby",    pl:"Niemowlę",no:"Baby",  sv:"Baby"   },
      { en:"LOVE", es:"Amor",  fr:"Amour",    ar:"حب",    de:"Liebe",   it:"Amore",    pt:"Amor",    ru:"Любовь", zh:"爱",    ja:"アイ",    ko:"사랑",   bn:"ভালোবাসা",hi:"प्यार",  nl:"Liefde",  pl:"Miłość", no:"Kjærlighet",sv:"Kärlek"},
      { en:"HOME", es:"Hogar", fr:"Maison",   ar:"منزل",  de:"Heim",    it:"Casa",     pt:"Lar",     ru:"Дом",    zh:"家",    ja:"イエ",    ko:"집",     bn:"বাড়ি",    hi:"घर",      nl:"Thuis",   pl:"Dom",    no:"Hjem",   sv:"Hem"    },
      { en:"PLAY", es:"Jugar", fr:"Jouer",    ar:"لعب",   de:"Spielen", it:"Giocare",  pt:"Brincar", ru:"Играть", zh:"玩",    ja:"あそぶ",  ko:"놀다",   bn:"খেলা",    hi:"खेलना",   nl:"Spelen",  pl:"Grać",   no:"Leke",   sv:"Leka"   },
    ],
  },
  {
    name:"School 📚", emoji:"🏫",
    words:[
      { en:"BOOK",  es:"Libro",    fr:"Livre",     ar:"كتاب",  de:"Buch",      it:"Libro",    pt:"Livro",   ru:"Книга",  zh:"书",  ja:"ホン",   ko:"책",    bn:"বই",      hi:"किताब",   nl:"Boek",    pl:"Książka",  no:"Bok",    sv:"Bok"    },
      { en:"PEN",   es:"Pluma",    fr:"Stylo",     ar:"قلم",   de:"Stift",     it:"Penna",    pt:"Caneta",  ru:"Ручка",  zh:"笔",  ja:"ペン",   ko:"펜",    bn:"কলম",     hi:"कलम",     nl:"Pen",     pl:"Długopis", no:"Penn",   sv:"Penna"  },
      { en:"DESK",  es:"Mesa",     fr:"Bureau",    ar:"مكتب",  de:"Schreibtisch",it:"Scrivania",pt:"Mesa",   ru:"Стол",   zh:"桌子",ja:"ツクエ", ko:"책상",  bn:"ডেস্ক",   hi:"मेज़",    nl:"Bureau",  pl:"Biurko",   no:"Pult",   sv:"Skrivbord"},
      { en:"READ",  es:"Leer",     fr:"Lire",      ar:"قراءة", de:"Lesen",     it:"Leggere",  pt:"Ler",     ru:"Читать", zh:"读",  ja:"ヨむ",   ko:"읽다",  bn:"পড়া",     hi:"पढ़ना",   nl:"Lezen",   pl:"Czytać",   no:"Lese",   sv:"Läsa"   },
      { en:"WRITE", es:"Escribir", fr:"Écrire",    ar:"كتابة", de:"Schreiben", it:"Scrivere", pt:"Escrever",ru:"Писать", zh:"写",  ja:"かく",   ko:"쓰다",  bn:"লেখা",    hi:"लिखना",   nl:"Schrijven",pl:"Pisać",   no:"Skrive", sv:"Skriva" },
      { en:"LEARN", es:"Aprender", fr:"Apprendre", ar:"تعلم",  de:"Lernen",    it:"Imparare", pt:"Aprender",ru:"Учить",  zh:"学",  ja:"まなぶ", ko:"배우다", bn:"শেখা",    hi:"सीखना",   nl:"Leren",   pl:"Uczyć",    no:"Lære",   sv:"Lära"   },
    ],
  },
  {
    name:"Food 🍎", emoji:"🥦",
    words:[
      { en:"APPLE", es:"Manzana", fr:"Pomme",  ar:"تفاحة", de:"Apfel", it:"Mela",  pt:"Maçã",   ru:"Яблоко", zh:"苹果", ja:"リンゴ", ko:"사과", bn:"আপেল", hi:"सेब",   nl:"Appel", pl:"Jabłko", no:"Eple",  sv:"Äpple" },
      { en:"BREAD", es:"Pan",     fr:"Pain",   ar:"خبز",   de:"Brot",  it:"Pane",  pt:"Pão",    ru:"Хлеб",   zh:"面包", ja:"パン",   ko:"빵",   bn:"রুটি",  hi:"रोटी",  nl:"Brood", pl:"Chleb",  no:"Brød",  sv:"Bröd"  },
      { en:"MILK",  es:"Leche",   fr:"Lait",   ar:"حليب",  de:"Milch", it:"Latte", pt:"Leite",  ru:"Молоко", zh:"牛奶", ja:"ミルク", ko:"우유", bn:"দুধ",   hi:"दूध",    nl:"Melk",  pl:"Mleko",  no:"Melk",  sv:"Mjölk" },
      { en:"RICE",  es:"Arroz",   fr:"Riz",    ar:"أرز",   de:"Reis",  it:"Riso",  pt:"Arroz",  ru:"Рис",    zh:"米饭", ja:"コメ",   ko:"쌀",   bn:"চাল",   hi:"चावल",  nl:"Rijst", pl:"Ryż",    no:"Ris",   sv:"Ris"   },
      { en:"EGG",   es:"Huevo",   fr:"Œuf",    ar:"بيضة",  de:"Ei",    it:"Uovo",  pt:"Ovo",    ru:"Яйцо",   zh:"鸡蛋", ja:"タマゴ", ko:"달걀", bn:"ডিম",   hi:"अंडा",  nl:"Ei",    pl:"Jajko",  no:"Egg",   sv:"Ägg"   },
      { en:"SOUP",  es:"Sopa",    fr:"Soupe",  ar:"شوربة", de:"Suppe", it:"Zuppa", pt:"Sopa",   ru:"Суп",    zh:"汤",   ja:"スープ", ko:"수프", bn:"স্যুপ",hi:"सूप",   nl:"Soep",  pl:"Zupa",   no:"Suppe", sv:"Soppa" },
    ],
  },
  {
    name:"Colors 🌈", emoji:"🎨",
    words:[
      { en:"RED",    es:"Rojo",     fr:"Rouge",   ar:"أحمر", de:"Rot",   it:"Rosso",  pt:"Vermelho",ru:"Красный",zh:"红",  ja:"アカ",  ko:"빨강", bn:"লাল",    hi:"लाल",    nl:"Rood",  pl:"Czerwony", no:"Rød",    sv:"Röd"   },
      { en:"BLUE",   es:"Azul",     fr:"Bleu",    ar:"أزرق", de:"Blau",  it:"Blu",    pt:"Azul",    ru:"Синий",  zh:"蓝",  ja:"アオ",  ko:"파랑", bn:"নীল",    hi:"नीला",   nl:"Blauw", pl:"Niebieski",no:"Blå",    sv:"Blå"   },
      { en:"GREEN",  es:"Verde",    fr:"Vert",    ar:"أخضر", de:"Grün",  it:"Verde",  pt:"Verde",   ru:"Зелёный",zh:"绿",  ja:"ミドリ",ko:"초록", bn:"সবুজ",   hi:"हरा",    nl:"Groen", pl:"Zielony",  no:"Grønn",  sv:"Grön"  },
      { en:"PINK",   es:"Rosa",     fr:"Rose",    ar:"وردي", de:"Rosa",  it:"Rosa",   pt:"Rosa",    ru:"Розовый",zh:"粉",  ja:"ピンク",ko:"분홍", bn:"গোলাপী", hi:"गुलाबी", nl:"Roze",  pl:"Różowy",   no:"Rosa",   sv:"Rosa"  },
      { en:"GOLD",   es:"Oro",      fr:"Or",      ar:"ذهبي", de:"Gold",  it:"Oro",    pt:"Ouro",    ru:"Золото", zh:"金",  ja:"キン",  ko:"금색", bn:"সোনালী", hi:"सोना",   nl:"Goud",  pl:"Złoto",    no:"Gull",   sv:"Guld"  },
      { en:"WHITE",  es:"Blanco",   fr:"Blanc",   ar:"أبيض", de:"Weiß",  it:"Bianco", pt:"Branco",  ru:"Белый",  zh:"白",  ja:"シロ",  ko:"흰색", bn:"সাদা",   hi:"सफ़ेद",  nl:"Wit",   pl:"Biały",    no:"Hvit",   sv:"Vit"   },
    ],
  },
];

const GRID_SIZE = 10;

// ── Grid builder ────────────────────────────────────────────────────────────
function buildGrid(words) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(""));
  const placed = [];
  const DIRS = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];
  for (const wordObj of words) {
    const word = wordObj.en;
    let ok = false, tries = 0;
    while (!ok && tries++ < 200) {
      const [dr,dc] = DIRS[Math.floor(Math.random()*DIRS.length)];
      const r = Math.floor(Math.random()*GRID_SIZE);
      const c = Math.floor(Math.random()*GRID_SIZE);
      const cells = []; let valid = true;
      for (let i = 0; i < word.length; i++) {
        const nr=r+dr*i, nc=c+dc*i;
        if (nr<0||nr>=GRID_SIZE||nc<0||nc>=GRID_SIZE||
           (grid[nr][nc]!==""&&grid[nr][nc]!==word[i])){valid=false;break;}
        cells.push({r:nr,c:nc});
      }
      if (valid) { cells.forEach(({r,c},i)=>{grid[r][c]=word[i];}); placed.push({word:wordObj,cells}); ok=true; }
    }
  }
  for (let r=0;r<GRID_SIZE;r++) for (let c=0;c<GRID_SIZE;c++)
    if (!grid[r][c]) grid[r][c]=letters[Math.floor(Math.random()*letters.length)];
  return {grid,placed};
}

// ── Confetti ────────────────────────────────────────────────────────────────
function Confetti({active}) {
  const ps = Array.from({length:20},(_,i)=>({id:i,x:Math.random()*100,
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

// ── Dropdown genérico ────────────────────────────────────────────────────────
function Dropdown({label, children, minWidth=160}) {
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h);
  },[]);
  return (
    <div ref={ref} style={{position:"relative",zIndex:40}}>
      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={()=>setOpen(o=>!o)}
        style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",borderRadius:999,
          border:"2.5px solid white",background:"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",
          boxShadow:"0 4px 16px rgba(21,101,192,0.14)",cursor:"pointer",
          fontFamily:"var(--font-display,'Nunito',sans-serif)",fontWeight:700,fontSize:14,color:C.blue,
          whiteSpace:"nowrap",minWidth,justifyContent:"space-between"}}>
        {label}
        <motion.span animate={{rotate:open?180:0}} transition={{duration:0.2}} style={{display:"flex"}}>
          <ChevronDown size={13}/>
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {open&&<motion.div initial={{opacity:0,y:-8,scale:0.97}} animate={{opacity:1,y:0,scale:1}}
          exit={{opacity:0,y:-8,scale:0.97}} transition={{duration:0.15}}
          style={{position:"absolute",top:"calc(100% + 8px)",left:0,minWidth:220,
            background:"white",borderRadius:18,border:"2px solid rgba(21,101,192,0.12)",
            boxShadow:"0 16px 48px rgba(21,101,192,0.18)",overflow:"hidden",
            maxHeight:300,overflowY:"auto",scrollbarWidth:"thin"}}>
          {children(()=>setOpen(false))}
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

function DropdownItem({active,onClick,children}) {
  return <button onClick={onClick}
    style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 14px",
      border:"none",background:active?C.blueSoft:"transparent",cursor:"pointer",
      fontFamily:"var(--font-body,'Nunito',sans-serif)",fontWeight:active?700:500,fontSize:13,
      color:active?C.blue:"#374151",textAlign:"left",
      borderLeft:active?`3px solid ${C.blue}`:"3px solid transparent"}}
    onMouseEnter={e=>{if(!active)e.currentTarget.style.background="#F0F9FF";}}
    onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}>
    {children}
    {active&&<span style={{width:6,height:6,borderRadius:"50%",background:C.blue,marginLeft:"auto",flexShrink:0}}/>}
  </button>;
}

// ── Main ────────────────────────────────────────────────────────────────────
export default function WordSearch({ lang:propLang, onLangChange }) {
  const [packIdx,setPackIdx] = useState(0);
  const [localLang,setLocalLang] = useState("es");
  const lang = propLang || localLang;
  const setLang = v => { setLocalLang(v); onLangChange?.(v); };

  const [gameData,setGameData] = useState(null);
  const [selecting,setSelecting] = useState(false);
  const [selection,setSelection] = useState([]);
  const [found,setFound] = useState([]);
  const [confetti,setConfetti] = useState(false);
  const [won,setWon] = useState(false);

  const langMeta = LANGUAGES.find(l=>l.code===lang)||LANGUAGES[0];
  const pack = PACKS[packIdx];

  const startGame = useCallback((pIdx=packIdx)=>{
    setGameData(buildGrid(PACKS[pIdx].words));
    setFound([]); setSelection([]); setSelecting(false); setWon(false);
  },[packIdx]);

  useEffect(()=>{ startGame(packIdx); },[packIdx]);

  const checkSel = sel=>{
    if (!gameData||sel.length<2) return;
    const k  = sel.map(c=>`${c.r},${c.c}`).join("|");
    const rk = [...sel].reverse().map(c=>`${c.r},${c.c}`).join("|");
    gameData.placed.forEach(({word,cells},wi)=>{
      if (found.includes(wi)) return;
      const wk = cells.map(c=>`${c.r},${c.c}`).join("|");
      if (k===wk||rk===wk){
        const nf=[...found,wi]; setFound(nf);
        if (nf.length===gameData.placed.length){setWon(true);setConfetti(true);setTimeout(()=>setConfetti(false),2500);}
      }
    });
  };

  const cellStyle=(r,c)=>{
    if (!gameData) return {};
    for (const wi of found){
      if (gameData.placed[wi].cells.some(x=>x.r===r&&x.c===c)){
        const col=WORD_COLORS[wi%WORD_COLORS.length]; return {background:col.bg,color:col.text,fontWeight:700};
      }
    }
    if (selection.some(x=>x.r===r&&x.c===c)) return {background:C.yellow+"80",color:C.blue,fontWeight:700};
    return {};
  };

  const onStart=(r,c)=>{setSelecting(true);setSelection([{r,c}]);};
  const onEnter=(r,c)=>{
    if (!selecting) return;
    const f=selection[0]; if (!f) return;
    const dr=Math.sign(r-f.r),dc=Math.sign(c-f.c);
    const len=Math.max(Math.abs(r-f.r),Math.abs(c-f.c))+1;
    if (dr!==0&&dc!==0&&Math.abs(r-f.r)!==Math.abs(c-f.c)) return;
    setSelection(Array.from({length:len},(_,i)=>({r:f.r+dr*i,c:f.c+dc*i})));
  };
  const onEnd=()=>{ if (!selecting) return; setSelecting(false); checkSel(selection); setSelection([]); };

  return (
    <div className="min-h-screen" style={{background:"linear-gradient(150deg,#E3F2FD 0%,#FFFDE7 50%,#E8F5E9 100%)"}}>
      <Confetti active={confetti}/>

      {/* Header */}
      <div className="text-center py-10 px-4">
        <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring"}}
          className="text-6xl mb-3 inline-block">🔍</motion.div>
        <motion.h1 initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}}
          className="font-display text-4xl md:text-5xl mb-2" style={{color:C.blue}}>Word Search</motion.h1>
        <p className="font-body text-slate-500 text-lg">
          Find the English words — see them in {langMeta.flag} {langMeta.label}! 🕵️
        </p>
      </div>

      {/* ── Controls ── */}
      <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:10,padding:"0 16px 24px"}}>

        {/* Pack dropdown */}
        <Dropdown minWidth={185} label={<><span style={{fontSize:18}}>{pack.emoji}</span><span>{pack.name}</span></>}>
          {close=>PACKS.map((p,i)=>(
            <DropdownItem key={i} active={packIdx===i} onClick={()=>{setPackIdx(i);startGame(i);close();}}>
              <span style={{fontSize:22}}>{p.emoji}</span><span>{p.name}</span>
            </DropdownItem>
          ))}
        </Dropdown>

        {/* Lang dropdown */}
        <Dropdown minWidth={175} label={<><Globe size={14}/><span style={{fontSize:18}}>{langMeta.flag}</span><span>{langMeta.label}</span></>}>
          {close=>[
            <div key="hdr" style={{padding:"8px 14px 6px",borderBottom:"1.5px solid #EFF6FF",
              fontFamily:"var(--font-display,'Nunito',sans-serif)",fontWeight:700,fontSize:10,
              color:C.blue,letterSpacing:"0.08em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:5}}>
              <Globe size={10}/> Translation language
            </div>,
            ...LANGUAGES.map(l=>(
              <DropdownItem key={l.code} active={lang===l.code} onClick={()=>{setLang(l.code);close();}}>
                <span style={{fontSize:18,lineHeight:1,flexShrink:0}}>{l.flag}</span>
                <span>{l.label}</span>
              </DropdownItem>
            ))
          ]}
        </Dropdown>

        {/* New puzzle */}
        <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}} onClick={()=>startGame()}
          style={{display:"flex",alignItems:"center",gap:6,padding:"10px 20px",borderRadius:999,
            border:"2.5px solid white",background:C.red,color:"white",cursor:"pointer",
            fontFamily:"var(--font-display,'Nunito',sans-serif)",fontWeight:700,fontSize:14,
            boxShadow:"0 4px 16px rgba(229,57,53,0.3)",whiteSpace:"nowrap"}}>
          <RotateCcw size={14}/> New puzzle
        </motion.button>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        {won&&<motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
          className="text-center mb-6 py-4 rounded-3xl font-display text-2xl text-white shadow-xl"
          style={{background:`linear-gradient(135deg,${C.green},#2E7D32)`}}>
          🏆 You found all the words! Amazing! 🎉
        </motion.div>}

        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Grid */}
          <div>
            <div className="grid gap-1 p-3 rounded-3xl shadow-xl border-4 border-white select-none"
              style={{gridTemplateColumns:`repeat(${GRID_SIZE},1fr)`,background:C.blueSoft}}
              onMouseLeave={onEnd} onTouchEnd={onEnd}>
              {gameData&&gameData.grid.map((row,r)=>row.map((letter,c)=>(
                <motion.div key={`${r}-${c}`}
                  className="aspect-square flex items-center justify-center rounded-lg font-display cursor-pointer transition-all"
                  style={{background:"white",color:C.blue,fontSize:"clamp(11px,2vw,16px)",...cellStyle(r,c)}}
                  onMouseDown={()=>onStart(r,c)} onMouseEnter={()=>onEnter(r,c)}
                  onMouseUp={onEnd} onTouchStart={()=>onStart(r,c)}>
                  {letter}
                </motion.div>
              )))}
            </div>
          </div>

          {/* Word list */}
          <div>
            <h3 className="font-display text-xl mb-4" style={{color:C.blue}}>
              Find these words ({found.length}/{pack.words.length})
            </h3>
            <div className="space-y-2">
              {gameData&&gameData.placed.map(({word},wi)=>{
                const isFound=found.includes(wi);
                const col=WORD_COLORS[wi%WORD_COLORS.length];
                return <motion.div key={wi} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}}
                  transition={{delay:wi*0.06}}
                  className="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all"
                  style={{background:isFound?col.bg:"white",borderColor:isFound?col.border:"#E2E8F0"}}>
                  {isFound
                    ? <CheckCircle size={18} style={{color:col.text}}/>
                    : <div className="w-4 h-4 rounded-full border-2 border-slate-300"/>}
                  <div className="flex-1">
                    <div className="font-display text-lg" style={{color:isFound?col.text:C.blue}}>
                      {isFound?word.en:"?".repeat(word.en.length)}
                    </div>
                    <div className="font-body text-sm text-slate-500" dir={langMeta.dir}>
                      {word[lang]||word.en}
                    </div>
                  </div>
                  {isFound&&<Star size={16} style={{color:col.text}}/>}
                </motion.div>;
              })}
            </div>
            <div className="mt-6 rounded-3xl p-4 border-2 border-white shadow-sm" style={{background:C.yellowSoft}}>
              <p className="font-display text-sm mb-1" style={{color:C.yellow}}>💡 How to play</p>
              <p className="font-body text-xs text-slate-600">
                Click and drag to select a word. Words go in any direction — horizontal, vertical or diagonal!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
