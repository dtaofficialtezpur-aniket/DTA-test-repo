import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--f-inter" });
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-display" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--f-serif" });

export const metadata: Metadata = {
  title: "DTA — Digital · Trading · Accounts",
  description:
    "Custom CRM + ERP, websites, mobile apps, digital marketing, GST filing, company registration and more. Offices in Tezpur, Assam and Bangalore, Karnataka.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${display.variable} ${serif.variable} antialiased`}>{children}</body>
    </html>
  );
}
