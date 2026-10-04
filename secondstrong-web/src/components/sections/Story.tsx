import { symptoms } from "@/content/site";
import { Draw } from "@/components/ui/Draw";
import { Emoji } from "@/components/ui/Emoji";
import { Wordmark } from "@/components/ui/Wordmark";
import { CountUp } from "@/components/ui/CountUp";
import { HitSection } from "@/components/ui/HitSection";

export function Apps() {
  return (
    <section className="apps f-terra" id="apps" data-tone="dark">
      <div className="wrap">
        <div id="f-phone">
          <Draw name="phone" label="Line drawing of a hand holding a phone showing a young woman mid-jump" />
        </div>
        <div>
          <h2 className="slam">
            <span>Most apps were</span>
            <span>built for</span>
            <span className="em">25-year-olds.</span>
          </h2>
          <p className="lede">
            Calorie cuts and high-intensity plans assume a body with steady hormones. After 40 the rules move: you need
            more protein, heavier weights and better recovery, not less food.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Protein() {
  return (
    <section className="protein f-honey c" id="protein" data-tone="light">
      <div className="wrap">
        <div className="num-wrap" id="ring62">
          <CountUp trigger="#ring62" from={0} to={62} id="n62" className="num" />
        </div>
        <h2 className="slam">
          <span>of protein on a typical day.</span>
        </h2>
        <p className="lede">
          Most women over 40 eat well under what their muscles need to hold on. Second Strong works out your number and helps you
          reach it with food you already eat.
        </p>
        <div className="row">
          <Draw name="typical" label="Line drawing of a light lunch: half a sandwich, an apple and a cup of tea" />
          <Emoji name="wow" />
        </div>
        <p className="mono">Illustrative figure. Your target comes from your weight and activity.</p>
      </div>
    </section>
  );
}

export function Symptoms() {
  return (
    <section className="symptoms f-plum" id="symptoms" data-tone="dark">
      <div className="wrap">
        <h2 className="slam">
          <span>Your plan reads</span>
          <span className="em">how you feel.</span>
        </h2>
        <div className="cards">
          {symptoms.map((s) => (
            <div className="card" id={s.id} key={s.id}>
              <Draw name={s.draw} label={s.label} />
              <div>
                <h3>
                  {s.title} <Emoji name={s.emoji} />
                </h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Brand() {
  return (
    <HitSection hit="#brand" className="brand f-ink c" id="brand" data-tone="dark">
      <div>
        <Wordmark id="wm-mid" className="stack" />
        <p>Strength &amp; nutrition after 40</p>
      </div>
    </HitSection>
  );
}
