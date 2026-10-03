import Em from './Em';

const ROWS = [
  {
    label: 'Symptom days per week',
    points: '0,8 33,12 66,10 100,20 133,24 166,30 200,32',
    stroke: '#A9647A',
    value: '7 → 4',
  },
  {
    label: 'Sleep, average hours',
    points: '0,30 33,28 66,30 100,22 133,20 166,16 200,14',
    stroke: '#A9647A',
    value: '6.1 → 6.9',
  },
  {
    label: 'Strength score',
    points: '0,34 33,31 66,27 100,22 133,16 166,10 200,6',
    stroke: '#C2714F',
    value: '300 → 412',
  },
  {
    label: 'Protein, daily average',
    points: '0,32 33,26 66,22 100,18 133,16 166,12 200,10',
    stroke: '#C08E82',
    value: '62g → 104g',
  },
];

function Row({ label, points, stroke, value }: (typeof ROWS)[number]) {
  return (
    <div className="gp-row">
      <span className="stat-label">{label}</span>
      <svg className="gp-spark" viewBox="0 0 200 40" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="gp-val">{value}</span>
    </div>
  );
}

export default function Meno() {
  return (
    <section className="meno" id="meno">
      <div className="wrap split split-rev">
        <div className="split-copy">
          <p className="eyebrow">Symptoms, cycle, medication</p>
          <h2 className="h2">
            Walk into your GP appointment with something <Em>written down</Em>
          </h2>
          <p className="lede">
            A 20-second daily check-in for symptoms, sleep, mood and energy. Then one PDF
            with the lot, ready before your ten minutes with the doctor.
          </p>
        </div>
        <div className="gp">
          <div className="gp-doc">
            <div className="gp-head">
              <span className="mono">Summary for your GP · 12 weeks</span>
            </div>
            <Row {...ROWS[0]} />
            <Row {...ROWS[1]} />
            <div className="gp-row">
              <span className="stat-label">Medication</span>
              <span className="gp-text">
                Logged with type, dose and start date, whatever you take.
              </span>
            </div>
            <Row {...ROWS[2]} />
            <Row {...ROWS[3]} />
            <div className="gp-foot">
              <span className="chip">Export PDF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
