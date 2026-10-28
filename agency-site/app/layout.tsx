import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--f-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--f-sora" });

export const metadata: Metadata = {
  title: "DTA — Digital · Trading · Accounts",
  description:
    "Custom CRM + ERP, websites, mobile apps, digital marketing, GST filing, company registration and more. Offices in Tezpur, Assam and Bangalore, Karnataka.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sora.variable} antialiased`}>{children}</body>
    </html>
  );
}
