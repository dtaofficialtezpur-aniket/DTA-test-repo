"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ShowHero } from "@/components/ShowHero";

function Inner() {
  const v = useSearchParams().get("v") ?? "a";
  return <ShowHero v={v} />;
}
export default function Page() {
  return <Suspense><Inner /></Suspense>;
}
