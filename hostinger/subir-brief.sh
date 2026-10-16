#!/bin/zsh
# Sobe a build sheet (blkfrog.com/brief) e o checkup com o botao pro brief.
# Guarda o checkup do ar antes, no proprio servidor. --voltar devolve ele.
cd "${0:A:h}/public_html" || exit 1
K=(-i ~/.ssh/id_ed25519_hostinger)
H=u255802879@212.85.9.118
R=domains/blkfrog.com/public_html
BAK=$R/checkup/index.bak-1610-antes-brief.html

if [[ "$1" == "--voltar" ]]; then
  ssh $K -p 65002 $H "cp -p $BAK $R/checkup/index.html; cp -p $R/index.bak-1610-antes-brief.html $R/index.html" && echo "Home e checkup voltaram pro de antes."
  exit
fi

ssh $K -p 65002 $H "[ -f $BAK ] || cp -p $R/checkup/index.html $BAK; mkdir -p $R/brief && chmod 755 $R/brief" || exit 1
scp -q $K -P 65002 brief/index.html brief/brief.php $H:$R/brief/ || exit 1
scp -q $K -P 65002 checkup/index.html $H:$R/checkup/index.html || exit 1
ssh $K -p 65002 $H "[ -f $R/index.bak-1610-antes-brief.html ] || cp -p $R/index.html $R/index.bak-1610-antes-brief.html"
scp -q $K -P 65002 index.html $H:$R/index.html || exit 1
ssh $K -p 65002 $H "chmod 644 $R/brief/index.html $R/brief/brief.php $R/checkup/index.html $R/index.html"

echo
echo "brief:   $(curl -s -o /dev/null -w '%{http_code}' https://blkfrog.com/brief/)   (tem que dar 200)"
echo "botao no checkup: $(curl -s https://blkfrog.com/checkup/ | grep -c 'Fill my build sheet')   (tem que dar 1)"
echo "home leva pro brief: $(curl -s https://blkfrog.com/ | grep -c "href=\"/brief/\"")   (tem que dar 2)"
echo "PRONTO"
