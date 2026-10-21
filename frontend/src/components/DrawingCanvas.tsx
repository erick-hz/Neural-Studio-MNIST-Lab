import { useRef, useState } from 'react'
import { Brush, Eraser, LoaderCircle, Sparkles } from 'lucide-react'
import { getApiError, predictDrawing } from '../services/api'
import type { Prediction } from '../types'

interface DrawingCanvasProps {
  onPrediction: (result: Prediction) => void
  onError: (message: string) => void
}

export function DrawingCanvas({ onPrediction, onError }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [brushSize, setBrushSize] = useState(18)
  const [loading, setLoading] = useState(false)

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!
    const bounds = canvas.getBoundingClientRect()
    return {
      x: (event.clientX - bounds.left) * (canvas.width / bounds.width),
      y: (event.clientY - bounds.top) * (canvas.height / bounds.height),
    }
  }

  function startDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!
    const context = canvas.getContext('2d')!
    const position = point(event)
    drawing.current = true
    canvas.setPointerCapture(event.pointerId)
    context.beginPath()
    context.moveTo(position.x, position.y)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = '#ffffff'
    context.lineWidth = brushSize
    context.lineTo(position.x + 0.1, position.y + 0.1)
    context.stroke()
  }

  function continueDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return
    const context = canvasRef.current!.getContext('2d')!
    const position = point(event)
    context.lineTo(position.x, position.y)
    context.stroke()
  }

  function stopDrawing() {
    drawing.current = false
  }

  function clearCanvas() {
    const canvas = canvasRef.current!
    const context = canvas.getContext('2d')!
    context.fillStyle = '#050706'
    context.fillRect(0, 0, canvas.width, canvas.height)
    onError('')
  }

  async function submitPrediction() {
    const canvas = canvasRef.current!
    setLoading(true)
    onError('')
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (value) =>
            value
              ? resolve(value)
              : reject(new Error('Could not read the drawing.')),
          'image/png',
        )
      })
      onPrediction(await predictDrawing(blob))
    } catch (error) {
      onError(getApiError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel draw-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">INPUT</span>
          <h2>Sketch a digit</h2>
        </div>
        <span className="canvas-size">28 × 28 model input</span>
      </div>
      <div className="canvas-wrap">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          aria-label="Drawing canvas for a digit from zero to nine"
          onPointerDown={startDrawing}
          onPointerMove={continueDrawing}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          onLostPointerCapture={stopDrawing}
        />
        <span className="canvas-hint">DRAW 0–9</span>
      </div>
      <div className="brush-control">
        <Brush size={15} aria-hidden="true" />
        <label htmlFor="brush-size">Brush</label>
        <input
          id="brush-size"
          type="range"
          min="8"
          max="32"
          value={brushSize}
          onChange={(event) => setBrushSize(Number(event.target.value))}
        />
        <span>{brushSize}px</span>
      </div>
      <div className="canvas-actions">
        <button
          className="button button-quiet"
          type="button"
          onClick={clearCanvas}
        >
          <Eraser size={16} />
          Clear
        </button>
        <button
          className="button button-primary"
          type="button"
          onClick={submitPrediction}
          disabled={loading}
        >
          {loading ? (
            <LoaderCircle className="spin" size={16} />
          ) : (
            <Sparkles size={16} />
          )}
          {loading ? 'Analyzing' : 'Run prediction'}
        </button>
      </div>
    </section>
  )
}
