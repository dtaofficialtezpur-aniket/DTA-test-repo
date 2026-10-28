import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Contact, Footer, Marquee, Process, Services, Stats, Work } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Work />
        <Process />
        <Stats />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
