import { pov } from "@/content/site";
import Reveal from "./Reveal";

export default function PointOfView() {
  return (
    <section id="pov" className="border-b border-bf-line bg-bf-card/40">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <Reveal className="max-w-[52ch]">
          <p className="eyebrow flex items-center gap-3 text-xs text-bf-green">
            <span className="inline-block h-px w-8 bg-bf-green/60" />
            {pov.eyebrow}
          </p>
          <h2 className="display mt-6 text-[clamp(2.3rem,5.4vw,4.2rem)] text-white">
            {pov.headline}
          </h2>
          <p className="mt-6 text-[1.0625rem] leading-[1.7] text-white/60 md:text-[1.125rem]">
            {pov.body}
          </p>
        </Reveal>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-bf-line md:grid-cols-3">
          {pov.posts.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 80}>
              <article className="group relative flex h-full flex-col overflow-hidden bg-bf-black p-8 transition-colors duration-500 hover:bg-bf-card md:p-9">
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-px w-0 bg-bf-green transition-all duration-700 ease-out group-hover:w-full"
                />

                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-bf-green/10 px-3 py-1 text-xs font-bold tracking-wide text-bf-green">
                    {p.tag}
                  </span>
                  <span className="text-xs text-bf-muted">{p.date}</span>
                </div>

                <h3 className="mt-7 text-[1.125rem] font-bold leading-[1.3] tracking-tight text-white transition-colors duration-300 group-hover:text-bf-green md:text-xl">
                  {p.title}
                </h3>

                <p className="mt-4 flex-1 text-[0.9375rem] leading-[1.7] text-white/55">
                  {p.excerpt}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
