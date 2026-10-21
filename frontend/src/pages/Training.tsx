import { useEffect, useState } from 'react'
import { AccuracyChart } from '../components/AccuracyChart'
import { LossChart } from '../components/LossChart'
import { fetchMetrics, getApiError } from '../services/api'
import type { TrainingMetrics } from '../types'

export function Training() {
  const [metrics, setMetrics] = useState<TrainingMetrics | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMetrics()
      .then(setMetrics)
      .catch((reason: unknown) => setError(getApiError(reason)))
  }, [])

  return (
    <div className="page-content">
      <header className="page-header">
        <div>
          <span className="eyebrow">LEARNING PROCESS</span>
          <h1>Training lab</h1>
          <p>
            Follow optimization on the MNIST training and validation splits.
          </p>
        </div>
        <div className="model-status">
          <span className="status-dot" />
          SUPERVISED LEARNING
        </div>
      </header>
      {!metrics && (
        <div className="notice-banner" role="status">
          <strong>Training history is not available.</strong>{' '}
          {error || 'Run the training command to generate real metrics.'}
        </div>
      )}
      <section className="training-setup panel">
        <div>
          <span className="eyebrow">EXPERIMENT CONFIGURATION</span>
          <h2>Stochastic gradient training</h2>
          <p>
            Each epoch passes the training split through the network in
            mini-batches. Backpropagation computes gradients for sparse
            categorical cross-entropy; Adam updates the weights. The validation
            split measures generalization after each epoch and is not used for
            weight updates.
          </p>
        </div>
        <div className="config-grid">
          <div>
            <span>OPTIMIZER</span>
            <strong>Adam</strong>
          </div>
          <div>
            <span>LOSS</span>
            <strong>Sparse categorical cross-entropy</strong>
          </div>
          <div>
            <span>BATCH SIZE</span>
            <strong>{metrics?.batch_size ?? 32}</strong>
          </div>
          <div>
            <span>EPOCHS</span>
            <strong>{metrics?.epochs ?? 10}</strong>
          </div>
          <div>
            <span>VALIDATION</span>
            <strong>
              {((metrics?.validation_split ?? 0.2) * 100).toFixed(0)}%
            </strong>
          </div>
          <div>
            <span>TEST ACCURACY</span>
            <strong>
              {metrics
                ? `${(metrics.test_accuracy * 100).toFixed(2)}%`
                : 'Pending'}
            </strong>
          </div>
        </div>
      </section>
      <section className="chart-grid training-charts">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">METRIC / ACCURACY</span>
              <h2>Learning progress</h2>
            </div>
          </div>
          <AccuracyChart
            training={metrics?.accuracy ?? []}
            validation={metrics?.val_accuracy ?? []}
          />
        </article>
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">METRIC / CROSS-ENTROPY</span>
              <h2>Loss convergence</h2>
            </div>
          </div>
          <LossChart
            training={metrics?.loss ?? []}
            validation={metrics?.val_loss ?? []}
          />
        </article>
      </section>
      {metrics && (
        <p className="trained-at">
          Metrics generated {new Date(metrics.trained_at).toLocaleString()} ·{' '}
          {metrics.training_images.toLocaleString()} training images ·{' '}
          {metrics.testing_images.toLocaleString()} test images
        </p>
      )}
    </div>
  )
}
