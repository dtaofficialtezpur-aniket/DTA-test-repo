"use client";

import dynamic from "next/dynamic";
import { wa } from "@/lib/content";

const DocScene = dynamic(() => import("./DocScene"), { ssr: false });

const lexend = "font-[family-name:var(--f-lexend)]";
const source = "font-[family-name:var(--f-source)]";

function WhatsApp() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-1.9 1.3-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.1-.2-1.2-1.6-1.2-3s.8-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.3.4c-.1.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.4 0 .1 0 .7-.2 1.3Z" />
    </svg>
  );
}

export function PreviewHero2() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#FAFBFC] text-[#0B1B33]">
      <div className="absolute inset-0">
        <DocScene />
      </div>
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-24 text-center sm:pt-28">
        <h1 className={`${lexend} text-balance text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-[3.6rem]`}>
          Websites, GST filing and business licences, handled by one team.
        </h1>
        <p className={`${source} mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-[#475569]`}>
          DTA builds your website or CRM, files your GST and income tax returns, and gets your trade licence and FSSAI registration. We work from our offices in Tezpur and Bangalore.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href="#contact" className={`${lexend} inline-flex min-h-12 items-center rounded-lg bg-[#0B5FCC] px-6 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-[#0A4EA8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FCC]`}>
            Book a free consultation
          </a>
          <a href={wa("Hi DTA! I'd like to talk about my business.")} className={`${lexend} inline-flex min-h-12 items-center gap-2 rounded-lg border border-[#0B1B33]/25 bg-white px-5 text-[15px] font-medium transition-colors duration-200 hover:border-[#0B1B33] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5FCC]`}>
            <WhatsApp /> Chat on WhatsApp
          </a>
        </div>
        <p className={`${source} mt-5 text-[15px] text-[#475569]`}>500+ businesses served. We reply within 24 hours, Monday to Saturday.</p>
      </div>
    </section>
  );
}
