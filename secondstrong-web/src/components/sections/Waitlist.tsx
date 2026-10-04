"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Draw } from "@/components/ui/Draw";
import { isValidEmail, joinWaitlist, type Stage } from "@/lib/waitlist";
import { useStill } from "@/lib/motion/MotionProvider";

type Phase = "idle" | "sending" | "sent" | "done";

const STAGES: { id: Stage; label: string }[] = [
  { id: "peri", label: "Perimenopause" },
  { id: "meno", label: "Menopause" },
  { id: "post", label: "After menopause" },
  { id: "unsure", label: "Not sure" },
];

/**
 * The waiting list. The page line frames the card (#wl-form). Focusing the email draws a pen
 * underline; sending turns the button into a pen circling; success draws a tick, then the card
 * eases to the confirmation, which sketches in.
 */
export function Waitlist() {
  const still = useStill();
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<Stage | undefined>();
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [shared, setShared] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const emailId = useId();

  // Move focus to the confirmation so keyboard and screen-reader users hear it.
  useEffect(() => {
    if (phase === "done") title.current?.focus({ preventScroll: true });
  }, [phase]);
  const errorId = useId();

  const nudge = () => {
    if (still) return;
    field.current?.animate(
      [{ transform: "none" }, { transform: "translateX(-7px)" }, { transform: "translateX(5px)" }, { transform: "translateX(-3px)" }, { transform: "none" }],
      { duration: 380, easing: "cubic-bezier(.36,.07,.19,.97)" },
    );
  };

  // Ease the card's height between the form and the confirmation, so the page doesn't jump.
  const swapTo = (next: Phase) => {
    const el = card.current;
    if (!el || still) return setPhase(next);
    const from = el.offsetHeight;
    setPhase(next);
    requestAnimationFrame(() => {
      const to = el.offsetHeight;
      el.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: 520, easing: "cubic-bezier(.16,1,.3,1)" });
    });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (phase !== "idle") return;
    if (!isValidEmail(email)) {
      setError("That email doesn't look right. Check it and try again.");
      nudge();
      return;
    }
    setError("");
    // Pin the button's current width, then shrink it to a circle (CSS can't animate from width: auto).
    const b = button.current;
    if (b && !still) {
      b.style.width = `${b.offsetWidth}px`;
      void b.offsetWidth;
      b.style.width = "60px";
    }
    setPhase("sending");
    try {
      await joinWaitlist({ email, stage });
      setPhase("sent");
      window.setTimeout(() => swapTo("done"), still ? 0 : 900);
    } catch {
      if (button.current) button.current.style.width = "";
      setPhase("idle");
      setError("We couldn't add you just now. Please try again in a moment.");
      nudge();
    }
  };

  const share = async () => {
    const data = { title: "Second Strong", text: "Strength and nutrition coaching for women 40 to 65.", url: location.origin };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        setShared(true);
      }
    } catch {
      /* the share sheet was closed */
    }
  };

  return (
    <section className="waitlist f-ivory c" id="waitlist" data-tone="light">
      <div className="wrap">
        <h2 className="slam">
          <span>Built for the body</span>
          <span>
            you have <span className="em inline">now.</span>
          </span>
        </h2>
        <p className="sub">
          Second Strong is launching soon on iPhone and Android. Join the waiting list and we&apos;ll email you the day it opens.
        </p>

        <div className={`wl-card phase-${phase}`} id="wl-form" ref={card}>
          {phase !== "done" ? (
            <form onSubmit={submit} noValidate>
              <fieldset className="wl-stage">
                <legend>
                  Where are you right now? <span>Optional</span>
                </legend>
                <div className="wl-chips">
                  {STAGES.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      className={`wl-chip${stage === s.id ? " on" : ""}`}
                      aria-pressed={stage === s.id}
                      onClick={() => setStage(stage === s.id ? undefined : s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="wl-row">
                <div className={`wl-field${error ? " bad" : ""}`} ref={field}>
                  <label htmlFor={emailId}>Your email</label>
                  <input
                    id={emailId}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    disabled={phase !== "idle"}
                  />
                  <svg className="wl-underline" viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M 2 7 C 80 3 150 10 230 6 S 360 4 398 7" />
                  </svg>
                </div>
                <button className={`btn wl-go phase-${phase}`} ref={button} type="submit" aria-live="polite">
                  <span className="wl-label">{phase === "idle" ? "Join the waiting list" : phase === "sending" ? "Adding you" : "Added"}</span>
                  <svg className="wl-pen" viewBox="0 0 40 40" aria-hidden="true">
                    <circle className="wl-ring" cx="20" cy="20" r="15" pathLength={1} />
                    <path className="wl-tick" d="M 12.5 20.5 L 18 26 L 28 14.5" pathLength={1} />
                  </svg>
                </button>
              </div>
              <p className="wl-error" id={errorId} role="alert">
                {error && <span key={error}>{error}</span>}
              </p>
              <p className="wl-fine">We&apos;ll only email you about Second Strong&apos;s launch. Unsubscribe anytime.</p>
            </form>
          ) : (
            <div className="wl-done">
              <Draw name="waitlist" className="wl-art" label="Line drawing of a woman by a window with a mug of tea, smiling at good news on her phone" />
              <div>
                <h3 className="wl-title" ref={title} tabIndex={-1}>
                  <span>You&apos;re on</span>
                  <span className="em">the list.</span>
                </h3>
                <p>
                  We&apos;ll email <b>{email.trim()}</b> the day Second Strong opens. Nothing before then.
                </p>
                <button type="button" className="btn ghost wl-share" onClick={share}>
                  {shared ? "Link copied" : "Share Second Strong with a friend"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
