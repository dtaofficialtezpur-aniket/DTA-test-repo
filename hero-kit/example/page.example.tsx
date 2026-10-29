// app/page.tsx
import { SmoothScroll } from "@/components/map-hero";
import { DtaMapHero } from "@/components/DtaMapHero";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      {/* your header goes here; see "Switching the header theme" in the README */}
      <main>
        <DtaMapHero />
        {/* the rest of your page: the hero fades to a light background at the end of its scroll */}
      </main>
    </>
  );
}
