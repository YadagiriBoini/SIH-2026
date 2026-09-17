import axios from 'axios';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

export const apiClient = axios.create({ baseURL: API_BASE_URL });

export interface AnalyzeSpillParams {
  image: File;
  latitude: number;
  longitude: number;
  observationDate: string;
  observationTime: string;
  aisWindow: number;
}

export interface AnalyzePrediction {
  spill_detected: boolean;
  spill_pixels: number;
  total_pixels: number;
  spill_percentage: number;
  centroid_offset_x: number;
  centroid_offset_y: number;
  predicted_mask: string;
}

export interface AnalyzeSpillResponse {
  status: 'success' | 'error';
  message: string;
  input?: {
    filename: string;
    latitude: number;
    longitude: number;
    observation_date: string;
    observation_time: string;
    ais_window: number;
  };
  prediction?: AnalyzePrediction;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const { data } = await apiClient.get('/api/health');
    return data?.status === 'healthy';
  } catch {
    return false;
  }
}

export async function analyzeSpill(params: AnalyzeSpillParams): Promise<AnalyzeSpillResponse> {
  const formData = new FormData();
  formData.append('image', params.image);
  formData.append('latitude', String(params.latitude));
  formData.append('longitude', String(params.longitude));
  formData.append('observation_date', params.observationDate);
  formData.append('observation_time', params.observationTime);
  formData.append('ais_window', String(params.aisWindow));

  const { data } = await apiClient.post<AnalyzeSpillResponse>('/api/analyze', formData);
  return data;
}

export interface AttributedVessel {
  mmsi: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  speed: number;
  course: number;
  distance_km: number;
  attribution_score: number;
  shap_explanation: Record<string, number>;
}

export interface NearbyVesselsResponse {
  status: 'success' | 'error';
  message?: string;
  observation_location?: { latitude: number; longitude: number };
  radius_km?: number;
  vessel_count?: number;
  vessels?: AttributedVessel[];
  attribution?: { model: string; status: string };
  data_source?: string;
}

export async function getNearbyVessels(
  latitude: number,
  longitude: number,
  radiusKm: number
): Promise<NearbyVesselsResponse> {
  const formData = new FormData();
  formData.append('latitude', String(latitude));
  formData.append('longitude', String(longitude));
  formData.append('radius_km', String(radiusKm));

  const { data } = await apiClient.post<NearbyVesselsResponse>('/api/ais', formData);
  return data;
}
