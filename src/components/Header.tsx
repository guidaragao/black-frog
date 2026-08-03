"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { asset } from "@/lib/asset";
import TongueMenu from "./TongueMenu";

export default function Header() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "bg-bf-black/85 backdrop-blur-md border-b border-bf-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10 md:py-5">
        <a
          href="#top"
          aria-label={`${site.name} home`}
          className="group shrink-0"
        >
          <Image
            src={asset("/brand/logo-lockup.png")}
            alt={`${site.name}, ${site.tagline}`}
            width={1112}
            height={302}
            priority
            // Estava em h-7 / h-9 e a marca sumia no topo da pagina.
            className="h-10 w-auto transition-transform duration-500 group-hover:scale-[1.04] md:h-12"
          />
        </a>

        {/* O menu virou a LINGUA do sapao (TongueMenu). Um gatilho so,
            desktop e celular, no lugar da nav enfileirada + hamburguer. */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full bg-bf-green px-5 py-2.5 text-sm font-bold text-bf-black transition-transform duration-200 hover:-translate-y-0.5 md:inline-block"
          >
            Start a project
          </a>
          <TongueMenu />
        </div>
      </div>

    </header>
  );
}
