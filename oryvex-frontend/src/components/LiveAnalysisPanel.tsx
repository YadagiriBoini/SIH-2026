import { useEffect, useState } from 'react';
import { analyzeSpill, checkHealth, type AnalyzeSpillResponse } from '../services/api';
import './LiveAnalysisPanel.css';

type ApiStatus = 'checking' | 'online' | 'offline';

export default function LiveAnalysisPanel() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');
  const [file, setFile] = useState<File | null>(null);
  const [latitude, setLatitude] = useState('19.20');
  const [longitude, setLongitude] = useState('72.40');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [aisWindow, setAisWindow] = useState('24');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeSpillResponse | null>(null);

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

    try {
      const response = await analyzeSpill({
        image: file,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
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
  };

  return (
    <div className="live-analysis card" id="live-analysis">
      <div className="live-analysis__header">
        <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
          LIVE BACKEND ANALYSIS — REAL U-NET INFERENCE
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
        Upload a real SAR tile to run it through the actual U-Net model served by the FastAPI backend —
        no scripted data, an unrestricted live inference call.
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
    </div>
  );
}
