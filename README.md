# Black Frog, site

Home da Black Frog em Next.js 16, TypeScript e Tailwind v4. Estrutura de navegacao e ritmo de pagina no modelo TBWA, identidade do board v2 aplicada.

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producao
npm start        # sobe o build
```

## Deploy

Vercel, sem configuracao extra. Aponta `blackfrog.io` no painel de dominios.

## Estrutura

```
src/
  app/
    layout.tsx      metadata, Open Graph, favicons, carga da fonte
    page.tsx        montagem das secoes
    globals.css     tokens de cor, tipografia, animacao
  components/       uma secao por arquivo
  content/site.ts   TODA a copy vive aqui, em um lugar so
public/brand/       PNGs reais da marca
```

Pra trocar texto, mexe so em `src/content/site.ts`. Nenhum componente tem string hardcoded.

## Fonte

Satoshi. Hoje carrega pelo CDN da Fontshare, via `<link>` no `layout.tsx`.

Pra producao, o certo e self host:

1. Baixa em https://www.fontshare.com/fonts/satoshi
2. Poe os `.woff2` em `public/fonts`
3. Tira o `<link>` do `layout.tsx`
4. Descomenta o bloco `@font-face` no topo do `globals.css`

Ganha performance, tira dependencia de terceiro e melhora privacidade.

## Cores

Tokens em `globals.css`, dentro do bloco `@theme`.

| Token | Hex | Uso |
|---|---|---|
| `bf-green` | `#a6ff00` | acento, CTA, destaque |
| `bf-black` | `#0d0d0d` | fundo base |
| `bf-card` | `#1b1b1b` | card e faixa alternada |
| `bf-line` | `#262626` | divisoria |
| `bf-muted` | `#8a8a8a` | texto secundario, passa AA |

O `#666666` do board NAO e usado em texto. Ele da 3.38:1 sobre `#0d0d0d`, reprova em AA pra corpo. Ficou so como referencia de paleta.

## Acessibilidade

- Todo par de cor de texto conferido em WCAG AA, calculado, nao estimado
- Skip link no topo
- Foco visivel em verde de marca
- `prefers-reduced-motion` respeitado
- Menu mobile com `aria-expanded` e `aria-controls`
- Imagens com alt descritivo

## Regra de asset

Nenhum logo e desenhado em CSS ou SVG inline. Tudo vem de PNG real em `public/brand`, recortado dos arquivos originais.

| Arquivo | Uso |
|---|---|
| `logo-lockup.png` | header, simbolo mais wordmark, sem tagline |
| `logo-horizontal.png` | footer, com tagline |
| `logo-stacked.png` | Open Graph, material social |
| `mark.png` | simbolo isolado |
| `frog-hero.png` | mascote do hero |
| `frog-tall.png` | mascote da secao de case |
| `app-icon.png`, `icon-*.png` | favicon e icone de app |

## Pendencias conhecidas

1. Nao existe versao positiva do logo pra fundo claro. Se aparecer secao clara, o logo some.
2. Os assets sao raster de origem, nao vetor. Serve web, nao serve impressao grande.
3. O favicon a 16 e 32 px vem de reducao do simbolo real. Fica legivel, mas o ideal e uma peca desenhada pra tamanho pequeno.
4. A copy esta so em ingles. A estrutura de `content/site.ts` ja isola tudo, entao adicionar PT e trocar o objeto por idioma.
5. Ponto de vista, cases e paginas internas ainda nao existem. A home linka por ancora.
