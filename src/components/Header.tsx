"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { asset } from "@/lib/asset";

export default function Header() {
  const [open, setOpen] = useState(false);
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

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-bf-green"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full bg-bf-green px-5 py-2.5 text-sm font-bold text-bf-black transition-transform duration-200 hover:-translate-y-0.5 md:inline-block"
          >
            Start a project
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-bf-line lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-white transition-transform duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-white transition-transform duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-bf-line bg-bf-black lg:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col px-5 py-4">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-bf-line py-4 text-lg font-bold text-white transition-colors hover:text-bf-green"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-5 rounded-full bg-bf-green px-5 py-3 text-center text-sm font-bold text-bf-black"
          >
            Start a project
          </a>
        </nav>
      </div>
    </header>
  );
}
