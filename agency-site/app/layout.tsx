import type { Metadata } from "next";
import { Geist, Geist_Mono, Lexend, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--f-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--f-mono" });
const lexend = Lexend({ subsets: ["latin"], variable: "--f-lexend" });
const source = Source_Sans_3({ subsets: ["latin"], variable: "--f-source" });

export const metadata: Metadata = {
  title: "DTA — Digital · Trading · Accounts",
  description:
    "Custom CRM + ERP, websites, mobile apps, digital marketing, GST filing, company registration and more. Offices in Tezpur, Assam and Bangalore, Karnataka.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable} ${lexend.variable} ${source.variable} antialiased`}>{children}</body>
    </html>
  );
}
