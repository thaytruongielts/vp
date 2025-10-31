
export interface VocabularyItem {
  vietnamese: string;
  english: string;
}

export interface EvaluationResult {
  score: number;
  feedback: string;
  correctAnswer: string;
}

export interface GeminiEvaluationResponse {
    score: number;
    feedback: string;
}
