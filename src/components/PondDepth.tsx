import Image from "next/image";
import { asset } from "@/lib/asset";

/**
 * O que existe LA NO FUNDO do lago.
 *
 * Sem isso a agua e uma superficie bonita e vazia, e superficie vazia nao
 * tem escala: o olho nao sabe se o horizonte esta a dez metros ou a um
 * quilometro. Basta ter COISAS em varias distancias pra o cerebro medir
 * sozinho.
 *
 * Tres familias, todas escuras, porque de longe e a silhueta que sobra:
 *   1. outras vitorias-regias boiando, cada vez menores indo pro fundo
 *   2. juncos nas margens, que fecham o enquadramento como cortina
 *   3. vaga-lumes, pontinhos acesos a alturas diferentes
 *
 * Tudo usa o MESMO arquivo da folha do sapao, so que pequeno e escurecido.
 * Peca nova seria peso a toa e ainda correria o risco de nao combinar.
 */

type Folha = { x: number; y: number; w: number; escuro: number; espelha?: boolean };

// y menor = mais perto do horizonte = mais longe = menor e mais escura
const FOLHAS: Folha[] = [
  { x: 16, y: 47, w: 9, escuro: 0.82 },
  { x: 78, y: 45, w: 7, escuro: 0.86, espelha: true },
  { x: 34, y: 52, w: 13, escuro: 0.72 },
  { x: 88, y: 55, w: 16, escuro: 0.66, espelha: true },
  { x: 6, y: 61, w: 20, escuro: 0.58 },
  { x: 62, y: 43, w: 6, escuro: 0.88 },
];

const VAGALUMES = [
  { x: 12, y: 38, d: 0 },
  { x: 27, y: 33, d: 2.4 },
  { x: 44, y: 40, d: 1.1 },
  { x: 58, y: 31, d: 3.6 },
  { x: 71, y: 37, d: 0.8 },
  { x: 83, y: 34, d: 2.9 },
  { x: 92, y: 41, d: 4.3 },
  { x: 20, y: 44, d: 5.1 },
];

export default function PondDepth() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
      {/* JUNCOS nas margens, cortina que fecha o quadro */}
      <svg
        className="absolute bottom-[24%] left-0 h-[34%] w-[22%] opacity-[0.55]"
        viewBox="0 0 100 120"
        preserveAspectRatio="none"
      >
        <g fill="#050a06">
          <path d="M8 120 C6 80 2 52 0 34 L4 34 C7 54 11 82 13 120 Z" />
          <path d="M20 120 C19 86 17 60 13 40 L17 39 C22 60 24 88 25 120 Z" />
          <path d="M33 120 C33 92 30 68 25 48 L29 47 C35 68 38 93 38 120 Z" />
          <path d="M47 120 C48 96 46 76 42 58 L45 57 C50 76 52 97 52 120 Z" />
          <ellipse cx="2" cy="32" rx="2" ry="6" />
          <ellipse cx="15" cy="37" rx="2" ry="6" />
          <ellipse cx="27" cy="45" rx="2" ry="6" />
        </g>
      </svg>

      <svg
        className="absolute bottom-[22%] right-0 h-[30%] w-[20%] opacity-[0.5]"
        viewBox="0 0 100 120"
        preserveAspectRatio="none"
        style={{ transform: "scaleX(-1)" }}
      >
        <g fill="#050a06">
          <path d="M10 120 C8 84 4 56 1 38 L5 38 C9 58 13 86 15 120 Z" />
          <path d="M24 120 C23 90 20 64 16 46 L20 45 C25 65 28 92 29 120 Z" />
          <path d="M38 120 C38 98 35 78 31 60 L34 59 C40 78 43 99 43 120 Z" />
          <ellipse cx="3" cy="36" rx="2" ry="6" />
          <ellipse cx="18" cy="43" rx="2" ry="6" />
        </g>
      </svg>

      {/* OUTRAS FOLHAS boiando ao longe */}
      {FOLHAS.map((f, i) => (
        <div
          key={i}
          className="drift absolute"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: `${f.w}%`,
            transform: `translate(-50%, -50%)${f.espelha ? " scaleX(-1)" : ""}`,
            filter: `brightness(${1 - f.escuro}) saturate(0.6)`,
            animationDelay: `${-i * 1.9}s`,
            animationDuration: `${9 + i}s`,
          }}
        >
          <Image
            src={asset("/brand/lily-pad.webp")}
            alt=""
            width={1200}
            height={554}
            className="h-auto w-full"
          />
        </div>
      ))}

      {/* VAGALUMES, pontinhos acesos em profundidades diferentes */}
      {VAGALUMES.map((v, i) => (
        <span
          key={i}
          className="firefly absolute rounded-full"
          style={{
            left: `${v.x}%`,
            top: `${v.y}%`,
            width: 3,
            height: 3,
            background: "#a6ff00",
            boxShadow: "0 0 8px 2px rgba(166,255,0,0.55)",
            animationDelay: `${v.d}s`,
          }}
        />
      ))}
    </div>
  );
}
