import Em from './Em';
import FlowerBloom from './viz/FlowerBloom';

export default function Cta() {
  return (
    <section className="cta">
      <FlowerBloom tone="ink" className="fb-cta" />
      <div className="wrap cta-inner">
        <h2 className="h2">
          Your plan takes four <Em>minutes</Em>
        </h2>
        <p className="lede">
          A short set of questions, your protein target, your starting weights, and a first
          week you can actually do.
        </p>
        <a className="btn btn-on-clay" href="#pricing">
          Take the quiz
        </a>
      </div>
    </section>
  );
}
