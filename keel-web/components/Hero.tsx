import Em from './Em';
import HeroCards from './HeroCards';
import FlowerBloom from './viz/FlowerBloom';

export default function Hero() {
  return (
    <section className="hero" id="top">
      {/* The colour field the subject stands in. Purely decorative. */}
      <div className="hero-field" aria-hidden="true">
        <svg viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice">
          <path
            className="hero-blob-1"
            d="M760,-40 C1080,-40 1300,120 1380,340 C1460,560 1360,800 1120,800 L640,800 C820,640 760,420 700,300 C640,180 560,-40 760,-40 Z"
          />
          <path
            className="hero-blob-2"
            d="M980,20 C1200,20 1340,180 1380,360 C1420,540 1320,760 1140,760 L900,760 C1020,600 1000,420 960,300 C920,180 860,20 980,20 Z"
          />
        </svg>
      </div>

      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 className="display split-words">
            <Em>Finally.</Em> Strength &amp; nutrition that works for women
          </h1>
          <div className="hero-actions">
            <a className="btn btn-primary btn-lg" href="#pricing">
              Take the 4-minute quiz
            </a>
          </div>
          <p className="hero-sub">
            Photograph your plate and an AI coach estimates the protein, adjusts your
            lifts and answers back.
          </p>
          <p className="fineprint">Four minutes. Then a 7-day free trial of the app.</p>
        </div>

        <div className="hero-stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero-cutout"
            src="/img/hero-cutout.png"
            alt="A woman checking her Keel plan on her phone"
            width={900}
            height={1200}
          />
          <HeroCards />
          <FlowerBloom className="fb-hero" />
        </div>
      </div>

      <div className="wrap">
        <ul className="hero-facts">
          <li>Photo your food, get the macros</li>
          <li>Built around protein and strength</li>
          <li>An AI coach that knows your week</li>
          <li>Cancel in two taps</li>
        </ul>
      </div>
    </section>
  );
}
