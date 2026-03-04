/**
 * Legal.jsx — Kiddsy Loop
 * Sections: FAQ accordion + Terms of Use + Privacy Policy
 * Colors from logo: blue #1565C0, red #E53935, yellow #FDD835, green #43A047
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Shield, FileText, HelpCircle,
  Lock, Eye, Baby, Sparkles, BookOpen, Heart
} from "lucide-react";

// ─── Brand colors ──────────────────────────────────────────────────────────
const C = {
  blue:    "#1565C0",
  blueSoft:"#E3F2FD",
  red:     "#E53935",
  redSoft: "#FFEBEE",
  yellow:  "#FDD835",
  yellowSoft: "#FFFDE7",
  green:   "#43A047",
  greenSoft: "#E8F5E9",
  magenta: "#D81B60",
  magentaSoft: "#FCE4EC",
  cyan:    "#00ACC1",
  cyanSoft:"#E0F7FA",
};

// ─── FAQ Data ──────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    icon: Baby,
    color: C.blue,
    bg: C.blueSoft,
    q: "Is Kiddsy Loop safe for my children?",
    a: "Absolutely! Kiddsy Loop is designed with child safety as our top priority. All AI-generated stories go through a content filter to ensure they are age-appropriate, positive, and free from any harmful content. We follow COPPA guidelines and never collect personal data from children under 13.",
  },
  {
    icon: Sparkles,
    color: C.magenta,
    bg: C.magentaSoft,
    q: "How does the AI generate the stories?",
    a: "We use OpenAI's GPT technology to create bilingual stories based on the child's name and a theme you choose. The AI is instructed to produce short, joyful, educational sentences that help families learning English together. No story is stored on our servers — they are generated fresh each time.",
  },
  {
    icon: Lock,
    color: C.green,
    bg: C.greenSoft,
    q: "What data do you collect and store?",
    a: "We do not require account creation to use Kiddsy Loop. When you generate a story, only the child's first name and chosen theme are sent to the AI — never a surname, email, or any identifying information. We do not store generated stories on our database. See our Privacy Policy for full details.",
  },
  {
    icon: Eye,
    color: C.cyan,
    bg: C.cyanSoft,
    q: "Are there ads or in-app purchases?",
    a: "Kiddsy Loop is currently ad-free. We believe learning should be distraction-free. Our optional donation section exists to help us keep the lights on and expand the app. There are no premium tiers or paid features — everything is free for families.",
  },
  {
    icon: BookOpen,
    color: C.red,
    bg: C.redSoft,
    q: "Which languages are supported?",
    a: "Right now Kiddsy Loop supports Spanish, French, and Arabic as translation languages, alongside English. We are actively working on adding Portuguese, Mandarin, and Wolof. If you'd like to help translate or contribute, please reach out via our Collaboration form!",
  },
  {
    icon: Heart,
    color: C.yellow,
    bg: C.yellowSoft,
    q: "Can I use Kiddsy Loop in a classroom?",
    a: "Yes! Kiddsy Loop was designed with educators and volunteer teachers in mind. You may freely use it in ESL classrooms, community centers, and family literacy programs. If you are an educator and want a tailored version or bulk story packs, please get in touch via our Collaboration page.",
  },
];

// ─── FAQ Accordion Item ────────────────────────────────────────────────────
function FAQItem({ item, index, isOpen, onToggle }) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 200 }}
      className="rounded-3xl overflow-hidden border-2 border-white shadow-md bg-white"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-6 py-5 text-left"
        style={{ background: isOpen ? item.bg : "white" }}
      >
        {/* Icon bubble */}
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
          style={{ background: item.bg }}
        >
          <Icon size={20} style={{ color: item.color }} />
        </div>

        <span
          className="flex-1 font-display text-lg leading-snug"
          style={{ color: isOpen ? item.color : "#374151" }}
        >
          {item.q}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0"
          style={{ color: item.color }}
        >
          <ChevronDown size={22} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-2 font-body text-slate-600 text-base leading-relaxed border-t border-slate-100">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Section: FAQ ──────────────────────────────────────────────────────────
function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      {FAQ_ITEMS.map((item, i) => (
        <FAQItem
          key={i}
          item={item}
          index={i}
          isOpen={openIdx === i}
          onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
        />
      ))}
    </div>
  );
}

// ─── Section: Terms of Use ─────────────────────────────────────────────────
function TermsSection() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      text: "By accessing and using Kiddsy Loop ('the App'), you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the App. These terms apply to all visitors, users, and others who access or use the App.",
    },
    {
      title: "2. Description of Service",
      text: "Kiddsy Loop is a free bilingual storybook application designed to help migrant families learn English together. The App uses artificial intelligence to generate short, educational stories. No account creation is required. The service is provided 'as is' and may be updated or modified at any time.",
    },
    {
      title: "3. User Conduct",
      text: "You agree to use Kiddsy Loop only for lawful, personal, and non-commercial educational purposes. You must not attempt to reverse-engineer the application, overload our servers, or use the story generation feature for any purpose other than personal family education. Automated or bulk use of the story generator is not permitted.",
    },
    {
      title: "4. Intellectual Property",
      text: "The Kiddsy Loop name, logo, and overall design are the property of Kiddsy Loop and its creators. Stories generated by the AI using your prompts are provided for your personal use. We retain no ownership of personally generated content. The underlying AI model is provided by OpenAI and is subject to their terms of service.",
    },
    {
      title: "5. Children's Privacy (COPPA)",
      text: "Kiddsy Loop does not knowingly collect personal information from children under 13 years of age. The app is designed to be used by parents or guardians with their children. If you believe a child has provided us with personal information, please contact us immediately at hello@kiddsyloop.com.",
    },
    {
      title: "6. Disclaimer of Warranties",
      text: "Kiddsy Loop is provided on an 'as is' and 'as available' basis. We make no warranties, expressed or implied, regarding the reliability, accuracy, or suitability of the content generated. AI-generated stories are for educational entertainment purposes and should be reviewed by a parent or guardian.",
    },
    {
      title: "7. Limitation of Liability",
      text: "To the fullest extent permitted by law, Kiddsy Loop and its creators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the App. Our total liability shall not exceed the amount of any donation you have voluntarily made through the App.",
    },
    {
      title: "8. Changes to Terms",
      text: "We reserve the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of this page. Your continued use of the App following changes constitutes acceptance of the new terms.",
    },
    {
      title: "9. Contact",
      text: "For questions about these Terms, please contact us at: hello@kiddsyloop.com",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-5 flex gap-3 items-start">
        <FileText size={20} style={{ color: C.blue }} className="flex-shrink-0 mt-0.5" />
        <p className="font-body text-sm text-blue-700">
          <strong>Last updated: March 2026.</strong> These terms are written in plain language
          so that every family can understand them, regardless of their English level.
        </p>
      </div>
      {sections.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm"
        >
          <h3 className="font-display text-lg mb-2" style={{ color: C.blue }}>{s.title}</h3>
          <p className="font-body text-slate-600 text-sm leading-relaxed">{s.text}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Section: Privacy Policy ───────────────────────────────────────────────
function PrivacySection() {
  const items = [
    {
      icon: "🔒",
      title: "What We Collect",
      color: C.blue,
      bg: C.blueSoft,
      points: [
        "Child's first name (only if you enter it for story generation — sent to OpenAI, not stored by us)",
        "Story theme you select (sent to OpenAI, not stored by us)",
        "Anonymous usage analytics (page views, errors — no personal identifiers)",
        "Voluntary donation information (processed entirely by PayPal — we never see your payment details)",
      ],
    },
    {
      icon: "🚫",
      title: "What We Never Collect",
      color: C.red,
      bg: C.redSoft,
      points: [
        "Email addresses (no account required)",
        "Full names, addresses, or phone numbers",
        "Photos or voice recordings",
        "Data from children under 13 knowingly",
        "Device identifiers or advertising IDs",
      ],
    },
    {
      icon: "🤖",
      title: "How We Use OpenAI",
      color: C.magenta,
      bg: C.magentaSoft,
      points: [
        "When you generate a story, the child's name and theme are sent to OpenAI's API",
        "OpenAI processes this to create the story text",
        "Kiddsy Loop does not store the name or theme after the story is displayed",
        "OpenAI's use of API data is governed by their own privacy policy (openai.com/privacy)",
      ],
    },
    {
      icon: "🍪",
      title: "Cookies & Storage",
      color: C.green,
      bg: C.greenSoft,
      points: [
        "We use browser localStorage only to remember your language preference",
        "No advertising cookies",
        "No tracking pixels",
        "You can clear this data any time via your browser settings",
      ],
    },
    {
      icon: "👨‍👩‍👧",
      title: "Your Rights (GDPR / CCPA)",
      color: C.cyan,
      bg: C.cyanSoft,
      points: [
        "Right to know: We have just told you everything we collect above",
        "Right to delete: Since we don't store your data, there is nothing to delete",
        "Right to object: You can stop using the AI generator at any time",
        "For EU residents: Our legal basis is Legitimate Interest for analytics",
        "Contact: hello@kiddsyloop.com for any privacy questions",
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="bg-green-50 border-2 border-green-100 rounded-3xl p-5 flex gap-3 items-start">
        <Shield size={20} style={{ color: C.green }} className="flex-shrink-0 mt-0.5" />
        <p className="font-body text-sm text-green-700">
          <strong>Privacy made simple.</strong> We built Kiddsy Loop for families, not advertisers.
          Here is everything you need to know, no lawyer-speak required.
        </p>
      </div>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="rounded-3xl overflow-hidden border-2 border-white shadow-md"
          style={{ background: item.bg }}
        >
          <div className="px-6 pt-5 pb-3 flex items-center gap-3">
            <span className="text-2xl">{item.icon}</span>
            <h3 className="font-display text-xl" style={{ color: item.color }}>{item.title}</h3>
          </div>
          <div className="px-6 pb-5 space-y-2">
            {item.points.map((p, j) => (
              <div key={j} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: item.color }} />
                <p className="font-body text-sm text-slate-700 leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Legal Component ──────────────────────────────────────────────────
const TABS = [
  { id: "faq",     label: "FAQ",            icon: HelpCircle, color: C.blue },
  { id: "terms",   label: "Terms of Use",   icon: FileText,   color: C.red },
  { id: "privacy", label: "Privacy Policy", icon: Shield,     color: C.green },
];

export default function Legal() {
  const [tab, setTab] = useState("faq");
  const active = TABS.find(t => t.id === tab);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #EFF6FF 0%, #FFFDE7 50%, #F0FFF4 100%)" }}>
      {/* Page header */}
      <div className="text-center py-12 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-4 shadow-lg"
          style={{ background: C.blueSoft }}
        >
          <HelpCircle size={28} style={{ color: C.blue }} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl mb-3"
          style={{ color: C.blue }}
        >
          Help & Legal
        </motion.h1>
        <p className="font-body text-slate-500 text-lg max-w-md mx-auto">
          Everything you need to know about Kiddsy Loop — written clearly, for every family.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex justify-center px-4 mb-10">
        <div className="flex gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md border border-white">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-full font-display text-sm transition-all duration-200"
                style={{
                  background: isActive ? t.color : "transparent",
                  color: isActive ? "white" : "#6B7280",
                }}
              >
                <Icon size={15} />
                {t.label}
                {isActive && (
                  <motion.div
                    layoutId="legal-tab-bg"
                    className="absolute inset-0 rounded-full -z-10"
                    style={{ background: t.color }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-3xl mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "faq"     && <FAQSection />}
            {tab === "terms"   && <TermsSection />}
            {tab === "privacy" && <PrivacySection />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
