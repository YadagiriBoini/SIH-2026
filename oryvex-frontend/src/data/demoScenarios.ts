// Demo scenarios with deterministic data
export interface Vessel {
  id: string;
  name: string;
  mmsi: string;
  flag: string;
  type: string;
  lat: number;
  lon: number;
  speed: number;
  heading: number;
  probability: number;
  shapValues: { feature: string; value: number }[];
  distanceFromOrigin: number;
  timeNearSpill: string;
}

export interface SpillScenario {
  id: string;
  name: string;
  date: string;
  location: string;
  lat: number;
  lon: number;
  areaKm2: number;
  confidence: number;
  sarBand: string;
  detectionTime: string;
  spill: { lat: number; lon: number }[];
  driftOrigin: { lat: number; lon: number };
  vessels: Vessel[];
}

export const DEMO_SCENARIOS: SpillScenario[] = [
  {
    id: 'mumbai-2024',
    name: 'Mumbai High Incident',
    date: '2024-11-14',
    location: 'Arabian Sea, Off Mumbai',
    lat: 19.2,
    lon: 72.4,
    areaKm2: 42.7,
    confidence: 94.2,
    sarBand: 'C-Band VV Polarization',
    detectionTime: '04:23 UTC',
    spill: [
      { lat: 19.21, lon: 72.38 },
      { lat: 19.24, lon: 72.41 },
      { lat: 19.20, lon: 72.44 },
      { lat: 19.17, lon: 72.42 },
      { lat: 19.18, lon: 72.39 },
    ],
    driftOrigin: { lat: 19.05, lon: 72.22 },
    vessels: [
      {
        id: 'v1',
        name: 'MV HIMALAYA TRADER',
        mmsi: '419002341',
        flag: 'India',
        type: 'Bulk Carrier',
        lat: 19.04,
        lon: 72.20,
        speed: 13.4,
        heading: 47,
        probability: 87.3,
        distanceFromOrigin: 3.2,
        timeNearSpill: '22:41 UTC (prev day)',
        shapValues: [
          { feature: 'Distance to origin', value: 0.34 },
          { feature: 'Time overlap', value: 0.28 },
          { feature: 'Vessel type (tanker)', value: 0.18 },
          { feature: 'Speed anomaly', value: 0.12 },
          { feature: 'AIS signal gap', value: 0.08 },
        ],
      },
      {
        id: 'v2',
        name: 'MT OCEAN EMPRESS',
        mmsi: '538007812',
        flag: 'Marshall Islands',
        type: 'Oil Tanker',
        lat: 19.08,
        lon: 72.28,
        speed: 0.2,
        heading: 0,
        probability: 67.1,
        distanceFromOrigin: 8.7,
        timeNearSpill: '20:15 UTC (prev day)',
        shapValues: [
          { feature: 'Distance to origin', value: 0.22 },
          { feature: 'Time overlap', value: 0.21 },
          { feature: 'Vessel type (tanker)', value: 0.30 },
          { feature: 'Speed anomaly', value: 0.16 },
          { feature: 'AIS signal gap', value: 0.11 },
        ],
      },
      {
        id: 'v3',
        name: 'MV GULF PIONEER',
        mmsi: '477124530',
        flag: 'Hong Kong',
        type: 'Chemical Tanker',
        lat: 18.98,
        lon: 72.31,
        speed: 11.2,
        heading: 312,
        probability: 41.8,
        distanceFromOrigin: 15.3,
        timeNearSpill: '19:52 UTC (prev day)',
        shapValues: [
          { feature: 'Distance to origin', value: 0.18 },
          { feature: 'Time overlap', value: 0.14 },
          { feature: 'Vessel type (tanker)', value: 0.25 },
          { feature: 'Speed anomaly', value: 0.29 },
          { feature: 'AIS signal gap', value: 0.14 },
        ],
      },
    ],
  },
  {
    id: 'chennai-2024',
    name: 'Bay of Bengal Slick',
    date: '2024-09-07',
    location: 'Bay of Bengal, Off Chennai',
    lat: 13.1,
    lon: 81.2,
    areaKm2: 18.3,
    confidence: 88.6,
    sarBand: 'L-Band HH Polarization (NISAR)',
    detectionTime: '01:17 UTC',
    spill: [
      { lat: 13.11, lon: 81.19 },
      { lat: 13.13, lon: 81.22 },
      { lat: 13.10, lon: 81.24 },
      { lat: 13.08, lon: 81.21 },
      { lat: 13.09, lon: 81.18 },
    ],
    driftOrigin: { lat: 13.02, lon: 81.08 },
    vessels: [
      {
        id: 'v1',
        name: 'MT INDRANI',
        mmsi: '419003890',
        flag: 'India',
        type: 'Oil Tanker',
        lat: 13.01,
        lon: 81.06,
        speed: 0.8,
        heading: 180,
        probability: 91.4,
        distanceFromOrigin: 2.1,
        timeNearSpill: '21:30 UTC (prev day)',
        shapValues: [
          { feature: 'Distance to origin', value: 0.42 },
          { feature: 'Time overlap', value: 0.25 },
          { feature: 'Vessel type (tanker)', value: 0.15 },
          { feature: 'Speed anomaly', value: 0.11 },
          { feature: 'AIS signal gap', value: 0.07 },
        ],
      },
      {
        id: 'v2',
        name: 'MV SINGAPORE SPIRIT',
        mmsi: '563109241',
        flag: 'Singapore',
        type: 'Crude Carrier',
        lat: 13.06,
        lon: 81.12,
        speed: 14.1,
        heading: 95,
        probability: 58.7,
        distanceFromOrigin: 7.4,
        timeNearSpill: '19:44 UTC (prev day)',
        shapValues: [
          { feature: 'Distance to origin', value: 0.19 },
          { feature: 'Time overlap', value: 0.22 },
          { feature: 'Vessel type (tanker)', value: 0.28 },
          { feature: 'Speed anomaly', value: 0.18 },
          { feature: 'AIS signal gap', value: 0.13 },
        ],
      },
      {
        id: 'v3',
        name: 'MT DHAULAGIRI',
        mmsi: '419006231',
        flag: 'India',
        type: 'Product Tanker',
        lat: 12.95,
        lon: 81.14,
        speed: 9.3,
        heading: 72,
        probability: 34.2,
        distanceFromOrigin: 18.6,
        timeNearSpill: '18:12 UTC (prev day)',
        shapValues: [
          { feature: 'Distance to origin', value: 0.14 },
          { feature: 'Time overlap', value: 0.10 },
          { feature: 'Vessel type (tanker)', value: 0.26 },
          { feature: 'Speed anomaly', value: 0.32 },
          { feature: 'AIS signal gap', value: 0.18 },
        ],
      },
    ],
  },
  {
    id: 'andaman-2024',
    name: 'Andaman Sea Spill',
    date: '2024-12-02',
    location: 'Andaman Sea, Near Port Blair',
    lat: 11.7,
    lon: 92.5,
    areaKm2: 61.4,
    confidence: 96.8,
    sarBand: 'L-Band VV Polarization (NISAR)',
    detectionTime: '07:44 UTC',
    spill: [
      { lat: 11.71, lon: 92.48 },
      { lat: 11.75, lon: 92.52 },
      { lat: 11.72, lon: 92.56 },
      { lat: 11.68, lon: 92.54 },
      { lat: 11.66, lon: 92.50 },
      { lat: 11.68, lon: 92.46 },
    ],
    driftOrigin: { lat: 11.60, lon: 92.38 },
    vessels: [
      {
        id: 'v1',
        name: 'MV ANDAMAN CHIEF',
        mmsi: '419007124',
        flag: 'India',
        type: 'Ro-Ro Vessel',
        lat: 11.59,
        lon: 92.36,
        speed: 2.1,
        heading: 210,
        probability: 76.9,
        distanceFromOrigin: 2.8,
        timeNearSpill: '01:20 UTC',
        shapValues: [
          { feature: 'Distance to origin', value: 0.31 },
          { feature: 'Time overlap', value: 0.30 },
          { feature: 'Vessel type (tanker)', value: 0.12 },
          { feature: 'Speed anomaly', value: 0.19 },
          { feature: 'AIS signal gap', value: 0.08 },
        ],
      },
      {
        id: 'v2',
        name: 'MT CEYLON MARINER',
        mmsi: '417200341',
        flag: 'Sri Lanka',
        type: 'Oil Tanker',
        lat: 11.63,
        lon: 92.42,
        speed: 6.4,
        heading: 330,
        probability: 62.3,
        distanceFromOrigin: 5.9,
        timeNearSpill: '23:50 UTC (prev day)',
        shapValues: [
          { feature: 'Distance to origin', value: 0.24 },
          { feature: 'Time overlap', value: 0.18 },
          { feature: 'Vessel type (tanker)', value: 0.27 },
          { feature: 'Speed anomaly', value: 0.20 },
          { feature: 'AIS signal gap', value: 0.11 },
        ],
      },
      {
        id: 'v3',
        name: 'MV STRAIT EXPLORER',
        mmsi: '525012847',
        flag: 'Indonesia',
        type: 'General Cargo',
        lat: 11.56,
        lon: 92.46,
        speed: 11.8,
        heading: 48,
        probability: 29.5,
        distanceFromOrigin: 22.1,
        timeNearSpill: '21:03 UTC (prev day)',
        shapValues: [
          { feature: 'Distance to origin', value: 0.11 },
          { feature: 'Time overlap', value: 0.13 },
          { feature: 'Vessel type (tanker)', value: 0.18 },
          { feature: 'Speed anomaly', value: 0.35 },
          { feature: 'AIS signal gap', value: 0.23 },
        ],
      },
    ],
  },
];
