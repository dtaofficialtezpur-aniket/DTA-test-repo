import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DTA — Digital Marketing & Technology Agency",
  description:
    "A 3D, motion-driven agency website built with Next.js and Motion. Placeholder content — replace with DTA's real copy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain antialiased">{children}</body>
    </html>
  );
}
