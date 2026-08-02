import { units } from "@/content/site";

/**
 * Faixa infinita entre o hero e as praticas.
 * O conteudo e duplicado porque a animacao anda ate -50%,
 * que e exatamente uma copia, e o corte fica invisivel.
 */
export default function Marquee() {
  const items = units.map((u) => u.name);

  return (
    <div
      aria-hidden
      className="marquee-mask relative overflow-hidden border-y border-white/[0.07] bg-bf-black py-6 md:py-8"
    >
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((name) => (
              <span key={`${copy}-${name}`} className="flex items-center">
                <span className="display px-7 text-[clamp(1.6rem,3.4vw,2.6rem)] text-white/25 md:px-10">
                  {name}
                </span>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-bf-green/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
