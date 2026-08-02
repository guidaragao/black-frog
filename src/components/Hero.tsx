"use client";

import { hero, proof } from "@/content/site";
import DistantWords from "./DistantWords";
import HeroFrog from "./HeroFrog";
import Pond from "./Pond";
import WordRing from "./WordRing";

/**
 * Hero: o sapao NO LAGO, nao em cima de um fundo de lago.
 *
 * A diferenca que faz tudo funcionar e a ordem das camadas. O sapao nao mora
 * numa coluna da grade: ele e uma CAMADA por cima dela, centrado. Assim o
 * titulo corre POR TRAS dele, e e a sobreposicao que o olho le como
 * profundidade. Texto ao lado do bicho parece adesivo; texto sumindo atras
 * do bicho parece cena.
 *
 * Ordem, do fundo pra frente:
 *   0  lago em video, tela inteira, com massa escura la atras
 *   1  frases boiando em varias distancias
 *   10 copy (titulo e argumento)
 *   20 o sapao, a vitoria-regia e o anel de palavras
 *
 * No celular a sobreposicao e desligada: o sapao volta a ser bloco no fluxo,
 * senao ele cobre a copy inteira numa tela estreita.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="vignette relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      <Pond />
      <DistantWords />

      <div className="relative mx-auto w-full max-w-[1500px] px-5 pb-12 pt-32 md:px-10 md:pb-16 md:pt-28">
        {/* ---------- A COPY, POR BAIXO ---------- */}
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-24">
          <div className="drift on-water">
            <p
              className="eyebrow flex items-center gap-3 text-[11px] text-bf-green md:text-[13px]"
              style={{ animation: "bfRise 0.9s var(--ease-bf) 0.85s both" }}
            >
              <span className="inline-block h-px w-8 bg-bf-green/60" />
              {hero.eyebrow}
            </p>

            {/* Sem trava de largura no desktop: as linhas avancam pro centro
                de proposito, pra o sapao comer o fim delas. */}
            <h1 className="display mt-7 max-w-[15ch] text-[clamp(2.9rem,7vw,5.4rem)] text-white lg:max-w-none">
              {hero.headline.map((line, i) => (
                <span key={line} className="line-mask">
                  <span
                    style={{ animationDelay: `${0.15 + i * 0.13}s` }}
                    className={
                      i === hero.headline.length - 1 ? "text-bf-green" : ""
                    }
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          <div className="drift-2 on-water lg:justify-self-end lg:max-w-[22rem]">
            <p
              className="text-[1.0625rem] leading-[1.7] text-white/70 md:text-[1.125rem]"
              style={{ animation: "bfRise 0.9s var(--ease-bf) 1s both" }}
            >
              {hero.body}
            </p>

            <div
              className="mt-9 flex flex-wrap items-center gap-3"
              style={{ animation: "bfRise 0.9s var(--ease-bf) 1.15s both" }}
            >
              <a
                href={hero.primaryCta.href}
                className="rounded-full bg-bf-green px-8 py-4 text-[0.9375rem] font-bold text-bf-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_44px_-6px_#a6ff00]"
              >
                {hero.primaryCta.label}
              </a>
              <a
                href={hero.secondaryCta.href}
                className="edge-glow rounded-full border border-white/15 bg-white/[0.03] px-8 py-4 text-[0.9375rem] font-bold text-white backdrop-blur-sm transition-colors duration-300 hover:border-transparent hover:text-bf-green"
              >
                {hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>

        {/* ---------- O SAPAO, POR CIMA ----------
            pointer-events desligado no desktop pra ele nao roubar o clique
            dos botoes que ficam por baixo. */}
        <div
          className="relative mx-auto mt-12 w-[76%] max-w-[480px] lg:pointer-events-none lg:absolute lg:left-1/2 lg:top-[62%] lg:z-20 lg:mt-0 lg:w-[29%] lg:max-w-none lg:-translate-x-1/2 lg:-translate-y-1/2"
          style={{ animation: "bfRise 1.1s var(--ease-bf) 0.5s both" }}
        >
          <div className="pointer-events-none absolute left-1/2 top-[44%] aspect-square w-[152%] -translate-x-1/2 -translate-y-1/2">
            <WordRing />
          </div>

          <div className="relative">
            <HeroFrog />
          </div>
        </div>
      </div>

      {/* ---------- RODAPE DO HERO ---------- */}
      <div
        className="relative z-10 mt-auto w-full border-t border-white/[0.07]"
        style={{ animation: "bfRise 1s var(--ease-bf) 1.45s both" }}
      >
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-10 gap-y-3 px-5 py-5 md:px-10 md:py-6">
          {proof.stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-2.5">
              <span className="text-[1.3rem] font-black tracking-tight text-bf-green md:text-[1.55rem]">
                {s.value}
              </span>
              <span className="text-[0.8125rem] text-white/45 md:text-sm">
                {s.label}
              </span>
            </div>
          ))}

          <span className="ml-auto hidden items-center gap-3 text-[0.7rem] uppercase tracking-[0.22em] text-white/30 lg:flex">
            Scroll
            <span className="relative block h-7 w-px overflow-hidden bg-white/15">
              <span className="scroll-cue absolute inset-x-0 top-0 h-2.5 bg-bf-green" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
