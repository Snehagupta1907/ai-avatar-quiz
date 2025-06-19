'use client';

import { useState } from 'react';
import { QuizQuestion } from '@/types/quiz';

interface QuizQuestionsProps {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  onAnswer: (answer: string) => void;
}

export function QuizQuestions({ 
  questions, 
  currentQuestionIndex, 
  onAnswer 
}: QuizQuestionsProps) {
  const [answer, setAnswer] = useState('');
  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswer(answer.trim());
      setAnswer('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <h2 className="text-2xl font-bold">{currentQuestion.question}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 
                     focus:ring-2 focus:ring-blue-200 min-h-[120px] resize-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 
                   transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!answer.trim()}
        >
          Next Question
        </button>
      </form>

      <div className="mt-8 text-sm text-gray-500">
        <p>Tips:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Be as descriptive as possible</li>
          <li>There are no wrong answers</li>
          <li>Your answers will help create your personalized result</li>
        </ul>
      </div>
    </div>
  );
} 