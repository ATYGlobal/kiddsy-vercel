/**
 * src/pages/Subscription.jsx — Kiddsy
 * Subscription & pricing page with full payment stack:
 *   • Stripe PaymentElement  — cards, wallets, SEPA…
 *   • Apple Pay              — via Stripe PaymentRequestButton
 *   • Google Pay / Android   — via Payment Request API + Stripe
 *
 * SETUP (5 steps):
 *   1. npm install @stripe/react-stripe-js @stripe/stripe-js
 *   2. Set VITE_STRIPE_PUBLISHABLE_KEY in .env
 *   3. Server: POST /api/create-payment-intent → returns { clientSecret }
 *   4. Server: POST /api/create-subscription   → returns { clientSecret }
 *   5. Replace STRIPE_PUBLISHABLE_KEY constant below with import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
 */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence }                  from "framer-motion";
import {
  Heart, Star, Sparkles, Users, BookOpen, Globe, Zap,
  Crown, CheckCircle, Infinity, Gift, Puzzle, Lock,
  X, Loader, CreditCard, AlertCircle,
} from "lucide-react";
import EmojiSvg from "../utils/EmojiSvg.jsx";

// ── Stripe imports ─────────────────────────────────────────────────────────
// Uncomment once you install @stripe/react-stripe-js and @stripe/stripe-js:
//
// import { loadStripe }                             from "@stripe/stripe-js";
// import { Elements, PaymentElement,
//          PaymentRequestButtonElement,
//          useStripe, useElements }                 from "@stripe/react-stripe-js";
//
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

import EmojiSvg from "../utils/EmojiSvg.jsx";

// ─── Brand palette ─────────────────────────────────────────────────────────
const C = {
  blue:    "#1565C0",
  red:     "#E53935",
  yellow:  "#FDD835",
  green:   "#43A047",
  magenta: "#D81B60",
  cyan:    "#00ACC1",
  orange:  "#E65100",
};

// ── Stripe theme (matches Kiddsy palette) ──────────────────────────────────
const STRIPE_APPEARANCE = {
  theme: "stripe",
  variables: {
    colorPrimary:       C.blue,
    colorBackground:    "#FFFFFF",
    colorText:          "#1E293B",
    colorDanger:        C.red,
    fontFamily:         "Nunito, system-ui, sans-serif",
    borderRadius:       "16px",
    spacingUnit:        "4px",
  },
  rules: {
    ".Input": {
      border:     "2px solid #E2E8F0",
      boxShadow:  "none",
      padding:    "14px 16px",
      fontSize:   "15px",
    },
    ".Input:focus":   { border: `2px solid ${C.blue}`, boxShadow: `0 0 0 3px ${C.blue}18` },
    ".Label":         { fontWeight: "700", fontSize: "12px", color: "#64748B" },
    ".Tab":           { border: "2px solid #E2E8F0", borderRadius: "12px" },
    ".Tab--selected": { border: `2px solid ${C.blue}`, boxShadow: `0 4px 12px ${C.blue}22` },
  },
};

// ─── API helper ─────────────────────────────────────────────────────────────
const API_URL = () =>
  window.location.hostname === "localhost"
    ? "http://localhost:10000"
    : "https://kiddsy-vercel.onrender.com";

async function createPaymentIntent(planId, price, isSubscription) {
  const endpoint = isSubscription ? "/api/create-subscription" : "/api/create-payment-intent";
  const res = await fetch(`${API_URL()}${endpoint}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ planId, amount: Math.round(price * 100), currency: "eur" }),
  });
  if (!res.ok) throw new Error("Failed to create payment intent");
  return res.json(); // { clientSecret }
}

// ═══════════════════════════════════════════════════════════════════════════
// useNativePayDetect — detects Apple Pay & Google Pay support
// ═══════════════════════════════════════════════════════════════════════════
function useNativePayDetect() {
  const [hasApplePay,  setHasApplePay]  = useState(false);
  const [hasGooglePay, setHasGooglePay] = useState(false);

  useEffect(() => {
    // ── Apple Pay ─────────────────────────────────────────────────────────
    if (
      typeof window !== "undefined" &&
      window.ApplePaySession &&
      ApplePaySession.canMakePayments()
    ) {
      setHasApplePay(true);
    }

    // ── Google Pay / Payment Request API ─────────────────────────────────
    // Stripe's PaymentRequestButton handles this automatically, but we check
    // here so we can show/hide the native button in the UI.
    if (typeof window !== "undefined" && window.PaymentRequest) {
      const request = new PaymentRequest(
        [{ supportedMethods: "https://google.com/pay" }],
        {
          total: { label: "Kiddsy", amount: { currency: "EUR", value: "0.00" } },
        }
      );
      request.canMakePayment()
        .then(result => { if (result) setHasGooglePay(true); })
        .catch(() => {});
    }
  }, []);

  return { hasApplePay, hasGooglePay };
}

// ═══════════════════════════════════════════════════════════════════════════
// PaymentForm — inner Stripe form (needs <Elements> wrapper)
// ═══════════════════════════════════════════════════════════════════════════
function PaymentForm({ plan, price, billing, onSuccess, onClose }) {
  // ── When Stripe is installed, uncomment: ──────────────────────────────
  // const stripe   = useStripe();
  // const elements = useElements();
  // ── And replace the stub state below with real Stripe hooks ──────────

  const [processing, setProcessing] = useState(false);
  const [error,      setError]      = useState("");
  const [payReady,   setPayReady]   = useState(false); // true when PaymentElement loads

  // ── Wallet buttons ─────────────────────────────────────────────────────
  // Stripe's usePaymentRequest hook (uncomment when Stripe is installed):
  //
  // const paymentRequest = stripe ? usePaymentRequest({
  //   stripe,
  //   options: {
  //     country: "ES",
  //     currency: "eur",
  //     total: { label: plan.name, amount: Math.round(price * 100) },
  //     requestPayerName:  true,
  //     requestPayerEmail: true,
  //   },
  //   onPaymentMethod: async ({ paymentMethod, complete }) => {
  //     const { error } = await stripe.confirmPayment({
  //       elements, confirmParams: { return_url: window.location.href },
  //       redirect: "if_required",
  //     });
  //     if (error) { complete("fail"); setError(error.message); }
  //     else        { complete("success"); onSuccess(); }
  //   },
  // }) : null;

  const handleSubmit = async () => {
    setProcessing(true);
    setError("");
    try {
      // ── When Stripe is installed, replace stub with real confirm: ──────
      // const { error } = await stripe.confirmPayment({
      //   elements,
      //   confirmParams: {
      //     return_url: `${window.location.origin}/success`,
      //   },
      //   redirect: "if_required",
      // });
      // if (error) throw new Error(error.message);
      // onSuccess();

      // Stub — simulate payment for now
      await new Promise(r => setTimeout(r, 1800));
      onSuccess();
    } catch (e) {
      setError(e.message || "Payment failed — please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ── Wallet pay buttons (Apple Pay / Google Pay) ─────────────── */}
      {/* Uncomment when Stripe is installed and paymentRequest is ready:
      {paymentRequest && (
        <div>
          <PaymentRequestButtonElement
            options={{ paymentRequest }}
            className="w-full"
          />
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-200"/>
            <span className="font-body text-xs text-slate-400">or pay with card</span>
            <div className="flex-1 h-px bg-slate-200"/>
          </div>
        </div>
      )} */}

      {/* Wallet stub — shows when no Stripe yet */}
      <WalletButtons plan={plan} price={price}/>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200"/>
        <span className="font-body text-xs text-slate-400">or pay with card</span>
        <div className="flex-1 h-px bg-slate-200"/>
      </div>

      {/* ── Stripe PaymentElement ──────────────────────────────────── */}
      {/* Uncomment when Stripe is installed:
      <div className={`transition-opacity ${payReady ? "opacity-100" : "opacity-0"}`}>
        <PaymentElement
          onReady={() => setPayReady(true)}
          options={{ layout: "tabs" }}
        />
      </div>
      {!payReady && (
        <div className="h-40 rounded-2xl bg-slate-50 animate-pulse flex items-center justify-center">
          <Loader size={20} className="animate-spin text-slate-300"/>
        </div>
      )} */}

      {/* Card stub shown until Stripe is connected */}
      <CardStub/>

      {/* Error */}
      {error && (
        <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
          className="flex items-start gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-200">
          <AlertCircle size={16} style={{ color:C.red, flexShrink:0, marginTop:2 }}/>
          <span className="font-body text-sm text-red-600">{error}</span>
        </motion.div>
      )}

      {/* Submit */}
      <motion.button
        whileHover={!processing ? { scale:1.02 } : {}}
        whileTap={!processing ? { scale:0.97 } : {}}
        onClick={handleSubmit}
        disabled={processing}
        className="w-full py-4 rounded-2xl font-display text-base font-bold text-white flex items-center justify-center gap-2"
        style={{
          background: processing ? "#94A3B8" : `linear-gradient(135deg,${C.blue},${C.cyan})`,
          cursor:     processing ? "not-allowed" : "pointer",
          boxShadow:  processing ? "none" : `0 8px 24px ${C.blue}35`,
        }}
      >
        {processing
          ? <><Loader size={17} className="animate-spin"/> Processing…</>
          : <><Lock size={15}/> Pay €{price} · {plan.name}</>
        }
      </motion.button>

      <p className="font-body text-center text-xs text-slate-400">
        🔒 Encrypted by Stripe · Never stored on Kiddsy servers
      </p>
    </div>
  );
}

// ── WalletButtons — Apple Pay + Google Pay visual buttons ──────────────────
function WalletButtons({ plan, price }) {
  const { hasApplePay, hasGooglePay } = useNativePayDetect();

  // Once Stripe is connected, these are replaced by PaymentRequestButtonElement above.
  // They remain here as an informational / preview layer.

  if (!hasApplePay && !hasGooglePay) return null;

  return (
    <div className="flex flex-col gap-2">
      {hasApplePay && (
        <motion.button
          whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
          onClick={() => alert("Apple Pay: connect Stripe PaymentRequestButtonElement")}
          className="w-full py-3.5 rounded-2xl font-display text-base font-bold flex items-center justify-center gap-2 text-white"
          style={{ background:"#000", boxShadow:"0 6px 20px rgba(0,0,0,0.3)" }}
        >
          {/* Apple Pay uses the system logo — SVG approximation */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.78 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
          </svg>
          Pay with Apple Pay
        </motion.button>
      )}
      {hasGooglePay && (
        <motion.button
          whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
          onClick={() => alert("Google Pay: connect Stripe PaymentRequestButtonElement")}
          className="w-full py-3.5 rounded-2xl font-display text-base font-bold flex items-center justify-center gap-2"
          style={{
            background:"white",
            border:"2px solid #E2E8F0",
            boxShadow:"0 4px 14px rgba(0,0,0,0.08)",
            color:"#3C4043",
          }}
        >
          {/* Google Pay 'G' mark */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Pay with Google Pay
        </motion.button>
      )}
    </div>
  );
}

// ── CardStub — shown before Stripe is connected ────────────────────────────
function CardStub() {
  return (
    <div className="rounded-2xl border-2 border-slate-200 p-4 space-y-3 bg-slate-50/60">
      <div className="flex items-center gap-2 mb-2">
        <CreditCard size={16} style={{ color:C.blue }}/>
        <span className="font-display text-xs font-bold text-slate-500">Card details</span>
        <span className="ml-auto text-xs font-body bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
          Connect Stripe to activate
        </span>
      </div>
      {/* Card number stub */}
      <div className="h-12 bg-white rounded-xl border-2 border-slate-200 flex items-center px-4">
        <span className="font-body text-sm text-slate-300 tracking-widest">1234  5678  9012  3456</span>
        <div className="ml-auto flex gap-1">
          {["💳","💳"].map((_, i) => (
            <div key={i} className="w-8 h-5 rounded bg-slate-100"/>
          ))}
        </div>
      </div>
      {/* Expiry + CVC */}
      <div className="grid grid-cols-2 gap-2">
        <div className="h-12 bg-white rounded-xl border-2 border-slate-200 flex items-center px-4">
          <span className="font-body text-sm text-slate-300">MM / YY</span>
        </div>
        <div className="h-12 bg-white rounded-xl border-2 border-slate-200 flex items-center px-4">
          <span className="font-body text-sm text-slate-300">CVC</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CheckoutModal — wraps PaymentForm in Stripe <Elements>
// ═══════════════════════════════════════════════════════════════════════════
function CheckoutModal({ plan, price, billing, onClose, onSuccess }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [fetchError,   setFetchError]   = useState("");
  const [loading,      setLoading]      = useState(true);
  const isSubscription = billing !== "one-time";

  useEffect(() => {
    setLoading(true);
    createPaymentIntent(plan.id, price, isSubscription)
      .then(data => setClientSecret(data.clientSecret))
      .catch(e => setFetchError(e.message))
      .finally(() => setLoading(false));
  }, [plan.id, price]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background:"rgba(15,23,42,0.55)", backdropFilter:"blur(6px)" }}
        onClick={e => { if (e.target===e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ scale:0.92, y:30, opacity:0 }}
          animate={{ scale:1,    y:0,  opacity:1 }}
          exit={{    scale:0.92, y:30, opacity:0 }}
          transition={{ type:"spring", stiffness:280, damping:26 }}
          className="w-full max-w-md bg-white rounded-4xl shadow-2xl overflow-hidden"
          style={{ maxHeight:"92vh", overflowY:"auto" }}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between px-7 pt-7 pb-5"
            style={{ borderBottom:"2px solid #F1F5F9" }}>
            <div>
              <div className="font-display text-xl font-bold" style={{ color:C.blue }}>
                Complete payment
              </div>
              <div className="font-body text-sm text-slate-400 mt-0.5">
                {plan.name} · €{price}{billing!=="one-time" ? "/mo" : " one-time"}
              </div>
            </div>
            <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background:"#F1F5F9" }}>
              <X size={16} style={{ color:"#64748B" }}/>
            </motion.button>
          </div>

          <div className="px-7 py-6">
            {/* Order summary */}
            <div className="rounded-2xl p-4 mb-5 flex items-center gap-3"
              style={{ background:plan.softBg||"#E3F2FD" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background:"white" }}>
                {plan.icon && <plan.icon size={20} style={{ color:plan.color||C.blue }}/>}
              </div>
              <div className="flex-1">
                <div className="font-display text-sm font-bold" style={{ color:plan.color||C.blue }}>
                  {plan.name}
                </div>
                <div className="font-body text-xs text-slate-400">
                  {billing==="annual" ? "Billed annually" : billing==="one-time" ? "One-time purchase" : "Billed monthly"}
                </div>
              </div>
              <div className="font-display text-2xl font-bold" style={{ color:plan.color||C.blue }}>
                €{price}
              </div>
            </div>

            {/* Payment form */}
            {loading ? (
              <div className="h-52 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader size={28} className="animate-spin" style={{ color:C.blue }}/>
                  <span className="font-body text-sm text-slate-400">Preparing secure checkout…</span>
                </div>
              </div>
            ) : fetchError ? (
              <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-4 text-center">
                <AlertCircle size={20} style={{ color:C.red }} className="mx-auto mb-2"/>
                <p className="font-body text-sm text-red-600">{fetchError}</p>
                <p className="font-body text-xs text-red-400 mt-1">
                  Make sure your server is running and STRIPE keys are set.
                </p>
              </div>
            ) : (
              // When Stripe is installed, wrap PaymentForm in Elements:
              // <Elements stripe={stripePromise} options={{ clientSecret, appearance:STRIPE_APPEARANCE }}>
              //   <PaymentForm plan={plan} price={price} billing={billing} onSuccess={onSuccess} onClose={onClose}/>
              // </Elements>
              <PaymentForm
                plan={plan} price={price} billing={billing}
                onSuccess={onSuccess} onClose={onClose}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FloatingEmojis (same as Donation.jsx)
// ═══════════════════════════════════════════════════════════════════════════
function FloatingEmojis() {
  const items = ["2b50","1f4da","1f31f","2764","2728","1f308","1f389","1f36b","1f9e9","1f680"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex:0 }}>
      {items.map((emoji, i) => (
        <motion.span key={i} className="absolute text-2xl select-none"
          style={{ left:`${8+i*9}%`, top:`${10+(i%3)*28}%` }}
          animate={{ y:[0,-20,0], rotate:[-5,5,-5], opacity:[0.3,0.6,0.3] }}
          transition={{ duration:3+i*0.4, repeat:Infinity, delay:i*0.3, ease:"easeInOut" }}>
          <EmojiSvg code={emoji} size={26}/>
        </motion.span>
      ))}
    </div>
  );
}

// ── BillingToggle ──────────────────────────────────────────────────────────
function BillingToggle({ billing, onChange }) {
  return (
    <div className="inline-flex items-center bg-white rounded-full p-1 shadow-sm border-2 border-white gap-1">
      {[
        { id:"monthly", label:"Monthly" },
        { id:"annual",  label:"Annual · Save 33%" },
      ].map(b => (
        <button key={b.id} onClick={() => onChange(b.id)}
          className="px-5 py-2 rounded-full font-display text-sm transition-all"
          style={{
            background: billing===b.id ? C.blue : "transparent",
            color:      billing===b.id ? "white" : "#64748B",
            fontWeight: billing===b.id ? 700 : 500,
            boxShadow:  billing===b.id ? "0 4px 12px rgba(21,101,192,0.3)" : "none",
          }}
        >{b.label}</button>
      ))}
    </div>
  );
}

// ── PlanCard ───────────────────────────────────────────────────────────────
function PlanCard({ plan, billing, isSelected, onSelect }) {
  const price  = billing==="annual" && plan.annualMonthly ? plan.annualMonthly : plan.price;
  const period = billing==="annual" && plan.annualMonthly ? "/ mo, billed annually" : `/ ${plan.period}`;
  const saving = billing==="annual" && plan.annualMonthly
    ? `Save €${((plan.price-plan.annualMonthly)*12).toFixed(2)}/yr` : null;
  return (
    <motion.button onClick={() => onSelect(plan)}
      whileHover={{ scale:1.04, y:-4 }} whileTap={{ scale:0.97 }}
      className="relative w-full rounded-3xl overflow-hidden border-4 transition-all duration-200 text-left"
      style={{
        borderColor: isSelected ? plan.color : "white",
        background:  isSelected ? plan.softBg : "white",
        boxShadow:   isSelected ? `0 12px 40px ${plan.color}30` : "0 6px 20px rgba(0,0,0,0.06)",
      }}>
      {plan.popular && (
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full font-display text-xs text-white flex items-center gap-1"
          style={{ background:plan.color }}>
          <EmojiSvg code="2b50" size={12}/> Popular
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ background:plan.softBg }}>
            <plan.icon size={26} style={{ color:plan.color }}/>
          </div>
          <div>
            <div className="font-display text-xl font-bold" style={{ color:plan.color }}>{plan.name}</div>
            <div className="font-body text-sm text-slate-500">{plan.badge}</div>
          </div>
        </div>
        <div className="flex items-end gap-1.5 mb-1">
          <span className="font-display text-4xl font-bold" style={{ color:plan.color }}>€{price}</span>
          <span className="font-body text-slate-400 text-sm mb-1">{period}</span>
        </div>
        {saving && <div className="font-body text-xs mb-3" style={{ color:C.green }}>💚 {saving}</div>}
        <ul className="mt-4 space-y-2">
          {plan.features.map((f,i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background:plan.softBg }}>
                <f.icon size={12} style={{ color:plan.color }}/>
              </div>
              <span className="font-body text-sm text-slate-600">{f.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <AnimatePresence>
        {isSelected && (
          <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} exit={{ scaleX:0 }}
            className="h-1.5 w-full origin-left" style={{ background:plan.color }}/>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ── ProductRow ─────────────────────────────────────────────────────────────
function ProductRow({ product, delay, onBuy }) {
  return (
    <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
      transition={{ delay, type:"spring" }}
      className="flex items-center justify-between bg-white rounded-3xl px-5 py-4 border-4 border-white"
      style={{ boxShadow:"0 4px 18px rgba(0,0,0,0.06)" }}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background:product.softBg }}>
          <product.icon size={20} style={{ color:product.color }}/>
        </div>
        <div>
          <div className="font-display text-sm font-bold text-slate-700">{product.name}</div>
          {product.note && <div className="font-body text-xs text-slate-400">{product.note}</div>}
        </div>
      </div>
      <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:0.95 }}
        onClick={() => onBuy(product)}
        className="flex-shrink-0 px-5 py-2 rounded-2xl font-display text-sm font-bold text-white shadow-sm"
        style={{ background:product.color }}>
        €{product.price}
      </motion.button>
    </motion.div>
  );
}

// ── LifetimeCard ───────────────────────────────────────────────────────────
function LifetimeCard({ plan, delay, onBuy }) {
  const isEarly = plan.id==="lifetime-early";
  return (
    <motion.div initial={{ opacity:0, scale:0.93 }} animate={{ opacity:1, scale:1 }}
      transition={{ delay, type:"spring" }}
      className="relative rounded-3xl p-7 border-4 overflow-hidden text-left"
      style={{
        borderColor: isEarly ? C.orange : C.blue,
        background:  isEarly ? "#FFF3E0" : "#E3F2FD",
        boxShadow:   `0 12px 40px ${isEarly?C.orange:C.blue}25`,
      }}>
      {plan.limit && (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full font-display text-xs font-bold text-white" style={{ background:C.orange }}>
          🔥 {plan.limit}
        </div>
      )}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background:"white" }}>
          <Infinity size={26} style={{ color:isEarly?C.orange:C.blue }}/>
        </div>
        <div>
          <div className="font-display text-xl font-bold" style={{ color:isEarly?C.orange:C.blue }}>{plan.name}</div>
          <div className="font-body text-xs text-slate-500">One-time · Forever access</div>
        </div>
      </div>
      <div className="font-display text-5xl font-bold mb-5" style={{ color:isEarly?C.orange:C.blue }}>€{plan.price}</div>
      <ul className="space-y-2 mb-6">
        {["All stories, games & puzzles","All 16 languages forever","Every future feature included","No subscription, no renewal"].map((f,i)=>(
          <li key={i} className="flex items-center gap-2 font-body text-sm text-slate-600">
            <CheckCircle size={14} style={{ color:isEarly?C.orange:C.blue, flexShrink:0 }}/>{f}
          </li>
        ))}
      </ul>
      <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
        onClick={() => onBuy(plan)}
        className="w-full py-4 rounded-2xl font-display text-base font-bold text-white shadow-lg"
        style={{ background:isEarly?`linear-gradient(135deg,${C.orange},#FF8F00)`:`linear-gradient(135deg,${C.blue},${C.cyan})` }}>
        {isEarly?"🔥 Grab Early Deal →":"✨ Get Lifetime Access →"}
      </motion.button>
    </motion.div>
  );
}

// ── ImpactCard ─────────────────────────────────────────────────────────────
function ImpactCard({ icon:Icon, value, label, color, bg, delay }) {
  return (
    <motion.div initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }}
      transition={{ delay, type:"spring" }}
      className="rounded-3xl p-5 text-center border-2 border-white shadow-sm" style={{ background:bg }}>
      <Icon size={24} style={{ color }} className="mx-auto mb-2"/>
      <div className="font-display text-3xl mb-1 font-bold" style={{ color }}>{value}</div>
      <div className="font-body text-xs text-slate-500 leading-tight">{label}</div>
    </motion.div>
  );
}

// ── SuccessScreen ──────────────────────────────────────────────────────────
function SuccessScreen({ plan, onDismiss }) {
  return (
    <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background:"rgba(15,23,42,0.6)", backdropFilter:"blur(8px)" }}>
      <motion.div className="bg-white rounded-4xl p-10 text-center max-w-sm w-full shadow-2xl"
        initial={{ y:30 }} animate={{ y:0 }}>
        <motion.div animate={{ rotate:[0,-10,10,-10,0], scale:[1,1.2,1] }}
          transition={{ duration:0.6, delay:0.2 }}
          className="text-6xl mb-4 inline-block">
          <EmojiSvg code="1f389" size={64}/>
        </motion.div>
        <h2 className="font-display text-2xl font-bold mb-2" style={{ color:C.blue }}>
          Welcome to {plan.name}!
        </h2>
        <p className="font-body text-slate-500 text-sm mb-6 leading-relaxed">
          Payment confirmed. Your Kiddsy magic is unlocked — enjoy every story, game, and language! ✨
        </p>
        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
          onClick={onDismiss}
          className="w-full py-4 rounded-2xl font-display text-base font-bold text-white"
          style={{ background:`linear-gradient(135deg,${C.green},#66BB6A)` }}>
          Start exploring! →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Data
// ═══════════════════════════════════════════════════════════════════════════
const SUBSCRIPTIONS = [
  {
    id:"monthly", name:"Kiddsy Plus", badge:"Flexible · cancel anytime",
    price:5.99, annualMonthly:3.99, period:"month", popular:false,
    color:C.blue, softBg:"#E3F2FD", icon:Sparkles,
    features:[
      { icon:BookOpen, text:"Unlimited bilingual stories" },
      { icon:Globe,    text:"All 16 languages"            },
      { icon:Puzzle,   text:"All puzzle & game packs"     },
      { icon:Zap,      text:"Priority AI generation"      },
    ],
  },
  {
    id:"annual", name:"Kiddsy Annual", badge:"2 months free vs monthly",
    price:5.99, annualTotal:39.99, annualMonthly:3.33, period:"month", popular:true,
    color:C.green, softBg:"#E8F5E9", icon:Star,
    features:[
      { icon:BookOpen, text:"Everything in Kiddsy Plus"  },
      { icon:Star,     text:"Save 33% — 2 months free"   },
      { icon:Gift,     text:"Exclusive annual stories"    },
      { icon:Zap,      text:"Early feature access"        },
    ],
  },
  {
    id:"family", name:"Kiddsy Family", badge:"Best for siblings",
    price:7.99, annualMonthly:5.49, period:"month", popular:false,
    color:C.magenta, softBg:"#FCE4EC", icon:Heart,
    features:[
      { icon:Crown,    text:"Up to 4 child profiles"         },
      { icon:BookOpen, text:"Individual progress tracking"   },
      { icon:Sparkles, text:"All premium content"            },
      { icon:Star,     text:"Save 33% vs individual plans"   },
    ],
  },
];

const INDIVIDUAL_PRODUCTS = [
  { id:"puzzle-seasonal",   name:"Seasonal Puzzle Pack", note:"New themes monthly",    price:0.99, color:C.orange,  softBg:"#FFF3E0", icon:Puzzle   },
  { id:"book-single",       name:"Single Storybook",     note:"One premium story",    price:2.99, color:C.blue,    softBg:"#E3F2FD", icon:BookOpen  },
  { id:"book-pack-5",       name:"5-Book Bundle",        note:"Best per-book value",  price:9.99, color:C.green,   softBg:"#E8F5E9", icon:Gift      },
  { id:"puzzles-unlimited", name:"Unlimited Puzzles",    note:"All puzzle categories",price:3.99, color:C.magenta, softBg:"#FCE4EC", icon:Crown     },
];

const LIFETIME = [
  { id:"lifetime",       name:"Kiddsy Lifetime",   price:49.99, color:C.blue,   softBg:"#E3F2FD", icon:Infinity  },
  { id:"lifetime-early", name:"Early Adopter Deal", price:29.99, color:C.orange, softBg:"#FFF3E0", icon:Infinity, limit:"First 100 users" },
];

const IMPACT_STATS = [
  { icon:Users,    value:"2,400+", label:"Families using Kiddsy",  color:C.blue,    bg:"#E3F2FD", delay:0    },
  { icon:BookOpen, value:"18K+",   label:"Stories generated",       color:C.red,     bg:"#FFEBEE", delay:0.1  },
  { icon:Globe,    value:"16",     label:"Languages supported",      color:C.green,   bg:"#E8F5E9", delay:0.2  },
  { icon:Zap,      value:"Free",   label:"Always, for every family", color:C.magenta, bg:"#FCE4EC", delay:0.3  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Main export
// ═══════════════════════════════════════════════════════════════════════════
export default function Subscription() {
  const [billing,      setBilling]      = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTIONS[1]);
  const [checkout,     setCheckout]     = useState(null); // { plan, price, billing }
  const [success,      setSuccess]      = useState(null); // plan that was purchased

  const openModal = (plan, price, billingType) =>
    setCheckout({ plan, price, billing: billingType });

  const handlePlanSubscribe = () => {
    const price = billing==="annual" && selectedPlan.annualMonthly
      ? selectedPlan.annualMonthly : selectedPlan.price;
    openModal(selectedPlan, price, billing);
  };

  return (
    <div className="relative w-full" style={{
      minHeight:"100vh", overflowY:"auto", overflowX:"hidden",
      paddingBottom:"120px",
      background:"linear-gradient(150deg, #FFFDE7 0%, #FFF8E1 40%, #FFF3E0 100%)",
    }}>
      <FloatingEmojis/>

      {/* ── Checkout modal ────────────────────────────────────────────── */}
      {checkout && (
        <CheckoutModal
          plan={checkout.plan}
          price={checkout.price}
          billing={checkout.billing}
          onClose={() => setCheckout(null)}
          onSuccess={() => {
            setCheckout(null);
            setSuccess(checkout.plan);
          }}
        />
      )}

      {/* ── Success screen ────────────────────────────────────────────── */}
      {success && (
        <SuccessScreen plan={success} onDismiss={() => setSuccess(null)}/>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-14">

        {/* Hero */}
        <motion.div initial={{ opacity:0, y:-24 }} animate={{ opacity:1, y:0 }} className="text-center mb-12">
          <motion.div animate={{ rotate:[0,-8,8,0] }}
            transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut" }}
            className="text-7xl mb-4 inline-block">
            <EmojiSvg code="1f31f" size={56}/>
          </motion.div>
          <h1 className="font-display text-4xl md:text-5xl mb-3 font-bold" style={{ color:C.blue }}>
            Choose your Kiddsy plan <EmojiSvg code="1fa84" size={28}/>
          </h1>
          <p className="font-body text-slate-600 text-lg max-w-xl mx-auto leading-relaxed mb-8">
            Unlimited stories, all languages, every game.{" "}
            <strong style={{ color:C.blue }}>Always free</strong> at the core —
            unlock the full magic with a plan. <EmojiSvg code="2728" size={16}/>
          </p>
          <BillingToggle billing={billing} onChange={setBilling}/>
        </motion.div>

        {/* Impact stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {IMPACT_STATS.map((s,i) => <ImpactCard key={i} {...s}/>)}
        </div>

        {/* Two-column: plan picker + summary */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="font-display text-2xl mb-5 font-bold" style={{ color:C.blue }}>Choose your plan</h2>
            <div className="grid grid-cols-1 gap-4">
              {SUBSCRIPTIONS.map(plan => (
                <PlanCard key={plan.id} plan={plan} billing={billing}
                  isSelected={selectedPlan?.id===plan.id} onSelect={setSelectedPlan}/>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {/* Summary */}
            <motion.div key={`${selectedPlan.id}-${billing}`}
              initial={{ scale:0.97, opacity:0 }} animate={{ scale:1, opacity:1 }}
              className="rounded-3xl p-7 text-white shadow-xl"
              style={{ background:`linear-gradient(135deg,${C.blue},${C.cyan})` }}>
              <div className="text-white/70 font-display mb-1">Your plan</div>
              <div className="font-display text-3xl font-bold mb-1">{selectedPlan.name}</div>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="font-display text-5xl font-bold">
                  €{billing==="annual"&&selectedPlan.annualMonthly ? selectedPlan.annualMonthly : selectedPlan.price}
                </span>
                <span className="font-body text-white/70 text-sm mb-2">
                  {billing==="annual" ? "/ mo, billed annually" : `/ ${selectedPlan.period}`}
                </span>
              </div>
              {billing==="annual"&&selectedPlan.annualMonthly && (
                <div className="font-body text-white/70 text-sm mb-2">
                  💚 Save €{((selectedPlan.price-selectedPlan.annualMonthly)*12).toFixed(2)} per year
                </div>
              )}
              <div className="border-t border-white/20 pt-4 mt-3 space-y-2">
                <div className="flex items-center gap-2 text-white/80 font-body text-sm">
                  <Shield size={16}/> Apple Pay · Google Pay · Card
                </div>
                <div className="flex items-center gap-2 text-white/80 font-body text-sm">
                  <Lock size={16}/> Powered by Stripe · Cancel anytime
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={handlePlanSubscribe}
              className="w-full py-5 rounded-3xl font-display text-xl flex items-center justify-center gap-3 shadow-lg font-bold"
              style={{ background:`linear-gradient(135deg,${C.yellow},#FF8F00)`, color:"white" }}>
              <EmojiSvg code="1f31f" size={24}/> Get {selectedPlan.name}
            </motion.button>

            <p className="font-body text-center text-xs text-slate-400 px-4">
              Secure checkout via Stripe · Apple Pay & Google Pay supported
            </p>

            {/* Payment badges */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { code:"1f512", label:"Secure"     },
                { code:"1f4b3", label:"Stripe"     },
                { code:"1f34f", label:"Apple Pay"  },
                { code:"1f310", label:"Google Pay" },
              ].map((b,i) => (
                <div key={i} className="rounded-2xl py-3 text-center bg-white border-2 border-white shadow-sm">
                  <EmojiSvg code={b.code} size={18}/>
                  <div className="font-body text-xs text-slate-400 mt-1">{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Individual purchases */}
        <div className="mb-16">
          <h2 className="font-display text-2xl mb-2 font-bold" style={{ color:C.blue }}>
            Individual purchases
          </h2>
          <p className="font-body text-slate-500 text-sm mb-5">No subscription needed — buy exactly what you want</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {INDIVIDUAL_PRODUCTS.map((p,i) => (
              <ProductRow key={p.id} product={p} delay={i*0.08}
                onBuy={prod => openModal(prod, prod.price, "one-time")}/>
            ))}
          </div>
        </div>

        {/* Lifetime */}
        <div className="mb-16">
          <h2 className="font-display text-2xl mb-2 font-bold" style={{ color:C.blue }}>
            Lifetime access
          </h2>
          <p className="font-body text-slate-500 text-sm mb-5">Pay once, use forever — no renewals, ever</p>
          <div className="grid sm:grid-cols-2 gap-5">
            {LIFETIME.map((plan,i) => (
              <LifetimeCard key={plan.id} plan={plan} delay={i*0.1}
                onBuy={p => openModal(p, p.price, "one-time")}/>
            ))}
          </div>
        </div>

        {/* Supporters wall */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
          className="mt-4 text-center">
          <h2 className="font-display text-2xl mb-2 font-bold" style={{ color:C.blue }}>
            Our Kiddsy Heroes <EmojiSvg code="1f49b" size={18} style={{ verticalAlign:"middle", marginLeft:4 }}/>
          </h2>
          <p className="font-body text-slate-500 mb-6 text-sm">These wonderful families make Kiddsy possible.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["María G.","Ahmed K.","Famille Dumont","Sofia R.","Omar A.","The Chen Family","Yasmin B.","Lucas F."].map((name,i) => (
              <motion.span key={i} initial={{ scale:0 }} animate={{ scale:1 }}
                transition={{ delay:0.6+i*0.07, type:"spring" }}
                className="px-4 py-2 rounded-full font-body text-sm font-semibold bg-white shadow-sm border-2 border-white text-slate-600">
                <EmojiSvg code="2764" size={12}/> {name}
              </motion.span>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

// ─── Shield SVG ───────────────────────────────────────────────────────────
function Shield({ size, style, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={style} className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}
