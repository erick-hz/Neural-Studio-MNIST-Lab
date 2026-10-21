import { useEffect, useState } from 'react'
import { Activity, Database, Gauge, Layers3 } from 'lucide-react'
import { AccuracyChart } from '../components/AccuracyChart'
import { DatasetGallery } from '../components/DatasetGallery'
import { LossChart } from '../components/LossChart'
import { NeuralNetworkDiagram } from '../components/NeuralNetworkDiagram'
import { fetchMetrics, fetchModelInfo, getApiError } from '../services/api'
import type { ModelInfo, TrainingMetrics } from '../types'

export function Dashboard() {
  const [metrics, setMetrics] = useState<TrainingMetrics | null>(null)
  const [model, setModel] = useState<ModelInfo | null>(null)
  const [metricsError, setMetricsError] = useState('')

  useEffect(() => {
    fetchMetrics().then(setMetrics).catch((error: unknown) => setMetricsError(getApiError(error)))
    fetchModelInfo().then(setModel).catch(() => setModel(null))
  }, [])

  const cards = [
    { label: 'TEST ACCURACY', value: metrics ? `${(metrics.test_accuracy * 100).toFixed(2)}%` : '—', detail: 'MNIST held-out set', icon: Gauge, color: 'green' },
    { label: 'TRAINING EPOCHS', value: metrics?.epochs ?? '—', detail: metrics ? 'Completed runs' : 'Awaiting training', icon: Activity, color: 'amber' },
    { label: 'TRAINING IMAGES', value: metrics ? metrics.training_images.toLocaleString() : '—', detail: 'MNIST train split', icon: Database, color: 'green' },
    { label: 'TESTING IMAGES', value: metrics ? metrics.testing_images.toLocaleString() : '—', detail: 'MNIST held-out split', icon: Database, color: 'amber' },
    { label: 'MODEL PARAMETERS', value: model?.parameters?.toLocaleString() ?? '—', detail: 'Learned weights', icon: Layers3, color: 'amber' },
  ]

  return (
    <div className="page-content">
      <header className="page-header">
        <div><span className="eyebrow">MODEL OVERVIEW / MNIST</span><h1>Good evening, researcher.</h1><p>A live readout of your handwritten digit classifier.</p></div>
        <div className={`model-status ${model?.loaded ? 'is-online' : ''}`}><span className="status-dot" />{model?.loaded ? 'MODEL ONLINE' : 'MODEL NOT TRAINED'}</div>
      </header>

      {!metrics && <div className="notice-banner" role="status"><strong>Training artifact not found.</strong> {metricsError || 'Train the network to populate real accuracy, loss, and dataset metrics.'}</div>}

      <section className="metric-grid" aria-label="Model metrics">
        {cards.map(({ label, value, detail, icon: Icon, color }) => (
          <article className="metric-card" key={label}>
            <div className={`metric-icon ${color}`}><Icon size={18} /></div>
            <span className="metric-label">{label}</span>
            <strong className="metric-value">{value}</strong>
            <span className="metric-detail">{detail}</span>
          </article>
        ))}
      </section>

      <section className="chart-grid">
        <article className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">OPTIMIZATION</span><h2>Accuracy by epoch</h2></div><span className="chart-legend"><i className="legend-training" />Train <i className="legend-validation" />Validation</span></div><AccuracyChart training={metrics?.accuracy ?? []} validation={metrics?.val_accuracy ?? []} /></article>
        <article className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">OBJECTIVE</span><h2>Loss by epoch</h2></div><span className="chart-legend"><i className="legend-training" />Train <i className="legend-validation" />Validation</span></div><LossChart training={metrics?.loss ?? []} validation={metrics?.val_loss ?? []} /></article>
      </section>

      <section className="lower-grid">
        <article className="panel architecture-panel"><div className="panel-heading"><div><span className="eyebrow">NETWORK MAP</span><h2>Architecture</h2></div><span className="micro-tag">FEED-FORWARD ANN</span></div><NeuralNetworkDiagram model={model} /></article>
        <article className="panel dataset-panel"><div className="panel-heading"><div><span className="eyebrow">DATA EXPLORER</span><h2>MNIST samples</h2></div><span className="micro-tag">REAL DATA</span></div><DatasetGallery /></article>
      </section>
    </div>
  )
}