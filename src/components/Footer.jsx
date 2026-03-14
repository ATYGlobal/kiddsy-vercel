/**
 * src/components/Footer.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Props: { onNav }
 * Secciones:
 *   · Newsletter "Kiddsy Club" con validación y estado de éxito
 *   · Links de navegación principales
 *   · Links legales (Aviso Legal, Privacidad)
 *   · Copyright
 * ─────────────────────────────────────────────────────────────────────────
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Heart, Shield, Sparkles, CheckCircle, Star, BookOpen } from "lucide-react";
import EmojiSvg from "../utils/EmojiSvg.jsx";

// ── Paleta ────────────────────────────────────────────────────────────────
const C = {
  blue:       "#1565C0",
  blueSoft:   "#E3F2FD",
  blueMid:    "#1976D2",
  yellow:     "#F9A825",
  yellowSoft: "#FFFDE7",
  orange:     "#E65100",
  green:      "#43A047",
  greenSoft:  "#E8F5E9",
  magenta:    "#D81B60",
  cyan:       "#00ACC1",
  slate:      "#64748B",
  slateLight: "#94A3B8",
};

const FF = "var(--font-display,'Nunito',ui-rounded,sans-serif)";
const FB = "var(--font-body,'Nunito',sans-serif)";
// AÑADE ESTE COMPONENTE ANTES DEL FOOTER PRINCIPAL
function ClimateBadge() {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <motion.a
        href="https://stripe.com/climate"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          borderRadius: 40,
          background: "linear-gradient(135deg, #0A4A3B, #1E7A5C)",
          border: "2px solid rgba(255,255,255,0.2)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          cursor: "pointer",
          textDecoration: "none",
          color: "white",
          fontFamily: "var(--font-display,'Nunito',sans-serif)",
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        {/* Icono de hoja / clima */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M12 3v12m0 0c-1.5 0-3 .5-3 2 0 1.5 1.5 2 3 2s3-.5 3-2c0-1.5-1.5-2-3-2z" />
          <path d="M6 8c2.5 0 4-1.5 4-3 0-1.5-1.5-3-4-3S2 3.5 2 5c0 1.5 1.5 3 4 3z" />
          <path d="M18 8c2.5 0 4-1.5 4-3 0-1.5-1.5-3-4-3s-4 1.5-4 3c0 1.5 1.5 3 4 3z" />
        </svg>
        
        <span>
          🌱 <strong>1%</strong> for the planet
        </span>
        
        {/* Logo de Stripe Climate */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
          <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" fill="white"/>
          <path d="M11 5.5c0 .3-.2.5-.5.5h-5c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5h5c.3 0 .5.2.5.5v1z" fill="white"/>
          <path d="M11 9.5c0 .3-.2.5-.5.5h-5c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5h5c.3 0 .5.2.5.5v1z" fill="white"/>
        </svg>
      </motion.a>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              width: 280,
              padding: "12px 16px",
              background: "white",
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              border: "2px solid #E2E8F0",
              zIndex: 100,
              textAlign: "center",
            }}
          >
            <div style={{ 
              width: 32, 
              height: 32, 
              borderRadius: "50%", 
              background: "#0A4A3B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px"
            }}>
              🌱
            </div>
            <h4 style={{ 
              fontFamily: "var(--font-display,'Nunito',sans-serif)", 
              fontWeight: 800, 
              fontSize: 14,
              color: "#0A4A3B",
              margin: "0 0 4px"
            }}>
              Kiddsy contribuye al clima 🌍
            </h4>
            <p style={{ 
              fontFamily: "var(--font-body,'Nunito',sans-serif)", 
              fontSize: 12,
              color: "#64748B",
              margin: 0,
              lineHeight: 1.5
            }}>
              Destinamos <strong>el 1% de todos los pagos</strong> a eliminar CO₂ de la atmósfera a través de Stripe Climate.
            </p>
            <div style={{
              marginTop: 8,
              paddingTop: 8,
              borderTop: "1px solid #E2E8F0",
              fontSize: 11,
              color: "#94A3B8"
            }}>
              Verificado por Stripe ✅
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// ── Decorative star ───────────────────────────────────────────────────────
function FloatingStar({ style }) {
  return (
    <motion.div
      style={{ position: "absolute", pointerEvents: "none", ...style }}
      animate={{ y: [0, -8, 0], rotate: [0, 15, -15, 0], opacity: [0.35, 0.65, 0.35] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
    >
      <Star size={style.size || 14} fill={style.color || C.yellow} color={style.color || C.yellow} strokeWidth={0}/>
    </motion.div>
  );
}
// ── Newsletter translations (16 langs + EN fallback) ─────────────────────
const NEWSLETTER_I18N = {
  en: {
    badge:       "Kiddsy Club",
    title:       "Join the adventure club!",
    subtitle:    "New stories, activities and surprises straight to your inbox. Good stuff only — never spam. ✨",
    placeholder: "your@email.com — we're waiting!",
    cta:         "Sign me up!",
    sending:     "Sending…",
    finePrint:   "Kiddsy Club newsletter · Unsubscribe anytime with one click ·",
    successTitle:"You're in the club! 🎉",
    successSub:  "Check your inbox — and don't forget the spam folder.",
    errEmpty:    "Enter your email first 📧",
    errInvalid:  "That doesn't look like a valid email 🙈",
  },
  es: {
    badge:       "Club Kiddsy",
    title:       "¡Únete al club de las aventuras!",
    subtitle:    "Nuevas historias, actividades y sorpresas directamente a tu correo. Solo cosas buenas — nunca spam. ✨",
    placeholder: "tu@email.com — ¡te esperamos!",
    cta:         "¡Apuntarme!",
    sending:     "Enviando…",
    finePrint:   "Newsletter Club Kiddsy · Puedes darte de baja en cada email con un clic ·",
    successTitle:"¡Ya eres del club! 🎉",
    successSub:  "Revisa tu bandeja de entrada — y no olvides la carpeta de spam.",
    errEmpty:    "Introduce tu email primero 📧",
    errInvalid:  "Ese email no parece válido 🙈",
  },
  fr: {
    badge:       "Club Kiddsy",
    title:       "Rejoins le club des aventures !",
    subtitle:    "Nouvelles histoires, activités et surprises dans ta boîte mail. Que des bonnes choses — jamais de spam. ✨",
    placeholder: "ton@email.com — on t'attend !",
    cta:         "Je m'inscris !",
    sending:     "Envoi…",
    finePrint:   "Newsletter Club Kiddsy · Tu peux te désabonner à tout moment ·",
    successTitle:"Tu fais partie du club ! 🎉",
    successSub:  "Vérifie ta boîte de réception — et n'oublie pas les spams.",
    errEmpty:    "Entre ton email d'abord 📧",
    errInvalid:  "Cet email ne semble pas valide 🙈",
  },
  ar: {
    badge:       "نادي كيدزي",
    title:       "انضم إلى نادي المغامرات!",
    subtitle:    "قصص ونشاطات ومفاجآت جديدة مباشرة إلى بريدك. أشياء جيدة فقط — لا رسائل مزعجة. ✨",
    placeholder: "بريدك@email.com — في انتظارك!",
    cta:         "سجّلني!",
    sending:     "جارٍ الإرسال…",
    finePrint:   "نشرة نادي كيدزي · يمكنك إلغاء الاشتراك في أي وقت ·",
    successTitle:"أنت الآن في النادي! 🎉",
    successSub:  "تحقق من صندوق الوارد — ولا تنسَ مجلد الرسائل المزعجة.",
    errEmpty:    "أدخل بريدك الإلكتروني أولاً 📧",
    errInvalid:  "هذا البريد لا يبدو صحيحاً 🙈",
  },
  de: {
    badge:       "Kiddsy Club",
    title:       "Tritt dem Abenteuer-Club bei!",
    subtitle:    "Neue Geschichten, Aktivitäten und Überraschungen direkt in dein Postfach. Nur Gutes — kein Spam. ✨",
    placeholder: "deine@email.com — wir warten!",
    cta:         "Ich bin dabei!",
    sending:     "Senden…",
    finePrint:   "Kiddsy Club Newsletter · Du kannst dich jederzeit abmelden ·",
    successTitle:"Du bist im Club! 🎉",
    successSub:  "Schau in deinen Posteingang — und vergiss den Spam-Ordner nicht.",
    errEmpty:    "Bitte zuerst E-Mail eingeben 📧",
    errInvalid:  "Diese E-Mail scheint ungültig zu sein 🙈",
  },
  it: {
    badge:       "Club Kiddsy",
    title:       "Unisciti al club delle avventure!",
    subtitle:    "Nuove storie, attività e sorprese direttamente nella tua casella. Solo cose belle — mai spam. ✨",
    placeholder: "la@tuaemail.com — ti aspettiamo!",
    cta:         "Iscrivimi!",
    sending:     "Invio…",
    finePrint:   "Newsletter Club Kiddsy · Puoi disiscriverti in qualsiasi momento ·",
    successTitle:"Sei nel club! 🎉",
    successSub:  "Controlla la tua posta in arrivo — e non dimenticare la cartella spam.",
    errEmpty:    "Inserisci prima la tua email 📧",
    errInvalid:  "Questa email non sembra valida 🙈",
  },
  pt: {
    badge:       "Clube Kiddsy",
    title:       "Entra no clube das aventuras!",
    subtitle:    "Novas histórias, atividades e surpresas direto no teu email. Só coisas boas — nunca spam. ✨",
    placeholder: "teu@email.com — estamos à espera!",
    cta:         "Quero entrar!",
    sending:     "Enviando…",
    finePrint:   "Newsletter Clube Kiddsy · Podes cancelar a inscrição a qualquer momento ·",
    successTitle:"Já és do clube! 🎉",
    successSub:  "Verifica a tua caixa de entrada — e não te esqueças da pasta de spam.",
    errEmpty:    "Insere o teu email primeiro 📧",
    errInvalid:  "Este email não parece válido 🙈",
  },
  ru: {
    badge:       "Клуб Kiddsy",
    title:       "Вступай в клуб приключений!",
    subtitle:    "Новые истории, занятия и сюрпризы прямо на твою почту. Только хорошее — никакого спама. ✨",
    placeholder: "твой@email.com — ждём тебя!",
    cta:         "Записаться!",
    sending:     "Отправка…",
    finePrint:   "Рассылка клуба Kiddsy · Ты можешь отписаться в любое время ·",
    successTitle:"Ты в клубе! 🎉",
    successSub:  "Проверь входящие — и не забудь папку «Спам».",
    errEmpty:    "Сначала введи email 📧",
    errInvalid:  "Этот email не выглядит действительным 🙈",
  },
  zh: {
    badge:       "Kiddsy 俱乐部",
    title:       "加入冒险俱乐部",
    subtitle:    "全新故事、活动和惊喜直接发到你的邮箱。只有好内容——从不发垃圾邮件。✨",
    placeholder: "你的@email.com — 我们等你！",
    cta:         "立即加入！",
    sending:     "发送中…",
    finePrint:   "Kiddsy 俱乐部通讯 · 随时可以一键退订 ·",
    successTitle:"你已加入俱乐部！🎉",
    successSub:  "请查看你的收件箱——别忘了垃圾邮件文件夹。",
    errEmpty:    "请先输入你的邮箱 📧",
    errInvalid:  "这个邮箱地址看起来无效 🙈",
  },
  ja: {
    badge:       "Kiddsyクラブ",
    title:       "冒険クラブに参加しよう！",
    subtitle:    "新しいお話・アクティビティ・サプライズをメールでお届け。良いものだけ——スパムなし。✨",
    placeholder: "あなたの@email.com — お待ちしています！",
    cta:         "参加する！",
    sending:     "送信中…",
    finePrint:   "Kiddsyクラブニュースレター · いつでも1クリックで退会できます ·",
    successTitle:"クラブへようこそ！🎉",
    successSub:  "受信トレイを確認してください——迷惑メールフォルダもご確認を。",
    errEmpty:    "まずメールアドレスを入力してください 📧",
    errInvalid:  "このメールアドレスは無効のようです 🙈",
  },
  ko: {
    badge:       "Kiddsy 클럽",
    title:       "모험 클럽에 가입하세요! ",
    subtitle:    "새로운 이야기, 활동, 깜짝 선물이 메일함으로 직접 배달됩니다. 좋은 것만——스팸 없음. ✨",
    placeholder: "당신의@email.com — 기다리고 있어요!",
    cta:         "가입하기!",
    sending:     "전송 중…",
    finePrint:   "Kiddsy 클럽 뉴스레터 · 언제든지 클릭 한 번으로 구독 취소 가능 ·",
    successTitle:"클럽에 오신 것을 환영합니다! 🎉",
    successSub:  "받은 편지함을 확인하세요——스팸 폴더도 잊지 마세요.",
    errEmpty:    "먼저 이메일을 입력해 주세요 📧",
    errInvalid:  "유효하지 않은 이메일 주소입니다 🙈",
  },
  bn: {
    badge:       "Kiddsy ক্লাব",
    title:       "অ্যাডভেঞ্চার ক্লাবে যোগ দাও! ",
    subtitle:    "নতুন গল্প, কার্যক্রম ও চমক সরাসরি তোমার ইনবক্সে। শুধু ভালো জিনিস — কখনো স্প্যাম নয়। ✨",
    placeholder: "তোমার@email.com — অপেক্ষায় আছি!",
    cta:         "যোগ দাও!",
    sending:     "পাঠানো হচ্ছে…",
    finePrint:   "Kiddsy ক্লাব নিউজলেটার · যেকোনো সময় এক ক্লিকে আনসাবস্ক্রাইব ·",
    successTitle:"তুমি ক্লাবে আছ! 🎉",
    successSub:  "তোমার ইনবক্স দেখো — স্প্যাম ফোল্ডারও দেখতে ভুলো না।",
    errEmpty:    "আগে তোমার ইমেইল দাও 📧",
    errInvalid:  "এই ইমেইলটি বৈধ মনে হচ্ছে না 🙈",
  },
  hi: {
    badge:       "Kiddsy क्लब",
    title:       "एडवेंचर क्लब में शामिल हों! ",
    subtitle:    "नई कहानियाँ, गतिविधियाँ और सरप्राइज़ सीधे आपके इनबॉक्स में। सिर्फ़ अच्छी चीज़ें — कभी स्पैम नहीं। ✨",
    placeholder: "आपका@email.com — आपका इंतज़ार है!",
    cta:         "जुड़ें!",
    sending:     "भेजा जा रहा है…",
    finePrint:   "Kiddsy क्लब न्यूज़लेटर · कभी भी एक क्लिक में अनसब्सक्राइब करें ·",
    successTitle:"आप क्लब में हैं! 🎉",
    successSub:  "अपना इनबॉक्स देखें — और स्पैम फ़ोल्डर भी चेक करें।",
    errEmpty:    "पहले अपना ईमेल दर्ज करें 📧",
    errInvalid:  "यह ईमेल पता मान्य नहीं लगता 🙈",
  },
  nl: {
    badge:       "Kiddsy Club",
    title:       "Word lid van de avonturenclub! ",
    subtitle:    "Nieuwe verhalen, activiteiten en verrassingen direct in je inbox. Alleen goede dingen — nooit spam. ✨",
    placeholder: "jouw@email.com — we wachten op je!",
    cta:         "Aanmelden!",
    sending:     "Verzenden…",
    finePrint:   "Kiddsy Club nieuwsbrief · Je kunt je altijd afmelden met één klik ·",
    successTitle:"Je zit in de club! 🎉",
    successSub:  "Controleer je inbox — en vergeet de spammap niet.",
    errEmpty:    "Voer eerst je e-mail in 📧",
    errInvalid:  "Dit e-mailadres lijkt ongeldig 🙈",
  },
  pl: {
    badge:       "Klub Kiddsy",
    title:       "Dołącz do klubu przygód! ",
    subtitle:    "Nowe historyjki, aktywności i niespodzianki prosto do Twojej skrzynki. Tylko dobre rzeczy — zero spamu. ✨",
    placeholder: "twój@email.com — czekamy na Ciebie!",
    cta:         "Zapisuję się!",
    sending:     "Wysyłanie…",
    finePrint:   "Newsletter Klubu Kiddsy · Możesz zrezygnować w dowolnym momencie jednym kliknięciem ·",
    successTitle:"Jesteś w klubie! 🎉",
    successSub:  "Sprawdź swoją skrzynkę — i nie zapomnij o folderze spam.",
    errEmpty:    "Najpierw wpisz swój adres e-mail 📧",
    errInvalid:  "Ten adres e-mail wydaje się nieprawidłowy 🙈",
  },
  no: {
    badge:       "Kiddsy-klubben",
    title:       "Bli med i eventyrklubben! ",
    subtitle:    "Nye historier, aktiviteter og overraskelser rett i innboksen din. Bare gode ting — aldri spam. ✨",
    placeholder: "din@email.com — vi venter på deg!",
    cta:         "Meld meg på!",
    sending:     "Sender…",
    finePrint:   "Kiddsy-klubben nyhetsbrev · Du kan melde deg av når som helst med ett klikk ·",
    successTitle:"Du er i klubben! 🎉",
    successSub:  "Sjekk innboksen din — og glem ikke søppelpostmappen.",
    errEmpty:    "Skriv inn e-posten din først 📧",
    errInvalid:  "Denne e-postadressen ser ikke gyldig ut 🙈",
  },
  sv: {
    badge:       "Kiddsy-klubben",
    title:       "Gå med i äventyrsklubb! ",
    subtitle:    "Nya berättelser, aktiviteter och överraskningar direkt till din inkorg. Bara bra saker — aldrig skräppost. ✨",
    placeholder: "din@email.com — vi väntar!",
    cta:         "Anmäl mig!",
    sending:     "Skickar…",
    finePrint:   "Kiddsy-klubbens nyhetsbrev · Du kan avprenumerera närsomhelst med ett klick ·",
    successTitle:"Du är med i klubben! 🎉",
    successSub:  "Kolla din inkorg — och glöm inte skräppostmappen.",
    errEmpty:    "Ange din e-post först 📧",
    errInvalid:  "Den här e-postadressen verkar ogiltig 🙈",
  },
};

function t(lang, key) {
  return (NEWSLETTER_I18N[lang] ?? NEWSLETTER_I18N["en"])[key];
}
// ── NewsletterBlock completo (listo para copiar y pegar) ───────────────────
function NewsletterBlock({ lang = "en" }) {
  const [email,   setEmail]   = useState("");
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleSubmit = async () => {
    if (!email.trim()) { 
      setError(t(lang, "errEmpty")); 
      return; 
    }
    if (!validateEmail(email)) { 
      setError(t(lang, "errInvalid")); 
      return; 
    }
    setError("");
    setLoading(true);

    // TODO: conectar a tu endpoint real, p.ej.:
    // await fetch("/api/newsletter", { method:"POST", body: JSON.stringify({ email, lang }) });
    await new Promise(r => setTimeout(r, 900)); // simula llamada API

    setLoading(false);
    setSuccess(true);
  };
  return (
    <div style={{
      position:     "relative",
      background:   "linear-gradient(135deg, #E3F2FD 0%, #FFFDE7 60%, #E8F5E9 100%)",
      borderRadius: 28,
      padding:      "28px 24px 24px",
      border:       "2.5px solid rgba(255,255,255,0.9)",
      boxShadow:    "0 8px 32px rgba(21,101,192,0.10), 0 2px 8px rgba(0,0,0,0.04)",
      overflow:     "hidden",
      marginBottom: 32,
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 100, height: 100, borderRadius: "50%",
        background: C.yellow + "22", pointerEvents: "none",
      }}/>
      <div style={{
        position: "absolute", bottom: -16, left: -16,
        width: 72, height: 72, borderRadius: "50%",
        background: C.blue + "18", pointerEvents: "none",
      }}/>

      {/* Floating stars */}
      <FloatingStar style={{ top: 10,  right: 40,  size: 12, color: C.yellow }}/>
      <FloatingStar style={{ top: 30,  right: 80,  size: 8,  color: C.cyan   }}/>
      <FloatingStar style={{ bottom:16, left: 32,  size: 10, color: C.magenta}}/>

      {/* Icon badge */}
      <div style={{
        display:         "inline-flex",
        alignItems:      "center",
        gap:             6,
        padding:         "5px 14px",
        borderRadius:    999,
        background:      C.blue,
        color:           "white",
        fontFamily:      FF,
        fontWeight:      800,
        fontSize:        11,
        letterSpacing:   "0.06em",
        textTransform:   "uppercase",
        marginBottom:    12,
        boxShadow:       `0 3px 10px ${C.blue}40`,
      }}>
        <Sparkles size={11}/> Kiddsy Club
      </div>

      {/* Heading */}
      <h3 style={{
        fontFamily:  FF,
        fontWeight:  900,
        fontSize:    "clamp(18px, 4vw, 24px)",
        color:       C.blue,
        margin:      "0 0 6px",
        lineHeight:  1.2,
      }}>
        {t(lang, "title")}
      </h3>
      <p style={{
        fontFamily:  FB,
        fontSize:    13,
        color:       C.slate,
        margin:      "0 0 18px",
        lineHeight:  1.5,
        maxWidth:    420,
      }}>
        {t(lang, "subtitle")}
      </p>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{   opacity: 0, scale: 0.92         }}
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          10,
              padding:      "14px 18px",
              borderRadius: 16,
              background:   C.greenSoft,
              border:       `2px solid ${C.green}44`,
            }}
          >
            <CheckCircle size={20} strokeWidth={2.5} style={{ color: C.green, flexShrink: 0 }}/>
            <div>
              <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 14, color: C.green }}>
                {t(lang, "successTitle")}
              </div>
              <div style={{ fontFamily: FB, fontSize: 12, color: C.slate, marginTop: 2 }}>
                {t(lang, "successSub")}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Input + Button row */}
            <div style={{
              display:   "flex",
              gap:       8,
              flexWrap:  "wrap",
            }}>
              {/* Email input */}
              <div style={{ flex: "1 1 220px", position: "relative" }}>
                <Mail
                  size={15}
                  strokeWidth={2}
                  style={{
                    position:  "absolute",
                    left:      13,
                    top:       "50%",
                    transform: "translateY(-50%)",
                    color:     C.slateLight,
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder={t(lang, "placeholder")}
                  style={{
                    width:        "100%",
                    padding:      "12px 14px 12px 36px",
                    borderRadius: 14,
                    border:       `2px solid ${error ? "#E53935" : "rgba(21,101,192,0.15)"}`,
                    background:   "white",
                    fontFamily:   FB,
                    fontSize:     13,
                    color:        "#1E293B",
                    outline:      "none",
                    boxShadow:    "0 2px 8px rgba(21,101,192,0.08)",
                    transition:   "border-color 0.15s",
                    boxSizing:    "border-box",
                  }}
                  onFocus={e  => { e.target.style.borderColor = C.blue; }}
                  onBlur={e   => { e.target.style.borderColor = error ? "#E53935" : "rgba(21,101,192,0.15)"; }}
                />
              </div>

              {/* Submit button */}
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: `0 6px 20px ${C.orange}55` }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding:      "12px 22px",
                  borderRadius: 14,
                  border:       "none",
                  background:   loading
                    ? C.slateLight
                    : `linear-gradient(135deg, ${C.yellow}, ${C.orange})`,
                  color:        loading ? "white" : "#7C2D00",
                  fontFamily:   FF,
                  fontWeight:   800,
                  fontSize:     13,
                  cursor:       loading ? "not-allowed" : "pointer",
                  whiteSpace:   "nowrap",
                  boxShadow:    `0 4px 14px ${C.yellow}55`,
                  display:      "flex",
                  alignItems:   "center",
                  gap:          6,
                  transition:   "background 0.2s",
                  flexShrink:   0,
                }}
              >
                {loading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    style={{ display: "flex" }}
                  >
                    <Sparkles size={14}/>
                  </motion.span>
                ) : (
                  <Sparkles size={14}/>
                )}
                {loading ? t(lang, "sending") : t(lang, "cta")}
              </motion.button>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontFamily: FB,
                    fontSize:   12,
                    color:      "#E53935",
                    marginTop:  7,
                    marginBottom: 0,
                  }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Fine print */}
            <p style={{
              fontFamily: FB,
              fontSize:   11,
              color:      C.slateLight,
              marginTop:  9,
              marginBottom: 0,
            }}>
              {t(lang, "finePrint")}{" "}
              <a href="mailto:hello@kiddsy.org"
                style={{ color: C.blue, textDecoration: "none", fontWeight: 600 }}>
                hello@kiddsy.org
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── NavLink helper ────────────────────────────────────────────────────────
function NavLink({ onClick, color, icon: Icon, children }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.06, y: -1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        display:      "inline-flex",
        alignItems:   "center",
        gap:          5,
        padding:      "5px 12px",
        borderRadius: 999,
        border:       `1.5px solid ${color}30`,
        background:   color + "10",
        color:        color,
        fontFamily:   FF,
        fontWeight:   700,
        fontSize:     12,
        cursor:       "pointer",
        transition:   "background 0.14s",
        whiteSpace:   "nowrap",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = color + "20"; }}
      onMouseLeave={e => { e.currentTarget.style.background = color + "10"; }}
    >
      {Icon && <Icon size={12} strokeWidth={2.5}/>}
      {children}
    </motion.button>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{
      height:     1,
      background: "linear-gradient(90deg, transparent, rgba(21,101,192,0.12) 30%, rgba(21,101,192,0.12) 70%, transparent)",
      margin:     "20px 0",
    }}/>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════
export default function Footer({ onNav, lang = "en" }) {
  return (
    <footer style={{
      position:   "relative",
      zIndex:     10,
      borderTop:  "2px solid rgba(21,101,192,0.07)",
      background: "linear-gradient(180deg, rgba(255,253,231,0) 0%, rgba(227,242,253,0.45) 100%)",
      padding:    "40px 0 24px",
    }}>
      <div style={{
        maxWidth:  680,
        margin:    "0 auto",
        padding:   "0 20px",
      }}>

        {/* ── Newsletter ─────────────────────────────────────────────── */}
        <NewsletterBlock lang={lang}/>

        {/* ── Logo + tagline ─────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <motion.button
            onClick={() => onNav("hero")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          10,
              background:   "none",
              border:       "none",
              cursor:       "pointer",
              marginBottom: 8,
            }}
          >
            <img src="/kiddsy-logo.png" alt="Kiddsy"
              style={{ width: 36, height: 36, objectFit: "contain" }}
            />
            <span style={{
              fontFamily: FF,
              fontWeight: 900,
              fontSize:   22,
              color:      C.blue,
            }}>Kiddsy</span>
          </motion.button>
          <p style={{
            fontFamily: FB,
            fontSize:   13,
            color:      C.slate,
            margin:     0,
            lineHeight: 1.5,
          }}>
            Bilingual stories for families learning English together <EmojiSvg code="1f30d" size={14} />
          </p>
        </div>

        <Divider/>

        {/* ── Main nav links ──────────────────────────────────────────── */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 16,
          marginBottom: 16,
        }}>
          <NavLink 
            onClick={() => onNav("subscription")} 
            color={C.blue}  
            icon={Sparkles}
          >
            Subscription
          </NavLink>
          
          <NavLink 
            onClick={() => onNav("collaborate")} 
            color={C.magenta}  
            icon={Heart}
          >
            Collaborate
          </NavLink>
        </div>
        {/* ── Climate badge ─────────────────────────────────────── */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
          gap: 16,
          flexWrap: "wrap",
        }}>
          <ClimateBadge />
        </div>

        <Divider/>
        
        {/* ── Legal links ────────────────────────────────────────────── */}
        <div style={{
          display:        "flex",
          flexWrap:       "wrap",
          justifyContent: "center",
          alignItems:     "center",
          gap:            10,
          marginBottom:   20,
        }}>
          <motion.button
            onClick={() => onNav("aviso-legal")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display:    "inline-flex",
              alignItems: "center",
              gap:        4,
              background: "none",
              border:     "none",
              cursor:     "pointer",
              fontFamily: FB,
              fontSize:   11,
              color:      C.slateLight,
              padding:    "4px 2px",
            }}
          >
            <Shield size={11} strokeWidth={2}/> Aviso Legal
          </motion.button>

          <span style={{ color: "#CBD5E1", fontSize: 11 }}>·</span>

          <motion.button
            onClick={() => onNav("privacidad")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display:    "inline-flex",
              alignItems: "center",
              gap:        4,
              background: "none",
              border:     "none",
              cursor:     "pointer",
              fontFamily: FB,
              fontSize:   11,
              color:      C.slateLight,
              padding:    "4px 2px",
            }}
          >
            <Shield size={11} strokeWidth={2}/> Privacidad
          </motion.button>

          <span style={{ color: "#CBD5E1", fontSize: 11 }}>·</span>

          <motion.button
            onClick={() => onNav("legal")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "none",
              border:     "none",
              cursor:     "pointer",
              fontFamily: FB,
              fontSize:   11,
              color:      C.slateLight,
              padding:    "4px 2px",
            }}
          >
            Help & FAQ
          </motion.button>

          <span style={{ color: "#CBD5E1", fontSize: 11 }}>·</span>

          <a
            href="mailto:hello@kiddsy.org"
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            4,
              fontFamily:     FB,
              fontSize:       11,
              color:          C.blue,
              textDecoration: "none",
              padding:        "4px 2px",
            }}
          >
            <Mail size={11} strokeWidth={2}/> hello@kiddsy.org
          </a>
        </div>

        {/* ── Copyright ──────────────────────────────────────────────── */}
        <div style={{ textAlign: "center" }}>
          <p style={{
            fontFamily: FB,
            fontSize:   11,
            color:      C.slateLight,
            margin:     0,
            display:    "flex",
            alignItems: "center",
            justifyContent: "center",
            gap:        5,
            flexWrap:   "wrap",
          }}>
            <span>© {new Date().getFullYear()} Kiddsy</span>
            <Heart size={10} fill={C.magenta} color={C.magenta} strokeWidth={0}/>
          </p>
        </div>

      </div>
    </footer>
  );
}