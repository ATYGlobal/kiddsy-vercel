/**
 * src/components/CartoonTitle.jsx
 * Componente reutilizable para títulos estilo cuento
 */
export default function CartoonTitle({ 
  children, 
  fill = "#1565C0", 
  stroke = "#BBDEFB", 
  size = 44,
  className = "" 
}) {
  const text = String(children);
  const estW = Math.max(200, text.length * size * 0.56 + 40);
  const estH = size * 1.48;
  
  return (
    <span 
      className={className}
      style={{ display:"inline-block", lineHeight:1 }} 
      aria-label={text}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={estW} 
        height={estH}
        viewBox={`0 0 ${estW} ${estH}`}
        style={{ display:"block", maxWidth:"100%", overflow:"visible" }}
      >
        <text 
          x="50%" y="75%" 
          textAnchor="middle" 
          dominantBaseline="middle"
          fontFamily="var(--font-display,'Nunito',ui-rounded,sans-serif)"
          fontWeight="800" 
          fontSize={size}
          fill="none" 
          stroke={stroke} 
          strokeWidth="6"
          strokeLinejoin="round" 
          strokeLinecap="round" 
          paintOrder="stroke"
        >
          {text}
        </text>
        <text 
          x="50%" y="75%" 
          textAnchor="middle" 
          dominantBaseline="middle"
          fontFamily="var(--font-display,'Nunito',ui-rounded,sans-serif)"
          fontWeight="800" 
          fontSize={size} 
          fill={fill} 
          stroke="none"
        >
          {text}
        </text>
      </svg>
    </span>
  );
}