export default function KiddsyLogo({ size = "md" }) {
  const sizes = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" };
  const C = { blue: "#3B82F6", red: "#EF4444" }; 
  return (
    <div className={`font-display ${sizes[size]} leading-none select-none`}>
      <span style={{ color: C.blue }}>Kiddsy</span>
      <span style={{ color: C.red }}>Loop</span>
    </div>
  );
}