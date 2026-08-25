/* ============================================================
   ALTO — motion layer

   Jemné vstupné animácie (fade + slide) riadené atribútmi
   priamo v HTML, takže markup ostáva jediným zdrojom pravdy:

     data-reveal              … prvok nabehne (variant: "" | fade | media | lg)
     data-reveal-group        … kontajner, ktorý spustí svoje deti naraz
                                so vzájomným posunom ("" = pri skrolovaní,
                                "load" = hneď po načítaní, napr. hero)
     data-reveal-step="90"    … rozostup medzi deťmi skupiny v ms
     data-reveal-delay="120"  … pevné oneskorenie (na skupine aj na dieťati)

   Počiatočný stav (opacity:0) je v CSS pod triedou .motion na <html>,
   ktorú pridáva inline skript v <head> — vďaka tomu nikdy neprebliknú
   prvky pred spustením animácie. Pri prefers-reduced-motion: reduce sa
   trieda nepridá a stránka je jednoducho statická.
   ============================================================ */
(function () {
  "use strict";

  const root = document.documentElement;
  if (!root.classList.contains("motion")) return;
  window.__altoMotion = true;      // zruší poistný timeout z <head>

  /* Bez IntersectionObserver by obsah ostal skrytý — radšej vypneme animácie
     a zobrazíme stránku staticky. */
  if (!("IntersectionObserver" in window)) {
    root.classList.remove("motion");
    window.ALTO_MOTION = { scan: function () {}, replay: function () {}, show: function () {} };
    return;
  }

  const STEP = 70;                 // predvolený rozostup v skupine
  const STEP_TIGHT = 45;           // hustejší rozostup pre veľké mriežky (ponuka)
  const MAX_STEPS = 7;             // strop — 9. a ďalšia položka už nečaká dlhšie

  /* Spúšťač: horná hrana prvku prejde 88 % výšky okna. */
  const io = new IntersectionObserver(onIntersect, {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0,
  });

  function onIntersect(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      if (el.hasAttribute("data-reveal-group") || el.__revealChildren) {
        children(el).forEach(show);
      } else {
        show(el);
      }
    });
  }

  /* Po dobehnutí animácie zahodíme data-reveal aj triedu — prvok sa vráti
     do úplne bežného stavu, takže nič nedrží animation fill a hover efekty
     komponentov fungujú ako predtým. Timeout je poistka pre prípad, že sa
     animationend nespustí (napr. prvok je práve display:none). */
  function show(el) {
    if (el.classList.contains("is-in")) return;
    el.classList.add("is-in");
    const clean = function (e) {
      /* animationend bubluje — reagujeme len na vlastnú animáciu prvku */
      if (e && e.target !== el) return;
      el.removeEventListener("animationend", clean);
      clearTimeout(el.__revealTimer);
      el.classList.remove("is-in");
      el.removeAttribute("data-reveal");
    };
    el.addEventListener("animationend", clean);
    el.__revealTimer = setTimeout(clean, 2400);
  }

  function children(group) {
    return Array.prototype.slice.call(group.querySelectorAll("[data-reveal]"));
  }

  function num(value, fallback) {
    const n = parseInt(value, 10);
    return isNaN(n) ? fallback : n;
  }

  /* Dvojitý rAF — prvý snímok vykreslí počiatočný stav, druhý spustí animáciu.
     V skrytej karte je rAF pozastavený, preto poistný timeout: show() je
     idempotentný, takže sa nič neprehrá dvakrát. */
  function raf2(fn) {
    requestAnimationFrame(function () { requestAnimationFrame(fn); });
    setTimeout(fn, 120);
  }

  function setDelays(list, step, base) {
    list.forEach(function (el, i) {
      el.__reveal = true;
      /* vlastné data-reveal-delay na dieťati prebije poradie v skupine */
      const own = num(el.dataset.revealDelay, null);
      const delay = own === null ? base + Math.min(i, MAX_STEPS) * step : base + own;
      el.style.setProperty("--reveal-delay", delay + "ms");
    });
  }

  /* ---------- registrácia ---------- */
  function scan(scope) {
    const ctx = scope || document;

    Array.prototype.forEach.call(ctx.querySelectorAll("[data-reveal-group]"), function (g) {
      if (g.__reveal) return;
      g.__reveal = true;
      setDelays(children(g), num(g.dataset.revealStep, STEP), num(g.dataset.revealDelay, 0));
      if (g.dataset.revealGroup === "load") raf2(function () { children(g).forEach(show); });
      else io.observe(g);
    });

    /* samostatné prvky mimo skupín */
    Array.prototype.forEach.call(ctx.querySelectorAll("[data-reveal]"), function (el) {
      if (el.__reveal) return;
      el.__reveal = true;
      const base = num(el.dataset.revealDelay, 0);
      if (base) el.style.setProperty("--reveal-delay", base + "ms");
      io.observe(el);
    });
  }

  /* ---------- prekreslený obsah (ponuka bytov) ----------
     `keep` = počet kariet, ktoré na stránke už boli — tie zobrazíme
     bez prechodu, aby pri „Načítať ďalšie" nepreblikla celá mriežka. */
  function replay(container, keep) {
    if (!container) return;
    const list = children(container);
    if (!list.length) return;

    const skip = keep || 0;
    const fresh = [];
    list.forEach(function (el, i) {
      el.__reveal = true;
      /* karty, ktoré na stránke už boli: zhodíme atribút, takže sa vôbec
         neanimujú a pri „Načítať ďalšie" nepreblikne celá mriežka */
      if (i < skip) { el.removeAttribute("data-reveal"); return; }
      el.style.setProperty("--reveal-delay", Math.min(i - skip, MAX_STEPS) * STEP_TIGHT + "ms");
      fresh.push(el);
    });
    if (!fresh.length) return;

    const box = container.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) {
      raf2(function () { fresh.forEach(show); });
    } else {
      container.__revealChildren = true;
      io.observe(container);
    }
  }

  /* Skript je načítaný s defer, takže DOM je hotový — netreba čakať. */
  scan();

  window.ALTO_MOTION = { scan: scan, replay: replay, show: show };
})();
