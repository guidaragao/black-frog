/**
 * Fonte unica da posicao do ponteiro.
 *
 * Existe pra o sapao olhar pro INSETO e nao pro cursor invisivel. O inseto
 * persegue o mouse com atraso, entao se cada um escutasse o mousemove por
 * conta propria o olhar do sapao chegaria antes do bicho e a ilusao quebrava.
 *
 * `bug` e onde o inseto esta de fato agora. Se o cursor customizado nao
 * estiver ligado (celular, movimento reduzido), `hasBug` fica falso e quem
 * lê usa `raw`, que e o ponteiro cru.
 */
export const pointer = {
  raw: { x: 0, y: 0 },
  bug: { x: 0, y: 0 },
  hasBug: false,
  /** ultimo instante em que o mouse se mexeu, pra saber quando esta parado */
  lastMoveAt: 0,
};

/**
 * A cacada. Se o inseto fica parado tempo demais, o sapao dispara a lingua
 * e come ele.
 *
 * REGRA DURA: o inseto E o cursor. Ele nunca pode sumir de vez, senao a
 * pessoa fica sem ponteiro. Por isso qualquer movimento do mouse aborta a
 * cacada na hora, e mesmo quando a lingua acerta o bicho volta sozinho
 * em menos de meio segundo.
 */
export const hunt = {
  /** idle = a espreita | strike = lingua indo | caught = bicho na boca */
  state: "idle" as "idle" | "strike" | "caught",
};

let listening = false;

/** Liga o unico listener de mousemove da pagina. Pode chamar varias vezes. */
export function watchPointer() {
  if (listening || typeof window === "undefined") return;
  listening = true;

  pointer.raw.x = window.innerWidth / 2;
  pointer.raw.y = window.innerHeight / 2;
  pointer.bug.x = pointer.raw.x;
  pointer.bug.y = pointer.raw.y;
  pointer.lastMoveAt = performance.now();

  window.addEventListener(
    "mousemove",
    (e) => {
      pointer.raw.x = e.clientX;
      pointer.raw.y = e.clientY;
      pointer.lastMoveAt = performance.now();
    },
    { passive: true },
  );
}

/** Pra onde o sapao deve olhar: o inseto, se existir. */
export function gazeTarget() {
  return pointer.hasBug ? pointer.bug : pointer.raw;
}
