'use client';

import { useState } from 'react';
import { QuizQuestions } from '../quiz-questions';
import { QuizQuestion } from '@/types/quiz';

interface QuizQuestionsStepProps {
  onComplete: (answers: string[]) => void;
  onBack: () => void;
}

const personalityQuestions: QuizQuestion[] = [
  {
    id: '1',
    theme: 'personality',
    question: 'How would you describe your personality in 3 words?'
  },
  {
    id: '2',
    theme: 'personality',
    question: 'What activities make you feel most energized and happy?'
  },
  {
    id: '3',
    theme: 'personality',
    question: 'Describe your ideal weekend. What would you do?'
  },
  {
    id: '4',
    theme: 'personality',
    question: 'What are your biggest strengths and how do they show up in your life?'
  },
  {
    id: '5',
    theme: 'personality',
    question: 'If you could have any superpower, what would it be and why?'
  }
];

export default function QuizQuestionsStep({ onComplete, onBack }: QuizQuestionsStepProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < personalityQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered
      onComplete(newAnswers);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-blue-500 hover:text-blue-600 mb-4 flex items-center"
        >
          ← Back to Quiz Type
        </button>
        <h2 className="text-2xl font-bold mb-2">Personality Assessment</h2>
        <p className="text-gray-600">
          Answer these questions to help us understand your personality and create your personalized avatar.
        </p>
      </div>

      <QuizQuestions
        questions={personalityQuestions}
        currentQuestionIndex={currentQuestionIndex}
        onAnswer={handleAnswer}
      />
    </div>
  );
} 