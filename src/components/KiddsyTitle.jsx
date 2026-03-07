// Componente para títulos estilo Logo
const KiddsyTitle = ({ children, className = "" }) => {
  return (
    <span className={`relative inline-block ${className}`}>
      {/* Capa de sombra/relieve para el efecto burbuja */}
      <span className="absolute inset-0 text-blue-600 blur-[2px] translate-y-1 opacity-30">
        {children}
      </span>
      {/* Texto principal con degradado azul y borde blanco */}
      <span className="relative bg-gradient-to-b from-blue-300 to-blue-500 bg-clip-text text-transparent drop-shadow-sm font-black tracking-wide" 
            style={{ WebkitTextStroke: '1px white' }}>
        {children}
      </span>
    </span>
  );
};
export default KiddsyTitle;