import type { ModelInfo } from '../types'

const colors = ['#66716a', '#82977b', '#a8d78e', '#d8b270', '#d8b270', '#e3a765']

export function NeuralNetworkDiagram({ model }: { model: ModelInfo | null }) {
  return (
    <div className="architecture-list">
      {(model?.layers ?? []).map((layer, index) => (
        <div className="architecture-layer" key={layer.name}>
          <span className="layer-index" style={{ color: colors[index] }}>{String(index + 1).padStart(2, '0')}</span>
          <span className="layer-name">{layer.name}</span>
          <span className="layer-type">{layer.type}</span>
          <span className="layer-shape">{layer.shape}</span>
        </div>
      ))}
      {!model && <div className="chart-empty">Connecting to model architecture…</div>}
    </div>
  )
}