"use client";

import { departments, wa } from "@/lib/content";

const lexend = "font-[family-name:var(--f-lexend)]";
const source = "font-[family-name:var(--f-source)]";

const dates = [
  ["7th", "TDS deposit", "Every month"],
  ["11th", "GSTR-1", "Monthly filers"],
  ["20th", "GSTR-3B", "Monthly return"],
  ["30th", "TDS return", "Every quarter"],
  ["31 July", "Income tax return", "Individuals"],
];

const titles = ["Digital growth", "Trade and compliance", "Accounts and tax"];

function Tick() {
  return (
    <svg viewBox="0 0 20 20" className="mt-1 h-4 w-4 shrink-0 text-[#0B5FCC]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m4 10.5 4 4 8-9" />
    </svg>
  );
}

export function PreviewSections2() {
  return (
    <div className={`${source} bg-[#FAFBFC] text-[#0B1B33]`}>
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className={`${lexend} max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl`}>
          What we file, build and get approved for you
        </h2>
        <div className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-3">
          {departments.map((d, i) => (
            <div key={d.name} className="border-t-2 border-[#0B1B33] pt-6">
              <h3 className={`${lexend} text-xl font-semibold`}>{titles[i]}</h3>
              <p className="mt-3 text-[17px] leading-relaxed text-[#475569]">{d.body}</p>
              <ul className="mt-5 space-y-2.5">
                {d.items.map((it) => (
                  <li key={it} className="flex gap-3 text-[16px]"><Tick />{it}</li>
                ))}
              </ul>
              <a href={wa(`Hi DTA! I would like to know more about ${titles[i]}.`)} className="mt-6 inline-flex min-h-11 items-center text-[16px] font-semibold text-[#0B5FCC] underline decoration-2 underline-offset-4 hover:text-[#0A4EA8]">
                Ask about {titles[i].toLowerCase()}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#E3E8F0] bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className={`${lexend} text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl`}>Dates you cannot miss</h2>
            <p className="mt-4 max-w-md text-[18px] leading-relaxed text-[#475569]">
              Late filing means penalties. We track every deadline for you and file before it falls due.
            </p>
            <a href={wa("Hi DTA! Please remind me about GST and TDS due dates.")} className={`${lexend} mt-7 inline-flex min-h-12 items-center rounded-lg bg-[#0B5FCC] px-6 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-[#0A4EA8]`}>
              Get due-date reminders on WhatsApp
            </a>
          </div>
          <div className="overflow-hidden rounded-lg border border-[#E3E8F0]">
            <table className="w-full text-left text-[17px]">
              <caption className="sr-only">Monthly and quarterly compliance deadlines</caption>
              <thead className="bg-[#F3F6FA] text-[14px] text-[#475569]">
                <tr><th scope="col" className="px-5 py-3 font-semibold">Due</th><th scope="col" className="px-5 py-3 font-semibold">Filing</th><th scope="col" className="px-5 py-3 font-semibold">Applies to</th></tr>
              </thead>
              <tbody>
                {dates.map(([d, f, w]) => (
                  <tr key={f} className="border-t border-[#E3E8F0]">
                    <td className={`${lexend} whitespace-nowrap px-5 py-4 font-semibold tabular-nums`}>{d}</td>
                    <td className="px-5 py-4 font-medium">{f}</td>
                    <td className="px-5 py-4 text-[#475569]">{w}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
