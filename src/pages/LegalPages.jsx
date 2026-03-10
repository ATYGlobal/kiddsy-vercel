/**
 * src/pages/LegalPages.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Exports: { AvisoLegal, Privacidad }
 * Props de cada uno: { onNav }  ← para el botón "Volver"
 *
 * Textos estándar adaptados a una app infantil bilingüe (ES/EN).
 * Actualiza las fechas y el nombre del titular cuando proceda.
 * ─────────────────────────────────────────────────────────────────────────
 */
import React from "react";
import { motion } from "framer-motion";
import {
  FileText, Shield, ArrowLeft, Baby, Lock,
  Eye, Globe, Mail, AlertCircle,
} from "lucide-react";

// ── Paleta ────────────────────────────────────────────────────────────────
const C = {
  blue:        "#1565C0",
  blueSoft:    "#E3F2FD",
  red:         "#E53935",
  redSoft:     "#FFEBEE",
  yellow:      "#F9A825",
  yellowSoft:  "#FFFDE7",
  green:       "#43A047",
  greenSoft:   "#E8F5E9",
  magenta:     "#D81B60",
  magentaSoft: "#FCE4EC",
  cyan:        "#00ACC1",
  cyanSoft:    "#E0F7FA",
};

const FF = "var(--font-display,'Nunito',sans-serif)";
const FB = "var(--font-body,'Nunito',sans-serif)";

// ── Componentes compartidos ───────────────────────────────────────────────
function PageHeader({ icon: Icon, iconColor, iconBg, title, subtitle }) {
  return (
    <div style={{ textAlign:"center", padding:"48px 16px 32px" }}>
      <motion.div
        initial={{ scale:0.8, opacity:0 }}
        animate={{ scale:1,   opacity:1 }}
        transition={{ type:"spring", stiffness:200 }}
        style={{
          display:        "inline-flex",
          alignItems:     "center",
          justifyContent: "center",
          width:          64,
          height:         64,
          borderRadius:   20,
          background:     iconBg,
          marginBottom:   16,
          boxShadow:      "0 4px 16px rgba(0,0,0,0.07)",
        }}
      >
        <Icon size={28} style={{ color:iconColor }} strokeWidth={2}/>
      </motion.div>
      <motion.h1
        initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        style={{ fontFamily:FF, fontWeight:800, fontSize:36, color:iconColor, margin:"0 0 10px" }}
      >
        {title}
      </motion.h1>
      <p style={{ fontFamily:FB, fontSize:15, color:"#64748B", maxWidth:480, margin:"0 auto", lineHeight:1.6 }}>
        {subtitle}
      </p>
    </div>
  );
}

function BackButton({ onNav, label = "Volver", dest = "legal" }) {
  return (
    <motion.button
      whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
      onClick={() => onNav(dest)}
      style={{
        display:     "inline-flex",
        alignItems:  "center",
        gap:         6,
        padding:     "8px 16px",
        borderRadius: 999,
        border:      "none",
        background:  C.blueSoft,
        color:       C.blue,
        fontFamily:  FF,
        fontWeight:  700,
        fontSize:    13,
        cursor:      "pointer",
        marginBottom: 24,
      }}
    >
      <ArrowLeft size={15} strokeWidth={2}/> {label}
    </motion.button>
  );
}

function Section({ title, accent = C.blue, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:0.3 }}
      style={{
        background:   "white",
        borderRadius: 20,
        padding:      "20px 24px",
        marginBottom: 12,
        border:       "2px solid #F1F5F9",
        boxShadow:    "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <h3 style={{ fontFamily:FF, fontWeight:700, fontSize:16, color:accent, margin:"0 0 10px" }}>
        {title}
      </h3>
      <div style={{ fontFamily:FB, fontSize:14, color:"#475569", lineHeight:1.7 }}>
        {children}
      </div>
    </motion.div>
  );
}

function InfoBanner({ icon: Icon, color, bg, children }) {
  return (
    <div style={{
      display:      "flex",
      gap:          12,
      alignItems:   "flex-start",
      padding:      "14px 18px",
      borderRadius: 16,
      background:   bg,
      border:       `2px solid ${color}22`,
      marginBottom: 20,
    }}>
      <Icon size={18} strokeWidth={2} style={{ color, flexShrink:0, marginTop:2 }}/>
      <p style={{ fontFamily:FB, fontSize:13, color:"#475569", margin:0, lineHeight:1.6 }}>
        {children}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── AVISO LEGAL ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
export function AvisoLegal({ onNav }) {
  return (
    <div
      className="min-h-screen"
      style={{ background:"linear-gradient(160deg,#EFF6FF 0%,#FFFDE7 50%,#F0FFF4 100%)" }}
    >
      <PageHeader
        icon={FileText}
        iconColor={C.blue}
        iconBg={C.blueSoft}
        title="Mentions Légales / Aviso Legal"
        subtitle="Legal Notice · Kiddsy — Conforme à la législation française et au droit européen."
      />

      <div style={{ maxWidth:720, margin:"0 auto", padding:"0 16px 60px" }}>
        <BackButton onNav={onNav}/>

        <InfoBanner icon={AlertCircle} color={C.blue} bg={C.blueSoft}>
          <strong>Última actualización: marzo 2026.</strong> Este aviso legal está redactado en
          lenguaje sencillo para que cualquier familia pueda entenderlo.
          Dernière mise à jour : mars 2026.
        </InfoBanner>

        <Section title="1. Identificación del titular / Identification de l'éditeur" delay={0.05}>
          <p>
            Conformément à l'article 6 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance
            dans l'Économie Numérique (LCEN), les informations suivantes sont portées à la
            connaissance des utilisateurs :
          </p>
          <ul style={{ margin:"10px 0 0 16px", padding:0 }}>
            <li><strong>Dénomination / Denominación:</strong> Kiddsy</li>
            <li><strong>Domicilio / Siège social:</strong> Mulhouse, France</li>
            <li><strong>Activité / Actividad:</strong> Application web éducative bilingue gratuite pour les familles.</li>
            <li><strong>Correo / Courriel:</strong> legal@kiddsy.org</li>
            <li>
              <strong>Hébergement / Alojamiento:</strong> Vercel Inc., 340 Pine Street, Suite 701,
              San Francisco, CA 94104, USA — <a href="https://vercel.com" target="_blank"
              rel="noopener noreferrer" style={{color:C.blue}}>vercel.com</a>
            </li>
          </ul>
        </Section>

        <Section title="2. Objeto y ámbito de aplicación / Objet" delay={0.08}>
          Kiddsy es una aplicación web gratuita diseñada para ayudar a familias inmigrantes y
          multiculturales a aprender inglés juntas mediante cuentos bilingües generados con
          inteligencia artificial. Kiddsy est une application web gratuite conçue pour aider les
          familles immigrantes et multiculturelles à apprendre l'anglais ensemble grâce à des
          histoires bilingues générées par intelligence artificielle. El acceso y uso de la
          aplicación implica la aceptación plena de este Aviso Legal.
        </Section>

        <Section title="3. Propiedad intelectual / Propriété intellectuelle" delay={0.11}>
          El nombre "Kiddsy", el logotipo, el diseño de la interfaz, los textos propios y el código
          fuente están protegidos por la législation française et internationale en matière de
          propriété intellectuelle (Code de la propriété intellectuelle). Queda prohibida su
          reproducción total o parcial, distribución o transformación sin autorización expresa y
          por escrito del titular, salvo para uso personal y educativo no comercial. Los cuentos
          generados por la IA a petición del usuario se proporcionan únicamente para su uso
          personal y no implican cesión de derechos al titular.
        </Section>

        <Section title="4. Exención de responsabilidad / Limitation de responsabilité" delay={0.14}>
          <p>
            Kiddsy se ofrece "tal cual" y "según disponibilidad". Conformément au droit français,
            Kiddsy ne saurait être tenu responsable des dommages directs ou indirects résultant
            de l'utilisation ou de l'impossibilité d'utiliser l'application. Todos los cuentos
            deben ser revisados por un adulto o tutor antes de ser compartidos con menores.
          </p>
          <p style={{ marginTop:8 }}>
            Kiddsy no será responsable de los contenidos de sitios web enlazados externamente
            (p. ej. Trustpilot, PayPal o Groq). Les liens hypertextes vers des sites tiers sont
            fournis à titre informatif uniquement.
          </p>
        </Section>

        <Section title="5. Protection des mineurs / Protección de menores (RGPD / CNIL)" delay={0.17}>
          Kiddsy ne collecte pas sciemment de données personnelles d'enfants de moins de 13 ans,
          conformément au RGPD et aux recommandations de la CNIL. La aplicación está concebida
          para ser utilizada por padres o tutores junto con sus hijos. Si vous pensez qu'un mineur
          a fourni des données personnelles sans autorisation, contactez-nous immédiatement à
          l'adresse <strong>legal@kiddsy.org</strong> pour procéder à leur suppression.
        </Section>

        <Section title="6. Législation applicable et juridiction / Legislación y jurisdicción" delay={0.20}>
          Les présentes mentions légales sont régies par le droit français. En cas de litige
          relatif à l'utilisation de l'application, et à défaut de résolution amiable, les
          parties conviennent de soumettre le différend aux <strong>Tribunaux compétents
          de Mulhouse (France)</strong>, conformément aux règles de compétence du Code de
          procédure civile français et sous réserve des dispositions protectrices applicables
          aux consommateurs résidant dans l'Union Européenne.
        </Section>

        <Section title="7. Modificaciones / Modifications" delay={0.23}>
          Kiddsy se réserve le droit de modifier ces mentions légales à tout moment. La date de
          dernière mise à jour figure en tête du présent document. La continuación del uso de la
          aplicación tras dichas modificaciones implica la aceptación de las mismas.
        </Section>

        <Section title="8. Contact / Contacto" delay={0.26} accent={C.green}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Mail size={15} strokeWidth={2} style={{ color:C.green, flexShrink:0 }}/>
            <span>
              Pour toute question juridique / Para cualquier consulta legal :{" "}
              <strong>legal@kiddsy.org</strong>
            </span>
          </div>
        </Section>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── PRIVACIDAD ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
export function Privacidad({ onNav }) {
  const cards = [
    {
      icon:   Lock,
      color:  C.blue,
      bg:     C.blueSoft,
      title:  "Qué datos recogemos",
      points: [
        "Nombre de pila del niño (solo si lo introduces para generar un cuento — se envía a Groq/IA, no lo almacenamos).",
        "Tema del cuento elegido (ídem: solo viaja a la IA, no se guarda en nuestros servidores).",
        "Preferencia de idioma (guardada en localStorage de tu navegador).",
        "Cuentos generados (guardados únicamente en tu dispositivo vía localStorage).",
        "Analítica anónima de uso (páginas vistas, errores — sin identificadores personales).",
      ],
    },
    {
      icon:   AlertCircle,
      color:  C.red,
      bg:     C.redSoft,
      title:  "Qué nunca recogemos",
      points: [
        "Correos electrónicos (salvo que te suscribas voluntariamente al Kiddsy Club).",
        "Apellidos, direcciones, teléfonos ni cualquier otra información identificativa.",
        "Fotos, grabaciones de voz ni biometría.",
        "Datos de menores de 13 años de forma consciente.",
        "Identificadores de dispositivo ni IDs publicitarios.",
      ],
    },
    {
      icon:   Globe,
      color:  C.magenta,
      bg:     C.magentaSoft,
      title:  "Cómo usamos la IA (Groq)",
      points: [
        "Al generar un cuento, el nombre del niño y el tema se envían a la API de Groq.",
        "Groq procesa esta información para crear el texto del cuento en tiempo real (streaming).",
        "Kiddsy no almacena el nombre ni el tema tras mostrar el cuento.",
        "El uso de datos por parte de Groq se rige por su propia política de privacidad (groq.com/privacy).",
      ],
    },
    {
      icon:   Eye,
      color:  C.green,
      bg:     C.greenSoft,
      title:  "Cookies y almacenamiento local",
      points: [
        "Usamos localStorage del navegador únicamente para guardar tu idioma preferido y los cuentos generados.",
        "No hay cookies publicitarias.",
        "No hay píxeles de seguimiento.",
        "Puedes eliminar estos datos en cualquier momento desde los ajustes de tu navegador.",
      ],
    },
    {
      icon:   Baby,
      color:  C.cyan,
      bg:     C.cyanSoft,
      title:  "Tus derechos (RGPD / LOPD-GDD)",
      points: [
        "Derecho de acceso: hemos listado arriba todo lo que recopilamos.",
        "Derecho de supresión: como no almacenamos tus datos en nuestros servidores, no hay nada que eliminar.",
        "Derecho de oposición: puedes dejar de usar el generador de IA en cualquier momento.",
        "Newsletter Kiddsy Club: puedes darte de baja en cada email con un solo clic.",
        "Para cualquier consulta sobre privacidad: legal@kiddsy.org",
      ],
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background:"linear-gradient(160deg,#F0FFF4 0%,#FFFDE7 50%,#EFF6FF 100%)" }}
    >
      <PageHeader
        icon={Shield}
        iconColor={C.green}
        iconBg={C.greenSoft}
        title="Política de Privacidad"
        subtitle="Privacy Policy · Kiddsy — Construido para familias, no para anunciantes."
      />

      <div style={{ maxWidth:720, margin:"0 auto", padding:"0 16px 60px" }}>
        <BackButton onNav={onNav}/>

        <InfoBanner icon={Shield} color={C.green} bg={C.greenSoft}>
          <strong>Privacidad sin letra pequeña.</strong> Última actualización: marzo 2026.
          Si tienes menos de 16 años, pide a tu padre, madre o tutor que lea esto contigo.
        </InfoBanner>

        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity:0, y:16 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                borderRadius: 20,
                overflow:     "hidden",
                marginBottom: 12,
                border:       "2px solid white",
                boxShadow:    "0 2px 10px rgba(0,0,0,0.05)",
                background:   card.bg,
              }}
            >
              {/* Card header */}
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"16px 20px 10px" }}>
                <div style={{
                  width:36, height:36, borderRadius:12,
                  background:"white", boxShadow:"0 2px 8px rgba(0,0,0,0.07)",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                }}>
                  <Icon size={18} strokeWidth={2} style={{ color:card.color }}/>
                </div>
                <h3 style={{ fontFamily:FF, fontWeight:700, fontSize:16, color:card.color, margin:0 }}>
                  {card.title}
                </h3>
              </div>
              {/* Points */}
              <div style={{ padding:"0 20px 16px" }}>
                {card.points.map((p, j) => (
                  <div key={j} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:6 }}>
                    <div style={{
                      width:6, height:6, borderRadius:"50%",
                      background:card.color, flexShrink:0, marginTop:6,
                    }}/>
                    <p style={{ fontFamily:FB, fontSize:13, color:"#475569", margin:0, lineHeight:1.6 }}>
                      {p}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* Contact */}
        <motion.div
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.42 }}
          style={{
            textAlign:    "center",
            padding:      "20px 24px",
            borderRadius: 20,
            background:   "white",
            border:       "2px solid #F1F5F9",
            boxShadow:    "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <p style={{ fontFamily:FB, fontSize:14, color:"#64748B", margin:"0 0 6px" }}>
            ¿Tienes preguntas sobre privacidad?
          </p>
          <a
            href="mailto:legal@kiddsy.org"
            style={{
              display:    "inline-flex",
              alignItems: "center",
              gap:        6,
              fontFamily: FF,
              fontWeight: 700,
              fontSize:   14,
              color:      C.blue,
            }}
          >
            <Mail size={15} strokeWidth={2}/>
            legal@kiddsy.org
          </a>
        </motion.div>
      </div>
    </div>
  );
}
