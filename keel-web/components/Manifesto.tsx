import MuscleCurveViz from './viz/MuscleCurveViz';

export default function Manifesto() {
  return (
    <section className="manifesto" id="why">
      <div className="wrap manifesto-grid">
        <div>
          <p className="eyebrow">Why the old plans don&apos;t work</p>
          <p className="manifesto-text" id="manifesto">
            Muscle goes quietly unless you ask it to stay. Cutting food and adding cardio
            is the opposite of asking.
          </p>
        </div>
        <MuscleCurveViz />
      </div>
    </section>
  );
}
