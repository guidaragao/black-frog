<?php
/* Black Frog · recebe o email do cartao.
   Regra: o lead NUNCA se perde. Grava em arquivo PRIMEIRO, depois tenta o email.
   Se o email falhar, ainda responde ok, porque a linha ja esta salva no servidor. */
/* nenhum aviso do PHP pode vazar pra dentro do JSON: o navegador le a resposta
   como texto quebrado e diz 'nao deu' pro cliente mesmo com o lead salvo. */
@ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"ok":false}'; exit; }

$email = trim($_POST['email'] ?? '');
$trap  = trim($_POST['company'] ?? '');          // honeypot: humano nunca preenche

if ($trap !== '') { echo '{"ok":true}'; exit; }  // robo: finge que deu certo
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
  http_response_code(422); echo '{"ok":false,"why":"email"}'; exit;
}

/* onde guardar: fora do public_html se der, senao numa pasta trancada */
$fora  = dirname(__DIR__) . '/bf-leads.csv';
$dentro_dir = __DIR__ . '/.leads';
$destino = null;

if (is_writable(dirname($fora))) {
  $destino = $fora;
} else {
  if (!is_dir($dentro_dir)) { @mkdir($dentro_dir, 0755, true); }
  @file_put_contents($dentro_dir . '/.htaccess', "Require all denied\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n");
  $destino = $dentro_dir . '/leads.csv';
}

$linha = [
  gmdate('Y-m-d H:i:s') . ' UTC',
  $email,
  substr($_SERVER['REMOTE_ADDR'] ?? '', 0, 45),
  substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 200),
];

$salvou = false;
$fh = @fopen($destino, 'a');
if ($fh) {
  if (flock($fh, LOCK_EX)) { fputcsv($fh, $linha, ',', '"', '\\'); flock($fh, LOCK_UN); $salvou = true; }
  fclose($fh);
  @chmod($destino, 0640);
}

/* aviso por email. Remetente do proprio dominio, senao o servidor recusa. */
$para    = 'hello@blkfrog.com';
$assunto = 'Black Frog: novo email no cartao';
$corpo   = "Alguem deixou o email na pagina de coming soon.\n\n"
         . "Email: {$email}\n"
         . "Quando: {$linha[0]}\n"
         . "IP: {$linha[2]}\n";
$cab     = "From: Black Frog <no-reply@blkfrog.com>\r\n"
         . "Reply-To: {$email}\r\n"
         . "Content-Type: text/plain; charset=utf-8\r\n";
$mandou = false;
require_once __DIR__ . '/checkup/manda.php';
$via = 'resend'; $mandou = bf_manda($assunto, $corpo, $email ?? '', $porque);
if (!$mandou && function_exists('mail')) { $via = 'mail'; $mandou = @mail($para, $assunto, $corpo, $cab); }

if (!$salvou && !$mandou) { http_response_code(500); echo '{"ok":false}'; exit; }
echo json_encode(['ok' => true, 'saved' => $salvou, 'mailed' => $mandou, 'via' => $via]);
