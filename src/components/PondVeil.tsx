/**
 * O VEU DO LAGO: a camada de ar entre a camera e o fundo da cena.
 *
 * Existe separado do `Pond` de proposito. O lago fica no z 0 e este veu no
 * z 3, e no meio deles moram as coisas DISTANTES (as frases e o titulo).
 * Assim a nevoa passa POR CIMA delas, que e o que de fato manda uma coisa
 * pro fundo.
 *
 * Baixar opacidade do texto so apaga o texto. O que cria distancia e ter
 * atmosfera na frente dele.
 */
export default function PondVeil() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[3]">
      {/* escuridao do alto, some sobre o que estiver la atras */}
      <div
        className="absolute inset-x-0 top-0 h-[46%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(6,10,7,0.9) 0%, rgba(9,14,10,0.55) 45%, transparent 100%)",
        }}
      />

      {/* nevoa na altura do horizonte, a faixa que mais vela o que esta longe */}
      <div
        className="absolute inset-x-0 top-[28%] h-[34%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(102,132,110,0.16) 45%, transparent)",
          backdropFilter: "blur(1.4px)",
          WebkitBackdropFilter: "blur(1.4px)",
        }}
      />

      {/* fecha os cantos e puxa o olho pro centro */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 85% at 50% 62%, transparent 26%, rgba(8,12,9,0.55) 70%, rgba(8,12,9,0.88) 100%)",
        }}
      />
    </div>
  );
}
