import Image from "next/image";
import { featuredCase } from "@/content/site";
import Reveal from "./Reveal";
import { asset } from "@/lib/asset";

export default function CaseFeature() {
  return (
    <section id="cases" className="relative border-b border-bf-line">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.92fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-xs text-bf-green">
              <span className="inline-block h-px w-8 bg-bf-green/60" />
              {featuredCase.eyebrow}
            </p>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-white/55">
              {featuredCase.client}
            </p>
            <h2 className="display mt-4 text-[clamp(2rem,4.8vw,3.6rem)] text-white">
              {featuredCase.headline}
            </h2>
            <p className="mt-7 max-w-[58ch] text-[1.0625rem] leading-[1.7] text-white/60 md:text-[1.125rem]">
              {featuredCase.body}
            </p>

            <dl className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-bf-line">
              {featuredCase.metrics.map((m) => (
                <div key={m.label} className="bg-bf-black p-5 md:p-7">
                  <dt className="sr-only">{m.label}</dt>
                  <dd className="text-lg font-black tracking-tight text-bf-green md:text-2xl">
                    {m.value}
                  </dd>
                  <p className="mt-1.5 text-xs font-medium text-bf-muted md:text-[13px]">
                    {m.label}
                  </p>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Retrato cinematografico. Substitui o mascote desenhado,
              mesma paleta, outro nivel de acabamento. */}
          <Reveal delay={140} className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.07]">
              <Image
                src={asset("/brand/frog-plinth.png")}
                alt="Black Frog, a black frog poised on a polished stone plinth under a ribbon of liquid glass"
                width={2304}
                height={1296}
                quality={90}
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="h-auto w-full"
              />
              {/* Vinheta interna, cola a foto no fundo preto da pagina. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 90% at 50% 45%, transparent 40%, rgba(13,13,13,0.7) 100%)",
                }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
