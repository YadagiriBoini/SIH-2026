import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUpVariants } from '../utils/animations';
import './WhyOryvex.css';

const fadeUp = fadeUpVariants;

const COMPARISON = [
  {
    feature: 'Slick Detection',
    traditional: 'Manual analyst review of SAR imagery',
    oryvex: 'Automated U-Net pixel-level segmentation',
    traditionalBad: true,
  },
  {
    feature: 'Detection Time',
    traditional: '24–72 hours after satellite pass',
    oryvex: '< 30 minutes after satellite pass',
    traditionalBad: true,
  },
  {
    feature: 'False Positive Rate',
    traditional: 'High — algae, ship wakes, rain cells confused',
    oryvex: '< 9% — XGBoost classifier with 14 features',
    traditionalBad: true,
  },
  {
    feature: 'Drift Modelling',
    traditional: 'None — origin not computed',
    oryvex: 'OpenDrift/OpenOil backward Lagrangian simulation',
    traditionalBad: true,
  },
  {
    feature: 'Vessel Attribution',
    traditional: 'Manual AIS lookup — no automation',
    oryvex: 'Automated spatiotemporal AIS correlation',
    traditionalBad: true,
  },
  {
    feature: 'AI Explainability',
    traditional: 'None — black-box or no AI',
    oryvex: 'SHAP values — legally defensible evidence',
    traditionalBad: true,
  },
  {
    feature: 'Open Source',
    traditional: 'Proprietary tools, high licensing cost',
    oryvex: 'Built on OpenDrift, PyTorch, XGBoost, PostGIS',
    traditionalBad: true,
  },
  {
    feature: 'Coverage',
    traditional: 'Dependent on analyst availability',
    oryvex: 'Automated on every NISAR / Sentinel-1 pass',
    traditionalBad: true,
  },
];

const DIFFERENTIATORS = [
  {
    title: 'Backward Drift Ensemble',
    desc: '100 Lagrangian particle trajectories run backward in time using INCOIS ocean currents + ERA5 wind — not a single deterministic path.',
    icon: '🌊',
    color: '#0086A8',
  },
  {
    title: 'SHAP Explainability Layer',
    desc: 'Attribution decisions are not a black box. Every vessel ranking comes with a per-feature SHAP breakdown that courts and agencies can verify.',
    icon: '📊',
    color: '#0E8F5C',
  },
  {
    title: 'OpenOil Weathering Model',
    desc: 'Accounts for oil evaporation, emulsification, and spreading over time — critical for accurate backward trajectory computation.',
    icon: '⚗️',
    color: '#B36B00',
  },
  {
    title: 'End-to-End Automation',
    desc: 'No human in the loop required for detection or attribution. Analysts receive ranked results + evidence packages, not raw satellite data.',
    icon: '⚡',
    color: '#7C5CD6',
  },
];

export default function WhyOryvex() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section className="why section" id="why" ref={ref}>
      <div className="container">
        <motion.div className="section-label" variants={fadeUp} custom={0} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          08 — Why Oryvex?
        </motion.div>

        <motion.h2 className="heading-lg why__headline" variants={fadeUp} custom={1} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          Not another detection tool.{' '}
          <span className="gradient-text">A complete attribution chain.</span>
        </motion.h2>

        {/* Comparison table */}
        <motion.div className="why__table-wrap" variants={fadeUp} custom={2} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          <table className="why__table" aria-label="ORYVEX vs Traditional Approach comparison">
            <thead>
              <tr>
                <th className="why__th why__th--feature font-mono">CAPABILITY</th>
                <th className="why__th why__th--traditional font-mono">TRADITIONAL</th>
                <th className="why__th why__th--oryvex font-mono">ORYVEX</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <motion.tr
                  key={row.feature}
                  className="why__row"
                  variants={fadeUp}
                  custom={3 + i * 0.3}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                >
                  <td className="why__td why__td--feature font-mono">{row.feature}</td>
                  <td className="why__td why__td--traditional">
                    <span className="why__badge why__badge--bad">✗</span>
                    {row.traditional}
                  </td>
                  <td className="why__td why__td--oryvex">
                    <span className="why__badge why__badge--good">✓</span>
                    {row.oryvex}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Key differentiators */}
        <motion.div
          className="section-label"
          style={{ marginTop: 'var(--space-16)' }}
          variants={fadeUp} custom={12}
          initial="hidden" animate={isInView ? 'visible' : 'hidden'}
        >
          Technical Differentiators
        </motion.div>

        <div className="grid-4 why__diff">
          {DIFFERENTIATORS.map((d, i) => (
            <motion.div
              key={d.title}
              className="why__diff-card card"
              style={{ '--diff-color': d.color } as React.CSSProperties}
              variants={fadeUp}
              custom={13 + i}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <span className="why__diff-icon" role="img" aria-hidden="true">{d.icon}</span>
              <div className="why__diff-title" style={{ color: d.color }}>{d.title}</div>
              <p className="why__diff-desc">{d.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
