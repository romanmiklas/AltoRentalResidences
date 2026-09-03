/* ============================================================
   ALTO — Apartment Rental · main.js
   ============================================================ */
(function () {
  "use strict";

  /* ----------------------------------------------------------
     PILOTNÉ DÁTA — 1:1 prevzaté z florian4rent.sk a skypark4rent.sk
     (stav k 12. 8. 2026). Dočasné riešenie, kým nebude k dispozícii
     API Realpadu; potom sa nahradí toto pole feedom.

     price: null = zdrojový web cenu nezverejňuje (rezervované
     a prenajaté byty) → karta zobrazí „Cena na vyžiadanie".
     url = odkaz na detail bytu na webe projektu.
     ---------------------------------------------------------- */
  const FLATS = [
    /* ---------- FLORIAN — florian4rent.sk ---------- */
    { id: "106", project: "florian", rooms: 2,   floor: 1, area: 64.31, price: 1290, status: "volny",       from: "7. 9. 2026",  url: "https://florian4rent.sk/byty/106" },
    { id: "309", project: "florian", rooms: 3,   floor: 3, area: 93.76, price: 1990, status: "volny",       from: "14. 9. 2026", url: "https://florian4rent.sk/byty/309" },
    { id: "308", project: "florian", rooms: 2,   floor: 3, area: 59.83, price: null, status: "rezervovany", url: "https://florian4rent.sk/byty/308" },
    { id: "304", project: "florian", rooms: 1,   floor: 3, area: 33.92, price: null, status: "rezervovany", url: "https://florian4rent.sk/byty/304" },
    { id: "101", project: "florian", rooms: 2,   floor: 1, area: 59.83, price: null, status: "prenajaty",   url: "https://florian4rent.sk/byty/101" },
    { id: "102", project: "florian", rooms: 2,   floor: 1, area: 63.14, price: null, status: "prenajaty",   url: "https://florian4rent.sk/byty/102" },
    { id: "108", project: "florian", rooms: 2,   floor: 1, area: 59.83, price: null, status: "prenajaty",   url: "https://florian4rent.sk/byty/108" },
    { id: "109", project: "florian", rooms: 3,   floor: 1, area: 93.76, price: null, status: "prenajaty",   url: "https://florian4rent.sk/byty/109" },
    { id: "201", project: "florian", rooms: 2,   floor: 2, area: 59.82, price: null, status: "prenajaty",   url: "https://florian4rent.sk/byty/201" },
    { id: "505", project: "florian", rooms: 1.5, floor: 5, area: 39.34, price: null, status: "prenajaty",   url: "https://florian4rent.sk/byty/505" },

    /* ---------- SKY PARK — skypark4rent.sk ---------- */
    { id: "4.182", project: "skypark", rooms: 2, floor: 20, area: 49.30, price: 1470, status: "rezervovany", url: "https://skypark4rent.sk/byty/4.B.20.2" },
    { id: "4.204", project: "skypark", rooms: 2, floor: 22, area: 55.70, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.B.22.4" },
    { id: "4.203", project: "skypark", rooms: 2, floor: 22, area: 55.70, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.B.22.3" },
    { id: "4.047", project: "skypark", rooms: 3, floor: 6,  area: 80.30, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.A.6.7" },
    { id: "4.255", project: "skypark", rooms: 2, floor: 27, area: 41.80, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.P.27.5" },
    { id: "4.227", project: "skypark", rooms: 2, floor: 24, area: 56.70, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.B.24.7" },
    { id: "4.224", project: "skypark", rooms: 2, floor: 24, area: 55.70, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.B.24.4" },
    { id: "4.220", project: "skypark", rooms: 2, floor: 23, area: 54.80, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.C.23.10" },
    { id: "4.180", project: "skypark", rooms: 3, floor: 19, area: 79.30, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.B.19.10" },
    { id: "4.127", project: "skypark", rooms: 3, floor: 14, area: 81.70, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.A.14.7" },
    { id: "4.117", project: "skypark", rooms: 3, floor: 13, area: 81.70, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.A.13.7" },
    { id: "4.107", project: "skypark", rooms: 3, floor: 12, area: 81.10, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.A.12.7" },
    { id: "4.070", project: "skypark", rooms: 3, floor: 8,  area: 79.30, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.A.8.10" },
    { id: "4.060", project: "skypark", rooms: 3, floor: 7,  area: 79.30, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.A.7.10" },
    { id: "4.205", project: "skypark", rooms: 2, floor: 22, area: 49.10, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.B.22.5" },
    { id: "4.202", project: "skypark", rooms: 2, floor: 22, area: 49.10, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.B.22.2" },
    { id: "4.190", project: "skypark", rooms: 3, floor: 20, area: 79.30, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.B.20.10" },
    { id: "4.223", project: "skypark", rooms: 2, floor: 24, area: 55.70, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.B.24.3" },
    { id: "4.193", project: "skypark", rooms: 2, floor: 21, area: 55.90, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.B.21.3" },
    { id: "4.225", project: "skypark", rooms: 2, floor: 24, area: 49.10, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.B.24.5" },
    { id: "4.194", project: "skypark", rooms: 2, floor: 21, area: 55.90, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.B.21.4" },
    { id: "4.253", project: "skypark", rooms: 3, floor: 27, area: 83.00, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.P.27.3" },
    { id: "4.197", project: "skypark", rooms: 2, floor: 21, area: 56.90, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.B.21.7" },
    { id: "4.256", project: "skypark", rooms: 2, floor: 27, area: 43.60, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.P.27.6" },
    { id: "4.037", project: "skypark", rooms: 3, floor: 5,  area: 80.30, price: null, status: "prenajaty",   url: "https://skypark4rent.sk/byty/4.A.5.7" },
  ];

  const PROJECT_LABEL = { skypark: "SKY PARK", florian: "FLORIAN" };
  const PAGE_SIZE = 4;

  /* hranice slidera ceny — musia sedieť s data-min/data-max v index.html */
  const PRICE_MIN = 0;
  const PRICE_MAX = 3000;

  const state = {
    rooms: null,          // null = všetky
    project: "all",
    avail: "all",
    floor: [1, 27],
    price: [PRICE_MIN, PRICE_MAX],
    sort: "price-asc",
    visible: PAGE_SIZE,
  };

  /* ----------------------------------------------------------
     SECTION 4 — render ponuky
     ---------------------------------------------------------- */
  const listingsEl = document.getElementById("listings");
  const countEl = document.getElementById("resultCount");
  const wordEl = document.getElementById("resultWord");
  const loadMoreBtn = document.getElementById("loadMore");

  const i18n = window.ALTO_I18N;
  const t = (key, ...args) => i18n.t(key, ...args);
  /* Karty ponuky sa skladajú cez innerHTML. Dáta sú dnes lokálne, ale
     akonáhle sem príde feed zo správy nehnuteľností, musí byť každá
     interpolovaná hodnota escapovaná — inak je to XSS vektor. */
  const esc = (v) =>
    String(v).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  const fmt = (n) => n.toLocaleString(t("locale"));
  const area = (n) => n.toFixed(2).replace(".", t("decimal"));
  /* Cover fotka bytu. Z Realpadu chodí pole `photos` s trvalými adresami
     na cms.realpad.eu — tie majú prednosť. Pilotné dáta ho nemajú, tam sa
     použije lokálny súbor assets/img/apt/<projekt>-<id>.jpg. */
  const aptImg = (f) =>
    Array.isArray(f.photos) && f.photos.length
      ? f.photos[0]
      : `assets/img/apt/${f.project}-${f.id}.jpg`;

  /* Byty bez zverejnenej ceny (rezervované/prenajaté) prejdú cenovým
     filtrom len dovtedy, kým je rozsah nedotknutý — akonáhle používateľ
     rozsah zúži, nevieme o nich rozhodnúť, tak ich nezobrazujeme. */
  const priceMatches = (f) => {
    const full = state.price[0] === PRICE_MIN && state.price[1] === PRICE_MAX;
    if (f.price == null) return full;
    return f.price >= state.price[0] && f.price <= state.price[1];
  };

  /* neznáma cena ide pri triedení podľa ceny vždy na koniec */
  const byPrice = (dir) => (a, b) => {
    if (a.price == null && b.price == null) return 0;
    if (a.price == null) return 1;
    if (b.price == null) return -1;
    return dir * (a.price - b.price);
  };

  function filtered() {
    const list = FLATS.filter((f) =>
      (state.rooms === null || f.rooms === state.rooms) &&
      (state.project === "all" || f.project === state.project) &&
      (state.avail === "all" || f.status === state.avail) &&
      f.floor >= state.floor[0] && f.floor <= state.floor[1] &&
      priceMatches(f)
    );
    const sorters = {
      "price-asc": byPrice(1),
      "price-desc": byPrice(-1),
      "area-desc": (a, b) => b.area - a.area,
    };
    return list.sort(sorters[state.sort]);
  }

  function cardHTML(f) {
    return `
    <article class="listing" data-reveal>
      <a class="listing__photo" href="${esc(f.url)}" target="_blank" rel="noopener">
        <img class="listing__img" src="${esc(aptImg(f))}" alt="${esc(t("photoAlt", f.id))}"
             loading="lazy" decoding="async">
        <div class="listing__fade"></div>
        <span class="chip chip--dark listing__project">${esc(PROJECT_LABEL[f.project] || "")}</span>
      </a>
      <div class="listing__body">
        <div class="listing__row">
          <span class="listing__id">${esc(f.id)}</span>
          <div class="listing__tags">
            <span class="data-tag"><img src="assets/icons/tag-floor.svg" alt="">${esc(t("floorLabel", f.floor))}</span>
            <span class="data-tag"><img src="assets/icons/tag-rooms.svg" alt="">${esc(t("roomsLabel", f.rooms))}</span>
            <span class="data-tag"><img src="assets/icons/tag-area.svg" alt="">${esc(area(f.area))} m²</span>
          </div>
        </div>
        <div class="listing__divider"></div>
        <div class="listing__price-row">
          <div class="listing__price-col">
            ${f.price == null
              ? `<div class="listing__price listing__price--ask"><b>${esc(t("priceOnRequest"))}</b></div>`
              : `<div class="listing__price"><b>${esc(fmt(f.price))} €</b><span>${esc(t("perMonth"))}</span></div>
                 <div class="listing__sqm">${Math.round(f.price / f.area)} €/m²</div>`}
          </div>
          <div class="listing__buttons">
            <a class="btn btn--olive btn--lg" href="#kontakt" data-inquiry="${esc(f.id)}"
               data-inquiry-project="${esc(f.project)}">${esc(t("interested"))}</a>
            <a class="btn btn--outline btn--lg" href="${esc(f.url)}"
               target="_blank" rel="noopener">${esc(t("detail"))}</a>
          </div>
        </div>
      </div>
    </article>`;
  }

  /* Sekcia ponuky existuje len na homepage — podstránky (zásady, cookies)
     zdieľajú rovnaký main.js kvôli hlavičke, menu a jazyku. */
  const hasOffer = !!(listingsEl && countEl && wordEl && loadMoreBtn);

  /* `keep` = počet kariet, ktoré už boli vykreslené a nemajú sa znova
     animovať (používa to len „Načítať ďalšie" a prepnutie jazyka). */
  function render(keep) {
    if (!hasOffer) return;
    const list = filtered();
    countEl.textContent = fmt(list.length);
    wordEl.textContent = t("results", list.length);

    if (!list.length) {
      listingsEl.innerHTML = `
        <div class="listings__empty">
          <h3>${esc(t("emptyTitle"))}</h3>
          <p>${esc(t("emptyText"))}</p>
        </div>`;
    } else {
      listingsEl.innerHTML = list.slice(0, state.visible).map(cardHTML).join("");
    }
    loadMoreBtn.classList.toggle("is-hidden", state.visible >= list.length);
    window.ALTO_MOTION?.replay(listingsEl, keep);
  }

  loadMoreBtn?.addEventListener("click", () => {
    const shown = state.visible;
    state.visible += PAGE_SIZE;
    render(shown);            // nabehnú len novo pridané karty
  });

  /* ---------- segmentové selektory ---------- */
  document.querySelectorAll(".selector").forEach((sel) => {
    const key = sel.dataset.filter;
    sel.querySelectorAll(".selector__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        sel.querySelectorAll(".selector__btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const val = btn.dataset.val;
        state[key] = key === "rooms" ? (val === "all" ? null : parseFloat(val)) : val;
        state.visible = PAGE_SIZE;
        render();
      });
    });
  });

  /** Nastaví projekt vo filtri (používajú hero karty) */
  function setProjectFilter(project) {
    const sel = document.querySelector('.selector[data-filter="project"]');
    sel.querySelectorAll(".selector__btn").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.val === project)
    );
    state.project = project;
    state.visible = PAGE_SIZE;
    render();
  }

  /* ---------- dual range slidery ---------- */
  function initRange(el, onChange, format) {
    const minInput = el.querySelector(".range__input--min");
    const maxInput = el.querySelector(".range__input--max");
    const fill = el.querySelector(".range__fill");
    const min = parseFloat(el.dataset.min);
    const max = parseFloat(el.dataset.max);

    function update(fromInput) {
      let lo = parseFloat(minInput.value);
      let hi = parseFloat(maxInput.value);
      if (lo > hi) {
        if (fromInput === minInput) { hi = lo; maxInput.value = hi; }
        else { lo = hi; minInput.value = lo; }
      }
      const loPct = ((lo - min) / (max - min)) * 100;
      const hiPct = ((hi - min) / (max - min)) * 100;
      fill.style.left = loPct + "%";
      fill.style.right = (100 - hiPct) + "%";
      onChange(lo, hi);
      format(lo, hi);
    }
    [minInput, maxInput].forEach((inp) =>
      inp.addEventListener("input", () => update(inp))
    );
    update(minInput);
  }

  const floorValue = document.getElementById("floorValue");
  const priceValue = document.getElementById("priceValue");
  /* posledné hodnoty sliderov — po zmene jazyka sa popisky preformátujú */
  const rangeLabels = [];
  const paintRangeLabels = () => rangeLabels.forEach((fn) => fn());

  if (hasOffer) {
    initRange(
      document.getElementById("rangeFloor"),
      (lo, hi) => { state.floor = [lo, hi]; state.visible = PAGE_SIZE; render(); },
      (lo, hi) => {
        const paint = () => { floorValue.textContent = t("floorRange", lo, hi); };
        rangeLabels[0] = paint; paint();
      }
    );

    initRange(
      document.getElementById("rangePrice"),
      (lo, hi) => { state.price = [lo, hi]; state.visible = PAGE_SIZE; render(); },
      (lo, hi) => {
        const paint = () => { priceValue.textContent = t("priceRange", lo, hi); };
        rangeLabels[1] = paint; paint();
      }
    );

    /* ---------- zoradenie ---------- */
    document.getElementById("sortSelect").addEventListener("change", (e) => {
      state.sort = e.target.value;
      render();
    });
  }

  /* ----------------------------------------------------------
     ŠTÍTOK VYBRANÉHO BYTU v kontaktnom formulári
     „Mám záujem" na karte bytu doplní nad správu štítok s ID bytu
     a prednastaví projekt; krížik ho zruší.
     ---------------------------------------------------------- */
  const inquiryTag = document.getElementById("inquiryTag");
  const inquiryTagLabel = document.getElementById("inquiryTagLabel");
  const apartmentInput = document.getElementById("cApartment");

  function setInquiry(id, project) {
    if (!inquiryTag || !apartmentInput) return;
    apartmentInput.value = id || "";
    if (!id) {
      inquiryTag.hidden = true;
      inquiryTagLabel.textContent = "";
      return;
    }
    inquiryTagLabel.textContent = t("inquiryTag", id);
    inquiryTag.hidden = false;
    /* prednastav aj prepínač projektu vo formulári */
    if (project) {
      document.querySelectorAll(".pill-selector__btn").forEach((b) => {
        const on = (b.dataset.projectChoice || "") === project;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-checked", String(on));
        if (on) {
          const hidden = document.getElementById("cProject");
          if (hidden) hidden.value = project;
        }
      });
    }
  }

  /* delegovane — karty ponuky sa prekresľujú */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-inquiry]");
    if (!btn) return;
    setInquiry(btn.dataset.inquiry, btn.dataset.inquiryProject);
    /* natívny skok na #kontakt prebehne po nastavení štítka */
  });

  document.getElementById("inquiryTagClear")?.addEventListener("click", () => setInquiry(null));

  /* po zmene jazyka prelož aj text štítka */
  document.addEventListener("alto:langchange", () => {
    if (apartmentInput?.value) inquiryTagLabel.textContent = t("inquiryTag", apartmentInput.value);
    const clear = document.getElementById("inquiryTagClear");
    if (clear) clear.setAttribute("aria-label", t("inquiryRemove"));
  });

  /* ----------------------------------------------------------
     SEKCIA 02 — tlačidlá na kartách projektov
     „Zobraziť ponuku" prednastaví filter projektu a skočí na ponuku.
     ---------------------------------------------------------- */
  document.querySelectorAll("[data-project-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setProjectFilter(btn.dataset.projectFilter);
      document.getElementById("ponuka")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* počet voľných bytov na kartách projektov sa dopočíta z dát,
     aby po napojení na Realpad nemusel nikto prepisovať HTML */
  function paintProjectCounts() {
    document.querySelectorAll("[data-count]").forEach((el) => {
      const n = FLATS.filter((f) => f.project === el.dataset.count && f.status === "volny").length;
      el.textContent = t("availableCount", n);
    });
  }
  paintProjectCounts();
  document.addEventListener("alto:langchange", paintProjectCounts);

  /* ----------------------------------------------------------
     JAZYK — prepínač v navpille (SK/EN) a v mobilnom menu
     Tlačidlo v navpille ukazuje AKTUÁLNY jazyk stránky.
     ---------------------------------------------------------- */
  const navLangBtn = document.getElementById("navLang");
  const navLangLabel = document.getElementById("navLangLabel");
  const langButtons = [...document.querySelectorAll(".mmenu__lang-btn[data-lang]")];

  function syncLangUI() {
    const lang = i18n.lang;
    if (navLangLabel) navLangLabel.textContent = lang.toUpperCase();
    langButtons.forEach((b) => {
      const on = b.dataset.lang === lang;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-checked", String(on));
    });
  }

  /* jediné miesto, kde sa po zmene jazyka prekresľuje dynamický obsah */
  document.addEventListener("alto:langchange", () => {
    syncLangUI();
    paintRangeLabels();
    render(state.visible);    // preklad nie je dôvod prehrať animáciu znova
  });

  navLangBtn?.addEventListener("click", () => {
    i18n.set(i18n.lang === "sk" ? "en" : "sk");
  });
  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => i18n.set(btn.dataset.lang));
  });


  /* ----------------------------------------------------------
     SECTION 3 — hover na typ bytu zobrazí fotky po stranách
     ---------------------------------------------------------- */
  /* Fotky 1:1 podľa Figmy (Section-3-list, 4:305) — [ľavá, pravá].
     Každý typ má dve vlastné fotky: -a = image 01 (vľavo),
     -b = image 02 (vpravo). */
  const S2_IMAGES = {
    "1":   ["assets/img/apt-1-a.jpg",  "assets/img/apt-1-b.jpg"],
    "1.5": ["assets/img/apt-15-a.jpg", "assets/img/apt-15-b.jpg"],
    "2":   ["assets/img/apt-2-a.jpg",  "assets/img/apt-2-b.jpg"],
    "3":   ["assets/img/apt-3-a.jpg",  "assets/img/apt-3-b.jpg"],
  };

  const s2 = document.getElementById("typy");
  if (s2) {
    const photoLeft = s2.querySelector(".s2__photo--left");
    const photoRight = s2.querySelector(".s2__photo--right");

    function crossfade(photoEl, src) {
      const imgs = photoEl.querySelectorAll(".s2__img");
      const current = photoEl.querySelector(".s2__img.is-active");
      const next = imgs[0] === current ? imgs[1] : imgs[0];
      if (current.getAttribute("src") === src) return;
      next.src = src;
      next.classList.add("is-active");
      current.classList.remove("is-active");
    }

    /* Na mobile aj tablete je zo sekcie akordeón: jedna položka = jeden
       nadpis a pod ním jeden obrázok. Na desktope ostáva hover správanie.
       Breakpoint 1024px musí sedieť s "kompaktným" blokom v main.css. */
    const isMobile = () => window.matchMedia("(max-width: 1024px)").matches;
    const items = [...s2.querySelectorAll(".s2__item")];

    /* Výšku panela rieši CSS (grid-template-rows), JS iba prepína triedu. */
    function setPanel(item, open) {
      const panel = document.getElementById(item.getAttribute("aria-controls"));
      if (!panel) return;
      item.setAttribute("aria-expanded", open ? "true" : "false");
      panel.classList.toggle("is-open", open);
    }

    function activate(item) {
      const v = item.dataset.variant;
      s2.dataset.variant = v;
      items.forEach((i) => i.classList.toggle("is-active", i === item));
      crossfade(photoLeft, S2_IMAGES[v][0]);
      crossfade(photoRight, S2_IMAGES[v][1]);
      if (isMobile()) items.forEach((i) => setPanel(i, i === item));
    }

    items.forEach((item) => {
      const hoverActivate = () => {
        if (isMobile()) return;
        if (s2.dataset.variant === item.dataset.variant) return;
        activate(item);
      };
      item.addEventListener("mouseenter", hoverActivate);
      item.addEventListener("focus", hoverActivate);

      item.addEventListener("click", () => {
        // mobil: klik len prepína akordeón
        if (isMobile()) {
          const open = item.getAttribute("aria-expanded") === "true";
          if (open) { setPanel(item, false); return; }
          activate(item);
          return;
        }
        // desktop: klik = filter podľa izbovosti + scroll na ponuku
        const roomsSel = document.querySelector('.selector[data-filter="rooms"]');
        roomsSel.querySelectorAll(".selector__btn").forEach((b) =>
          b.classList.toggle("is-active", b.dataset.val === item.dataset.variant)
        );
        state.rooms = parseFloat(item.dataset.variant);
        state.visible = PAGE_SIZE;
        render();
        document.getElementById("ponuka").scrollIntoView({ behavior: "smooth" });
      });
    });

    // počiatočný stav + prepnutie medzi mobilom a desktopom
    let wasMobile = null;
    const syncS2 = () => {
      const m = isMobile();
      if (m === wasMobile) return;
      wasMobile = m;
      const active = items.find((i) => i.classList.contains("is-active")) || items[0];
      items.forEach((i) => {
        const panel = document.getElementById(i.getAttribute("aria-controls"));
        if (!panel) return;
        // pri prepnutí do/z kompaktu doraz na správny stav bez animácie
        panel.style.transition = "none";
        setPanel(i, m && i === active);
        requestAnimationFrame(() => { panel.style.transition = ""; });
      });
    };
    window.addEventListener("resize", syncS2, { passive: true });
    syncS2();

    // prednačítanie fotiek, aby crossfade nebol trhaný
    Object.values(S2_IMAGES).flat().forEach((src) => { new Image().src = src; });
  }

  /* ----------------------------------------------------------
     SECTION 5 — scroll-stack (à la effectdigital.com)
     Každý sticky slide sa mierne scale-downne a fade keď ho
     ďalší (natural document flow) začne prekrývať zdola.
     ---------------------------------------------------------- */
  const s5 = document.getElementById("amenities");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (s5 && !reduceMotion) {
    const slides = [...s5.querySelectorAll(".s5__slide")];
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

    /* Vzdialenosť textového bloku (.s5__bottom) od vrchu karty. Text leží
       pri spodnej hrane, takže ho nabiehajúci slide zakrýva ako prvý —
       podľa toho vieme, odkedy sa smie rozmazávať. Počítame cez offsetTop,
       lebo getBoundingClientRect by vrátil rozmery už zmenšené scale-om.
       Mení sa len pri zmene rozmerov okna, preto to držíme v cache. */
    let textOffsets = [];
    const measure = () => {
      textOffsets = slides.map((slide) => {
        let el = slide.querySelector(".s5__bottom");
        let y = 0;
        while (el && el !== slide) { y += el.offsetTop; el = el.offsetParent; }
        return y;
      });
    };

    function paint() {
      const vh = window.innerHeight;
      slides.forEach((slide, i) => {
        const next = slides[i + 1];
        if (!next) {
          slide.style.transform = "";
          slide.style.opacity = "";
          slide.style.filter = "";
          return;
        }
        // progress: 0 = ďalší slide ešte nie je vidno (top >= vh)
        //           1 = ďalší slide je celý na obrazovke (top = 16 = sticky pozícia)
        const nextTop = next.getBoundingClientRect().top;
        const stickyTop = 16;
        const distance = vh - stickyTop;                    // rozsah scrollu na prekrytie
        const progress = clamp(1 - (nextTop - stickyTop) / distance, 0, 1);

        // scale 1 → 0.94, opacity 1 → 0.55
        const scale = 1 - progress * 0.06;
        const opacity = 1 - progress * 0.45;

        /* Blur nesmie nabehnúť, kým sa text dá čítať. Spustí sa až vo
           chvíli, keď ďalší slide dosiahne horný okraj textového bloku —
           teda keď je text už aj tak prekrytý. Prah sa počíta z geometrie,
           takže sedí pri každej výške okna (pri 900 px vychádza ~0.48).
           Umocnenie na druhú dá ease-in, aby nebolo vidno moment zapnutia. */
        const blurStart = clamp(1 - (textOffsets[i] || 0) / distance, 0.35, 0.85);
        const bp = clamp((progress - blurStart) / (1 - blurStart), 0, 1);
        const blur = bp * bp * 4;
        slide.style.transform = `scale(${scale.toFixed(4)})`;
        slide.style.opacity = opacity.toFixed(3);
        slide.style.filter = `blur(${blur.toFixed(2)}px)`;
      });
    }

    /* paint() číta getBoundingClientRect a hneď zapisuje štýly, takže sa
       musí spúšťať najviac raz za frame — inak si prehliadač pri každej
       scroll udalosti vynúti layout. Navyše beží len vtedy, keď je sekcia
       blízko viewportu. */
    let scheduled = false;
    const requestPaint = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; paint(); });
    };

    /* pri zmene rozmerov sa musí prepočítať aj poloha textu */
    const onResize = () => { measure(); requestPaint(); };

    let listening = false;
    const listen = (on) => {
      if (on === listening) return;
      listening = on;
      const fn = on ? window.addEventListener : window.removeEventListener;
      fn.call(window, "scroll", requestPaint, { passive: true });
      fn.call(window, "resize", onResize, { passive: true });
    };

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry]) => { listen(entry.isIntersecting); requestPaint(); },
        { rootMargin: "100% 0px" }
      ).observe(s5);
    } else {
      listen(true);
    }
    measure();
    paint();
  }

  /* ----------------------------------------------------------
     SECTION 6 — LOKALITA: statická mapa (žiadne scroll efekty).
     Body pulzujú cez CSS animáciu, karty sú natívne anchor linky.
     ---------------------------------------------------------- */

  /* ----------------------------------------------------------
     00 HEADER — nav pill s dropdownom projektov (v03)
     ---------------------------------------------------------- */
  const nav = document.getElementById("nav");
  if (nav) {
    const projectsBtn = document.getElementById("navProjects");
    let closeTimer;

    const setOpen = (open) => {
      clearTimeout(closeTimer);
      nav.classList.toggle("is-open", open);
      projectsBtn.setAttribute("aria-expanded", String(open));
    };
    const scheduleClose = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => setOpen(false), 180);
    };

    // hover: otvorí sa nad "Projekty", drží sa nad celým pill-om
    projectsBtn.addEventListener("mouseenter", () => setOpen(true));
    nav.addEventListener("mouseleave", scheduleClose);
    nav.addEventListener("mouseenter", () => clearTimeout(closeTimer));
    // klávesnica + dotyk
    projectsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(!nav.classList.contains("is-open"));
    });
    projectsBtn.addEventListener("focus", () => setOpen(true));
    nav.addEventListener("focusout", (e) => {
      if (!nav.contains(e.relatedTarget)) setOpen(false);
    });
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });

    // klik na projekt v dropdowne skroluje na sekciu 02 (karty projektov)
    nav.querySelectorAll(".nav-offer").forEach((offer) => {
      offer.addEventListener("click", () => setOpen(false));
    });
  }

  /* ----------------------------------------------------------
     00 HEADER — mobilné fullscreen menu
     Rozbaľuje sa zhora nadol (clip-path) rovnako ako dropdown
     navpillu na desktope.
     ---------------------------------------------------------- */
  const burger = document.getElementById("navBurger");
  const mmenu = document.getElementById("mobileMenu");
  if (burger && mmenu) {
    let hideTimer = null;

    const pill = mmenu.querySelector(".mmenu__pill");
    const navPill = document.getElementById("nav");

    /* Štartovná (a koncová) geometria = presná pozícia navpillu,
       prepočítaná do súradníc paddingu .mmenu, aby sa kontajner
       roztiahol priamo z neho a nepôsobil ako vrstva navrchu. */
    const syncStart = () => {
      const n = navPill.getBoundingClientRect();
      const box = mmenu.getBoundingClientRect();   // .mmenu je fixed inset:0
      pill.style.setProperty("--nx", (n.left - box.left) + "px");
      pill.style.setProperty("--ny", (n.top - box.top) + "px");
      pill.style.setProperty("--nw", n.width + "px");
      pill.style.setProperty("--nh", n.height + "px");
    };

    const openMenu = () => {
      clearTimeout(hideTimer);
      mmenu.hidden = false;
      syncStart();
      burger.setAttribute("aria-expanded", "true");
      // dva framy, aby prehliadač stihol zaregistrovať štartovnú geometriu
      requestAnimationFrame(() => requestAnimationFrame(() => {
        document.body.classList.add("is-menu-open");
        mmenu.classList.add("is-open");
        document.getElementById("mmenuClose")?.focus();
      }));
    };
    const closeMenu = () => {
      if (mmenu.hidden) return;
      syncStart();                       // navpill sa mohol medzitým posunúť
      mmenu.classList.remove("is-open");
      document.body.classList.remove("is-menu-open");
      burger.setAttribute("aria-expanded", "false");
      hideTimer = setTimeout(() => { mmenu.hidden = true; }, 550);
    };

    /* Fullscreen menu patrí len kompaktnému rozloženiu. Na desktope ten istý
       burger iba rozbaľuje navpill — to rieši blok 00 HEADER nižšie. */
    burger.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 1024px)").matches) openMenu();
    });
    document.getElementById("mmenuClose")?.addEventListener("click", closeMenu);
    mmenu.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener("click", closeMenu));

    /* fullscreen overlay je dialóg — fokus musí ostať v ňom a po zavretí
       sa vrátiť na tlačidlo, ktoré ho otvorilo */
    const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
    document.addEventListener("keydown", (e) => {
      if (mmenu.hidden) return;
      if (e.key === "Escape") { closeMenu(); burger.focus(); return; }
      if (e.key !== "Tab") return;
      const items = [...mmenu.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    // pri prechode na desktop (nad kompaktný breakpoint) menu zavri
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 1025px)").matches) closeMenu();
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     00 HEADER — stav "prilepený" po opustení hero sekcie
     ---------------------------------------------------------- */
  const headerEl = document.getElementById("header");
  const heroEl = document.getElementById("hero");
  if (headerEl && heroEl) {
    /* Zbalený navpill: po opustení hero ostane len ikona menu + CTA.
       navManualOpen drží ručné rozbalenie, aby ho scroll hneď nezavrel. */
    const isDesktop = () => window.matchMedia("(min-width: 1025px)").matches;
    let navManualOpen = false;

    const syncHeader = () => {
      // 104px -> 88px hneď po prvom scrollnutí
      headerEl.classList.toggle("is-compact", window.scrollY > 8);
      // tmavý scrim / svetlé logo len kým je hero na obrazovke
      const past = heroEl.getBoundingClientRect().bottom <= 88;
      headerEl.classList.toggle("is-stuck", past);

      // späť v hero => ručné rozbalenie zabudneme, pill je aj tak plný
      if (!past) navManualOpen = false;
      const collapsed = past && isDesktop() && !navManualOpen;
      headerEl.classList.toggle("is-collapsed", collapsed);
      navBurger?.setAttribute("aria-expanded", String(!collapsed));
      /* Zbalená skupina má nulovú šírku, ale odkazy v nej by sa inak dali
         vytabovať naslepo — inert ich vyradí z fokusu aj z čítačiek. */
      navItems?.toggleAttribute("inert", collapsed);
    };

    /* Prechod šírky potrebuje konkrétnu hodnotu — auto sa nedá animovať.
       Meriame prirodzenú šírku obsahu (drží ju width:max-content) a po
       zmene okna či jazyka ju prepočítame. */
    const navItems = document.querySelector(".nav__items");
    const navItemsInner = document.querySelector(".nav__items-inner");
    const measureNav = () => {
      if (!navItems || !navItemsInner) return;
      navItems.style.setProperty(
        "--nav-items-w", navItemsInner.getBoundingClientRect().width + "px"
      );
    };
    measureNav();
    window.addEventListener("resize", measureNav, { passive: true });
    document.addEventListener("alto:langchange", measureNav);

    const navBurger = document.getElementById("navBurger");
    if (navBurger) {
      navBurger.addEventListener("click", () => {
        if (!isDesktop()) return;          // mobil rieši fullscreen menu
        navManualOpen = !navManualOpen;
        syncHeader();
      });
      /* po výbere položky alebo kliknutí mimo sa pill zase zbalí */
      document.getElementById("nav")?.querySelectorAll(".nav__link").forEach((a) =>
        a.addEventListener("click", () => { navManualOpen = false; syncHeader(); })
      );
      document.addEventListener("click", (e) => {
        if (!navManualOpen || !isDesktop()) return;
        if (e.target.closest("#nav")) return;
        navManualOpen = false;
        syncHeader();
      });
    }
    /* rovnako ako pri scroll-stacku: číta layout, takže max. raz za frame */
    let headerTick = false;
    const requestHeaderSync = () => {
      if (headerTick) return;
      headerTick = true;
      requestAnimationFrame(() => { headerTick = false; syncHeader(); });
    };
    window.addEventListener("scroll", requestHeaderSync, { passive: true });
    window.addEventListener("resize", requestHeaderSync, { passive: true });
    syncHeader();
  }

  /* ----------------------------------------------------------
     01 HERO — striedanie dvoch videí s crossfadom
     ---------------------------------------------------------- */
  const heroVideos = [...document.querySelectorAll(".hero__video")];
  if (heroVideos.length > 1) {
    /* Videá sú rádovo v megabajtoch, preto sa ďalšie v poradí sťahuje až
       potom, čo je prvé prehraté — pri načítaní stránky ide po drôte len jedno. */
    const ensureSrc = (vid) => {
      if (!vid.src && vid.dataset.src) {
        vid.src = vid.dataset.src;
        vid.load();
      }
    };
    heroVideos.forEach((vid, i) => {
      const next = heroVideos[(i + 1) % heroVideos.length];
      /* ďalšie video sa začne sťahovať až v poslednej štvrtine toho
         aktuálneho — dovtedy nesúperí o pásmo s obrázkami a fontmi */
      vid.addEventListener("timeupdate", function warm() {
        if (!vid.duration || vid.currentTime < vid.duration * 0.75) return;
        vid.removeEventListener("timeupdate", warm);
        ensureSrc(next);
      });
      vid.addEventListener("ended", () => {
        ensureSrc(next);
        next.currentTime = 0;
        next.play().catch(() => {});
        next.classList.add("is-active");
        vid.classList.remove("is-active");
      });
    });
  } else if (heroVideos.length === 1) {
    heroVideos[0].loop = true;
  }

  /* ----------------------------------------------------------
     KARUSELY — galéria + kroky prenájmu (v02)

     Posun rieši jedna funkcia, aby drag aj šípky dojazdovali rovnako.
     glide() nepoužíva scrollBehavior:"smooth" (krivku určuje prehliadač
     a mení sa s dĺžkou cesty), ale vlastný rAF s krivkou webu.
     ---------------------------------------------------------- */
  const EASE_OUT = (t) => 1 - Math.pow(1 - t, 3);        // cubic-out, ako --ease-soft

  /* Dojazd podľa rýchlosti gesta — exponenciálny útlm, rovnako ako
     zotrvačnosť natívneho scrollu. v je v px/s. */
  const project = (v, deceleration = 0.998) =>
    (v / 1000) * deceleration / (1 - deceleration);

  /* Plynulý posun na cieľ; vráti funkciu na prerušenie, aby sa dal
     dojazd kedykoľvek chytiť a prekryť novým gestom. */
  function glide(el, to, duration = 420) {
    const from = el.scrollLeft;
    const dist = to - from;
    if (Math.abs(dist) < 1) return () => {};
    let raf = 0, cancelled = false;
    const t0 = performance.now();
    const step = (now) => {
      if (cancelled) return;
      const t = Math.min(1, (now - t0) / duration);
      el.scrollLeft = from + dist * EASE_OUT(t);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }

  /* Najbližší začiatok karty k danej pozícii — cieľ sa vyberá až
     z premietnutého bodu, takže švihnutie hodí pásom ďalej. */
  function snapPoint(track, x) {
    const cards = [...track.children].filter((el) => el.getBoundingClientRect().width > 1);
    if (!cards.length) return x;
    const base = track.scrollLeft;
    let best = x, bestD = Infinity;
    for (const card of cards) {
      const left = base + card.getBoundingClientRect().left
                 - track.getBoundingClientRect().left;
      const d = Math.abs(left - x);
      if (d < bestD) { bestD = d; best = left; }
    }
    return Math.max(0, Math.min(best, track.scrollWidth - track.clientWidth));
  }


  document.querySelectorAll("[data-carousel-prev],[data-carousel-next]").forEach((btn) => {
    const trackId = btn.dataset.carouselPrev || btn.dataset.carouselNext;
    const track = document.getElementById(trackId);
    if (!track) return;
    const dir = btn.dataset.carouselNext ? 1 : -1;
    btn.addEventListener("click", () => {
      /* Krok = šírka prvej VIDITEĽNEJ karty. V galérii môže byť prvá karta
         odfiltrovaná (.is-hidden má nulovú šírku) a posun by bol nezmyselne
         malý — preto hľadáme prvú, ktorá reálne niečo zaberá. */
      const card = [...track.children].find(
        (el) => el.getBoundingClientRect().width > 1
      );
      const gap = parseFloat(getComputedStyle(track).gap) || 24;
      const step = card ? card.getBoundingClientRect().width + gap : 460;
      const max = track.scrollWidth - track.clientWidth;
      const to = Math.max(0, Math.min(track.scrollLeft + dir * step, max));
      track.__stopGlide?.();                       // prerušiteľné pri rýchlom klikaní
      track.__stopGlide = glide(track, to);
    });
  });

  /* Pointer-drag pre horizontal scroll karusely (galéria + kroky prenájmu).
     Klik na obrázok stále funguje — dragging sa aktivuje až po posune > 5px. */
  document.querySelectorAll(".gal__track, .steps__track").forEach((track) => {
    let startX = 0, startScroll = 0, isDown = false, moved = 0, pointerId = null;
    /* posledné vzorky pohybu — z nich sa pri pustení počíta rýchlosť */
    let samples = [];

    /* Natívny HTML5 drag obrázkov by inak zožral pointermove a drag by "odumrel". */
    track.addEventListener("dragstart", (e) => e.preventDefault());

    const onDown = (e) => {
      // ignoruj pravý klik / stred; dotyk necháme natívnemu scrollu
      if (e.pointerType === "touch") return;
      if (e.button !== undefined && e.button !== 0) return;
      isDown = true; moved = 0;
      track.__stopGlide?.();               // chytenie počas dojazdu ho preruší
      samples = [{ x: e.clientX, t: performance.now() }];
      startX = e.clientX;
      startScroll = track.scrollLeft;
      pointerId = e.pointerId;
      /* Snap aj smooth musia ísť preč hneď — inak každý frame dragu odsnapuje
         scrollLeft späť na najbližšiu kartu a slider sa nepohne. */
      track.style.scrollSnapType = "none";
      track.style.scrollBehavior = "auto";
      try { track.setPointerCapture?.(pointerId); } catch { /* pointer už neexistuje */ }
    };
    const onMove = (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      moved = Math.abs(dx);
      if (moved > 3) track.classList.add("is-dragging");
      track.scrollLeft = startScroll - dx;
      /* stačí krátke okno (~80 ms) — dlhšia história rozmaže švihnutie */
      const now = performance.now();
      samples.push({ x: e.clientX, t: now });
      while (samples.length > 2 && now - samples[0].t > 80) samples.shift();
    };
    const onUp = () => {
      if (!isDown) return;
      isDown = false;
      if (pointerId != null) {
        try { track.releasePointerCapture?.(pointerId); } catch { /* už uvoľnené */ }
      }
      pointerId = null;
      // ak sa reálne draglo, potlač následný click na figure/img
      if (moved > 5) {
        const suppress = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
        track.addEventListener("click", suppress, { capture: true, once: true });
      }
      /* Dojazd: z posledných vzoriek zistíme rýchlosť, premietneme,
         kam by pás doletel, a až z toho bodu vyberieme najbližšiu kartu.
         Bez toho sa pás pri pustení zastaví na mieste (natívny dotykový
         scroll zotrvačnosť má, ťahanie myšou nie). */
      const last = samples[samples.length - 1];
      const first = samples[0];
      const dt = last && first ? last.t - first.t : 0;
      const velocity = dt > 0 ? ((first.x - last.x) / dt) * 1000 : 0;   // px/s
      samples = [];

      const max = track.scrollWidth - track.clientWidth;
      const projected = track.scrollLeft + project(velocity);
      const target = Math.max(0, Math.min(snapPoint(track, projected), max));
      /* trvanie podľa dĺžky dojazdu, nech krátky posun netrvá rovnako ako dlhý */
      const dur = Math.min(700, Math.max(260, Math.abs(target - track.scrollLeft) * 0.9));

      requestAnimationFrame(() => {
        track.classList.remove("is-dragging");
        track.style.scrollSnapType = "";
        track.style.scrollBehavior = "";
        if (Math.abs(velocity) > 40 || Math.abs(target - track.scrollLeft) > 4) {
          track.__stopGlide = glide(track, target, dur);
        }
      });
    };
    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointercancel", onUp);
    track.addEventListener("pointerleave", onUp);
  });

  /* ----------------------------------------------------------
     SECTION 10 — KONTAKT (v02)
     ---------------------------------------------------------- */
  /* Segmentové prepínače: kontakt (výber projektu) + galéria (filter fotiek).
     Obe skupiny majú vlastné triedy, preto ich hľadáme naraz. */
  document.querySelectorAll(".pill-selector, .gal__selector, .mmenu__lang").forEach((sel) => {
    const btnSelector = ".pill-selector__btn, .gal__btn, .mmenu__lang-btn";
    sel.querySelectorAll(btnSelector).forEach((btn) => {
      btn.addEventListener("click", () => {
        sel.querySelectorAll(btnSelector).forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-checked", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-checked", "true");
        // Kontakt: zapíš do skrytého inputu
        if (btn.dataset.projectChoice) {
          const hidden = document.getElementById("cProject");
          if (hidden) hidden.value = btn.dataset.projectChoice;
        }
        // Galéria: filter fotiek podľa tagu projektu
        if (btn.dataset.galFilter) {
          const filter = btn.dataset.galFilter;
          document.querySelectorAll(".gal__card").forEach((card) => {
            const match = filter === "all" || card.dataset.project === filter;
            card.classList.toggle("is-hidden", !match);
          });
          const track = document.getElementById("galTrack");
          if (track) track.scrollTo({ left: 0, behavior: "smooth" });
        }
      });
    });
  });

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    /* validácia: chybu ukáž len keď je pole prázdne alebo neplatné,
       schovaj ju hneď ako začne user písať */
    const fields = contactForm.querySelectorAll(
      ".field input[required], .field select[required], .field textarea[required]"
    );
    const markField = (input, invalid) => {
      const field = input.closest(".field");
      if (field) field.classList.toggle("is-invalid", invalid);
    };
    fields.forEach((input) => {
      input.addEventListener("blur", () => markField(input, !input.checkValidity()));
      input.addEventListener("input", () => {
        if (input.closest(".field")?.classList.contains("is-invalid")) {
          markField(input, !input.checkValidity());
        }
      });
      input.addEventListener("change", () => markField(input, !input.checkValidity()));
    });

    /* časová pečiatka pre antispam kontrolu v api/contact.php */
    const tsInput = document.getElementById("cTs");
    if (tsInput) tsInput.value = String(Date.now());

    const okBox = document.getElementById("contactSuccess");
    const errBox = document.getElementById("contactError");
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let firstInvalid = null;
      fields.forEach((input) => {
        const invalid = !input.checkValidity();
        markField(input, invalid);
        if (invalid && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      okBox.hidden = true;
      errBox.hidden = true;
      submitBtn.disabled = true;

      try {
        const res = await fetch("api/contact.php", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(contactForm),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok) {
          okBox.hidden = false;          // tlačidlo necháme vypnuté
        } else {
          errBox.hidden = false;
          submitBtn.disabled = false;    // nech to vie skúsiť znova
        }
      } catch (err) {
        errBox.hidden = false;
        submitBtn.disabled = false;
      }
    });
  }

  /* ----------------------------------------------------------
     REALPAD — živé dáta namiesto pilotného poľa

     api/realpad.php vracia už uprataný zoznam v rovnakom tvare, aký
     používajú karty. Kým nie sú na serveri vyplnené prístupy,
     endpoint vráti 503 a web ticho beží na pilotných dátach —
     nasadenie teda nič nerozbije a prepnutie je len doplnenie
     api/realpad.config.php.
     ---------------------------------------------------------- */
  async function loadFromRealpad() {
    if (!hasOffer) return;
    try {
      const res = await fetch("api/realpad.php", { headers: { Accept: "application/json" } });
      if (!res.ok) return;                       // 503 = ešte nenakonfigurované
      const data = await res.json();
      if (!data.ok || !Array.isArray(data.flats) || !data.flats.length) return;

      /* prevezmeme len záznamy, ktoré majú všetko potrebné —
         neúplný byt by rozbil filtre aj radenie */
      const usable = data.flats.filter(
        (f) => f.id && f.project && f.rooms != null && f.floor != null && f.area != null
      );
      if (!usable.length) return;

      FLATS.length = 0;
      FLATS.push(...usable);
      state.visible = PAGE_SIZE;
      render();
      paintProjectCounts?.();
    } catch (err) {
      /* sieť alebo API nedostupné — pilotné dáta ostávajú */
    }
  }

  /* ---------- init ---------- */
  render();
  /* obnov jazyk z minulej návštevy — inak ostáva SK tak, ako je v HTML */
  loadFromRealpad();

  const savedLang = i18n.stored();
  if (savedLang) i18n.set(savedLang);   // set() sa sám ignoruje pri zhode
  syncLangUI();
})();
