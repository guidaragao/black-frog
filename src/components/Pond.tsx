"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * O lago do hero. Video real (o que a Ingrid gerou), nao mais a grade em CSS.
 *
 * O video ja tem a profundidade embutida: camera na altura da agua, ondas
 * concentricas que encolhem indo pro fundo e nevoa no horizonte. Nenhuma
 * grade desenhada chegaria perto.
 *
 * Tratamento feito no arquivo antes de entrar aqui:
 * - marca d'agua do gerador apagada no canto (delogo)
 * - loop sem emenda: a cauda entra por cima do comeco, entao o ultimo frame
 *   e igual ao primeiro e a volta e invisivel
 * - 8s a 1600px, 1,2 MB
 *
 * O poster e o primeiro frame, pra nao piscar preto enquanto o video carrega.
 */
export default function Pond() {
  const [querVideo, setQuerVideo] = useState(false);
  const [pronto, setPronto] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // quem pediu menos movimento fica so com o frame parado
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setQuerVideo(true);
    }
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {/* A AGUA ocupa a tela INTEIRA, desde o topo. Antes ela comecava a
          26% e o terco de cima ficava preto chapado, o que denunciava que
          o lago era um adesivo colado embaixo em vez de ser o ambiente. */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/brand/lago-poster.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />

        {querVideo && (
          <video
            ref={ref}
            src="/brand/lago-loop.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={() => setPronto(true)}
            className={`absolute inset-0 h-full w-full object-cover object-bottom transition-opacity duration-1000 ${
              pronto ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      {/* Escuridao no alto, pro cabecalho ler. Nao e mais um corte: e
          sombra caindo por cima da propria agua. */}
      <div
        className="absolute inset-x-0 top-0 h-[42%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(6,8,6,0.96) 0%, rgba(8,11,8,0.72) 42%, transparent 100%)",
        }}
      />

      {/* MASSA ESCURA ATRAS DO SAPAO. E o que da o ar de fundo de lago:
          alguma coisa densa la atras, sem forma definida, so peso. */}
      <div
        className="absolute left-1/2 top-[30%] h-[46%] w-[62%] -translate-x-1/2 rounded-[50%] blur-[70px]"
        style={{ background: "rgba(4,10,4,0.85)" }}
      />
      <div
        className="absolute left-[26%] top-[36%] h-[30%] w-[26%] -translate-x-1/2 rounded-[50%] blur-[60px]"
        style={{ background: "rgba(3,8,3,0.7)" }}
      />
      <div
        className="absolute left-[76%] top-[34%] h-[32%] w-[28%] -translate-x-1/2 rounded-[50%] blur-[60px]"
        style={{ background: "rgba(3,8,3,0.7)" }}
      />

      {/* Escurece a agua o suficiente pra a copy ler por cima dela. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 58%, transparent 22%, rgba(9,12,9,0.6) 68%, rgba(9,12,9,0.9) 100%)",
        }}
      />
    </div>
  );
}
