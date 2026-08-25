/* ============================================================
   ALTO — jazyková vrstva (SK / EN)

   Zdrojom pravdy je slovenské znenie priamo v index.html. Prepínač
   nahradí obsah textových uzlov a prekladateľných atribútov podľa
   slovníka nižšie; späť do SK sa vracia z uloženého originálu, takže
   preklad nikdy nemôže "pretiecť" cez dvojité spustenie.

   Reťazce, ktoré vznikajú až v JS (karty ponuky), sa prekladajú
   cez ALTO_I18N.t(key, params).
   ============================================================ */
window.ALTO_I18N = (function () {
  "use strict";

  const STORAGE_KEY = "alto-lang";
  const SUPPORTED = ["sk", "en"];

  /* ---------- slovník: normalizovaný SK reťazec → EN ---------- */
  const EN = {
    /* hlavička a menu */
    "Projekty": "Projects",
    "Štandard": "Standard",
    "Ponuka": "Offer",
    "Lokalita": "Location",
    "Proces": "Process",
    "Kontakt": "Contact",
    "Zobraziť ponuku": "View offer",
    "Otvoriť menu": "Open menu",
    "Zavrieť menu": "Close menu",
    "Hlavné menu": "Main menu",
    "Jazyk": "Language",
    "ALTO — domov": "ALTO — home",
    "Slovak": "Slovak",
    "English": "English",
    "2026 © ALTO Real Estate.": "2026 © ALTO Real Estate.",
    "All rights reserved.": "All rights reserved.",

    /* hero */
    "Bývanie na prenájom": "Homes for rent",
    "v 2 výnimočných projektoch": "in 2 exceptional developments",
    "v srdci Bratislavy": "in the heart of Bratislava",
    "a bez zbytočných poplatkov!": "and with no needless fees!",
    "Zistite viac": "Find out more",
    "Skrolujte dole": "Scroll down",

    /* sekcia 02 — projekty */
    "2 voľné": "2 available",
    "9 voľných": "9 available",
    "SKY PARK 4. veža bola navrhnutá prestížnou architektkou Zaha Hadid. Aj vďaka tomu sa projekt ihneď zaradil medzi dominanty štvrte, ale aj celého mesta.":
      "The SKY PARK 4th tower was designed by the acclaimed architect Zaha Hadid. That alone made the development an instant landmark of the district and of the whole city.",
    "Projekt Florian Residences je z dielne prestížneho holandského ateliéru Benthem Crouwel a hneď na prvý pohľad zaujme výnimočnou eleganciou v každom detaile.":
      "Florian Residences comes from the renowned Dutch studio Benthem Crouwel and catches the eye at once with its exceptional elegance in every detail.",
    "Továrenská 14 • Staré mesto • Bratislava": "Továrenská 14 • Staré Mesto • Bratislava",
    "Bottova / Továrenská • Staré mesto • Bratislava": "Bottova / Továrenská • Staré Mesto • Bratislava",
    "Račianska / Trnavské mýto • Nové mesto • Bratislava": "Račianska / Trnavské Mýto • Nové Mesto • Bratislava",
    "Prejsť na skypark4rent.sk": "Go to skypark4rent.sk",
    "Prejsť na florian4rent.sk": "Go to florian4rent.sk",
    "Račianska / Trnavské mýto, Nové mesto, Bratislava": "Račianska / Trnavské Mýto, Nové Mesto, Bratislava",
    "Školská 2 • Staré mesto • Bratislava": "Školská 2 • Staré Mesto • Bratislava",
    "SKY PARK — zobraziť ponuku": "SKY PARK — view offer",
    "FLORIAN — zobraziť ponuku": "FLORIAN — view offer",
    "SKY PARK — letecký pohľad na veže": "SKY PARK — aerial view of the towers",
    "FLORIAN — exteriér rezidencie": "FLORIAN — exterior of the residence",

    /* sekcia 03 — typy bytov */
    "Typy bytov v ALTO Rental Residences": "Apartment types at ALTO Rental Residences",
    "1-izbové byty": "1-room apartments",
    "1,5-izbové byty": "1.5-room apartments",
    "2-izbové byty": "2-room apartments",
    "3-izbové byty": "3-room apartments",
    "1-izbový byt": "1-room apartment",
    "1,5-izbový byt": "1.5-room apartment",
    "2-izbový byt": "2-room apartment",
    "3-izbový byt": "3-room apartment",

    /* sekcia 04 — benefity */
    "Prenájom bez sprostredkovateľských poplatkov priamo od majiteľa":
      "Rent directly from the owner, with no agency fees",
    "Plne a komfortne zariadené byty": "Fully and comfortably furnished apartments",
    "Transparentné podmienky nájmu pre všetkých": "Transparent lease terms for everyone",
    "Najvyšší štandard": "The highest standard",
    "v každom detaile": "in every detail",
    "Prémiové prírodné materiály a najmodernejšie technológie. Spolu posúvajú kvalitu bývania v budove o úroveň vyššie než kdekoľvek inde.":
      "Premium natural materials and state-of-the-art technology. Together they lift living in the building a level above anywhere else.",
    "Nájom možný už od 3 mesiacov vrátane korporátnej klientely":
      "Leases from as little as 3 months, corporate clients included",
    "Profesionálna správa zabezpečená interným tímom":
      "Professional management handled by an in-house team",
    "Vysoký technologický štandard vrátane chladenia":
      "A high technical standard, including cooling",

    /* sekcia 05 — ponuka a filter */
    "Ponuka bytov": "Apartments",
    "na prenájom": "for rent",
    "Počet izieb": "Rooms",
    "Všetky": "All",
    "Projekt": "Development",
    "Dostupnosť": "Availability",
    "Voľné": "Available",
    "Rezervované": "Reserved",
    "Prenajaté": "Rented",
    "Podlažie": "Floor",
    "Podlažie od": "Floor from",
    "Podlažie do": "Floor to",
    "Cena": "Price",
    "Cena od": "Price from",
    "Cena do": "Price to",
    "Zoradiť": "Sort by",
    "Cena: Najnižšia": "Price: Lowest",
    "Cena: Najvyššia": "Price: Highest",
    "Plocha: Najväčšia": "Area: Largest",
    "Zobrazených": "Showing",
    "Načítať ďalšie": "Load more",

    /* sekcia 06 — amenities */
    "Najlepšie lokality": "The best locations",
    "v meste": "in the city",
    "na trhu": "on the market",
    "Byty sú reprezentatívne, v špičkovom dizajne a najvyššom technickom a materiálovom štandarde na trhu. Nájdete v nich prémiové prírodné materiály a high tech výbavu od stropného chladenia až po prirodzenú filtráciu vzduchu. Všetko pre to, aby ste sa každý deň cítili príjemne a pohodlne.":
      "The apartments are representative, superbly designed and built to the highest technical and material standard on the market. Inside you will find premium natural materials and high-tech equipment, from ceiling cooling to natural air filtration. All so that you feel at ease every single day.",
    "Svetová": "World-class",
    "architektúra": "architecture",
    "SKY PARK 4. veža bola navrhnutá prestížnou architektkou Zaha Hadid. Aj vďaka tomu sa projekt ihneď zaradil medzi dominanty štvrte, ale aj celého mesta. Projekt Florian Residences je z dielne prestížneho holandského ateliéru Benthem Crouwel a hneď na prvý pohľad zaujme výnimočnou eleganciou v každom detaile.":
      "The SKY PARK 4th tower was designed by the acclaimed architect Zaha Hadid, which made the development an instant landmark of the district and of the whole city. Florian Residences comes from the renowned Dutch studio Benthem Crouwel and catches the eye at once with its exceptional elegance in every detail.",
    "Bývajte v dotyku": "Live in touch",
    "so zeleňou": "with greenery",
    "Florian kombinuje prestížnu adresu s pokojom a súkromím, aké je v centre výnimkou. Projekt SKY PARK bol vybudovaný uprostred mestského parku s veľkým udržiavaným trávnikom, pestrou výsadbou, vodnými prvkami a vybavením pre šport aj relax. Za pohybom či príjemným posedením tak nemusíte chodiť ďalej, než pod vlastné okná.":
      "Florian combines a prestigious address with a calm and privacy rarely found downtown. SKY PARK was built in the middle of a city park with a large maintained lawn, varied planting, water features and facilities for sport and relaxation. For exercise or a pleasant sit-down you need go no further than your own windows.",

    /* sekcia 07 — lokalita */
    "Historické": "Historic",
    "centrum": "centre",
    "15 min": "15 min",
    "Navigovať": "Navigate",
    "Predchádzajúce fotky": "Previous photos",
    "Ďalšie fotky": "Next photos",
    "Mapa Bratislavy s polohou projektov FLORIAN a SKY PARK":
      "Map of Bratislava with the FLORIAN and SKY PARK developments",
    "SKY PARK — otvoriť v Google Maps": "SKY PARK — open in Google Maps",
    "FLORIAN — otvoriť v Google Maps": "FLORIAN — open in Google Maps",
    "Ihrisko": "Playground",
    "Park": "Park",
    "Električka": "Tram",
    "MHD": "Public transport",
    "Nákupy": "Shopping",
    "Divadlo": "Theatre",

    /* sekcia 08 — galéria */
    "Starostlivo navrhnuté interiéry,": "Carefully designed interiors,",
    "ikonické exteriéry a mestský park.": "iconic exteriors and a city park.",
    "Filter projektu": "Development filter",
    "SKY PARK — zeleň v areáli": "SKY PARK — greenery on the grounds",
    "FLORIAN — kuchyňa": "FLORIAN — kitchen",
    "FLORIAN — exteriér": "FLORIAN — exterior",
    "SKY PARK — veža": "SKY PARK — tower",
    "FLORIAN — balkón": "FLORIAN — balcony",
    "SKY PARK — veža z parku": "SKY PARK — tower seen from the park",
    "SKY PARK — balkón": "SKY PARK — balcony",
    "FLORIAN — spálňa": "FLORIAN — bedroom",
    "FLORIAN — terasa": "FLORIAN — terrace",
    "FLORIAN — zeleň": "FLORIAN — greenery",

    /* sekcia 09 — proces */
    "Ako prebieha prenájom": "How renting works",
    "Prenajatie bytu je rýchle a jednoduché. Naši predajcovia vám ochotne so všetkým pomôžu tak, aby ste sa mohli nasťahovať čím skôr, a aby bolo vaše nové bývanie pohodlné a bezproblémové.":
      "Renting an apartment is quick and simple. Our team will gladly help you with everything so that you can move in as soon as possible and your new home is comfortable and hassle-free.",
    "Prvý kontakt": "First contact",
    "Ak vás naša ponuka zaujala, stačí nám napísať prostredníctvom formulára nižšie. Kolegovia sa vám čo najskôr ozvú a dohodnú ďalší postup.":
      "If our offer caught your interest, simply write to us using the form below. Our colleagues will get back to you shortly and agree the next steps.",
    "Obhliadka a výber bytu": "Viewing and choosing an apartment",
    "Všetko začne jej návštevou a obhliadkou bytov, ktoré by vás mohli zaujímať. Naši predajcovia vám byt predstavia a zodpovedajú akékoľvek otázky.":
      "It all starts with a visit and a tour of the apartments that might interest you. Our team will introduce each apartment and answer any questions.",
    "Dohodnutie podmienok": "Agreeing the terms",
    "Po výbere bytu si s naším zástupcom doladíte zmluvné podmienky. Zmluvu s vami prejdeme a všetko vysvetlíme.":
      "Once you have chosen an apartment, you settle the contract terms with our representative. We go through the lease with you and explain everything.",
    "Podpis zmluvy a úhrada": "Signing and payment",
    "Dohodnutú zmluvu podpíšete a uhradíte depozit s prvým nájmom.":
      "You sign the agreed lease and pay the deposit together with the first month's rent.",
    "Odovzdanie bytu": "Handover",
    "Už iba spísať odovzdávací protokol a kľúče od vášho nového mestského bytu sú vaše.":
      "All that is left is the handover protocol — and the keys to your new city apartment are yours.",
    "Doplnkové služby": "Additional services",
    "Ak máte záujem, naši overení partneri sa postarajú o upratovanie, čistiareň alebo ďalšie služby. Stačí nám napísať či zavolať a radi vám pomôžeme.":
      "If you wish, our vetted partners will take care of cleaning, dry cleaning or other services. Just write or call us and we will be happy to help.",
    "Predchádzajúce kroky": "Previous steps",
    "Ďalšie kroky": "Next steps",

    /* sekcia 10 — kontakt */
    "Pripravení na výnimočné bývanie?": "Ready for exceptional living?",
    "Zanechajte nám kontakt a náš tím vám diskrétne pripraví ponuku na mieru":
      "Leave us your contact details and our team will discreetly prepare a tailored offer",
    "Alto Real Estate": "Alto Real Estate",
    "Jurkovičova Tepláreň": "Jurkovičova Tepláreň",
    "Slovenská republika": "Slovak Republic",
    "Meno": "First name",
    "Zadajte meno": "Enter your first name",
    "Vyplňte, prosím, meno": "Please enter your first name",
    "Priezvisko": "Last name",
    "Zadajte priezvisko": "Enter your last name",
    "Vyplňte, prosím, priezvisko": "Please enter your last name",
    "E-mail": "E-mail",
    "Zadajte e-mail": "Enter your e-mail",
    "Zadajte platný e-mail": "Please enter a valid e-mail",
    "Číslo": "Phone",
    "Vyplňte, prosím, telefónne číslo": "Please enter your phone number",
    "Ako ste sa o nás dozvedeli?": "How did you hear about us?",
    "Internet": "Internet",
    "Sociálne siete": "Social media",
    "Odporúčanie": "Referral",
    "Iné": "Other",
    "Vyberte, prosím, možnosť": "Please choose an option",
    "O bývanie v ktorom projekte máte záujem?": "Which development are you interested in?",
    "Napíšte nám správu": "Write us a message",
    "Vaša správa": "Your message",
    "Napíšte, prosím, správu": "Please write a message",
    "Súhlasím so spracovaním osobných údajov": "I consent to the processing of my personal data",
    "Mám záujem": "I'm interested",
    "Ďakujeme! Vaša správa bola odoslaná — ozveme sa čo najskôr.":
      "Thank you! Your message has been sent — we will be in touch shortly.",
    "Správu sa nepodarilo odoslať. Skúste to, prosím, znova alebo nám napíšte na info@altorentalresidences.sk.":
      "The message could not be sent. Please try again or e-mail us at info@altorentalresidences.sk.",
    "Nevypĺňajte": "Do not fill in",

    /* pätička */
    "2026 © ALTO Real Estate. All rights reserved.": "2026 © ALTO Real Estate. All rights reserved.",
    "Nastavenia cookies": "Cookie settings",
    "Zásady spracúvania osobných údajov": "Privacy policy",

    /* cookie lišta + správa súhlasu */
    "Súbory cookies": "Cookies",
    "Nevyhnutné cookies používame vždy. So súhlasom pridáme analytické a reklamné, aby sme web zlepšovali.":
      "We always use necessary cookies. With your consent we add analytics and advertising ones so we can keep improving the site.",
    "Zásady používania cookies": "Cookie policy",
    "Nevyhnutné": "Necessary",
    "Potrebné pre chod webu, nedajú sa vypnúť.": "Required for the site to work, cannot be turned off.",
    "Analytické": "Analytics",
    "Merajú návštevnosť a výkon webu.": "Measure traffic and site performance.",
    "Reklamné": "Advertising",
    "Umožňujú cielenú reklamu a remarketing.": "Enable targeted advertising and remarketing.",
    "Prijať všetko": "Accept all",
    "Uložiť voľby": "Save choices",
    "Nastavenia": "Settings",
    "Odmietnuť": "Reject",

    /* právne podstránky — preložená je len navigačná vrstva,
       záväzné znenie samotných pravidiel ostáva slovenské */
    "Späť na úvod": "Back to home",

    /* 404 — headline je rozdelený <br>, prekladá sa po riadkoch */
    "Ľutujeme, ale na tejto stránke": "Sorry, there's nothing",
    "sa nič nenachádza.": "on this page.",
    "Späť na domovskú stránku": "Back to homepage",
    "Stránka sa nenašla | ALTO Rental Residences": "Page not found | ALTO Rental Residences",
    "Spracovanie osobných údajov": "Personal data processing",
    "Zásady používania súborov cookies": "Cookie policy",
    "Pravidlá spracúvania osobných údajov, ktoré od Vás získavame prostredníctvom tejto webovej stránky, v súlade s nariadením GDPR.":
      "The rules for processing the personal data we collect from you through this website, in line with the GDPR.",
    "Tieto zásady sa vzťahujú na túto webovú stránku prevádzkovanú spoločnosťou Alto Real Estate j. s. a.":
      "This policy applies to this website, operated by Alto Real Estate j. s. a.",

    /* <title> a meta description */
    "ALTO — Bývanie na prenájom v 2 výnimočných projektoch v srdci Bratislavy":
      "ALTO — Homes for rent in 2 exceptional developments in the heart of Bratislava",
    "Prémiové byty na prenájom v projektoch SKY PARK a FLORIAN v Bratislave. Najvyšší štandard, svetová architektúra, bez zbytočných poplatkov.":
      "Premium apartments for rent in the SKY PARK and FLORIAN developments in Bratislava. The highest standard, world-class architecture, no needless fees.",
  };

  /* ---------- reťazce generované v JS ---------- */
  const STR = {
    sk: {
      floorLabel: (n) => `${n}. poschodie`,
      roomsLabel: (r) => (r === 1.5 ? "1,5-izbový" : `${r}-izbový`),
      perMonth: "/ mesiac",
      priceOnRequest: "Cena na vyžiadanie",
      inquiryTag: (id) => `Záujem o byt ${id}`,
      inquiryRemove: "Zrušiť výber bytu",
      availableCount: (n) => (n === 1 ? "1 voľný" : n >= 2 && n <= 4 ? `${n} voľné` : `${n} voľných`),
      interested: "Mám záujem",
      detail: "Detail bytu",
      emptyTitle: "Žiadny byt nezodpovedá filtru",
      emptyText: "Skúste upraviť parametre vyhľadávania.",
      results: (n) => (n === 1 ? "výsledok" : n >= 2 && n <= 4 ? "výsledky" : "výsledkov"),
      photoAlt: (id) => `${id} — interiér`,
      locale: "sk-SK",
      decimal: ",",
      priceRange: (a, b) => `${a.toLocaleString("sk-SK")} – ${b.toLocaleString("sk-SK")} € / mesiac`,
      floorRange: (a, b) => `${a} – ${b}`,
    },
    en: {
      floorLabel: (n) => `Floor ${n}`,
      roomsLabel: (r) => (r === 1.5 ? "1.5-room" : `${r}-room`),
      perMonth: "/ month",
      priceOnRequest: "Price on request",
      inquiryTag: (id) => `Interested in apartment ${id}`,
      inquiryRemove: "Clear selected apartment",
      availableCount: (n) => (n === 1 ? "1 available" : `${n} available`),
      interested: "I'm interested",
      detail: "Apartment detail",
      emptyTitle: "No apartment matches the filter",
      emptyText: "Try adjusting your search parameters.",
      results: (n) => (n === 1 ? "result" : "results"),
      photoAlt: (id) => `${id} — interior`,
      locale: "en-GB",
      decimal: ".",
      priceRange: (a, b) => `${a.toLocaleString("en-GB")} – ${b.toLocaleString("en-GB")} € / month`,
      floorRange: (a, b) => `${a} – ${b}`,
    },
  };

  /* ---------- engine ---------- */
  const TRANSLATABLE_ATTRS = ["placeholder", "aria-label", "alt", "title", "content"];
  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT"]);
  /* pôvodné SK znenie uzlov/atribútov — návrat do SK je vždy z originálu */
  const originals = new WeakMap();

  const norm = (s) => s.replace(/ /g, " ").replace(/\s+/g, " ").trim();

  let current = "sk";

  function translateNode(node, toEn) {
    const raw = node.nodeValue;
    if (!raw || !raw.trim()) return;

    if (!toEn) {
      const orig = originals.get(node);
      if (orig !== undefined) node.nodeValue = orig;
      return;
    }
    const key = norm(raw);
    const en = EN[key];
    if (en === undefined) return;
    if (!originals.has(node)) originals.set(node, raw);
    // zachovaj pôvodné okrajové medzery, aby sa nezlepili susedné inline prvky
    const lead = raw.match(/^\s*/)[0];
    const trail = raw.match(/\s*$/)[0];
    node.nodeValue = lead + en + trail;
  }

  function translateAttrs(el, toEn) {
    for (const attr of TRANSLATABLE_ATTRS) {
      if (!el.hasAttribute(attr)) continue;
      const store = originals.get(el) || {};
      if (!toEn) {
        if (store[attr] !== undefined) el.setAttribute(attr, store[attr]);
        continue;
      }
      const raw = el.getAttribute(attr);
      const en = EN[norm(raw)];
      if (en === undefined) continue;
      if (store[attr] === undefined) {
        store[attr] = raw;
        originals.set(el, store);
      }
      el.setAttribute(attr, en);
    }
  }

  /** Preloží podstrom (default celý dokument) do aktuálneho jazyka. */
  function apply(root) {
    const scope = root || document.body;
    const toEn = current === "en";

    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) =>
        SKIP_TAGS.has(n.parentNode.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
    });
    const texts = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) texts.push(n);
    texts.forEach((n) => translateNode(n, toEn));

    scope.querySelectorAll("*").forEach((el) => translateAttrs(el, toEn));
    if (scope === document.body) {
      const titleNode = document.querySelector("title")?.firstChild;
      if (titleNode) translateNode(titleNode, toEn);
      const desc = document.querySelector('meta[name="description"]');
      if (desc) translateAttrs(desc, toEn);
    }
  }

  /** Reťazec generovaný v JS. */
  function t(key, ...args) {
    const val = STR[current][key];
    return typeof val === "function" ? val(...args) : val;
  }

  function set(lang, opts) {
    if (!SUPPORTED.includes(lang) || lang === current) return false;
    current = lang;
    document.documentElement.lang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }
    apply();
    if (!opts || opts.notify !== false) {
      document.dispatchEvent(new CustomEvent("alto:langchange", { detail: { lang } }));
    }
    return true;
  }

  function stored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  return {
    get lang() { return current; },
    supported: SUPPORTED,
    apply,
    t,
    set,
    stored,
  };
})();
