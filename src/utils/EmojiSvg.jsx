/**
 * src/utils/EmojiSvg.jsx — Kiddsy
 * Renderiza cualquier emoji como SVG vía Twemoji CDN.
 * Uso: <EmojiSvg code="1f981" size={32} />
 */
export default function EmojiSvg({ code, size = 24, alt = "", style = {} }) {
  return (
    <img
      src={`https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${code}.svg`}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      style={{
        display:    "inline-block",
        objectFit:  "contain",
        flexShrink: 0,
        userSelect: "none",
        ...style,
      }}
    />
  );
}