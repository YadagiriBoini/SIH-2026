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
