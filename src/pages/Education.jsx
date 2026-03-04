/**
 * Education.jsx — Kiddsy Loop
 * Interactive Letters A–Z + Numbers 0–9 with Web Speech API voices
 * Bilingual: says letter name + example word in English & chosen language
 * Color-coded rainbow keyboard aesthetic
 */

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music, Hash, Type, RefreshCw } from "lucide-react";

// ─── Brand palette ─────────────────────────────────────────────────────────
const C = {
  blue:    "#1565C0",
  blueSoft:"#E3F2FD",
  red:     "#E53935",
  redSoft: "#FFEBEE",
  yellow:  "#F9A825",
  yellowSoft:"#FFF8E1",
  green:   "#43A047",
  greenSoft:"#E8F5E9",
  magenta: "#D81B60",
  magentaSoft:"#FCE4EC",
  cyan:    "#00ACC1",
  cyanSoft:"#E0F7FA",
  orange:  "#E65100",
  orangeSoft:"#FBE9E7",
  purple:  "#6A1B9A",
  purpleSoft:"#F3E5F5",
};

// Rainbow cycle for tiles
const TILE_COLORS = [
  { bg: C.redSoft,     border: C.red,     text: C.red },
  { bg: C.orangeSoft,  border: C.orange,  text: C.orange },
  { bg: C.yellowSoft,  border: C.yellow,  text: C.yellow },
  { bg: C.greenSoft,   border: C.green,   text: C.green },
  { bg: C.cyanSoft,    border: C.cyan,    text: C.cyan },
  { bg: C.blueSoft,    border: C.blue,    text: C.blue },
  { bg: C.purpleSoft,  border: C.purple,  text: C.purple },
  { bg: C.magentaSoft, border: C.magenta, text: C.magenta },
];

// ─── Alphabet data with emoji illustrations ────────────────────────────────
const ALPHABET = [
  { letter: "A", word: "Apple",     emoji: "🍎", es: "Manzana",  fr: "Pomme",    ar: "تفاحة"  },
  { letter: "B", word: "Butterfly", emoji: "🦋", es: "Mariposa", fr: "Papillon", ar: "فراشة"  },
  { letter: "C", word: "Cat",       emoji: "🐱", es: "Gato",     fr: "Chat",     ar: "قطة"    },
  { letter: "D", word: "Dog",       emoji: "🐶", es: "Perro",    fr: "Chien",    ar: "كلب"    },
  { letter: "E", word: "Elephant",  emoji: "🐘", es: "Elefante", fr: "Éléphant", ar: "فيل"    },
  { letter: "F", word: "Fish",      emoji: "🐟", es: "Pez",      fr: "Poisson",  ar: "سمكة"   },
  { letter: "G", word: "Grapes",    emoji: "🍇", es: "Uvas",     fr: "Raisins",  ar: "عنب"    },
  { letter: "H", word: "House",     emoji: "🏠", es: "Casa",     fr: "Maison",   ar: "منزل"   },
  { letter: "I", word: "Ice cream", emoji: "🍦", es: "Helado",   fr: "Glace",    ar: "آيس كريم"},
  { letter: "J", word: "Jellyfish", emoji: "🪼", es: "Medusa",   fr: "Méduse",   ar: "قنديل البحر"},
  { letter: "K", word: "Kite",      emoji: "🪁", es: "Cometa",   fr: "Cerf-volant",ar: "طائرة ورقية"},
  { letter: "L", word: "Lion",      emoji: "🦁", es: "León",     fr: "Lion",     ar: "أسد"    },
  { letter: "M", word: "Moon",      emoji: "🌙", es: "Luna",     fr: "Lune",     ar: "قمر"    },
  { letter: "N", word: "Night",     emoji: "🌃", es: "Noche",    fr: "Nuit",     ar: "ليل"    },
  { letter: "O", word: "Orange",    emoji: "🍊", es: "Naranja",  fr: "Orange",   ar: "برتقالة"},
  { letter: "P", word: "Penguin",   emoji: "🐧", es: "Pingüino", fr: "Manchot",  ar: "بطريق"  },
  { letter: "Q", word: "Queen",     emoji: "👑", es: "Reina",    fr: "Reine",    ar: "ملكة"   },
  { letter: "R", word: "Rainbow",   emoji: "🌈", es: "Arcoíris", fr: "Arc-en-ciel",ar: "قوس قزح"},
  { letter: "S", word: "Star",      emoji: "⭐", es: "Estrella", fr: "Étoile",   ar: "نجمة"   },
  { letter: "T", word: "Train",     emoji: "🚂", es: "Tren",     fr: "Train",    ar: "قطار"   },
  { letter: "U", word: "Umbrella",  emoji: "☂️", es: "Paraguas", fr: "Parapluie",ar: "مظلة"   },
  { letter: "V", word: "Violin",    emoji: "🎻", es: "Violín",   fr: "Violon",   ar: "كمان"   },
  { letter: "W", word: "Whale",     emoji: "🐋", es: "Ballena",  fr: "Baleine",  ar: "حوت"    },
  { letter: "X", word: "Xylophone", emoji: "🎵", es: "Xilófono", fr: "Xylophone",ar: "زيلوفون"},
  { letter: "Y", word: "Yak",       emoji: "🦬", es: "Yak",      fr: "Yak",      ar: "ياك"    },
  { letter: "Z", word: "Zebra",     emoji: "🦓", es: "Cebra",    fr: "Zèbre",    ar: "حمار وحشي"},
];

const NUMBERS = [
  { num: 0, word: "Zero",  emoji: "🫧", es: "Cero",   fr: "Zéro",   ar: "صفر"  },
  { num: 1, word: "One",   emoji: "☝️", es: "Uno",    fr: "Un",      ar: "واحد" },
  { num: 2, word: "Two",   emoji: "✌️", es: "Dos",    fr: "Deux",   ar: "اثنان"},
  { num: 3, word: "Three", emoji: "🤟", es: "Tres",   fr: "Trois",  ar: "ثلاثة"},
  { num: 4, word: "Four",  emoji: "🖖", es: "Cuatro", fr: "Quatre", ar: "أربعة"},
  { num: 5, word: "Five",  emoji: "🖐️", es: "Cinco",  fr: "Cinq",   ar: "خمسة" },
  { num: 6, word: "Six",   emoji: "🎲", es: "Seis",   fr: "Six",    ar: "ستة"  },
  { num: 7, word: "Seven", emoji: "7️⃣", es: "Siete",  fr: "Sept",   ar: "سبعة" },
  { num: 8, word: "Eight", emoji: "8️⃣", es: "Ocho",   fr: "Huit",   ar: "ثمانية"},
  { num: 9, word: "Nine",  emoji: "9️⃣", es: "Nueve",  fr: "Nueve",  ar: "تسعة" },
];

// ─── Web Speech API helper ─────────────────────────────────────────────────
function speak(text, lang = "en-US", rate = 0.85) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang;
  utt.rate = rate;
  utt.pitch = 1.2;
  window.speechSynthesis.speak(utt);
}

const LANG_VOICE = { es: "es-ES", fr: "fr-FR", ar: "ar-SA" };
const LANG_LABELS = { es: "Español 🇪🇸", fr: "Français 🇫🇷", ar: "العربية 🇸🇦" };

// ─── Big display card ──────────────────────────────────────────────────────
function DisplayCard({ item, mode, lang, onSpeak }) {
  const label    = mode === "letters" ? item.letter : String(item.num);
  const wordEn   = item.word;
  const wordLang = item[lang];
  const colorIdx = mode === "letters"
    ? (item.letter.charCodeAt(0) - 65) % TILE_COLORS.length
    : item.num % TILE_COLORS.length;
  const color = TILE_COLORS[colorIdx];

  return (
    <motion.div
      key={label}
      initial={{ scale: 0.7, opacity: 0, rotate: -4 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      exit={{ scale: 0.7, opacity: 0, rotate: 4 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className="rounded-5xl overflow-hidden border-4 shadow-2xl"
      style={{ borderColor: color.border, background: color.bg }}
    >
      {/* Giant letter/number */}
      <div className="text-center pt-10 pb-4">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="font-display leading-none"
          style={{ fontSize: "clamp(80px, 20vw, 160px)", color: color.text }}
        >
          {label}
        </motion.div>
      </div>

      {/* Emoji illustration */}
      <div className="text-center text-7xl mb-4">{item.emoji}</div>

      {/* Word display */}
      <div className="text-center px-6 pb-8 space-y-2">
        <div
          className="font-display text-3xl md:text-4xl"
          style={{ color: color.text }}
        >
          {wordEn}
        </div>
        <div
          className="font-body text-xl font-semibold italic"
          dir={lang === "ar" ? "rtl" : "ltr"}
          style={{ color: `${color.text}CC` }}
        >
          {wordLang}
        </div>
      </div>

      {/* Speak buttons */}
      <div className="flex gap-3 justify-center px-6 pb-8">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => onSpeak("en")}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-display text-white shadow-md text-sm"
          style={{ background: color.border }}
        >
          <Volume2 size={16} /> 🇬🇧 English
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => onSpeak("native")}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-display shadow-md text-sm border-2"
          style={{ borderColor: color.border, color: color.text, background: "white" }}
        >
          <Volume2 size={16} /> {LANG_LABELS[lang].split(" ")[1]}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Keyboard tile ─────────────────────────────────────────────────────────
function KeyTile({ label, colorIdx, isActive, onClick }) {
  const color = TILE_COLORS[colorIdx % TILE_COLORS.length];
  return (
    <motion.button
      whileHover={{ scale: 1.12, y: -3 }}
      whileTap={{ scale: 0.91 }}
      onClick={onClick}
      className="aspect-square rounded-2xl font-display text-xl md:text-2xl flex items-center justify-center border-2 transition-all"
      style={{
        background: isActive ? color.border : color.bg,
        borderColor: color.border,
        color: isActive ? "white" : color.text,
        boxShadow: isActive
          ? `0 6px 20px ${color.border}50`
          : `0 2px 8px ${color.border}20`,
      }}
    >
      {label}
    </motion.button>
  );
}

// ─── Main Education Component ──────────────────────────────────────────────
export default function Education() {
  const [mode, setMode] = useState("letters");
  const [selected, setSelected] = useState(ALPHABET[0]);
  const [lang, setLang] = useState("es");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const data = mode === "letters" ? ALPHABET : NUMBERS;

  const handleSelect = useCallback((item) => {
    setSelected(item);
    if (soundEnabled) {
      // Short ping sound via oscillator
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 600 + (mode === "letters"
          ? (item.letter.charCodeAt(0) - 65) * 20
          : item.num * 40);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } catch (e) {}
    }
  }, [soundEnabled, mode]);

  const handleSpeak = (speakLang) => {
    if (!soundEnabled) return;
    const label = mode === "letters" ? selected.letter : String(selected.num);
    const word  = selected.word;
    const native = selected[lang];

    if (speakLang === "en") {
      speak(`${label}. ${word}`, "en-US");
    } else {
      speak(native, LANG_VOICE[lang] || "es-ES", 0.8);
    }
  };

  const selectNext = () => {
    const idx = data.indexOf(selected);
    if (idx < data.length - 1) handleSelect(data[idx + 1]);
  };
  const selectPrev = () => {
    const idx = data.indexOf(selected);
    if (idx > 0) handleSelect(data[idx - 1]);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(160deg, #FFFDE7 0%, #E3F2FD 50%, #F0FFF4 100%)" }}
    >
      {/* Header */}
      <div className="text-center py-10 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="text-6xl mb-4 inline-block"
        >
          🎵
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl mb-2"
          style={{ color: C.blue }}
        >
          Letters & Numbers
        </motion.h1>
        <p className="font-body text-slate-500 text-lg">
          Tap any letter or number to see and hear it! 🔊
        </p>
      </div>

      {/* Controls bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 px-4 mb-8">
        {/* Mode toggle */}
        <div className="flex bg-white/80 rounded-full p-1.5 shadow-sm gap-1">
          <button
            onClick={() => { setMode("letters"); setSelected(ALPHABET[0]); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-display text-sm transition-all"
            style={{
              background: mode === "letters" ? C.blue : "transparent",
              color: mode === "letters" ? "white" : "#6B7280",
            }}
          >
            <Type size={14} /> A–Z
          </button>
          <button
            onClick={() => { setMode("numbers"); setSelected(NUMBERS[0]); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-display text-sm transition-all"
            style={{
              background: mode === "numbers" ? C.red : "transparent",
              color: mode === "numbers" ? "white" : "#6B7280",
            }}
          >
            <Hash size={14} /> 0–9
          </button>
        </div>

        {/* Language picker */}
        <div className="flex bg-white/80 rounded-full p-1.5 shadow-sm gap-1">
          {Object.entries(LANG_LABELS).map(([code, label]) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className="px-3 py-2 rounded-full font-display text-xs transition-all"
              style={{
                background: lang === code ? C.green : "transparent",
                color: lang === code ? "white" : "#6B7280",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sound toggle */}
        <button
          onClick={() => setSoundEnabled((s) => !s)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 shadow-sm"
          style={{ color: soundEnabled ? C.blue : "#9CA3AF" }}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: Display card */}
          <div>
            <AnimatePresence mode="wait">
              <DisplayCard
                key={mode === "letters" ? selected.letter : selected.num}
                item={selected}
                mode={mode}
                lang={lang}
                onSpeak={handleSpeak}
              />
            </AnimatePresence>

            {/* Prev / Next */}
            <div className="flex justify-between mt-4 px-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={selectPrev}
                disabled={data.indexOf(selected) === 0}
                className="px-5 py-2.5 rounded-2xl font-display text-sm bg-white shadow-sm border border-slate-100 disabled:opacity-30"
                style={{ color: C.blue }}
              >
                ← Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={selectNext}
                disabled={data.indexOf(selected) === data.length - 1}
                className="px-5 py-2.5 rounded-2xl font-display text-sm bg-white shadow-sm border border-slate-100 disabled:opacity-30"
                style={{ color: C.blue }}
              >
                Next →
              </motion.button>
            </div>
          </div>

          {/* Right: Keyboard grid */}
          <div>
            <h3 className="font-display text-lg mb-4 text-center" style={{ color: C.blue }}>
              {mode === "letters" ? "Tap a letter 🔤" : "Tap a number 🔢"}
            </h3>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid gap-2.5"
                style={{
                  gridTemplateColumns: mode === "letters"
                    ? "repeat(7, 1fr)"
                    : "repeat(5, 1fr)",
                }}
              >
                {data.map((item, i) => {
                  const label = mode === "letters" ? item.letter : String(item.num);
                  const isActive = mode === "letters"
                    ? selected.letter === item.letter
                    : selected.num === item.num;
                  return (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.018 }}
                    >
                      <KeyTile
                        label={label}
                        colorIdx={i}
                        isActive={isActive}
                        onClick={() => handleSelect(item)}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Fun fact about current selection */}
            <motion.div
              key={mode === "letters" ? selected.letter : selected.num}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-3xl p-5 border-2 border-white shadow-sm bg-white/80 text-center"
            >
              <div className="text-4xl mb-2">{selected.emoji}</div>
              <div className="font-display text-xl" style={{ color: C.blue }}>
                {mode === "letters" ? selected.letter : selected.num} is for{" "}
                <span style={{ color: C.red }}>{selected.word}</span>
              </div>
              <div
                className="font-body text-sm mt-1 font-semibold"
                style={{ color: C.green }}
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                {selected[lang]}
              </div>

              {/* Auto-speak button */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleSpeak("en")}
                className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-display text-sm text-white shadow-md"
                style={{ background: C.blue }}
              >
                <Volume2 size={14} /> Say it in English
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
