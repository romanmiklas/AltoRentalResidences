# ALTO Rental Residences

Prezentačný web k prenájmu bytov v projektoch SKY PARK a FLORIAN.
Statické HTML + CSS + JS, bez build kroku — čo je v repozitári, to ide
na server. Dynamické je len odosielanie formulára a (pripravené)
načítanie ponuky z Realpadu, na to beží PHP.

## Štruktúra

```
index.html                    domovská stránka
404.html                      chybová stránka (má noindex)
zasady-*.html                 cookies a spracovanie osobných údajov
robots.txt, sitemap.xml
favicon.ico                   zámerne v koreni — prehliadače a roboti
                              si ho pýtajú priamo z /favicon.ico
.htaccess                     kanonická adresa, cache, bezpečnostné hlavičky

api/
  contact.php                 endpoint kontaktného formulára
  realpad.php                 proxy na Realpad CRM (zatiaľ bez prístupov)
  ratelimit.php               spoločné obmedzenie počtu požiadaviek
  *.config.example.php        vzory konfigurácie (bez hesiel)

assets/favicon/               ostatné veľkosti ikon
assets/fonts/                 Aeonik, Instrument Serif
assets/icons/                 ikony v rozhraní
assets/img/  assets/img/apt/  fotky projektov a bytov
assets/video/

css/main.css
js/  main.js  motion.js  i18n.js  consent.js
```

## Nasadenie

Nahrať obsah repozitára do koreňa webu. Potom ešte na serveri:

1. `api/contact.config.example.php` skopírovať ako `api/contact.config.php`
   a doplniť prístupové údaje na SMTP. To isté pre `realpad.config.php`,
   keď budú prístupy do Realpadu.
2. Overiť, že `.htaccess` prešiel — hosting ho musí mať povolený
   (`AllowOverride`), inak neplatia presmerovania ani ochrana konfigurácií.

Konfigurácie s heslami **nikdy nepatria do repozitára** — sú v `.gitignore`.

## Čo ešte čaká na klienta

- **SMTP heslo** pre schránku, z ktorej sa odosiela formulár.
- **SPF záznam** — doména má MX na Microsoft 365, ale web beží na
  Websupporte. Kým sa do SPF nedoplní `include:_spf.websupport.sk`,
  pošta odoslaná z webu bude odmietaná.
- **Prístupy do Realpadu** (login, heslo, `screenid`, `developerid`).
  Dovtedy `api/realpad.php` vracia 503 a web zobrazuje pilotnú ponuku
  zapísanú natvrdo v `js/main.js`.
