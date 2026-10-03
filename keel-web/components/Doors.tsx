import DoorSorterViz from './viz/DoorSorterViz';

type Door = {
  title: string;
  copy: string;
  img: string;
  alt: string;
  core?: boolean;
};

const DOORS: Door[] = [
  {
    title: 'Wall Pilates',
    copy: 'Core, hips and glutes with a wall for support. No equipment.',
    img: '/img/ic-wall.png',
    alt: 'A clay icon of a wall panel with a rolled exercise mat',
  },
  {
    title: 'Chair strength',
    copy: 'Balance, posture and mobility from a chair. Kind to knees.',
    img: '/img/ic-chair.png',
    alt: 'A clay icon of a dining chair with a resistance band',
  },
  {
    title: 'Somatic mobility',
    copy: 'Slow movement and breathing for stiffness, stress and sleep.',
    img: '/img/ic-somatic.png',
    alt: 'A clay icon of an unrolled exercise mat and bolster',
  },
  {
    title: 'Strength training',
    copy: 'Build muscle and keep it. Two to four short sessions a week.',
    img: '/img/ic-squat.png',
    alt: 'A clay icon of a kettlebell',
    core: true,
  },
  {
    title: 'Protein for women',
    copy: 'Why eating “healthily” isn’t enough, and what to do instead.',
    img: '/img/ic-plate.png',
    alt: 'A clay icon of a plate of chicken, sweet potato and green beans',
  },
  {
    title: 'Lose fat, keep muscle',
    copy: 'Why restriction alone stops working, and the version that doesn’t.',
    img: '/img/ic-grip.png',
    alt: 'A clay icon of two dumbbells',
  },
  {
    title: 'Meal timing',
    copy: 'Protein across the day, what to eat around training, evenings and sleep.',
    img: '/img/ic-kitchen.png',
    alt: 'A clay icon of a plate of salmon beside a clock',
  },
];

export default function Doors() {
  return (
    <section className="doors" id="doors">
      <div className="wrap">
        <div className="sec-head sec-head-mid">
          <p className="eyebrow">Programmes</p>
          <h2 className="h2">
            One plan. Seven ways in
          </h2>
          <DoorSorterViz />
        </div>
        <ul className="door-grid">
          {DOORS.map((d) => (
            <li className={d.core ? 'door door-core' : 'door'} key={d.title}>
              <a href="#pricing">
                <figure className="door-icon mask-reveal">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.img} alt={d.alt} loading="lazy" width={560} height={560} />
                </figure>
                <h3 className="card-title">{d.title}</h3>
                <p>{d.copy}</p>
              </a>
            </li>
          ))}
          <li className="door door-cta">
            <a href="#pricing">
              <span className="door-cta-inner">
                <span className="h3">Not sure which?</span>
                <span>The four-minute quiz picks for you.</span>
                <span className="btn btn-primary btn-sm">Take the quiz</span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
