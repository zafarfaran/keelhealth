/** The wordmark: live type plus the clay dot. "second" and "strong" are separate spans so the big
 * brand moments can stack them; the dot is a real element so the line can land on it. */
export function Wordmark({ id, className, href }: { id?: string; className?: string; href?: string }) {
  const cls = `wordmark${className ? ` ${className}` : ""}`;
  const word = (
    <>
      <span className="wm-a">second</span>
      <span className="wm-b">
        strong<span className="dot" aria-hidden="true" />
      </span>
    </>
  );
  if (href) {
    return (
      <a id={id} className={cls} href={href} aria-label="Second Strong home">
        {word}
      </a>
    );
  }
  return (
    <div id={id} className={cls} role="img" aria-label="Second Strong">
      {word}
    </div>
  );
}
