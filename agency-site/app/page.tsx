import { DtaMapHero } from "@/components/DtaMapHero";
import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/map-hero";
import { About, Contact, Departments, Footer, Marquee, Offers, Process, Software, Why } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <a href="#departments" className="sr-only z-[60] rounded-lg bg-white px-4 py-2 text-sm font-medium text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <SmoothScroll />
      <Nav />
      <main>
        <DtaMapHero />
        <Marquee />
        <Departments />
        <Software />
        <Offers />
        <Process />
        <Why />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
