// Privacy policy and terms. Plain English, UK GDPR. Edit the words here, not in JSX.
// Links inside text use [label](href); the legal page renders them as links.

/**
 * The company behind Second Strong. Every legal page reads these, so fill them in once here.
 * `ready` stays false until the real details are in; the pages show a visible notice while it is false.
 */
export const company = {
  ready: true,
  name: "Acumei Ltd",
  website: "https://acumei.com",
  number: "17394071",
  address: "Apartment 2203, 11 Michigan Point Tower B, Michigan Avenue, Salford, M50 2HJ, United Kingdom",
  country: "England and Wales",
  // Acumei's inbox, which receives mail today; secondstrong.com has no mail set up yet.
  email: "hello@acumei.com",
};

export const updated = "4 October 2026";

export interface LegalSection {
  heading: string;
  body: (string | string[])[]; // a string is a paragraph; an array is a bulleted list
}

const who = `[${company.name}](${company.website}), a company registered in ${company.country} (company number ${company.number}), registered office ${company.address}`;

export const privacy: { title: string; intro: string; sections: LegalSection[] } = {
  title: "Privacy policy",
  intro:
    "This explains what we collect when you visit secondstrong.com or join the waiting list, why, who helps us handle it, and the choices you have. It covers the website and the waiting list only. The Second Strong app will have its own privacy policy, which you'll see before you create an account.",
  sections: [
    {
      heading: "Who we are",
      body: [
        `Second Strong is a product of ${who}. We decide how your information is used, which makes us the "controller" under UK data protection law.`,
        `For anything about your data, email [${company.email}](mailto:${company.email}).`,
      ],
    },
    {
      heading: "What we collect",
      body: [
        "When you join the waiting list:",
        [
          "Your email address.",
          "Your menopause stage, only if you choose one (perimenopause, menopause, after menopause, or not sure). This is optional.",
          "When you signed up and that it came from this website.",
        ],
        "When you visit the site or send the form, our providers briefly process technical details such as your IP address and browser type. We use these to keep the site running and to stop automated sign-ups. We don't use them to identify you or build a profile.",
      ],
    },
    {
      heading: "Your menopause stage is health information",
      body: [
        "Telling us your stage says something about your health, which the law treats as special category data. We only store it if you pick one, and picking one is how you give us your explicit consent to keep it.",
        "We use it for one thing: to make our launch emails more relevant to you. We don't use it to give medical advice or make decisions about you.",
        `You can withdraw that consent at any time by emailing [${company.email}](mailto:${company.email}). We'll delete your stage and, if you like, your email too.`,
      ],
    },
    {
      heading: "Why we use it, and the legal basis",
      body: [
        [
          "Your email: to tell you when Second Strong launches and send a small number of related updates. Legal basis: your consent, given when you join.",
          "Your stage: to tailor those emails. Legal basis: your explicit consent.",
          "Technical details such as IP address: to keep the site secure and the waiting list free of spam and abuse. Legal basis: our legitimate interest in running a safe service.",
        ],
      ],
    },
    {
      heading: "What we don't do",
      body: [
        [
          "We don't sell or rent your information.",
          "We don't use it for advertising, and we don't share it with advertisers.",
          "This website sets no cookies and runs no analytics or tracking.",
          "We won't email you about anything other than Second Strong.",
        ],
      ],
    },
    {
      heading: "Who helps us handle it",
      body: [
        "We use a small number of providers. They act on our instructions and can't use your information for their own purposes:",
        [
          "Railway hosts the website and the sign-up service, on servers in the EU.",
          "Neon stores the waiting list, in a database in London.",
          "Cloudflare runs our domain and Turnstile, a check that tells people from bots when the form is sent. Turnstile doesn't use cookies to track you.",
        ],
        "When we send the launch email we'll use an email service. We'll name it here before we start.",
      ],
    },
    {
      heading: "International transfers",
      body: [
        "We keep the waiting list in the UK and the EU. Some of our providers are US companies, so their staff may occasionally access data from outside the UK. Where that happens, the transfer is protected by the UK's data bridge with the US or by contract terms approved by the UK Information Commissioner.",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        "We keep your email and stage until Second Strong launches, then for up to 12 months after we send the launch email. If you don't create an account in that time, we delete them.",
        "If you unsubscribe or ask us to delete your information, we do it within one month, usually much sooner.",
        "Technical logs kept by our providers are deleted automatically, usually within 30 days.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "You can ask us to:",
        [
          "send you a copy of the information we hold about you;",
          "correct it;",
          "delete it;",
          "stop using it, or use it only in limited ways;",
          "give it to you in a format you can take elsewhere.",
        ],
        `You can also withdraw your consent at any time. Email [${company.email}](mailto:${company.email}) and we'll reply within one month.`,
        "If you're unhappy with how we've handled your information, please tell us first so we can put it right. You also have the right to complain to the Information Commissioner's Office: [ico.org.uk](https://ico.org.uk/make-a-complaint/) or 0303 123 1113.",
      ],
    },
    {
      heading: "Keeping it safe",
      body: [
        "Everything is sent over an encrypted connection. The service that receives sign-ups can only add people to the list: it can't read, change or delete anyone's details. Only the people who run Second Strong can see the list.",
      ],
    },
    {
      heading: "Age",
      body: ["Second Strong is for adults. The waiting list isn't meant for anyone under 18, and we don't knowingly collect their information."],
    },
    {
      heading: "Changes to this policy",
      body: [
        "If we change how we use your information, we'll update this page and the date at the top. If a change is significant, we'll email the waiting list before it takes effect.",
      ],
    },
  ],
};

export const terms: { title: string; intro: string; sections: LegalSection[] } = {
  title: "Terms of use",
  intro:
    "These terms cover your use of secondstrong.com and the waiting list. By using the site you accept them. The Second Strong app will have its own terms, which you'll see before you subscribe.",
  sections: [
    {
      heading: "Who we are",
      body: [`Second Strong and this website are a product of ${who}. You can contact us at [${company.email}](mailto:${company.email}).`],
    },
    {
      heading: "Not medical advice",
      body: [
        "Second Strong gives general information about food, exercise, perimenopause and menopause. It isn't medical advice and doesn't replace your GP, a pharmacist or another health professional.",
        "Talk to your GP before starting a new exercise plan if you have a health condition, an injury, or symptoms that worry you. If you're unwell or think you need urgent help, call 111, or 999 in an emergency.",
      ],
    },
    {
      heading: "The waiting list",
      body: [
        "Joining the waiting list is free and doesn't commit you to anything. It means we'll email you when Second Strong launches.",
        "We plan to launch on iPhone and Android, but we can't promise a date, and features or prices described on this site may change before launch. Nothing on this site is an offer to sell you anything.",
        `You can leave the list at any time by emailing [${company.email}](mailto:${company.email}) or using the unsubscribe link in any email we send.`,
      ],
    },
    {
      heading: "Using the site",
      body: [
        "Please use the site lawfully and fairly. You must not:",
        [
          "sign up other people without their permission, or sign up in bulk or with automated tools;",
          "try to break, overload or get around the site's security;",
          "copy or scrape the site's content for your own use.",
        ],
        "We may refuse or remove sign-ups that break these terms.",
      ],
    },
    {
      heading: "Our content",
      body: [
        "The text, drawings, film, design and the Second Strong name and logo belong to us or the people who license them to us. You're welcome to share links to the site, but please don't reuse its content without our written permission.",
      ],
    },
    {
      heading: "Links to other sites",
      body: ["Where we link to other websites, we don't control them and aren't responsible for their content or how they handle your information."],
    },
    {
      heading: "Our responsibility to you",
      body: [
        "We work to keep the site accurate and available, but we can't promise it will always be error-free or online.",
        "Nothing in these terms limits our liability for death or personal injury caused by our negligence, for fraud, or for anything else the law doesn't allow us to limit. Your legal rights as a consumer aren't affected.",
        "Apart from that, we aren't responsible for loss or damage that comes from relying on general information on this site instead of personal advice from a health professional.",
      ],
    },
    {
      heading: "Changes",
      body: ["We may update these terms. The date at the top shows when they last changed. If you keep using the site after a change, the new terms apply."],
    },
    {
      heading: "Law",
      body: [
        "These terms are governed by the law of England and Wales. If you live in Scotland or Northern Ireland, you can also bring proceedings in your local courts.",
      ],
    },
  ],
};
