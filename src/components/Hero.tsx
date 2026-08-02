"use client";

import { hero, proof } from "@/content/site";
import HeroFrog from "./HeroFrog";
import Pond from "./Pond";
import WordRing from "./WordRing";

/**
 * Hero em tres colunas: fala de um lado, sapao no meio, fala do outro.
 *
 * A esquerda leva o titulo, que e a frase que precisa ser lida primeiro.
 * A direita leva o argumento e os botoes. O sapao no centro vira o eixo da
 * pagina, e como ele olha pro inseto o visitante entende sozinho que os
 * dois estao se enxergando.
 *
 * Abaixo de xl vira duas colunas (fala | sapao) e no celular empilha, com
 * o sapao no fim, porque em tela estreita ele empurraria o titulo pra fora.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="vignette relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* O lago em perspectiva, atras de tudo. */}
      <Pond />

      {/* Brilho verde respirando atras do sapao, no centro. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div
          className="breathe absolute left-1/2 top-[38%] h-[44vw] max-h-[620px] w-[44vw] max-w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
          style={{ background: "#a6ff00" }}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1500px] items-center gap-10 px-5 pb-12 pt-32 md:px-10 md:pb-16 md:pt-28 lg:grid-cols-[1fr_0.9fr] lg:gap-12 xl:grid-cols-[1fr_1.05fr_1fr] xl:gap-10">
        {/* ---------- ESQUERDA: o titulo ---------- */}
        <div className="drift on-water xl:order-1">
          <p
            className="eyebrow flex items-center gap-3 text-[11px] text-bf-green md:text-[13px]"
            style={{ animation: "bfRise 0.9s var(--ease-bf) 0.85s both" }}
          >
            <span className="inline-block h-px w-8 bg-bf-green/60" />
            {hero.eyebrow}
          </p>

          <h1 className="display mt-7 max-w-[13ch] text-[clamp(2.8rem,6.4vw,4.6rem)] text-white">
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

        {/* ---------- CENTRO: o sapao ---------- */}
        <div
          className="relative mx-auto w-[74%] max-w-[520px] lg:order-3 lg:col-span-2 lg:w-[54%] xl:order-2 xl:col-span-1 xl:w-full xl:max-w-none"
          style={{ animation: "bfRise 1.1s var(--ease-bf) 0.5s both" }}
        >
          {/* O anel de palavras gira em volta dele, um pouco maior que a
              cena, e fica atras. */}
          <div className="pointer-events-none absolute left-1/2 top-[42%] aspect-square w-[132%] -translate-x-1/2 -translate-y-1/2">
            <WordRing />
          </div>

          <div className="relative">
            <HeroFrog />
          </div>
        </div>

        {/* ---------- DIREITA: o argumento e os botoes ---------- */}
        <div className="drift-2 on-water lg:order-2 xl:order-3">
          <p
            className="max-w-[46ch] text-[1.0625rem] leading-[1.7] text-white/70 md:text-[1.125rem] xl:border-l xl:border-white/10 xl:pl-7"
            style={{ animation: "bfRise 0.9s var(--ease-bf) 1s both" }}
          >
            {hero.body}
          </p>

          <div
            className="mt-9 flex flex-wrap items-center gap-3 xl:pl-7"
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
