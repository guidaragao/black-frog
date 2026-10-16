<?php
/* Black Frog · o aviso de formulario sai pelo Resend (API HTTP), nunca pelo mail().
   O mail() da Hostinger sai de um servidor que o SPF do blkfrog.com nao autoriza, e o
   Gmail descarta em silencio: dizia "mailed":true e ninguem recebia (11/09).
   A chave fica em domains/blkfrog.com/bf-resend.env (fora do public_html, chmod 600). */
function bf_manda(string $assunto, string $corpo, string $replyTo = '', &$motivo = null): bool {
  $env = dirname(dirname(__DIR__)) . '/bf-resend.env';           // .../domains/blkfrog.com/bf-resend.env
  if (!is_readable($env)) { $env = dirname(__DIR__) . '/bf-resend.env'; }   // quando chamado da raiz
  if (!is_readable($env)) { $motivo = 'sem bf-resend.env'; return false; }
  $key = trim(preg_replace('/^RESEND_KEY=/', '', trim(file_get_contents($env))));
  if ($key === '') { $motivo = 'chave vazia'; return false; }
  $html = '<pre style="font:15px/1.5 -apple-system,Segoe UI,sans-serif;white-space:pre-wrap;color:#111">'
        . htmlspecialchars($corpo, ENT_QUOTES, 'UTF-8') . '</pre>';
  $dados = ['from' => 'Black Frog <hello@blkfrog.com>', 'to' => ['hello@blkfrog.com'],
            'cc' => ['ingridaragao@gmail.com'], 'subject' => $assunto, 'html' => $html, 'text' => $corpo];
  if ($replyTo !== '' && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) { $dados['reply_to'] = $replyTo; }
  $ch = curl_init('https://api.resend.com/emails');
  curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $key, 'Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode($dados)]);
  $r = curl_exec($ch); $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
  if ($code >= 200 && $code < 300) return true;
  $motivo = "resend HTTP $code: " . substr((string)$r, 0, 200); return false;
}
