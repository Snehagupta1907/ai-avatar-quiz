'use client';

import { QuizTheme } from '@/types/quiz';

interface QuizTypeProps {
  onSelect: (theme: QuizTheme) => void;
}

const quizTypes: { theme: QuizTheme; title: string; description: string }[] = [
  {
    theme: '90s',
    title: '90s Supermodel',
    description: 'What kind of 90s supermodel are you?'
  },
  {
    theme: 'football',
    title: 'Football Player',
    description: 'Which football league & position?'
  },
  {
    theme: 'disney',
    title: 'Disney Princess',
    description: 'What Disney princess are you?'
  },
  {
    theme: 'marvel',
    title: 'Marvel Superhero',
    description: 'Which Marvel superhero?'
  },
  {
    theme: 'fantasy',
    title: 'Fantasy Creature',
    description: 'What fantasy creature are you?'
  },
  {
    theme: 'historical',
    title: 'Historical Figure',
    description: 'Historical figure match'
  }
];

export function QuizType({ onSelect }: QuizTypeProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-8">Choose Your Quiz Theme</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizTypes.map(({ theme, title, description }) => (
          <button
            key={theme}
            onClick={() => onSelect(theme)}
            className="p-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 
                     transition-colors text-left space-y-2 hover:bg-blue-50"
          >
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </button>
        ))}
      </div>
    </div>
  );
} 