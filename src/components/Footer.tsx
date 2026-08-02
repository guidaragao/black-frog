import Image from "next/image";
import { nav, site, units } from "@/content/site";

export default function Footer() {
  const year = 2026;

  return (
    <footer className="relative overflow-hidden border-t border-bf-line bg-bf-black">
      {/* O sapao original espiando do canto. Ele nao disputa com a ra
          fotorrealista do hero: la e a cara seria, aqui e o personagem.
          Some no celular, onde nao sobra canto pra ele. */}
      <Image
        src="/brand/frog-tall.png"
        alt=""
        aria-hidden
        width={950}
        height={1176}
        className="pointer-events-none absolute bottom-[-14%] right-[-3%] hidden h-[300px] w-auto opacity-[0.13] lg:block"
        style={{
          maskImage:
            "radial-gradient(70% 60% at 50% 42%, #000 45%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(70% 60% at 50% 42%, #000 45%, transparent 82%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Image
              src="/brand/logo-horizontal.png"
              alt={`${site.name}, ${site.tagline}`}
              width={1114}
              height={338}
              className="h-14 w-auto"
            />
            <p className="mt-5 max-w-[36ch] text-sm leading-[1.65] text-white/55">
              {site.name} is {site.position}. Brands, products and campaigns
              that leap ahead.
            </p>
            <p className="mt-5 text-sm font-bold text-bf-green">
              {site.domain}
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow text-xs text-bf-muted">Navigate</p>
            <ul className="mt-5 space-y-3">
              {nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="text-sm text-white/60 transition-colors hover:text-bf-green"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-xs text-bf-muted">Practices</p>
            <ul className="mt-5 space-y-3">
              {units.map((u) => (
                <li key={u.key}>
                  <a
                    href="#work"
                    className="text-sm text-white/60 transition-colors hover:text-bf-green"
                  >
                    {u.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-bf-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-bf-muted">
            {year} {site.name}. All rights reserved.
          </p>

          {/* Aqui tambem tinha um "Powered by Vanda Media Group". Fora,
              pelo mesmo motivo do About: o site nao pode entregar a
              ligacao com a VMG. */}
          <p className="text-xs text-bf-muted">
            {site.tagline}. Built in house.
          </p>
        </div>
      </div>
    </footer>
  );
}
