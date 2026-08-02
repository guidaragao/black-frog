import Image from "next/image";
import { leap } from "@/content/site";
import Reveal from "./Reveal";

export default function Leap() {
  return (
    <section
      id="leap"
      className="relative overflow-hidden border-b border-bf-line bg-bf-card/40"
    >
      {/* A marca gigante como textura de fundo. Fica quase invisivel de
          proposito: e presenca de marca, nao decoracao. */}
      <Image
        src="/brand/mark.png"
        alt=""
        aria-hidden
        width={272}
        height={311}
        // Fica no vazio embaixo da coluna da esquerda, que era o unico
        // lugar da secao onde ela nao morre atras dos cards.
        className="watermark bottom-[4%] left-[-5%] hidden h-[520px] w-auto opacity-[0.07] lg:block"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow flex items-center gap-3 text-xs text-bf-green">
              <span className="inline-block h-px w-8 bg-bf-green/60" />
              {leap.eyebrow}
            </p>
            <h2 className="display mt-6 text-[clamp(2.6rem,6.4vw,5rem)] text-white">
              {leap.headline}
            </h2>
            <p className="mt-7 max-w-[46ch] text-[1.0625rem] leading-[1.7] text-white/60 md:text-[1.125rem]">
              {leap.intro}
            </p>
          </Reveal>

          <ol className="space-y-px overflow-hidden rounded-3xl bg-bf-line">
            {leap.steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 90}>
                <div className="group relative overflow-hidden bg-bf-black p-8 transition-colors duration-500 hover:bg-bf-card md:p-10">
                  {/* Barra verde que sobe na lateral quando o passo e tocado. */}
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 h-0 w-[2px] bg-bf-green transition-all duration-700 ease-out group-hover:h-full"
                  />

                  <div className="flex gap-7 md:gap-9">
                    <span
                      aria-hidden
                      className="shrink-0 text-[1.75rem] font-black tracking-tight text-bf-green/80 transition-colors duration-300 group-hover:text-bf-green md:text-[2rem]"
                    >
                      {s.n}
                    </span>
                    <div>
                      <h3 className="text-[1.35rem] font-black tracking-tight text-white md:text-[1.6rem]">
                        {s.name}
                      </h3>
                      <p className="mt-3 max-w-[58ch] text-[0.9375rem] leading-[1.7] text-white/55">
                        {s.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
