import { gpSummary, habits, howSteps, tiles, weeklyReport } from "@/content/site";
import { Draw } from "@/components/ui/Draw";
import { HitSection } from "@/components/ui/HitSection";

export function HowItWorks() {
  return (
    <section className="how f-ivory c" id="how" data-tone="light">
      <div className="wrap">
        <h2 className="slam">
          <span>How it</span>
          <span className="em">works.</span>
        </h2>
        <div className="steps3">
          {howSteps.map((s, i) => (
            <div className="hstep" key={s.title}>
              <div className="num" id={`n${i + 1}`}>
                {i + 1}
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MoreInside() {
  return (
    <section className="more f-terra" id="more" data-tone="dark">
      <div className="wrap">
        <div>
          <h2 className="slam">
            <span>Everything</span>
            <span className="em">else inside.</span>
          </h2>
          <p className="lede">The camera and the coach do most of the work. These fill in the rest.</p>
        </div>
        <div className="tiles" id="tiles">
          {tiles.map((t) => (
            <div className="tile" key={t.title}>
              <b>{t.title}</b>
              <span>{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StrongForLife() {
  const done = habits.filter((h) => h.done).length;
  return (
    <HitSection hit="#strong" className="strong f-honey" id="strong" data-tone="light">
      <div className="wrap">
        <Draw name="sitstand" label="Line drawing of a woman standing up from a chair without using her hands" />
        <div>
          <h2 className="slam">
            <span>Strong for the</span>
            <span className="em">next 30 years.</span>
          </h2>
          <p className="lede">
            Second Strong measures what matters for getting older well, and only ever compares you with yourself.
          </p>
          <div className="habits" id="habits">
            {habits.map((h) => (
              <span className={`habit${h.done ? " done" : ""}`} key={h.name}>
                <i />
                {h.name}
              </span>
            ))}
          </div>
          <p className="habits-note">
            {done} / {habits.length} healthy-ageing habits today
          </p>
          <div className="markers">
            <div>
              <b>Grip strength</b>Logged every eight weeks.
            </div>
            <div>
              <b>Sit-to-stand</b>A 30-second chair test, every eight weeks.
            </div>
          </div>
        </div>
      </div>
    </HitSection>
  );
}

export function Reports() {
  return (
    <section className="reports f-plum" id="reports" data-tone="dark">
      <div className="wrap">
        <div>
          <h2 className="slam">
            <span>A report on Sunday.</span>
            <span className="em">Notes for your GP.</span>
          </h2>
          <p className="lede">
            Every week you get a short read on what went well. Before an appointment, export a one-page summary of
            symptoms, HRT and trends, so you don&apos;t walk in with nothing written down.
          </p>
        </div>
        <div className="sheets">
          <div className="sheet" id="sheet1">
            <span className="mono">Weekly report</span>
            <b>Your week</b>
            <div className="bars" aria-hidden="true">
              {weeklyReport.bars.map((h, i) => (
                <i key={i} style={{ height: `${h}%` }} />
              ))}
            </div>
            <ul>
              {weeklyReport.rows.map(([k, v]) => (
                <li key={k}>
                  {k} <em>{v}</em>
                </li>
              ))}
            </ul>
          </div>
          <div className="sheet" id="sheet2">
            <span className="mono">GP summary · PDF</span>
            <b>For your appointment</b>
            <ul>
              {gpSummary.map(([k, v]) => (
                <li key={k}>
                  {k} <em>{v}</em>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
