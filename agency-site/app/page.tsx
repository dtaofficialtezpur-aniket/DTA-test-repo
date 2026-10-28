import { Software } from "@/components/Bento";
import { Cursor } from "@/components/Cursor";
import { Departments } from "@/components/Departments";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { About, Contact, Footer, Marquee, Offers, Process, Why } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Cursor />
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
