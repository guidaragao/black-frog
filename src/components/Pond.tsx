/**
 * O lago do hero, com profundidade de verdade.
 *
 * Nao e um degrade fingindo agua: e um PLANO deitado em perspectiva
 * (`rotateX`), entao a grade sobre ele converge sozinha pro horizonte e o
 * olho le distancia. Uma grade desenhada chapada nunca convence; deitada,
 * convence sem custo nenhum.
 *
 * As ondas sao elipses no mesmo plano, entao elas tambem viajam em
 * perspectiva: crescem e somem indo pro fundo, como onda de verdade.
 *
 * Fica atras de tudo e nao captura clique.
 */
export default function Pond() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[62%] overflow-hidden"
      style={{ perspective: "760px", perspectiveOrigin: "50% 0%" }}
    >
      {/* O PLANO DEITADO */}
      <div
        className="absolute inset-x-[-30%] bottom-0 top-[18%] origin-top"
        style={{ transform: "rotateX(74deg)" }}
      >
        {/* grade que converge pro fundo */}
        <div
          className="pond-grid absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(166,255,0,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(166,255,0,0.09) 1px, transparent 1px)",
            backgroundSize: "5% 7%",
            maskImage:
              "radial-gradient(80% 70% at 50% 100%, #000 8%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(80% 70% at 50% 100%, #000 8%, transparent 72%)",
          }}
        />

        {/* ondas viajando no plano, entao elas somem no horizonte */}
        <span className="pond-wave pond-wave-1" />
        <span className="pond-wave pond-wave-2" />
        <span className="pond-wave pond-wave-3" />
      </div>

      {/* neblina no horizonte, funde a agua com o preto da pagina */}
      <div
        className="absolute inset-x-0 top-0 h-[46%]"
        style={{
          background:
            "linear-gradient(to bottom, #0d0d0d 12%, rgba(13,13,13,0.6) 55%, transparent 100%)",
        }}
      />

      {/* brilho baixo sobre a agua */}
      <div
        className="absolute bottom-0 left-1/2 h-[52%] w-[70%] -translate-x-1/2 rounded-[50%] opacity-[0.1] blur-[90px]"
        style={{ background: "#a6ff00" }}
      />
    </div>
  );
}
