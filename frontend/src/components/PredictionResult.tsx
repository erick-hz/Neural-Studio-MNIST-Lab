import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Prediction } from '../types'

interface PredictionResultProps {
  result: Prediction | null
  error: string
}

export function PredictionResult({ result, error }: PredictionResultProps) {
  const probabilities = result?.probabilities.map((probability, digit) => ({
    digit: String(digit),
    probability: probability * 100,
    predicted: digit === result.prediction,
  })) ?? []

  return (
    <section className="panel prediction-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">INFERENCE</span><h2>Model response</h2></div>
        <span className={`status-dot ${error ? 'status-error' : result ? 'status-ready' : ''}`} />
      </div>
      {error ? (
        <div className="error-state" role="alert"><strong>Prediction unavailable</strong><p>{error}</p></div>
      ) : result ? (
        <>
          <div className="prediction-readout">
            <span className="predicted-digit">{result.prediction}</span>
            <div><span className="eyebrow">PREDICTED DIGIT</span><strong>{(result.confidence * 100).toFixed(1)}%</strong><span className="muted">confidence</span></div>
          </div>
          <div className="chart-title"><span>Class probabilities</span><span>0–100%</span></div>
          <div className="probability-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={probabilities} margin={{ top: 4, right: 8, bottom: 0, left: -22 }}>
                <CartesianGrid vertical={false} stroke="#29302b" />
                <XAxis dataKey="digit" tickLine={false} axisLine={false} tick={{ fill: '#89918b', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: '#89918b', fontSize: 10 }} />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Probability']} contentStyle={{ background: '#1b211d', border: '1px solid #353e37', borderRadius: 6 }} />
                <Bar dataKey="probability" radius={[3, 3, 0, 0]} fill="#91c77b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="empty-prediction"><span className="empty-glyph">?</span><strong>Awaiting a drawing</strong><p>Draw a digit and run inference to inspect the model’s class probabilities.</p></div>
      )}
    </section>
  )
}