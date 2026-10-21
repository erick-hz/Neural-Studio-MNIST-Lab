export interface TrainingMetrics {
  accuracy: number[]
  val_accuracy: number[]
  loss: number[]
  val_loss: number[]
  test_accuracy: number
  test_loss: number
  epochs: number
  training_images: number
  testing_images: number
  batch_size: number
  validation_split: number
  trained_at: string
}

export interface ModelLayer {
  name: string
  type: string
  shape: string
}

export interface ModelInfo {
  name: string
  loaded: boolean
  parameters: number | null
  layers: ModelLayer[]
}

export interface Prediction {
  prediction: number
  confidence: number
  probabilities: number[]
}

export interface DatasetSample {
  label: number
  image: string
}