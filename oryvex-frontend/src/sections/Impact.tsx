import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';
import { fadeUpVariants } from '../utils/animations';
import './Impact.css';

const fadeUp = fadeUpVariants;

interface ImpactStatProps {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sub: string;
  color: string;
  note: 'measured' | 'expected';
  start: boolean;
  decimals?: boolean;
}

function ImpactStat({ value, suffix, prefix = '', label, sub, color, note, start, decimals }: ImpactStatProps) {
  const count = useCountUp(value, 1800, start);
  return (
    <motion.div className="impact__stat card" whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
        <div className={`tag ${note === 'measured' ? 'tag-success' : 'tag-primary'}`} style={{ fontSize: 9 }}>
          {note === 'measured' ? '✓ MEASURED' : '◈ EXPECTED'}
        </div>
      </div>
      <div className="stat-number" style={{ color }}>
        {prefix}{decimals ? (count / 10).toFixed(1) : count.toLocaleString()}{suffix}
      </div>
      <div className="impact__stat-label">{label}</div>
      <div className="impact__stat-sub font-mono">{sub}</div>
    </motion.div>
  );
}

const USE_CASES = [
  {
    org: 'INCOIS',
    full: 'Indian National Centre for Ocean Information Services',
    desc: 'Integrates directly with INCOIS ocean current forecasting for drift model inputs.',
    icon: '🌊',
    color: '#0086A8',
  },
  {
    org: 'Indian Coast Guard',
    full: 'Maritime Enforcement Agency',
    desc: 'Provides actionable attribution reports with SHAP evidence for legal enforcement action.',
    icon: '🚨',
    color: '#D6303B',
  },
  {
    org: 'MoPNG',
    full: 'Ministry of Petroleum & Natural Gas',
    desc: 'Monitors offshore installation proximity incidents and platform leak attribution.',
    icon: '🛢️',
    color: '#B36B00',
  },
  {
    org: 'ISRO / NRSC',
    full: 'National Remote Sensing Centre',
    desc: 'Provides a downstream application layer for Bhoonidhi satellite data products.',
    icon: '🛰️',
    color: '#0E8F5C',
  },
];

export default function Impact() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section className="impact section" id="impact" ref={ref}>
      <div className="impact__bg" aria-hidden="true">
        <div className="impact__bg-left" />
        <div className="impact__bg-right" />
      </div>
      <div className="container">
        <motion.div className="section-label" variants={fadeUp} custom={0} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          07 — Impact
        </motion.div>
        <motion.h2 className="heading-lg impact__headline" variants={fadeUp} custom={1} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          Measurable outcomes.{' '}
          <span className="gradient-text">Defensible accountability.</span>
        </motion.h2>
        <motion.p className="impact__note font-mono" variants={fadeUp} custom={2} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          ✓ MEASURED = verified in testing &nbsp;|&nbsp; ◈ EXPECTED = projected at deployment scale
        </motion.p>

        {/* Stats grid */}
        <div className="grid-4 impact__stats">
          <motion.div variants={fadeUp} custom={3} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <ImpactStat value={87} suffix="%" label="U-Net Detection F1" sub="On held-out SAR test set" color="var(--color-success)" note="measured" start={isInView} />
          </motion.div>
          <motion.div variants={fadeUp} custom={4} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <ImpactStat value={91} suffix="%" label="XGBoost Filter Precision" sub="False positive rejection rate" color="var(--color-success)" note="measured" start={isInView} />
          </motion.div>
          <motion.div variants={fadeUp} custom={5} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <ImpactStat value={6} suffix="hrs" label="End-to-end latency" sub="Satellite pass → attribution" color="var(--color-primary)" note="expected" start={isInView} />
          </motion.div>
          <motion.div variants={fadeUp} custom={6} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <ImpactStat value={237} suffix="M km²" prefix="" label="Indian EEZ Coverage" sub="Full exclusive economic zone" color="var(--color-amber)" note="expected" start={isInView} />
          </motion.div>
        </div>

        {/* Coverage visual */}
        <motion.div className="impact__coverage" variants={fadeUp} custom={7} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          <div className="impact__coverage-inner card">
            <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 8 }}>
                  COVERAGE ZONES
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {[
                    { zone: 'Arabian Sea', length: '75%', color: '#0086A8' },
                    { zone: 'Bay of Bengal', length: '85%', color: '#0E8F5C' },
                    { zone: 'Andaman Sea', length: '60%', color: '#B36B00' },
                    { zone: 'Lakshadweep Sea', length: '50%', color: '#7C5CD6' },
                  ].map((z) => (
                    <div key={z.zone} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <span className="font-mono" style={{ fontSize: 11, width: 140, color: 'var(--color-text-dim)' }}>{z.zone}</span>
                      <div style={{ flex: 1, height: 6, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden' }}>
                        <motion.div
                          style={{ height: '100%', width: z.length, background: z.color, borderRadius: 3 }}
                          initial={{ scaleX: 0 }}
                          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                          transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="font-mono" style={{ fontSize: 11, color: z.color, width: 36, textAlign: 'right' }}>{z.length}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="impact__india-eez" aria-label="India EEZ outline">
                {/* Stylized India EEZ SVG outline */}
                <svg viewBox="0 0 200 220" width="180" height="200" fill="none">
                  <path
                    d="M80 10 L100 8 L115 20 L125 35 L130 55 L135 75 L125 95 L120 115 L125 130 L130 145 L120 160 L110 175 L100 190 L90 175 L80 160 L75 145 L70 130 L65 115 L60 100 L55 85 L60 65 L65 45 L70 28 Z"
                    stroke="rgba(0,212,255,0.4)"
                    strokeWidth="1.5"
                    fill="rgba(0,212,255,0.03)"
                    strokeDasharray="4 3"
                  />
                  {/* EEZ zone dashes */}
                  <path
                    d="M50 50 Q30 100 45 150 Q60 180 100 200 Q140 180 155 150 Q170 100 150 50"
                    stroke="rgba(0,212,255,0.15)"
                    strokeWidth="1"
                    fill="none"
                    strokeDasharray="6 4"
                  />
                  <text x="100" y="105" textAnchor="middle" fill="rgba(0,212,255,0.5)" fontSize="9" fontFamily="IBM Plex Mono">INDIA</text>
                  <text x="100" y="118" textAnchor="middle" fill="rgba(0,212,255,0.35)" fontSize="7" fontFamily="IBM Plex Mono">2.37M km²</text>
                  {/* Blip dots for incidents */}
                  {[
                    { cx: 68, cy: 80, color: '#D6303B' },
                    { cx: 125, cy: 95, color: '#B36B00' },
                    { cx: 140, cy: 140, color: '#D6303B' },
                    { cx: 55, cy: 130, color: '#B36B00' },
                  ].map((b, i) => (
                    <g key={i}>
                      <circle cx={b.cx} cy={b.cy} r="5" fill={b.color} opacity="0.2" />
                      <circle cx={b.cx} cy={b.cy} r="2" fill={b.color} opacity="0.8" />
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Use cases */}
        <motion.div className="section-label" style={{ marginTop: 'var(--space-16)' }} variants={fadeUp} custom={8} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          Stakeholder Impact
        </motion.div>
        <div className="grid-4 impact__usecases">
          {USE_CASES.map((uc, i) => (
            <motion.div
              key={uc.org}
              className="impact__usecase card"
              variants={fadeUp}
              custom={9 + i}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <span className="impact__usecase-icon" role="img" aria-hidden="true">{uc.icon}</span>
              <div className="impact__usecase-org" style={{ color: uc.color }}>{uc.org}</div>
              <div className="impact__usecase-full font-mono">{uc.full}</div>
              <p className="impact__usecase-desc">{uc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
