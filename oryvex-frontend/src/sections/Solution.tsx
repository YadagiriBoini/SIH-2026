import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUpVariants } from '../utils/animations';
import './Solution.css';

const fadeUp = fadeUpVariants;

const BEFORE = [
  'Analyst manually scans satellite imagery',
  'Slick identified 24–72 hrs after occurrence',
  'No false-positive filter — high error rate',
  'Ocean drift not modelled',
  'AIS data not correlated',
  'No vessel attribution possible',
];

const AFTER = [
  'NISAR SAR auto-ingested on every pass',
  'U-Net detects slick in < 30 minutes',
  'XGBoost filters lookalikes with 91% precision',
  'OpenDrift backward models spill origin',
  'AIS spatiotemporal correlation automated',
  'Top-3 vessels ranked with SHAP explainability',
];

export default function Solution() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="solution section" id="solution" ref={ref}>
      <div className="solution__bg" aria-hidden="true">
        <div className="solution__bg-glow" />
      </div>

      <div className="container">
        <motion.div
          className="section-label"
          variants={fadeUp} custom={0}
          initial="hidden" animate={isInView ? 'visible' : 'hidden'}
        >
          02 — The Solution
        </motion.div>

        <motion.h2
          className="heading-lg solution__headline"
          variants={fadeUp} custom={1}
          initial="hidden" animate={isInView ? 'visible' : 'hidden'}
        >
          From <span className="text-danger">manual uncertainty</span> to{' '}
          <span className="gradient-text">automated attribution.</span>
        </motion.h2>

        <motion.p
          className="solution__intro"
          variants={fadeUp} custom={2}
          initial="hidden" animate={isInView ? 'visible' : 'hidden'}
        >
          ORYVEX is a full-stack AI pipeline that transforms the entire oil spill response
          workflow — from satellite ingestion to vessel accountability — in under 6 hours.
        </motion.p>

        {/* Before / After comparison */}
        <div className="solution__compare">
          {/* BEFORE */}
          <motion.div
            className="solution__col solution__col--before card card-danger"
            variants={fadeUp} custom={3}
            initial="hidden" animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="solution__col-header">
              <span className="tag tag-danger">Before ORYVEX</span>
              <h3 className="heading-sm" style={{ marginTop: 12, color: 'var(--color-text-dim)' }}>
                Traditional Approach
              </h3>
            </div>
            <ul className="solution__list">
              {BEFORE.map((item, i) => (
                <motion.li
                  key={i}
                  className="solution__list-item solution__list-item--bad"
                  variants={fadeUp} custom={4 + i * 0.5}
                  initial="hidden" animate={isInView ? 'visible' : 'hidden'}
                >
                  <span className="solution__check solution__check--bad" aria-hidden="true">✗</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Arrow */}
          <motion.div
            className="solution__arrow"
            variants={fadeUp} custom={4}
            initial="hidden" animate={isInView ? 'visible' : 'hidden'}
            aria-hidden="true"
          >
            <div className="solution__arrow-line" />
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="solution__arrow-icon">
              <circle cx="20" cy="20" r="19" stroke="#00D4FF" strokeWidth="1.5" />
              <path d="M14 20h12M21 15l6 5-6 5" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="solution__arrow-line" />
            <span className="font-mono solution__arrow-label">ORYVEX</span>
          </motion.div>

          {/* AFTER */}
          <motion.div
            className="solution__col solution__col--after card"
            variants={fadeUp} custom={5}
            initial="hidden" animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="solution__col-header">
              <span className="tag tag-success">With ORYVEX</span>
              <h3 className="heading-sm" style={{ marginTop: 12, color: 'var(--color-text)' }}>
                AI-Powered Pipeline
              </h3>
            </div>
            <ul className="solution__list">
              {AFTER.map((item, i) => (
                <motion.li
                  key={i}
                  className="solution__list-item solution__list-item--good"
                  variants={fadeUp} custom={6 + i * 0.5}
                  initial="hidden" animate={isInView ? 'visible' : 'hidden'}
                >
                  <span className="solution__check solution__check--good" aria-hidden="true">✓</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* The insight callout */}
        <motion.div
          className="solution__insight"
          variants={fadeUp} custom={10}
          initial="hidden" animate={isInView ? 'visible' : 'hidden'}
        >
          <div className="solution__insight-inner">
            <div className="font-mono section-label" style={{ marginBottom: 12 }}>The Core Insight</div>
            <blockquote className="heading-md solution__quote">
              "An oil slick's shape, texture, and drift pattern contains enough information —
              when combined with AIS vessel history — to identify the responsible ship
              with statistically defensible confidence."
            </blockquote>
            <div className="solution__insight-tech">
              <span className="tag tag-primary">U-Net Segmentation</span>
              <span className="tag tag-primary">XGBoost Classification</span>
              <span className="tag tag-primary">Lagrangian Drift</span>
              <span className="tag tag-primary">SHAP Attribution</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
