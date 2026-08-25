<?php
/* ============================================================
   ALTO — odoslanie kontaktného formulára

   Prijíma POST z #contactForm (js/main.js) a posiela e-mail na
   adresu v RECIPIENT. Odpovedá vždy JSON-om {"ok":true|false}.

   Ochrana proti spamu je trojitá a nevyžaduje session ani DB:
     1. honeypot — skryté pole "alto_hp", ktoré človek nevyplní
     2. časový zámok — formulár odoslaný do 3 s je takmer isto bot
     3. limit na IP — max 5 odoslaní za 10 minút

   POZOR: hosting musí mať PHP a funkčný mail(). Adresa v FROM musí
   ostať na vlastnej doméne, inak správy padnú na SPF/DKIM kontrole.
   ============================================================ */
declare(strict_types=1);

/* Konfigurácia (SMTP prístup) je v samostatnom súbore, aby heslo
   nebolo v kóde. Ak chýba, použijú sa predvolené hodnoty nižšie. */
$CFG  = @include __DIR__ . '/contact.config.php';
$CFG  = is_array($CFG) ? $CFG : [];
$SMTP = isset($CFG['smtp']) && is_array($CFG['smtp']) ? $CFG['smtp'] : [];

const RECIPIENT   = 'info@altorentalresidences.sk';
const FROM        = 'noreply@altorentalresidences.sk';
const FROM_NAME   = 'ALTO Rental Residences';
const MIN_SECONDS = 3;      // rýchlejšie odoslanie = bot
const RATE_MAX    = 5;      // koľko odoslaní z jednej IP
const RATE_WINDOW = 600;    // za koľko sekúnd

if (function_exists('mb_internal_encoding')) {
    mb_internal_encoding('UTF-8');
}

/** Orezanie na dĺžku — mbstring nemusí byť na hostingu k dispozícii. */
function cut(string $v, int $len): string {
    return function_exists('mb_substr') ? mb_substr($v, 0, $len) : substr($v, 0, $len);
}

/** Zakódovanie hlavičky s diakritikou podľa RFC 2047. */
function encHeader(string $v): string {
    if (function_exists('mb_encode_mimeheader')) {
        return mb_encode_mimeheader($v, 'UTF-8');
    }
    return $v === '' ? '' : '=?UTF-8?B?' . base64_encode($v) . '?=';
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

/** Ukončí beh a vráti JSON. */
function respond(bool $ok, string $error = '', int $status = 200): void {
    http_response_code($status);
    echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $error],
                     JSON_UNESCAPED_UNICODE);
    exit;
}

/** Orezaný reťazec z POST bez riadiacich znakov. */
function field(string $key, int $max = 500): string {
    $v = isset($_POST[$key]) && is_string($_POST[$key]) ? $_POST[$key] : '';
    $v = str_replace(["\r", "\0"], '', $v);
    $v = trim($v);
    return cut($v, $max);
}

/** Hodnota do hlavičky e-mailu — CR/LF by umožnili header injection. */
function headerSafe(string $v): string {
    return trim(preg_replace('/[\r\n]+/', ' ', $v) ?? '');
}

/* ---------- 1. len POST ---------- */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(false, 'method', 405);
}

/* ---------- 2. honeypot ---------- */
if (field('alto_hp') !== '') {
    respond(true);                 // botovi tvárime, že prešiel
}

/* ---------- 3. časový zámok ---------- */
$ts = (int) field('ts', 20);
if ($ts > 0 && (microtime(true) * 1000 - $ts) < MIN_SECONDS * 1000) {
    respond(false, 'too_fast', 429);
}

/* ---------- 4. limit na IP ---------- */
$ip   = (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
$file = sys_get_temp_dir() . '/alto-contact-' . sha1($ip) . '.txt';
$now  = time();
$hits = [];
if (is_readable($file)) {
    $hits = array_filter(
        array_map('intval', explode(',', (string) file_get_contents($file))),
        static fn(int $t): bool => $t > $now - RATE_WINDOW
    );
}
if (count($hits) >= RATE_MAX) {
    respond(false, 'rate_limit', 429);
}
$hits[] = $now;
@file_put_contents($file, implode(',', $hits), LOCK_EX);

/* ---------- 5. validácia ---------- */
$name    = field('name', 100);
$surname = field('surname', 100);
$email   = field('email', 254);
$phone   = field('phone', 40);
$source  = field('source', 100);
$project = field('project', 40);
$apart   = field('apartment', 60);
$message = field('message', 5000);
$consent = field('consent', 10) !== '';

if ($name === '' || $surname === '' || $phone === '' || $message === '') {
    respond(false, 'missing', 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'email', 422);
}
if (!$consent) {
    respond(false, 'consent', 422);
}

/* ============================================================
   Minimálny SMTP klient

   Doména odosiela cez Websupport, ale MX má na Microsoft 365,
   takže mail() by narazil na SPF. Prihlásime sa teda priamo na
   SMTP účet. Vracia [úspech, popis chyby].
   ============================================================ */
function smtpSend(array $s, string $to, string $subject, string $body, array $mailHeaders): array {
    $timeout = 20;
    $host    = (string) ($s['host'] ?? '');
    $port    = (int) ($s['port'] ?? 465);
    $secure  = strtolower((string) ($s['secure'] ?? ''));
    $dsn     = ($secure === 'ssl' ? 'ssl://' : '') . $host . ':' . $port;

    $ctx = stream_context_create(['ssl' => [
        'verify_peer' => true, 'verify_peer_name' => true, 'SNI_enabled' => true,
    ]]);
    $fp = @stream_socket_client($dsn, $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) {
        return [false, "spojenie na {$dsn} zlyhalo: {$errstr} ({$errno})"];
    }
    stream_set_timeout($fp, $timeout);

    /* Odpoveď servera môže mať viac riadkov; posledný má na 4. znaku medzeru. */
    $read = static function () use ($fp): string {
        $out = '';
        while (($line = fgets($fp, 1024)) !== false) {
            $out .= $line;
            if (strlen($line) < 4 || $line[3] !== '-') { break; }
        }
        return $out;
    };
    $say  = static function (string $cmd) use ($fp, $read): string {
        fwrite($fp, $cmd . "\r\n");
        return $read();
    };
    $code = static function (string $r): int { return (int) substr(ltrim($r), 0, 3); };

    $bye = static function (string $step, string $resp) use ($fp): array {
        @fwrite($fp, "QUIT\r\n");
        @fclose($fp);
        return [false, $step . ' — ' . trim(preg_replace('/\s+/', ' ', $resp) ?? '')];
    };

    $ehloName = (string) ($_SERVER['SERVER_NAME'] ?? 'localhost');

    $r = $read();
    if ($code($r) !== 220) { return $bye('privítanie servera', $r); }

    $r = $say('EHLO ' . $ehloName);
    if ($code($r) !== 250) { return $bye('EHLO', $r); }

    if ($secure === 'tls') {
        $r = $say('STARTTLS');
        if ($code($r) !== 220) { return $bye('STARTTLS', $r); }
        if (!@stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            return $bye('TLS handshake', 'šifrovanie sa nepodarilo zapnúť');
        }
        $r = $say('EHLO ' . $ehloName);          // po STARTTLS sa EHLO opakuje
        if ($code($r) !== 250) { return $bye('EHLO po STARTTLS', $r); }
    }

    $r = $say('AUTH LOGIN');
    if ($code($r) !== 334) { return $bye('AUTH LOGIN', $r); }
    $r = $say(base64_encode((string) ($s['user'] ?? '')));
    if ($code($r) !== 334) { return $bye('meno', $r); }
    $r = $say(base64_encode((string) ($s['pass'] ?? '')));
    if ($code($r) !== 235) { return $bye('heslo', $r); }

    $from = (string) ($s['from'] ?? $s['user']);
    $r = $say('MAIL FROM:<' . $from . '>');
    if ($code($r) !== 250) { return $bye('MAIL FROM', $r); }
    $r = $say('RCPT TO:<' . $to . '>');
    if ($code($r) !== 250 && $code($r) !== 251) { return $bye('RCPT TO', $r); }
    $r = $say('DATA');
    if ($code($r) !== 354) { return $bye('DATA', $r); }

    $head = array_merge($mailHeaders, [
        'To: ' . $to,
        'Subject: ' . $subject,
        'Date: ' . date('r'),
        'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . $ehloName . '>',
    ]);
    /* riadok začínajúci bodkou by ukončil DATA — musí sa zdvojiť */
    $safeBody = implode("\r\n", array_map(
        static function (string $l): string { return (isset($l[0]) && $l[0] === '.') ? '.' . $l : $l; },
        explode("\r\n", $body)
    ));
    fwrite($fp, implode("\r\n", $head) . "\r\n\r\n" . $safeBody . "\r\n.\r\n");
    $r = $read();
    if ($code($r) !== 250) { return $bye('telo správy', $r); }

    @fwrite($fp, "QUIT\r\n");
    @fclose($fp);
    return [true, ''];
}

/* ---------- 6. e-mail ---------- */
$projectLabel = ['skypark' => 'SKY PARK', 'florian' => 'FLORIAN'][$project] ?? $project;

$subject = 'Nová správa z webu — ' . $projectLabel
         . ($apart !== '' ? ' — byt ' . $apart : '');

$lines = [
    'Nová správa z kontaktného formulára na www.altorentalresidences.sk',
    '',
    'Meno:        ' . $name . ' ' . $surname,
    'E-mail:      ' . $email,
    'Telefón:     ' . $phone,
    'Projekt:     ' . $projectLabel,
];
if ($apart !== '')  { $lines[] = 'ID bytu:     ' . $apart; }
if ($source !== '') { $lines[] = 'Zdroj:       ' . $source; }
$lines[] = '';
$lines[] = 'Správa:';
$lines[] = $message;
$lines[] = '';
$lines[] = str_repeat('-', 56);
$lines[] = 'Súhlas so spracovaním osobných údajov: ÁNO';
$lines[] = 'Odoslané: ' . date('d.m.Y H:i:s');
$lines[] = 'IP: ' . $ip;
$lines[] = 'Prehliadač: ' . headerSafe(cut((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 200));

$body = implode("\n", $lines);
/* CRLF podľa RFC; ?? $body kvôli strict_types — preg_replace vracia ?string */
$body = preg_replace("/(?<!\r)\n/", "\r\n", $body) ?? $body;

$replyName = headerSafe($name . ' ' . $surname);

/* Príjemca a odosielateľ z konfigurácie; bez nej ostávajú predvolené. */
$to       = (string) ($CFG['recipient'] ?? RECIPIENT);
$fromAddr = headerSafe((string) ($SMTP['from'] ?? $SMTP['user'] ?? FROM));
$fromName = (string) ($SMTP['from_name'] ?? FROM_NAME);

$headers = [
    'From: ' . encHeader($fromName) . ' <' . $fromAddr . '>',
    'Reply-To: ' . encHeader($replyName) . ' <' . headerSafe($email) . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: ALTO-web',
];

/* Prednostne cez SMTP (kvôli SPF – pozri contact.config.php).
   Ak heslo nie je vyplnené, skúsime aspoň mail(). */
if (($SMTP['pass'] ?? '') !== '' && ($SMTP['host'] ?? '') !== '') {
    [$sent, $why] = smtpSend($SMTP, $to, encHeader($subject), $body, $headers);
    if (!$sent) {
        error_log('ALTO kontakt: SMTP zlyhalo (' . $why . ') pre ' . $email);
        respond(false, 'send', 500);
    }
} else {
    $sent = @mail($to, encHeader($subject), $body, implode("\r\n", $headers), '-f' . $fromAddr);
    if (!$sent) {
        error_log('ALTO kontakt: mail() zlyhalo pre ' . $email . ' (SMTP nie je nakonfigurované)');
        respond(false, 'send', 500);
    }
}

respond(true);
