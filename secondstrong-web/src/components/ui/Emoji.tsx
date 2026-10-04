import type { EmojiName } from "@/content/site";

/** One stroke emoji from the launch film, drawn in currentColor. Needs <EmojiSprite /> on the page. */
export function Emoji({ name, className }: { name: EmojiName; className?: string }) {
  return (
    <svg className={`emo${className ? ` ${className}` : ""}`} aria-hidden="true">
      <use href={`#e-${name}`} />
    </svg>
  );
}

/** The symbol sheet every <Emoji /> references. Render once, near the top of the page. */
export function EmojiSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <circle id="fc" cx="50" cy="52" r="40" fill="none" stroke="currentColor" strokeWidth="5" />
      </defs>
      <symbol id="e-puzzled" viewBox="0 0 100 100">
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
          <use href="#fc" /><path d="M28 34 Q36 26 45 32" /><path d="M57 38 L71 37" /><path d="M38 71 Q44 65 50 71 T63 70" /><path d="M84 8 Q95 6 94 15 Q93 20 87 21 L87 26" />
        </g>
        <circle cx="38" cy="47" r="4.5" fill="currentColor" /><circle cx="63" cy="48" r="4.5" fill="currentColor" /><circle cx="87" cy="33" r="3" fill="currentColor" />
      </symbol>
      <symbol id="e-meh" viewBox="0 0 100 100">
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
          <use href="#fc" /><path d="M29 47 H47" /><path d="M54 47 H72" /><path d="M38 70 H62" />
        </g>
        <circle cx="40" cy="42" r="4" fill="currentColor" /><circle cx="65" cy="42" r="4" fill="currentColor" />
      </symbol>
      <symbol id="e-wow" viewBox="0 0 100 100">
        <g fill="none" stroke="currentColor" strokeWidth="5">
          <use href="#fc" /><circle cx="37" cy="45" r="7" /><circle cx="63" cy="45" r="7" /><ellipse cx="50" cy="71" rx="7" ry="9" />
        </g>
        <circle cx="38" cy="46" r="3" fill="currentColor" /><circle cx="64" cy="46" r="3" fill="currentColor" />
      </symbol>
      <symbol id="e-sleepy" viewBox="0 0 100 100">
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <use href="#fc" /><path d="M29 49 Q37 56 45 49" /><path d="M55 49 Q63 56 71 49" /><circle cx="50" cy="70" r="5" /><path d="M74 6 H86 L74 18 H86" />
        </g>
      </symbol>
      <symbol id="e-tired" viewBox="0 0 100 100">
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <use href="#fc" /><path d="M29 43 L44 36" /><path d="M71 43 L56 36" /><path d="M35 71 Q42 64 50 71 Q58 78 65 71" /><path d="M86 16 Q94 29 86 34 Q78 29 86 16Z" />
        </g>
        <circle cx="38" cy="50" r="4.5" fill="currentColor" /><circle cx="62" cy="50" r="4.5" fill="currentColor" />
      </symbol>
      <symbol id="e-dizzy" viewBox="0 0 100 100">
        <g fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
          <use href="#fc" /><path d="M38 48 m-8 0 a8 8 0 1 1 8 8 a5 5 0 1 1 4 -5" /><path d="M63 48 m-8 0 a8 8 0 1 1 8 8 a5 5 0 1 1 4 -5" /><path d="M37 72 Q43 67 50 72 Q57 77 63 72" />
        </g>
      </symbol>
      <symbol id="e-yum" viewBox="0 0 100 100">
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <use href="#fc" /><path d="M29 51 Q37 41 45 51" /><path d="M55 51 Q63 41 71 51" /><path d="M33 62 Q50 80 67 62" /><path d="M52 70 Q57 84 65 68" />
        </g>
      </symbol>
      <symbol id="e-happy" viewBox="0 0 100 100">
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
          <use href="#fc" /><path d="M30 50 Q38 41 46 50" /><path d="M54 50 Q62 41 70 50" /><path d="M38 64 Q50 76 62 64" />
        </g>
      </symbol>
      <symbol id="e-proud" viewBox="0 0 100 100">
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
          <use href="#fc" /><path d="M30 49 Q38 41 46 49" /><path d="M34 62 Q50 80 66 62" />
        </g>
        <circle cx="62" cy="47" r="4.5" fill="currentColor" />
      </symbol>
      <symbol id="e-love" viewBox="0 0 100 100">
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round">
          <use href="#fc" /><path d="M33 62 Q50 84 67 62 Z" />
        </g>
        <path
          d="M26 42 C26 34 36 32 38 39 C40 32 50 34 50 42 C50 50 38 56 38 58 C38 56 26 50 26 42Z M50 42 C50 34 60 32 62 39 C64 32 74 34 74 42 C74 50 62 56 62 58 C62 56 50 50 50 42Z"
          fill="#C2714F" stroke="currentColor" strokeWidth="3"
        />
      </symbol>
    </svg>
  );
}
