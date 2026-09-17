import { motion } from 'framer-motion';

export interface ShapValue {
  feature: string;
  value: number;
}

interface ShapChartProps {
  shapValues: ShapValue[];
  color: string;
  title?: string;
  format?: (value: number) => string;
}

export default function ShapChart({
  shapValues,
  color,
  title = 'SHAP ATTRIBUTION FACTORS',
  format = (v) => `${(v * 100).toFixed(0)}%`,
}: ShapChartProps) {
  const maxAbs = Math.max(...shapValues.map((v) => Math.abs(v.value)), 1e-6);

  return (
    <div className="shap__chart">
      <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 8 }}>
        {title}
      </div>
      {shapValues.map((sv) => {
        const barColor = sv.value < 0 ? 'var(--color-text-muted)' : color;
        return (
          <div key={sv.feature} className="shap__row">
            <span className="shap__label font-mono">{sv.feature}</span>
            <div className="shap__bar-track">
              <motion.div
                className="shap__bar-fill"
                style={{ background: barColor }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: Math.abs(sv.value) / maxAbs }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <span className="shap__val font-mono" style={{ color: barColor }}>
              {format(sv.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
