<?php
/* Black Frog · recebe o pedido de checkup (blkfrog.com/checkup).
   Mesma regra do lead.php do cartao: o lead NUNCA se perde. Grava em arquivo
   PRIMEIRO, depois tenta o email. Arquivo separado do cartao (bf-checkup.csv)
   pra nao misturar quem pediu checkup com quem so deixou email.
   NAO pendurar no capture-lead da VMG: lead da BF nao entra no funil da VMG. */
/* nenhum aviso do PHP pode vazar pra dentro do JSON: o navegador le a resposta
   como texto quebrado e diz 'nao deu' pro cliente mesmo com o lead salvo. */
@ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"ok":false}'; exit; }

$nome  = trim($_POST['name']  ?? '');
$email = trim($_POST['email'] ?? '');
$site  = trim($_POST['site']  ?? '');
$ramo  = trim($_POST['kind']  ?? '');
$trap  = trim($_POST['company'] ?? '');          // honeypot: humano nunca preenche

if ($trap !== '') { echo '{"ok":true}'; exit; }  // robo: finge que deu certo

if ($nome === '' || strlen($nome) > 120) { http_response_code(422); echo '{"ok":false,"why":"name"}'; exit; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
  http_response_code(422); echo '{"ok":false,"why":"email"}'; exit;
}
if (strlen($site) < 4 || strlen($site) > 300 || strpos($site, '.') === false) {
  http_response_code(422); echo '{"ok":false,"why":"site"}'; exit;
}
/* normaliza a URL pra chegar clicavel no email */
$url = preg_match('#^https?://#i', $site) ? $site : 'https://' . $site;
if (strlen($ramo) > 80) { $ramo = substr($ramo, 0, 80); }

/* onde guardar: fora do public_html se der, senao numa pasta trancada */
$fora       = dirname(dirname(__DIR__)) . '/bf-checkup.csv';
$dentro_dir = __DIR__ . '/.leads';
$destino    = null;

if (is_writable(dirname($fora))) {
  $destino = $fora;
} else {
  if (!is_dir($dentro_dir)) { @mkdir($dentro_dir, 0755, true); }
  @file_put_contents($dentro_dir . '/.htaccess', "Require all denied\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n");
  $destino = $dentro_dir . '/checkup.csv';
}

/* id proprio: e por ele que o robo marca o lead como diagnosticado depois */
$id = gmdate('ymdHis') . '-' . substr(bin2hex(random_bytes(4)), 0, 6);

$linha = [
  gmdate('Y-m-d H:i:s') . ' UTC',
  $id,
  'pendente',
  $nome,
  $email,
  $url,
  $ramo,
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
$assunto = 'Black Frog: pedido de checkup, ' . $url;
$corpo   = "Alguem pediu o Free Website Checkup.\n\n"
         . "Nome:  {$nome}\n"
         . "Email: {$email}\n"
         . "Site:  {$url}\n"
         . "Ramo:  " . ($ramo !== '' ? $ramo : 'nao informou') . "\n"
         . "Quando: {$linha[0]}\n"
         . "IP: {$linha[7]}\n";
$cab     = "From: Black Frog <no-reply@blkfrog.com>\r\n"
         . "Reply-To: {$nome} <{$email}>\r\n"
         . "Content-Type: text/plain; charset=utf-8\r\n";
$mandou = false;
require_once __DIR__ . '/manda.php';
$via = 'resend'; $mandou = bf_manda($assunto, $corpo, $email ?? '', $porque);
if (!$mandou && function_exists('mail')) { $via = 'mail'; $mandou = @mail($para, $assunto, $corpo, $cab); }

/* dispara o robo NA HORA, sem segurar a resposta do formulario.
   Primeira tentativa foi proc_open e ficou ruim: o processo filho herda a
   conexao, entao o navegador ficava esperando ele terminar e o formulario
   parecia travado. O jeito certo e uma chamada HTTP a si mesmo com timeout
   curtissimo: dispara, desiste de esperar, e o servidor segue processando. */
if ($salvou) {
  $chaveF = dirname(dirname(__DIR__)) . '/bf-checkup.key';
  $k = is_readable($chaveF) ? trim((string)file_get_contents($chaveF)) : '';
  if ($k !== '') {
    $c = curl_init('https://blkfrog.com/checkup/rodar.php?key=' . urlencode($k));
    curl_setopt_array($c, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_TIMEOUT_MS => 400,        // dispara e larga
      CURLOPT_NOSIGNAL => 1,
      CURLOPT_SSL_VERIFYPEER => false,
    ]);
    @curl_exec($c);
    @curl_close($c);
  }
}

if (!$salvou && !$mandou) { http_response_code(500); echo '{"ok":false}'; exit; }
echo json_encode(['ok' => true, 'id' => $id, 'saved' => $salvou, 'mailed' => $mandou, 'via' => $via]);
