// All page copy in one place. Components render these; edit words here, not in JSX.

// Pre-launch: every call to action goes to the waiting list. Pricing is hidden for now (see HomePage.tsx).
export const CTA_LABEL = "Join the waiting list";
export const CTA_SHORT = "Join waiting list";
export const CTA_HREF = "#waitlist";

export const hero = {
  lines: ["Same meals.", "Same walks."],
  last: { lead: "Different", em: "body." },
  lede: "Second Strong is strength and nutrition coaching for women 40 to 65. It knows what perimenopause and menopause change, and plans your food and training around it.",
  priceNote: "Coming soon to iPhone and Android",
  videoLabel:
    "A single line draws breakfast, then a woman out walking, then the same woman in her kitchen, hand on hip, puzzled",
};

export interface Fact {
  fig: string;
  text: string;
  source: string;
}

export const facts: Fact[] = [
  {
    fig: "3–8%",
    text: "of muscle can go each decade from your thirties, and the loss speeds up around menopause unless you load it.",
    source: "Volpi et al., Curr Opin Clin Nutr Metab Care, 2004",
  },
  {
    fig: "Up to 20%",
    text: "of bone density can be lost in the five to seven years after menopause. Weight-bearing exercise helps slow it.",
    source: "Bone Health & Osteoporosis Foundation",
  },
  {
    fig: "1.0–1.2g",
    text: "of protein per kilo of body weight a day is what experts suggest for older adults. Most women eat less.",
    source: "PROT-AGE Study Group, JAMDA, 2013",
  },
];

export interface Symptom {
  id: string;
  draw: DrawName;
  label: string;
  title: string;
  emoji: EmojiName;
  text: string;
}

export const symptoms: Symptom[] = [
  { id: "card1", draw: "night", label: "Line drawing of a woman awake in bed at night", title: "3am. Wide awake.", emoji: "sleepy", text: "Bad night? Tomorrow's session gets lighter and shorter." },
  { id: "card2", draw: "stairs", label: "Line drawing of a woman climbing stairs", title: "Stairs feel steeper.", emoji: "tired", text: "Leg strength is the first thing Second Strong builds back." },
  { id: "card3", draw: "desk", label: "Line drawing of a woman at a desk with her head in her hand", title: "4pm fog.", emoji: "dizzy", text: "Protein and timing at lunch to steady the afternoon." },
];

export interface DayStep {
  time: string;
  title: string;
  text: string;
  draw: DrawName;
}

export const daySteps: DayStep[] = [
  { time: "7:30 · Breakfast", title: "Protein first thing.", text: "Yoghurt, berries and a coffee gets you 25g before nine. Second Strong shows what's left for the day.", draw: "morning" },
  { time: "12:45 · Lunch", title: "Snap it, don't weigh it.", text: "One photo logs the plate and tells you how it fits. No kitchen scales.", draw: "snap" },
  { time: "18:00 · Strength", title: "Twenty minutes, a bit heavier.", text: "Today's session is on your phone, with the weight set from last time.", draw: "lift" },
  { time: "21:30 · Wind down", title: "A slow stretch for sleep.", text: "Ten minutes of gentle mobility, and a 20-second check-in so tomorrow's plan knows how today went.", draw: "wind" },
];

export const howSteps = [
  { title: "Answer a few questions.", text: "About two minutes: your stage, your symptoms, the kit you have and the food you like." },
  { title: "Get your plan.", text: "A daily protein target, two to four strength sessions a week, and meals built around both." },
  { title: "It adapts every day.", text: "A 20-second check-in each morning. Slept badly, sore knees, a hot-flush night: the day changes to fit." },
];

export const tiles = [
  { title: "Voice and barcode logging", text: 'Say "two eggs and toast", or scan the packet.' },
  { title: "UK supermarket foods", text: "Meal deals and ready meals are already in." },
  { title: "Family meal mode", text: "Cook one dinner. Your portion is sized for you." },
  { title: "Shopping lists", text: "Built from your week's meals, grouped by aisle." },
  { title: "Wall Pilates and chair strength", text: "Gentle ways in, with a path to heavier work." },
  { title: "Calcium, vitamin D, iron", text: "The nutrients that matter more now, tracked for you." },
  { title: "HRT and cycle log", text: "Kept next to your symptoms, so you can see patterns." },
  { title: "Apple Health, Garmin, Oura", text: "Sync the apps and devices you already use." },
];

export const habits = [
  { name: "Protein", done: true },
  { name: "Strength", done: true },
  { name: "Movement", done: true },
  { name: "Fibre", done: true },
  { name: "Sleep", done: false },
];

export const weeklyReport = {
  bars: [60, 85, 70, 100, 90, 55, 95],
  rows: [
    ["Protein target hit", "5 / 7 days"],
    ["Strength sessions", "3 / 3"],
    ["Sleep", "better on training days"],
  ] as const,
};

export const gpSummary = [
  ["Hot flushes", "down this month"],
  ["HRT", "logged since June"],
  ["Night sweats", "2 a week"],
  ["Strength", "up 3 of 4 lifts"],
] as const;

export interface Plan {
  id: "annual" | "weekly" | "monthly";
  name: string;
  perWeek?: string;
  billing: string;
  badge?: string;
}

export const plans: Plan[] = [
  { id: "annual", name: "Annual", perWeek: "£1.54", billing: "£79.99 billed every year", badge: "Save 69%" },
  { id: "weekly", name: "Weekly", perWeek: "£4.99", billing: "£4.99 billed every week" },
  { id: "monthly", name: "Monthly", billing: "£14.99 billed every month" },
];

export const faqs = [
  { q: "I've never lifted weights. Is this for me?", a: "Yes. Your first sessions use your bodyweight, a chair and a pair of light dumbbells. Second Strong adds weight slowly, and only when the last session felt manageable." },
  { q: "Do I need a gym?", a: "No. Every plan has a home version. If you do go to a gym, Second Strong uses the equipment there." },
  { q: "Is this a diet?", a: "No. Second Strong doesn't cut calories or ban foods. It helps you eat enough protein to keep your muscle and bone, using food you already like." },
  { q: "How does the coach know my symptoms?", a: "You tell it. Log how you slept, hot flushes, joint pain or where you are in your cycle, and the AI coach adjusts the day's training and meals." },
  { q: "I'm already past menopause. Is it still for me?", a: "Yes. Muscle and bone matter even more after menopause, and the plan works the same way at any stage." },
  { q: "Does it work alongside HRT?", a: "Yes. You can log your HRT next to your symptoms and see how you feel over time. Second Strong never advises on doses or prescriptions. That's a conversation for your GP." },
  { q: "When can I get Second Strong?", a: "Second Strong is launching soon on iPhone and Android. Join the waiting list and we'll email you the day it opens." },
];

export type DrawName =
  | "phone" | "night" | "stairs" | "desk" | "plate" | "sofa" | "squat" | "fridge"
  | "carry" | "morning" | "snap" | "lift" | "wind" | "sitstand" | "waitlist" | "typical";

export type EmojiName = "puzzled" | "meh" | "wow" | "sleepy" | "tired" | "dizzy" | "yum" | "happy" | "proud" | "love";
