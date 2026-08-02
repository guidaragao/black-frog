import { units } from "@/content/site";

/**
 * Anel de palavras girando em volta do sapao.
 *
 * O texto corre por dentro de um circulo via `textPath`. O truque que faz o
 * anel FECHAR sem emenda e o `textLength` travado no comprimento exato da
 * circunferencia com `lengthAdjust="spacing"`: o navegador estica ou aperta
 * so o espacamento pra caber certinho, entao nunca sobra um buraco nem as
 * palavras se atropelam, seja qual for o texto.
 *
 * Fica atras do sapao e nao rouba a leitura: e textura de marca, nao copy.
 * A copy que vende continua legivel nas colunas dos lados.
 */

// raio do circulo no sistema 0..100 do viewBox
const R = 44;
const CIRC = 2 * Math.PI * R;

export default function WordRing() {
  // UMA volta so da lista. Duas voltas obrigavam letra pequena pra caber,
  // e o pedido era palavra em PROPORCAO com o sapao, nao textura miuda.
  const texto = units.map((u) => `${u.name}   ·   `).join("");

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className="word-ring pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        {/* comeca no topo e vai no sentido horario */}
        <path
          id="bfRingPath"
          fill="none"
          d={`M 50 ${50 - R} A ${R} ${R} 0 1 1 49.99 ${50 - R}`}
        />
      </defs>

      <text
        fill="rgba(255,255,255,0.22)"
        style={{
          fontSize: 6.4,
          fontWeight: 900,
          letterSpacing: "0.01em",
        }}
      >
        <textPath
          href="#bfRingPath"
          startOffset="0"
          textLength={CIRC}
          lengthAdjust="spacing"
        >
          {texto}
        </textPath>
      </text>
    </svg>
  );
}
