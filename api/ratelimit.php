<?php
/* ============================================================
   ALTO — zdieľané obmedzenie počtu požiadaviek

   Web nemá databázu, takže počítadlá držíme v súboroch v dočasnom
   adresári. Pre statický web s dvomi PHP endpointmi to stačí.

   Chráni dve rôzne veci:
     1. NÁS — aby útočník nezaplavil schránku cez kontaktný formulár.
     2. REALPAD — aby útočník cez náš endpoint nevygeneroval toľko
        volaní, že nám Realpad zabanuje integračný účet.

   Poznámka k IP: zámerne sa NEDÔVERUJE hlavičke X-Forwarded-For.
   Tú si môže útočník nastaviť ľubovoľne a limit by tak obišiel
   jedným riadkom. Ak web niekedy pobeží za proxy alebo CDN, treba
   sem doplniť zoznam dôveryhodných proxy adries.
   ============================================================ */
declare(strict_types=1);

/** Adresár na počítadlá; vytvorí sa pri prvom použití. */
function rl_dir(): string {
    $dir = sys_get_temp_dir() . '/alto-rl';
    if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
    return $dir;
}

/** Klientska IP. Bez proxy je REMOTE_ADDR jediný dôveryhodný zdroj. */
function rl_ip(): string {
    return (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

/**
 * Zaznamená pokus a povie, či sa smie pokračovať.
 * @return array{0:bool,1:int}  [povolené, o koľko sekúnd skúsiť znova]
 */
function rl_hit(string $bucket, int $max, int $window, ?string $key = null): array {
    $key ??= rl_ip();
    $file = rl_dir() . '/' . preg_replace('~[^a-z0-9_-]~i', '', $bucket) . '-' . sha1($key) . '.txt';
    $now  = time();

    $fp = @fopen($file, 'c+');
    if (!$fp) { return [true, 0]; }              // radšej pustiť ďalej než zhodiť web
    @flock($fp, LOCK_EX);

    $hits = array_values(array_filter(
        array_map('intval', explode(',', (string) stream_get_contents($fp))),
        static fn(int $t): bool => $t > $now - $window
    ));

    if (count($hits) >= $max) {
        $retry = max(1, ($hits[0] + $window) - $now);
        @flock($fp, LOCK_UN); @fclose($fp);
        return [false, $retry];
    }

    $hits[] = $now;
    ftruncate($fp, 0); rewind($fp);
    fwrite($fp, implode(',', $hits));
    @flock($fp, LOCK_UN); @fclose($fp);

    rl_gc();
    return [true, 0];
}

/** Občasné upratanie starých počítadiel, nech súbory nenarastajú donekonečna. */
function rl_gc(): void {
    if (random_int(1, 200) !== 1) { return; }
    $cutoff = time() - 86400;
    foreach (glob(rl_dir() . '/*.txt') ?: [] as $f) {
        if (@filemtime($f) < $cutoff) { @unlink($f); }
    }
}

/**
 * Zámok pre „single flight" — keď vyprší cache, na Realpad ide len
 * jedna požiadavka, aj keby ich v tej sekunde prišlo päťdesiat.
 * @return resource|false  drž ho, kým prebieha volanie; false = niekto iný ho už drží
 */
function rl_lock(string $name) {
    $fp = @fopen(rl_dir() . '/' . preg_replace('~[^a-z0-9_-]~i', '', $name) . '.lock', 'c');
    if (!$fp) { return false; }
    if (!@flock($fp, LOCK_EX | LOCK_NB)) { @fclose($fp); return false; }
    return $fp;
}

function rl_unlock($fp): void {
    if (is_resource($fp)) { @flock($fp, LOCK_UN); @fclose($fp); }
}

/** Jednotná odpoveď pri prekročení limitu. */
function rl_reject(int $retry): void {
    http_response_code(429);
    header('Retry-After: ' . $retry);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'rate_limit', 'retry_after' => $retry]);
    exit;
}
