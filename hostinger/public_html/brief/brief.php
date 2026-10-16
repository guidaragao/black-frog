<?php
/* Black Frog · recebe a BUILD SHEET (blkfrog.com/brief), o formulario que vale pra
   todo lead. A gente monta o site ANTES da pessoa pagar, entao aqui chega tudo que
   precisa pra montar: texto, ramo, logo e fotos.
   Grava PRIMEIRO em disco, fora do public_html:
     domains/blkfrog.com/bf-briefs/<id>-<negocio>/brief.json + brief.txt + arquivos
     domains/blkfrog.com/bf-briefs.csv (uma linha por brief, pra listar rapido)
   Depois avisa hello@blkfrog.com pelo Resend (manda.php do checkup) e responde a
   pessoa de Grace. Mesmo conserto do pedido.php: display_errors=0, senao aviso do
   PHP gruda na frente do JSON e o site diz "could not send" com tudo salvo. */
@ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function sai(int $code, array $j) { http_response_code($code); echo json_encode($j); exit; }
function campo(string $k, int $max = 600): string {
  $v = $_POST[$k] ?? '';
  if (is_array($v)) { $v = implode(', ', array_map('strval', $v)); }
  $v = trim(str_replace("\r", '', (string)$v));
  return mb_substr($v, 0, $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { sai(405, ['ok' => false]); }
/* post maior que o post_max_size chega com $_POST vazio: avisa em vez de dizer "name" */
if (empty($_POST) && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) { sai(413, ['ok' => false, 'why' => 'big']); }
if (campo('company') !== '') { echo '{"ok":true,"id":"0"}'; exit; }   // honeypot

$nome  = campo('name', 120);
$email = campo('email', 190);
$negoc = campo('business', 200);
if ($nome === '')                              { sai(422, ['ok' => false, 'why' => 'name']); }
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { sai(422, ['ok' => false, 'why' => 'email']); }
if (mb_strlen($negoc) < 2)                      { sai(422, ['ok' => false, 'why' => 'business']); }

/* os campos, na ordem da folha. O rotulo e o que aparece no email e no brief.txt */
$ramos = ['legal' => 'Law firm or attorney', 'health' => 'Health, clinic or wellness', 'trades' => 'Trades, home or field service',
          'restaurant' => 'Restaurant or hospitality', 'retail' => 'Retail or e-commerce', 'realestate' => 'Real estate',
          'fitness' => 'Fitness or studio', 'pro' => 'Professional services', 'other' => 'Something else'];
$folha = [
  '01 YOU' => ['name' => 'Name', 'email' => 'Email', 'phone' => 'Phone', 'reach' => 'Best way to reach'],
  '02 THE BUSINESS' => ['business' => 'Business', 'website' => 'Current site', 'social' => 'Instagram/Facebook', 'area' => 'Area served',
                        'years' => 'Years in business', 'address' => 'Address', 'hours' => 'Hours'],
  '03 WHAT YOU DO' => ['kind' => 'Industry', 'oneline' => 'One sentence', 'services' => 'Services', 'different' => 'Why they pick you',
                       'ideal' => 'Best customer'],
  '04 TRADE' => [
    'legal_areas' => 'Practice areas', 'legal_attorneys' => 'Attorneys', 'legal_bar' => 'Bar number', 'legal_langs' => 'Languages',
    'legal_consult' => 'First consultation', 'legal_contingency' => 'Contingency', 'legal_wins' => 'Results',
    'health_team' => 'Practitioners', 'health_license' => 'License', 'health_insurance' => 'Insurance', 'health_booking' => 'Booking link',
    'trades_license' => 'License', 'trades_reviews' => 'Reviews page', 'trades_offer' => 'Offers',
    'food_menu' => 'Menu', 'food_cuisine' => 'Cuisine', 'food_reserve' => 'Reservations', 'food_delivery' => 'Delivery',
    'retail_what' => 'Sells', 'retail_count' => 'Products', 'retail_online' => 'Sells online', 'retail_platform' => 'Shop platform',
    're_license' => 'License', 're_brokerage' => 'Brokerage', 're_focus' => 'Works with', 're_listings' => 'Listings',
    'fit_classes' => 'Classes', 'fit_prices' => 'Prices', 'fit_schedule' => 'Schedule', 'fit_trial' => 'Trial offer',
    'pro_creds' => 'Credentials', 'pro_booking' => 'Booking link', 'pro_clients' => 'Clients',
    'other_more' => 'Notes'],
  '05 THE ONE THING' => ['action' => 'Main button', 'action_phone' => 'Button number', 'action_link' => 'Button link'],
  '06 THE LOOK' => ['colors' => 'Colors', 'likes' => 'Sites they like', 'hates' => 'Does not want'],
  '07 PROOF' => ['reviews' => 'Reviews', 'reviews_link' => 'Google reviews', 'numbers' => 'Numbers', 'domain' => 'Owns a domain',
                 'extra' => 'Anything else'],
];
$longos = ['services', 'different', 'ideal', 'legal_wins', 'other_more', 'likes', 'hates', 'reviews', 'extra'];

$dados = [];
foreach ($folha as $sec => $cs) {
  foreach ($cs as $k => $rot) {
    $base = rtrim($k, '[]');
    $v = isset($_POST[$base . '']) ? campo($base, in_array($base, $longos, true) ? 4000 : 600) : '';
    if ($base === 'kind') { $v = $ramos[$v] ?? ''; }
    if ($v !== '') { $dados[$sec][$k] = ['label' => $rot, 'value' => $v]; }
  }
}
if (campo('colors') === 'These') {
  $cores = array_filter(array_map(function ($c) { return preg_match('/^#[0-9a-f]{6}$/i', campo($c)) ? strtoupper(campo($c)) : ''; },
                                  ['color1', 'color2', 'color3']));
  if ($cores) { $dados['06 THE LOOK']['palette'] = ['label' => 'Palette', 'value' => implode(' ', $cores)]; }
}

/* a pasta do cliente */
$ref  = preg_replace('/[^a-z0-9-]/i', '', campo('ref', 40));
$id   = gmdate('ymdHis') . '-' . substr(bin2hex(random_bytes(4)), 0, 6);
$slug = trim(preg_replace('/[^a-z0-9]+/', '-', strtolower(iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $negoc) ?: 'cliente')), '-');
$slug = substr($slug !== '' ? $slug : 'cliente', 0, 48);

$raiz = dirname(dirname(__DIR__));                     // .../domains/blkfrog.com
if (!is_writable($raiz)) { $raiz = __DIR__ . '/.dados'; @mkdir($raiz, 0750, true);
  @file_put_contents($raiz . '/.htaccess', "Require all denied\n"); }
$base_dir = $raiz . '/bf-briefs';
$dir = $base_dir . '/' . $id . '-' . $slug;
if (!@mkdir($dir, 0750, true)) { sai(500, ['ok' => false]); }
@file_put_contents($base_dir . '/.htaccess', "Require all denied\n");

/* arquivos: confere o tipo pelo conteudo, nunca pelo nome que veio */
$aceito = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif', 'image/heic' => 'heic',
           'image/heif' => 'heif', 'image/svg+xml' => 'svg', 'application/pdf' => 'pdf', 'image/avif' => 'avif'];
$fi = class_exists('finfo') ? new finfo(FILEINFO_MIME_TYPE) : null;
$salvos = []; $recusados = 0;
function guarda($tmp, $nomeorig, $prefixo, $n) {
  global $fi, $aceito, $dir, $salvos, $recusados;
  if (!is_uploaded_file($tmp)) { $recusados++; return; }
  $mime = $fi ? $fi->file($tmp) : mime_content_type($tmp);
  if ($mime === 'text/xml' || $mime === 'text/plain') {          // svg as vezes vem assim
    $cab = (string)@file_get_contents($tmp, false, null, 0, 2000);
    if (stripos($cab, '<svg') !== false) { $mime = 'image/svg+xml'; }
  }
  if (!isset($aceito[$mime]) || filesize($tmp) > 26e6) { $recusados++; return; }
  $limpo = substr(trim(preg_replace('/[^a-z0-9]+/', '-', strtolower(pathinfo($nomeorig, PATHINFO_FILENAME))), '-'), 0, 40);
  $nome = sprintf('%s-%02d%s.%s', $prefixo, $n, $limpo !== '' ? '-' . $limpo : '', $aceito[$mime]);
  if (@move_uploaded_file($tmp, $dir . '/' . $nome)) { @chmod($dir . '/' . $nome, 0640); $salvos[] = $nome; } else { $recusados++; }
}
if (!empty($_FILES['logo']['tmp_name']) && is_string($_FILES['logo']['tmp_name'])) {
  guarda($_FILES['logo']['tmp_name'], $_FILES['logo']['name'], 'logo', 1);
}
if (!empty($_FILES['photos']['tmp_name']) && is_array($_FILES['photos']['tmp_name'])) {
  foreach (array_slice($_FILES['photos']['tmp_name'], 0, 12) as $i => $tmp) {
    if ($tmp === '' || ($_FILES['photos']['error'][$i] ?? 1) !== UPLOAD_ERR_OK) { $recusados++; continue; }
    guarda($tmp, $_FILES['photos']['name'][$i], 'foto', $i + 1);
  }
}

/* o brief em texto: e isso que a gente abre pra montar o site */
$quando = gmdate('Y-m-d H:i:s') . ' UTC';
$txt = "BLACK FROG · BUILD SHEET\nId: {$id}" . ($ref !== '' ? "  (pedido {$ref})" : '') . "\nQuando: {$quando}\n";
foreach ($dados as $sec => $cs) {
  $txt .= "\n{$sec}\n";
  foreach ($cs as $c) {
    $v = strpos($c['value'], "\n") !== false ? "\n    " . str_replace("\n", "\n    ", $c['value']) : $c['value'];
    $txt .= '  ' . str_pad($c['label'] . ':', 20) . $v . "\n";
  }
}
$txt .= "\nARQUIVOS (" . count($salvos) . ")\n" . ($salvos ? '  ' . implode("\n  ", $salvos) : '  nenhum') . "\n";
if ($recusados) { $txt .= "  ({$recusados} arquivo(s) recusado(s): tipo ou tamanho)\n"; }
$txt .= "\nPasta no servidor: domains/blkfrog.com/bf-briefs/" . basename($dir) . "\n";

$json = ['id' => $id, 'ref' => $ref, 'when' => $quando, 'status' => 'novo', 'files' => $salvos, 'sheet' => $dados,
         'ip' => substr($_SERVER['REMOTE_ADDR'] ?? '', 0, 45), 'ua' => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 200)];
$salvou = @file_put_contents($dir . '/brief.json', json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) !== false;
@file_put_contents($dir . '/brief.txt', $txt);
@chmod($dir . '/brief.json', 0640); @chmod($dir . '/brief.txt', 0640);

$linha = [$quando, $id, $ref, 'novo', $nome, $email, $negoc, campo('phone', 40), $dados['03 WHAT YOU DO']['kind']['value'] ?? '',
          count($salvos), basename($dir)];
$fh = @fopen($raiz . '/bf-briefs.csv', 'a');
if ($fh) { if (flock($fh, LOCK_EX)) { fputcsv($fh, $linha, ',', '"', '\\'); flock($fh, LOCK_UN); } fclose($fh); @chmod($raiz . '/bf-briefs.csv', 0640); }

if (!$salvou) { sai(500, ['ok' => false]); }

/* avisa a casa e responde a pessoa. Sem o manda.php (localhost) so grava. */
$mandou = false; $respondeu = false; $porque = null;
$manda = dirname(__DIR__) . '/checkup/manda.php';
if (is_readable($manda)) {
  require_once $manda;
  $mandou = bf_manda('Black Frog: BUILD SHEET chegou, ' . $negoc . ' (' . count($salvos) . ' arquivos)', $txt, $email, $porque);
  $respondeu = bf_brief_resposta($nome, $email, $negoc, $id);
}

echo json_encode(['ok' => true, 'id' => $id, 'files' => count($salvos), 'refused' => $recusados, 'mailed' => $mandou, 'replied' => $respondeu]);

/* a resposta pra pessoa: curta, de Grace, mesmo visual do email do checkup */
function bf_brief_resposta(string $nome, string $email, string $negocio, string $id): bool {
  $env = dirname(dirname(__DIR__)) . '/bf-resend.env';
  if (!is_readable($env)) { return false; }
  $key = trim(preg_replace('/^RESEND_KEY=/', '', trim(file_get_contents($env))));
  if ($key === '') { return false; }
  $p = htmlspecialchars(trim(explode(' ', trim($nome))[0]), ENT_QUOTES, 'UTF-8');
  $n = htmlspecialchars($negocio, ENT_QUOTES, 'UTF-8');
  $F = '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif';
  $html = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2F0;padding:28px 0"><tr><td align="center">'
    . '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff">'
    . '<tr><td style="padding:26px 36px;background:#0D0D0D"><img src="https://blkfrog.com/assets/logo-email.png" width="150" height="41" alt="BLACK FROG" style="display:block;border:0;font:700 20px/41px ' . $F . ';color:#A6FF00"></td></tr>'
    . '<tr><td style="padding:34px 36px 38px">'
    . '<p style="margin:0;font:700 24px/1.25 ' . $F . ';color:#0D0D0D">Thanks, ' . $p . '. We have everything we need to start.</p>'
    . '<p style="margin:18px 0 0;font:16px/1.6 ' . $F . ';color:#333">Your build sheet for <b>' . $n . '</b> is in. We start the first version of your site from it, and it comes to your phone or inbox. If something is missing, we ask once, short.</p>'
    . '<p style="margin:18px 0 0;font:16px/1.6 ' . $F . ';color:#333">You pay nothing unless you like it.</p>'
    . '<p style="margin:26px 0 0;font:15.5px/1.55 ' . $F . ';color:#333">Want to add a photo or fix something? Just reply to this email.<br><br>Grace<br><span style="color:#6B6B6B">Black Frog · Design &amp; Digital Solutions</span></p>'
    . '<p style="margin:26px 0 0;font:12px/1.5 ' . $F . ';color:#9A9A9A">Sheet no. ' . htmlspecialchars(strtoupper(substr($id, -6)), ENT_QUOTES, 'UTF-8') . '</p>'
    . '</td></tr></table></td></tr></table>';
  $corpo = ['from' => 'Grace at Black Frog <hello@blkfrog.com>', 'to' => [$email], 'reply_to' => 'hello@blkfrog.com',
            'subject' => 'Got your build sheet, ' . trim(explode(' ', trim($nome))[0]) . '. Your site is next.', 'html' => $html];
  $ch = curl_init('https://api.resend.com/emails');
  curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $key, 'Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode($corpo)]);
  $r = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
  return $r !== false && $code >= 200 && $code < 300;
}
