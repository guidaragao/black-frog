"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Abertura da marca. Tela preta, a ra da logo entra, um filete verde
 * varre por baixo dela e a cortina sobe revelando o hero.
 *
 * Roda UMA vez por sessao. Quem volta de outra pagina nao pega de novo,
 * senao vira pedagio. Quem pediu menos movimento no sistema nao ve nada.
 */
export default function Intro() {
  const [phase, setPhase] = useState<"off" | "playing" | "lifting" | "done">(
    "off",
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }

    if (sessionStorage.getItem("bf-intro-seen")) {
      setPhase("done");
      return;
    }

    sessionStorage.setItem("bf-intro-seen", "1");
    setPhase("playing");

    // Trava o scroll enquanto a cortina esta na frente.
    document.body.style.overflow = "hidden";

    const lift = setTimeout(() => setPhase("lifting"), 1500);
    const end = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 2500);

    return () => {
      clearTimeout(lift);
      clearTimeout(end);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done" || phase === "off") return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-bf-black ${
        phase === "lifting" ? "intro-lift" : ""
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="intro-mark">
          <Image
            src="/brand/mark.png"
            alt=""
            width={272}
            height={311}
            priority
            className="h-[clamp(88px,13vw,150px)] w-auto"
          />
        </div>

        {/* Filete verde que varre por baixo da marca. */}
        <div className="mt-8 h-px w-[clamp(120px,22vw,260px)] overflow-hidden bg-white/10">
          <div className="intro-sweep h-full w-full bg-bf-green" />
        </div>
      </div>
    </div>
  );
}
