/**
 * Prefixo dos arquivos de `public/`.
 *
 * POR QUE ISSO EXISTE
 * No GitHub Pages o site nao mora na raiz do dominio, e sim em
 * `/black-frog/`. O `basePath` do Next resolve isso para LINKS e para os
 * arquivos internos dele (`_next/`), mas NAO para:
 *   - `src` escrito a mao, tipo `<video src="/brand/lago-loop.mp4">`
 *   - `next/image` com `unoptimized: true`, que devolve o src cru
 *   - os icones declarados no metadata
 *
 * Sem esse prefixo o navegador pede `/brand/...` na raiz do dominio e leva
 * 404 em tudo: o lago, as poses do sapao, as folhas e o logo. Foi
 * exatamente o que aconteceu no primeiro deploy.
 *
 * Em `npm run dev` a variavel nao existe, o prefixo e vazio e nada muda.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(caminho: string): string {
  return `${BASE}${caminho}`;
}
