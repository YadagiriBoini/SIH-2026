import './LiveMap.css';

export interface LiveMapVessel {
  id: string;
  name: string;
  lat: number;
  lon: number;
  color: string;
  rank: number;
}

interface LiveMapProps {
  centerLat: number;
  centerLon: number;
  spillPercentage: number;
  vessels: LiveMapVessel[];
  driftOriginLat?: number;
  driftOriginLon?: number;
}

function toFraction(value: number, min: number, max: number) {
  if (max === min) return 0.5;
  return (value - min) / (max - min);
}

export default function LiveMap({
  centerLat,
  centerLon,
  spillPercentage,
  vessels,
  driftOriginLat,
  driftOriginLon,
}: LiveMapProps) {
  const hasDriftOrigin = driftOriginLat !== undefined && driftOriginLon !== undefined;

  const lats = [centerLat, ...vessels.map((v) => v.lat), ...(hasDriftOrigin ? [driftOriginLat!] : [])];
  const lons = [centerLon, ...vessels.map((v) => v.lon), ...(hasDriftOrigin ? [driftOriginLon!] : [])];

  const latSpan = Math.max(Math.max(...lats) - Math.min(...lats), 0.4);
  const lonSpan = Math.max(Math.max(...lons) - Math.min(...lons), 0.4);
  const pad = 0.3;

  const latMin = Math.min(...lats) - latSpan * pad;
  const latMax = Math.max(...lats) + latSpan * pad;
  const lonMin = Math.min(...lons) - lonSpan * pad;
  const lonMax = Math.max(...lons) + lonSpan * pad;

  const toPos = (lat: number, lon: number) => ({
    left: toFraction(lon, lonMin, lonMax) * 100,
    top: (1 - toFraction(lat, latMin, latMax)) * 100,
  });

  const spillPos = toPos(centerLat, centerLon);
  const spillSize = Math.max(18, Math.min(72, 18 + spillPercentage * 3));
  const originPos = hasDriftOrigin ? toPos(driftOriginLat!, driftOriginLon!) : null;

  return (
    <div className="live-map">
      <div className="live-map__grid" aria-hidden="true" />

      <div className="live-map__label live-map__label--tl font-mono">LAT {centerLat.toFixed(2)}°</div>
      <div className="live-map__label live-map__label--tr font-mono">LON {centerLon.toFixed(2)}°</div>

      {originPos && (
        <svg className="live-map__trajectory" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line
            x1={originPos.left}
            y1={originPos.top}
            x2={spillPos.left}
            y2={spillPos.top}
            stroke="rgba(0, 212, 255, 0.5)"
            strokeWidth="0.4"
            strokeDasharray="1.5 1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}

      {originPos && (
        <>
          <div
            className="live-map__origin"
            style={{ left: `${originPos.left}%`, top: `${originPos.top}%` }}
          />
          <div
            className="live-map__origin-caption font-mono"
            style={{ left: `${originPos.left}%`, top: `${originPos.top}%` }}
          >
            DRIFT ORIGIN (EST.)
          </div>
        </>
      )}

      <div
        className="live-map__spill"
        style={{ left: `${spillPos.left}%`, top: `${spillPos.top}%`, width: spillSize, height: spillSize }}
      >
        <span className="live-map__spill-pulse" />
      </div>
      <div className="live-map__spill-caption font-mono" style={{ left: `${spillPos.left}%`, top: `${spillPos.top}%` }}>
        SPILL · {spillPercentage}%
      </div>

      {vessels.map((v) => {
        const pos = toPos(v.lat, v.lon);
        return (
          <div
            key={v.id}
            className="live-map__vessel"
            style={{ left: `${pos.left}%`, top: `${pos.top}%`, borderColor: v.color, color: v.color }}
          >
            #{v.rank}
            <span className="live-map__vessel-name font-mono">{v.name}</span>
          </div>
        );
      })}

      {vessels.length === 0 && (
        <div className="live-map__empty font-mono">NO VESSELS IN RANGE</div>
      )}
    </div>
  );
}
