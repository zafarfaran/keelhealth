
const QA = [
  [
    "I've never lifted a weight. Is this for me?",
    'Yes. Beginner mode uses plain instructions like "choose a weight you can lift comfortably 10 times". If even that feels like a lot, start with Wall Pilates or chair strength and the app will move you across when you’re ready.',
  ],
  [
    'Do I have to count calories?',
    'No. Calorie-free mode hides the number entirely and runs the app on protein and daily habits. You’re offered it at sign-up. Whatever mode you choose, the protein target is always the headline.',
  ],
  [
    "I'm on HRT. Does that change anything?",
    'You can log the type, dose and start date, and see how your sleep and symptoms move alongside it. The coach never advises on dosing or prescriptions. That’s for you and your doctor, and the GP summary is there to make that conversation easier.',
  ],
  [
    "What's in the free version?",
    'Onboarding and your targets, manual and barcode logging, three photo scans a week, one workout a week, and weight and step tracking from Apple Health. It shows you the gap. Closing it is what Pro is for.',
  ],
  [
    'What happens when I cancel?',
    'You drop back to the free version with all your data intact. Nothing is locked or deleted, and you can export everything at any time.',
  ],
  [
    'Is my health data safe?',
    'Symptom and health answers are treated as special category data under UK GDPR. We ask for explicit consent, never use it for marketing without separate permission, and you can download or delete all of it whenever you like.',
  ],
  [
    'I have a health condition. Should I check first?',
    'If you have diabetes, a thyroid, heart or kidney condition, or you’re pregnant or breastfeeding, the quiz will ask you to check with your GP before starting. It won’t block you, but it will change what the plan does.',
  ],
];

export default function Faq() {
  return (
    <section className="faq" id="faq">
      <div className="wrap faq-grid">
        <div className="faq-head">
          <h2 className="h2">
            The things people ask before they start
          </h2>
        </div>
        <div className="faq-list">
          {QA.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
