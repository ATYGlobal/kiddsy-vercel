/**
 * src/utils/puzzleHelpers.js — Kiddsy
 * buildPuzzle, isSolved, speak — sin dependencias de React ni datos
 */

export function buildPuzzle(size) {
  const n = size * size;
  let t;
  do {
    t = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [t[i], t[j]] = [t[j], t[i]];
    }
  } while (t.every((v, idx) => v === idx)); // nunca devuelve ya-resuelto
  return t;
}

export const isSolved = t => t.every((v, i) => v === i);

export function speak(text, voice = "en-US") {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = voice; u.rate = 0.85; u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}
