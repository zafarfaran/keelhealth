# Keel Health — Pricing & Feature Specification

**Company / domain:** Keel Health — keelhealth.com, keelhealth.co.uk
**App Store / product name:** Keel
**Positioning:** *Your strength and nutrition coach.*
**Brand rule:** Lead with **Keel** everywhere the user sees the product — app icon, App Store title, in-app, ad creative. "Health" stays in the legal entity, the domain and the footer. Do not let "Health" become the load-bearing part of the brand; it pulls perception toward medical and away from strength, which cuts against the positioning.
**Sub-line:** Eat enough protein. Build muscle. Feel stronger. Stay healthy for the years ahead.
**Target user:** Women, at any stage of life. Built for anyone who wants to get stronger and eat better, including women through perimenopause and after it.
**Version:** 1.0 — reference spec for development
**Status of name:** Domain checked by DNS only (no resolution on keelhealth.com or keelhealth.co.uk). **Not yet verified at a registrar and not trademark-cleared.** Register the domains before any further brand spend, and do not commission logo or brand assets until the trademark search is back.

---

## 1. Pricing

### 1.1 Plans

| Plan | UK | US | Effective monthly | Billing cycle | Free trial |
|---|---|---|---|---|---|
| Free | £0 | $0 | — | — | n/a |
| Pro — Weekly | £4.99 | $5.99 | £21.62 | Every 7 days | **7 days** |
| Pro — Monthly | £14.99 | $17.99 | £14.99 | Every month | **7 days** |
| **Pro — Annual** | **£79.99** | **$89.99** | **£6.67** | Every 12 months | **7 days** |
| Pro — Lifetime | £199 | $229 | — | One-off | Not possible — see §1.4 |

All Pro plans unlock an identical feature set. There is no feature difference between billing periods. Lifetime is a launch-only offer, capped in volume (recommend 300–500 units), then retired.

**The trial unlocks the complete Pro feature set.** No feature is withheld or degraded during the trial period. A restricted trial fails to demonstrate the AI coach and the weekly report, which are the two features the subscription is actually being bought for.

One trial per user account, ever. Not one per plan — a user who trials weekly and cancels cannot then trial annual. Both stores enforce this at the subscription-group level provided all three plans sit in the same subscription group, which they must.

### 1.2 Store product IDs

| Plan | Suggested product ID |
|---|---|
| Pro — Weekly | `keel_pro_weekly_v1` |
| Pro — Monthly | `keel_pro_monthly_v1` |
| Pro — Annual | `keel_pro_annual_v1` |
| Pro — Lifetime | `keel_pro_lifetime_v1` |
| Win-back annual (50% off) | `keel_pro_annual_winback_v1` |

Version-suffix all IDs. Prices on a live product ID cannot be changed retroactively without affecting existing subscribers, so price changes ship as `_v2`.

### 1.3 Paywall presentation rules

- **Annual is pre-selected** on load.
- Show weekly and annual as the two headline options; monthly sits below them; lifetime appears as a secondary link or as a one-time post-conversion offer.
- Display a per-week comparison on every option: annual shown as *£1.54/week, billed annually* directly against weekly's *£4.99/week*.
- Show a "Save 69%" badge on annual (relative to weekly).
- **Cold paid traffic:** show annual only. Weekly and monthly are in-app options and organic-traffic options.
- A single "7-day free trial" headline is accurate for all three subscription plans and should be used consistently across paywall, ads and store listing.
- Lifetime must not appear alongside trial messaging, since it carries none. Keep it visually separated from the trial headline so no user can reasonably read the trial as applying to it.
- Do not use countdown timers or fake scarcity. This demographic is unusually sensitive to it and it is a common App Store rejection trigger.

### 1.4 Free trial mechanics

**Store constraints:**

- Free trials are a subscription-only mechanism on both App Store and Google Play. **Lifetime cannot carry a trial** because it is a non-consumable one-off purchase, not a subscription. Do not restructure lifetime as a subscription to work around this — it complicates entitlement logic for no meaningful gain. Sell lifetime without a trial, or only as a post-trial upsell.
- All three subscription plans must sit in a **single subscription group**. This is what enforces one-trial-per-user and enables plan switching without double-billing.
- Trial eligibility is determined by the store, not by your backend. Query it before rendering the paywall and adjust copy accordingly — showing "Start 7-day free trial" to an ineligible returning user is a guaranteed support ticket.

**Trial lengths:**

**7 days on every subscription plan.** One consistent number across weekly, monthly and annual.

The benefit is clarity: a single "7-day free trial" line can run on the paywall, in ad creative and in the App Store description without qualification, and there is no per-plan copy variant to maintain or get wrong.

**The known cost, and what to watch.** A 7-day trial on a 7-day billing cycle means a weekly subscriber consumes an entire paid period free before the first charge. Effectively, weekly is now a two-week commitment for one week's revenue, and it is the plan most exposed to trial farming.

Do not fix this by shortening the trial unless the data forces it. Instead:

- Track **weekly trial-start → cancel-before-charge rate** as a named metric from launch. If it runs materially above the monthly plan's equivalent rate, farming is happening.
- If that rate exceeds roughly 60–70%, the options in order of preference are: (1) remove weekly from paid-acquisition funnels and keep it for organic only, (2) raise the weekly price, (3) shorten the weekly trial to 3 days. Shortening is last because it reintroduces the inconsistency you are deliberately paying for.
- Revisit at 60 days post-launch with real numbers rather than deciding now.

**Abuse prevention:**

- Trial farming risk is highest on weekly, since a full trial covers a full billing period. Monitor trial-start-to-cancel rate per plan.
- Require account creation (email or social sign-in) before trial start so trial state persists across reinstalls.
- Do not allow trial start without a payment method on file — this is store default behaviour, do not attempt to bypass it.

**Trial-period comms:**

- Immediate confirmation on start, stating the exact date and amount of the first charge.
- Reminder at 48 hours and 24 hours before conversion (see §1.5).
- Trial users should hit the AI coach and log at least one meal within the first 24 hours. Onboard toward those two actions specifically — they are the strongest predictors of conversion.

### 1.5 Billing compliance requirements — mandatory

These are not optional polish. Weekly subscriptions have the highest refund and chargeback rate of any billing period, and the failure mode is users not registering that £4.99 recurs 52 times.

- Renewal price and frequency must appear on the paywall in legible type (minimum 13pt, primary text colour, not grey). Not in a footnote.
- Terms text must state: price, billing period, auto-renewal, and how to cancel — visible without scrolling or tapping.
- Send a renewal reminder push/email before the **first two** weekly charges and before the first monthly charge.
- Trial ending: reminder at 48 hours and 24 hours before conversion.
- Cancellation must be findable in-app in two taps, linking to the store's subscription management.
- Restore Purchases button on the paywall.

### 1.6 Retention offers

- **Cancellation flow:** offer 50% off the first year of annual (`keel_pro_annual_winback_v1`) before the cancel confirmation.
- **Downgrade path:** all cancelled users land back on the Free tier rather than a locked app. Preserves win-back audience and prevents deletion.
- **Win-back campaign** at 30 and 90 days post-cancellation.

### 1.7 Metrics to instrument from day one

- LTV, churn and CAC tracked **separately per billing plan**. Weekly subscribers in this category typically churn at 15–25% per week; average weekly LTV may land at £15–25, potentially below paid CAC. If weekly proves unprofitable on paid traffic, remove it from ad funnels rather than removing it entirely.
- Trial-to-paid conversion rate, tracked separately per plan.
- Refund rate per plan.
- Day-1 / Day-7 / Day-30 retention.
- Feature engagement vs. retention correlation (specifically: does coach usage predict renewal?).

### 1.8 Cost control — AI inference

Photo scans and coach chat carry a per-use cost. A heavy user could cost £1.50–£3.50/month in inference, which is survivable at £6.67/month annual but not comfortable at high churn.

- **Fair-use cap in Terms:** 300 photo scans and 500 coach messages per calendar month. Enforce only against the top ~0.5% of usage, with a soft warning first.
- **Cache aggressively.** Most users eat the same ~40 meals. A re-log of a previously scanned meal must cost zero inference.
- **Model tiering:** cheap/small model for food classification and barcode matching; larger model reserved for the AI coach and the weekly report.
- Log per-user inference cost and surface it in an internal dashboard.

---

## 2. Onboarding funnel

Modelled on the web-to-app quiz funnel used by Reverse Health, Noom, Flo and Zoe. This pattern is the category standard, not proprietary — the mechanics are copyable, the questions and copy must be original.

### 2.1 Funnel shape

```
Paid ad (Meta / TikTok / Google)
        ↓
Landing page  ──(or skip: ad straight to quiz)
        ↓
Quiz  — 20–28 questions, ~3–4 minutes
        ↓
Analysis / "building your plan" moment
        ↓
Email capture
        ↓
PLAN REVEAL  ← the payoff
        ↓
Paywall (hard) → trial start, payment on web
        ↓
App download + magic-link sign-in (plan already populated)
```

The core principle: **build commitment before showing price.** By the time pricing appears, the user has invested several minutes and disclosed personal information. That invested effort is the primary conversion driver, not the price itself.

### 2.2 Why this pattern works in this category

- Health & fitness is one of the strongest verticals for web quiz funnels because the personalisation is real and can be demonstrated before the app is opened.
- Reported uplift for well-executed quiz funnels in this space is meaningful, but treat published figures as marketing claims, not benchmarks — measure your own.
- The quiz doubles as an educational device. It is where you teach the protein/strength framework, so that by the paywall the user already believes the premise and is not evaluating a cold pitch.
- Payment on web means you keep the store commission and own the customer relationship, email address and retargeting audience.

### 2.3 Quiz structure

The full, screen-by-screen question set lives in the onboarding quiz document. This section is the shape only.

Target 26–30 questions in 6 blocks, single-select where possible, one question per screen, visible progress bar throughout.

**Block 1 — Goal and identity (Q1–4)**
Opens with the emotionally resonant question, not the boring one. Never start with height and weight.

1. What's your main goal? *(Lose fat · Build strength · Feel more energetic · Stay healthy as I age · Maintain and feel better)*
2. What's your age range?
3. Which best describes where you are? *(Not sure · Perimenopause · Menopause · Post-menopause · I've had a hysterectomy / surgical menopause)*
4. What's changed for you in the last few years? *(multi-select: energy, sleep, weight, strength, mood, joints, nothing much)*

**Block 2 — Current state (Q5–11)**
5. Height
6. Current weight
7. Goal weight *(optional, skippable, floored — see §2.6)*
8. Activity level
9. Strength-training experience *(Never lifted · Tried it · On and off · Regular)*
10. Typical sleep
11. Do you have access to a gym? *(Gym · Dumbbells at home · Bands / bodyweight only)*

**Block 3 — Framework education (Q11–15)**
This is the block that does the selling. Each question is followed by a short insight card.

11. Do you know roughly how much protein you eat in a day? → insight card on how protein requirements rise as we age
12. How many times a week do you do resistance training? → insight card on age-related muscle loss and what reverses it
13. Have you tried tracking food before? What happened? → validates prior failure, positions the food camera as the fix
14. How do you feel about the number on the scale? → sets up the strength-score-over-weight positioning
15. What's got in the way before? *(Time · Boredom · Confusion · Didn't see results · Life got busy)*

**Block 4 — Personalisation inputs (Q16–21)**
16. Dietary preference *(No restrictions · Vegetarian · Vegan · Pescatarian · Halal · Kosher)*
17. Any foods you won't eat? *(free text or common multi-select)*
18. Food allergies or intolerances
19. Cooking time on a typical weekday
20. Who else are you cooking for? → drives Family Meal Mode
21. Symptoms you'd like to track *(optional multi-select)*

**Block 5 — Safety screening (Q22–24) — mandatory**
See §2.6. This block is not optional and is not a place to optimise for conversion.

**Block 6 — Commitment (Q27–29)**
27. What would success look like in 12 weeks? *(free text — reused in the plan reveal and in retention email)*
28. How ready are you to start? *(slider)*
29. First name — used throughout the plan reveal

### 2.4 The analysis moment

A 15–30 second animated "building your plan" sequence with progressive status lines:

```
Analysing your protein requirement…       ✓
Calculating your training starting point… ✓
Adjusting for your sleep and energy…      ✓
Personalising for perimenopause…          ✓
```

This is theatre, and it works — perceived effort increases perceived value. Do not fake a longer wait than needed; 30 seconds is the ceiling before drop-off climbs.

Insert **social proof** and **one credibility claim** during the wait. Never fabricate user numbers or testimonials.

### 2.5 Plan reveal — the payoff screen

This is the single highest-leverage screen in the funnel. Everything before it exists to earn attention for this.

```
Sarah, here's your plan.

  YOUR DAILY TARGETS
  Calories    1,850
  Protein       110g
  Fibre          30g
  Strength     3× / week
  Steps       8,000 / day

  WHERE YOU ARE NOW
  Protein     ~62g/day  ──────░░░░  56% of target

  This gap is the single biggest thing
  holding back your strength and energy.

  YOUR 12-WEEK PROJECTION
  [chart: strength ↑, energy ↑, body composition]

  TOWARDS YOUR GOAL          (only if a goal was set)
  [range band, not a single line]
  Estimated, and it assumes you stick with it.
```

Rules for this screen:

- **Still lead with the protein gap**, above the weight projection. It is the product's actual thesis, it is defensible, and it is what the coaching acts on. The weight projection sits below it, not above.
- **Weight projection is shown** when a goal weight was given. It must be conservative, plainly labelled an estimate, show a range rather than a single line, and never imply a guaranteed date.
- Projections assume adherence and say so in plain words on the screen.
- A projection is **never** rendered for an account in calorie-free mode, or one that screened positive on §2.6.
- Echo her free-text answer from Q27 back to her. It is the strongest personalisation signal available and costs nothing.

### 2.6 Safety screening — mandatory

**Changed decision: goal weight is now collected, and weight-loss projections are shown.** The earlier version of this spec excluded both. That exclusion has been reversed by the product owner. What follows is the safety envelope that remains, and what was given up.

**Still mandatory, no exceptions:**

- **Explicit eating-disorder screening question**, listed plainly among health conditions rather than omitted. A positive answer routes the account into **calorie-free mode** by default (protein and habits only, calorie number hidden) with a supportive explanation, not a rejection. A positive answer also **suppresses the goal-weight question and the projection chart entirely** for that account.
- **Hard floor on generated calorie targets.** The plan-reveal engine must be incapable of producing an unsafe number regardless of quiz inputs, including goal weight.
- **Hard floor on accepted goal weight.** A goal below a safe clinical minimum for the user's height is refused at input, with a supportive message and a re-prompt. The refusal never tells her she has been flagged.
- **Pregnancy and breastfeeding screening** — routes out of calorie targeting and out of goal weight entirely.
- **Relevant conditions** (diabetes, thyroid, cardiac, kidney) trigger a "check with your GP before starting" interstitial, not a block.
- Screening questions are worded neutrally and non-judgementally, and the user is never told she has been flagged or sorted.

**Given up by this decision, recorded honestly:**

- The goal-weight field was previously identified in this document as *"the mechanism by which these funnels generate unsafe targets."* That mechanism is now present. The floors above are what stand in its place.
- The differentiator against Reverse Health on this specific point is gone. Published reviews criticised that product for not flagging extremely low goal weights; Keel now collects goal weight, and the accepted-goal floor is the only thing separating the two behaviours. **That floor is therefore load-bearing and must be tested, not assumed.**
- Marketing can no longer claim "no goal weight, ever." The site copy has been updated accordingly.

**Rate limiting:** goal weight is editable, but repeated downward edits within a short window should be treated as a signal, not silently accepted. Log it; do not confront the user.

### 2.7 Paywall placement and Apple compliance

- Paywall sits immediately after plan reveal, on web. Hard paywall — no skip link.
- Paywall copy must reference her quiz answers ("your 110g protein target starts today"). A generic paywall after a personalised quiz is a sharp drop in conversion.
- **Apple's rules:** you may sell on your own website and you may not link to that website from inside the iOS app or steer users to it in-app. Traffic flows web → app, never app → web. Rules in this area have shifted with recent litigation, so **have the current App Store Review Guidelines checked by counsel before launch** rather than relying on this document.
- Users who paid on web sign in via **magic link**, and their quiz answers, targets and plan must already be populated on first app open. Requiring a paying customer to re-enter everything is the most common and most damaging failure point in this funnel.
- Provide an in-app "I signed up on the web" restore path.

### 2.8 In-app onboarding (organic downloads)

Users arriving directly from the App Store get a shortened version: the same quiz cut to 12–15 questions, native screens, store IAP at the paywall. Do not run the full 27-question web quiz natively — completion rates are materially worse in-app.

### 2.9 Abandonment recovery

Email capture sits **before** plan reveal specifically so that abandoners are reachable.

- +1 hour: "Your plan is ready" with the plan reveal link
- +24 hours: the protein-gap insight as standalone content
- +3 days: social proof
- +7 days: discounted annual offer

Comply with UK GDPR and PECR — explicit opt-in, one-click unsubscribe. Health-related quiz answers are special category data and cannot be used for marketing personalisation without separate explicit consent (see §9).

### 2.10 Multiple funnel entry points

The competitor's programme grid (Somatic Yoga, Chair Yoga, Wall Pilates, Fasting, Keto, Weight Loss) is primarily an **acquisition device, not a product architecture**. Each tile is a distinct ad angle and landing page feeding the same quiz and the same paywall. This is the part worth copying, and it is mostly a marketing build rather than an app build.

Launch entry points, each with its own landing page and ad creative, all feeding the §2.3 quiz:

| Entry point | Angle | Feeds |
|---|---|---|
| Wall Pilates | Low-intimidation core and glutes, no gym | Movement programme → strength |
| Chair Yoga | Balance, posture, mobility — accessible at any age | Movement programme → strength |
| Somatic / mobility | Stress, stiffness, sleep, recovery | Movement programme → strength |
| Strength | Build muscle, stay strong for decades | Core product |
| Protein for women | The protein gap; why eating "healthily" is not enough | Core product |
| Lose fat, keep muscle | Why the old dieting playbook stopped working | Core product |
| Meal timing | What to eat around training; protein across the day | Core product |

The quiz then routes her to the right starting programme. One product, seven doors.

**Advertising compliance — check before any spend.** UK CAP Code carries specific restrictions on weight-loss and health claims, and this demographic is more likely than most to complain to the ASA. Claims of the form "see results in 28 days", "reset your metabolism", or "heal your system" are the pattern to avoid. Have ad copy and landing pages reviewed before launch, and keep a substantiation file for every claim that survives review.

### 2.11 Instrumentation

Track drop-off per question. Expect the largest losses at weight entry, at email capture and at the paywall. Every question must justify its drop-off cost by either changing the plan output or increasing commitment — if it does neither, cut it.

Test in this order: (1) paywall copy, (2) plan-reveal layout, (3) quiz length, (4) landing page, (5) question order. Do not test the safety block.

---

## 3. Feature matrix — Free vs Pro

The Free tier is deliberately thin but functional. It must prove the app works and be insufficient to live on. The intended hook: she sees she is ~40g short on protein every day, and the fix sits behind the paywall.

| Feature | Free | Pro |
|---|---|---|
| Onboarding + personalised targets | ✅ | ✅ |
| Manual food logging | ✅ | ✅ |
| Barcode scanning | ✅ | ✅ |
| AI photo meal scan | 3 / week | Unlimited |
| Voice meal logging | ❌ | ✅ |
| Today dashboard | Calories, protein, steps only | Full |
| Micronutrient tracking | ❌ | ✅ |
| Workouts | 1 / week | Full programme |
| Chair Yoga / Wall Pilates / Somatic | 1 session / week | Full libraries |
| Dietary macro presets (inc. Keto) | ❌ | ✅ |
| Progressive overload engine | ❌ | ✅ |
| AI Coach chat | ❌ | Unlimited |
| Weekly AI report | ❌ | ✅ |
| Meal planner + shopping list | ❌ | ✅ |
| AI recipe maker (photo or text ingredients) | ❌ | ✅ |
| Menu / restaurant scanner | ❌ | ✅ |
| Symptom + menopause tracking | ❌ | ✅ |
| HRT log | ❌ | ✅ |
| Strong for Life ageing metrics | ❌ | ✅ |
| GP summary PDF export | ❌ | ✅ |
| Progress photos | ❌ | ✅ |
| Fasting window tracker | ❌ | ✅ |
| Weight logging | ✅ | ✅ |
| Apple Health (steps, weight) | ✅ | ✅ |
| Full wearable integrations | ❌ | ✅ |
| Apple Watch app | ❌ | ✅ |
| Widgets | ❌ | ✅ |
| Data export | ✅ | ✅ |

Data export stays free in both tiers. It is a GDPR obligation, not a feature.

---

## 4. Full Pro feature set

### 4.1 Nutrition

- Unlimited AI photo meal scanning
- Multi-item plate detection (identifies each component separately)
- Portion correction with visual size guides
- Barcode scanner
- Voice logging — natural language ("two scrambled eggs and a slice of sourdough")
- Text logging
- Restaurant / menu photo scanner
- UK supermarket ready-meal and meal-deal database
- Favourites and one-tap re-log
- Custom recipes and saved meals
- Alcohol tracking with honest calorie accounting
- Hydration tracking
- Supplement log
- Micronutrients that matter most: **calcium, vitamin D, iron, magnesium, B12, omega-3**, and fibre split into soluble / insoluble
- "How this fits your day" verdict returned on every logged meal

### 4.2 Meal planning

- AI daily and weekly meal plans generated from remaining macros
- Shopping list generation, grouped by supermarket aisle
- **Family meal mode** — cook one dinner, her portion sized correctly, the rest of the household untouched
- Recipe library with filters: high protein, under 500 cal, 30-minute, calcium-rich, high fibre, vegetarian
- AI recipe adaptation ("make this vegetarian", "get it to 40g protein", "swap the salmon for chicken")
- Batch-cook / Sunday prep plans
- Leftovers handling

**Cook what you already have (AI recipe maker)**

- **Photograph the ingredients** — an open fridge, a worktop, a cupboard shelf — and Keel names
  what it can see and returns recipes buildable from it.
- **Or just tell it**: "chicken thighs, half a bag of spinach, some feta."
- Returns two or three options, each with its protein number and time to cook, ranked by how
  well it fits her remaining macros for the day.
- **Flags the gap honestly**: "this gets you to 32g, you are 20g short today, add the yoghurt."
- Missing-item tolerance — a recipe that needs one thing she hasn't got is offered with the
  swap already made, not hidden.
- Respects every Block 4 constraint: allergies are a hard exclusion, dislikes and dietary
  preset filter the results.
- Reuses the **same vision model as the meal scan** (§4.1). This is a new prompt and a new
  surface, not a new capability, which is why it is cheap relative to its pull.

**Why it earns its place:** "what do I actually cook tonight" is the highest-frequency friction
in any nutrition app, and it is the moment a protein target turns into a meal or gets abandoned.
It also converts an existing cost centre into a second reason to open the camera.

### 4.3 Strength training

- Programme library: 2×, 3×, 4× weekly
- Equipment variants: full gym, dumbbells only, home / resistance bands
- **Automatic progressive overload** — suggested load and rep range each session based on prior performance
- Beginner mode using plain-English cues, not RPE / periodisation jargon
  - e.g. "Choose a weight you can lift comfortably 10 times"
- Exercise demo videos **filmed with ordinary women**, not fitness models. Do not cast by age.
- Exercise swaps for equipment limits or joint issues
- Rest timer
- Plate calculator
- Warm-ups and mobility routines
- Scheduled deload weeks
- Full lift history with per-exercise charts
- *(Roadmap)* Automated form check from user-recorded video via pose estimation

### 4.4 Movement programmes (beyond strength)

Strength remains the core of the product. These are **on-ramps and complements**, not alternatives — a woman who will not start with a leg press will start with wall Pilates, and should be on a barbell or machine programme within 6–8 weeks. Build the progression path explicitly; do not let these become a parallel product she never leaves.

Each is a video library plus a schedule. Low logic cost, high acquisition value.

**Chair Yoga / Chair Strength**
- Seated and chair-supported movement for balance, posture and mobility
- Serves the 60+ and joint-limited segment that a standard strength programme excludes
- Pairs directly with the balance test and sit-to-stand metric in §4.10
- Also the correct fallback for a user reporting a flare-up, injury or very low energy day

**Wall Pilates**
- High-volume search and social term; strong paid-acquisition angle
- Genuine value as a low-intimidation entry point for core, hips and glutes
- Framed as a bridge into loaded strength work, not a substitute for it

**Somatic / mobility and nervous-system work**
- Slow, low-intensity mobility and breath work
- Legitimate use: recovery days, sleep support, stress, joint stiffness
- **Copy constraint:** describe what it is and how it feels. Do not claim it "heals your system", regulates hormones, or resolves trauma. Those are unsupported claims and an ASA and App Store risk

**Progression logic (required)**
- Every non-strength programme surfaces a next step toward loaded training after a set number of completed sessions
- The AI coach explicitly nudges the transition
- Track and report the crossover rate from movement programmes into the strength programme — it's the metric that tells you whether these are on-ramps or a dead end

### 4.5 Dietary approach presets

Keto and similar are handled as **macro presets inside the existing meal planner**, not as separate programmes. A preset changes the macro split and the recipe filter; it does not need its own build.

- Balanced (default)
- Higher protein
- Lower carb
- Keto
- Mediterranean
- Plant-forward / vegetarian / vegan

**Constraints:**
- Presets adjust macro distribution only. They never lower the calorie floor (§7)
- The protein target is never reduced by a preset — it is the product's core thesis
- No preset is marketed as a metabolic fix, a hormone reset or a plateau-breaker. It is a way of eating she may prefer, nothing more

### 4.6 Fasting windows and progress photos

**Changed decision.** Both were previously excluded by this document. Both are now shipping as
opt-in features. What follows is how they ship safely, and what the reversal costs.

**Fasting window tracker**
- A timer and an eating-window log. It records when she ate, it does not prescribe when she should.
- **Off by default.** She turns it on in settings; onboarding never offers it.
- **The AI coach never suggests it, never recommends extending a window, and never frames it as a
  weight-loss tool.** §7's coach refusal rules still stand in full: requests for extreme deficits
  or "how little can I eat" are still refused and redirected.
- The calorie floor is unaffected. A fasting window never reduces the daily target.
- Suppressed entirely for accounts that screened positive at quiz Q24.

**Progress photos**
- Private by default and stored to the user's own account. Local-first where the platform allows.
- **Never used in marketing.** The site now says this explicitly rather than claiming the feature
  does not exist.
- Side-by-side comparison is a feature she opens, never a notification, never a prompt, never a
  celebration the app initiates.
- No automatic sharing, no export-to-social affordance, no watermarking with the brand.
- Suppressed entirely for accounts that screened positive at quiz Q24.

**What the reversal costs, recorded honestly:**
- The original reasoning for excluding fasting was that it is contraindicated for a demographic
  with a long diet-industry history, and that it invites disordered patterns. That reasoning has
  not become wrong; it has been overridden. The opt-in default and the Q24 suppression are what
  stand in its place.
- Progress photos and goal weight together reintroduce most of the appearance-focused loop this
  product was originally positioned against. The remaining differentiators are the protein-led
  plan, the calorie floor, calorie-free mode and the Q24 screening. Those four are now carrying
  the entire safety position and none of them may be weakened further without a deliberate
  decision recorded here.

### 4.7 AI Coach

Retention depends disproportionately on this feature. Without a human coaching tier, the AI coach and the weekly report are what the subscription is actually being bought for. If it reads like generic ChatGPT output, month-two churn will be severe. Allocate build time accordingly — context handling and prompt quality over feature breadth.

- Unlimited context-aware chat with access to: remaining macros, training history, sleep, symptoms, dietary preferences and dislikes
- Pre- and post-workout guidance
- Readiness call — "should I train today?"
- Plateau diagnostics — "why has my weight stopped dropping?"
- Real-time eating-out advice
- Proactive nudges, not purely reactive Q&A
- **Guardrails (mandatory):**
  - Never asserts causation from correlated user data
  - Never diagnoses
  - Never advises on HRT dosing or prescription changes
  - Refers to a GP/clinician for anything clinical
  - Hard floor on calorie recommendations (see §7)

### 4.8 Progress & body

- Weight, waist, hips, thighs
- Progress photos — private, side-by-side compare, never used in marketing (§4.6)
- **Strength score as the headline metric**, not body weight
- Protein consistency percentage
- Workout streaks
- Trend smoothing so daily water fluctuation doesn't distort the week
- Body composition sync from smart scales

### 4.9 Menopause & symptoms

- Daily 20-second check-in: hot flushes, energy, mood, sleep quality
- Optional: joint pain, brain fog, cravings, night sweats, anxiety, palpitations
- Cycle tracking with irregular-cycle support (perimenopause)
- **HRT log** — type, dose, start date, subjective response over time
- Correlation view, worded strictly as association
  - ✅ "Your sleep tends to be worse in weeks with more night sweats."
  - ❌ "Eating broccoli reduced your hot flushes."
- Stage-specific explainers, clinician-written and cited

### 4.10 Strong for Life (healthy ageing)

- Daily 5-habit completion: protein, strength, movement, fibre, sleep
- Displayed as "4 / 5 healthy-ageing habits completed today" — **not** an "anti-ageing score"
- Bone-loading minutes from weight-bearing exercise
- **Grip strength log** (every 8 weeks)
- **Sit-to-stand test** (every 8 weeks)
- Balance test
- Walking pace trend
- Long-view chart comparing her to her own baseline, never to a population norm

Grip strength and sit-to-stand are validated ageing markers, near-zero build cost (a timer and a number field), and are the clearest product signal that this is about staying strong for 30 more years rather than losing 5kg by August.

### 4.11 Reports & sharing

- Weekly AI report, delivered Sunday
- Monthly deep-dive
- **GP / menopause clinic summary PDF** — symptoms, HRT log, weight, strength and nutrition trends, exportable ahead of an appointment

The GP PDF is low build cost, high emotional value and highly shareable. Women routinely enter 10-minute appointments with nothing written down.

### 4.12 Integrations & platform

- Apple Health and Google Fit — two-way sync
- Garmin, Fitbit, Oura, Whoop
- Withings / Renpho smart scales
- Apple Watch app — workout logging and rest timers
- Home screen widgets
- Siri and Google shortcuts
- Offline logging with background sync
- Full data export

---

## 5. Navigation

Five tabs. No more.

| Tab | Contents |
|---|---|
| **Today** | Daily dashboard, score, focus card, habit ring |
| **Food** | Scanner, log, meal planner, recipes |
| **Train** | Today's workout, programme, lift history |
| **Coach** | AI chat |
| **Progress** | Weight, measurements, strength score, symptoms, reports |

---

## 6. Build sequencing

### V1 — MVP (launch)

**Core six:**

1. Personal onboarding — web quiz funnel + plan reveal + safety screening (see §2), plus the shortened in-app version
2. AI food camera
3. Daily dashboard
4. AI coach
5. Strength programme with progressive overload
6. Weekly AI report

**Low-cost, high-leverage additions:**

7. **Voice logging** — food-tracking adherence dies at the friction point; voice roughly halves it
8. **GP summary PDF** — low effort, high emotional value, shareable
9. **Grip strength + sit-to-stand** — a timer and a number field, and the clearest differentiator in the product

**Meal-planning suite (moved up from Month 2):**

10. AI meal planner + shopping list
11. Recipe library with filters and AI adaptation
12. Family meal mode
13. Menu / restaurant scanner

**Movement programmes and acquisition surfaces:**

14. Chair Yoga, Wall Pilates and Somatic/mobility programmes (see §4.4) — video libraries plus schedules
15. Dietary macro presets including Keto (see §4.5) — a settings layer on the existing planner
16. Landing pages and ad creative for the seven funnel entry points (see §2.10) — marketing build, runs in parallel with development

#### Scope warning on items 10–13

This roughly doubles the V1 build. Items 10–13 are not four small features — they carry dependencies the core six do not:

- The **recipe library** needs actual recipes. Either licence a recipe dataset, commission a food writer, or generate and then human-review them. Generated recipes shipped unreviewed will produce embarrassing failures, and it only takes one screenshot. Budget and lead time for this need settling before development starts, not during.
- The **meal planner** requires a constraint solver that hits macro targets across four meals while respecting allergies, dislikes, dietary preference and cooking time. It is the hardest logic in the product and it fails visibly when it gets it wrong.
- The **shopping list** needs ingredient normalisation and aisle categorisation — a data problem, not an AI problem.
- **Family meal mode** needs portion scaling logic on top of the planner, so it cannot start until the planner is stable.
- The **menu scanner** needs a different vision pipeline from the food camera (text extraction and dish inference, not plate recognition) plus its own accuracy tuning.

**If the launch date is fixed, sequence them 10 → 11 → 12 → 13 and cut from the back.** The menu scanner is the most deferrable: it's used occasionally rather than daily, so it contributes least to the habit loop and least to retention.

**If the launch date is flexible,** build all four but expect roughly 6–10 additional weeks over the core six, and hold the safety and billing requirements (§7, §1.5) as non-negotiable regardless of pressure on the schedule.

### Month 2–3

- Wearable integrations (Garmin, Fitbit, Oura, Whoop)
- Apple Watch app
- Widgets
- Micronutrient expansion

### Later (post 500 paying users)

- Automated form check via pose estimation
- Premium tier (see §8)
- Additional programme variants

### Explicitly NOT in V1

Social network · live classes · meditation library · 1,000-recipe library · supplement store · doctor consultations · full Flo-equivalent cycle tracking · article library · community forums · complex wearable integrations · **human 1:1 coaching** · **a standalone branded weight-loss programme**

**Fasting is no longer on this list.** A fasting *window tracker* ships as an opt-in feature (§4.6). What stays excluded is a fasting **protocol**: a prescribed schedule, a programme, or anything the coach recommends. The tracker records; it never prescribes.

Do not list human coaching on the marketing site in any form — not as "coming soon", not as a greyed-out card. Anything advertised that cannot be delivered on day one generates support tickets and erodes trust with a demographic that has already been sold a great deal of nonsense by the wellness industry.

---

## 7. Safety requirements — non-negotiable

Tracking weight, calories and symptoms for this demographic guarantees users with a history of disordered eating. These are both an ethical obligation and a concrete App Store review risk.

- **Calorie-free mode** — user can hide the calorie number entirely and run the app on protein and habit targets alone. Offer this during onboarding, not buried in settings.
- **Low-intake warning** — triggered when logged intake falls materially below the calculated target for consecutive days. Warning is supportive, not alarming, and offers a route to support resources.
- **Hard floor on generated targets** — the onboarding calculator and the AI coach must never generate or endorse a target below a safe clinical minimum.
- **No weight-loss gamification** — streaks apply to habits (protein, training, movement), never to weight lost or deficit maintained. This holds even though goal weight now exists: progress toward a goal weight is never a streak, a badge or a celebration.
- **No before/after imagery in marketing.** In-app progress photos are permitted, private by default, never surfaced by the app itself, and never used in advertising (§4.6).
- **Screening question at onboarding** regarding history of disordered eating; a positive response defaults the account into calorie-free mode **and suppresses goal weight and weight projections for that account** (§2.6).
- **Goal weight has a hard accepted floor** — a goal below a safe clinical minimum for the user's height is refused at input. This floor replaces the previous protection of not collecting goal weight at all, and must be covered by tests.
- **Signposting** to appropriate support resources, kept current.
- The AI coach must refuse requests for extreme deficits, fasting protocols framed as weight-loss tools, or "how little can I eat" questions, and redirect supportively. **The fasting tracker existing as a feature does not change this.** The coach logs a window if she sets one; it never proposes one.
- **Fasting and progress photos are opt-in and suppressed for Q24-positive accounts** (§4.6).

---

## 8. Reserved: premium tier (future)

The removal of a human coaching tier leaves the top of the price ladder empty. Two consequences: nothing anchors Pro as the reasonable middle option, and the users who would pay 4× for accountability have nowhere to go.

Reclaim this later **without hiring anyone**, as `Keel+`:

- Unlimited automated form-check video analysis
- Priority model access
- Monthly live group Q&A, hosted by the founder — one hour per month is staffable

Indicative price: £39.99/month or £299/year.

Do not build or advertise until Pro retention is proven.

---

## 9. Open items

- Register keelhealth.com and keelhealth.co.uk immediately, plus keelhealth.app and the defensive misspellings
- Trademark clearance for "Keel" and "Keel Health": UK IPO and EUIPO classes 9 and 44. Note "Keel" is a common word with existing marks in other classes — clearance search should be done by an attorney, not a self-search
- App Store and Play search for "Keel" in Health & Fitness before finalising the listing name
- Secure @keelhealth on Instagram and TikTok
- Video production for Chair Yoga, Wall Pilates and Somatic libraries — instructor casting, studio, and volume needed for V1
- ASA / CAP Code review of all landing page and ad copy before spend, with a substantiation file per claim
- Alternative names held in reserve: Second Spring, Juno, Keystone, Vigor
- Nutrition database licensing decision (affects food scan accuracy and cost)
- **Recipe sourcing decision — now blocking V1.** Licence a dataset, commission a food writer, or generate with human review. Needs a budget and a lead time before development starts
- Ingredient normalisation / supermarket aisle taxonomy for the shopping list
- Clinician sign-off on all menopause explainer content
- Legal review of Terms, fair-use caps and health disclaimers
- GDPR: health data is special category data under UK GDPR Article 9 — explicit consent flow required, plus DPIA. Applies to quiz answers collected on the web funnel before an account exists, and separately to any marketing use of those answers under PECR
- Counsel review of current App Store Review Guidelines on external purchases and in-app steering, before the web funnel goes live
- Funnel tooling decision: build in-house vs a funnel builder (FunnelFox, Funnelish and similar) — affects speed to first paid test
- Paid-traffic test budget. Industry guidance suggests £15,000–£30,000 is needed for a web-to-app funnel test to produce meaningful data; scope this before committing to the channel
