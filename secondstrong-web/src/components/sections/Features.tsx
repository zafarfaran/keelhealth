import { Draw } from "@/components/ui/Draw";
import { Emoji } from "@/components/ui/Emoji";
import { CountUp } from "@/components/ui/CountUp";
import { HitSection } from "@/components/ui/HitSection";

export function Plate() {
  const chips = ["Salmon · 28g", "Rice", "Greens"];
  return (
    <HitSection hit="#plate" className="feature f-almond" id="plate" data-tone="light">
      <div className="wrap">
        <div className="frame" id="f-plate">
          <Draw name="plate" label="Line drawing of a plate with salmon, rice and greens" />
        </div>
        <div>
          <h2 className="slam">
            <span>Snap your</span>
            <span className="em">plate.</span>
          </h2>
          <p className="lede">
            Take one photo. Second Strong names what&apos;s on it, counts the protein, and tells you how it fits the rest of your day.
          </p>
          <div className="chips" id="chips">
            {chips.map((c) => (
              <span className="chip" data-pop key={c}>
                {c}
              </span>
            ))}
            <span className="chip ok" data-pop>
              Fits your day
            </span>
          </div>
        </div>
      </div>
    </HitSection>
  );
}

export function Gap() {
  return (
    <HitSection hit="#gap" className="feature gap f-terra flip" id="gap" data-tone="dark">
      <div className="wrap">
        <div className="gap-box">
          <CountUp trigger="#gap" from={62} to={104} id="n104" className="gap-num" />
          <div className="bar-labels mono">
            <span>Today so far</span>
            <span>Your target · 104g</span>
          </div>
          <div className="bar" id="bar">
            <i />
          </div>
        </div>
        <div>
          <h2 className="slam">
            <span>See the gap.</span>
            <span className="em">Close it.</span>
          </h2>
          <p className="lede">
            One bar shows how far you are from today&apos;s protein. Second Strong suggests the next meal or snack that closes it.
          </p>
        </div>
      </div>
    </HitSection>
  );
}

export function Coach() {
  return (
    <section className="feature f-honey" id="coach" data-tone="light">
      <div className="wrap">
        <div className="bubbles">
          <div className="bubble you" id="b1">
            <span className="mono">You</span>Slept badly. Hot flushes again.
          </div>
          <div className="bubble coach" id="b2">
            <span className="mono">Second Strong</span>Lighter session today. Protein at breakfast.
          </div>
        </div>
        <div>
          <h2 className="slam">
            <span>A coach that knows</span>
            <span>
              your <span className="em inline">symptoms.</span>
            </span>
          </h2>
          <p className="lede">
            Tell the AI coach how you slept, how your joints feel, where you are in your cycle. It changes today&apos;s
            plan, not some generic week.
          </p>
          <div className="coach-art">
            <Draw name="sofa" label="Line drawing of a woman on a sofa reading her phone, legs tucked up" />
            <Emoji name="happy" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Lift() {
  return (
    <section className="feature f-plum flip" id="lift" data-tone="dark">
      <div className="wrap">
        <div className="stairs" id="stairs">
          <Draw name="squat" label="Line drawing of a woman doing a goblet squat" />
          <span className="lbl mono" style={{ right: 0, top: -34 }}>
            Week 8 · 14kg
          </span>
          <span className="lbl mono" style={{ right: "62%", bottom: -6 }}>
            Week 1 · 8kg
          </span>
        </div>
        <div>
          <h2 className="slam">
            <span>Lift a little more</span>
            <span className="em">each week.</span>
          </h2>
          <p className="lede">
            Short strength sessions at home or the gym. The weights go up slowly and on purpose, because that&apos;s what
            keeps muscle and bone.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Fridge() {
  return (
    <section className="feature f-almond" id="fridge" data-tone="light">
      <div className="wrap">
        <div className="fridge-art">
          <Draw name="fridge" label="Line drawing of a woman looking into an open fridge" />
          <div className="recipe" id="recipe">
            <b>Chicken, spinach &amp; feta</b>
            <span className="mono">38g protein · 20 min</span>
          </div>
        </div>
        <div>
          <h2 className="slam">
            <span>Photo your fridge.</span>
            <span className="em">Get dinner.</span>
          </h2>
          <p className="lede">
            Show Second Strong what you&apos;ve got. It suggests a high-protein dinner from it, with the steps and the numbers.
          </p>
        </div>
      </div>
    </section>
  );
}
