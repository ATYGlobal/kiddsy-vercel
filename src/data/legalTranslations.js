/**
 * src/data/legalTranslations.js — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Traducciones completas del Aviso Legal y Política de Privacidad para los
 * 16 idiomas de la app: en, es, fr, ar, pt, de, it, zh, ja, ko, ru, hi,
 * tr, nl, pl, sv.
 *
 * Uso:
 *   import { LEGAL_T, detectLang } from "../data/legalTranslations.js";
 *   const t = LEGAL_T[detectLang()] ?? LEGAL_T.en;
 * ─────────────────────────────────────────────────────────────────────────
 */

// ── Auto-detecta el idioma del dispositivo y lo mapea a los 16 soportados ─
export function detectLang() {
  const nav = navigator.language || navigator.userLanguage || "en";
  const code = nav.slice(0, 2).toLowerCase();
  const supported = ["en","es","fr","ar","pt","de","it","zh","ja","ko","ru","hi","tr","nl","pl","sv"];
  return supported.includes(code) ? code : "en";
}

export const LEGAL_T = {

  // ════════════════════════════════════════════════════════════════════════
  // ENGLISH
  // ════════════════════════════════════════════════════════════════════════
  en: {
    dir: "ltr",
    back: "Back",
    contact_q: "Questions about privacy?",
    last_updated: "Last updated: March 2026",

    // ── Legal notice ────────────────────────────────────────────────────
    legal_title: "Legal Notice",
    legal_subtitle: "Kiddsy — Global Bilingual Educational App",
    legal_banner: "This legal notice is written in plain language so every family can understand it.",
    legal_sections: [
      {
        title: "1. Publisher Identification",
        content: "In accordance with applicable digital commerce laws, the following information is disclosed. Name: Kiddsy. Registered office: Mulhouse, France. Activity: Free bilingual educational web application for families. Email: legal@kiddsy.org. Hosting: Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA (vercel.com).",
      },
      {
        title: "2. Purpose and Scope",
        content: "Kiddsy is a free web app designed to help immigrant and multicultural families learn English together through AI-generated bilingual stories. Access to and use of the application implies full acceptance of this Legal Notice.",
      },
      {
        title: "3. Intellectual Property",
        content: "The name 'Kiddsy', the logo, the interface design, original texts and source code are protected by intellectual property law. Reproduction, distribution or transformation without express written authorisation is prohibited, except for personal and non-commercial educational use. AI-generated stories are provided for personal use only.",
      },
      {
        title: "4. Limitation of Liability",
        content: "Kiddsy is provided 'as is' and 'as available'. Kiddsy shall not be liable for direct or indirect damages resulting from use or inability to use the application. All stories must be reviewed by an adult or guardian before being shared with minors. Links to external sites (e.g. Trustpilot, PayPal, Groq) are provided for information purposes only.",
      },
      {
        title: "5. Protection of Minors (GDPR / COPPA)",
        content: "Kiddsy does not knowingly collect personal data from children under 13, in compliance with GDPR and COPPA. The application is designed to be used by parents or guardians together with their children. If you believe a minor has provided personal data without authorisation, contact us immediately at legal@kiddsy.org.",
      },
      {
        title: "6. Applicable Law and Jurisdiction",
        content: "This Legal Notice is governed by French law. In the event of a dispute, and in the absence of an amicable resolution, the parties agree to submit the matter to the competent courts of Mulhouse, France, subject to protective provisions applicable to consumers residing in the European Union.",
      },
      {
        title: "7. Modifications",
        content: "Kiddsy reserves the right to modify this legal notice at any time. The date of the last update appears at the top of this document. Continued use of the application after such modifications implies acceptance thereof.",
      },
      {
        title: "8. Contact",
        content: "For any legal enquiry: legal@kiddsy.org",
        accent: "green",
      },
    ],

    // ── Privacy policy ───────────────────────────────────────────────────
    privacy_title: "Privacy Policy",
    privacy_subtitle: "Kiddsy — Built for families, not advertisers.",
    privacy_banner: "Privacy without fine print. Last updated: March 2026. If you are under 16, please read this with a parent or guardian.",
    privacy_cards: [
      {
        icon: "Lock",
        color: "blue",
        title: "What data we collect",
        points: [
          "Child's first name (only if you enter it to generate a story — sent to Groq/AI, not stored by us).",
          "Story topic chosen (same: only travels to the AI, not saved on our servers).",
          "Language preference (saved in your browser's localStorage).",
          "Generated stories (saved on your device only via localStorage).",
          "Anonymous usage analytics (page views, errors — no personal identifiers).",
        ],
      },
      {
        icon: "AlertCircle",
        color: "red",
        title: "What we never collect",
        points: [
          "Email addresses (unless you voluntarily subscribe to Kiddsy Club).",
          "Last names, addresses, phone numbers or any other identifying information.",
          "Photos, voice recordings or biometric data.",
          "Personal data from children under 13 knowingly.",
          "Device identifiers or advertising IDs.",
        ],
      },
      {
        icon: "Globe",
        color: "magenta",
        title: "How we use AI (Groq)",
        points: [
          "When generating a story, the child's name and topic are sent to the Groq API.",
          "Groq processes this information to create the story text in real time (streaming).",
          "Kiddsy does not store the name or topic after displaying the story.",
          "Data use by Groq is governed by their own privacy policy (groq.com/privacy).",
        ],
      },
      {
        icon: "Eye",
        color: "green",
        title: "Cookies and local storage",
        points: [
          "We use browser localStorage only to save your preferred language and generated stories.",
          "No advertising cookies.",
          "No tracking pixels.",
          "You can delete this data at any time from your browser settings.",
        ],
      },
      {
        icon: "Baby",
        color: "cyan",
        title: "Your rights (GDPR)",
        points: [
          "Right of access: we have listed everything we collect above.",
          "Right to erasure: since we do not store your data on our servers, there is nothing to delete.",
          "Right to object: you can stop using the AI generator at any time.",
          "Kiddsy Club newsletter: you can unsubscribe from each email with one click.",
          "For any privacy enquiry: legal@kiddsy.org",
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // ESPAÑOL
  // ════════════════════════════════════════════════════════════════════════
  es: {
    dir: "ltr",
    back: "Volver",
    contact_q: "¿Preguntas sobre privacidad?",
    last_updated: "Actualizado: Marzo 2026",

    legal_title: "Aviso Legal",
    legal_subtitle: "Kiddsy — App Educativa Bilingüe Global",
    legal_banner: "Este aviso legal está redactado en lenguaje sencillo para que cualquier familia pueda entenderlo.",
    legal_sections: [
      {
        title: "1. Identificación del titular",
        content: "De conformidad con la legislación aplicable, se facilitan los siguientes datos: Denominación: Kiddsy. Domicilio: Mulhouse, Francia. Actividad: Aplicación web educativa bilingüe gratuita para familias. Correo electrónico: legal@kiddsy.org. Alojamiento: Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, EE. UU. (vercel.com).",
      },
      {
        title: "2. Objeto y ámbito de aplicación",
        content: "Kiddsy es una aplicación web gratuita diseñada para ayudar a familias inmigrantes y multiculturales a aprender inglés juntas mediante cuentos bilingües generados con inteligencia artificial. El acceso y uso de la aplicación implica la aceptación plena de este Aviso Legal.",
      },
      {
        title: "3. Propiedad intelectual",
        content: "El nombre 'Kiddsy', el logotipo, el diseño de la interfaz, los textos propios y el código fuente están protegidos por la legislación de propiedad intelectual. Queda prohibida su reproducción, distribución o transformación sin autorización expresa y por escrito del titular, salvo para uso personal y educativo no comercial. Los cuentos generados por la IA se proporcionan únicamente para uso personal.",
      },
      {
        title: "4. Exención de responsabilidad",
        content: "Kiddsy se ofrece 'tal cual' y 'según disponibilidad'. Kiddsy no será responsable de los daños directos o indirectos derivados del uso o la imposibilidad de uso de la aplicación. Todos los cuentos deben ser revisados por un adulto o tutor antes de ser compartidos con menores. Los enlaces a sitios externos son meramente informativos.",
      },
      {
        title: "5. Protección de menores (RGPD / LOPD)",
        content: "Kiddsy no recoge conscientemente datos personales de menores de 13 años, de conformidad con el RGPD y la LOPD-GDD. La aplicación está concebida para ser utilizada por padres o tutores junto con sus hijos. Si cree que un menor ha facilitado datos personales sin autorización, contáctenos de inmediato en legal@kiddsy.org.",
      },
      {
        title: "6. Legislación aplicable y jurisdicción",
        content: "Este Aviso Legal se rige por el derecho francés. En caso de litigio, y a falta de resolución amistosa, las partes acuerdan someter el asunto a los tribunales competentes de Mulhouse (Francia), sin perjuicio de las disposiciones protectoras aplicables a los consumidores residentes en la Unión Europea.",
      },
      {
        title: "7. Modificaciones",
        content: "Kiddsy se reserva el derecho de modificar este aviso legal en cualquier momento. La fecha de la última actualización figura en el encabezado. La continuación del uso de la aplicación implica la aceptación de dichas modificaciones.",
      },
      {
        title: "8. Contacto",
        content: "Para cualquier consulta legal: legal@kiddsy.org",
        accent: "green",
      },
    ],

    privacy_title: "Política de Privacidad",
    privacy_subtitle: "Kiddsy — Construido para familias, no para anunciantes.",
    privacy_banner: "Privacidad sin letra pequeña. Actualización: marzo 2026. Si tienes menos de 16 años, pide a un adulto que lo lea contigo.",
    privacy_cards: [
      {
        icon: "Lock",
        color: "blue",
        title: "Qué datos recogemos",
        points: [
          "Nombre de pila del niño (solo si lo introduces para generar un cuento — se envía a Groq/IA, no lo almacenamos).",
          "Tema del cuento elegido (ídem: solo viaja a la IA, no se guarda en nuestros servidores).",
          "Preferencia de idioma (guardada en el localStorage de tu navegador).",
          "Cuentos generados (guardados únicamente en tu dispositivo vía localStorage).",
          "Analítica anónima de uso (páginas vistas, errores — sin identificadores personales).",
        ],
      },
      {
        icon: "AlertCircle",
        color: "red",
        title: "Qué nunca recogemos",
        points: [
          "Correos electrónicos (salvo que te suscribas voluntariamente al Kiddsy Club).",
          "Apellidos, direcciones, teléfonos ni ninguna información identificativa adicional.",
          "Fotos, grabaciones de voz ni biometría.",
          "Datos de menores de 13 años de forma consciente.",
          "Identificadores de dispositivo ni IDs publicitarios.",
        ],
      },
      {
        icon: "Globe",
        color: "magenta",
        title: "Cómo usamos la IA (Groq)",
        points: [
          "Al generar un cuento, el nombre del niño y el tema se envían a la API de Groq.",
          "Groq procesa esta información para crear el texto del cuento en tiempo real.",
          "Kiddsy no almacena el nombre ni el tema tras mostrar el cuento.",
          "El uso de datos por parte de Groq se rige por su propia política (groq.com/privacy).",
        ],
      },
      {
        icon: "Eye",
        color: "green",
        title: "Cookies y almacenamiento local",
        points: [
          "Usamos localStorage del navegador únicamente para guardar tu idioma preferido y los cuentos.",
          "No hay cookies publicitarias ni píxeles de seguimiento.",
          "Puedes eliminar estos datos en cualquier momento desde los ajustes de tu navegador.",
        ],
      },
      {
        icon: "Baby",
        color: "cyan",
        title: "Tus derechos (RGPD / LOPD)",
        points: [
          "Derecho de acceso: hemos listado arriba todo lo que recopilamos.",
          "Derecho de supresión: no almacenamos tus datos en nuestros servidores.",
          "Derecho de oposición: puedes dejar de usar el generador de IA en cualquier momento.",
          "Newsletter Kiddsy Club: puedes darte de baja con un solo clic.",
          "Para cualquier consulta: legal@kiddsy.org",
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // FRANÇAIS
  // ════════════════════════════════════════════════════════════════════════
  fr: {
    dir: "ltr",
    back: "Retour",
    contact_q: "Des questions sur la confidentialité ?",
    last_updated: "Mis à jour : Mars 2026",

    legal_title: "Mentions Légales",
    legal_subtitle: "Kiddsy — Application Éducative Bilingue Mondiale",
    legal_banner: "Ces mentions légales sont rédigées en langage simple pour que chaque famille puisse les comprendre.",
    legal_sections: [
      {
        title: "1. Identification de l'éditeur",
        content: "Conformément à l'article 6 de la Loi n° 2004-575 du 21 juin 2004 (LCEN) : Dénomination : Kiddsy. Siège social : Mulhouse, France. Activité : Application web éducative bilingue gratuite pour les familles. Courriel : legal@kiddsy.org. Hébergement : Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA (vercel.com).",
      },
      {
        title: "2. Objet et champ d'application",
        content: "Kiddsy est une application web gratuite conçue pour aider les familles immigrantes et multiculturelles à apprendre l'anglais ensemble grâce à des histoires bilingues générées par intelligence artificielle. L'accès et l'utilisation de l'application impliquent l'acceptation pleine et entière de ces Mentions Légales.",
      },
      {
        title: "3. Propriété intellectuelle",
        content: "Le nom « Kiddsy », le logo, la conception de l'interface, les textes originaux et le code source sont protégés par le Code de la propriété intellectuelle. Toute reproduction, distribution ou transformation sans autorisation écrite expresse est interdite, sauf pour un usage personnel et éducatif non commercial. Les histoires générées par l'IA sont fournies à titre personnel uniquement.",
      },
      {
        title: "4. Limitation de responsabilité",
        content: "Kiddsy est fourni « en l'état » et « selon disponibilité ». Kiddsy ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser l'application. Toutes les histoires doivent être relues par un adulte avant d'être partagées avec des enfants. Les liens vers des sites tiers sont fournis à titre informatif uniquement.",
      },
      {
        title: "5. Protection des mineurs (RGPD / CNIL)",
        content: "Kiddsy ne collecte pas sciemment de données personnelles d'enfants de moins de 13 ans, conformément au RGPD et aux recommandations de la CNIL. L'application est conçue pour être utilisée par les parents ou tuteurs avec leurs enfants. Si vous pensez qu'un mineur a fourni des données sans autorisation, contactez-nous immédiatement à legal@kiddsy.org.",
      },
      {
        title: "6. Droit applicable et juridiction",
        content: "Ces mentions légales sont régies par le droit français. En cas de litige, et à défaut de résolution amiable, les parties conviennent de soumettre le différend aux Tribunaux compétents de Mulhouse (France), sous réserve des dispositions protectrices applicables aux consommateurs résidant dans l'Union Européenne.",
      },
      {
        title: "7. Modifications",
        content: "Kiddsy se réserve le droit de modifier ces mentions légales à tout moment. La date de dernière mise à jour figure en tête du document. La poursuite de l'utilisation de l'application vaut acceptation des modifications.",
      },
      {
        title: "8. Contact",
        content: "Pour toute question juridique : legal@kiddsy.org",
        accent: "green",
      },
    ],

    privacy_title: "Politique de Confidentialité",
    privacy_subtitle: "Kiddsy — Conçu pour les familles, pas pour les annonceurs.",
    privacy_banner: "La confidentialité sans petits caractères. Mise à jour : mars 2026. Si vous avez moins de 16 ans, lisez ceci avec un parent ou tuteur.",
    privacy_cards: [
      {
        icon: "Lock",
        color: "blue",
        title: "Ce que nous collectons",
        points: [
          "Le prénom de l'enfant (uniquement si vous le saisissez pour générer une histoire — envoyé à Groq/IA, non stocké par nous).",
          "Le thème de l'histoire choisi (idem : uniquement transmis à l'IA, non sauvegardé sur nos serveurs).",
          "La préférence de langue (sauvegardée dans le localStorage de votre navigateur).",
          "Les histoires générées (sauvegardées uniquement sur votre appareil via localStorage).",
          "Analyses d'utilisation anonymes (pages vues, erreurs — sans identifiants personnels).",
        ],
      },
      {
        icon: "AlertCircle",
        color: "red",
        title: "Ce que nous ne collectons jamais",
        points: [
          "Adresses e-mail (sauf abonnement volontaire au Kiddsy Club).",
          "Noms de famille, adresses, numéros de téléphone ou toute autre information identificatrice.",
          "Photos, enregistrements vocaux ni données biométriques.",
          "Données personnelles d'enfants de moins de 13 ans en connaissance de cause.",
          "Identifiants d'appareils ou identifiants publicitaires.",
        ],
      },
      {
        icon: "Globe",
        color: "magenta",
        title: "Comment nous utilisons l'IA (Groq)",
        points: [
          "Lors de la génération d'une histoire, le prénom et le thème sont envoyés à l'API Groq.",
          "Groq traite ces informations pour créer le texte en temps réel (streaming).",
          "Kiddsy ne stocke ni le prénom ni le thème après l'affichage de l'histoire.",
          "L'utilisation des données par Groq est régie par sa propre politique (groq.com/privacy).",
        ],
      },
      {
        icon: "Eye",
        color: "green",
        title: "Cookies et stockage local",
        points: [
          "Nous utilisons localStorage uniquement pour sauvegarder votre langue préférée et les histoires.",
          "Aucun cookie publicitaire ni pixel de suivi.",
          "Vous pouvez supprimer ces données à tout moment depuis les paramètres de votre navigateur.",
        ],
      },
      {
        icon: "Baby",
        color: "cyan",
        title: "Vos droits (RGPD)",
        points: [
          "Droit d'accès : nous avons listé ci-dessus tout ce que nous collectons.",
          "Droit à l'effacement : nous ne stockons pas vos données sur nos serveurs.",
          "Droit d'opposition : vous pouvez cesser d'utiliser le générateur d'IA à tout moment.",
          "Newsletter Kiddsy Club : désinscription en un clic depuis chaque e-mail.",
          "Pour toute question : legal@kiddsy.org",
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // DEUTSCH
  // ════════════════════════════════════════════════════════════════════════
  de: {
    dir: "ltr",
    back: "Zurück",
    contact_q: "Fragen zum Datenschutz?",
    last_updated: "Stand: März 2026",

    legal_title: "Impressum",
    legal_subtitle: "Kiddsy — Globale Zweisprachige Lern-App",
    legal_banner: "Dieses Impressum ist in einfacher Sprache verfasst, damit jede Familie es verstehen kann.",
    legal_sections: [
      { title: "1. Angaben zum Herausgeber", content: "Name: Kiddsy. Sitz: Mulhouse, Frankreich. Tätigkeit: Kostenlose zweisprachige Bildungs-Web-App für Familien. E-Mail: legal@kiddsy.org. Hosting: Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA." },
      { title: "2. Zweck und Anwendungsbereich", content: "Kiddsy ist eine kostenlose Web-App, die Einwanderer- und multikulturelle Familien dabei unterstützt, gemeinsam Englisch durch KI-generierte zweisprachige Geschichten zu lernen. Die Nutzung der App impliziert die vollständige Akzeptanz dieses Impressums." },
      { title: "3. Geistiges Eigentum", content: "Name, Logo, Design, Texte und Quellcode von Kiddsy sind urheberrechtlich geschützt. Jede Vervielfältigung oder Verbreitung ohne ausdrückliche schriftliche Genehmigung ist untersagt, außer für den persönlichen und nicht kommerziellen Bildungsgebrauch." },
      { title: "4. Haftungsbeschränkung", content: "Kiddsy wird 'wie besehen' und 'nach Verfügbarkeit' bereitgestellt. Kiddsy haftet nicht für direkte oder indirekte Schäden. Alle Geschichten müssen von einem Erwachsenen geprüft werden, bevor sie mit Minderjährigen geteilt werden." },
      { title: "5. Schutz von Minderjährigen (DSGVO)", content: "Kiddsy erhebt wissentlich keine personenbezogenen Daten von Kindern unter 13 Jahren gemäß DSGVO. Bei Verdacht wenden Sie sich sofort an legal@kiddsy.org." },
      { title: "6. Geltendes Recht und Zuständigkeit", content: "Dieses Impressum unterliegt französischem Recht. Streitigkeiten werden vor den zuständigen Gerichten in Mulhouse (Frankreich) ausgetragen." },
      { title: "7. Änderungen", content: "Kiddsy behält sich das Recht vor, dieses Impressum jederzeit zu ändern. Das Datum der letzten Aktualisierung steht am Anfang des Dokuments." },
      { title: "8. Kontakt", content: "Für alle rechtlichen Anfragen: legal@kiddsy.org", accent: "green" },
    ],

    privacy_title: "Datenschutzerklärung",
    privacy_subtitle: "Kiddsy — Für Familien gebaut, nicht für Werbetreibende.",
    privacy_banner: "Datenschutz ohne Kleingedrucktes. Stand: März 2026. Wenn du unter 16 Jahre alt bist, lies dies bitte mit einem Elternteil.",
    privacy_cards: [
      { icon: "Lock", color: "blue", title: "Was wir erheben",
        points: ["Vorname des Kindes (nur wenn du ihn für eine Geschichte eingibst — an Groq/KI gesendet, nicht von uns gespeichert).", "Gewähltes Geschichtsthema (idem — reist nur zur KI).", "Sprachpräferenz (im localStorage des Browsers gespeichert).", "Generierte Geschichten (nur auf deinem Gerät via localStorage).", "Anonyme Nutzungsanalysen (keine persönlichen Kennungen)."] },
      { icon: "AlertCircle", color: "red", title: "Was wir niemals erheben",
        points: ["E-Mail-Adressen (außer freiwillige Kiddsy Club-Anmeldung).", "Nachnamen, Adressen, Telefonnummern.", "Fotos, Sprachaufnahmen oder biometrische Daten.", "Wissentlich Daten von Kindern unter 13 Jahren.", "Gerätekennungen oder Werbe-IDs."] },
      { icon: "Globe", color: "magenta", title: "Wie wir KI nutzen (Groq)",
        points: ["Bei der Generierung einer Geschichte werden Name und Thema an die Groq-API gesendet.", "Kiddsy speichert Name und Thema nach der Anzeige nicht.", "Die Datennutzung durch Groq unterliegt deren eigener Datenschutzerklärung (groq.com/privacy)."] },
      { icon: "Eye", color: "green", title: "Cookies und lokaler Speicher",
        points: ["Wir verwenden localStorage nur für Sprachpräferenz und generierte Geschichten.", "Keine Werbe-Cookies, keine Tracking-Pixel.", "Du kannst diese Daten jederzeit in deinen Browser-Einstellungen löschen."] },
      { icon: "Baby", color: "cyan", title: "Deine Rechte (DSGVO)",
        points: ["Auskunftsrecht: Wir haben oben alles aufgelistet, was wir erheben.", "Recht auf Löschung: Wir speichern deine Daten nicht auf unseren Servern.", "Widerspruchsrecht: Du kannst den KI-Generator jederzeit nicht mehr nutzen.", "Kiddsy Club Newsletter: Abmeldung mit einem Klick.", "Für alle Fragen: legal@kiddsy.org"] },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // PORTUGUÊS
  // ════════════════════════════════════════════════════════════════════════
  pt: {
    dir: "ltr",
    back: "Voltar",
    contact_q: "Perguntas sobre privacidade?",
    last_updated: "Atualizado: Março 2026",

    legal_title: "Aviso Legal",
    legal_subtitle: "Kiddsy — App Educativa Bilingue Global",
    legal_banner: "Este aviso legal está redigido em linguagem simples para que todas as famílias o possam compreender.",
    legal_sections: [
      { title: "1. Identificação do titular", content: "Nome: Kiddsy. Sede: Mulhouse, França. Atividade: Aplicação web educativa bilingue gratuita para famílias. E-mail: legal@kiddsy.org. Alojamento: Vercel Inc., 340 Pine Street, Suite 701, São Francisco, CA 94104, EUA." },
      { title: "2. Objeto e âmbito de aplicação", content: "Kiddsy é uma aplicação web gratuita concebida para ajudar famílias imigrantes e multiculturais a aprender inglês juntas através de histórias bilingues geradas por inteligência artificial. O acesso e uso da aplicação implica a plena aceitação deste Aviso Legal." },
      { title: "3. Propriedade intelectual", content: "O nome 'Kiddsy', o logótipo, o design da interface, os textos originais e o código fonte estão protegidos pela legislação de propriedade intelectual. É proibida a sua reprodução sem autorização expressa por escrito, exceto para uso pessoal e educativo não comercial." },
      { title: "4. Limitação de responsabilidade", content: "Kiddsy é fornecido 'tal como está'. A Kiddsy não é responsável por danos diretos ou indiretos. Todas as histórias devem ser revistas por um adulto antes de serem partilhadas com menores." },
      { title: "5. Proteção de menores (RGPD)", content: "A Kiddsy não recolhe conscientemente dados pessoais de crianças com menos de 13 anos. Se suspeitar que um menor forneceu dados sem autorização, contacte-nos imediatamente em legal@kiddsy.org." },
      { title: "6. Lei aplicável e jurisdição", content: "Este Aviso Legal rege-se pela lei francesa. Em caso de litígio, as partes concordam em submeter a questão aos tribunais competentes de Mulhouse (França)." },
      { title: "7. Modificações", content: "A Kiddsy reserva-se o direito de modificar este aviso legal a qualquer momento. A continuação do uso implica a aceitação das alterações." },
      { title: "8. Contacto", content: "Para qualquer consulta jurídica: legal@kiddsy.org", accent: "green" },
    ],

    privacy_title: "Política de Privacidade",
    privacy_subtitle: "Kiddsy — Construído para famílias, não para anunciantes.",
    privacy_banner: "Privacidade sem letra pequena. Atualizado: março 2026.",
    privacy_cards: [
      { icon: "Lock", color: "blue", title: "O que recolhemos",
        points: ["Nome próprio da criança (apenas se o introduzir para gerar uma história — enviado para Groq/IA, não armazenado por nós).", "Tema da história escolhido (idem).", "Preferência de idioma (localStorage do browser).", "Histórias geradas (apenas no seu dispositivo via localStorage).", "Análises de uso anónimas."] },
      { icon: "AlertCircle", color: "red", title: "O que nunca recolhemos",
        points: ["Endereços de e-mail (exceto subscrição voluntária ao Kiddsy Club).", "Apelidos, moradas, números de telefone.", "Fotos, gravações de voz ou dados biométricos.", "Dados de crianças com menos de 13 anos conscientemente.", "Identificadores de dispositivos ou IDs publicitários."] },
      { icon: "Globe", color: "magenta", title: "Como usamos a IA (Groq)",
        points: ["Ao gerar uma história, o nome e o tema são enviados para a API Groq.", "A Kiddsy não armazena o nome nem o tema após mostrar a história.", "O uso de dados pela Groq rege-se pela sua própria política (groq.com/privacy)."] },
      { icon: "Eye", color: "green", title: "Cookies e armazenamento local",
        points: ["Usamos localStorage apenas para guardar a língua preferida e as histórias.", "Sem cookies publicitários nem píxeis de rastreamento.", "Pode eliminar estes dados a qualquer momento nas definições do browser."] },
      { icon: "Baby", color: "cyan", title: "Os seus direitos (RGPD)",
        points: ["Direito de acesso: listámos tudo o que recolhemos acima.", "Direito de apagamento: não armazenamos os seus dados nos nossos servidores.", "Direito de oposição: pode parar de usar o gerador de IA a qualquer momento.", "Newsletter Kiddsy Club: cancelar a subscrição com um clique.", "Para qualquer questão: legal@kiddsy.org"] },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // ITALIANO
  // ════════════════════════════════════════════════════════════════════════
  it: {
    dir: "ltr",
    back: "Indietro",
    contact_q: "Domande sulla privacy?",
    last_updated: "Aggiornato: Marzo 2026",
    legal_title: "Note Legali",
    legal_subtitle: "Kiddsy — App Educativa Bilingue Globale",
    legal_banner: "Queste note legali sono scritte in linguaggio semplice affinché ogni famiglia possa comprenderle.",
    legal_sections: [
      { title: "1. Identificazione dell'editore", content: "Nome: Kiddsy. Sede legale: Mulhouse, Francia. Attività: Applicazione web educativa bilingue gratuita per le famiglie. E-mail: legal@kiddsy.org. Hosting: Vercel Inc., San Francisco, CA, USA." },
      { title: "2. Scopo e ambito di applicazione", content: "Kiddsy è un'app web gratuita progettata per aiutare le famiglie immigrate e multiculturali ad imparare l'inglese insieme attraverso storie bilingui generate dall'intelligenza artificiale." },
      { title: "3. Proprietà intellettuale", content: "Il nome 'Kiddsy', il logo, il design dell'interfaccia e il codice sorgente sono protetti dalla normativa sulla proprietà intellettuale. È vietata la riproduzione senza autorizzazione scritta espressa, salvo uso personale ed educativo non commerciale." },
      { title: "4. Limitazione di responsabilità", content: "Kiddsy è fornito 'così com'è'. Kiddsy non è responsabile per danni diretti o indiretti. Tutte le storie devono essere riviste da un adulto prima di essere condivise con i minori." },
      { title: "5. Protezione dei minori (GDPR)", content: "Kiddsy non raccoglie consapevolmente dati personali di bambini sotto i 13 anni. Contattare legal@kiddsy.org per qualsiasi preoccupazione." },
      { title: "6. Legge applicabile e giurisdizione", content: "Le presenti note legali sono disciplinate dal diritto francese. Le controversie saranno deferite ai tribunali competenti di Mulhouse (Francia)." },
      { title: "7. Modifiche", content: "Kiddsy si riserva il diritto di modificare le presenti note in qualsiasi momento." },
      { title: "8. Contatto", content: "Per qualsiasi domanda legale: legal@kiddsy.org", accent: "green" },
    ],
    privacy_title: "Informativa sulla Privacy",
    privacy_subtitle: "Kiddsy — Creato per le famiglie, non per gli inserzionisti.",
    privacy_banner: "Privacy senza stampa fine. Aggiornato: marzo 2026.",
    privacy_cards: [
      { icon: "Lock", color: "blue", title: "Cosa raccogliamo",
        points: ["Nome del bambino (solo per generare storie — inviato a Groq/IA, non memorizzato da noi).", "Argomento della storia scelto (idem).", "Preferenza lingua (localStorage del browser).", "Storie generate (solo sul tuo dispositivo via localStorage).", "Analisi d'uso anonime."] },
      { icon: "AlertCircle", color: "red", title: "Cosa non raccogliamo mai",
        points: ["Indirizzi e-mail (salvo iscrizione volontaria al Kiddsy Club).", "Cognomi, indirizzi, numeri di telefono.", "Foto, registrazioni vocali o dati biometrici.", "Dati di bambini sotto i 13 anni consapevolmente.", "Identificatori di dispositivi o ID pubblicitari."] },
      { icon: "Globe", color: "magenta", title: "Come usiamo l'IA (Groq)",
        points: ["Generando una storia, il nome e l'argomento vengono inviati all'API Groq.", "Kiddsy non memorizza nome e argomento dopo aver mostrato la storia.", "L'uso dei dati da parte di Groq è regolato dalla loro privacy policy."] },
      { icon: "Eye", color: "green", title: "Cookie e archiviazione locale",
        points: ["Usiamo localStorage solo per lingua preferita e storie.", "Nessun cookie pubblicitario né pixel di tracciamento.", "Puoi eliminare questi dati dalle impostazioni del browser."] },
      { icon: "Baby", color: "cyan", title: "I tuoi diritti (GDPR)",
        points: ["Diritto di accesso: abbiamo elencato tutto ciò che raccogliamo.", "Diritto alla cancellazione: non memorizziamo i tuoi dati sui nostri server.", "Diritto di opposizione: puoi smettere di usare il generatore IA.", "Newsletter Kiddsy Club: cancellazione con un clic.", "Per domande: legal@kiddsy.org"] },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // 中文 (简体)
  // ════════════════════════════════════════════════════════════════════════
  zh: {
    dir: "ltr",
    back: "返回",
    contact_q: "有关隐私的问题？",
    last_updated: "更新日期：2026年3月",
    legal_title: "法律声明",
    legal_subtitle: "Kiddsy — 全球双语教育应用",
    legal_banner: "本法律声明以简明语言撰写，让每个家庭都能理解。",
    legal_sections: [
      { title: "1. 发布者信息", content: "名称：Kiddsy。注册地：法国米卢斯。业务：面向家庭的免费双语教育网络应用。电子邮件：legal@kiddsy.org。托管：Vercel Inc.，美国旧金山。" },
      { title: "2. 目的与适用范围", content: "Kiddsy是一款免费网络应用，旨在帮助移民和多文化家庭通过AI生成的双语故事共同学习英语。使用本应用即表示完全接受本法律声明。" },
      { title: "3. 知识产权", content: "Kiddsy名称、标志、界面设计、原创文本和源代码受知识产权法保护。未经明确书面授权，禁止复制或传播，个人和非商业教育用途除外。" },
      { title: "4. 责任限制", content: "Kiddsy按“现状”提供。Kiddsy不对直接或间接损失负责。所有故事在与未成年人分享前必须由成人审阅。" },      { title: "5. 未成年人保护", content: "Kiddsy不会故意收集13岁以下儿童的个人数据。如有疑虑，请立即联系legal@kiddsy.org。" },
      { title: "6. 适用法律与司法管辖", content: "本法律声明受法国法律约束。争议提交法国米卢斯主管法院解决。" },
      { title: "7. 修改", content: "Kiddsy保留随时修改本声明的权利。继续使用应用即表示接受修改。" },
      { title: "8. 联系方式", content: "如有法律问题：legal@kiddsy.org", accent: "green" },
    ],
    privacy_title: "隐私政策",
    privacy_subtitle: "Kiddsy — 为家庭而建，而非广告商。",
    privacy_banner: "隐私政策，无小字条款。更新：2026年3月。",
    privacy_cards: [
      { icon: "Lock", color: "blue", title: "我们收集的数据",
        points: ["孩子的名字（仅在您输入以生成故事时 — 发送给Groq/AI，我们不存储）。", "所选故事主题（同上）。", "语言偏好（保存在浏览器localStorage中）。", "生成的故事（仅通过localStorage保存在您的设备上）。", "匿名使用分析（无个人标识符）。"] },
      { icon: "AlertCircle", color: "red", title: "我们从不收集的数据",
        points: ["电子邮件地址（除非自愿订阅Kiddsy Club）。", "姓氏、地址、电话号码或其他识别信息。", "照片、录音或生物特征数据。", "已知13岁以下儿童的数据。", "设备标识符或广告ID。"] },
      { icon: "Globe", color: "magenta", title: "我们如何使用AI（Groq）",
        points: ["生成故事时，孩子的姓名和主题发送至Groq API。", "Kiddsy在显示故事后不存储姓名或主题。", "Groq的数据使用受其自身隐私政策约束。"] },
      { icon: "Eye", color: "green", title: "Cookie和本地存储",
        points: ["我们仅使用localStorage保存语言偏好和故事。", "无广告Cookie，无跟踪像素。", "您可随时在浏览器设置中删除这些数据。"] },
      { icon: "Baby", color: "cyan", title: "您的权利（GDPR）",
        points: ["访问权：我们已在上面列出所有收集内容。", "删除权：我们不在服务器上存储您的数据。", "异议权：您可随时停止使用AI生成器。", "Kiddsy Club通讯：一键取消订阅。", "如有疑问：legal@kiddsy.org"] },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // 日本語
  // ════════════════════════════════════════════════════════════════════════
  ja: {
    dir: "ltr",
    back: "戻る",
    contact_q: "プライバシーについてご質問がありますか？",
    last_updated: "最終更新：2026年3月",
    legal_title: "法的通知",
    legal_subtitle: "Kiddsy — グローバルバイリンガル教育アプリ",
    legal_banner: "この法的通知は、すべてのご家族に理解していただけるよう平易な言語で書かれています。",
    legal_sections: [
      { title: "1. 発行者情報", content: "名称：Kiddsy。本社所在地：フランス、ミュルーズ。事業内容：家族向け無料バイリンガル教育ウェブアプリ。メール：legal@kiddsy.org。ホスティング：Vercel Inc.、米国サンフランシスコ。" },
      { title: "2. 目的と適用範囲", content: "KiddsyはAI生成のバイリンガルストーリーを通じて移民・多文化家族が一緒に英語を学ぶための無料ウェブアプリです。アプリの利用は本法的通知の完全な受諾を意味します。" },
      { title: "3. 知的財産", content: "Kiddsy の名称、ロゴ、インターフェースデザイン、テキスト、ソースコードは知的財産法により保護されています。個人的・非商業的教育目的を除き、書面による明示的な許可なしの複製・配布は禁止されています。" },
      { title: "4. 責任の制限", content: "Kiddsy は「現状のまま」提供されます。アプリの利用または利用不能から生じる損害についてKiddsyは責任を負いません。未成年者と共有する前に、すべてのストーリーを大人が確認してください。" },
      { title: "5. 未成年者の保護（GDPR）", content: "Kiddsyは13歳未満の子供から意図的に個人データを収集しません。懸念がある場合はlegal@kiddsy.orgまでご連絡ください。" },
      { title: "6. 準拠法と裁判管轄", content: "本法的通知はフランス法に準拠します。紛争はフランス、ミュルーズの管轄裁判所に委ねられます。" },
      { title: "7. 変更", content: "Kiddsyはいつでも本通知を変更する権利を留保します。継続利用は変更の承諾を意味します。" },
      { title: "8. お問い合わせ", content: "法的なお問い合わせ：legal@kiddsy.org", accent: "green" },
    ],
    privacy_title: "プライバシーポリシー",
    privacy_subtitle: "Kiddsy — 家族のために構築、広告主のためではありません。",
    privacy_banner: "細かい文字のないプライバシー。更新：2026年3月。",
    privacy_cards: [
      { icon: "Lock", color: "blue", title: "収集するデータ",
        points: ["子供の名前（ストーリー生成入力時のみ — Groq/AIに送信、当社は保存しません）。", "選択したストーリーテーマ（同上）。", "言語設定（ブラウザのlocalStorageに保存）。", "生成されたストーリー（localStorageでデバイスのみに保存）。", "匿名使用分析（個人識別子なし）。"] },
      { icon: "AlertCircle", color: "red", title: "収集しないデータ",
        points: ["メールアドレス（Kiddsy Club自発的登録を除く）。", "苗字、住所、電話番号等の識別情報。", "写真、音声録音または生体認証データ。", "意図的に13歳未満のデータ。", "デバイス識別子または広告ID。"] },
      { icon: "Globe", color: "magenta", title: "AIの使用方法（Groq）",
        points: ["ストーリー生成時、名前とテーマはGroq APIに送信されます。", "Kiddsyはストーリー表示後に名前やテーマを保存しません。", "Groqのデータ使用は同社のプライバシーポリシーに準拠します。"] },
      { icon: "Eye", color: "green", title: "クッキーとローカルストレージ",
        points: ["localStorageは言語設定と生成ストーリーの保存のみに使用します。", "広告クッキー・トラッキングピクセルは使用しません。", "ブラウザ設定からいつでもデータを削除できます。"] },
      { icon: "Baby", color: "cyan", title: "お客様の権利（GDPR）",
        points: ["アクセス権：収集内容を上記に記載しています。", "削除権：当社のサーバーにデータを保存していません。", "異議申立権：AI生成機能はいつでも使用停止できます。", "Kiddsy Clubメール：ワンクリックで退会可能。", "お問い合わせ：legal@kiddsy.org"] },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // 한국어
  // ════════════════════════════════════════════════════════════════════════
  ko: {
    dir: "ltr",
    back: "뒤로",
    contact_q: "개인정보에 관한 질문이 있으신가요?",
    last_updated: "최종 업데이트: 2026년 3월",
    legal_title: "법적 고지",
    legal_subtitle: "Kiddsy — 글로벌 이중 언어 교육 앱",
    legal_banner: "이 법적 고지는 모든 가족이 이해할 수 있도록 쉬운 언어로 작성되었습니다.",
    legal_sections: [
      { title: "1. 발행자 정보", content: "명칭: Kiddsy. 등록 주소: 프랑스 뮐루즈. 사업: 가족을 위한 무료 이중 언어 교육 웹 앱. 이메일: legal@kiddsy.org. 호스팅: Vercel Inc., 미국 샌프란시스코." },
      { title: "2. 목적 및 적용 범위", content: "Kiddsy는 AI 생성 이중 언어 이야기를 통해 이민자 및 다문화 가족이 함께 영어를 배울 수 있도록 설계된 무료 웹 앱입니다." },
      { title: "3. 지식재산권", content: "Kiddsy의 이름, 로고, 인터페이스 디자인, 텍스트 및 소스 코드는 지식재산권법으로 보호됩니다." },
      { title: "4. 책임 제한", content: "Kiddsy는 '있는 그대로' 제공됩니다. 미성년자와 공유하기 전에 모든 이야기를 어른이 검토해야 합니다." },
      { title: "5. 미성년자 보호", content: "Kiddsy는 13세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다. 우려 사항이 있으면 legal@kiddsy.org로 연락하세요." },
      { title: "6. 준거법 및 관할", content: "이 법적 고지는 프랑스 법률에 따릅니다. 분쟁은 프랑스 뮐루즈 관할 법원에 제출됩니다." },
      { title: "7. 변경", content: "Kiddsy는 언제든지 이 고지를 변경할 권리를 보유합니다." },
      { title: "8. 연락처", content: "법적 문의: legal@kiddsy.org", accent: "green" },
    ],
    privacy_title: "개인정보 처리방침",
    privacy_subtitle: "Kiddsy — 광고주가 아닌 가족을 위해 만들어졌습니다.",
    privacy_banner: "작은 글자 없는 개인정보 보호. 업데이트: 2026년 3월.",
    privacy_cards: [
      { icon: "Lock", color: "blue", title: "수집하는 데이터",
        points: ["아이의 이름(이야기 생성 시 입력한 경우만 — Groq/AI로 전송, 당사는 저장 안 함).", "선택한 이야기 주제(동일).", "언어 설정(브라우저 localStorage에 저장).", "생성된 이야기(기기의 localStorage에만 저장).", "익명 사용 분석(개인 식별자 없음)."] },
      { icon: "AlertCircle", color: "red", title: "수집하지 않는 데이터",
        points: ["이메일 주소(Kiddsy Club 자발적 가입 제외).", "성, 주소, 전화번호 등.", "사진, 음성 녹음 또는 생체 데이터.", "의도적으로 13세 미만 아동 데이터.", "기기 식별자 또는 광고 ID."] },
      { icon: "Globe", color: "magenta", title: "AI 사용 방법(Groq)",
        points: ["이야기 생성 시 이름과 주제가 Groq API로 전송됩니다.", "Kiddsy는 이야기 표시 후 이름이나 주제를 저장하지 않습니다.", "Groq의 데이터 사용은 자체 개인정보 처리방침을 따릅니다."] },
      { icon: "Eye", color: "green", title: "쿠키 및 로컬 저장소",
        points: ["localStorage는 언어 설정과 생성된 이야기 저장에만 사용합니다.", "광고 쿠키나 추적 픽셀이 없습니다.", "브라우저 설정에서 언제든지 데이터를 삭제할 수 있습니다."] },
      { icon: "Baby", color: "cyan", title: "귀하의 권리(GDPR)",
        points: ["접근권: 수집하는 모든 것을 위에 나열했습니다.", "삭제권: 당사 서버에 데이터를 저장하지 않습니다.", "이의 제기권: AI 생성기 사용을 언제든지 중단할 수 있습니다.", "Kiddsy Club 뉴스레터: 클릭 한 번으로 구독 취소.", "문의: legal@kiddsy.org"] },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // РУССКИЙ
  // ════════════════════════════════════════════════════════════════════════
  ru: {
    dir: "ltr",
    back: "Назад",
    contact_q: "Вопросы о конфиденциальности?",
    last_updated: "Обновлено: март 2026",
    legal_title: "Юридическая информация",
    legal_subtitle: "Kiddsy — Глобальное двуязычное образовательное приложение",
    legal_banner: "Этот юридический текст написан простым языком, чтобы каждая семья могла его понять.",
    legal_sections: [
      { title: "1. Информация об издателе", content: "Наименование: Kiddsy. Адрес: Мюлуз, Франция. Деятельность: Бесплатное двуязычное образовательное веб-приложение для семей. Эл. почта: legal@kiddsy.org. Хостинг: Vercel Inc., Сан-Франциско, США." },
      { title: "2. Цели и сфера применения", content: "Kiddsy — бесплатное веб-приложение, созданное для того, чтобы помочь иммигрантским и мультикультурным семьям вместе изучать английский язык через двуязычные истории, созданные искусственным интеллектом." },
      { title: "3. Интеллектуальная собственность", content: "Название 'Kiddsy', логотип, дизайн интерфейса, тексты и исходный код защищены законодательством об интеллектуальной собственности. Воспроизведение без явного письменного разрешения запрещено." },
      { title: "4. Ограничение ответственности", content: "Kiddsy предоставляется 'как есть'. Kiddsy не несёт ответственности за прямые или косвенные убытки. Все истории должны быть проверены взрослым перед тем, как их покажут детям." },
      { title: "5. Защита несовершеннолетних", content: "Kiddsy намеренно не собирает персональные данные детей до 13 лет. При подозрении свяжитесь с нами по адресу legal@kiddsy.org." },
      { title: "6. Применимое право и юрисдикция", content: "Настоящий документ регулируется французским правом. Споры рассматриваются в компетентных судах Мюлуза (Франция)." },
      { title: "7. Изменения", content: "Kiddsy оставляет за собой право изменять этот документ в любое время. Продолжение использования приложения означает принятие изменений." },
      { title: "8. Контакт", content: "По всем юридическим вопросам: legal@kiddsy.org", accent: "green" },
    ],
    privacy_title: "Политика конфиденциальности",
    privacy_subtitle: "Kiddsy — Создано для семей, а не для рекламодателей.",
    privacy_banner: "Конфиденциальность без мелкого шрифта. Обновлено: март 2026.",
    privacy_cards: [
      { icon: "Lock", color: "blue", title: "Какие данные мы собираем",
        points: ["Имя ребёнка (только если вы вводите его для создания истории — отправляется в Groq/ИИ, мы не храним).", "Тема выбранной истории (аналогично).", "Языковые предпочтения (сохраняются в localStorage браузера).", "Созданные истории (хранятся только на вашем устройстве).", "Анонимная аналитика использования (без личных идентификаторов)."] },
      { icon: "AlertCircle", color: "red", title: "Что мы никогда не собираем",
        points: ["Адреса электронной почты (кроме добровольной подписки на Kiddsy Club).", "Фамилии, адреса, номера телефонов.", "Фото, голосовые записи или биометрические данные.", "Данные детей до 13 лет намеренно.", "Идентификаторы устройств или рекламные ID."] },
      { icon: "Globe", color: "magenta", title: "Как мы используем ИИ (Groq)",
        points: ["При создании истории имя и тема отправляются в API Groq.", "Kiddsy не сохраняет имя и тему после показа истории.", "Использование данных Groq регулируется их собственной политикой конфиденциальности."] },
      { icon: "Eye", color: "green", title: "Файлы cookie и локальное хранилище",
        points: ["localStorage используется только для языковых настроек и историй.", "Нет рекламных cookie и пикселей отслеживания.", "Эти данные можно удалить в настройках браузера в любое время."] },
      { icon: "Baby", color: "cyan", title: "Ваши права (GDPR)",
        points: ["Право на доступ: мы перечислили всё, что собираем.", "Право на удаление: мы не храним ваши данные на серверах.", "Право на возражение: использование ИИ-генератора можно прекратить в любое время.", "Рассылка Kiddsy Club: отписка в один клик.", "По вопросам: legal@kiddsy.org"] },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // हिंदी
  // ════════════════════════════════════════════════════════════════════════
  hi: {
    dir: "ltr",
    back: "वापस",
    contact_q: "गोपनीयता के बारे में प्रश्न हैं?",
    last_updated: "अंतिम अपडेट: मार्च 2026",
    legal_title: "कानूनी सूचना",
    legal_subtitle: "Kiddsy — वैश्विक द्विभाषी शैक्षिक ऐप",
    legal_banner: "यह कानूनी सूचना सरल भाषा में लिखी गई है ताकि हर परिवार इसे समझ सके।",
    legal_sections: [
      { title: "1. प्रकाशक की पहचान", content: "नाम: Kiddsy। पंजीकृत कार्यालय: मुलहाउस, फ्रांस। गतिविधि: परिवारों के लिए निःशुल्क द्विभाषी शैक्षिक वेब ऐप। ईमेल: legal@kiddsy.org। होस्टिंग: Vercel Inc., सैन फ्रांसिस्को, USA।" },
      { title: "2. उद्देश्य और दायरा", content: "Kiddsy एक निःशुल्क वेब ऐप है जो प्रवासी और बहुसांस्कृतिक परिवारों को AI-जनित द्विभाषी कहानियों के माध्यम से एक साथ अंग्रेजी सीखने में मदद करता है।" },
      { title: "3. बौद्धिक संपदा", content: "Kiddsy का नाम, लोगो, इंटरफेस डिजाइन, मूल पाठ और स्रोत कोड बौद्धिक संपदा कानून द्वारा संरक्षित हैं। व्यक्तिगत और गैर-व्यावसायिक शैक्षिक उपयोग को छोड़कर, बिना स्पष्ट लिखित अनुमति के पुनरुत्पादन निषिद्ध है।" },
      { title: "4. दायित्व की सीमा", content: "Kiddsy 'जैसा है' प्रदान किया जाता है। नाबालिगों के साथ साझा करने से पहले सभी कहानियों की एक वयस्क द्वारा समीक्षा की जानी चाहिए।" },
      { title: "5. नाबालिगों की सुरक्षा", content: "Kiddsy जानबूझकर 13 वर्ष से कम उम्र के बच्चों का व्यक्तिगत डेटा एकत्र नहीं करता। किसी भी चिंता के लिए legal@kiddsy.org पर संपर्क करें।" },
      { title: "6. लागू कानून और न्यायाधिकार", content: "यह दस्तावेज़ फ्रांसीसी कानून द्वारा शासित है। विवाद मुलहाउस, फ्रांस की सक्षम अदालतों में प्रस्तुत किए जाएंगे।" },
      { title: "7. संशोधन", content: "Kiddsy किसी भी समय इस सूचना को संशोधित करने का अधिकार सुरक्षित रखता है।" },
      { title: "8. संपर्क", content: "किसी भी कानूनी प्रश्न के लिए: legal@kiddsy.org", accent: "green" },
    ],
    privacy_title: "गोपनीयता नीति",
    privacy_subtitle: "Kiddsy — परिवारों के लिए बना, विज्ञापनदाताओं के लिए नहीं।",
    privacy_banner: "बिना बारीक प्रिंट के गोपनीयता। अपडेट: मार्च 2026।",
    privacy_cards: [
      { icon: "Lock", color: "blue", title: "हम क्या डेटा एकत्र करते हैं",
        points: ["बच्चे का नाम (केवल कहानी बनाने के लिए दर्ज किए जाने पर — Groq/AI को भेजा जाता है, हम संग्रहीत नहीं करते)।", "चुना गया कहानी विषय (समान)।", "भाषा प्राथमिकता (ब्राउज़र localStorage में सहेजी)।", "जनरेट की गई कहानियां (केवल आपके डिवाइस पर)।", "अज्ञात उपयोग विश्लेषण।"] },
      { icon: "AlertCircle", color: "red", title: "हम कभी क्या एकत्र नहीं करते",
        points: ["ईमेल पते (स्वैच्छिक Kiddsy Club सदस्यता को छोड़कर)।", "उपनाम, पते, फोन नंबर।", "फोटो, आवाज रिकॉर्डिंग या बायोमेट्रिक डेटा।", "जानबूझकर 13 वर्ष से कम बच्चों का डेटा।", "डिवाइस पहचानकर्ता या विज्ञापन ID।"] },
      { icon: "Globe", color: "magenta", title: "हम AI का उपयोग कैसे करते हैं (Groq)",
        points: ["कहानी जनरेट करते समय नाम और विषय Groq API को भेजे जाते हैं।", "Kiddsy कहानी दिखाने के बाद नाम या विषय संग्रहीत नहीं करता।", "Groq का डेटा उपयोग उनकी अपनी गोपनीयता नीति द्वारा शासित है।"] },
      { icon: "Eye", color: "green", title: "कुकीज़ और स्थानीय संग्रहण",
        points: ["हम localStorage का उपयोग केवल भाषा प्राथमिकता और कहानियों के लिए करते हैं।", "कोई विज्ञापन कुकीज़ या ट्रैकिंग पिक्सेल नहीं।", "आप ब्राउज़र सेटिंग से कभी भी यह डेटा हटा सकते हैं।"] },
      { icon: "Baby", color: "cyan", title: "आपके अधिकार (GDPR)",
        points: ["पहुंच का अधिकार: हमने ऊपर सब कुछ सूचीबद्ध किया है।", "हटाने का अधिकार: हम आपका डेटा सर्वर पर संग्रहीत नहीं करते।", "आपत्ति का अधिकार: AI जनरेटर का उपयोग कभी भी बंद कर सकते हैं।", "Kiddsy Club न्यूज़लेटर: एक क्लिक में सदस्यता रद्द करें।", "प्रश्नों के लिए: legal@kiddsy.org"] },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // TÜRKÇE
  // ════════════════════════════════════════════════════════════════════════
  tr: {
    dir: "ltr",
    back: "Geri",
    contact_q: "Gizlilik hakkında sorularınız mı var?",
    last_updated: "Güncelleme: Mart 2026",
    legal_title: "Yasal Uyarı",
    legal_subtitle: "Kiddsy — Küresel İki Dilli Eğitim Uygulaması",
    legal_banner: "Bu yasal uyarı, her ailenin anlayabilmesi için sade bir dille yazılmıştır.",
    legal_sections: [
      { title: "1. Yayıncı Bilgileri", content: "Ad: Kiddsy. Kayıtlı adres: Mulhouse, Fransa. Faaliyet: Aileler için ücretsiz iki dilli eğitim web uygulaması. E-posta: legal@kiddsy.org. Barındırma: Vercel Inc., San Francisco, ABD." },
      { title: "2. Amaç ve Kapsam", content: "Kiddsy, göçmen ve çok kültürlü ailelerin yapay zeka ile oluşturulan iki dilli hikayeler aracılığıyla birlikte İngilizce öğrenmelerine yardımcı olan ücretsiz bir web uygulamasıdır." },
      { title: "3. Fikri Mülkiyet", content: "Kiddsy adı, logosu, arayüz tasarımı, orijinal metinler ve kaynak kodu fikri mülkiyet hukuku ile korunmaktadır. Kişisel ve ticari olmayan eğitim amaçları dışında, açık yazılı izin olmaksızın çoğaltma yasaktır." },
      { title: "4. Sorumluluk Sınırlaması", content: "Kiddsy 'olduğu gibi' sunulmaktadır. Hikayeler, çocuklarla paylaşılmadan önce bir yetişkin tarafından incelenmelidir." },
      { title: "5. Küçüklerin Korunması", content: "Kiddsy, 13 yaşın altındaki çocuklardan bilerek kişisel veri toplamaz. Endişeleriniz için legal@kiddsy.org adresine ulaşın." },
      { title: "6. Geçerli Hukuk ve Yargı Yetkisi", content: "Bu yasal uyarı Fransız hukukuna tabidir. Anlaşmazlıklar Mulhouse (Fransa) mahkemelerinde çözülür." },
      { title: "7. Değişiklikler", content: "Kiddsy bu uyarıyı istediği zaman değiştirme hakkını saklı tutar. Uygulamayı kullanmaya devam etmek değişikliklerin kabul edildiği anlamına gelir." },
      { title: "8. İletişim", content: "Tüm yasal sorular için: legal@kiddsy.org", accent: "green" },
    ],
    privacy_title: "Gizlilik Politikası",
    privacy_subtitle: "Kiddsy — Reklamverenler için değil, aileler için yapıldı.",
    privacy_banner: "Küçük harf olmadan gizlilik. Güncelleme: Mart 2026.",
    privacy_cards: [
      { icon: "Lock", color: "blue", title: "Topladığımız veriler",
        points: ["Çocuğun adı (yalnızca hikaye oluşturmak için girildiğinde — Groq/AI'ya gönderilir, biz saklamayız).", "Seçilen hikaye konusu (aynı şekilde).", "Dil tercihi (tarayıcı localStorage'da saklanır).", "Oluşturulan hikayeler (yalnızca cihazınızda localStorage ile).", "Anonim kullanım analitiği."] },
      { icon: "AlertCircle", color: "red", title: "Asla toplamadığımız veriler",
        points: ["E-posta adresleri (isteğe bağlı Kiddsy Club aboneliği hariç).", "Soyadlar, adresler, telefon numaraları.", "Fotoğraflar, ses kayıtları veya biyometrik veriler.", "Bilerek 13 yaşından küçük çocukların verileri.", "Cihaz tanımlayıcıları veya reklam kimlikleri."] },
      { icon: "Globe", color: "magenta", title: "Yapay Zekayı Nasıl Kullanıyoruz (Groq)",
        points: ["Hikaye oluştururken ad ve konu Groq API'ye gönderilir.", "Kiddsy, hikayeyi gösterdikten sonra ad veya konuyu saklamaz.", "Groq'un veri kullanımı kendi gizlilik politikasına tabidir."] },
      { icon: "Eye", color: "green", title: "Çerezler ve Yerel Depolama",
        points: ["LocalStorage'ı yalnızca dil tercihi ve hikayeler için kullanıyoruz.", "Reklam çerezi veya izleme pikseli yok.", "Bu verileri tarayıcı ayarlarından istediğiniz zaman silebilirsiniz."] },
      { icon: "Baby", color: "cyan", title: "Haklarınız (GDPR)",
        points: ["Erişim hakkı: topladığımız her şeyi yukarıda listeledik.", "Silme hakkı: verilerinizi sunucularımızda saklamıyoruz.", "İtiraz hakkı: AI oluşturucuyu istediğiniz zaman kullanmayı bırakabilirsiniz.", "Kiddsy Club bülteni: tek tıkla abonelikten çıkabilirsiniz.", "Sorular için: legal@kiddsy.org"] },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // NEDERLANDS
  // ════════════════════════════════════════════════════════════════════════
  nl: {
    dir: "ltr",
    back: "Terug",
    contact_q: "Vragen over privacy?",
    last_updated: "Bijgewerkt: Maart 2026",
    legal_title: "Juridische Mededeling",
    legal_subtitle: "Kiddsy — Wereldwijde Tweetalige Educatieve App",
    legal_banner: "Deze juridische mededeling is geschreven in eenvoudige taal zodat elk gezin het kan begrijpen.",
    legal_sections: [
      { title: "1. Identificatie van de uitgever", content: "Naam: Kiddsy. Geregistreerd adres: Mulhouse, Frankrijk. Activiteit: Gratis tweetalige educatieve webapplicatie voor gezinnen. E-mail: legal@kiddsy.org. Hosting: Vercel Inc., San Francisco, VS." },
      { title: "2. Doel en toepassingsgebied", content: "Kiddsy is een gratis webapplicatie ontworpen om immigranten- en multiculturele gezinnen samen Engels te leren via AI-gegenereerde tweetalige verhalen." },
      { title: "3. Intellectueel eigendom", content: "De naam 'Kiddsy', het logo, het interfaceontwerp, originele teksten en broncode zijn beschermd door het intellectueel eigendomsrecht. Reproductie zonder uitdrukkelijke schriftelijke toestemming is verboden, behalve voor persoonlijk en niet-commercieel educatief gebruik." },
      { title: "4. Beperking van aansprakelijkheid", content: "Kiddsy wordt geleverd 'zoals het is'. Alle verhalen moeten door een volwassene worden beoordeeld voordat ze met minderjarigen worden gedeeld." },
      { title: "5. Bescherming van minderjarigen", content: "Kiddsy verzamelt niet bewust persoonsgegevens van kinderen onder de 13 jaar. Neem bij zorgen direct contact op via legal@kiddsy.org." },
      { title: "6. Toepasselijk recht en jurisdictie", content: "Deze mededeling valt onder Frans recht. Geschillen worden voorgelegd aan de bevoegde rechtbanken van Mulhouse (Frankrijk)." },
      { title: "7. Wijzigingen", content: "Kiddsy behoudt zich het recht voor om deze mededeling te allen tijde te wijzigen." },
      { title: "8. Contact", content: "Voor juridische vragen: legal@kiddsy.org", accent: "green" },
    ],
    privacy_title: "Privacybeleid",
    privacy_subtitle: "Kiddsy — Gebouwd voor gezinnen, niet voor adverteerders.",
    privacy_banner: "Privacy zonder kleine lettertjes. Bijgewerkt: maart 2026.",
    privacy_cards: [
      { icon: "Lock", color: "blue", title: "Welke gegevens we verzamelen",
        points: ["Voornaam van het kind (alleen als u dit invoert voor een verhaal — verzonden naar Groq/AI, niet door ons opgeslagen).", "Gekozen verhaalonderwerp (idem).", "Taalvoorkeur (opgeslagen in localStorage van de browser).", "Gegenereerde verhalen (alleen op uw apparaat via localStorage).", "Anonieme gebruiksanalyses."] },
      { icon: "AlertCircle", color: "red", title: "Wat we nooit verzamelen",
        points: ["E-mailadressen (behalve vrijwillige Kiddsy Club-aanmelding).", "Achternamen, adressen, telefoonnummers.", "Foto's, geluidsopnames of biometrische gegevens.", "Bewust gegevens van kinderen onder 13 jaar.", "Apparaatidentificatoren of advertentie-ID's."] },
      { icon: "Globe", color: "magenta", title: "Hoe we AI gebruiken (Groq)",
        points: ["Bij het genereren van een verhaal worden naam en onderwerp naar de Groq API gestuurd.", "Kiddsy slaat naam of onderwerp niet op na het tonen van het verhaal.", "Groq's gegevensgebruik valt onder hun eigen privacybeleid."] },
      { icon: "Eye", color: "green", title: "Cookies en lokale opslag",
        points: ["We gebruiken localStorage alleen voor taalvoorkeur en verhalen.", "Geen advertentiecookies of trackingpixels.", "U kunt deze gegevens op elk moment verwijderen via uw browserinstellingen."] },
      { icon: "Baby", color: "cyan", title: "Uw rechten (AVG)",
        points: ["Recht op inzage: we hebben hierboven alles opgesomd wat we verzamelen.", "Recht op wissing: we slaan uw gegevens niet op onze servers op.", "Recht van bezwaar: u kunt de AI-generator op elk moment stoppen.", "Kiddsy Club nieuwsbrief: afmelden met één klik.", "Voor vragen: legal@kiddsy.org"] },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // POLSKI
  // ════════════════════════════════════════════════════════════════════════
  pl: {
    dir: "ltr",
    back: "Wstecz",
    contact_q: "Pytania o prywatność?",
    last_updated: "Aktualizacja: Marzec 2026",
    legal_title: "Nota Prawna",
    legal_subtitle: "Kiddsy — Globalna Dwujęzyczna Aplikacja Edukacyjna",
    legal_banner: "Ta nota prawna jest napisana prostym językiem, aby każda rodzina mogła ją zrozumieć.",
    legal_sections: [
      { title: "1. Identyfikacja wydawcy", content: "Nazwa: Kiddsy. Adres: Mulhouse, Francja. Działalność: Bezpłatna dwujęzyczna edukacyjna aplikacja internetowa dla rodzin. E-mail: legal@kiddsy.org. Hosting: Vercel Inc., San Francisco, USA." },
      { title: "2. Cel i zakres", content: "Kiddsy to bezpłatna aplikacja internetowa zaprojektowana, aby pomóc rodzinom imigranckim i wielokulturowym uczyć się razem angielskiego przez dwujęzyczne historie generowane przez AI." },
      { title: "3. Własność intelektualna", content: "Nazwa 'Kiddsy', logo, projekt interfejsu, oryginalne teksty i kod źródłowy są chronione prawem własności intelektualnej. Powielanie bez wyraźnej pisemnej zgody jest zabronione, z wyjątkiem osobistego i niekomercyjnego użytku edukacyjnego." },
      { title: "4. Ograniczenie odpowiedzialności", content: "Kiddsy jest dostarczany 'w stanie, w jakim jest'. Wszystkie historie muszą być sprawdzone przez dorosłego przed udostępnieniem nieletnim." },
      { title: "5. Ochrona małoletnich", content: "Kiddsy nie gromadzi świadomie danych osobowych dzieci poniżej 13 roku życia. W razie obaw skontaktuj się z legal@kiddsy.org." },
      { title: "6. Prawo właściwe i jurysdykcja", content: "Niniejsza nota prawna podlega prawu francuskiemu. Spory są rozstrzygane przez właściwe sądy w Mulhouse (Francja)." },
      { title: "7. Zmiany", content: "Kiddsy zastrzega sobie prawo do modyfikacji tej noty w dowolnym czasie. Kontynuowanie korzystania z aplikacji oznacza akceptację zmian." },
      { title: "8. Kontakt", content: "W sprawach prawnych: legal@kiddsy.org", accent: "green" },
    ],
    privacy_title: "Polityka Prywatności",
    privacy_subtitle: "Kiddsy — Zbudowane dla rodzin, nie dla reklamodawców.",
    privacy_banner: "Prywatność bez drobnego druku. Aktualizacja: marzec 2026.",
    privacy_cards: [
      { icon: "Lock", color: "blue", title: "Jakie dane zbieramy",
        points: ["Imię dziecka (tylko gdy je wprowadzasz do generowania historii — wysyłane do Groq/AI, nie przechowywane przez nas).", "Wybrany temat historii (tak samo).", "Preferencja językowa (zapisana w localStorage przeglądarki).", "Wygenerowane historie (tylko na urządzeniu przez localStorage).", "Anonimowe analizy użytkowania."] },
      { icon: "AlertCircle", color: "red", title: "Czego nigdy nie zbieramy",
        points: ["Adresów e-mail (z wyjątkiem dobrowolnej subskrypcji Kiddsy Club).", "Nazwisk, adresów, numerów telefonów.", "Zdjęć, nagrań głosowych ani danych biometrycznych.", "Świadomie danych dzieci poniżej 13 roku życia.", "Identyfikatorów urządzeń ani ID reklamowych."] },
      { icon: "Globe", color: "magenta", title: "Jak używamy AI (Groq)",
        points: ["Przy generowaniu historii imię i temat są wysyłane do API Groq.", "Kiddsy nie przechowuje imienia ani tematu po wyświetleniu historii.", "Korzystanie z danych przez Groq reguluje ich własna polityka prywatności."] },
      { icon: "Eye", color: "green", title: "Pliki cookie i pamięć lokalna",
        points: ["Używamy localStorage tylko do preferencji językowych i historii.", "Brak reklamowych plików cookie ani pikseli śledzących.", "Dane te możesz usunąć w dowolnym momencie w ustawieniach przeglądarki."] },
      { icon: "Baby", color: "cyan", title: "Twoje prawa (RODO)",
        points: ["Prawo dostępu: wymieniliśmy wszystko, co zbieramy.", "Prawo do usunięcia: nie przechowujemy twoich danych na naszych serwerach.", "Prawo sprzeciwu: możesz w każdej chwili przestać używać generatora AI.", "Newsletter Kiddsy Club: rezygnacja jednym kliknięciem.", "W sprawie pytań: legal@kiddsy.org"] },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // SVENSKA
  // ════════════════════════════════════════════════════════════════════════
  sv: {
    dir: "ltr",
    back: "Tillbaka",
    contact_q: "Frågor om integritet?",
    last_updated: "Uppdaterad: Mars 2026",
    legal_title: "Juridisk Information",
    legal_subtitle: "Kiddsy — Global Tvåspråkig Utbildningsapp",
    legal_banner: "Denna juridiska information är skriven på enkelt språk så att varje familj kan förstå den.",
    legal_sections: [
      { title: "1. Utgivarens identifiering", content: "Namn: Kiddsy. Registrerad adress: Mulhouse, Frankrike. Verksamhet: Gratis tvåspråkig utbildnings-webbapp för familjer. E-post: legal@kiddsy.org. Webbhotell: Vercel Inc., San Francisco, USA." },
      { title: "2. Syfte och tillämpningsområde", content: "Kiddsy är en gratis webbapp utformad för att hjälpa invandrar- och mångkulturella familjer att lära sig engelska tillsammans genom AI-genererade tvåspråkiga berättelser." },
      { title: "3. Immateriella rättigheter", content: "Namnet 'Kiddsy', logotypen, gränssnittsdesignen, originaltexter och källkoden skyddas av immaterialrätten. Reproduktion utan uttrycklig skriftlig tillåtelse är förbjuden, utom för personligt och icke-kommersiellt utbildningsbruk." },
      { title: "4. Ansvarsbegränsning", content: "Kiddsy tillhandahålls 'i befintligt skick'. Alla berättelser måste granskas av en vuxen innan de delas med minderåriga." },
      { title: "5. Skydd av minderåriga", content: "Kiddsy samlar inte medvetet in personuppgifter från barn under 13 år. Vid misstanke, kontakta legal@kiddsy.org omedelbart." },
      { title: "6. Tillämplig lag och jurisdiktion", content: "Detta dokument regleras av fransk lag. Tvister avgörs av behöriga domstolar i Mulhouse (Frankrike)." },
      { title: "7. Ändringar", content: "Kiddsy förbehåller sig rätten att ändra detta dokument när som helst. Fortsatt användning innebär godkännande av ändringar." },
      { title: "8. Kontakt", content: "För juridiska frågor: legal@kiddsy.org", accent: "green" },
    ],
    privacy_title: "Integritetspolicy",
    privacy_subtitle: "Kiddsy — Byggt för familjer, inte annonsörer.",
    privacy_banner: "Integritet utan finprint. Uppdaterad: mars 2026.",
    privacy_cards: [
      { icon: "Lock", color: "blue", title: "Data vi samlar in",
        points: ["Barnets förnamn (endast om du anger det för att generera en historia — skickas till Groq/AI, vi lagrar det inte).", "Valt berättelsetema (detsamma).", "Språkpreferens (sparad i webbläsarens localStorage).", "Genererade berättelser (endast på din enhet via localStorage).", "Anonym användningsanalys."] },
      { icon: "AlertCircle", color: "red", title: "Vad vi aldrig samlar in",
        points: ["E-postadresser (utom frivillig prenumeration på Kiddsy Club).", "Efternamn, adresser, telefonnummer.", "Foton, röstinspelningar eller biometrisk data.", "Medvetet data från barn under 13 år.", "Enhetsidentifierare eller annons-ID:n."] },
      { icon: "Globe", color: "magenta", title: "Hur vi använder AI (Groq)",
        points: ["Vid generering av en historia skickas namn och tema till Groq API.", "Kiddsy lagrar inte namn eller tema efter att historien visats.", "Groqs dataanvändning regleras av deras egen integritetspolicy."] },
      { icon: "Eye", color: "green", title: "Cookies och lokal lagring",
        points: ["Vi använder localStorage endast för språkpreferens och berättelser.", "Inga reklamcookies eller spårningspixlar.", "Du kan radera denna data när som helst i webbläsarens inställningar."] },
      { icon: "Baby", color: "cyan", title: "Dina rättigheter (GDPR)",
        points: ["Rätt till åtkomst: vi har listat allt vi samlar in ovan.", "Rätt till radering: vi lagrar inte din data på våra servrar.", "Rätt att invända: du kan sluta använda AI-generatorn när som helst.", "Kiddsy Club nyhetsbrev: avprenumerera med ett klick.", "För frågor: legal@kiddsy.org"] },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // العربية  (RTL)
  // ════════════════════════════════════════════════════════════════════════
  ar: {
    dir: "rtl",
    back: "رجوع",
    contact_q: "أسئلة حول الخصوصية؟",
    last_updated: "آخر تحديث: مارس 2026",
    legal_title: "إشعار قانوني",
    legal_subtitle: "Kiddsy — تطبيق تعليمي ثنائي اللغة عالمي",
    legal_banner: "كُتب هذا الإشعار القانوني بلغة بسيطة حتى تتمكن كل عائلة من فهمه.",
    legal_sections: [
      { title: "١. التعريف بالناشر", content: "الاسم: Kiddsy. العنوان المسجل: مولوز، فرنسا. النشاط: تطبيق ويب تعليمي ثنائي اللغة مجاني للعائلات. البريد الإلكتروني: legal@kiddsy.org. الاستضافة: Vercel Inc.، سان فرانسيسكو، الولايات المتحدة." },
      { title: "٢. الغرض ونطاق التطبيق", content: "Kiddsy هو تطبيق ويب مجاني مصمم لمساعدة العائلات المهاجرة ومتعددة الثقافات على تعلم اللغة الإنجليزية معاً من خلال قصص ثنائية اللغة يولّدها الذكاء الاصطناعي." },
      { title: "٣. الملكية الفكرية", content: "اسم Kiddsy والشعار وتصميم الواجهة والنصوص الأصلية والكود المصدري محمية بقوانين الملكية الفكرية. يُحظر إعادة الإنتاج دون إذن كتابي صريح باستثناء الاستخدام الشخصي والتعليمي غير التجاري." },
      { title: "٤. حدود المسؤولية", content: "يُقدَّم Kiddsy 'كما هو'. يجب على بالغ مراجعة جميع القصص قبل مشاركتها مع القاصرين." },
      { title: "٥. حماية القاصرين (GDPR)", content: "لا يجمع Kiddsy عن قصد بيانات شخصية من الأطفال دون سن 13 عاماً. في حال القلق، تواصل فوراً على legal@kiddsy.org." },
      { title: "٦. القانون المطبق والاختصاص القضائي", content: "يخضع هذا الإشعار للقانون الفرنسي. تُحال النزاعات إلى المحاكم المختصة في مولوز، فرنسا." },
      { title: "٧. التعديلات", content: "يحتفظ Kiddsy بالحق في تعديل هذا الإشعار في أي وقت. الاستمرار في استخدام التطبيق يُعدّ قبولاً للتعديلات." },
      { title: "٨. التواصل", content: "لأي استفسار قانوني: legal@kiddsy.org", accent: "green" },
    ],
    privacy_title: "سياسة الخصوصية",
    privacy_subtitle: "Kiddsy — مبني للعائلات لا للمعلنين.",
    privacy_banner: "خصوصية بلا حروف صغيرة. آخر تحديث: مارس 2026.",
    privacy_cards: [
      { icon: "Lock", color: "blue", title: "البيانات التي نجمعها",
        points: ["اسم الطفل الأول (فقط عند إدخاله لتوليد قصة — يُرسَل إلى Groq/الذكاء الاصطناعي، لا نحتفظ به).", "موضوع القصة المختار (بالمثل).", "تفضيل اللغة (محفوظ في localStorage المتصفح).", "القصص المولّدة (محفوظة على جهازك فقط عبر localStorage).", "تحليلات استخدام مجهولة الهوية."] },
      { icon: "AlertCircle", color: "red", title: "ما لا نجمعه أبداً",
        points: ["عناوين البريد الإلكتروني (باستثناء الاشتراك الطوعي في Kiddsy Club).", "أسماء العائلة والعناوين وأرقام الهاتف.", "الصور أو التسجيلات الصوتية أو البيانات البيومترية.", "بيانات الأطفال دون 13 عاماً عن قصد.", "معرّفات الأجهزة أو معرّفات الإعلانات."] },
      { icon: "Globe", color: "magenta", title: "كيف نستخدم الذكاء الاصطناعي (Groq)",
        points: ["عند توليد القصة يُرسَل الاسم والموضوع إلى Groq API.", "لا يحتفظ Kiddsy بالاسم أو الموضوع بعد عرض القصة.", "استخدام Groq للبيانات يخضع لسياسة خصوصيته الخاصة."] },
      { icon: "Eye", color: "green", title: "ملفات الارتباط والتخزين المحلي",
        points: ["نستخدم localStorage فقط لتفضيل اللغة والقصص.", "لا توجد ملفات ارتباط إعلانية ولا بكسلات تتبع.", "يمكنك حذف هذه البيانات في أي وقت من إعدادات متصفحك."] },
      { icon: "Baby", color: "cyan", title: "حقوقك (GDPR)",
        points: ["حق الوصول: لقد أدرجنا أعلاه كل ما نجمعه.", "حق الحذف: لا نخزّن بياناتك على خوادمنا.", "حق الاعتراض: يمكنك التوقف عن استخدام مولّد الذكاء الاصطناعي في أي وقت.", "نشرة Kiddsy Club: إلغاء الاشتراك بنقرة واحدة.", "للاستفسارات: legal@kiddsy.org"] },
    ],
  },
};
