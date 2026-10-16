<?php
/* Black Frog · a fila do checkup, que e de onde o ROBO come.
   Existe porque o token do GHL que roda no n8n so enxerga a location da VMG
   (403 na sub-conta da Black Frog), entao o funil da BF nao passa pelo GHL.

     GET  fila.php?key=...&op=pendentes        -> os leads que ainda nao foram diagnosticados
     POST fila.php?key=...&op=feito&id=<id>    -> marca um lead como diagnosticado

   A chave mora FORA do public_html, em bf-checkup.key, uma linha. */
@ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');

$base    = dirname(dirname(__DIR__));         // ao lado do public_html
$arquivo = $base . '/bf-checkup.csv';
$chaveF  = $base . '/bf-checkup.key';

$esperada = is_readable($chaveF) ? trim((string)file_get_contents($chaveF)) : '';
$dada     = (string)($_GET['key'] ?? '');
if ($esperada === '' || !hash_equals($esperada, $dada)) {
  http_response_code(403); echo '{"ok":false,"why":"key"}'; exit;
}

$op = (string)($_GET['op'] ?? 'pendentes');

/* le o csv inteiro, com trava, e devolve as linhas como array */
function le_tudo($arquivo) {
  if (!is_readable($arquivo)) return [];
  $out = [];
  $fh = fopen($arquivo, 'r');
  if (!$fh) return [];
  if (flock($fh, LOCK_SH)) {
    while (($l = fgetcsv($fh, 0, ',', '"', '\\')) !== false) {
      if (count($l) >= 6) $out[] = $l;
    }
    flock($fh, LOCK_UN);
  }
  fclose($fh);
  return $out;
}

if ($op === 'pendentes') {
  $leads = [];
  foreach (le_tudo($arquivo) as $l) {
    /* formato: ts, id, status, nome, email, site, ramo, ip, ua */
    if (($l[2] ?? '') !== 'pendente') continue;
    $leads[] = [
      'id'    => $l[1] ?? '',
      'ts'    => $l[0] ?? '',
      'name'  => $l[3] ?? '',
      'email' => $l[4] ?? '',
      'site'  => $l[5] ?? '',
      'kind'  => $l[6] ?? '',
    ];
  }
  echo json_encode(['ok' => true, 'total' => count($leads), 'leads' => $leads]);
  exit;
}

if ($op === 'feito') {
  $id = (string)($_GET['id'] ?? '');
  if ($id === '') { http_response_code(422); echo '{"ok":false,"why":"id"}'; exit; }

  $fh = fopen($arquivo, 'c+');
  if (!$fh) { http_response_code(500); echo '{"ok":false}'; exit; }
  $mudou = false;
  if (flock($fh, LOCK_EX)) {
    $linhas = [];
    while (($l = fgetcsv($fh, 0, ',', '"', '\\')) !== false) {
      if (count($l) < 6) continue;
      if (($l[1] ?? '') === $id && ($l[2] ?? '') === 'pendente') {
        $l[2] = 'diagnosticado ' . gmdate('Y-m-d H:i') . ' UTC';
        $mudou = true;
      }
      $linhas[] = $l;
    }
    /* reescreve inteiro: a trava garante que ninguem escreveu no meio */
    ftruncate($fh, 0); rewind($fh);
    foreach ($linhas as $l) { fputcsv($fh, $l, ',', '"', '\\'); }
    fflush($fh);
    flock($fh, LOCK_UN);
  }
  fclose($fh);
  echo json_encode(['ok' => true, 'marcou' => $mudou]);
  exit;
}

http_response_code(400); echo '{"ok":false,"why":"op"}';
