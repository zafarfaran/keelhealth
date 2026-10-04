import { EmojiSprite } from "@/components/ui/Emoji";
import { PageLine } from "@/components/line/PageLine";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Apps, Brand, Protein, Symptoms } from "@/components/sections/Story";
import { Facts } from "@/components/sections/Facts";
import { Coach, Fridge, Gap, Lift, Plate } from "@/components/sections/Features";
import { Day } from "@/components/sections/Day";
import { HowItWorks, MoreInside, Reports, StrongForLife } from "@/components/sections/Info";
import { End, Faq, Footer } from "@/components/sections/Closing";
import { Waitlist } from "@/components/sections/Waitlist";
import { Slams } from "@/lib/motion/slams";

/**
 * The page, top to bottom. Order matters: the page line's route visits these sections
 * in this order (see lib/line/route.ts).
 *
 * This is a server component: most sections render to plain HTML. Only the moving parts
 * (hero, facts, day, the page line, counters, pen-reactive sections, heading slams) hydrate.
 */
export function HomePage() {
  return (
    <div id="page" className="armed">
      <Slams />
      <EmojiSprite />
      <Header />
      <Hero />
      <Apps />
      <Facts />
      <Protein />
      <Symptoms />
      <Brand />
      <Plate />
      <Gap />
      <Coach />
      <Lift />
      <Fridge />
      <Day />
      <HowItWorks />
      <MoreInside />
      <StrongForLife />
      <Reports />
      {/* Pricing is hidden before launch; put <Pricing /> (sections/Closing.tsx) back here and point CTA_HREF at #pricing. */}
      <Waitlist />
      <Faq />
      <End />
      <Footer />
      <PageLine />
    </div>
  );
}
