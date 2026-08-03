"use client";

import { hero, proof } from "@/content/site";
import DistantWords from "./DistantWords";
import HeroFrog from "./HeroFrog";
import Pond from "./Pond";
import PondDepth from "./PondDepth";
import PondVeil from "./PondVeil";
import WordRing from "./WordRing";

/**
 * Hero montado a partir do rascunho a mao da Ingrid:
 *
 *   +------------------------------------------+
 *   |  S T A N D I N G   S T I L L             |  <- faixa gigante, largura toda
 *   |  is the                                  |
 *   |  only          ( SAPO )                  |  <- bloco menor a esquerda
 *   |  real risk.                              |     e o sapao no meio
 *   +------------------------------------------+
 *
 * A primeira linha atravessa o topo de ponta a ponta e o sapao passa POR
 * CIMA dela. O resto da frase desce menor, do lado esquerdo.
 *
 * Ordem das camadas, do fundo pra frente:
 *   0   lago em video
 *   1   frases boiando em varias distancias
 *   2   o titulo
 *   3   a NEVOA, que passa por cima do titulo e e o que o joga pro fundo
 *   10  argumento e botoes
 *   20  o sapao
 */
export default function Hero() {
  const [faixa, ...resto] = hero.headline;

  return (
    <section
      id="top"
      className="vignette relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      <Pond />
      <PondDepth />
      <DistantWords />

      {/* ---------- O TITULO, z 2, ATRAS DA NEVOA ----------
          Bloco unico na ESQUERDA, "Standing still" junto na mesma linha.
          A versao de ponta a ponta separava as duas palavras e confundia.
          O sapao encosta na ponta do bloco mas nao come letra. */}
      <div className="pointer-events-none absolute inset-x-0 top-[15%] z-[2] px-5 md:px-10">
        <div className="mx-auto max-w-[1500px]">
          <p className="eyebrow mb-6 flex items-center gap-3 text-[11px] text-bf-green md:text-[13px]"
             style={{ animation: "bfRise 0.9s var(--ease-bf) 0.7s both" }}>
            <span className="inline-block h-px w-8 bg-bf-green/60" />
            {hero.eyebrow}
          </p>

          <h1 className="far-title text-white">
            {hero.headline.map((line, i) => (
              <span key={line} className="line-mask">
                <span
                  className={`block font-black leading-[0.92] tracking-[-0.045em] ${
                    i === hero.headline.length - 1 ? "text-bf-green" : ""
                  }`}
                  style={{
                    fontSize: "clamp(2.7rem, 5.4vw, 5.6rem)",
                    animationDelay: `${0.15 + i * 0.12}s`,
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          {/* O REFLEXO do titulo na agua: o bloco de cabeca pra baixo,
              apagando conforme desce. E o que cola o titulo no lago. */}
          <div
            aria-hidden
            className="select-none"
            style={{
              opacity: 0.26,
              filter: "blur(2px)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 55%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 55%)",
            }}
          >
            <div className="water-shimmer-soft" style={{ transform: "scaleY(-1)" }}>
              {hero.headline.map((line, i) => (
                <span
                  key={line}
                  className={`block font-black leading-[0.92] tracking-[-0.045em] ${
                    i === hero.headline.length - 1 ? "text-bf-green" : ""
                  }`}
                  style={{ fontSize: "clamp(2.7rem, 5.4vw, 5.6rem)" }}
                >
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* A NEVOA passa por cima do titulo (z 2) e das frases (z 1). */}
      <PondVeil />

      {/* ---------- PALCO ---------- */}
      <div className="relative mx-auto w-full max-w-[1500px] px-5 pb-12 pt-32 md:px-10 md:pb-16 md:pt-28">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto] lg:gap-24">
          {/* espaco reservado: o titulo mora na camada de tras, mas a
              coluna precisa existir pra a copy da direita nao subir */}
          <div aria-hidden className="hidden lg:block lg:h-[30rem]" />

          <div className="drift-2 on-water relative z-10 lg:absolute lg:right-6 lg:top-[26%] lg:max-w-[17rem] xl:right-10 xl:top-[34%] xl:max-w-[22rem]">

            <p
              className="text-[1.0625rem] leading-[1.7] text-white/70 md:text-[1.125rem] lg:text-[0.95rem] lg:leading-[1.65] xl:text-[1.125rem] xl:leading-[1.7]"
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

        {/* ---------- O SAPAO, POR CIMA DE TUDO ----------
            No desktop ele nao captura clique, pra nao roubar os botoes. */}
        <div
          className="relative mx-auto mt-12 w-[76%] max-w-[440px] lg:pointer-events-none lg:absolute lg:left-1/2 lg:top-[52%] lg:z-20 lg:mt-0 lg:w-[34%] lg:max-w-none lg:-translate-x-1/2 lg:-translate-y-1/2"
          style={{ animation: "bfRise 1.1s var(--ease-bf) 0.5s both" }}
        >
          <div className="pointer-events-none absolute left-1/2 top-[44%] aspect-square w-[116%] -translate-x-1/2 -translate-y-1/2">
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
