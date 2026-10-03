import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Coach from '@/components/Coach';
import Manifesto from '@/components/Manifesto';
import Gap from '@/components/Gap';
import Doors from '@/components/Doors';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Strength from '@/components/Strength';
import Meno from '@/components/Meno';
import Honest from '@/components/Honest';
import Pricing from '@/components/Pricing';
import Faq from '@/components/Faq';
import Cta from '@/components/Cta';
import Footer from '@/components/Footer';
import SiteMotion from '@/components/SiteMotion';

export default function Page() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <Coach />
        <Manifesto />
        <Gap />
        <Doors />
        <HowItWorks />
        <Features />
        <Strength />
        <Meno />
        <Honest />
        <Pricing />
        <Faq />
        <Cta />
      </main>

      <Footer />
      <SiteMotion />
    </>
  );
}
