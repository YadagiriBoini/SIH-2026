import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { PIPELINE_STAGES } from '../data/techStack';
import { fadeUpVariants } from '../utils/animations';
import './HowItWorks.css';

const fadeUp = fadeUpVariants;

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [activeStage, setActiveStage] = useState<string | null>(null);

  return (
    <section className="howitworks section" id="howitworks" ref={ref}>
      <div className="howitworks__bg" aria-hidden="true">
        <div className="howitworks__bg-lines" />
      </div>

      <div className="container">
        <motion.div className="section-label" variants={fadeUp} custom={0} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          04 — How It Works
        </motion.div>

        <motion.h2 className="heading-lg howitworks__headline" variants={fadeUp} custom={1} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          A five-stage AI pipeline,{' '}
          <span className="gradient-text">built for maritime intelligence.</span>
        </motion.h2>

        <motion.p className="howitworks__intro" variants={fadeUp} custom={2} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          Every stage is automated, validated, and explainable. Click any stage to explore the technology.
        </motion.p>

        {/* Pipeline visualization */}
        <div className="howitworks__pipeline">
          {PIPELINE_STAGES.map((stage, i) => (
            <motion.div
              key={stage.id}
              className="howitworks__stage-wrapper"
              variants={fadeUp}
              custom={3 + i}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              {/* Connector line */}
              {i < PIPELINE_STAGES.length - 1 && (
                <div className="howitworks__connector" aria-hidden="true">
                  <motion.div
                    className="howitworks__connector-fill"
                    style={{ background: `linear-gradient(to bottom, ${stage.color}, ${PIPELINE_STAGES[i+1].color})` }}
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ delay: 0.8 + i * 0.2, duration: 0.6, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="howitworks__connector-dot"
                    style={{ background: PIPELINE_STAGES[i+1].color }}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 1.2 + i * 0.2, duration: 0.3 }}
                  />
                </div>
              )}

              {/* Stage card */}
              <button
                className={`howitworks__stage card ${activeStage === stage.id ? 'howitworks__stage--active' : ''}`}
                style={{ '--stage-color': stage.color } as React.CSSProperties}
                onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
                aria-expanded={activeStage === stage.id}
                aria-label={`Stage ${stage.number}: ${stage.title}`}
              >
                <div className="howitworks__stage-header">
                  <div className="howitworks__stage-num font-mono" style={{ color: stage.color }}>
                    {stage.number}
                  </div>
                  <span className="howitworks__stage-icon" role="img" aria-hidden="true">{stage.icon}</span>
                </div>
                <div className="howitworks__stage-title">{stage.title}</div>
                <div className="howitworks__stage-subtitle font-mono">{stage.subtitle}</div>

                {/* Expand indicator */}
                <div className="howitworks__stage-expand" aria-hidden="true">
                  <span>{activeStage === stage.id ? '−' : '+'}</span>
                </div>

                {/* Output label */}
                <div className="howitworks__stage-output">
                  <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>OUTPUT</span>
                  <span className="font-mono" style={{ fontSize: 10, color: stage.color }}>→ {stage.outputLabel}</span>
                </div>
              </button>

              {/* Detail panel */}
              <AnimatePresence>
                {activeStage === stage.id && (
                  <motion.div
                    className="howitworks__detail"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <div className="howitworks__detail-inner" style={{ borderColor: stage.color + '44' }}>
                      <p style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 12 }}>
                        {stage.description}
                      </p>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {stage.tech.map((t) => (
                          <span key={t} className="tag tag-primary">{t}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Data flow annotation */}
        <motion.div
          className="howitworks__flow-note"
          variants={fadeUp} custom={9}
          initial="hidden" animate={isInView ? 'visible' : 'hidden'}
        >
          <div className="font-mono" style={{ fontSize: 11, color: 'var(--color-text-muted)', letterSpacing: '0.06em' }}>
            DATA FLOW: SATELLITE IMAGERY → AI INFERENCE → DRIFT MODEL → AIS CORRELATION → LEGAL ATTRIBUTION
          </div>
          <div className="howitworks__flow-bar">
            <motion.div
              className="howitworks__flow-fill"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ delay: 1.5, duration: 1.5, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
