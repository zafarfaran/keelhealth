import { CTA_HREF, CTA_LABEL, faqs, plans } from "@/content/site";
import { Draw } from "@/components/ui/Draw";
import { Wordmark } from "@/components/ui/Wordmark";
import { HitSection } from "@/components/ui/HitSection";

export function Pricing() {
  const [annual, weekly, monthly] = plans;
  return (
    <section className="pricing f-ivory c" id="pricing" data-tone="light">
      <div className="wrap">
        <h2 className="slam">
          <span>Built for the body</span>
          <span>
            you have <span className="em inline">now.</span>
          </span>
        </h2>
        <p className="sub">7-day free trial on every plan. Cancel anytime before it ends and you pay nothing.</p>
        <div className="plans" role="radiogroup" aria-label="Choose a plan">
          {[annual, weekly].map((p) => (
            <label className="plan" id={p.id === "annual" ? "plan-annual" : undefined} key={p.id}>
              <input type="radio" name="plan" value={p.id} defaultChecked={p.id === "annual"} />
              {p.badge && <span className="badge">{p.badge}</span>}
              <div className="name">{p.name}</div>
              <div className="per">
                {p.perWeek}
                <small> /week</small>
              </div>
              <div className="bill">{p.billing}</div>
            </label>
          ))}
        </div>
        <div className="plans-more">
          <label>
            <input type="radio" name="plan" value={monthly.id} /> {monthly.name} · {monthly.billing}
          </label>
          <span>All plans include every feature.</span>
        </div>
        <div className="go">
          <a className="btn" href={CTA_HREF}>
            {CTA_LABEL}
          </a>
          <p className="mono">After the trial, your plan renews at the price shown until you cancel.</p>
        </div>
        <div className="lifetime">
          <span>
            <b>Lifetime access</b> · £199 once. Launch offer, limited.
          </span>
          <a href={CTA_HREF}>Buy lifetime</a>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="faq f-almond" id="faq" data-tone="light">
      <div className="wrap">
        <h2 className="slam">
          <span>Fair</span>
          <span className="em">questions.</span>
        </h2>
        <div>
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function End() {
  return (
    <HitSection hit="#end" className="end f-ink c" id="end" data-tone="dark">
      <div className="inner">
        <Draw name="carry" className="carry" label="Line drawing of a woman walking with two full shopping bags, smiling" />
        <div>
          <Wordmark id="wm-end" className="stack" />
          <p>Strong for life.</p>
          <a className="btn light" href={CTA_HREF}>
            {CTA_LABEL}
          </a>
        </div>
        <span className="spacer" />
      </div>
    </HitSection>
  );
}

export function Footer() {
  return (
    <footer id="footer">
      <div className="wrap">
        <span className="legal">
          Second Strong · secondstrong.com
          <br />
          Second Strong gives general guidance on food and exercise. It isn&apos;t medical advice. Talk to your GP about symptoms
          that worry you.
        </span>
        <span>
          <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="mailto:hello@secondstrong.com">Contact</a>
        </span>
      </div>
    </footer>
  );
}
