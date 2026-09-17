import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__top">
        <div className="container footer__top-inner">
          {/* Closing statement */}
          <div className="footer__statement">
            <div className="footer__radar-icon" aria-hidden="true">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="17" stroke="#00D4FF" strokeWidth="1.5" />
                <circle cx="18" cy="18" r="10" stroke="#00D4FF" strokeWidth="1" opacity="0.5" />
                <circle cx="18" cy="18" r="3.5" fill="#00D4FF" />
                <line x1="18" y1="1" x2="18" y2="8" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="18" y1="28" x2="18" y2="35" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="1" y1="18" x2="8" y2="18" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="28" y1="18" x2="35" y2="18" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="footer__headline">
              From Satellite<br />
              <span className="gradient-text">to Accountability.</span>
            </h2>
            <p className="footer__sub">
              ORYVEX connects space-based observation with legal attribution —
              giving India's maritime enforcement agencies the tools they need
              to hold polluters responsible.
            </p>
            <div className="footer__ctas">
              <a href="#demo" className="btn btn-primary">Explore Live System →</a>
              <a href="#howitworks" className="btn btn-outline">View Architecture</a>
            </div>
          </div>

          {/* Right: links + team */}
          <div className="footer__links-col">
            <div className="footer__link-group">
              <div className="footer__link-heading font-mono">Project</div>
              <a href="#problem" className="footer__link animated-link">The Problem</a>
              <a href="#solution" className="footer__link animated-link">Our Solution</a>
              <a href="#howitworks" className="footer__link animated-link">How It Works</a>
              <a href="#demo" className="footer__link animated-link">Live Demo</a>
            </div>
            <div className="footer__link-group">
              <div className="footer__link-heading font-mono">Technology</div>
              <a href="#technology" className="footer__link animated-link">AI Pipeline</a>
              <a href="#technology" className="footer__link animated-link">SAR Processing</a>
              <a href="#technology" className="footer__link animated-link">Drift Modelling</a>
              <a href="#technology" className="footer__link animated-link">SHAP Attribution</a>
            </div>
            <div className="footer__link-group">
              <div className="footer__link-heading font-mono">Resources</div>
              <a
                href="https://bhoonidhi.nrsc.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__link animated-link"
                aria-label="Bhoonidhi satellite data portal (opens in new tab)"
              >
                Bhoonidhi Portal ↗
              </a>
              <a
                href="https://science.nasa.gov/mission/nisar/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__link animated-link"
                aria-label="NASA NISAR mission (opens in new tab)"
              >
                NASA NISAR ↗
              </a>
              <a
                href="https://www.imo.org/en/ourwork/safety/pages/ais.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__link animated-link"
                aria-label="IMO AIS information (opens in new tab)"
              >
                IMO AIS ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <div className="footer__team">
            <span className="footer__logo-text">ORYVEX</span>
            <span className="font-mono footer__sep">·</span>
            <span className="font-mono" style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
              Smart India Hackathon 2026 · Team Oryvex · PS SIH26143
            </span>
          </div>
          <div className="footer__tags">
            <span className="tag tag-primary">Disaster Management</span>
            <span className="tag tag-primary">Maritime AI</span>
            <span className="tag tag-primary">SAR Remote Sensing</span>
          </div>
          <div className="footer__meta font-mono">
            <span style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>
              Theme: Disaster Management
            </span>
            <span className="footer__sep">·</span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>
              Software Category
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
