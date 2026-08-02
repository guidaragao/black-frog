"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gazeTarget, hunt, pointer, watchPointer } from "@/lib/pointer";

/**
 * O sapao do hero: olhos que seguem o inseto e boca que abre de verdade.
 *
 * A BOCA
 * Nao e desenhada por cima da arte, sao TRES POSES DE VERDADE do proprio
 * personagem (`frog-mouth-0/1/2.webp`), geradas a partir do mascote e
 * recortadas de fundo chroma. A boca abre com interior, labio molhado e
 * sombra reais em vez de um vetor colado por cima.
 *
 * Chroma MAGENTA, nao verde: ele e preto com verde acido e o logo do peito
 * e verde, entao fundo verde teria comido o logo e os olhos no recorte.
 *
 * As tres poses saem todas do MESMO frame base, senao a cabeca pula de
 * angulo na troca. Ainda sobra um micro deslocamento, que a 300ms de
 * animacao le como movimento e nao como defeito.
 *
 * OS OLHOS
 * Redesenhados em CSS por cima (esfera + pupila menor + brilho), porque na
 * arte a pupila ocupa quase todo o globo e nao teria pra onde andar. So a
 * pupila se move; o brilho fica preso na esfera, como olho molhado de
 * verdade. Medidas em % pra acompanhar qualquer tamanho de tela.
 *
 * O corpo NAO segue o mouse, so flutua sozinho. So o olhar reage.
 */

type Eye = {
  key: string;
  cx: number;
  cy: number;
  w: number;
  h: number;
  tilt: number;
  travel: number;
};

// Medidos com grade de 5% sobre a arte NOVA (1100x1366) e encolhidos um
// tico pra o desenho ficar dentro da palpebra em vez de vazar por cima.
const EYES: Eye[] = [
  { key: "left", cx: 22.8, cy: 11.5, w: 11.9, h: 14.6, tilt: -16, travel: 19 },
  { key: "right", cx: 65.3, cy: 20.2, w: 17.6, h: 14.2, tilt: -8, travel: 17 },
];

/**
 * De onde a lingua sai, em % da arte. Medido com grade de 5% sobre a POSE
 * ABERTA: a cavidade fica centrada em ~39% / 34%. Puxei um pouco pra
 * esquerda e pra dentro, senao a lingua nascia no canto do labio.
 */
const MOUTH = { x: 36, y: 34 };

/** Tempo de inseto parado antes de virar almoco. */
const IDLE_MS = 2600;

/** Fases da bicada, em ms. */
const JAW_MS = 120; // a boca abre ANTES da lingua sair
const OUT_MS = 165;
const HOLD_MS = 120;
const BACK_MS = 250;

const POSES = [
  "/brand/frog-mouth-0.webp", // fechada
  "/brand/frog-mouth-1.webp", // entreaberta
  "/brand/frog-mouth-2.webp", // escancarada
];

export default function HeroFrog() {
  // A lingua vai por portal pro <body>: `position: fixed` dentro de um pai
  // com `transform` (a flutuacao) passa a se medir a partir do pai, e ela
  // saía metros longe do inseto.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  const hostRef = useRef<HTMLDivElement>(null);
  const pupilRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const poseRefs = useRef<(HTMLDivElement | null)[]>([]);

  const tongueRef = useRef<SVGSVGElement>(null);
  const tongueBodyRef = useRef<SVGPathElement>(null);
  const tongueShineRef = useRef<SVGPathElement>(null);
  const tonguePadRef = useRef<SVGCircleElement>(null);
  const tonguePadHiRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    watchPointer();

    let cx = 0;
    let cy = 0;
    let raf = 0;
    let alive = true;

    let strikeStart = 0;
    let strikeFrom = 0;
    let larguraSapo = 560;
    let poseAtual = -1;
    const aim = { x: 0, y: 0, dist: 0, angle: 0 };

    /** Troca a pose da boca. Todas ja estao no DOM, so muda a opacidade. */
    const setPose = (i: number) => {
      if (i === poseAtual) return;
      poseAtual = i;
      poseRefs.current.forEach((el, k) => {
        if (el) el.style.opacity = k === i ? "1" : "0";
      });
    };

    /**
     * Desenha a lingua da boca ate a ponta.
     *
     * Grossa na raiz, fina na ponta, arqueada pra baixo pelo proprio peso
     * (o arco diminui conforme estica, igual chicote) e com uma almofada
     * pegajosa na ponta. Duas quadraticas espelhadas formam o contorno,
     * porque SVG nao afina traco sozinho.
     */
    const setTongue = (len: number) => {
      const svg = tongueRef.current;
      const body = tongueBodyRef.current;
      const shine = tongueShineRef.current;
      const pad = tonguePadRef.current;
      const padHi = tonguePadHiRef.current;
      if (!svg || !body || !shine || !pad || !padHi) return;

      if (len <= 1) {
        svg.style.opacity = "0";
        return;
      }
      svg.style.opacity = "1";

      const a = (aim.angle * Math.PI) / 180;
      const ux = Math.cos(a);
      const uy = Math.sin(a);
      const nx = -uy;
      const ny = ux;

      const px = aim.x;
      const py = aim.y;
      const tipX = px + ux * len;
      const tipY = py + uy * len;

      const esc = Math.max(0.55, Math.min(1.35, larguraSapo / 560));
      const wRaiz = 15 * esc;
      const wPonta = 6.2 * esc;
      const wMeio = ((wRaiz + wPonta) / 2) * 1.06;

      const prog = Math.min(1, len / Math.max(aim.dist, 1));
      const sag = len * 0.16 * (1 - prog * 0.72);

      const cX = px + ux * len * 0.5 + nx * sag;
      const cY = py + uy * len * 0.5 + ny * sag;

      body.setAttribute(
        "d",
        [
          `M ${px + nx * wRaiz * 0.5} ${py + ny * wRaiz * 0.5}`,
          `Q ${cX + nx * wMeio * 0.5} ${cY + ny * wMeio * 0.5} ${tipX + nx * wPonta * 0.5} ${tipY + ny * wPonta * 0.5}`,
          `L ${tipX - nx * wPonta * 0.5} ${tipY - ny * wPonta * 0.5}`,
          `Q ${cX - nx * wMeio * 0.5} ${cY - ny * wMeio * 0.5} ${px - nx * wRaiz * 0.5} ${py - ny * wRaiz * 0.5}`,
          "Z",
        ].join(" "),
      );

      const off = wMeio * 0.24;
      shine.setAttribute(
        "d",
        `M ${px - nx * off} ${py - ny * off} Q ${cX - nx * off} ${cY - ny * off} ${tipX - nx * off * 0.6} ${tipY - ny * off * 0.6}`,
      );
      shine.setAttribute("stroke-width", `${wPonta * 0.38}`);

      pad.setAttribute("cx", `${tipX}`);
      pad.setAttribute("cy", `${tipY}`);
      pad.setAttribute("r", `${wPonta * 0.95}`);
      padHi.setAttribute("cx", `${tipX - nx * wPonta * 0.28}`);
      padHi.setAttribute("cy", `${tipY - ny * wPonta * 0.28}`);
      padHi.setAttribute("r", `${wPonta * 0.3}`);
    };

    const endHunt = () => {
      hunt.state = "idle";
      strikeStart = 0;
      setTongue(0);
      setPose(0);
    };

    const tick = () => {
      if (!alive) return;

      const now = performance.now();
      const r0 = host.getBoundingClientRect();
      larguraSapo = r0.width;

      const mouthX = r0.left + (r0.width * MOUTH.x) / 100;
      const mouthY = r0.top + (r0.height * MOUTH.y) / 100;

      // ---------- A CACADA ----------
      if (hunt.state === "idle" && pointer.hasBug && strikeStart === 0) {
        const parado = now - pointer.lastMoveAt > IDLE_MS;
        const dx = pointer.bug.x - mouthX;
        const dy = pointer.bug.y - mouthY;
        const d = Math.hypot(dx, dy);

        // So ataca o que esta ao alcance. Lingua atravessando a tela toda
        // seria susto, nao graca.
        if (parado && d < 900 && r0.width > 0) {
          aim.x = mouthX;
          aim.y = mouthY;
          aim.dist = d;
          aim.angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          strikeStart = now;
          strikeFrom = pointer.lastMoveAt;
          hunt.state = "strike";
        }
      }

      if (strikeStart > 0) {
        // Qualquer movimento do mouse cancela na hora: o inseto e o cursor
        // da pessoa, e a brincadeira nao pode atrapalhar o uso do site.
        if (pointer.lastMoveAt !== strikeFrom) {
          endHunt();
        } else {
          const e = now - strikeStart;

          if (e < JAW_MS) {
            setPose(e < JAW_MS * 0.5 ? 1 : 2);
            setTongue(0);
          } else if (e < JAW_MS + OUT_MS) {
            setPose(2);
            setTongue(aim.dist * ((e - JAW_MS) / OUT_MS));
          } else if (e < JAW_MS + OUT_MS + HOLD_MS) {
            setPose(2);
            setTongue(aim.dist);
            hunt.state = "caught";
          } else if (e < JAW_MS + OUT_MS + HOLD_MS + BACK_MS) {
            const k = 1 - (e - JAW_MS - OUT_MS - HOLD_MS) / BACK_MS;
            setTongue(aim.dist * k);
            // fecha a boca so no fim, como quem mastiga
            setPose(k > 0.45 ? 2 : k > 0.12 ? 1 : 0);
          } else {
            endHunt();
          }
        }
      }

      // ---------- O OLHAR ----------
      // Ele olha pro INSETO, nao pro ponteiro: o inseto voa atras do mouse
      // com atraso, entao mirar no ponteiro faria o olhar chegar antes.
      const g = gazeTarget();
      const hx = r0.left + r0.width * 0.44;
      const hy = r0.top + r0.height * 0.16;

      const tx = Math.max(
        -1,
        Math.min(1, (g.x - hx) / (window.innerWidth * 0.42)),
      );
      const ty = Math.max(
        -1,
        Math.min(1, (g.y - hy) / (window.innerHeight * 0.42)),
      );

      cx += (tx - cx) * 0.09;
      cy += (ty - cy) * 0.09;

      EYES.forEach((eye, i) => {
        const el = pupilRefs.current[i];
        if (!el) return;
        el.style.transform = `translate(-50%, -50%) translate(${cx * eye.travel}%, ${cy * eye.travel}%)`;
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      hunt.state = "idle";
    };
  }, []);

  const lingua = (
    /* A LINGUA, em SVG e em coordenada de TELA (sem viewBox, 1 unidade =
       1 pixel CSS), igual ao inseto. */
    <svg
      ref={tongueRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[290] h-full w-full"
      style={{ opacity: 0 }}
    >
      <path ref={tongueBodyRef} fill="#b23a50" />
      <circle ref={tonguePadRef} r="0" fill="#c94a63" />
      <circle ref={tonguePadHiRef} r="0" fill="rgba(255,214,222,0.75)" />
      <path
        ref={tongueShineRef}
        fill="none"
        stroke="rgba(255,196,208,0.5)"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div ref={hostRef} className="frog-float relative w-full">
      {montado && createPortal(lingua, document.body)}

      <div className="relative">
        {/* As tres poses empilhadas. Todas carregam junto e a troca e so
            opacidade, senao a primeira bicada piscaria esperando o
            download da pose aberta. */}
        {POSES.map((src, i) => (
          <div
            key={src}
            ref={(el) => {
              poseRefs.current[i] = el;
            }}
            className={i === 0 ? "relative" : "absolute inset-0"}
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <Image
              src={src}
              alt={i === 0 ? "The Black Frog mascot" : ""}
              aria-hidden={i !== 0}
              width={1100}
              height={1366}
              priority
              quality={90}
              sizes="(max-width: 1024px) 78vw, 44vw"
              className="h-auto w-full"
              style={{
                filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.55))",
              }}
            />
          </div>
        ))}

        {EYES.map((eye, i) => (
          <span
            key={eye.key}
            aria-hidden
            className="absolute"
            style={{
              left: `${eye.cx}%`,
              top: `${eye.cy}%`,
              width: `${eye.w}%`,
              height: `${eye.h}%`,
              transform: `translate(-50%, -50%) rotate(${eye.tilt}deg)`,
              borderRadius: "50%",
              overflow: "hidden",
              // O claro fica curto de proposito: com muito branco no centro
              // o olho leitava leitoso, nao acido.
              background:
                "radial-gradient(72% 72% at 33% 24%, #dcff66 0%, #bced18 20%, #a2d20d 52%, #638806 84%, #3a5104 100%)",
              boxShadow:
                "inset 0 -7px 16px rgba(0,0,0,0.6), inset 0 3px 8px rgba(255,255,255,0.18)",
            }}
          >
            <span
              ref={(el) => {
                pupilRefs.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2 block"
              style={{
                width: "58%",
                height: "62%",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(60% 60% at 42% 32%, #2a2f22 0%, #0a0c06 46%, #000 100%)",
                boxShadow: "0 0 10px 2px rgba(0,0,0,0.6)",
              }}
            >
              {/* glint duro, anda junto com a pupila. E o que faz o olho
                  parecer molhado. */}
              <span
                className="absolute block rounded-full"
                style={{
                  left: "58%",
                  top: "16%",
                  width: "20%",
                  height: "17%",
                  background: "rgba(255,255,255,0.95)",
                  filter: "blur(0.4px)",
                }}
              />
            </span>

            {/* brilho preso na esfera, nao acompanha a pupila */}
            <span
              className="pointer-events-none absolute"
              style={{
                left: "16%",
                top: "6%",
                width: "46%",
                height: "30%",
                borderRadius: "50%",
                background:
                  "radial-gradient(closest-side, rgba(255,255,255,0.55), rgba(255,255,255,0))",
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
