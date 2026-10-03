import ProteinGapViz from './viz/ProteinGapViz';
import FlowerBloom from './viz/FlowerBloom';

export default function Gap() {
  return (
    <section className="gap" id="gap">
      <FlowerBloom className="fb-gap" />
      <div className="wrap gap-inner">
        <p className="eyebrow">The protein gap</p>
        <ProteinGapViz />
        <p className="gap-line">
          You eat about 62g. You need about 110g. Keel closes it, one meal at a time.
        </p>
      </div>
    </section>
  );
}
