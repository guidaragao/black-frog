import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=true liga o modo de publicacao no GitHub Pages:
 * exportacao estatica, caminho do subdiretorio do repositorio e imagens sem
 * o otimizador (que precisa de servidor e nao existe no Pages).
 *
 * Sem essa variavel nada muda: `npm run dev` e `npm run build` seguem
 * normais, com o otimizador de imagem ligado.
 */
const noPages = process.env.GITHUB_PAGES === "true";
const repo = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Sem isso o Turbopack sobe ate a home e acha o package-lock.json de la,
  // e passa a tratar a home inteira como raiz do projeto.
  turbopack: { root: __dirname },

  ...(noPages
    ? {
        output: "export" as const,
        basePath: repo,
        assetPrefix: repo ? `${repo}/` : undefined,
        images: { unoptimized: true },
      }
    : {
        images: {
          // Next 16 aceita so quality 75 por padrao e coage o resto pro mais
          // proximo da lista. As poses do sapao sao escuras, onde banding
          // aparece rapido, entao liberamos 90.
          qualities: [75, 90],
        },
      }),
};

export default nextConfig;
