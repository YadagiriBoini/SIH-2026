import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TECH_STACK } from '../data/techStack';
import { fadeUpVariants } from '../utils/animations';
import './Technology.css';

const fadeUp = fadeUpVariants;

export default function Technology() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section className="technology section" id="technology" ref={ref}>
      <div className="container">
        <motion.div className="section-label" variants={fadeUp} custom={0} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          06 — Technology
        </motion.div>

        <motion.h2 className="heading-lg technology__headline" variants={fadeUp} custom={1} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          Purpose-built on{' '}
          <span className="gradient-text">proven maritime and AI infrastructure.</span>
        </motion.h2>

        <motion.p className="technology__intro" variants={fadeUp} custom={2} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          Every technology is chosen for a reason. Open-source where possible, scalable by design.
        </motion.p>

        {/* Architecture diagram */}
        <motion.div className="technology__arch" variants={fadeUp} custom={3} initial="hidden" animate={isInView ? 'visible' : 'hidden'} aria-label="System architecture diagram">
          {['NISAR/Sentinel-1 SAR', 'Bhoonidhi / Copernicus API', 'U-Net + XGBoost (PyTorch)', 'OpenDrift / OpenOil', 'AIS Data + PostGIS', 'FastAPI Python Backend', 'React + TypeScript Frontend'].map((node, i) => (
            <div key={node} className="technology__arch-row">
              <div className="technology__arch-node" style={{ '--node-idx': i } as React.CSSProperties}>
                <span className="font-mono" style={{ fontSize: 11 }}>{node}</span>
              </div>
              {i < 6 && (
                <div className="technology__arch-arrow" aria-hidden="true">
                  <motion.div
                    className="technology__arch-arrow-line"
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                  />
                  <span className="technology__arch-arrow-head" aria-hidden="true">↓</span>
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Tech cards by layer */}
        <div className="technology__layers">
          {TECH_STACK.map((layer, li) => (
            <motion.div
              key={layer.layer}
              className="technology__layer"
              variants={fadeUp}
              custom={4 + li}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <div className="technology__layer-label font-mono">{layer.layer}</div>
              <div className="technology__layer-items">
                {layer.items.map((item, ii) => (
                  <motion.div
                    key={item.name}
                    className="technology__item card"
                    style={{ '--item-color': item.color } as React.CSSProperties}
                    variants={fadeUp}
                    custom={5 + li + ii * 0.5}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <div className="technology__item-header">
                      <span className="technology__item-logo" role="img" aria-hidden="true">{item.logo}</span>
                      <span className="tag" style={{ color: item.color, borderColor: item.color + '44', background: item.color + '0D', fontSize: 9 }}>
                        {item.badge}
                      </span>
                    </div>
                    <div className="technology__item-name" style={{ color: item.color }}>{item.name}</div>
                    <div className="technology__item-desc">{item.description}</div>
                    <div className="technology__item-why">
                      <span className="font-mono" style={{ fontSize: 9, color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>WHY →</span>
                      <span className="technology__item-why-text">{item.why}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
