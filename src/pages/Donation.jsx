// ... (Tus importaciones arriba) ...
import { Heart, Coffee, Star, Sparkles, Users, BookOpen, Globe, Zap, Shield } from "lucide-react"; // ✅ Añadido Shield aquí

// --- (Tus constantes C, PAYPAL_ME_CUSTOM, FloatingEmojis, DonationTier, ImpactCard y TIERS se quedan igual) ---

export default function Donation() {
  const [selectedTier, setSelectedTier] = useState(TIERS[1]);
  const [customAmount, setCustomAmount] = useState("");
  const [donated, setDonated] = useState(false);

  const finalAmount = customAmount || selectedTier?.amount || 0;

  const handleDonate = () => {
    const url = customAmount ? PAYPAL_ME_CUSTOM(customAmount) : PAYPAL_ME_CUSTOM(selectedTier.amount);
    window.open(url, "_blank", "noopener,noreferrer");
    setDonated(true);
    setTimeout(() => setDonated(false), 4000);
  };

  return (
    <div
      className="relative w-full min-h-screen"
      style={{ 
        overflowY: "auto",
        overflowX: "hidden",
        background: "linear-gradient(150deg, #FFFDE7 0%, #FFF8E1 40%, #FFF3E0 100%)",
        display: "flex", // ✅ Flex para centrar en pantallas Gigantes
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <FloatingEmojis />

      {/* ✅ Contenedor principal limitado para monitores Ultrawide */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-14">
        
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <motion.div animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="text-7xl mb-4 inline-block">
            ☕
          </motion.div>
          <h1 className="font-display text-4xl md:text-6xl mb-4 font-bold" style={{ color: C.blue }}>
            Buy us a hot chocolate!
          </h1>
          <p className="font-body text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Kiddsy is free for every family, forever. But magic needs fuel! 🪄
            Your donation helps us add stories, languages, and games.
          </p>
        </motion.div>

        {/* Impact stats - Grid ajustable */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {IMPACT_STATS.map((s, i) => <ImpactCard key={i} {...s} />)}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Tiers */}
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-bold mb-6" style={{ color: C.blue }}>
              Choose your contribution
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {TIERS.map((tier) => (
                <DonationTier 
                  key={tier.amount} 
                  tier={tier} 
                  isSelected={selectedTier?.amount === tier.amount && !customAmount} 
                  onSelect={(t) => { setSelectedTier(t); setCustomAmount(""); }} 
                />
              ))}
            </div>
          </div>

          {/* Right: Checkout Card */}
          <div className="sticky top-8 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-white">
              <h3 className="font-display text-xl mb-4 font-bold" style={{ color: C.blue }}>Or enter a custom amount</h3>
              <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-6 py-4 border-2 border-transparent focus-within:border-blue-400 transition-all">
                <span className="font-display text-3xl text-slate-400">$</span>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={customAmount} 
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedTier(null); }} 
                  className="flex-1 bg-transparent font-display text-3xl outline-none text-slate-700" 
                />
              </div>

              <motion.div 
                key={finalAmount} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mt-8 rounded-2xl p-6 text-white" 
                style={{ background: `linear-gradient(135deg, ${C.blue} 0%, ${C.cyan} 100%)` }}
              >
                <div className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1">Total Support</div>
                <div className="font-display text-5xl font-bold">${finalAmount}</div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/20 text-sm text-white/90">
                  <Shield size={18} /> Secure with PayPal
                </div>
              </motion.div>

              <button 
                onClick={handleDonate}
                className="w-full mt-6 py-5 rounded-2xl font-display text-2xl font-bold text-white shadow-lg transform transition hover:scale-[1.02] active:scale-95"
                style={{ 
                  background: finalAmount > 0 ? `linear-gradient(135deg, ${C.yellow} 0%, #FF8F00 100%)` : "#E5E7EB",
                  cursor: finalAmount > 0 ? "pointer" : "not-allowed"
                }}
              >
                {donated ? "🎉 Thank you!" : "Donate Now"}
              </button>
            </div>
          </div>
        </div>

        {/* Thank you wall */}
        <div className="mt-20 py-12 border-t border-slate-200 text-center">
            {/* ... (Tu muro de agradecimientos se queda igual) ... */}
        </div>
      </div>
    </div>
  );
}
// Borra la función Shield de abajo del todo porque ya la importamos de Lucide arriba