import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Bundled display fonts (from @fontsource, copied to public/fonts).
loadFont({
  family: "Bricolage",
  url: staticFile("fonts/bricolage-800.woff2"),
  weight: "800",
});
loadFont({
  family: "Bricolage",
  url: staticFile("fonts/bricolage-700.woff2"),
  weight: "700",
});
loadFont({
  family: "Instrument",
  url: staticFile("fonts/instrument-italic.woff2"),
  weight: "400",
  style: "italic",
});
loadFont({
  family: "Instrument",
  url: staticFile("fonts/instrument.woff2"),
  weight: "400",
  style: "normal",
});
