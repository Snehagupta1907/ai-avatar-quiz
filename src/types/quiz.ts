export type QuizTheme = 
  | '90s' 
  | 'football' 
  | 'disney' 
  | 'marvel' 
  | 'fantasy' 
  | 'historical'
  | 'personality';

export interface QuizQuestion {
  id: string;
  theme: QuizTheme;
  question: string;
  userAnswer?: string;
}

export interface QuizResult {
  theme: QuizTheme;
  answers: string[];
  generatedPrompt?: string;
  avatarUrl?: string;
  systemMessage?: string;
}

export interface QuizState {
  uploadedPhoto?: File;
  selectedTheme?: QuizTheme;
  currentQuestionIndex: number;
  questions: QuizQuestion[];
  answers: string[];
  result?: QuizResult;
  isComplete: boolean;
} 