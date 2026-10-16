<?php
/* Black Frog · a RESPOSTA AUTOMATICA pra quem pediu o site (pedido.php).
   Sai na hora, pelo Resend, de Grace at Black Frog. Diz o que acontece agora,
   em quanto tempo, e que nao custa nada ate ela dizer sim. Sem preco novo:
   os $797 ja estavam na pagina, aqui so repete a regra. */
function bf_resposta_html(string $nome, string $negocio, bool $tem_site, string $lang = 'en'): string {
  if ($lang === 'pt') return bf_resposta_html_pt($nome, $negocio, $tem_site);
  $e = fn($s) => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
  $primeiro = $e(trim(explode(' ', trim($nome))[0]) ?: 'there');
  $V = '#A6FF00'; $FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif"; $MONO = "'JetBrains Mono',Menlo,Consolas,monospace";
  $leitura = $tem_site
    ? "We also read <b>" . $e($negocio) . "</b> the way a first-time visitor would, so the new version fixes what the current one gets wrong."
    : "We start from what you told us about <b>" . $e($negocio) . "</b>. If you have photos, a logo or text you already use, just reply to this email with them.";
  $passo = fn($n, $t, $d) => '<tr><td style="padding:0 14px 18px 0;vertical-align:top;font:600 13px/28px ' . $MONO . ';color:' . $V . '">' . $n . '</td>'
        . '<td style="padding:0 0 18px;vertical-align:top;font:15.5px/1.55 ' . $FONT . ';color:#111"><b style="font-weight:700">' . $t . '</b><br>' . $d . '</td></tr>';
  return '<!doctype html><html><body style="margin:0;padding:0;background:#EFEFEC">'
   . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFEFEC"><tr><td align="center" style="padding:28px 14px">'
   . '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff">'
   . '<tr><td style="padding:26px 36px;background:#0D0D0D"><a href="https://blkfrog.com" style="text-decoration:none"><img src="https://blkfrog.com/assets/logo-email.png" width="150" height="41" alt="BLACK FROG" style="display:block;width:150px;height:41px;border:0;font:700 20px/41px ' . $FONT . ';color:' . $V . '"></a></td></tr>'
   . '<tr><td style="padding:34px 36px 8px">'
   . '<p style="margin:0 0 6px;font:500 11px/1 ' . $MONO . ';letter-spacing:.2em;text-transform:uppercase;color:#6B6B6B">Free websites</p>'
   . '<h1 style="margin:0 0 16px;font:800 28px/1.1 ' . $FONT . ';letter-spacing:-.02em;color:#0D0D0D">Got it, ' . $primeiro . '. Your site is in the works.</h1>'
   . '<p style="margin:0 0 22px;font:15.5px/1.55 ' . $FONT . ';color:#333">' . $leitura . '</p>'
   . '<table role="presentation" cellpadding="0" cellspacing="0" style="border-top:1px solid #E4E4DF;padding-top:18px;width:100%">'
   . $passo('01', 'We build the first version.', 'Phone first, then desktop. Your name, your colors, your words.')
   . $passo('02', 'It lands here, in this inbox, within 3 business days.', 'A link you can open on your phone and send to whoever you want.')
   . $passo('03', 'You look, you decide.', 'Like it? $797 and it is live in five days, with hosting for the first year. Don\'t like it? You owe nothing and nobody follows up.')
   . '</table>'
   . '<p style="margin:14px 0 0;padding:16px 18px;border-left:3px solid ' . $V . ';background:#F6F6F2;font:15px/1.5 ' . $FONT . ';color:#333">Nothing is charged until you say yes. Not a card, not a deposit.</p>'
   . '<p style="margin:26px 0 0;font:15.5px/1.55 ' . $FONT . ';color:#333">Questions in the meantime? Just reply to this email.<br><br>Grace<br><span style="color:#6B6B6B">Black Frog · Design &amp; Digital Solutions</span></p>'
   . '</td></tr>'
   . '<tr><td style="padding:22px 36px 30px;font:12px/1.5 ' . $MONO . ';color:#8A8A8A">blkfrog.com &middot; hello@blkfrog.com<br>You got this because you asked to see your site first at blkfrog.com. One email now, one with the link. No newsletter.</td></tr>'
   . '</table></td></tr></table></body></html>';
}
function bf_resposta(string $nome, string $email, string $negocio, bool $tem_site, &$motivo = null, string $lang = 'en'): bool {
  $env = dirname(dirname(__DIR__)) . '/bf-resend.env';
  if (!is_readable($env)) { $motivo = 'sem bf-resend.env'; return false; }
  $key = trim(preg_replace('/^RESEND_KEY=/', '', trim(file_get_contents($env))));
  $primeiro = trim(explode(' ', trim($nome))[0]);
  $dados = ['from' => 'Grace at Black Frog <hello@blkfrog.com>', 'to' => [$email], 'reply_to' => 'hello@blkfrog.com',
            'subject' => ($lang === 'pt' ? "Recebido, {$primeiro}. Seu site já está em produção." : "Got it, {$primeiro}. Your site is in the works."),
            'html' => bf_resposta_html($nome, $negocio, $tem_site, $lang)];
  $ch = curl_init('https://api.resend.com/emails');
  curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $key, 'Content-Type: application/json'], CURLOPT_POSTFIELDS => json_encode($dados)]);
  $r = curl_exec($ch); $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
  if ($code >= 200 && $code < 300) return true;
  $motivo = "resend HTTP $code: " . substr((string)$r, 0, 200); return false;
}

/* a mesma carta, em portugues, pra quem veio de /checkup/pt (Brasil). */
function bf_resposta_html_pt(string $nome, string $negocio, bool $tem_site): string {
  $e = fn($s) => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
  $primeiro = $e(trim(explode(' ', trim($nome))[0]) ?: 'tudo bem');
  $V = '#A6FF00'; $FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif"; $MONO = "'JetBrains Mono',Menlo,Consolas,monospace";
  $leitura = $tem_site
    ? "A gente também lê o <b>" . $e($negocio) . "</b> como um visitante de primeira viagem, pra versão nova consertar o que a atual erra."
    : "A gente parte do que você contou sobre <b>" . $e($negocio) . "</b>. Se tiver fotos, logo ou textos que já usa, é só responder este email com eles.";
  $passo = fn($n, $t, $d) => '<tr><td style="padding:0 14px 18px 0;vertical-align:top;font:600 13px/28px ' . $MONO . ';color:' . $V . '">' . $n . '</td>'
        . '<td style="padding:0 0 18px;vertical-align:top;font:15.5px/1.55 ' . $FONT . ';color:#111"><b style="font-weight:700">' . $t . '</b><br>' . $d . '</td></tr>';
  return '<!doctype html><html><body style="margin:0;padding:0;background:#EFEFEC">'
   . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFEFEC"><tr><td align="center" style="padding:28px 14px">'
   . '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff">'
   . '<tr><td style="padding:26px 36px;background:#0D0D0D"><a href="https://blkfrog.com/checkup/pt/" style="text-decoration:none"><img src="https://blkfrog.com/assets/logo-email.png" width="150" height="41" alt="BLACK FROG" style="display:block;width:150px;height:41px;border:0;font:700 20px/41px ' . $FONT . ';color:' . $V . '"></a></td></tr>'
   . '<tr><td style="padding:34px 36px 8px">'
   . '<p style="margin:0 0 6px;font:500 11px/1 ' . $MONO . ';letter-spacing:.2em;text-transform:uppercase;color:#6B6B6B">Site de graça pra ver</p>'
   . '<h1 style="margin:0 0 16px;font:800 28px/1.1 ' . $FONT . ';letter-spacing:-.02em;color:#0D0D0D">Recebido, ' . $primeiro . '. Seu site já está em produção.</h1>'
   . '<p style="margin:0 0 22px;font:15.5px/1.55 ' . $FONT . ';color:#333">' . $leitura . '</p>'
   . '<table role="presentation" cellpadding="0" cellspacing="0" style="border-top:1px solid #E4E4DF;padding-top:18px;width:100%">'
   . $passo('01', 'A gente monta a primeira versão.', 'Feita pro celular primeiro, depois pro computador. Seu nome, suas cores, suas palavras.')
   . $passo('02', 'Ela chega aqui, neste email, em até 3 dias úteis.', 'Um link que abre no celular e você manda pra quem quiser.')
   . $passo('03', 'Você olha e decide.', 'Gostou? US$ 797 e ela vai ao ar em cinco dias, com hospedagem no primeiro ano. Não gostou? Não deve nada e ninguém vai atrás de você.')
   . '</table>'
   . '<p style="margin:14px 0 0;padding:16px 18px;border-left:3px solid ' . $V . ';background:#F6F6F2;font:15px/1.5 ' . $FONT . ';color:#333">Nada é cobrado até você dizer sim. Nem cartão, nem sinal.</p>'
   . '<p style="margin:26px 0 0;font:15.5px/1.55 ' . $FONT . ';color:#333">Alguma dúvida enquanto isso? É só responder este email.<br><br>Grace<br><span style="color:#6B6B6B">Black Frog · Design &amp; Digital Solutions</span></p>'
   . '</td></tr>'
   . '<tr><td style="padding:22px 36px 30px;font:12px/1.5 ' . $MONO . ';color:#8A8A8A">blkfrog.com &middot; hello@blkfrog.com<br>Você recebeu isto porque pediu pra ver seu site primeiro em blkfrog.com. Um email agora, um com o link. Sem newsletter.</td></tr>'
   . '</table></td></tr></table></body></html>';
}
