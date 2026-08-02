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
      {/* A AGUA. `object-bottom` prende a superficie na base da tela, entao
          o horizonte cai sempre no mesmo lugar em qualquer altura de tela. */}
      <div className="absolute inset-x-0 bottom-0 top-[26%] overflow-hidden">
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

      {/* Nevoa do horizonte: funde a agua com o preto da pagina, pra nao
          existir uma linha reta denunciando onde o video comeca. */}
      <div
        className="absolute inset-x-0 top-[18%] h-[26%]"
        style={{
          background:
            "linear-gradient(to bottom, #0d0d0d 6%, rgba(13,13,13,0.72) 48%, transparent 100%)",
        }}
      />

      {/* Escurece a agua o suficiente pra a copy ler por cima dela. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(13,13,13,0.2) 0%, rgba(13,13,13,0.55) 55%, rgba(13,13,13,0.78) 100%)",
        }}
      />
    </div>
  );
}
