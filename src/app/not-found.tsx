import Link from "next/link";
import CursorBug from "@/components/CursorBug";
import HeroFrog from "@/components/HeroFrog";
import { site } from "@/content/site";

export const metadata = {
  title: "Page not found",
};

/**
 * A casa do sapao original.
 *
 * O hero da home e a ra fotorrealista, que e a cara seria da marca.
 * Aqui, na unica pagina onde a marca pode ser simpatica em vez de cara,
 * quem aparece e o mascote 3D. Ele fica num quadro com fundo proprio,
 * entao o fundo cinza da arte le como estudio e nao como recorte torto.
 */
export default function NotFound() {
  return (
    <main className="vignette relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
      <CursorBug />

      <div
        aria-hidden
        className="breathe pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[150px]"
        style={{ background: "#a6ff00" }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-[min(320px,68vw)]">
          <HeroFrog />
        </div>

        <p className="eyebrow mt-12 text-xs text-bf-green">Error 404</p>

        <h1 className="display mt-5 max-w-[14ch] text-[clamp(2.4rem,7vw,4.75rem)] text-white">
          Even he could not
          <br />
          <span className="text-bf-green">jump this far.</span>
        </h1>

        <p className="mt-7 max-w-[46ch] text-[1.0625rem] leading-[1.7] text-white/60">
          This page does not exist, or it moved somewhere we have not caught up
          with yet. Nothing is broken on your end.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-bf-green px-8 py-4 text-[0.9375rem] font-bold text-bf-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_44px_-6px_#a6ff00]"
        >
          Back to {site.name}
        </Link>
      </div>
    </main>
  );
}
