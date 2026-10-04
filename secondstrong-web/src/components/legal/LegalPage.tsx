import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { Footer } from "@/components/sections/Closing";
import { company, updated, type LegalSection } from "@/content/legal";
import "@/styles/legal.css";

/** Renders [label](href) inside copy as links; everything else is plain text. */
function linked(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!m) return <Fragment key={i}>{part}</Fragment>;
    const external = m[2].startsWith("http");
    return (
      <a key={i} href={m[2]} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {m[1]}
      </a>
    );
  });
}

/** A plain reading page for the privacy policy and terms: wordmark home link, the text, the site footer. */
export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      <header className="legal-top">
        <div className="wrap">
          <Wordmark href="/" />
          <Link className="btn" href="/#waitlist">
            Join waiting list
          </Link>
        </div>
      </header>
      <main className="legal-page">
        <article className="wrap">
          <span className="eyebrow">Updated {updated}</span>
          <h1>{title}</h1>
          {!company.ready && (
            <p className="legal-draft" role="note">
              Draft: the company details on this page are still to be filled in.
            </p>
          )}
          <p className="legal-intro">{linked(intro)}</p>
          {sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.body.map((b, i) =>
                Array.isArray(b) ? (
                  <ul key={i}>
                    {b.map((li, j) => (
                      <li key={j}>{linked(li)}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i}>{linked(b)}</p>
                ),
              )}
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </>
  );
}
