import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { privacy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy policy · Second Strong",
  description: "What Second Strong collects when you visit the site or join the waiting list, why, and your rights.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <LegalPage {...privacy} />;
}
