export interface ImageSample {
  id: string;
  src: string; // Base64 data
}

export interface ClassCategory {
  id: string;
  name: string;
  samples: ImageSample[];
}

export enum ModelType {
  LOGISTIC_REGRESSION = 'Logistic Regression',
  RANDOM_FOREST = 'Random Forest',
  CNN = 'CNN (TensorFlow/Keras)',
}

export interface PredictionResult {
  modelType: ModelType;
  predictedClassId: string;
  confidence: number;
  reasoning: string;
  timestamp: number;
}

export interface Metrics {
  accuracy: number;
  totalSamples: number;
  lastTrainingDuration: number;
}

export type AppStep = 'collect' | 'train' | 'preview';