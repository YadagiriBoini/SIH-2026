import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';
import { fadeUpVariants } from '../utils/animations';
import './Problem.css';

const fadeUp = fadeUpVariants;

interface StatProps {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sub: string;
  color: string;
  start: boolean;
}

function AnimatedStat({ value, suffix, prefix = '', label, sub, color, start }: StatProps) {
  const count = useCountUp(value, 2200, start);
  return (
    <div className="problem__stat card">
      <div className="stat-number" style={{ color }}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="problem__stat-label">{label}</div>
      <div className="problem__stat-sub font-mono">{sub}</div>
    </div>
  );
}

const TIMELINE = [
  {
    phase: '01',
    title: 'Spill Occurs',
    desc: 'A vessel illegally discharges oil at sea — often at night or in remote waters beyond visual range.',
    color: '#FF3B3B',
    icon: '🛢️',
  },
  {
    phase: '02',
    title: 'Detection Delay',
    desc: 'Satellite imagery must be manually reviewed. Analysts take 24–72 hours — by then the slick has drifted far from origin.',
    color: '#FF9F00',
    icon: '⏱️',
  },
  {
    phase: '03',
    title: 'Attribution Gap',
    desc: 'Without automated drift modelling, correlating the spill back to a specific vessel is nearly impossible. Most cases go unprosecuted.',
    color: '#FF9F00',
    icon: '🚢',
  },
  {
    phase: '04',
    title: 'Ecological Damage',
    desc: 'Marine ecosystems, fisheries, and coastal communities suffer irreversible damage while authorities scramble for evidence.',
    color: '#FF3B3B',
    icon: '🐠',
  },
];

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section className="problem section" id="problem" ref={sectionRef}>
      {/* Background atmosphere */}
      <div className="problem__bg" aria-hidden="true">
        <div className="problem__bg-spill" />
      </div>

      <div className="container">
        <motion.div
          className="section-label"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          01 — The Problem
        </motion.div>

        <motion.h2
          className="heading-lg problem__headline"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          Ocean oil spills are{' '}
          <span className="gradient-text-danger">invisible, unprosecuted</span>
          <br />and growing in frequency.
        </motion.h2>

        <motion.p
          className="problem__intro"
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          Every year, millions of tonnes of oil enter the world's oceans through illegal discharges,
          accidents, and operational releases. India's 2.37 million km² Exclusive Economic Zone — one
          of the world's busiest maritime corridors — is critically exposed.
        </motion.p>

        {/* Stats */}
        <div className="problem__stats grid-3">
          <motion.div variants={fadeUp} custom={3} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <AnimatedStat
              value={11}
              suffix="M"
              label="Tonnes per year"
              sub="Oil entering oceans annually"
              color="var(--color-danger)"
              start={isInView}
            />
          </motion.div>
          <motion.div variants={fadeUp} custom={4} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <AnimatedStat
              value={72}
              suffix="hrs"
              label="Average detection delay"
              sub="Manual satellite review latency"
              color="var(--color-amber)"
              start={isInView}
            />
          </motion.div>
          <motion.div variants={fadeUp} custom={5} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
            <AnimatedStat
              value={95}
              suffix="%"
              label="Cases go unprosecuted"
              sub="Due to lack of vessel attribution"
              color="var(--color-danger)"
              start={isInView}
            />
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          className="problem__timeline"
          variants={fadeUp}
          custom={6}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className="problem__timeline-label font-mono section-label">The failure cascade</div>
          <div className="problem__timeline-track">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.phase}
                className="problem__timeline-item"
                variants={fadeUp}
                custom={7 + i}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
              >
                <div
                  className="problem__timeline-phase font-mono"
                  style={{ color: item.color, borderColor: item.color + '44' }}
                >
                  {item.phase}
                </div>
                <div className="problem__timeline-connector">
                  <div className="problem__timeline-dot" style={{ background: item.color }} />
                  {i < TIMELINE.length - 1 && (
                    <div className="problem__timeline-line" style={{ background: `linear-gradient(to right, ${item.color}44, ${TIMELINE[i+1].color}44)` }} />
                  )}
                </div>
                <div className="problem__timeline-body card card-danger">
                  <span className="problem__timeline-icon">{item.icon}</span>
                  <h3 className="heading-sm" style={{ color: item.color }}>{item.title}</h3>
                  <p style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem', lineHeight: 1.6, marginTop: 8 }}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* The gap statement */}
        <motion.div
          className="problem__gap"
          variants={fadeUp}
          custom={12}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className="problem__gap-inner">
            <span className="font-mono" style={{ fontSize: 11, color: 'var(--color-danger)', letterSpacing: '0.1em' }}>THE CRITICAL GAP</span>
            <h3 className="heading-md" style={{ marginTop: 12, color: 'var(--color-text)' }}>
              No automated system exists to connect a <span className="text-danger">detected oil slick</span> back to a{' '}
              <span className="text-amber">specific vessel</span> in Indian waters.
            </h3>
            <p style={{ color: 'var(--color-text-dim)', marginTop: 12, maxWidth: 640 }}>
              Manual processes, siloed data, and slow satellite interpretation mean that polluters
              escape accountability while India's coastal ecosystems pay the price.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
