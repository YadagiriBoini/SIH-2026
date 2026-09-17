import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Problem', href: '#problem' },
  { label: 'Solution', href: '#solution' },
  { label: 'How It Works', href: '#howitworks' },
  { label: 'Technology', href: '#technology' },
  { label: 'Impact', href: '#impact' },
  { label: 'Demo', href: '#demo' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="navbar__inner">
        {/* Logo */}
        <a href="#top" className="navbar__logo" aria-label="ORYVEX Home">
          <span className="navbar__logo-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="#00D4FF" strokeWidth="1.5" />
              <circle cx="14" cy="14" r="8" stroke="#00D4FF" strokeWidth="1" opacity="0.5" />
              <circle cx="14" cy="14" r="3" fill="#00D4FF" />
              <line x1="14" y1="1" x2="14" y2="7" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="14" y1="21" x2="14" y2="27" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="1" y1="14" x2="7" y2="14" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="21" y1="14" x2="27" y2="14" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="navbar__logo-text">ORYVEX</span>
        </a>

        {/* Desktop nav */}
        <ul className="navbar__links" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="navbar__link animated-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a href="#demo" className="btn btn-primary navbar__cta">
          Live Demo →
        </a>

        {/* Mobile hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="navbar__mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="navbar__mobile-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#demo" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                  Live Demo →
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
