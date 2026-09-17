import { motion } from 'framer-motion';
import RadarCanvas from '../components/RadarCanvas';
import { fadeUpVariants } from '../utils/animations';
import './Hero.css';

const fadeUp = fadeUpVariants;

export default function Hero() {
  return (
    <section className="hero" id="top" aria-label="ORYVEX — Satellite Oil Spill Detection">
      {/* Ocean background layers */}
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__bg-gradient" />
        <div className="hero__bg-grid" />
        <div className="hero__bg-vignette" />
        {/* Satellite orbit arc */}
        <svg className="hero__orbit" viewBox="0 0 800 400" fill="none" preserveAspectRatio="none">
          <ellipse
            cx="400" cy="200" rx="380" ry="160"
            stroke="rgba(0,212,255,0.12)"
            strokeWidth="1"
            strokeDasharray="4 8"
            fill="none"
          />
          <circle r="6" fill="#00D4FF">
            <animateMotion dur="12s" repeatCount="indefinite">
              <mpath href="#orbit-path" />
            </animateMotion>
          </circle>
          <ellipse id="orbit-path" cx="400" cy="200" rx="380" ry="160" fill="none" />
        </svg>
      </div>

      <div className="hero__content container">
        {/* Left column: text */}
        <div className="hero__text">
          <motion.div
            className="hero__badge"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span className="pulse-dot pulse-dot-primary" />
            <span className="font-mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--color-primary)' }}>
              SIH 2026 · DISASTER MANAGEMENT · PS SIH26143
            </span>
          </motion.div>

          <motion.h1
            className="hero__headline heading-xl"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            Detect.{' '}
            <span className="text-primary">Trace.</span>{' '}
            <span className="gradient-text-danger">Attribute.</span>
          </motion.h1>

          <motion.p
            className="hero__sub"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            An AI pipeline that analyzes <strong>NISAR SAR satellite imagery</strong> to detect
            ocean oil spills, models drift trajectories, and identifies the{' '}
            <strong>responsible vessel</strong> using AIS correlation and explainable AI.
          </motion.p>

          <motion.div
            className="hero__meta"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <div className="hero__meta-item">
              <span className="font-mono text-primary" style={{ fontSize: 11 }}>COVERAGE</span>
              <span>Indian EEZ · 2.37M km²</span>
            </div>
            <div className="hero__meta-sep" />
            <div className="hero__meta-item">
              <span className="font-mono text-primary" style={{ fontSize: 11 }}>SENSOR</span>
              <span>NISAR L-Band SAR</span>
            </div>
            <div className="hero__meta-sep" />
            <div className="hero__meta-item">
              <span className="font-mono text-primary" style={{ fontSize: 11 }}>MODEL</span>
              <span>U-Net + XGBoost + SHAP</span>
            </div>
          </motion.div>

          <motion.div
            className="hero__actions"
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <a href="#solution" className="btn btn-primary hero__btn-primary">
              Explore the System →
            </a>
            <a href="#demo" className="btn btn-outline">
              Live Demo
            </a>
          </motion.div>

          {/* Pipeline preview pills */}
          <motion.div
            className="hero__pipeline"
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {['SAR Ingest', 'U-Net Detect', 'XGBoost Filter', 'OpenDrift Trace', 'AIS Attribute'].map(
              (step, i) => (
                <div className="hero__pipeline-step" key={step}>
                  <span
                    className="hero__pipeline-pill"
                    style={{ '--delay': `${i * 0.4}s` } as React.CSSProperties}
                  >
                    {step}
                  </span>
                  {i < 4 && (
                    <span className="hero__pipeline-arrow" aria-hidden="true">→</span>
                  )}
                </div>
              )
            )}
          </motion.div>
        </div>

        {/* Right column: radar */}
        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <div className="hero__radar-container">
            <RadarCanvas className="hero__radar-canvas" />
            {/* Corner annotations */}
            <div className="hero__radar-label top-left">
              <span className="font-mono coord">LAT 19°12'N</span>
            </div>
            <div className="hero__radar-label top-right">
              <span className="font-mono coord">LON 72°24'E</span>
            </div>
            <div className="hero__radar-label bottom-left">
              <div className="pulse-dot" />
              <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-danger)' }}>OIL SLICK DETECTED</span>
            </div>
            <div className="hero__radar-label bottom-right">
              <span className="font-mono coord">RANGE 80 NM</span>
            </div>
            {/* Status bar */}
            <div className="hero__radar-status">
              <span className="pulse-dot pulse-dot-primary" style={{ width: 6, height: 6 }} />
              <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-primary)', letterSpacing: '0.1em' }}>
                SCANNING · NISAR PASS 04:23 UTC
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        aria-hidden="true"
      >
        <div className="hero__scroll-line" />
        <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
          SCROLL
        </span>
      </motion.div>
    </section>
  );
}
