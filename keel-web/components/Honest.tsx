import Em from './Em';
import FlowerBloom from './viz/FlowerBloom';

const OUT = [
  ['Before and after photos in our adverts', 'They stay private to you, in your app. We will never run yours as marketing.'],
  ['Countdown timers', 'The price is the price. The offer is not about to expire.'],
  ['Red', 'A missed target is a number, not an alarm.'],
  ['Comparing you to other women', 'Your progress is measured against your own first week.'],
];

const KEEP = [
  [
    'Your call on the harder features',
    'Fasting windows and progress photos are there if you want them, off unless you turn them on, and never suggested by the coach.',
  ],
  [
    'Calorie-free mode',
    'Hide the calorie number completely and run the app on protein and habits. Offered at sign-up, not buried in settings.',
  ],
  [
    'A floor, always',
    'Set a goal weight if you want one. The plan still cannot generate an unsafe target, and it will not accept a goal below a safe minimum.',
  ],
];

export default function Honest() {
  return (
    <section className="honest" id="honest">
      <FlowerBloom tone="ink" className="fb-honest" />
      <div className="wrap">
        <div className="honest-grid">
          <div className="honest-head">
            <p className="eyebrow eyebrow-on-ink">What we won&apos;t do</p>
            <h2 className="h2">
              You&apos;ve been sold enough <Em>nonsense</Em>
            </h2>
            <p className="lede">
              Most women have a long history with the diet industry. Keel was built with
              that in mind.
            </p>
          </div>
          <ul className="honest-list">
            {OUT.map(([title, copy]) => (
              <li key={title}>
                <b>
                  <s>{title}</s>
                </b>{' '}
                {copy}
              </li>
            ))}
            {KEEP.map(([title, copy]) => (
              <li className="keep" key={title}>
                <b>{title}</b> {copy}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
