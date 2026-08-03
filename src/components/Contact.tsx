import Image from "next/image";
import { contact } from "@/content/site";
import Reveal from "./Reveal";
import { asset } from "@/lib/asset";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden">
      {/* O sapao fecha a pagina do jeito que abriu. */}
      <Image
        src={asset("/brand/mark.png")}
        alt=""
        aria-hidden
        width={272}
        height={311}
        className="watermark left-1/2 top-1/2 h-[620px] w-auto -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
      />
      {/* Brilho grande e respirando, o ponto mais quente da pagina.
          A opacidade do pai segura o verde pra ele nao lavar o texto,
          e a do filho fica livre pra animar. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-45"
      >
        <div
          className="breathe h-[420px] w-[680px] rounded-full blur-[150px]"
          style={{ background: "#a6ff00" }}
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 py-28 text-center md:px-10 md:py-40">
        <Reveal>
          <p className="eyebrow text-xs text-bf-green">{contact.eyebrow}</p>
          <h2 className="display mx-auto mt-7 max-w-[17ch] text-[clamp(2.6rem,7.4vw,5.75rem)] text-white">
            {contact.headline}
          </h2>
          <p className="mx-auto mt-8 max-w-[56ch] text-[1.0625rem] leading-[1.7] text-white/60 md:text-[1.125rem]">
            {contact.body}
          </p>

          <a
            href={contact.cta.href}
            className="group mt-12 inline-flex items-center gap-3 rounded-full bg-bf-green px-10 py-5 text-base font-bold text-bf-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_60px_-8px_#a6ff00] md:text-lg"
          >
            {contact.cta.label}
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
