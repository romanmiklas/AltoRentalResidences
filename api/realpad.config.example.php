<?php
/* ============================================================
   ALTO — prístup k Realpad API

   Skopírujte tento súbor ako realpad.config.php a doplňte údaje
   PRIAMO NA SERVERI. Ostrý súbor je mimo gitu a .htaccess ho
   blokuje zvonku, takže sa k nemu cez web nikto nedostane.

   login / password  — integračný účet (Realpad ich posiela
                       pozvánkou; POZOR: pozvánku treba najprv
                       PRIJAŤ, inak API vracia 401)
   screenid          — konštanta, dodá podpora Realpadu
   developerid       — konštanta, dodá podpora Realpadu
   projects          — ID projektov, na ktoré sa web pýta
   ============================================================ */
return [
    'login'       => '',
    'password'    => '',
    'screenid'    => '',
    'developerid' => '',

    /* Oba projekty majú v CRM zapnuté „Nezobrazené na webe", takže
       sa neobjavia v hromadnom výpise — pýtame sa na ne priamo. */
    'projects' => [
        'skypark' => '28936673',
        'florian' => '40445258',
    ],

    /* Ako dlho sa drží stiahnutý cenník (sekundy). Realpad odporúča
       ťahať raz za hodinu; 900 s je rozumný kompromis pre web. */
    'cache_ttl' => 900,

    /* Voliteľné: tajný kľúč pre realpad.php?debug=<kľúč>, ktorý vypíše
       surové dáta z API. Slúži na overenie mapovania pri prvom spustení.
       Nechajte prázdne = diagnostika je vypnutá. */
    'debug_key' => '',
];
