import { CTA_HREF, CTA_SHORT } from "@/content/site";
import { Wordmark } from "@/components/ui/Wordmark";

export function Header() {
  return (
    <header className="top">
      <div className="wrap">
        <Wordmark href="#" />
        <a className="btn" href={CTA_HREF}>
          {CTA_SHORT}
        </a>
      </div>
    </header>
  );
}
