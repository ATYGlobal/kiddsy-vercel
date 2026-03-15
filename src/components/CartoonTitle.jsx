/**
 * src/components/CartoonTitle.jsx
 * Título con efecto "Sticker" (borde grueso) usando SVG.
 * Sin dependencias externas.
 */
export default function CartoonTitle({ 
  children, 
  fill = "#1565C0",      // Color de la letra
  stroke = "#BBDEFB",    // Color del borde
  size = 44,             // Tamaño de fuente
  className = "" 
}) {
  const text = String(children);
  
  // Cálculo dinámico del ancho: aproximación basada en el tamaño de fuente
  // Fredoka es una fuente ancha, multiplicamos por 0.65 para evitar cortes.
  const estW = Math.max(150, text.length * size * 0.65 + 40);
  const estH = size * 1.5;
  
  // El grosor del borde es proporcional al tamaño del texto (aprox 12%)
  const strokeWidth = Math.max(2, size * 0.12);

  return (
    <span 
      className={`inline-block select-none ${className}`}
      style={{ lineHeight: 1 }}
      aria-label={text}
    >
      <svg 
        width={estW} 
        height={estH}
        viewBox={`0 0 ${estW} ${estH}`}
        style={{ 
          display: "block", 
          maxWidth: "100%", 
          overflow: "visible" // Permite que el borde grueso no se corte
        }}
      >
        {/* CAPA 1: El Borde (Stroke) 
            Usamos paintOrder para que el borde crezca hacia afuera sin pisar la letra */}
        <text 
          x="50%" y="50%" 
          textAnchor="middle" 
          dominantBaseline="central"
          fontFamily="'Fredoka', 'Nunito', sans-serif"
          fontWeight="700" 
          fontSize={size}
          fill="none" 
          stroke={stroke} 
          strokeWidth={strokeWidth}
          strokeLinejoin="round" 
          paintOrder="stroke"
        >
          {text}
        </text>

        {/* CAPA 2: El Relleno (Fill) */}
        <text 
          x="50%" y="50%" 
          textAnchor="middle" 
          dominantBaseline="central"
          fontFamily="'Fredoka', 'Nunito', sans-serif"
          fontWeight="700" 
          fontSize={size} 
          fill={fill}
        >
          {text}
        </text>
      </svg>
    </span>
  );
}