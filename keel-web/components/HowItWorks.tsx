import Em from './Em';
import PlanBloomViz from './viz/PlanBloomViz';

export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="wrap">
        <div className="how-head">
          <p className="eyebrow">How it works</p>
          <h2 className="h2">
            Four minutes to a plan that&apos;s <Em>actually yours</Em>
          </h2>
          <p className="lede">
            Around 29 questions, one per screen. What grows out of them is yours.
          </p>
        </div>

        <PlanBloomViz />
      </div>
    </section>
  );
}
