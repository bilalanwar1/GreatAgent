/**
 * Agents section UX — role sync, live preview, knowledge, ROI, demo modal, steps
 * Vanilla JS only. No frameworks.
 */
(() => {
  const roleSelect = document.getElementById("agentRole");
  const industrySelect = document.getElementById("agentIndustry");
  const voiceSelect = document.getElementById("agentVoice");
  const languageSelect = document.getElementById("agentLanguage");
  const agentNameInput = document.getElementById("agentName");
  const roleCards = document.querySelectorAll(".role-card[data-role]");
  const form = document.getElementById("createAgentForm");

  if (!roleSelect || !form) return;

  /* ---------- Sample conversations by role + industry ---------- */
  const ROLE_SAMPLES = {
    "Customer Service": {
      en: { user: "What are your business hours?", ai: "We're available Monday to Friday from 9 AM to 6 PM. How else can I help?" },
      es: { user: "¿Cuál es su horario?", ai: "Estamos disponibles de lunes a viernes de 9 AM a 6 PM. ¿En qué más puedo ayudarte?" },
      fr: { user: "Quels sont vos horaires ?", ai: "Nous sommes disponibles du lundi au vendredi de 9 h à 18 h. Comment puis-je vous aider ?" },
      de: { user: "Was sind Ihre Öffnungszeiten?", ai: "Wir sind Montag bis Freitag von 9 bis 18 Uhr erreichbar. Wie kann ich helfen?" },
      ar: { user: "ما هي ساعات العمل؟", ai: "نحن متاحون من الاثنين إلى الجمعة من 9 صباحًا حتى 6 مساءً. كيف يمكنني مساعدتك؟" },
      ur: { user: "آپ کے کاروباری اوقات کیا ہیں؟", ai: "ہم پیر سے جمعہ صبح ۹ بجے سے شام ۶ بجے تک دستیاب ہیں۔ میں آپ کی کیسے مدد کر سکتا ہوں؟" },
    },
    "Sales Assistant": {
      en: { user: "I'm interested in your pricing.", ai: "I'd be happy to help. Our Premium plan starts at $49/month — which plan fits your needs?" },
      es: { user: "Me interesa su precio.", ai: "Con gusto. El plan Premium comienza en $49/mes. ¿Cuál te interesa?" },
      fr: { user: "Je m'intéresse à vos tarifs.", ai: "Avec plaisir. Notre plan Premium commence à 49 $/mois. Lequel vous convient ?" },
      de: { user: "Ich interessiere mich für Ihre Preise.", ai: "Gerne. Unser Premium-Plan beginnt bei 49 $/Monat. Welcher Plan passt?" },
      ar: { user: "أنا مهتم بالأسعار.", ai: "يسعدني المساعدة. تبدأ الباقة المميزة من 49 دولارًا شهريًا." },
      ur: { user: "مجھے آپ کی قیمتوں میں دلچسپی ہے۔", ai: "خوشی سے مدد کروں گا۔ ہمارا پریمیم پلان ماہانہ ۴۹ ڈالر سے شروع ہوتا ہے۔" },
    },
    "Virtual Receptionist": {
      en: { user: "I'd like to speak with someone.", ai: "Of course. I can transfer you or schedule a callback. Who would you like to reach?" },
      es: { user: "Quisiera hablar con alguien.", ai: "Por supuesto. Puedo transferirte o agendar una llamada. ¿Con quién deseas hablar?" },
      fr: { user: "Je voudrais parler à quelqu'un.", ai: "Bien sûr. Je peux vous transférer ou planifier un rappel. Qui souhaitez-vous joindre ?" },
      de: { user: "Ich möchte mit jemandem sprechen.", ai: "Natürlich. Ich kann weiterleiten oder einen Rückruf planen. Wen möchten Sie erreichen?" },
      ar: { user: "أريد التحدث مع شخص ما.", ai: "بالطبع. يمكنني تحويل المكالمة أو جدولة اتصال. بمن تريد التواصل؟" },
      ur: { user: "میں کسی سے بات کرنا چاہتا ہوں۔", ai: "بالکل۔ میں آپ کو منتقل کر سکتا ہوں یا کال بیک شیڈول کر سکتا ہوں۔" },
    },
    "Technical Support": {
      en: { user: "My app keeps crashing.", ai: "Sorry about that. Which device and app version are you using? I'll walk you through a quick fix." },
      es: { user: "Mi app se cierra sola.", ai: "Lamento eso. ¿Qué dispositivo y versión usas? Te guiaré con una solución rápida." },
      fr: { user: "Mon application plante.", ai: "Désolé. Quel appareil et quelle version utilisez-vous ? Je vais vous guider." },
      de: { user: "Meine App stürzt ab.", ai: "Das tut mir leid. Welches Gerät und welche Version? Ich führe Sie durch eine schnelle Lösung." },
      ar: { user: "يتوقف تطبيقي فجأة.", ai: "آسف لذلك. ما الجهاز وإصدار التطبيق؟ سأساعدك بحل سريع." },
      ur: { user: "میری ایپ بار بار بند ہو جاتی ہے۔", ai: "معذرت۔ آپ کون سا ڈیوائس اور ورژن استعمال کر رہے ہیں؟ میں فوری حل بتاؤں گا۔" },
    },
    "Collections Agent": {
      en: { user: "I need more time to pay.", ai: "I understand. We can set up a flexible payment plan. Would 2 or 4 installments work better?" },
      es: { user: "Necesito más tiempo para pagar.", ai: "Lo entiendo. Podemos crear un plan flexible. ¿Prefieres 2 o 4 cuotas?" },
      fr: { user: "J'ai besoin de plus de temps pour payer.", ai: "Je comprends. Nous pouvons proposer un plan flexible. 2 ou 4 versements ?" },
      de: { user: "Ich brauche mehr Zeit zum Bezahlen.", ai: "Verstehe. Wir können einen flexiblen Plan einrichten. 2 oder 4 Raten?" },
      ar: { user: "أحتاج مزيدًا من الوقت للدفع.", ai: "أفهم ذلك. يمكننا ترتيب خطة دفع مرنة. هل تفضل قسطين أم أربعة؟" },
      ur: { user: "مجھے ادائیگی کے لیے مزید وقت چاہیے۔", ai: "میں سمجھتا ہوں۔ ہم لچکدار ادائیگی کا منصوبہ بنا سکتے ہیں۔" },
    },
    "Order Management": {
      en: { user: "Where is my order?", ai: "I can help track that. Please share your order number and I'll get the latest status." },
      es: { user: "¿Dónde está mi pedido?", ai: "Puedo ayudarte a rastrearlo. Comparte tu número de pedido." },
      fr: { user: "Où est ma commande ?", ai: "Je peux suivre cela. Partagez votre numéro de commande." },
      de: { user: "Wo ist meine Bestellung?", ai: "Ich kann den Status prüfen. Bitte teilen Sie Ihre Bestellnummer." },
      ar: { user: "أين طلبي؟", ai: "يمكنني تتبعه. يرجى مشاركة رقم الطلب." },
      ur: { user: "میرا آرڈر کہاں ہے؟", ai: "میں ٹریک کر سکتا ہوں۔ براہ کرم آرڈر نمبر شیئر کریں۔" },
    },
    "Task Manager": {
      en: { user: "Remind me to follow up tomorrow.", ai: "Done — I've set a reminder for tomorrow at 10 AM. Want me to add any notes?" },
      es: { user: "Recuérdame dar seguimiento mañana.", ai: "Listo — recordatorio mañana a las 10 AM. ¿Agrego notas?" },
      fr: { user: "Rappelle-moi de faire un suivi demain.", ai: "C'est noté — rappel demain à 10 h. Des notes à ajouter ?" },
      de: { user: "Erinnere mich morgen an das Follow-up.", ai: "Erledigt — Erinnerung morgen um 10 Uhr. Soll ich Notizen hinzufügen?" },
      ar: { user: "ذكرني بالمتابعة غدًا.", ai: "تم — تذكير غدًا الساعة 10 صباحًا. هل تريد إضافة ملاحظات؟" },
      ur: { user: "مجھے کل فالو اپ یاد دلائیں۔", ai: "ہو گیا — کل صبح ۱۰ بجے یاد دہانی سیٹ کر دی۔" },
    },
    "Executive Assistant": {
      en: { user: "Can you schedule a meeting for Friday?", ai: "Absolutely. I see 2 PM and 4 PM open on Friday. Which works better for you?" },
      es: { user: "¿Puedes agendar una reunión para el viernes?", ai: "Claro. Hay disponibilidad a las 2 PM y 4 PM. ¿Cuál prefieres?" },
      fr: { user: "Peux-tu planifier une réunion vendredi ?", ai: "Bien sûr. 14 h et 16 h sont libres. Lequel vous convient ?" },
      de: { user: "Kannst du ein Meeting für Freitag planen?", ai: "Klar. Freitag 14 Uhr und 16 Uhr sind frei. Was passt besser?" },
      ar: { user: "هل يمكنك جدولة اجتماع يوم الجمعة؟", ai: "بالتأكيد. الساعة 2 مساءً و4 مساءً متاحتان. أيهما أفضل؟" },
      ur: { user: "کیا آپ جمعہ کو میٹنگ شیڈول کر سکتے ہیں؟", ai: "بالکل۔ جمعہ کو ۲ بجے اور ۴ بجے دستیاب ہیں۔ کون سا وقت بہتر ہے؟" },
    },
  };

  const INDUSTRY_SAMPLES = {
    Restaurant: {
      en: { user: "Can I reserve a table?", ai: "Of course! For how many guests and which date works best?" },
      es: { user: "¿Puedo reservar una mesa?", ai: "¡Claro! ¿Para cuántas personas y qué fecha prefieres?" },
      fr: { user: "Puis-je réserver une table ?", ai: "Bien sûr ! Pour combien de personnes et quelle date ?" },
      de: { user: "Kann ich einen Tisch reservieren?", ai: "Natürlich! Für wie viele Gäste und welches Datum?" },
      ar: { user: "هل يمكنني حجز طاولة؟", ai: "بالطبع! لكم شخص وأي تاريخ يناسبك؟" },
      ur: { user: "کیا میں میز بک کروا سکتا ہوں؟", ai: "بالکل! کتنے مہمان اور کون سی تاریخ؟" },
    },
    Clinic: {
      en: { user: "I need an appointment.", ai: "Happy to help. Do you prefer a morning or afternoon slot this week?" },
      es: { user: "Necesito una cita.", ai: "Con gusto. ¿Prefieres mañana o tarde esta semana?" },
      fr: { user: "J'ai besoin d'un rendez-vous.", ai: "Avec plaisir. Matin ou après-midi cette semaine ?" },
      de: { user: "Ich brauche einen Termin.", ai: "Gerne. Vormittag oder Nachmittag diese Woche?" },
      ar: { user: "أحتاج إلى موعد.", ai: "يسعدني المساعدة. هل تفضل صباحًا أم مساءً هذا الأسبوع؟" },
      ur: { user: "مجھے اپائنٹمنٹ چاہیے۔", ai: "خوشی سے۔ اس ہفتے صبح یا دوپہر؟" },
    },
    "Real Estate": {
      en: { user: "I'm looking for a 2-bedroom apartment.", ai: "Great — what's your preferred neighborhood and budget range?" },
      es: { user: "Busco un apartamento de 2 habitaciones.", ai: "Perfecto — ¿qué zona y presupuesto prefieres?" },
      fr: { user: "Je cherche un appartement 2 chambres.", ai: "Parfait — quel quartier et quel budget ?" },
      de: { user: "Ich suche eine 2-Zimmer-Wohnung.", ai: "Super — welche Lage und welches Budget?" },
      ar: { user: "أبحث عن شقة بغرفتين.", ai: "رائع — ما الحي والميزانية المفضلة؟" },
      ur: { user: "مجھے ۲ بیڈ روم اپارٹمنٹ چاہیے۔", ai: "زبردست — کون سا علاقہ اور بجٹ؟" },
    },
    "E-commerce": {
      en: { user: "Do you offer free shipping?", ai: "Yes — free shipping on orders over $50. Want me to check a product for you?" },
      es: { user: "¿Ofrecen envío gratis?", ai: "Sí — envío gratis en pedidos mayores a $50." },
      fr: { user: "Proposez-vous la livraison gratuite ?", ai: "Oui — gratuite dès 50 $ d'achat." },
      de: { user: "Gibt es kostenlosen Versand?", ai: "Ja — kostenlos ab 50 $ Bestellwert." },
      ar: { user: "هل تقدمون شحنًا مجانيًا؟", ai: "نعم — شحن مجاني للطلبات فوق 50 دولارًا." },
      ur: { user: "کیا مفت شپنگ ملتی ہے؟", ai: "ہاں — ۵۰ ڈالر سے اوپر آرڈرز پر مفت شپنگ۔" },
    },
    Education: {
      en: { user: "When does enrollment open?", ai: "Enrollment opens next Monday. I can walk you through the steps if you'd like." },
      es: { user: "¿Cuándo abre la inscripción?", ai: "Abre el próximo lunes. ¿Te guío en el proceso?" },
      fr: { user: "Quand ouvrent les inscriptions ?", ai: "Lundi prochain. Je peux vous guider si vous voulez." },
      de: { user: "Wann beginnt die Anmeldung?", ai: "Nächsten Montag. Soll ich Sie durch die Schritte führen?" },
      ar: { user: "متى يبدأ التسجيل؟", ai: "يبدأ يوم الاثنين القادم. هل تريد المساعدة في الخطوات؟" },
      ur: { user: "داخلہ کب کھلتا ہے؟", ai: "اگلے پیر سے۔ کیا میں آپ کو مراحل بتاؤں؟" },
    },
    Legal: {
      en: { user: "I need a consultation.", ai: "I can schedule a consultation. Is this regarding contracts, disputes, or something else?" },
      es: { user: "Necesito una consulta.", ai: "Puedo agendarla. ¿Es sobre contratos, disputas u otro tema?" },
      fr: { user: "J'ai besoin d'une consultation.", ai: "Je peux la planifier. Contrats, litiges ou autre ?" },
      de: { user: "Ich brauche eine Beratung.", ai: "Ich kann einen Termin setzen. Verträge, Streitfälle oder anderes?" },
      ar: { user: "أحتاج إلى استشارة.", ai: "يمكنني جدولة استشارة. هل تتعلق بالعقود أم النزاعات؟" },
      ur: { user: "مجھے مشاورت درکار ہے۔", ai: "میں شیڈول کر سکتا ہوں۔ معاہدے، تنازع یا کچھ اور؟" },
    },
    Finance: {
      en: { user: "What's the best savings option?", ai: "It depends on your goals. Are you looking for short-term liquidity or long-term growth?" },
      es: { user: "¿Cuál es la mejor opción de ahorro?", ai: "Depende de tus metas. ¿Liquidez a corto plazo o crecimiento a largo plazo?" },
      fr: { user: "Quelle est la meilleure option d'épargne ?", ai: "Cela dépend de vos objectifs. Liquidité court terme ou croissance long terme ?" },
      de: { user: "Was ist die beste Sparoption?", ai: "Kommt auf Ihre Ziele an. Kurzfristige Liquidität oder langfristiges Wachstum?" },
      ar: { user: "ما أفضل خيار للادخار؟", ai: "يعتمد على أهدافك. سيولة قصيرة الأجل أم نمو طويل الأجل؟" },
      ur: { user: "بہترین سیونگ آپشن کیا ہے؟", ai: "آپ کے اہداف پر منحصر ہے۔ قلیل مدتی یا طویل مدتی؟" },
    },
    Construction: {
      en: { user: "Can I get a project estimate?", ai: "Absolutely. Share the project type and square footage, and I'll outline next steps." },
      es: { user: "¿Puedo obtener un presupuesto?", ai: "Claro. Comparte el tipo de proyecto y metros cuadrados." },
      fr: { user: "Puis-je obtenir un devis ?", ai: "Bien sûr. Indiquez le type de projet et la surface." },
      de: { user: "Kann ich einen Kostenvoranschlag bekommen?", ai: "Klar. Teilen Sie Projekttyp und Fläche mit." },
      ar: { user: "هل يمكنني الحصول على تقدير؟", ai: "بالتأكيد. شارك نوع المشروع والمساحة." },
      ur: { user: "کیا مجھے پراجیکٹ کا اندازہ مل سکتا ہے؟", ai: "بالکل۔ پراجیکٹ کی قسم اور رقبہ بتائیں۔" },
    },
  };

  const ROI_BY_ROLE = {
    "Customer Service": { automate: 70, hours: 15, response: 90 },
    "Sales Assistant": { automate: 55, hours: 12, response: 75 },
    "Virtual Receptionist": { automate: 80, hours: 20, response: 95 },
    "Technical Support": { automate: 65, hours: 14, response: 85 },
    "Collections Agent": { automate: 60, hours: 18, response: 70 },
    "Order Management": { automate: 75, hours: 16, response: 88 },
    "Task Manager": { automate: 50, hours: 10, response: 65 },
    "Executive Assistant": { automate: 45, hours: 12, response: 80 },
  };

  const DEMO_REPLIES = {
    pricing: {
      en: "Our Premium plan starts at $49/month, with Pro at $99/month. Which features matter most to you?",
      es: "El plan Premium comienza en $49/mes y Pro en $99/mes. ¿Qué funciones te importan más?",
      fr: "Notre plan Premium commence à 49 $/mois et Pro à 99 $/mois. Quelles fonctionnalités vous intéressent ?",
      de: "Unser Premium-Plan beginnt bei 49 $/Monat, Pro bei 99 $/Monat. Welche Funktionen sind wichtig?",
      ar: "تبدأ الباقة المميزة من 49 دولارًا شهريًا وPro من 99 دولارًا. ما الميزات الأهم لديك؟",
      ur: "پریمیم پلان ۴۹ ڈالر ماہانہ اور پرو ۹۹ ڈالر سے شروع ہوتا ہے۔ آپ کو کون سی خصوصیات چاہییں؟",
    },
    hours: {
      en: "We're available Monday–Friday, 9 AM–6 PM. I can also help after hours with common questions.",
      es: "Estamos disponibles de lunes a viernes, 9 AM–6 PM.",
      fr: "Nous sommes disponibles du lundi au vendredi, 9 h–18 h.",
      de: "Wir sind Montag–Freitag von 9–18 Uhr erreichbar.",
      ar: "نحن متاحون من الاثنين إلى الجمعة، 9 صباحًا–6 مساءً.",
      ur: "ہم پیر سے جمعہ صبح ۹ سے شام ۶ بجے تک دستیاب ہیں۔",
    },
    hello: {
      en: "Hi! I'm your AI assistant. How can I help you today?",
      es: "¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte?",
      fr: "Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider ?",
      de: "Hallo! Ich bin Ihr KI-Assistent. Wie kann ich helfen?",
      ar: "مرحبًا! أنا مساعدك الذكي. كيف يمكنني مساعدتك؟",
      ur: "سلام! میں آپ کا اے آئی اسسٹنٹ ہوں۔ میں کیسے مدد کر سکتا ہوں؟",
    },
    default: {
      en: "Thanks for your message. Based on your {role} needs in {industry}, I can help with that — could you share a bit more detail?",
      es: "Gracias. Como agente de {role} en {industry}, puedo ayudarte. ¿Me das más detalles?",
      fr: "Merci. En tant qu'agent {role} pour {industry}, je peux vous aider. Pouvez-vous préciser ?",
      de: "Danke. Als {role}-Agent für {industry} helfe ich gern. Können Sie mehr Details teilen?",
      ar: "شكرًا. بصفتي وكيل {role} في {industry} يمكنني المساعدة. هل يمكنك التوضيح؟",
      ur: "شکریہ۔ {industry} کے لیے {role} کے طور پر میں مدد کر سکتا ہوں۔ کچھ مزید تفصیل بتائیں؟",
    },
  };

  /* ---------- Helpers ---------- */
  const langKey = (label) => {
    const v = (label || "English").toLowerCase();
    if (v.startsWith("spanish")) return "es";
    if (v.startsWith("french")) return "fr";
    if (v.startsWith("german")) return "de";
    if (v.startsWith("arabic")) return "ar";
    if (v.startsWith("urdu")) return "ur";
    return "en";
  };

  const voiceFirstName = (voice) => (voice || "Emma").split(" ")[0];

  const defaultAgentName = (role) => {
    if (role === "Customer Service") return "Customer Support Agent";
    return `${role} Agent`;
  };

  const getState = () => ({
    role: roleSelect.value,
    industry: industrySelect ? industrySelect.value : "Restaurant",
    voice: voiceSelect ? voiceSelect.value : "Emma (Natural)",
    language: languageSelect ? languageSelect.value : "English",
  });

  /* ---------- Role card ↔ dropdown sync ---------- */
  let previewSource = "role";

  const selectRole = (role, { fromCard = false } = {}) => {
    if (!role) return;
    roleSelect.value = role;
    previewSource = "role";

    roleCards.forEach((card) => {
      const active = card.dataset.role === role;
      card.classList.toggle("is-active", active);
      card.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (agentNameInput && (fromCard || !agentNameInput.dataset.userEdited)) {
      agentNameInput.value = defaultAgentName(role);
    }

    updatePreview();
    animateRoi(role);
    updateSteps();
  };

  roleCards.forEach((card) => {
    card.addEventListener("click", () => selectRole(card.dataset.role, { fromCard: true }));
  });

  roleSelect.addEventListener("change", () => selectRole(roleSelect.value));

  if (agentNameInput) {
    agentNameInput.addEventListener("input", () => {
      agentNameInput.dataset.userEdited = "1";
    });
  }

  /* ---------- Live preview ---------- */
  const previewUser = document.getElementById("previewUserMsg");
  const previewAi = document.getElementById("previewAiMsg");
  const previewMeta = document.getElementById("previewMeta");
  const previewTyping = document.getElementById("previewTyping");
  const previewUserBubble = document.getElementById("previewUserBubble");
  const previewAiBubble = document.getElementById("previewAiBubble");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let previewToken = 0;
  let previewTimers = [];

  const clearPreviewTimers = () => {
    previewTimers.forEach((id) => clearTimeout(id));
    previewTimers = [];
  };

  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    previewTimers.push(id);
    return id;
  };

  const restartBubbleAnim = (el) => {
    if (!el || prefersReducedMotion) return;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
  };

  const typeText = (el, text, token) =>
    new Promise((resolve) => {
      if (!el) {
        resolve();
        return;
      }
      if (prefersReducedMotion) {
        el.textContent = text;
        el.classList.remove("is-typing");
        resolve();
        return;
      }
      el.textContent = "";
      el.classList.add("is-typing");
      let i = 0;
      const tick = () => {
        if (token !== previewToken) {
          resolve();
          return;
        }
        el.textContent = text.slice(0, i);
        i += 1;
        if (i <= text.length) {
          later(tick, 10 + Math.random() * 16);
        } else {
          el.classList.remove("is-typing");
          resolve();
        }
      };
      tick();
    });

  const showTypingDots = (dotsEl, show) => {
    if (!dotsEl) return;
    dotsEl.hidden = !show;
  };

  const speakAiReply = async (textEl, dotsEl, text, token) => {
    if (!textEl) return;
    textEl.textContent = "";
    textEl.classList.remove("is-typing");
    showTypingDots(dotsEl, true);
    const delay = prefersReducedMotion ? 0 : 800 + Math.floor(Math.random() * 700);
    await new Promise((resolve) => {
      later(() => {
        if (token !== previewToken) {
          resolve();
          return;
        }
        showTypingDots(dotsEl, false);
        resolve();
      }, delay);
    });
    if (token !== previewToken) return;
    await typeText(textEl, text, token);
  };

  const getPreviewPair = (state) => {
    const key = langKey(state.language);
    const industry = INDUSTRY_SAMPLES[state.industry];
    const role = ROLE_SAMPLES[state.role];
    if (previewSource === "industry" && industry) return industry[key] || industry.en;
    if (role) return role[key] || role.en;
    if (industry) return industry[key] || industry.en;
    return ROLE_SAMPLES["Customer Service"].en;
  };

  const updatePreview = () => {
    const token = ++previewToken;
    clearPreviewTimers();
    const state = getState();
    const pair = getPreviewPair(state);

    if (previewMeta) {
      previewMeta.textContent = `${voiceFirstName(state.voice)} · ${state.language}`;
      previewMeta.classList.remove("is-pulse");
      void previewMeta.offsetWidth;
      previewMeta.classList.add("is-pulse");
    }

    if (previewUser) {
      previewUser.textContent = pair.user;
      restartBubbleAnim(previewUserBubble);
    }

    restartBubbleAnim(previewAiBubble);
    speakAiReply(previewAi, previewTyping, pair.ai, token);
  };

  if (industrySelect) {
    industrySelect.addEventListener("change", () => {
      previewSource = "industry";
      updatePreview();
      updateSteps();
    });
  }
  if (voiceSelect) {
    voiceSelect.addEventListener("change", () => {
      updatePreview();
      updateSteps();
    });
  }
  if (languageSelect) {
    languageSelect.addEventListener("change", () => {
      updatePreview();
      updateSteps();
    });
  }

  /* ---------- ROI animation ---------- */
  const animateNumber = (el, to) => {
    if (!el) return;
    const from = parseInt(el.textContent, 10) || 0;
    const start = performance.now();
    const duration = 700;
    const frame = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(from + (to - from) * eased));
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const animateRoi = (role) => {
    const stats = ROI_BY_ROLE[role] || ROI_BY_ROLE["Customer Service"];
    document.querySelectorAll("[data-roi]").forEach((el) => {
      const key = el.getAttribute("data-roi");
      if (stats[key] != null) animateNumber(el, stats[key]);
    });
  };

  /* ---------- Progress steps ---------- */
  const stepItems = document.querySelectorAll(".agent-steps__item");
  const stepFill = document.querySelector(".agent-steps__fill");
  const knowledgeStatus = document.getElementById("knowledgeStatus");

  const updateSteps = () => {
    let step = 1;
    if (roleSelect.value) step = 1;
    if (knowledgeStatus && !knowledgeStatus.hidden) step = Math.max(step, 2);
    if (industrySelect && industrySelect.value && voiceSelect && languageSelect) step = Math.max(step, 3);
    // Step 4 highlighted briefly on successful create via setStep(4)

    stepItems.forEach((item) => {
      const n = parseInt(item.dataset.step, 10);
      item.classList.toggle("is-active", n === step);
      item.classList.toggle("is-complete", n < step);
    });
    if (stepFill) stepFill.style.width = `${(step / 4) * 100}%`;
  };

  const setStep = (step) => {
    stepItems.forEach((item) => {
      const n = parseInt(item.dataset.step, 10);
      item.classList.toggle("is-active", n === step);
      item.classList.toggle("is-complete", n < step);
    });
    if (stepFill) stepFill.style.width = `${(step / 4) * 100}%`;
  };

  /* ---------- Knowledge upload (mock) ---------- */
  const knowledgeFileName = document.getElementById("knowledgeFileName");
  const bindUpload = (inputId) => {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file || !knowledgeStatus || !knowledgeFileName) return;
      knowledgeFileName.textContent = file.name;
      knowledgeStatus.hidden = false;
      knowledgeStatus.classList.remove("is-pop");
      void knowledgeStatus.offsetWidth;
      knowledgeStatus.classList.add("is-pop");
      updateSteps();
      setStep(2);
      setTimeout(updateSteps, 400);
    });
  };
  bindUpload("uploadPdf");
  bindUpload("uploadDocx");

  /* ---------- Try Demo modal ---------- */
  const demoModal = document.getElementById("demoModal");
  const demoMessages = document.getElementById("demoMessages");
  const demoChatForm = document.getElementById("demoChatForm");
  const demoChatInput = document.getElementById("demoChatInput");
  const demoModalSub = document.getElementById("demoModalSub");
  const tryDemoBtn = document.getElementById("tryDemoBtn");
  let demoBusy = false;
  let lastFocus = null;

  const scrollDemo = () => {
    if (!demoMessages) return;
    demoMessages.scrollTop = demoMessages.scrollHeight;
  };

  const appendDemoMsg = (text, who) => {
    if (!demoMessages) return null;
    const div = document.createElement("div");
    div.className = `demo-msg demo-msg--${who}`;
    div.textContent = text;
    demoMessages.appendChild(div);
    scrollDemo();
    return div;
  };

  const appendDemoTyping = () => {
    if (!demoMessages) return null;
    const wrap = document.createElement("div");
    wrap.className = "demo-msg demo-msg--ai demo-msg--typing";
    wrap.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    demoMessages.appendChild(wrap);
    scrollDemo();
    return wrap;
  };

  const typeIntoEl = (el, text) =>
    new Promise((resolve) => {
      if (!el) {
        resolve();
        return;
      }
      if (prefersReducedMotion) {
        el.textContent = text;
        resolve();
        return;
      }
      el.textContent = "";
      let i = 0;
      const tick = () => {
        el.textContent = text.slice(0, i);
        i += 1;
        scrollDemo();
        if (i <= text.length) setTimeout(tick, 10 + Math.random() * 14);
        else resolve();
      };
      tick();
    });

  const demoAiReply = async (text) => {
    if (!demoMessages) return;
    const typing = appendDemoTyping();
    const delay = prefersReducedMotion ? 120 : 850 + Math.floor(Math.random() * 550);
    await new Promise((r) => setTimeout(r, delay));
    if (typing) typing.remove();
    const bubble = document.createElement("div");
    bubble.className = "demo-msg demo-msg--ai";
    demoMessages.appendChild(bubble);
    scrollDemo();
    await typeIntoEl(bubble, text);
  };

  const openDemo = async () => {
    if (!demoModal) return;
    lastFocus = document.activeElement;
    const state = getState();
    if (demoModalSub) {
      demoModalSub.textContent = `${state.role} · ${state.industry} · ${state.language}`;
    }
    if (demoMessages) demoMessages.innerHTML = "";
    demoModal.hidden = false;
    document.body.classList.add("demo-open");
    setTimeout(() => demoChatInput && demoChatInput.focus(), 50);
    const key = langKey(state.language);
    demoBusy = true;
    await demoAiReply(DEMO_REPLIES.hello[key] || DEMO_REPLIES.hello.en);
    demoBusy = false;
  };

  const closeDemo = () => {
    if (!demoModal) return;
    demoModal.hidden = true;
    document.body.classList.remove("demo-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  };

  const mockDemoReply = (userText) => {
    const state = getState();
    const key = langKey(state.language);
    const lower = userText.toLowerCase();
    let template;
    if (/price|pricing|cost|plan|tarif|precio|preis|قیمت|سعر/.test(lower)) {
      template = DEMO_REPLIES.pricing[key] || DEMO_REPLIES.pricing.en;
    } else if (/hour|open|horario|horaire|öffnungs|وقت|ساعات/.test(lower)) {
      template = DEMO_REPLIES.hours[key] || DEMO_REPLIES.hours.en;
    } else if (/hello|hi|hey|hola|bonjour|hallo|سلام|مرحبا/.test(lower)) {
      template = DEMO_REPLIES.hello[key] || DEMO_REPLIES.hello.en;
    } else {
      template = (DEMO_REPLIES.default[key] || DEMO_REPLIES.default.en)
        .replace("{role}", state.role)
        .replace("{industry}", state.industry);
    }
    return template;
  };

  if (tryDemoBtn) tryDemoBtn.addEventListener("click", openDemo);
  document.querySelectorAll("[data-close-demo]").forEach((el) => {
    el.addEventListener("click", closeDemo);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && demoModal && !demoModal.hidden) closeDemo();
  });

  if (demoChatForm) {
    demoChatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (demoBusy) return;
      const text = (demoChatInput.value || "").trim();
      if (!text) return;
      appendDemoMsg(text, "user");
      demoChatInput.value = "";
      demoBusy = true;
      demoChatInput.disabled = true;
      await demoAiReply(mockDemoReply(text));
      demoChatInput.disabled = false;
      demoBusy = false;
      demoChatInput.focus();
    });
  }

  /* ---------- Create Agent submit ---------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = document.getElementById("createAgentBtn") || form.querySelector('button[type="submit"]');
    if (!btn) return;
    const original = btn.innerHTML;
    setStep(4);
    btn.classList.add("is-success");
    btn.textContent = "Agent Created ✓";
    btn.style.pointerEvents = "none";
    form.classList.add("is-created");
    setTimeout(() => {
      btn.innerHTML = original;
      btn.classList.remove("is-success");
      btn.style.pointerEvents = "";
      form.classList.remove("is-created");
      updateSteps();
    }, 2200);
  });

  /* ---------- Init ---------- */
  selectRole(roleSelect.value || "Customer Service");
  updateSteps();
})();
