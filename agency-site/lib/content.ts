// Content sourced from https://dtaonline.in
const WA = "917002060043";
export const wa = (text: string) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

export const brand = {
  name: "DTA",
  full: "Digital · Trading · Accounts",
  headline: ["One team for", "Digital,", "Trading", "& Accounts."],
  sub: "Custom CRM + ERP, websites and mobile apps — plus marketing, compliance and accounting — under one roof, with one team accountable for the result.",
  phone: "+91 70020 60043",
  phoneHref: "tel:+917002060043",
  email: "dtaofficialtezpur@gmail.com",
  hours: "Mon–Sat, 9 AM to 6 PM",
  offices: [
    { city: "Tezpur", lines: ["1st Floor, Charu Complex, SC Road,", "Near Head Post Office,", "Tezpur, Assam — 784001"] },
    { city: "Bangalore", lines: ["SRI, 21/1 (511/A), 1st Cross,", "Gokula 1st Stage, 1st Phase,", "Bangalore, Karnataka — 560054"] },
  ],
  social: [
    { label: "Instagram", href: "https://www.instagram.com/dtaofficialtezpur/" },
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61592551303029" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/dta-digital-trading-accounts-b49150425/" },
  ],
};

export const nav = [
  { label: "Departments", href: "#departments" },
  { label: "Software", href: "#software" },
  { label: "Offers", href: "#offers" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const marquee = [
  "Custom CRM", "Custom ERP", "Websites", "Mobile Apps", "Google Ads", "Meta Ads", "SEO",
  "GST Filing", "ITR", "Trade License", "FSSAI", "Company Registration",
];

export const departments = [
  {
    n: "01",
    name: "Digital growth",
    body: "Google & Meta Ads, websites, apps, SEO and Google Business Profile — everything to be found and chosen online.",
    items: ["Google Ads", "Meta Ads", "Website Development", "SEO", "Google Business Profile", "Software & ERP + CRM"],
    hue: 210,
  },
  {
    n: "02",
    name: "Trade & compliance",
    body: "Trade License, Digital Signature, FSSAI and GeM onboarding handled by certified experts — fast and stress-free.",
    items: ["Trade License", "Digital Signature (DSC)", "FSSAI License", "GeM Registration"],
    hue: 190,
  },
  {
    n: "03",
    name: "Complete accounting",
    body: "TDS, GST, income tax returns, audits and company registration — precise, on time and fully compliant.",
    items: ["TDS Filing", "GST Registration & Filing", "ITR Filing", "Statutory & Tax Audit", "Company Registration"],
    hue: 225,
  },
];

export const software = {
  title: "No templates. Custom from day one.",
  body: "One unified platform for customers, sales and operations — with a mobile app included and ongoing support.",
  features: [
    { t: "CRM & lead tracking", d: "Capture, follow up and convert — every lead in one place." },
    { t: "Inventory & sales", d: "Stock, orders and billing flowing through one connected system." },
    { t: "Dashboards & reports", d: "See your numbers live — built around the metrics you care about." },
    { t: "Automation tools", d: "Remove repetitive work with workflows built for your process." },
    { t: "Mobile app included", d: "Your team and customers on Android & iOS, not just desktop." },
    { t: "Hosting & ongoing support", d: "Cloud hosting, maintenance and a team that stays with you." },
  ],
};

export const offers = [
  { tag: "Accounts · Lifetime offer", title: "1st Month GST Filing", body: "Let our expert CA team handle your first month of GST filing at no cost. No hidden charges, no conditions.", msg: "Hi DTA! I want to claim the 1st Month GST Filing FREE offer for new clients." },
  { tag: "Digital · 1st month free", title: "Google Business Profile", body: "Complete GBP setup plus one full month of professional posts when you join our Digital Marketing package.", msg: "Hi DTA! I want to claim the Free Google Business Profile Setup + 1 Month Posting offer for new Digital Marketing clients." },
  { tag: "All departments · 1st month free", title: "First Month Service", body: "Try Digital, Trading, Accounts and Growth Consultation risk-free. Continue only if you're happy.", msg: "Hi DTA! I want to claim the First Month Service FREE offer across Digital, Trading, Accounts & Growth Consultation." },
];

export const why = [
  { t: "One-stop solution", d: "Digital + Trading + Accounts under one team — no vendor juggling." },
  { t: "Expert team", d: "Department-specific certified professionals for every service." },
  { t: "Full transparency", d: "Clear pricing, zero hidden fees, regular progress updates." },
  { t: "Timely delivery", d: "Deadline-driven workflow with on-time results — always." },
];

export const process = [
  { step: "Consultation", body: "We understand your business goals and current digital presence." },
  { step: "Strategy", body: "A custom strategy crafted for your market and audience." },
  { step: "Execution", body: "Our team executes the plan with precision and attention to detail." },
  { step: "Report & optimize", body: "Monthly reports with data-driven optimization for better results." },
];

export const stats = [
  { value: 500, suffix: "+", label: "Clients served" },
  { value: 3, suffix: "", label: "Core departments" },
  { value: 2, suffix: "", label: "Offices — Tezpur & Bangalore" },
  { value: 24, suffix: "h", label: "Reply time" },
];

export const founder = {
  name: "Aniket Paul",
  role: "Founder & CEO",
  story: [
    "Aniket Paul founded DTA with a singular vision — to create a one-stop business support firm that combines digital marketing, trading compliance and financial accounting under one professional roof.",
    "Too many businesses waste time and money managing multiple agencies, freelancers and CA firms separately. DTA eliminates that complexity. One team, one point of contact, complete accountability.",
  ],
  values: [
    { t: "Mission", d: "To simplify business growth by providing integrated Digital, Trading and Accounting services that drive measurable results." },
    { t: "Vision", d: "To become India's most trusted multi-service business support firm — the one call every entrepreneur needs." },
    { t: "Values", d: "Integrity, transparency, expertise and timely delivery." },
  ],
};
