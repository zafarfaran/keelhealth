import Em from './Em';
import OverloadLadderViz from './viz/OverloadLadderViz';

const LIFE = [
  {
    cls: 'stat stat-peach life-card',
    label: 'Grip strength',
    to: '27',
    unit: <span className="unit">kg</span>,
    delta: 'up 3kg since week 1',
  },
  {
    cls: 'stat stat-mint life-card',
    label: 'Sit-to-stand',
    to: '14',
    unit: <span className="of"> in 30s</span>,
    delta: 'up from 11',
  },
  {
    cls: 'stat stat-sky life-card',
    label: 'Balance, one leg',
    to: '22',
    unit: <span className="unit">s</span>,
    delta: 'eyes open, either side',
  },
  {
    cls: 'stat stat-olive life-card',
    label: 'Walking pace',
    to: '5.4',
    dec: '1',
    unit: <span className="of"> km/h</span>,
    delta: 'from your phone, no effort',
  },
];

export default function Strength() {
  return (
    <section className="strength" id="strength">
      <div className="wrap">
        <div className="split">
          <figure className="photo photo-tall mask-reveal">
            <video
              className="strength-video"
              autoPlay
              muted
              loop
              playsInline
              poster="/img/squat.jpg"
              aria-hidden="true"
            >
              <source src="/img/squat.mp4" type="video/mp4" />
            </video>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/squat.jpg"
              alt="A woman doing a goblet squat with a kettlebell"
              loading="lazy"
            />
          </figure>
          <div className="split-copy">
            <h2 className="h2">
              Muscle is the thing worth <Em>keeping</Em>
            </h2>
            <p className="lede">
              Two or three short sessions a week, with the weight creeping up.
            </p>
            <ul className="chips">
              <li>2, 3 or 4 sessions</li>
              <li>Gym, dumbbells or bands</li>
              <li>Swaps for sore knees</li>
            </ul>
            <OverloadLadderViz />
          </div>
        </div>

        <div className="life">
          <div className="life-head">
            <h3 className="h3">Strong for life</h3>
            <p>Tested every eight weeks, against your own first result.</p>
          </div>
          <div className="life-grid">
            {LIFE.map((c) => (
              <div className={c.cls} key={c.label}>
                <span className="stat-label">{c.label}</span>
                <div className="stat-num">
                  <span className="count" data-to={c.to} data-dec={c.dec}>
                    {c.to}
                  </span>
                  {c.unit}
                </div>
                <span className="stat-delta">{c.delta}</span>
              </div>
            ))}
          </div>
          <figure className="photo photo-wide mask-reveal">
            <video autoPlay muted loop playsInline poster="/img/walk.jpg" aria-hidden="true">
              <source src="/img/walk.mp4" type="video/mp4" />
            </video>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/walk.jpg"
              alt="A woman walking briskly along a park path in low evening light"
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
