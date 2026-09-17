import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEMO_SCENARIOS, type SpillScenario } from '../data/demoScenarios';
import LiveAnalysisPanel from '../components/LiveAnalysisPanel';
import ShapChart from '../components/ShapChart';
import './Demo.css';

const PIPELINE_STEPS = ['SAR Ingest', 'U-Net Detect', 'XGBoost Filter', 'OpenDrift Model', 'AIS Correlate', 'SHAP Rank'];

// Simple canvas-based spill + drift + vessel map
function OceanMap({ scenario }: { scenario: SpillScenario }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tickRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Coordinate mapping
    const latMin = scenario.lat - 0.35, latMax = scenario.lat + 0.35;
    const lonMin = scenario.lon - 0.45, lonMax = scenario.lon + 0.45;

    const toX = (lon: number) => ((lon - lonMin) / (lonMax - lonMin)) * W;
    const toY = (lat: number) => ((latMax - lat) / (latMax - latMin)) * H;

    const draw = () => {
      tickRef.current++;
      ctx.clearRect(0, 0, W, H);

      // Ocean background
      ctx.fillStyle = '#050D1A';
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(0,212,255,0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Drift trajectory (from origin to spill)
      const ox = toX(scenario.driftOrigin.lon);
      const oy = toY(scenario.driftOrigin.lat);
      const sx = toX(scenario.lon);
      const sy = toY(scenario.lat);

      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      // Slight curve
      const mx = (ox + sx) / 2 + 20;
      const my = (oy + sy) / 2 - 15;
      ctx.quadraticCurveTo(mx, my, sx, sy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrow head at destination
      const angle = Math.atan2(sy - my, sx - mx);
      ctx.fillStyle = 'rgba(0,212,255,0.6)';
      ctx.beginPath();
      ctx.moveTo(sx + Math.cos(angle) * 8, sy + Math.sin(angle) * 8);
      ctx.lineTo(sx + Math.cos(angle + 2.4) * 5, sy + Math.sin(angle + 2.4) * 5);
      ctx.lineTo(sx + Math.cos(angle - 2.4) * 5, sy + Math.sin(angle - 2.4) * 5);
      ctx.closePath();
      ctx.fill();

      // Drift label
      ctx.font = '9px IBM Plex Mono';
      ctx.fillStyle = 'rgba(0,212,255,0.5)';
      ctx.fillText('BACKWARD DRIFT', ox - 30, oy - 10);

      // Oil spill polygon (animated expansion)
      const progress = Math.min(tickRef.current / 60, 1);
      const cx2 = toX(scenario.lon);
      const cy2 = toY(scenario.lat);
      const baseR = 28 * progress;

      // Spill blob (organic shape)
      ctx.save();
      ctx.translate(cx2, cy2);
      const t = tickRef.current * 0.02;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += 0.15) {
        const noise = 1 + 0.18 * Math.sin(a * 3 + t) + 0.1 * Math.sin(a * 5 - t * 0.7);
        const rr = baseR * noise;
        const px = Math.cos(a) * rr;
        const py = Math.sin(a) * rr * 0.65;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      const spillGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, baseR * 1.2);
      spillGrad.addColorStop(0, 'rgba(255,59,59,0.6)');
      spillGrad.addColorStop(0.6, 'rgba(180,20,20,0.3)');
      spillGrad.addColorStop(1, 'rgba(255,59,59,0)');
      ctx.fillStyle = spillGrad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,59,59,0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Spill label
      ctx.font = 'bold 9px IBM Plex Mono';
      ctx.fillStyle = 'rgba(255,100,100,0.9)';
      ctx.fillText('OIL SLICK', cx2 + 20, cy2 - 10);
      ctx.fillStyle = 'rgba(255,100,100,0.6)';
      ctx.fillText(`${scenario.areaKm2} km²`, cx2 + 20, cy2 + 3);

      // Spill origin marker
      ctx.beginPath();
      ctx.arc(ox, oy, 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,212,255,0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ox, oy, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#00D4FF';
      ctx.fill();
      ctx.font = '9px IBM Plex Mono';
      ctx.fillStyle = 'rgba(0,212,255,0.7)';
      ctx.fillText('ORIGIN ZONE', ox + 8, oy + 3);

      // Vessel tracks
      scenario.vessels.forEach((vessel, i) => {
        const vx = toX(vessel.lon);
        const vy = toY(vessel.lat);
        const colors = ['#FF3B3B', '#FF9F00', '#5A7A9A'];
        const color = colors[i];
        const rankLabels = ['#1', '#2', '#3'];

        // Vessel to origin connection (dashed)
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = i === 0 ? 'rgba(255,59,59,0.25)' : i === 1 ? 'rgba(255,159,0,0.2)' : 'rgba(90,122,154,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(vx, vy);
        ctx.lineTo(ox, oy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Vessel dot
        ctx.beginPath();
        ctx.arc(vx, vy, i === 0 ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = i === 0 ? 10 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Vessel icon (triangle for ship)
        const heading = (vessel.heading * Math.PI) / 180;
        ctx.save();
        ctx.translate(vx, vy);
        ctx.rotate(heading);
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(4, 5);
        ctx.lineTo(-4, 5);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();

        // Rank label
        ctx.font = 'bold 10px IBM Plex Mono';
        ctx.fillStyle = color;
        ctx.fillText(rankLabels[i], vx + 8, vy - 4);

        // Vessel name (abbreviated)
        ctx.font = '8px IBM Plex Mono';
        ctx.fillStyle = 'rgba(200,220,240,0.7)';
        const shortName = vessel.name.split(' ').slice(-2).join(' ');
        ctx.fillText(shortName, vx + 8, vy + 8);
      });

      // Pulse ring on spill
      const pulseR = 32 + Math.sin(tickRef.current * 0.05) * 6;
      ctx.beginPath();
      ctx.arc(cx2, cy2, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,59,59,${0.15 + 0.05 * Math.sin(tickRef.current * 0.05)})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [scenario]);

  return (
    <canvas
      ref={canvasRef}
      className="demo__map-canvas"
      style={{ width: '100%', height: '100%' }}
      aria-label={`Ocean map showing oil spill location and vessel tracks for ${scenario.name}`}
      role="img"
    />
  );
}

export default function Demo() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  const scenario = DEMO_SCENARIOS[scenarioIdx];

  const runPipeline = () => {
    clearAllTimers();
    setRunning(true);
    setDone(false);
    setStep(-1);
    setSelectedVessel(0);

    PIPELINE_STEPS.forEach((_, i) => {
      const tId = setTimeout(() => {
        setStep(i);
        if (i === PIPELINE_STEPS.length - 1) {
          const finalId = setTimeout(() => {
            setRunning(false);
            setDone(true);
          }, 700);
          timersRef.current.push(finalId);
        }
      }, i * 900 + 300);
      timersRef.current.push(tId);
    });
  };

  const reset = () => {
    clearAllTimers();
    setRunning(false);
    setStep(-1);
    setDone(false);
    setSelectedVessel(0);
  };

  const changeScenario = (idx: number) => {
    reset();
    setScenarioIdx(idx);
  };

  const vesselColors = ['var(--color-danger)', 'var(--color-amber)', 'var(--color-text-dim)'];

  return (
    <section className="demo section" id="demo">
      <div className="demo__bg" aria-hidden="true">
        <div className="demo__bg-glow" />
      </div>

      <div className="container">
        <div className="section-label">05 — Live Demo</div>
        <h2 className="heading-lg demo__headline">
          See ORYVEX in action.{' '}
          <span className="gradient-text">Select a scenario and run the pipeline.</span>
        </h2>
        <p className="demo__intro">
          Three real oil spill scenarios in Indian waters. All data is deterministic demo mode — production system
          connects to live NISAR/Sentinel-1 feeds.
        </p>

        <div className="demo__badge tag tag-amber" style={{ marginBottom: 'var(--space-8)', display: 'inline-flex' }}>
          ⚠ DEMO MODE — Sample Data
        </div>

        {/* Scenario selector */}
        <div className="demo__scenarios">
          {DEMO_SCENARIOS.map((s, i) => (
            <button
              key={s.id}
              className={`demo__scenario-btn ${scenarioIdx === i ? 'demo__scenario-btn--active' : ''}`}
              onClick={() => changeScenario(i)}
              aria-pressed={scenarioIdx === i}
            >
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{s.date}</div>
              <div style={{ fontWeight: 600, marginTop: 4 }}>{s.name}</div>
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>{s.location}</div>
            </button>
          ))}
        </div>

        {/* Main demo layout */}
        <div className="demo__layout">
          {/* Left: map + pipeline status */}
          <div className="demo__left">
            {/* Scenario info */}
            <div className="demo__info card">
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                <div className="demo__info-item">
                  <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>AREA</span>
                  <span className="font-mono text-danger" style={{ fontSize: 14, fontWeight: 700 }}>{scenario.areaKm2} km²</span>
                </div>
                <div className="demo__info-item">
                  <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>CONFIDENCE</span>
                  <span className="font-mono text-success" style={{ fontSize: 14, fontWeight: 700 }}>{scenario.confidence}%</span>
                </div>
                <div className="demo__info-item">
                  <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>SAR BAND</span>
                  <span className="font-mono text-primary" style={{ fontSize: 11 }}>{scenario.sarBand}</span>
                </div>
                <div className="demo__info-item">
                  <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>DETECTED</span>
                  <span className="font-mono" style={{ fontSize: 11 }}>{scenario.detectionTime}</span>
                </div>
              </div>

              {/* Run button */}
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                {!running && !done && (
                  <button className="btn btn-primary" onClick={runPipeline} style={{ fontSize: '0.85rem' }}>
                    ▶ Run Pipeline
                  </button>
                )}
                {running && (
                  <button className="btn btn-outline" disabled style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                    <span className="demo__spinner" aria-hidden="true" /> Processing...
                  </button>
                )}
                {done && (
                  <>
                    <button className="btn btn-primary" style={{ fontSize: '0.85rem', background: 'var(--color-success)', color: 'var(--color-bg-deep)' }} disabled>
                      ✓ Complete
                    </button>
                    <button className="btn btn-outline" onClick={reset} style={{ fontSize: '0.85rem' }}>
                      ↺ Reset
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Pipeline progress */}
            <div className="demo__progress card">
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 12, letterSpacing: '0.1em' }}>
                PIPELINE STATUS
              </div>
              {PIPELINE_STEPS.map((s, i) => {
                const state = i < step ? 'done' : i === step ? 'active' : 'waiting';
                return (
                  <div key={s} className={`demo__step demo__step--${state}`}>
                    <div className="demo__step-indicator">
                      {state === 'done' && <span style={{ color: 'var(--color-success)' }}>✓</span>}
                      {state === 'active' && <span className="demo__spinner-sm" aria-hidden="true" />}
                      {state === 'waiting' && <span style={{ color: 'var(--color-border)' }}>○</span>}
                    </div>
                    <span className="font-mono demo__step-label">{s}</span>
                    {state === 'done' && (
                      <span className="font-mono" style={{ fontSize: 9, color: 'var(--color-success)', marginLeft: 'auto' }}>DONE</span>
                    )}
                    {state === 'active' && (
                      <span className="font-mono" style={{ fontSize: 9, color: 'var(--color-primary)', marginLeft: 'auto' }}>RUNNING</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Ocean Map */}
            <div className="demo__map card">
              <div className="demo__map-header">
                <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
                  OCEAN MAP — {scenario.location.toUpperCase()}
                </span>
                <div className="demo__map-legend">
                  <span className="font-mono" style={{ fontSize: 9, color: 'var(--color-danger)' }}>● OIL SLICK</span>
                  <span className="font-mono" style={{ fontSize: 9, color: 'var(--color-primary)' }}>○ DRIFT ORIGIN</span>
                  <span className="font-mono" style={{ fontSize: 9, color: 'var(--color-amber)' }}>▲ VESSELS</span>
                </div>
              </div>
              <div className="demo__map-area">
                <OceanMap scenario={scenario} />
              </div>
            </div>
          </div>

          {/* Right: results */}
          <div className="demo__right">
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div
                  key="waiting"
                  className="demo__waiting card"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🛰️</div>
                    <div className="font-mono" style={{ fontSize: 12, color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>
                      {running ? 'PIPELINE RUNNING...' : 'RUN THE PIPELINE TO SEE RESULTS'}
                    </div>
                    {running && (
                      <div style={{ marginTop: 'var(--space-4)', color: 'var(--color-primary)', fontSize: '0.85rem' }}>
                        Processing: {PIPELINE_STEPS[Math.max(step, 0)]}
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
                >
                  {/* Detection result */}
                  <div className="card" style={{ borderColor: 'rgba(0,232,122,0.3)', background: 'rgba(0,232,122,0.02)' }}>
                    <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-success)', letterSpacing: '0.1em', marginBottom: 8 }}>
                      DETECTION RESULT
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
                      <div>
                        <div className="stat-number text-danger" style={{ fontSize: '2rem' }}>{scenario.areaKm2}</div>
                        <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>KM² SPILL AREA</div>
                      </div>
                      <div>
                        <div className="stat-number text-success" style={{ fontSize: '2rem' }}>{scenario.confidence}%</div>
                        <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>CONFIDENCE</div>
                      </div>
                      <div>
                        <div className="stat-number text-primary" style={{ fontSize: '2rem' }}>3</div>
                        <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>VESSELS RANKED</div>
                      </div>
                    </div>
                    <div className="tag tag-success" style={{ marginTop: 'var(--space-3)' }}>
                      ✓ FALSE POSITIVES FILTERED — CONFIRMED OIL SPILL
                    </div>
                  </div>

                  {/* Vessel ranking */}
                  <div className="card">
                    <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 12 }}>
                      VESSEL ATTRIBUTION RANKING
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {scenario.vessels.map((vessel, i) => (
                        <button
                          key={vessel.id}
                          className={`demo__vessel-row ${selectedVessel === i ? 'demo__vessel-row--active' : ''}`}
                          style={{ '--vessel-color': vesselColors[i] } as React.CSSProperties}
                          onClick={() => setSelectedVessel(i)}
                          aria-pressed={selectedVessel === i}
                        >
                          <div className="demo__vessel-rank" style={{ color: vesselColors[i] }}>
                            #{i + 1}
                          </div>
                          <div className="demo__vessel-info">
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text)' }}>
                              {vessel.name}
                            </div>
                            <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                              {vessel.type} · {vessel.flag} · MMSI {vessel.mmsi}
                            </div>
                          </div>
                          <div className="demo__vessel-prob" style={{ color: vesselColors[i] }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{vessel.probability}%</span>
                            <span className="font-mono" style={{ fontSize: 9, color: 'var(--color-text-muted)' }}>PROB</span>
                          </div>
                          <div className="demo__vessel-bar">
                            <motion.div
                              style={{ height: '100%', background: vesselColors[i], borderRadius: 2 }}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: vessel.probability / 100 }}
                              transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.2 }}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SHAP chart for selected vessel */}
                  <div className="card">
                    <div className="demo__shap-header">
                      <div>
                        <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
                          XAI EXPLANATION — {scenario.vessels[selectedVessel].name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: 4 }}>
                          Dist from origin: {scenario.vessels[selectedVessel].distanceFromOrigin} km ·
                          Near spill: {scenario.vessels[selectedVessel].timeNearSpill}
                        </div>
                      </div>
                      <span className="tag tag-primary">SHAP</span>
                    </div>
                    <ShapChart
                      shapValues={scenario.vessels[selectedVessel].shapValues}
                      color={vesselColors[selectedVessel].replace('var(--color-danger)', '#D6303B').replace('var(--color-amber)', '#B36B00').replace('var(--color-text-dim)', '#48607A')}
                    />
                  </div>

                  {/* Recommended action */}
                  <div className="card card-danger" style={{ borderColor: 'rgba(255,59,59,0.3)', background: 'rgba(255,59,59,0.04)' }}>
                    <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-danger)', letterSpacing: '0.1em', marginBottom: 8 }}>
                      RECOMMENDED ACTION
                    </div>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>
                      Alert Indian Coast Guard — Dispatch investigation to MMSI {scenario.vessels[0].mmsi}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', lineHeight: 1.6 }}>
                      Primary suspect <strong style={{ color: 'var(--color-text)' }}>{scenario.vessels[0].name}</strong> shows{' '}
                      {scenario.vessels[0].probability}% attribution probability based on drift trajectory correlation,
                      AIS position history, and vessel type weighting.
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      <span className="tag tag-danger">HIGH PRIORITY</span>
                      <span className="tag tag-primary">EVIDENCE REPORT GENERATED</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <LiveAnalysisPanel />
      </div>
    </section>
  );
}
