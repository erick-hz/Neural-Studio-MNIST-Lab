import axios from 'axios'
import type {
  DatasetSample,
  ModelInfo,
  Prediction,
  TrainingMetrics,
} from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
})

export async function fetchMetrics() {
  const response = await api.get<TrainingMetrics>('/metrics')
  return response.data
}

export async function fetchModelInfo() {
  const response = await api.get<ModelInfo>('/model')
  return response.data
}

export async function fetchSamples(limit = 12) {
  const response = await api.get<{ samples: DatasetSample[]; source: string }>(
    '/dataset/samples',
    {
      params: { limit },
    },
  )
  return response.data
}

export async function predictDrawing(blob: Blob) {
  const body = new FormData()
  body.append('image', blob, 'drawing.png')
  const response = await api.post<Prediction>('/predict', body)
  return response.data
}

export function getApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.detail ||
      'Could not reach the API. Check that the backend is running.'
    )
  }
  return error instanceof Error
    ? error.message
    : 'An unexpected error occurred.'
}
