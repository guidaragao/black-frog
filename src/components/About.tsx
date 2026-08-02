import { about } from "@/content/site";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="relative border-b border-bf-line">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-xs text-bf-green">
              <span className="inline-block h-px w-8 bg-bf-green/60" />
              {about.eyebrow}
            </p>
            <h2 className="display mt-6 text-[clamp(2.3rem,5.4vw,4.2rem)] text-white">
              {about.headline}
            </h2>
            <p className="mt-7 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-white/60 md:text-[1.125rem]">
              {about.body}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <aside className="rounded-3xl border border-white/[0.07] bg-bf-card/60 p-8 md:p-10">
              <p className="eyebrow text-xs text-bf-muted">
                {about.principles.label}
              </p>

              <ul className="mt-8 space-y-8">
                {about.principles.items.map((p) => (
                  <li key={p.title} className="border-l border-bf-green/30 pl-5">
                    <h3 className="text-[1.0625rem] font-black tracking-tight text-white">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-[1.7] text-white/55">
                      {p.body}
                    </p>
                  </li>
                ))}
              </ul>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
