import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { MotionProvider } from "@/lib/motion/MotionProvider";
import { bootScript } from "@/lib/motion/boot";
import "@/styles/base.css";
import "@/styles/sections.css";

const bricolage = localFont({
  src: "./fonts/BricolageGrotesque-var.woff2",
  weight: "200 800",
  variable: "--font-bricolage",
  display: "swap",
});

const plex = localFont({
  src: "./fonts/IBMPlexMono-500.woff2",
  weight: "500",
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://secondstrong.com"),
  title: "Second Strong · Strength and nutrition for women 40 to 65",
  description:
    "Second Strong plans your food and strength training around perimenopause and menopause. Snap your plate, see your protein gap, and lift a little more each week. Join the waiting list.",
  openGraph: {
    type: "website",
    siteName: "Second Strong",
    title: "Second Strong · Built for the body you have now",
    description: "Strength and nutrition coaching for women 40 to 65, planned around perimenopause and menopause.",
    images: ["/assets/img/og.png"],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#EDE3D6",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The boot script adds classes to <html> before React hydrates, hence suppressHydrationWarning.
    <html lang="en" className={`${bricolage.variable} ${plex.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
