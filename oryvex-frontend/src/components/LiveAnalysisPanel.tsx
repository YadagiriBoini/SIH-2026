import { useEffect, useState } from 'react';
import {
  analyzeSpill,
  checkHealth,
  getNearbyVessels,
  type AnalyzeSpillResponse,
  type AttributedVessel,
} from '../services/api';
import ShapChart from './ShapChart';
import LiveMap from './LiveMap';
import './LiveAnalysisPanel.css';

type ApiStatus = 'checking' | 'online' | 'offline';

const VESSEL_COLORS = ['var(--color-danger)', 'var(--color-amber)', 'var(--color-primary)', 'var(--color-text-dim)'];
// Brighter variants for markers on the dark LiveMap panel, where the page's
// (light-mode) text colors would be too low-contrast to read.
const MAP_VESSEL_COLORS = ['#FF6B6B', '#FFB84D', '#4DD8FF', '#9AB4C9'];

const FEATURE_LABELS: Record<string, string> = {
  distance_km: 'Distance to spill (km)',
  speed: 'Speed (knots)',
  course: 'Course (deg)',
  is_tanker: 'Vessel type (tanker)',
};

export default function LiveAnalysisPanel() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');
  const [file, setFile] = useState<File | null>(null);
  const [latitude, setLatitude] = useState('17.60');
  const [longitude, setLongitude] = useState('78.60');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [aisWindow, setAisWindow] = useState('24');
  const [radiusKm, setRadiusKm] = useState('250');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeSpillResponse | null>(null);

  const [vessels, setVessels] = useState<AttributedVessel[]>([]);
  const [vesselDataSource, setVesselDataSource] = useState<string | null>(null);
  const [vesselError, setVesselError] = useState<string | null>(null);
  const [vesselsLoading, setVesselsLoading] = useState(false);
  const [selectedVesselIdx, setSelectedVesselIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    checkHealth().then((healthy) => {
      if (!cancelled) setApiStatus(healthy ? 'online' : 'offline');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Select a SAR image to analyze.');
      return;
    }
    if (!latitude || !longitude || !date || !time) {
      setError('Fill in latitude, longitude, date, and time.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setVessels([]);
    setVesselError(null);
    setSelectedVesselIdx(0);

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    try {
      const response = await analyzeSpill({
        image: file,
        latitude: lat,
        longitude: lon,
        observationDate: date,
        observationTime: time,
        aisWindow: Number(aisWindow),
      });

      if (response.status === 'success') {
        setResult(response);
      } else {
        setError(response.message || 'Analysis failed.');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? `Backend request failed: ${err.message}`
          : 'Backend request failed. Is the API running?'
      );
    } finally {
      setLoading(false);
    }

    setVesselsLoading(true);
    try {
      const aisResponse = await getNearbyVessels(lat, lon, Number(radiusKm));
      if (aisResponse.status === 'success') {
        setVessels(aisResponse.vessels ?? []);
        setVesselDataSource(aisResponse.data_source ?? null);
      } else {
        setVesselError(aisResponse.message || 'Vessel attribution failed.');
      }
    } catch (err) {
      setVesselError(
        err instanceof Error ? `Vessel lookup failed: ${err.message}` : 'Vessel lookup failed.'
      );
    } finally {
      setVesselsLoading(false);
    }
  };

  const selectedVessel = vessels[selectedVesselIdx];

  return (
    <div className="live-analysis card" id="live-analysis">
      <div className="live-analysis__header">
        <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
          LIVE BACKEND ANALYSIS — REAL U-NET + XGBOOST/SHAP INFERENCE
        </div>
        <div className="live-analysis__status">
          <span
            className="pulse-dot"
            style={{
              background:
                apiStatus === 'online'
                  ? 'var(--color-success, #00E87A)'
                  : apiStatus === 'offline'
                    ? 'var(--color-danger)'
                    : 'var(--color-text-muted)',
            }}
          />
          <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
            {apiStatus === 'checking' && 'CONNECTING...'}
            {apiStatus === 'online' && 'API ONLINE'}
            {apiStatus === 'offline' && 'API OFFLINE'}
          </span>
        </div>
      </div>

      <p className="live-analysis__intro">
        Upload a real SAR tile to run it through the actual U-Net model, then attribute nearby vessels with a
        real XGBoost classifier and explain the ranking with SHAP — no scripted data. The backend's AIS feed
        is demo data anchored near Hyderabad's coast (~17.5–18.1°N, 78.5–79.1°E); the default coordinates below
        are set there so vessel attribution has something to find.
      </p>

      <form className="live-analysis__form" onSubmit={handleSubmit}>
        <div className="live-analysis__field live-analysis__field--file">
          <label className="font-mono" htmlFor="live-analysis-file">SAR IMAGE</label>
          <input
            id="live-analysis-file"
            type="file"
            accept=".png,.jpg,.jpeg,.tif,.tiff"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {file && <span className="live-analysis__filename">{file.name}</span>}
        </div>

        <div className="live-analysis__field">
          <label className="font-mono" htmlFor="live-analysis-lat">LATITUDE</label>
          <input
            id="live-analysis-lat"
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </div>

        <div className="live-analysis__field">
          <label className="font-mono" htmlFor="live-analysis-lon">LONGITUDE</label>
          <input
            id="live-analysis-lon"
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>

        <div className="live-analysis__field">
          <label className="font-mono" htmlFor="live-analysis-date">OBSERVATION DATE</label>
          <input
            id="live-analysis-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="live-analysis__field">
          <label className="font-mono" htmlFor="live-analysis-time">OBSERVATION TIME</label>
          <input
            id="live-analysis-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="live-analysis__field">
          <label className="font-mono" htmlFor="live-analysis-ais">AIS WINDOW</label>
          <select
            id="live-analysis-ais"
            value={aisWindow}
            onChange={(e) => setAisWindow(e.target.value)}
          >
            <option value="12">12 hours</option>
            <option value="24">24 hours</option>
            <option value="48">48 hours</option>
            <option value="72">72 hours</option>
          </select>
        </div>

        <div className="live-analysis__field">
          <label className="font-mono" htmlFor="live-analysis-radius">VESSEL SEARCH RADIUS (KM)</label>
          <input
            id="live-analysis-radius"
            type="number"
            min="1"
            step="1"
            value={radiusKm}
            onChange={(e) => setRadiusKm(e.target.value)}
          />
        </div>

        <div className="live-analysis__submit">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="demo__spinner" aria-hidden="true" /> Analyzing...
              </>
            ) : (
              '▶ Run Live Analysis'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="tag tag-danger live-analysis__error">⚠ {error}</div>
      )}

      {result?.prediction && (
        <div className="live-analysis__result">
          <div className="live-analysis__result-stats">
            <div className="demo__info-item">
              <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>STATUS</span>
              <span
                className="font-mono"
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: result.prediction.spill_detected ? 'var(--color-danger)' : 'var(--color-success)',
                }}
              >
                {result.prediction.spill_detected ? 'SPILL DETECTED' : 'NO SPILL'}
              </span>
            </div>
            <div className="demo__info-item">
              <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>SPILL AREA</span>
              <span className="font-mono text-danger" style={{ fontSize: 14, fontWeight: 700 }}>
                {result.prediction.spill_percentage}%
              </span>
            </div>
            <div className="demo__info-item">
              <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>SPILL PIXELS</span>
              <span className="font-mono" style={{ fontSize: 14, fontWeight: 700 }}>
                {result.prediction.spill_pixels.toLocaleString()} / {result.prediction.total_pixels.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="live-analysis__mask">
            <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
              PREDICTED SEGMENTATION MASK
            </span>
            <img
              src={`data:image/png;base64,${result.prediction.predicted_mask}`}
              alt="Predicted oil spill segmentation mask"
            />
          </div>
        </div>
      )}

      {result?.prediction && (
        <div className="live-analysis__vessels">
          <div className="live-analysis__vessels-header">
            <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
              VESSEL ATTRIBUTION — LIVE XGBOOST + SHAP
            </span>
            {vesselDataSource === 'demo' && (
              <span className="tag tag-amber" style={{ fontSize: 9 }}>AIS POSITIONS: DEMO DATA</span>
            )}
          </div>

          <p className="live-analysis__empty-note" style={{ marginBottom: 'var(--space-4)' }}>
            The dashed line is a drift-origin estimate derived from where the spill mass sits within{' '}
            <em>this image's</em> predicted mask (its pixel centroid, offset from image center) — not a
            physics-based OpenDrift simulation. It will shift with the actual detection, not stay fixed.
          </p>

          {vesselsLoading && (
            <div className="live-analysis__vessels-loading font-mono">
              <span className="demo__spinner-sm" aria-hidden="true" /> Scoring nearby vessels...
            </div>
          )}

          {vesselError && (
            <div className="tag tag-danger live-analysis__error">⚠ {vesselError}</div>
          )}

          {!vesselsLoading && (
            <div className="live-analysis__vessels-grid">
              <LiveMap
                centerLat={parseFloat(latitude)}
                centerLon={parseFloat(longitude)}
                spillPercentage={result.prediction.spill_percentage}
                driftOriginLat={parseFloat(latitude) - result.prediction.centroid_offset_y * 0.12}
                driftOriginLon={parseFloat(longitude) + result.prediction.centroid_offset_x * 0.12}
                vessels={vessels.map((v, i) => ({
                  id: v.mmsi,
                  name: v.name,
                  lat: v.latitude,
                  lon: v.longitude,
                  color: MAP_VESSEL_COLORS[i % MAP_VESSEL_COLORS.length],
                  rank: i + 1,
                }))}
              />

              <div className="live-analysis__vessel-list">
                {vessels.length === 0 && !vesselError && (
                  <p className="live-analysis__empty-note">
                    No vessels found within {radiusKm} km. The backend's AIS feed is demo data anchored near
                    Hyderabad's coast — try a larger radius or a location close to it.
                  </p>
                )}
                {vessels.map((v, i) => (
                  <button
                    key={v.mmsi}
                    type="button"
                    className={`demo__vessel-row ${selectedVesselIdx === i ? 'demo__vessel-row--active' : ''}`}
                    style={{ '--vessel-color': VESSEL_COLORS[i % VESSEL_COLORS.length] } as React.CSSProperties}
                    onClick={() => setSelectedVesselIdx(i)}
                    aria-pressed={selectedVesselIdx === i}
                  >
                    <div className="demo__vessel-rank" style={{ color: VESSEL_COLORS[i % VESSEL_COLORS.length] }}>
                      #{i + 1}
                    </div>
                    <div className="demo__vessel-info">
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text)' }}>{v.name}</div>
                      <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                        {v.type} · MMSI {v.mmsi} · {v.distance_km.toFixed(1)} km away
                      </div>
                    </div>
                    <div className="demo__vessel-prob" style={{ color: VESSEL_COLORS[i % VESSEL_COLORS.length] }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                        {(v.attribution_score * 100).toFixed(0)}%
                      </span>
                      <span className="font-mono" style={{ fontSize: 9, color: 'var(--color-text-muted)' }}>PROB</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedVessel && (
            <div className="live-analysis__shap">
              <div style={{ marginBottom: 8 }}>
                <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
                  XAI EXPLANATION — {selectedVessel.name}
                </span>
              </div>
              <ShapChart
                title="SHAP FEATURE CONTRIBUTION (LOG-ODDS)"
                shapValues={Object.entries(selectedVessel.shap_explanation).map(([feature, value]) => ({
                  feature: FEATURE_LABELS[feature] ?? feature,
                  value,
                }))}
                color={VESSEL_COLORS[selectedVesselIdx % VESSEL_COLORS.length]}
                format={(v) => `${v >= 0 ? '+' : ''}${v.toFixed(3)}`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
