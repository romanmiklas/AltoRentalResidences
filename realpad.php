<?php
/* ============================================================
   ALTO — most medzi Realpad API a webom

   Web sa NIKDY nepýta Realpadu priamo: prihlasovacie údaje by boli
   viditeľné v prehliadači. Pýta sa tento súbor, ten má údaje u seba
   a vracia už uprataný JSON v tvare, aký používajú karty ponuky.

   Zdroj: https://dev.realpadsoftware.com/integrations/landing-page/
          fetching-pricelist-data
     POST https://cms.realpad.eu/ws/v10/get-project
     telo: application/x-www-form-urlencoded (NIE JSON)
     parametre: login, password, screenid, developerid, projectid
     odpoveď: XML  export → project → building → floor → flat

   Tri veci z dokumentácie, na ktorých sa dá ľahko popáliť:
     1. Parameter „includehidden" sa vyhodnocuje podľa PRÍTOMNOSTI,
        nie hodnoty — poslať includehidden=false skryté jednotky
        naopak PRIDÁ. Preto ho neposielame vôbec.
     2. Po pár neúspešných prihláseniach Realpad účet dočasne zablokuje
        a vracia 401 nerozoznateľné od zlého hesla. Pri 401 sa preto
        NIKDY neopakuje pokus — zapíše sa chyba a vráti sa cache.
     3. Prístupy začnú fungovať až po PRIJATÍ pozvánky v e-maile.
   ============================================================ */
declare(strict_types=1);

const RP_ENDPOINT = 'https://cms.realpad.eu/ws/v10/get-project';
const RP_RESOURCE = 'https://cms.realpad.eu/resource/';
const RP_TIMEOUT  = 20;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300');
header('X-Content-Type-Options: nosniff');

$cfg = @include __DIR__ . '/realpad.config.php';
$cfg = is_array($cfg) ? $cfg : [];

$cacheFile = sys_get_temp_dir() . '/alto-realpad-cache.json';
$ttl = (int)($cfg['cache_ttl'] ?? 900);

/** Odpoveď + koniec. */
function rp_out(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Uložená kópia — použije sa aj keď je stará, ak API nedá nič lepšie. */
function rp_cache_read(string $file): ?array {
    if (!is_readable($file)) return null;
    $raw = json_decode((string)file_get_contents($file), true);
    return is_array($raw) && isset($raw['flats']) ? $raw : null;
}

/* ---------- čerstvá cache? hotovo ---------- */
$cache = rp_cache_read($cacheFile);
if ($cache && (time() - (int)$cache['fetched']) < $ttl) {
    rp_out(['ok' => true, 'source' => 'cache', 'fetched' => $cache['fetched'],
            'flats' => $cache['flats']]);
}

/* ---------- bez prístupov sa nikam nevoláme ---------- */
if (($cfg['login'] ?? '') === '' || ($cfg['password'] ?? '') === '') {
    if ($cache) {
        rp_out(['ok' => true, 'source' => 'cache-stale', 'fetched' => $cache['fetched'],
                'flats' => $cache['flats']]);
    }
    rp_out(['ok' => false, 'error' => 'not_configured',
            'message' => 'Realpad nie je nakonfigurovaný (realpad.config.php).',
            'flats' => []], 503);
}

/** Jedno volanie get-project. Vracia [xml|null, chyba|null]. */
function rp_fetch(array $cfg, string $projectId): array {
    $body = http_build_query([
        'login'       => (string)$cfg['login'],
        'password'    => (string)$cfg['password'],
        'screenid'    => (string)($cfg['screenid'] ?? ''),
        'developerid' => (string)($cfg['developerid'] ?? ''),
        'projectid'   => $projectId,
        /* includehidden zámerne NEPOSIELAME — viď poznámka v hlavičke */
    ]);

    if (function_exists('curl_init')) {
        $ch = curl_init(RP_ENDPOINT);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => RP_TIMEOUT,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
        ]);
        $res  = curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err  = curl_error($ch);
        curl_close($ch);
        if ($res === false) return [null, 'spojenie zlyhalo: ' . $err];
    } else {
        $ctx = stream_context_create(['http' => [
            'method'        => 'POST',
            'header'        => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content'       => $body,
            'timeout'       => RP_TIMEOUT,
            'ignore_errors' => true,
        ]]);
        $res = @file_get_contents(RP_ENDPOINT, false, $ctx);
        $code = 0;
        foreach ($http_response_header ?? [] as $h) {
            if (preg_match('~^HTTP/\S+\s+(\d{3})~', $h, $m)) { $code = (int)$m[1]; }
        }
        if ($res === false) return [null, 'spojenie zlyhalo (allow_url_fopen)'];
    }

    if ($code === 401) return [null, '401 — neplatné údaje, neprijatá pozvánka alebo blokovaný účet (NEOPAKOVAŤ)'];
    if ($code === 429) return [null, '429 — príliš časté volania, zvýšte cache_ttl'];
    if ($code !== 200) return [null, 'HTTP ' . $code];
    return [$res, null];
}

/** „2+kk" / „3+1" → počet izieb. 1+kk sa u nás značí ako 1. */
function rp_rooms(string $disposition): ?float {
    if (preg_match('~(\d+)\s*\+\s*(kk|\d+)~iu', $disposition, $m)) {
        return (float)$m[1];
    }
    if (preg_match('~(\d+([.,]5)?)~', $disposition, $m)) {
        return (float)str_replace(',', '.', $m[1]);
    }
    return null;
}

/* stav jednotky → naše hodnoty (web filtruje podľa nich) */
const RP_STATUS = [
    '0' => 'volny', '1' => 'rezervovany', '2' => 'rezervovany',
    '3' => 'prenajaty', '4' => 'prenajaty', '5' => 'rezervovany',
];

/** XML jedného projektu → naše karty. */
function rp_parse(string $xml, string $projectKey, string $baseUrl): array {
    $prev = libxml_use_internal_errors(true);
    $doc = simplexml_load_string($xml);
    libxml_use_internal_errors($prev);
    if ($doc === false) return [];

    $out = [];
    foreach ($doc->xpath('//flat') ?: [] as $flat) {
        $a = [];
        foreach ($flat->{'flat-attribute'} ?? [] as $attr) {
            $key = (string)($attr['key'] ?? $attr['name'] ?? '');
            if ($key !== '') $a[$key] = trim((string)$attr);
        }
        /* len byty — parkovanie, pivnice a sklady na web nepatria */
        if (($a['flat_type'] ?? '1') !== '1') continue;

        $id = $a['flat_internal_id'] ?? '';
        if ($id === '') continue;

        /* podlažie je na nadradenom elemente <floor>, nie medzi atribútmi */
        $floor = null;
        $parent = $flat->xpath('..');
        if ($parent && isset($parent[0])) {
            foreach (['number', 'floor', 'id', 'name'] as $k) {
                if (isset($parent[0][$k]) && is_numeric((string)$parent[0][$k])) {
                    $floor = (int)$parent[0][$k]; break;
                }
            }
        }

        /* galéria: UID v atribútoch <flat> → trvalá adresa obrázka */
        $gallery = [];
        foreach ($flat->attributes() ?? [] as $k => $v) {
            if (preg_match('~(gallery|photo|image|plan)~i', (string)$k)) {
                foreach (preg_split('~[,;\s]+~', trim((string)$v)) ?: [] as $uid) {
                    if (preg_match('~^[0-9a-f-]{8,}$~i', $uid)) $gallery[] = RP_RESOURCE . $uid;
                }
            }
        }

        $price = $a['flat_price'] ?? '';
        $area  = str_replace(',', '.', $a['flat_area'] ?? '');

        $out[] = [
            'id'      => $id,
            'project' => $projectKey,
            'rooms'   => rp_rooms($a['flat_disposition'] ?? ''),
            'floor'   => $floor,
            'area'    => $area !== '' ? round((float)$area, 2) : null,
            'price'   => is_numeric($price) && (float)$price > 0 ? (int)round((float)$price) : null,
            'status'  => RP_STATUS[$a['flat_status'] ?? '0'] ?? 'volny',
            'url'     => $baseUrl . rawurlencode($id),
            'photos'  => array_values(array_unique($gallery)),
        ];
    }
    return $out;
}

/* ---------- stiahnutie oboch projektov ---------- */
$baseUrls = [
    'skypark' => 'https://skypark4rent.sk/byty/',
    'florian' => 'https://florian4rent.sk/byty/',
];

/* diagnostika pre prvé spustenie — vypne sa prázdnym debug_key */
$debug = ($cfg['debug_key'] ?? '') !== '' && ($_GET['debug'] ?? '') === $cfg['debug_key'];

$flats = [];
$errors = [];
foreach (($cfg['projects'] ?? []) as $key => $projectId) {
    [$xml, $err] = rp_fetch($cfg, (string)$projectId);
    if ($err !== null) { $errors[$key] = $err; continue; }
    if ($debug) {
        header('Content-Type: text/plain; charset=utf-8');
        echo "=== $key ($projectId) — prvých 4000 znakov surovej odpovede ===\n\n";
        echo substr($xml, 0, 4000);
        exit;
    }
    $flats = array_merge($flats, rp_parse($xml, (string)$key, $baseUrls[$key] ?? ''));
}

/* ---------- výsledok ---------- */
if (!$flats) {
    error_log('ALTO Realpad: ' . json_encode($errors, JSON_UNESCAPED_UNICODE));
    if ($cache) {
        rp_out(['ok' => true, 'source' => 'cache-stale', 'fetched' => $cache['fetched'],
                'flats' => $cache['flats']]);
    }
    rp_out(['ok' => false, 'error' => 'fetch_failed', 'detail' => $errors, 'flats' => []], 502);
}
if ($errors) error_log('ALTO Realpad (čiastočne): ' . json_encode($errors, JSON_UNESCAPED_UNICODE));

$payload = ['fetched' => time(), 'flats' => $flats];
@file_put_contents($cacheFile, json_encode($payload, JSON_UNESCAPED_UNICODE), LOCK_EX);
rp_out(['ok' => true, 'source' => 'api', 'fetched' => $payload['fetched'],
        'partial' => $errors ?: null, 'flats' => $flats]);
