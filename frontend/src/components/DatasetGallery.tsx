import { useEffect, useState } from 'react'
import { fetchSamples, getApiError } from '../services/api'
import type { DatasetSample } from '../types'

export function DatasetGallery() {
  const [samples, setSamples] = useState<DatasetSample[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSamples().then((data) => setSamples(data.samples)).catch((reason: unknown) => setError(getApiError(reason)))
  }, [])

  return (
    <div className="dataset-gallery">
      {samples.map((sample, index) => (
        <div className="sample-tile" key={`${index}-${sample.label}`}>
          <img src={sample.image} alt={`MNIST handwritten digit ${sample.label}`} />
          <span>{sample.label}</span>
        </div>
      ))}
      {!samples.length && <div className="gallery-message">{error || 'Loading real MNIST samples…'}</div>}
    </div>
  )
}