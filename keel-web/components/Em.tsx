/**
 * Marks the emphasised phrase in a headline.
 *
 * Deliberately renders identical to the text around it — no serif, no italic,
 * no rule. The emphasis is carried entirely by the animation: SiteMotion wipes
 * these words in horizontally while every other word rises vertically, so the
 * phrase is distinguished by how it arrives rather than by looking different.
 *
 * Still a real <em>, so the emphasis survives for anyone not seeing the motion.
 */
export default function Em({ children }: { children: React.ReactNode }) {
  return <em className="em">{children}</em>;
}
