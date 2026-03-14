/**
 * src/utils/langConfig.js — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * CEREBRO CENTRAL DE IDIOMAS
 *
 * Este archivo es la única fuente de verdad para los idiomas de la app.
 * Ningún componente debe definir su propio array de idiomas ni su propio
 * detectLang. Todos importan desde aquí.
 *
 * Campos por idioma:
 *   code     — código BCP-47 de 2 letras (coincide con las keys de traducción)
 *   label    — nombre nativo del idioma (se muestra en la UI)
 *   flagCode — código ISO 3166-1 alpha-2 en minúsculas para EmojiSvg y FlagImg
 *   dir      — "ltr" | "rtl" (para el atributo dir del texto)
 *   voice    — código BCP-47 completo para SpeechSynthesis / TTS
 * ─────────────────────────────────────────────────────────────────────────
 */

export const LANGUAGES = [
  { code:"es", label:"Español",    flagCode:"1f1ea-1f1f8", dir:"ltr", voice:"es-ES" },
  { code:"fr", label:"Français",   flagCode:"1f1eb-1f1f7", dir:"ltr", voice:"fr-FR" },
  { code:"ar", label:"العربية",    flagCode:"1f1f8-1f1e6", dir:"rtl", voice:"ar-SA" },
  { code:"de", label:"Deutsch",    flagCode:"1f1e9-1f1ea", dir:"ltr", voice:"de-DE" },
  { code:"it", label:"Italiano",   flagCode:"1f1ee-1f1f9", dir:"ltr", voice:"it-IT" },
  { code:"pt", label:"Português",  flagCode:"1f1e7-1f1f7", dir:"ltr", voice:"pt-BR" },
  { code:"ru", label:"Русский",    flagCode:"1f1f7-1f1fa", dir:"ltr", voice:"ru-RU" },
  { code:"zh", label:"中文",        flagCode:"1f1e8-1f1f3", dir:"ltr", voice:"zh-CN" },
  { code:"ja", label:"日本語",      flagCode:"1f1ef-1f1f5", dir:"ltr", voice:"ja-JP" },
  { code:"ko", label:"한국어",      flagCode:"1f1f0-1f1f7", dir:"ltr", voice:"ko-KR" },
  { code:"hi", label:"हिंदी",      flagCode:"1f1ee-1f1f3", dir:"ltr", voice:"hi-IN" },
  { code:"nl", label:"Nederlands", flagCode:"1f1f3-1f1f1", dir:"ltr", voice:"nl-NL" },
  { code:"pl", label:"Polski",     flagCode:"1f1f5-1f1f1", dir:"ltr", voice:"pl-PL" },
  { code:"sv", label:"Svenska",    flagCode:"1f1f8-1f1ea", dir:"ltr", voice:"sv-SE" },
  { code:"tr", label:"Türkçe",     flagCode:"1f1f9-1f1f7", dir:"ltr", voice:"tr-TR" },
  { code:"bn", label:"বাংলা",      flagCode:"1f1e7-1f1e9", dir:"ltr", voice:"bn-BD" },
];

/**
 * getLang(code) — devuelve el objeto completo del idioma.
 * Fallback a "es" si el código no existe.
 */
export function getLang(code) {
  return LANGUAGES.find(l => l.code === code) ?? LANGUAGES[0];
}

/**
 * detectLang() — detecta el idioma preferido del usuario.
 * Orden de prioridad:
 *   1. localStorage ("kiddsy_lang") — el usuario lo eligió explícitamente
 *   2. navigator.language del dispositivo
 *   3. "es" como fallback (app de aprendizaje de inglés, base de usuarios hispanohablantes)
 */
export function detectLang() {
  const saved = localStorage.getItem("kiddsy_lang");
  if (saved && LANGUAGES.some(l => l.code === saved)) return saved;

  const browser = (navigator.language || navigator.userLanguage || "es")
    .slice(0, 2)
    .toLowerCase();

  return LANGUAGES.some(l => l.code === browser) ? browser : "es";
}
