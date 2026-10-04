import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { terms } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of use · Second Strong",
  description: "The terms for using secondstrong.com and joining the Second Strong waiting list.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <LegalPage {...terms} />;
}
