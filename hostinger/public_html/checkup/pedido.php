<?php
/* Black Frog · recebe o PEDIDO DE SITE ("show me mine first", blkfrog.com/checkup).
   Irmao do checkup.php: grava PRIMEIRO em arquivo (bf-pedidos.csv, fora do
   public_html), depois avisa por email. Nao passa pelo robo do checkup: quem pede
   site nao quer diagnostico, quer o mockup. Arquivo separado do bf-checkup.csv. */
@ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"ok":false}'; exit; }

$nome   = trim($_POST['name']     ?? '');
$email  = trim($_POST['email']    ?? '');
$negoc  = trim($_POST['business'] ?? '');   // nome do negocio OU site atual, o que ele tiver
$fone   = trim($_POST['phone']    ?? '');
$ramo   = trim($_POST['kind']     ?? '');
$trap   = trim($_POST['company']  ?? '');   // honeypot: humano nunca preenche
$lang   = (($_POST['lang'] ?? '') === 'pt') ? 'pt' : 'en';   // o form de /checkup/pt manda lang=pt

if ($trap !== '') { echo '{"ok":true}'; exit; }

if ($nome === '' || strlen($nome) > 120) { http_response_code(422); echo '{"ok":false,"why":"name"}'; exit; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
  http_response_code(422); echo '{"ok":false,"why":"email"}'; exit;
}
if ($negoc === '' || strlen($negoc) > 200) { http_response_code(422); echo '{"ok":false,"why":"business"}'; exit; }
if (strlen($fone) > 40) { $fone = substr($fone, 0, 40); }
if (strlen($ramo) > 80) { $ramo = substr($ramo, 0, 80); }

$fora       = dirname(dirname(__DIR__)) . '/bf-pedidos.csv';
$dentro_dir = __DIR__ . '/.leads';
$destino    = null;
if (is_writable(dirname($fora))) {
  $destino = $fora;
} else {
  if (!is_dir($dentro_dir)) { @mkdir($dentro_dir, 0755, true); }
  @file_put_contents($dentro_dir . '/.htaccess', "Require all denied\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n");
  $destino = $dentro_dir . '/pedidos.csv';
}

$id = gmdate('ymdHis') . '-' . substr(bin2hex(random_bytes(4)), 0, 6);
$linha = [gmdate('Y-m-d H:i:s') . ' UTC', $id, 'novo', $nome, $email, $negoc, $fone, $ramo,
          substr($_SERVER['REMOTE_ADDR'] ?? '', 0, 45), substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 200)];

$salvou = false;
$fh = @fopen($destino, 'a');
if ($fh) {
  if (flock($fh, LOCK_EX)) { fputcsv($fh, $linha, ',', '"', '\\'); flock($fh, LOCK_UN); $salvou = true; }
  fclose($fh);
  @chmod($destino, 0640);
}

$para    = 'hello@blkfrog.com';
$assunto = 'Black Frog: PEDIDO DE SITE' . ($lang === 'pt' ? ' (BRASIL)' : '') . ', ' . $negoc;
$corpo   = "Alguem pediu pra ver o site dele primeiro (oferta dos \$797).\n\n"
         . "Nome:     {$nome}\n"
         . "Email:    {$email}\n"
         . "Negocio:  {$negoc}\n"
         . "WhatsApp: " . ($fone !== '' ? $fone : 'nao deu') . "\n"
         . "Ramo:     " . ($ramo !== '' ? $ramo : 'nao informou') . "\n"
         . "Quando:   {$linha[0]}\n"
         . "Id:       {$id}\n";
$cab     = "From: Black Frog <no-reply@blkfrog.com>\r\n"
         . "Reply-To: {$nome} <{$email}>\r\n"
         . "Content-Type: text/plain; charset=utf-8\r\n";
$mandou = false;
require_once __DIR__ . '/manda.php';
$via = 'resend'; $mandou = bf_manda($assunto, $corpo, $email ?? '', $porque);
if (!$mandou && function_exists('mail')) { $via = 'mail'; $mandou = @mail($para, $assunto, $corpo, $cab); }

/* se a pessoa escreveu um SITE que ja existe, o robo do checkup le ele tambem:
   entra na mesma fila do checkup.php, mesmo formato de linha, id proprio. */
$checkup = false;
if (preg_match('#^(https?://)?([a-z0-9-]+\.)+[a-z]{2,}(/\S*)?$#i', $negoc) && strpos($negoc, ' ') === false) {
  $url = preg_match('#^https?://#i', $negoc) ? $negoc : 'https://' . $negoc;
  $fc = dirname(dirname(__DIR__)) . '/bf-checkup.csv';
  $cid = gmdate('ymdHis') . '-' . substr(bin2hex(random_bytes(4)), 0, 6);
  $lc = [gmdate('Y-m-d H:i:s') . ' UTC', $cid, 'pendente', $nome, $email, $url, $ramo,
         substr($_SERVER['REMOTE_ADDR'] ?? '', 0, 45), substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 200)];
  $fh2 = @fopen($fc, 'a');
  if ($fh2) { if (flock($fh2, LOCK_EX)) { fputcsv($fh2, $lc, ',', '"', '\\'); flock($fh2, LOCK_UN); $checkup = true; } fclose($fh2); @chmod($fc, 0640); }
}

/* a resposta automatica pro cliente: sai na hora, de Grace, dizendo o que acontece agora */
require_once __DIR__ . '/resposta.php';
$respondeu = $salvou ? bf_resposta($nome, $email, $negoc, $checkup, $porque2, $lang) : false;

if (!$salvou && !$mandou) { http_response_code(500); echo '{"ok":false}'; exit; }
echo json_encode(['ok' => true, 'id' => $id, 'saved' => $salvou, 'mailed' => $mandou, 'via' => $via, 'checkup' => $checkup, 'replied' => $respondeu]);
