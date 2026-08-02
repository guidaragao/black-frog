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
            "linear-gradient(to bottom, rgba(6,10,7,0.82) 0%, rgba(9,14,10,0.34) 45%, transparent 100%)",
        }}
      />

      {/* Nevoa do horizonte. So COR, sem desfoque: o backdrop-blur que
          estava aqui borrava todas as palavras que ficam atras dele. */}
      <div
        className="absolute inset-x-0 top-[28%] h-[34%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(102,132,110,0.06) 45%, transparent)",
        }}
      />

      {/* fecha os cantos e puxa o olho pro centro */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 62%, transparent 42%, rgba(8,12,9,0.38) 78%, rgba(8,12,9,0.78) 100%)",
        }}
      />
    </div>
  );
}
