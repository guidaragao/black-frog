import { units } from "@/content/site";

/**
 * As frases la atras, boiando no fundo do lago.
 *
 * E isso que faz o olho ler PROFUNDIDADE: nao basta a agua ter horizonte,
 * precisa ter coisa em varias distancias pra o cerebro comparar. Frase perto
 * e grande e nitida; frase longe e pequena, apagada e desfocada.
 *
 * Os tres valores de cada frase (tamanho, opacidade, desfoque) andam JUNTOS
 * pela mesma variavel de distancia. Se um sair do compasso, a ilusao quebra
 * na hora: texto pequeno e nitido le como texto pequeno, nao como texto longe.
 */

type Frase = {
  texto: string;
  /** 0 = colada na camera, 1 = quase no horizonte */
  d: number;
  /** posicao horizontal em % */
  x: number;
  /** altura na agua em %: quanto mais longe, mais perto do horizonte */
  y: number;
};

// Todas moram na AGUA ABERTA: a faixa de baixo e o meio, longe das colunas
// de copy. Frase distante passando por tras de texto legivel vira sujeira,
// nao profundidade.
const FRASES: Frase[] = [
  { texto: units[0].line, d: 0.2, x: 20, y: 72 },
  { texto: units[3].line, d: 0.34, x: 74, y: 76 },
  { texto: units[1].line, d: 0.54, x: 30, y: 62 },
  { texto: units[4].line, d: 0.64, x: 70, y: 60 },
  { texto: units[2].line, d: 0.82, x: 40, y: 53 },
  { texto: units[5].line, d: 0.92, x: 60, y: 50 },
];

export default function DistantWords() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
      {FRASES.map((f, i) => {
        // um so parametro governa os tres, senao a distancia nao convence
        // Distancia dita por TAMANHO e POSICAO, quase nao por borrao.
        // Borrar muito some com a palavra; o pedido era ela ficar la atras
        // e ainda assim aparecer bem.
        const escala = 1 - f.d * 0.5;
        const opacidade = 0.46 - f.d * 0.12;
        const desfoque = f.d * 0.7;

        return (
          <span
            key={f.texto}
            className="drift absolute whitespace-nowrap font-black uppercase text-white"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              transform: `translate(-50%, -50%) scale(${escala})`,
              fontSize: "clamp(0.7rem, 1.5vw, 1.15rem)",
              letterSpacing: "0.16em",
              opacity: opacidade,
              filter: `blur(${desfoque}px)`,
              // atraso diferente por frase, senao boiam em bloco
              animationDelay: `${-i * 1.7}s`,
              animationDuration: `${8 + i}s`,
            }}
          >
            {f.texto}
          </span>
        );
      })}
    </div>
  );
}
