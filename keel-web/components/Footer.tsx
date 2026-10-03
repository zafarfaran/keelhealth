export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <span className="wordmark">
            keel<span className="dot" aria-hidden="true"></span>
          </span>
          <p className="legal">Keel Health Ltd · keelhealth.com</p>
          <p className="legal">
            Keel is a coaching app, not a medical service. It never diagnoses. Speak to
            your GP before starting a new programme if you have a health condition.
          </p>
        </div>
        <div className="footer-links">
          <a href="#doors">Programmes</a>
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}
