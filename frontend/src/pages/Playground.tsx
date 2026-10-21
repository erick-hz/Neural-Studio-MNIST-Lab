import { useState } from 'react'
import { DrawingCanvas } from '../components/DrawingCanvas'
import { PredictionResult } from '../components/PredictionResult'
import type { Prediction } from '../types'

export function Playground() {
  const [result, setResult] = useState<Prediction | null>(null)
  const [error, setError] = useState('')

  return (
    <div className="page-content">
      <header className="page-header">
        <div><span className="eyebrow">INTERACTIVE INFERENCE</span><h1>Prediction playground</h1><p>Draw a digit and inspect the network’s response, class by class.</p></div>
        <div className="model-status"><span className="status-dot" />POST /api/predict</div>
      </header>
      <div className="playground-grid">
        <DrawingCanvas onPrediction={setResult} onError={setError} />
        <PredictionResult result={result} error={error} />
      </div>
      <section className="inference-note"><span className="eyebrow">INFERENCE PIPELINE</span><p>Canvas pixels are cropped to the digit, scaled proportionally into a 20 × 20 box, centered on a 28 × 28 field, and normalized before the trained network returns ten class probabilities.</p></section>
    </div>
  )
}