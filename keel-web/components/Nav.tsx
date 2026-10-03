'use client';

import { useState } from 'react';

const LINKS = [
  { href: '#coach', label: 'AI coach' },
  { href: '#doors', label: 'Programmes' },
  { href: '#how', label: 'How it works' },
  { href: '#features', label: 'The app' },
  { href: '#honest', label: "What we won't do" },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav" id="nav">
      <div className="nav-inner">
        <a className="wordmark" href="#top" aria-label="Keel home">
          keel<span className="dot" aria-hidden="true"></span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <a className="btn btn-primary btn-sm" href="#pricing">
            Take the quiz
          </a>
          <button
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      <div className="mobile-menu" id="mobile-menu" hidden={!open}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a className="btn btn-primary" href="#pricing" onClick={() => setOpen(false)}>
          Take the quiz
        </a>
      </div>
    </header>
  );
}
