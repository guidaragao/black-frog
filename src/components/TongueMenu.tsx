"use client";

import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";

/**
 * O MENU LINGUA.
 *
 * Fechado, e so um ponto verde no canto. Aberto, a lingua do sapao dispara
 * do gatilho e desce pela tela; cada item do menu chega GRUDADO nela, um a
 * um, conforme a ponta passa pela linha dele. Fechar recolhe a lingua e
 * leva os itens junto.
 *
 * A ideia: e a unica mecanica de menu que so a Black Frog pode ter, porque
 * nasce do bicho. Menu que desliza de lado qualquer site tem.
 *
 * COMO A SINCRONIA FUNCIONA
 * A lingua nao e um video nem uma animacao pronta: e um caminho SVG cuja
 * altura vai de 0 a 100% num `requestAnimationFrame`. Cada item guarda em
 * que ponto da descida ele mora (0 a 1) e so aparece quando a ponta passa
 * dele. Por isso o item nunca chega antes da lingua, em nenhuma tela e em
 * nenhuma velocidade de maquina.
 *
 * Quem pediu menos movimento no sistema recebe o menu de uma vez, sem o
 * bote: a informacao e a mesma, so o teatro sai.
 */

const ABRE_MS = 620;
const FECHA_MS = 380;

export default function TongueMenu() {
  const [aberto, setAberto] = useState(false);
  const [prog, setProg] = useState(0); // 0 fechado, 1 escancarado
  const raf = useRef(0);
  const painelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduzido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduzido) {
      setProg(aberto ? 1 : 0);
      return;
    }

    const de = prog;
    const para = aberto ? 1 : 0;
    const dur = aberto ? ABRE_MS : FECHA_MS;
    const t0 = performance.now();

    const passo = (agora: number) => {
      const t = Math.min(1, (agora - t0) / dur);
      // saida rapida e chegada macia na abertura (bote de lingua);
      // recolhimento mais linear, como quem puxa de volta
      const e = aberto ? 1 - Math.pow(1 - t, 3) : t * t;
      setProg(de + (para - de) * e);
      if (t < 1) raf.current = requestAnimationFrame(passo);
    };

    raf.current = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf.current);
    // prog de proposito fora: ele e o alvo da animacao, nao o gatilho
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto]);

  // trava o scroll e devolve o foco, como qualquer menu que se preze
  useEffect(() => {
    if (!aberto) return;
    document.body.style.overflow = "hidden";
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", onEsc);
    painelRef.current?.querySelector("a")?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    };
  }, [aberto]);

  const itens = [...nav, { label: "Start a project", href: "#contact" }];
  const visivel = prog > 0.001;

  return (
    <>
      {/* ---------- O GATILHO ---------- */}
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-controls="menu-lingua"
        aria-label={aberto ? "Close menu" : "Open menu"}
        className="group relative z-[210] flex h-11 items-center gap-3 rounded-full border border-white/15 pl-5 pr-2.5 transition-colors duration-300 hover:border-bf-green/40"
      >
        <span className="text-sm font-bold text-white">
          {aberto ? "Close" : "Menu"}
        </span>
        {/* a bolinha e a PONTA da lingua ainda dentro da boca */}
        <span
          className="block h-6 w-6 rounded-full transition-transform duration-300 group-hover:scale-110"
          style={{
            background:
              "radial-gradient(60% 60% at 38% 32%, #e0798f, #c04a62 55%, #6d1626)",
            boxShadow: "0 0 12px rgba(201,74,99,0.5)",
          }}
        />
      </button>

      {/* ---------- O BOTE ---------- */}
      <div
        id="menu-lingua"
        ref={painelRef}
        aria-hidden={!aberto}
        className="fixed inset-0 z-[205]"
        style={{
          pointerEvents: aberto ? "auto" : "none",
          visibility: visivel ? "visible" : "hidden",
        }}
      >
        {/* cortina */}
        <div
          onClick={() => setAberto(false)}
          className="absolute inset-0 bg-[#070b08]"
          style={{ opacity: prog * 0.94 }}
        />

        {/* A LINGUA descendo do gatilho. Fica na direita, e os itens
            penduram nela pra esquerda. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="bfMenuTongue" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5c1522" />
              <stop offset="0.35" stopColor="#c2465c" />
              <stop offset="0.6" stopColor="#d05a72" />
              <stop offset="1" stopColor="#4d101c" />
            </linearGradient>
          </defs>

          {/* grossa na raiz (a boca) e fina na ponta, como no hero */}
          <path
            d={`M 88.6 0
                L 91.4 0
                L ${91.4 - 0.9} ${prog * 100}
                L ${88.6 + 0.9} ${prog * 100} Z`}
            fill="url(#bfMenuTongue)"
          />
        </svg>

        {/* a almofada pegajosa da ponta */}
        <span
          aria-hidden
          className="absolute rounded-full"
          style={{
            left: "90%",
            top: `${prog * 100}%`,
            width: 22,
            height: 22,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(60% 60% at 38% 32%, #e0798f, #c04a62 55%, #6d1626)",
            boxShadow: "0 0 18px rgba(201,74,99,0.55)",
            opacity: visivel ? 1 : 0,
          }}
        />

        {/* ---------- OS ITENS, grudados na lingua ---------- */}
        <nav
          aria-label="Main"
          className="absolute inset-y-0 right-[14%] flex flex-col justify-center gap-2 md:right-[16%]"
        >
          {itens.map((item, i) => {
            // onde este item mora na descida: entre 18% e 82% do caminho
            const ponto = 0.18 + (i / (itens.length - 1)) * 0.64;
            const chegou = prog >= ponto;
            const ultimo = i === itens.length - 1;

            return (
              <a
                key={item.href + item.label}
                href={item.href}
                onClick={() => setAberto(false)}
                className={`group flex items-center justify-end gap-4 py-2 text-right transition-all duration-300 ${
                  ultimo ? "text-bf-green" : "text-white hover:text-bf-green"
                }`}
                style={{
                  opacity: chegou ? 1 : 0,
                  // entra deslizando DA lingua, nao do nada
                  transform: chegou ? "translateX(0)" : "translateX(48px)",
                  pointerEvents: chegou ? "auto" : "none",
                }}
              >
                <span className="display text-[clamp(1.8rem,4.4vw,3.4rem)] leading-[1.1]">
                  {item.label}
                </span>
                {/* o filete que liga o item na lingua */}
                <span
                  aria-hidden
                  className="block h-[2px] bg-bf-green/40 transition-all duration-300 group-hover:bg-bf-green"
                  style={{ width: chegou ? 34 : 0 }}
                />
              </a>
            );
          })}
        </nav>
      </div>
    </>
  );
}
