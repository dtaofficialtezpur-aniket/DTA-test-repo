import { MapHero } from "@/components/map-hero";
// DTA example data. Replace with your own.
const wa = (t: string) => `https://wa.me/917002060043?text=${encodeURIComponent(t)}`;
const brand = { hours: "Mon–Sat, 9 AM to 6 PM", offices: [{ lines: ["1st Floor, Charu Complex, SC Road,", "Near Head Post Office,", "Tezpur, Assam — 784001"] }, { lines: ["SRI, 21/1 (511/A), 1st Cross,", "Gokula 1st Stage, 1st Phase,", "Bangalore, Karnataka — 560054"] }] };

// Every DTA-specific word, place and colour for the reusable hero lives here.
const pins = [
  { lon: 92.8, lat: 26.6, label: "Tezpur office", sub: "Assam" },
  { lon: 77.6, lat: 13.0, label: "Bangalore office", sub: "Karnataka" },
];

const stages = [
  { pin: 0, eyebrow: "Tezpur, Assam", title: "Our first office", lines: brand.offices[0].lines, meta: brand.hours },
  { pin: 1, eyebrow: "Bangalore, Karnataka", title: "Our second office", lines: brand.offices[1].lines, meta: brand.hours },
];

// Faint routes to other Indian cities (decorative).
const cities = [
  { lon: 77.2, lat: 28.6, from: 0 },
  { lon: 72.9, lat: 19.1, from: 0 },
  { lon: 88.4, lat: 22.6, from: 0 },
  { lon: 80.3, lat: 13.1, from: 1 },
  { lon: 78.5, lat: 17.4, from: 1 },
  { lon: 75.8, lat: 26.9, from: 1 },
];

export function DtaMapHero() {
  return (
    <MapHero
      headline="Websites, GST filing and business licences, handled by one team."
      description="DTA builds your website or CRM, files your GST and income tax returns, and gets your trade licence and FSSAI registration. We work from our offices in Tezpur and Bangalore."
      primaryCta={{ label: "Book a free consultation", href: "#contact" }}
      secondaryCta={{ label: "Chat on WhatsApp", href: wa("Hi DTA! I'd like to talk about my business.") }}
      footnote="500+ businesses served. We reply within 24 hours, Monday to Saturday."
      pins={pins}
      stages={stages}
      cities={cities}
      finale="Two offices. One team. 500+ businesses."
      scrollHint="Scroll to see our offices"
      colors={{ accent: "#0B5FCC" }}
    />
  );
}
