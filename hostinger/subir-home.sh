#!/bin/zsh
# Sobe a HOME nova (16/10: oferta no primeiro segundo, tema claro, como funciona).
# Guarda a home do ar antes, no proprio servidor. --voltar devolve ela.
cd "${0:A:h}/public_html" || exit 1
K=(-i ~/.ssh/id_ed25519_hostinger)
H=u255802879@212.85.9.118
R=domains/blkfrog.com/public_html
BAK=$R/index.bak-1610-antes-home-clara.html

if [[ "$1" == "--voltar" ]]; then
  ssh $K -p 65002 $H "cp -p $BAK $R/index.html" && echo "Home voltou pra de antes."
  exit
fi

ssh $K -p 65002 $H "[ -f $BAK ] || cp -p $R/index.html $BAK" || exit 1
scp -q $K -P 65002 index.html $H:$R/index.html || exit 1
ssh $K -p 65002 $H "chmod 644 $R/index.html"

echo
echo "home nova no ar: $(curl -s https://blkfrog.com/ | grep -c 'a1-offer\"')   (tem que dar 1)"
echo "titulo: $(curl -s https://blkfrog.com/ | grep -o '<title>[^<]*' | sed 's/<title>//')"
echo "PRONTO"
