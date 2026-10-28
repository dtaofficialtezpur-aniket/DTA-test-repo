import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { About, Contact, Departments, Footer, Marquee, Offers, Process, Software, Why } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
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
