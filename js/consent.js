/* ============================================================
   ALTO — správa súhlasu s cookies

   Ukladá voľbu do localStorage (platnosť 3 roky podľa Zásad
   používania súborov cookies) a vystavuje ju zvyšku stránky cez
   window.ALTO_CONSENT + udalosť "alto:consentchange".

   Meracie skripty (GA, Facebook Pixel, Google Ads) sa NESMÚ vkladať
   priamo do HTML — pripájajú sa až po udelení súhlasu, napr.:

     ALTO_CONSENT.onChange(({ analytics }) => { if (analytics) loadGA(); });

   Nevyhnutné cookies bežia vždy a nie sú predmetom súhlasu.
   ============================================================ */
window.ALTO_CONSENT = (function () {
  "use strict";

  const KEY = "alto-consent";
  const VERSION = 1;
  const MAX_AGE = 3 * 365 * 24 * 60 * 60 * 1000; // 3 roky
  const CATEGORIES = ["analytics", "ads"];       // "necessary" je vždy true

  const listeners = [];
  let state = null;          // null = návštevník sa ešte nerozhodol

  /* ---------- perzistencia ---------- */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data.v !== VERSION) return null;
      if (!data.ts || Date.now() - data.ts > MAX_AGE) return null;
      return data;
    } catch (e) {
      return null;                                // privátny režim / poškodený zápis
    }
  }

  function save(choice) {
    state = { v: VERSION, ts: Date.now(), necessary: true };
    CATEGORIES.forEach((c) => { state[c] = !!choice[c]; });
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* neuložíme */ }
    notify();
  }

  function notify() {
    const snapshot = get();
    listeners.forEach((fn) => { try { fn(snapshot); } catch (e) { /* izolované */ } });
    document.dispatchEvent(new CustomEvent("alto:consentchange", { detail: snapshot }));

    /* Google Consent Mode v2 — aktualizuj stav pre GTM (GTM-K6T9N5GS).
       gtag je definovaný v <head> pred GTM; fallback pre stránky bez neho. */
    window.dataLayer = window.dataLayer || [];
    const gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    gtag("consent", "update", {
      analytics_storage: snapshot.analytics ? "granted" : "denied",
      ad_storage: snapshot.ads ? "granted" : "denied",
      ad_user_data: snapshot.ads ? "granted" : "denied",
      ad_personalization: snapshot.ads ? "granted" : "denied",
    });
    /* voliteľný trigger, ak si klient v GTM naviaže spúšťač na túto udalosť */
    window.dataLayer.push({ event: "alto_consent_update" });
  }

  function get() {
    return {
      decided: state !== null,
      necessary: true,
      analytics: !!(state && state.analytics),
      ads: !!(state && state.ads),
    };
  }

  /* ---------- UI ---------- */
  let root, card;

  function qs(sel) { return root ? root.querySelector(sel) : null; }

  function setView(view) {
    if (!card) return;
    card.dataset.view = view;                     // "intro" | "settings"
    const settings = view === "settings";
    qs(".consent__settings-btn")?.setAttribute("aria-expanded", String(settings));
    if (settings) qs(".consent__switch input")?.focus();
  }

  function showCard(view) {
    if (!root) return;
    root.hidden = false;
    setView(view || "intro");
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add("is-open")));
  }

  function hideCard() {
    if (!root) return;
    root.classList.remove("is-open");
    setTimeout(() => { root.hidden = true; }, 320);
  }

  function syncSwitches() {
    const s = get();
    CATEGORIES.forEach((c) => {
      const input = qs(`.consent__switch input[data-cat="${c}"]`);
      if (input) input.checked = s[c];
    });
  }

  function decide(choice) {
    save(choice);
    hideCard();
  }

  function init() {
    root = document.getElementById("cookieConsent");
    if (!root) return;
    card = root.querySelector(".consent__card");

    qs(".consent__accept")?.addEventListener("click", () => decide({ analytics: true, ads: true }));
    qs(".consent__reject")?.addEventListener("click", () => decide({ analytics: false, ads: false }));
    qs(".consent__settings-btn")?.addEventListener("click", () => {
      syncSwitches();
      setView(card.dataset.view === "settings" ? "intro" : "settings");
    });
    qs(".consent__save")?.addEventListener("click", () => {
      const choice = {};
      CATEGORIES.forEach((c) => {
        choice[c] = !!qs(`.consent__switch input[data-cat="${c}"]`)?.checked;
      });
      decide(choice);
    });
    /* Do správy súhlasu sa dá vrátiť len cez odkaz „Nastavenia cookies"
       v pätičke — žiadne trvalé plávajúce tlačidlo na stránke. */
    document.querySelectorAll('[data-consent-open]').forEach((el) =>
      el.addEventListener("click", (e) => { e.preventDefault(); syncSwitches(); showCard("settings"); })
    );

    state = load();
    if (state) {
      notify();                                   // dorovnaj stav skriptov po reloade
    } else {
      showCard("intro");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return {
    get,
    /** Programové nastavenie (napr. z testov alebo iného UI). */
    set: (choice) => decide(choice),
    /** Otvorí správu súhlasu s prepínačmi. */
    open: () => { syncSwitches(); showCard("settings"); },
    /** Registruje poslucháča; ak už je rozhodnuté, zavolá sa hneď. */
    onChange: (fn) => {
      listeners.push(fn);
      if (state) { try { fn(get()); } catch (e) { /* izolované */ } }
    },
  };
})();
