'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { QuizResult } from '@/types/quiz';
import ReactMarkdown from 'react-markdown';

interface QuizResultProps {
  result: QuizResult;
  onRegenerate: () => void;
  onShare: () => void;
}

// Utility to clean LLM output
export function cleanLLMOutput(text: string) {
  if (!text) return '';
  // Remove 'assistant' at the start
  let cleaned = text.replace(/^assistant[\s:,-]*/i, '');
  // Remove special tokens like <|start_header_id|> etc.
  cleaned = cleaned.replace(/<\|.*?\|>/g, '');
  // Trim leading/trailing whitespace
  cleaned = cleaned.trim();
  return cleaned;
}

export function QuizResult({ result, onRegenerate, onShare }: QuizResultProps) {
  const [isSharing, setIsSharing] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Avatar Image at the top */}
        {result.avatarUrl && (
          <div className="w-full flex justify-center items-center pt-8">
            <div className="relative w-80 h-80">
              <Image
                src={result.avatarUrl}
                alt="Generated Avatar"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        )}
        <div className="p-8">
          <div className="text-sm font-semibold text-blue-500 mb-1">
            Your Result
          </div>
          <h2 className="text-2xl font-bold mb-4">
            { "Here's your personalized result"}
          </h2>

          {/* Render personality analysis as markdown */}
          <div className="prose max-w-none mb-6">
            <ReactMarkdown>
              {cleanLLMOutput(result.systemMessage || '')}
            </ReactMarkdown>
          </div>

          {/* Optionally, show the avatar prompt in a collapsible section */}
          {result.generatedPrompt && (
            <details className="mb-6">
              <summary className="cursor-pointer font-semibold text-blue-500">Show Avatar Prompt</summary>
              <div className="prose max-w-none mt-2">
                <ReactMarkdown>
                  {cleanLLMOutput(result.generatedPrompt)}
                </ReactMarkdown>
              </div>
            </details>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onRegenerate}
              className="w-full bg-white text-blue-500 border-2 border-blue-500 py-2 px-4 
                       rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              Regenerate Result
            </button>
            <button
              onClick={() => {
                setIsSharing(true);
                onShare();
                setTimeout(() => setIsSharing(false), 2000);
              }}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg 
                       hover:bg-blue-600 transition-colors font-semibold"
            >
              {isSharing ? 'Copying Share Link...' : 'Share Result'}
            </button>
          </div>

          {/* Refinement Options */}
          <div className="mt-8">
            <h3 className="font-semibold mb-2">Refinement Options:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Strengthen result traits</li>
              <li>• Adjust face blending</li>
              <li>• Modify pose/styling</li>
              <li>• Change asset</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 