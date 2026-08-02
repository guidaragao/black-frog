import { units } from "@/content/site";
import Reveal from "./Reveal";

export default function Units() {
  return (
    <section id="work" className="relative border-b border-bf-line">
      {/* Brilho frio no topo da secao, so pra tirar o preto chapado. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.07] blur-[140px]"
        style={{ background: "#a6ff00" }}
      />

      <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <Reveal className="max-w-[62ch]">
          <p className="eyebrow flex items-center gap-3 text-xs text-bf-green">
            <span className="inline-block h-px w-8 bg-bf-green/60" />
            What we do
          </p>
          <h2 className="display mt-6 text-[clamp(2.3rem,5.4vw,4.2rem)] text-white">
            Six practices.
            <br />
            <span className="text-bf-green">One team.</span>
          </h2>
          <p className="mt-7 text-[1.0625rem] leading-[1.7] text-white/60 md:text-[1.125rem]">
            Buy one, buy all six. They are built to work together, so the brand
            the strategists write is the brand the engineers ship, and the film
            the directors cut is the film the campaign runs on.
          </p>
        </Reveal>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-bf-line md:grid-cols-2 xl:grid-cols-3">
          {units.map((u, i) => (
            <Reveal as="li" key={u.key} delay={i * 70}>
              <article className="group relative flex h-full flex-col overflow-hidden bg-bf-black p-8 transition-colors duration-500 hover:bg-bf-card md:p-10">
                {/* Numeral fantasma, textura de fundo que acende no hover. */}
                <span
                  aria-hidden
                  className="ghost-num pointer-events-none absolute -right-3 -top-6 text-[7rem] opacity-40 transition-opacity duration-500 group-hover:opacity-100"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Filete verde que corre no topo do card no hover. */}
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-px w-0 bg-bf-green transition-all duration-700 ease-out group-hover:w-full"
                />

                <h3 className="relative text-[1.6rem] font-black tracking-tight text-white transition-colors duration-300 group-hover:text-bf-green md:text-[1.85rem]">
                  {u.name}
                </h3>

                <p className="relative mt-2 text-[0.9375rem] font-medium text-bf-green/90">
                  {u.line}
                </p>

                <p className="relative mt-6 flex-1 text-[0.9375rem] leading-[1.7] text-white/55">
                  {u.body}
                </p>

                <ul className="relative mt-8 flex flex-wrap gap-2">
                  {u.services.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white/55 transition-colors duration-300 group-hover:border-bf-green/25"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
