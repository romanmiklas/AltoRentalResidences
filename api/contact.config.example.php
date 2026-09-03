<?php
/* ============================================================
   ALTO — prístupové údaje pre odosielanie e-mailov

   Tento súbor drží heslo, preto ho .htaccess blokuje zvonku.
   NEPOSIELAJTE ho e-mailom ani ho nedávajte do gitu — heslo
   vyplňte až priamo na serveri cez FTP / File Manager.

   Prečo SMTP a nie obyčajné mail():
   doména má MX na Microsoft 365, ale web beží na Websupporte.
   SPF domény (v=spf1 include:spf.protection.outlook.com -all)
   povoľuje odosielať IBA microsoftím serverom, takže čokoľvek
   odoslané priamo z webhostingu Microsoft odmietne alebo hodí
   do spamu. Preto sa prihlasujeme na SMTP účet od Websupportu
   a SPF domény treba doplniť (viac v poznámke nižšie).
   ============================================================ */
return [
    /* kam chodia správy z formulára */
    'recipient' => 'info@altorentalresidences.sk',

    'smtp' => [
        /* Údaje potvrdí IT oddelenie / Websupport. Kým je 'pass'
           prázdne, contact.php sa vráti k funkcii mail() — tá tu
           však kvôli SPF spoľahlivo fungovať nebude. */
        'host'      => 'smtp.websupport.sk',
        'port'      => 465,          // 465 = ssl, 587 = tls
        'secure'    => 'ssl',        // 'ssl' | 'tls' | '' (bez šifrovania)
        'user'      => 'smtp@altorentalresidences.sk',
        'pass'      => '',           // ← doplniť heslo od IT (len na serveri)
        /* Odosielateľ. Väčšina serverov vyžaduje, aby sa zhodoval
           s prihlasovacím účtom — ak IT povolí web@, zmeňte tu. */
        'from'      => 'smtp@altorentalresidences.sk',
        'from_name' => 'ALTO Rental Residences',
    ],
];
