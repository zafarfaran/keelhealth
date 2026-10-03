import type { CSSProperties } from 'react';
import Em from './Em';

const SCAN_ITEMS = [
  ['Chicken thigh', '38g'],
  ['Sweet potato', '4g'],
  ['Green beans', '2g'],
  ['Greek yoghurt', '9g'],
];

const LIFTS = [
  { h: '40%', kg: '8kg', wk: 'Wk 1' },
  { h: '50%', kg: '10kg', wk: 'Wk 3' },
  { h: '60%', kg: '12kg', wk: 'Wk 6' },
  { h: '75%', kg: '15kg', wk: 'Wk 9' },
  { h: '90%', kg: '18kg', wk: 'Wk 12' },
];

const ALSO = [
  'Meal planner and shopping list by aisle',
  'Family meal mode: one dinner, your portion sized for you',
  'Restaurant menu scanner',
  'Voice logging',
  'Calcium, vitamin D, iron, magnesium, B12, omega-3',
  'Apple Health, Garmin, Fitbit, Oura, Whoop, smart scales',
];

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="h2">
            Four things, done <Em>properly</Em>
          </h2>
          <p className="lede">
            Log food in seconds. Lift with a plan that gets heavier as you do. Ask a coach
            that knows your week. Get a report every Sunday.
          </p>
        </div>

        <div className="feat-grid">
          <article className="feat feat-scan" data-demo="scan">
            <div className="feat-visual">
              <figure className="scan-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/plate.jpg"
                  alt="Grilled chicken, sweet potato and green beans on a ceramic plate"
                  loading="lazy"
                />
                <span className="scan-line" aria-hidden="true"></span>
              </figure>
              <ul className="scan-chips" aria-label="Detected items">
                {SCAN_ITEMS.map(([name, grams]) => (
                  <li className="chip-item" key={name}>
                    {name} <b>{grams}</b>
                  </li>
                ))}
              </ul>
              <p className="verdict">
                <i className="tick" aria-hidden="true"></i>Fits your day. 53g protein, 124g
                so far.
              </p>
            </div>
            <div className="feat-copy">
              <h3 className="h3">Point your phone at the plate</h3>
              <p>
                Keel finds each item, sizes the portion and tells you how it fits your day.
                Same meal as last week? One tap to re-log it. Barcode, voice and text work
                too.
              </p>
            </div>
          </article>

          <article className="feat feat-coach" data-demo="coach">
            <div className="feat-visual">
              <div className="chat">
                <p className="bubble user">Slept badly. Should I still train today?</p>
                <p className="bubble coach">
                  Yes, but lighter. Do today&apos;s lower-body session at 2 sets instead of
                  3 and keep the weights where they were on Thursday.
                </p>
                <p className="bubble user">And protein?</p>
                <p className="bubble coach">
                  You&apos;re at 31g. Eggs on toast now puts you at 50g by lunch, which is
                  on track.
                </p>
              </div>
            </div>
            <div className="feat-copy">
              <h3 className="h3">A coach that knows your week</h3>
              <p>
                It sees your food, your lifts, your sleep and your symptoms. Ask it
                anything at the moment you need an answer. It never diagnoses, and it sends
                you to your GP for anything clinical.
              </p>
            </div>
          </article>

          <article className="feat feat-lift" data-demo="lift">
            <div className="feat-visual">
              <div className="lift">
                <div className="lift-bars" aria-hidden="true">
                  {LIFTS.map((l) => (
                    <div className="lift-col" key={l.wk}>
                      <span
                        className="lift-bar"
                        style={{ '--h': l.h } as CSSProperties}
                      ></span>
                      <span className="lift-kg">{l.kg}</span>
                      <span className="lift-wk">{l.wk}</span>
                    </div>
                  ))}
                </div>
                <p className="lift-cue">
                  Goblet squat · “Choose a weight you can lift comfortably 10 times.”
                </p>
              </div>
            </div>
            <div className="feat-copy">
              <h3 className="h3">Weights that rise with you</h3>
              <p>
                Each session suggests the load and reps based on what you did last time.
                Plain English, no jargon. Gym, dumbbells at home, or bands only.
              </p>
            </div>
          </article>

          <article className="feat feat-report" data-demo="report">
            <div className="feat-visual">
              <div className="report">
                <div className="report-head">
                  <span className="mono">Sunday report · Week 6</span>
                </div>
                <div className="report-grid">
                  <div className="report-stat">
                    <span className="stat-label">Protein consistency</span>
                    <span className="stat-num sm">
                      <span className="count" data-to="86">
                        86
                      </span>
                      %
                    </span>
                    <span className="bar">
                      <span className="bar-fill fill-rose" style={{ width: '86%' }}></span>
                    </span>
                  </div>
                  <div className="report-stat">
                    <span className="stat-label">Strength score</span>
                    <span className="stat-num sm">
                      <span className="count" data-to="412">
                        412
                      </span>
                    </span>
                    <span className="stat-delta">up 18 from last week</span>
                  </div>
                  <div className="report-stat">
                    <span className="stat-label">Sessions</span>
                    <span className="stat-num sm">
                      3<span className="of"> of 3</span>
                    </span>
                    <span className="dots">
                      <i className="on"></i>
                      <i className="on"></i>
                      <i className="on"></i>
                    </span>
                  </div>
                  <div className="report-stat">
                    <span className="stat-label">Sleep</span>
                    <span className="stat-num sm">
                      6.9<span className="of">h</span>
                    </span>
                    <span className="stat-delta">worse on night-sweat days</span>
                  </div>
                </div>
                <p className="report-note">
                  Your best week for protein so far. Thursday&apos;s squat was your
                  heaviest yet.
                </p>
              </div>
            </div>
            <div className="feat-copy">
              <h3 className="h3">A report every Sunday</h3>
              <p>
                What went well, what slipped, and the one thing to change next week.
                Written from your data, not a template.
              </p>
            </div>
          </article>
        </div>

        <ul className="also">
          {ALSO.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
