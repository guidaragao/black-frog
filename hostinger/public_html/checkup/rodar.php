<?php
/* ============================================================
   BLACK FROG · O ROBO DO CHECKUP, EM PHP, DENTRO DO SERVIDOR
   ------------------------------------------------------------
   Mesma logica do BFCHECKUP0001 do n8n, sem depender do Air:
   fila -> audita o site -> Claude escreve -> email -> marca feito.

   Roda de dois jeitos:
     php rodar.php                 (cron do hPanel)
     GET rodar.php?key=<a chave>   (para disparar na mao)

   Credenciais em ../../bf-robo.env, fora do public_html, 600.
   ============================================================ */
@ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
set_time_limit(300);

$CLI  = (php_sapi_name() === 'cli');
$BASE = dirname(dirname(__DIR__));           // .../domains/blkfrog.com
$CSV  = $BASE . '/bf-checkup.csv';
$ENV  = $BASE . '/bf-robo.env';
$LOG  = $BASE . '/bf-robo.log';

function dizer($t) {
  global $LOG, $CLI;
  $linha = gmdate('Y-m-d H:i:s') . ' UTC  ' . $t;
  @file_put_contents($LOG, $linha . "\n", FILE_APPEND | LOCK_EX);
  if ($CLI) { echo $linha . "\n"; }
}

/* ---------- so roda por cron, ou com a chave certa ---------- */
$env = [];
foreach (@file($ENV, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $l) {
  if ($l[0] === '#' || strpos($l, '=') === false) continue;
  list($k, $v) = explode('=', $l, 2);
  $env[trim($k)] = trim($v);
}
if (!$CLI) {
  header('Content-Type: application/json; charset=utf-8');
  header('X-Robots-Tag: noindex, nofollow');
  $chaveF = $BASE . '/bf-checkup.key';
  $esperada = is_readable($chaveF) ? trim((string)file_get_contents($chaveF)) : '';
  if ($esperada === '' || !hash_equals($esperada, (string)($_GET['key'] ?? ''))) {
    http_response_code(403); echo '{"ok":false,"why":"key"}'; exit;
  }
}
if (empty($env['ANTHROPIC_KEY'])) { dizer('SEM ANTHROPIC_KEY no bf-robo.env, parei'); if(!$CLI) echo '{"ok":false,"why":"env"}'; exit(1); }

/* ---------- 1. pega o lead mais antigo que ainda esta pendente ---------- */
function ler_csv($arquivo) {
  $out = [];
  if (!is_readable($arquivo)) return $out;
  $fh = fopen($arquivo, 'r');
  if (!$fh) return $out;
  if (flock($fh, LOCK_SH)) {
    while (($l = fgetcsv($fh, 0, ',', '"', '\\')) !== false) { if (count($l) >= 6) $out[] = $l; }
    flock($fh, LOCK_UN);
  }
  fclose($fh);
  return $out;
}
$lead = null;
foreach (ler_csv($CSV) as $l) {
  if (($l[2] ?? '') !== 'pendente') continue;
  $site = trim($l[5] ?? '');
  if ($site === '') continue;
  if (!preg_match('#^https?://#i', $site)) $site = 'https://' . $site;
  $nome = trim($l[3] ?? '');
  $lead = [
    'id' => $l[1], 'nome' => $nome ?: 'there',
    'primeiro' => explode(' ', $nome ?: 'there')[0],
    'email' => trim($l[4] ?? ''), 'ramo' => trim($l[6] ?? ''),
    'site' => $site, 'host' => preg_replace('#^https?://|/.*$#i', '', $site),
  ];
  break;
}
if (!$lead) { dizer('fila vazia, nada a fazer'); if(!$CLI) echo '{"ok":true,"fila":"vazia"}'; exit(0); }
dizer('peguei ' . $lead['id'] . ' -> ' . $lead['site']);

/* ---------- 2. audita o site como um celular faria ---------- */
$ch = curl_init($lead['site']);
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true, CURLOPT_FOLLOWLOCATION => true, CURLOPT_MAXREDIRS => 5,
  CURLOPT_TIMEOUT => 30, CURLOPT_CONNECTTIMEOUT => 15, CURLOPT_SSL_VERIFYPEER => false,
  CURLOPT_USERAGENT => 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  CURLOPT_HTTPHEADER => ['Accept-Language: en-US,en;q=0.9'],
]);
$html   = (string)curl_exec($ch);
$status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
$tempo  = round((float)curl_getinfo($ch, CURLINFO_STARTTRANSFER_TIME), 2);
$erroC  = curl_error($ch);
curl_close($ch);
$noAr = ($status >= 200 && $status < 500 && strlen($html) > 200);
dizer($noAr ? "site respondeu $status em {$tempo}s" : "site NAO respondeu ($status) $erroC");

/* ---------- 3. extrai os sinais ---------- */
function tem($re, $h) { return (bool)preg_match($re, $h); }
function pega($re, $h) { return preg_match($re, $h, $m) ? trim($m[1]) : ''; }
$title = pega('#<title[^>]*>(.*?)</title>#is', $html);
$desc  = pega('#<meta[^>]+name=["\']?description["\']?[^>]+content=["\'](.*?)["\']#is', $html);
$imgs  = preg_match_all('#<img[^>]*>#i', $html, $mi) ? $mi[0] : [];
$semAlt = 0; $semLazy = 0;
foreach ($imgs as $i) { if (!preg_match('#\balt=#i', $i)) $semAlt++; if (!preg_match('#loading=["\']?lazy#i', $i)) $semLazy++; }
$texto = preg_replace('#<(script|style)[^>]*>.*?</\1>#is', ' ', $html);
$texto = trim(preg_replace('#\s+#', ' ', strip_tags($texto)));
$palavras = $texto === '' ? 0 : count(explode(' ', $texto));
$h1 = preg_match_all('#<h1[^>]*>(.*?)</h1>#is', $html, $m1) ? array_map(fn($x) => trim(strip_tags($x)), array_slice($m1[1], 0, 3)) : [];
$h2 = preg_match_all('#<h2[^>]*>(.*?)</h2>#is', $html, $m2) ? array_map(fn($x) => trim(strip_tags($x)), array_slice($m2[1], 0, 8)) : [];
$hostLimpo = strtolower(preg_replace('#^www\.#', '', $lead['host']));
$tituloPreguicoso = $title !== '' && strlen($title) < 40 && strpos(strtolower(preg_replace('#^www\.#', '', $title)), $hostLimpo) === 0;

$sinais = [
  'site' => $lead['site'], 'sectorTheyTyped' => $lead['ramo'] ?: 'not given',
  'reachable' => $noAr, 'httpStatus' => $status, 'timeToFirstByteSeconds' => $tempo,
  'https' => (bool)preg_match('#^https://#i', $lead['site']),
  'pageTitle' => $title, 'titleIsJustTheDomain' => $tituloPreguicoso,
  'metaDescription' => $desc ?: null,
  'hasSharePreviewImage' => tem('#property=["\']og:image#i', $html),
  'mobileViewport' => tem('#<meta[^>]+name=["\']?viewport#i', $html),
  'clickablePhone' => tem('#href=["\']tel:#i', $html),
  'emailLink' => tem('#href=["\']mailto:#i', $html),
  'whatsapp' => tem('#wa\.me|api\.whatsapp#i', $html),
  'contactForm' => tem('#<form#i', $html),
  'onlineBooking' => tem('#calendly|cal\.com|acuity|booksy|zenoti|vagaro|boulevard#i', $html),
  'analytics' => tem('#gtag\(|googletagmanager|fbq\(#i', $html),
  'structuredData' => tem('#application/ld\+json#i', $html),
  'images' => count($imgs), 'imagesWithoutAltText' => $semAlt, 'imagesLoadingAllAtOnce' => $semLazy,
  'visibleWordCount' => $palavras, 'h1' => $h1, 'h2' => $h2,
  'externalScripts' => preg_match_all('#<script[^>]+src=#i', $html),
  'htmlSizeBytes' => strlen($html),
];

/* ---------- 4. Claude escreve o diagnostico ---------- */
$instrucao = <<<TXT
You are the website consultant at Black Frog, a marketing and technology house that builds fast modern websites, apps and automation for businesses in any sector. Someone asked for a free website checkup and you actually opened their site on a phone. Write the body of the email you send back.

Rules:
- Write in English, first person, plain and direct. No hype, no jargon, no emoji.
- Never use an em dash or an en dash. Use a comma or a full stop.
- Never guess their industry from the domain name. Use only what the signals below show. If the content does not say what they do, do not invent it.
- Never mention Vander Media Group or any other agency.
- Do not sell. One soft line at the end is enough.
- Be specific and honest. Name the problem, say why it costs them work, in business terms, not technical ones. If something is genuinely good, say so.

Structure, exactly:
WHAT I SAW: two or three sentences on the first impression, as their customer would get it.
WHAT IS COSTING YOU: three to five bullets, most damaging first. Start every bullet with a hyphen and a space, never any other symbol. Each bullet: the finding, then the consequence.
WHAT I WOULD FIX FIRST: two or three numbered items, in order, each one sentence.
WHAT IS ALREADY WORKING: one or two bullets, same hyphen rule. If nothing works, say the site is a rebuild and why.
Finish with a single line offering to do the first item, no pressure.
On the very last line, alone, write TIER: QUICK if a few fixes solve it, TIER: DEEP if it needs a rebuild, TIER: NONE if the site is genuinely fine.
Do not sign the email, the template signs it.
TXT;

$corpoReq = json_encode([
  'model' => 'claude-haiku-4-5-20251001',
  'max_tokens' => 1600,
  'messages' => [['role' => 'user', 'content' => $instrucao . "\n\nHere is the site and what I measured.\n" . json_encode($sinais, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)]],
]);
$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true, CURLOPT_POST => true, CURLOPT_POSTFIELDS => $corpoReq,
  CURLOPT_TIMEOUT => 180,
  CURLOPT_HTTPHEADER => ['content-type: application/json', 'anthropic-version: 2023-06-01', 'x-api-key: ' . $env['ANTHROPIC_KEY']],
]);
$respJson = (string)curl_exec($ch);
$httpIA = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
$resp = json_decode($respJson, true);
$texto_md = '';
foreach (($resp['content'] ?? []) as $b) { if (($b['type'] ?? '') === 'text') $texto_md .= $b['text']; }
if ($httpIA !== 200 || trim($texto_md) === '') {
  dizer("Claude falhou (HTTP $httpIA): " . substr($respJson, 0, 200));
  if (!$CLI) echo '{"ok":false,"why":"claude"}';
  exit(1);
}

/* ---------- 5. monta o email ---------- */
$md = trim(str_replace(['—', '–'], ',', $texto_md));
$tier = 'NONE';
if (preg_match('#\n?\s*TIER:\s*(QUICK|DEEP|NONE)\s*\.?\s*$#i', $md, $mt)) {
  $tier = strtoupper($mt[1]);
  $md = trim(preg_replace('#\n?\s*TIER:\s*(QUICK|DEEP|NONE)\s*\.?\s*$#i', '', $md));
}
$corpoHtml = ''; $lista = null;
foreach (explode("\n", $md) as $linha) {
  $l = trim($linha);
  if ($l === '') continue;
  if (preg_match('#^(WHAT I SAW|WHAT IS COSTING YOU|WHAT I WOULD FIX FIRST|WHAT IS ALREADY WORKING)\s*:?\s*(.*)$#i', $l, $mc)) {
    if ($lista) { $corpoHtml .= "</$lista>"; $lista = null; }
    $corpoHtml .= '<h2 style="margin:28px 0 10px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#6B6B6B;font-family:ui-monospace,Menlo,monospace;font-weight:500">' . htmlspecialchars($mc[1]) . '</h2>';
    if ($mc[2] !== '') $corpoHtml .= '<p>' . htmlspecialchars($mc[2]) . '</p>';
    continue;
  }
  if (preg_match('#^[-*\x{2022}\x{00b7}\x{2027}\x{2219}\x{25cf}.]\s+(.*)$#u', $l, $mb)) {
    if ($lista !== 'ul') { if ($lista) $corpoHtml .= "</$lista>"; $corpoHtml .= '<ul>'; $lista = 'ul'; }
    $corpoHtml .= '<li>' . htmlspecialchars($mb[1]) . '</li>';
  } elseif (preg_match('#^(\d+)[.)]\s+(.*)$#', $l, $mn)) {
    if ($lista !== 'ol') { if ($lista) $corpoHtml .= "</$lista>"; $corpoHtml .= '<ol>'; $lista = 'ol'; }
    $corpoHtml .= '<li>' . htmlspecialchars($mn[2]) . '</li>';
  } else {
    if ($lista) { $corpoHtml .= "</$lista>"; $lista = null; }
    $corpoHtml .= '<p>' . htmlspecialchars($l) . '</p>';
  }
}
if ($lista) $corpoHtml .= "</$lista>";

$html_email =
'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
. '<body style="margin:0;background:#EFEFEC;font:16px/1.6 -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;color:#171717">'
. '<div style="max-width:640px;margin:0 auto;background:#fff">'
. '<div style="background:#0D0D0D;padding:26px 32px">'
. '<div style="font:700 20px/1 Helvetica Neue,Arial,sans-serif;color:#fff;letter-spacing:-.02em">black <span style="color:#A6FF00">frog.</span></div>'
. '<p style="margin:9px 0 0;font:500 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.22em;text-transform:uppercase;color:#A6FF00">Free website checkup</p>'
. '</div><div style="padding:32px">'
. '<h1 style="margin:0 0 18px;font-size:21px;line-height:1.25;letter-spacing:-.02em">Hi ' . htmlspecialchars($lead['primeiro']) . ', here is what I found on your site.</h1>'
. '<div style="display:inline-block;background:#F2F2EE;border-left:3px solid #A6FF00;padding:10px 14px;font:500 14px ui-monospace,Menlo,monospace;margin:0 0 22px;word-break:break-all">' . htmlspecialchars($lead['host']) . '</div>'
. $corpoHtml
. '<p style="margin:26px 0 0"><a href="https://blkfrog.com/checkup/" style="display:inline-block;background:#A6FF00;color:#0D0D0D;text-decoration:none;padding:15px 26px;font:500 12px ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase">Talk to us</a></p>'
. '</div><div style="padding:22px 32px 30px;border-top:1px solid #E6E6E1;color:#7A7A7A;font-size:13px">'
. '<b>Black Frog</b> &middot; <a href="mailto:hello@blkfrog.com" style="color:#171717">hello@blkfrog.com</a><br>'
. 'You got this because you asked for a free website checkup.'
. '</div></div></body></html>';

$assunto = ($noAr ? '' : '[SITE NAO RESPONDEU] ') . '[revisar antes de enviar] A few things I noticed on ' . $lead['host'] . '  (' . $tier . ')';

/* ---------- 6. manda pelo SMTP do Resend (o mail() do dominio nao passa no SPF) ---------- */
require_once __DIR__ . '/smtp.php';
$para = ['vandermedgroup@gmail.com', 'ingridaragao@gmail.com', 'hello@vadmediagroup.com'];
$enviou = smtp_enviar($env, 'Black Frog (revisao) <hello@vadmediagroup.com>', $para, $assunto, $html_email, $motivo);
dizer($enviou ? 'email enviado: ' . $assunto : 'FALHOU o email: ' . $motivo);

/* ---------- 7. marca na fila, so se o email saiu ---------- */
if ($enviou) {
  $fh = fopen($CSV, 'c+');
  if ($fh && flock($fh, LOCK_EX)) {
    $linhas = [];
    while (($l = fgetcsv($fh, 0, ',', '"', '\\')) !== false) {
      if (count($l) < 6) continue;
      if (($l[1] ?? '') === $lead['id'] && ($l[2] ?? '') === 'pendente') $l[2] = 'diagnosticado ' . gmdate('Y-m-d H:i') . ' UTC';
      $linhas[] = $l;
    }
    ftruncate($fh, 0); rewind($fh);
    foreach ($linhas as $l) fputcsv($fh, $l, ',', '"', '\\');
    fflush($fh); flock($fh, LOCK_UN); fclose($fh);
    dizer('marcado como diagnosticado: ' . $lead['id']);
  }
}
if (!$CLI) echo json_encode(['ok' => $enviou, 'lead' => $lead['id'], 'site' => $lead['site'], 'tier' => $tier]);
