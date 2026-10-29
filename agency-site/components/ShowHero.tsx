"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { wa } from "@/lib/content";

const ShowScene = dynamic(() => import("./ShowScene"), { ssr: false });
const lexend = "font-[family-name:var(--f-lexend)]";
const source = "font-[family-name:var(--f-source)]";

export function ShowHero({ v }: { v: string }) {
  const dark = v === "d";
  const centered = v === "b" || v === "d";
  const ink = dark ? "text-white" : "text-[#0B1B33]";
  const muted = dark ? "text-[#A9B8D0]" : "text-[#475569]";
  const btn2 = dark ? "border-white/30 bg-white/5 text-white hover:border-white" : "border-[#0B1B33]/25 bg-white hover:border-[#0B1B33]";
  const copy = useMemo(() => ({
    h: "Websites, GST filing and business licences, handled by one team.",
    p: "DTA builds your website or CRM, files your GST and income tax returns, and gets your trade licence and FSSAI registration. We work from our offices in Tezpur and Bangalore.",
  }), []);
  return (
    <section className={`relative isolate min-h-[100svh] overflow-hidden ${dark ? "bg-[#060B16]" : "bg-[#FAFBFC]"} ${ink}`}>
      {dark && <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_70%,#0c2a5a,transparent_70%)]" />}
      {v === "c" && <div className="absolute inset-0 bg-[radial-gradient(45%_60%_at_72%_50%,#e9eff9,transparent_70%)]" />}
      <div className="absolute inset-0"><ShowScene /></div>
      <div className={`relative z-10 mx-auto flex max-w-6xl flex-col px-6 pt-28 sm:pt-32 ${centered ? "items-center text-center" : "items-start text-left"}`}>
        <h1 className={`${lexend} text-balance font-semibold leading-[1.06] tracking-[-0.03em] ${centered ? "max-w-5xl text-[2.1rem] sm:text-5xl lg:text-[3.6rem]" : "max-w-xl text-[2.1rem] sm:text-5xl lg:text-[3.4rem]"}`}>{copy.h}</h1>
        <p className={`${source} mt-5 text-pretty text-lg leading-relaxed ${muted} ${centered ? "max-w-2xl" : "max-w-lg"}`}>{copy.p}</p>
        <div className={`mt-7 flex flex-wrap gap-3 ${centered ? "justify-center" : ""}`}>
          <a href="#contact" className={`${lexend} inline-flex min-h-12 items-center rounded-lg bg-[#0B5FCC] px-6 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-[#0A4EA8]`}>Book a free consultation</a>
          <a href={wa("Hi DTA! I'd like to talk about my business.")} className={`${lexend} inline-flex min-h-12 items-center rounded-lg border px-5 text-[15px] font-medium transition-colors duration-200 ${btn2}`}>Chat on WhatsApp</a>
        </div>
        <p className={`${source} mt-5 text-[15px] ${muted}`}>500+ businesses served. We reply within 24 hours, Monday to Saturday.</p>
      </div>
    </section>
  );
}
