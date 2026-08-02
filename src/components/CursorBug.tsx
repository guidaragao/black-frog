"use client";

import { useEffect, useRef } from "react";
import { hunt, pointer, watchPointer } from "@/lib/pointer";

/**
 * O cursor: um inseto robotico.
 *
 * Ele persegue o ponteiro com atraso e INCLINA na direcao do voo, que e o
 * que faz parecer bicho voando em vez de figurinha arrastada. As asas
 * batem rapido demais pra o olho separar, entao lem como borrao, igual
 * mosca de verdade.
 *
 * O cursor nativo some (`html.bug-cursor`). Por isso o inseto CRESCE em
 * cima de link e botao: sem essa dica o usuario perde a nocao do que e
 * clicavel, que e o risco de trocar o cursor do sistema.
 *
 * Nao liga no celular (nao ha ponteiro) nem pra quem pediu menos movimento,
 * e nesses casos o cursor normal continua como sempre foi.
 */
export default function CursorBug() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    watchPointer();
    document.documentElement.classList.add("bug-cursor");
    pointer.hasBug = true;

    let x = pointer.raw.x;
    let y = pointer.raw.y;
    let angle = 0;
    let scale = 1;
    let targetScale = 1;
    let spin = 0; // giro de bicho se debatendo, so quando e pego
    let raf = 0;
    let alive = true;

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      targetScale = t?.closest("a, button") ? 1.55 : 1;
    };

    const tick = () => {
      if (!alive) return;

      const dx = pointer.raw.x - x;
      const dy = pointer.raw.y - y;

      x += dx * 0.17;
      y += dy * 0.17;

      pointer.bug.x = x;
      pointer.bug.y = y;

      // So corrige o rumo quando esta realmente voando. Sem esse corte ele
      // fica girando sozinho por causa de ruido de sub pixel quando parado.
      if (Math.hypot(dx, dy) > 1.6) {
        const want = (Math.atan2(dy, dx) * 180) / Math.PI;
        // caminho mais curto no circulo, senao ele da a volta pra ir de 179 a -179
        const diff = ((want - angle + 540) % 360) - 180;
        angle += diff * 0.22;
        // mantem o angulo entre -180 e 180; sem isso ele cresce pra sempre
        angle = ((angle + 180) % 360 + 360) % 360 - 180;
      }

      // Comido: some na boca do sapao e volta sozinho quando a lingua
      // recolhe. Nunca fica sumido por muito tempo, e o cursor da pessoa.
      const engolido = hunt.state === "caught";
      scale += ((engolido ? 0 : targetScale) - scale) * (engolido ? 0.42 : 0.16);
      spin += engolido ? 26 : 0;
      if (!engolido && spin !== 0) spin *= 0.8;
      if (Math.abs(spin) < 0.5) spin = 0;

      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${angle + spin}deg) scale(${Math.max(0, scale)})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.classList.remove("bug-cursor");
      pointer.hasBug = false;
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="bug-host pointer-events-none fixed left-0 top-0 z-[300]"
      style={{ willChange: "transform" }}
    >
      {/* Desenhado apontando pra DIREITA (cabeca em x alto). O rotate do
          JS gira a partir dai. Tudo em aresta reta e chapa: curva organica
          le como bichinho fofo, chapa com costura le como maquina. */}
      <svg width="66" height="44" viewBox="0 0 72 48" fill="none">
        <defs>
          <linearGradient id="bfPlate" x1="10" y1="14" x2="30" y2="34">
            <stop offset="0" stopColor="#4a5344" />
            <stop offset="0.4" stopColor="#1d231b" />
            <stop offset="1" stopColor="#070a06" />
          </linearGradient>
          <linearGradient id="bfHead" x1="54" y1="16" x2="68" y2="32">
            <stop offset="0" stopColor="#5a6452" />
            <stop offset="0.55" stopColor="#232a20" />
            <stop offset="1" stopColor="#0a0d08" />
          </linearGradient>
          <linearGradient id="bfWing" x1="46" y1="24" x2="16" y2="6">
            <stop offset="0" stopColor="#d9ff7a" stopOpacity="0.5" />
            <stop offset="0.55" stopColor="#a6ff00" stopOpacity="0.16" />
            <stop offset="1" stopColor="#a6ff00" stopOpacity="0.02" />
          </linearGradient>
          <radialGradient id="bfHalo">
            <stop offset="0" stopColor="#a6ff00" stopOpacity="0.3" />
            <stop offset="1" stopColor="#a6ff00" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="38" cy="24" rx="24" ry="15" fill="url(#bfHalo)" />

        {/* ASAS: paineis duros e varridos pra tras, nao bolha.
            Nunca somem de todo, so achatam, senao pisca buraco. */}
        <g className="bug-wing bug-wing-a">
          <path
            d="M46 20 L30 5 L15 8 L41 22 Z"
            fill="url(#bfWing)"
            stroke="#c8ff4d"
            strokeOpacity="0.45"
            strokeWidth="0.7"
          />
        </g>
        <g className="bug-wing bug-wing-b">
          <path
            d="M46 28 L30 43 L15 40 L41 26 Z"
            fill="url(#bfWing)"
            stroke="#c8ff4d"
            strokeOpacity="0.45"
            strokeWidth="0.7"
          />
        </g>

        {/* PERNAS articuladas, com joelho */}
        <g
          stroke="#161c14"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M44 19 L39 11 L32 8" />
          <path d="M34 18 L28 11 L21 9" />
          <path d="M25 19 L19 13 L12 12" />
          <path d="M44 29 L39 37 L32 40" />
          <path d="M34 30 L28 37 L21 39" />
          <path d="M25 29 L19 35 L12 36" />
        </g>

        {/* ABDOMEN: tres chapas encaixadas, costura verde entre elas */}
        <path d="M30 17 L42 18.5 L42 29.5 L30 31 L26 24 Z" fill="url(#bfPlate)" />
        <path d="M19 18.5 L30 17 L26 24 L30 31 L19 29.5 L16 24 Z" fill="url(#bfPlate)" />
        <path d="M9 21 L19 18.5 L16 24 L19 29.5 L9 27 Z" fill="url(#bfPlate)" />
        <g stroke="#a6ff00" strokeOpacity="0.4" strokeWidth="0.8" fill="none">
          <path d="M30 17 L26 24 L30 31" />
          <path d="M19 18.5 L16 24 L19 29.5" />
        </g>
        {/* brilho de topo, o que faz a chapa parecer metal e nao papel */}
        <g stroke="#c9d6c0" strokeOpacity="0.3" strokeWidth="0.8" fill="none">
          <path d="M31 18.6 L41 19.8" />
          <path d="M20 19.8 L28.5 18.7" />
        </g>

        {/* TORAX com o nucleo aceso */}
        <path d="M42 17 L55 19 L55 29 L42 31 Z" fill="url(#bfPlate)" />
        <rect x="44" y="22.6" width="10" height="2.8" rx="1.4" fill="#a6ff00" />
        <rect x="44" y="22.6" width="10" height="1.1" rx="0.55" fill="#eaffb8" />

        {/* CABECA chanfrada */}
        <path d="M55 18.5 L65 20 L67 24 L65 28 L55 29.5 Z" fill="url(#bfHead)" />

        {/* LENTES */}
        <circle cx="61.5" cy="21.3" r="2.5" fill="#0a0d08" />
        <circle cx="61.5" cy="26.7" r="2.5" fill="#0a0d08" />
        <circle cx="61.5" cy="21.3" r="1.8" fill="#a6ff00" />
        <circle cx="61.5" cy="26.7" r="1.8" fill="#a6ff00" />
        <circle cx="62.2" cy="20.7" r="0.6" fill="#fff" opacity="0.95" />
        <circle cx="62.2" cy="26.1" r="0.6" fill="#fff" opacity="0.95" />

        {/* ANTENAS retas com ponta acesa */}
        <g stroke="#8fb838" strokeWidth="1.1" strokeLinecap="round" fill="none">
          <path d="M64 19.5 L70 14 L71.5 10" />
          <path d="M64 28.5 L70 34 L71.5 38" />
        </g>
        <circle cx="71.5" cy="10" r="1.1" fill="#a6ff00" />
        <circle cx="71.5" cy="38" r="1.1" fill="#a6ff00" />
      </svg>
    </div>
  );
}
