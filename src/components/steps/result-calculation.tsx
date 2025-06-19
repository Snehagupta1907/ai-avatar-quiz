'use client';

import { useState, useEffect } from 'react';
import livepeerUtils from '@/utils/livepeer';
import { cleanLLMOutput } from '../quiz-result';

interface ResultCalculationStepProps {
  answers: string[];
  onComplete: (analysis: string) => void;
  onBack: () => void;
}

export default function ResultCalculationStep({ 
  answers, 
  onComplete, 
  onBack 
}: ResultCalculationStepProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  useEffect(() => {
    analyzeAnswers();
  }, []);

  const analyzeAnswers = async () => {
    setCurrentStep('Analyzing your personality...');
    setProgress(20);

    try {
      // Create a comprehensive analysis prompt
      const analysisPrompt = `
        Analyze these personality assessment answers and provide a detailed personality profile:

        Question 1: How would you describe your personality in 3 words?
        Answer: ${answers[0]}

        Question 2: What activities make you feel most energized and happy?
        Answer: ${answers[1]}

        Question 3: Describe your ideal weekend. What would you do?
        Answer: ${answers[2]}

        Question 4: What are your biggest strengths and how do they show up in your life?
        Answer: ${answers[3]}

        Question 5: If you could have any superpower, what would it be and why?
        Answer: ${answers[4]}

        Please provide a comprehensive personality analysis that includes:
        1. Key personality traits and characteristics
        2. Energy patterns and preferences
        3. Strengths and unique qualities
        4. Values and motivations
        5. Communication and social style

        Format this as a clear, engaging personality profile that could be used to create a personalized avatar.
      `;

      setProgress(40);
      setCurrentStep('Generating personality insights...');

      const response = await livepeerUtils.llm({
        messages: [
          {
            role: "system",
            content: "You are an expert personality analyst and psychologist. Provide insightful, positive, and detailed personality analysis based on user responses."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      setProgress(80);
      setCurrentStep('Finalizing analysis...');

      const analysis = response.choices[0]?.message?.content || 'Unable to generate analysis';
      const cleanedAnalysis = cleanLLMOutput(analysis);
      
      setProgress(100);
      setCurrentStep('Analysis complete!');
      
      // Small delay to show completion
      setTimeout(() => {
        onComplete(cleanedAnalysis);
      }, 1000);

    } catch (error) {
      console.error('Analysis error:', error);
      setCurrentStep('Error analyzing responses. Please try again.');
      // Fallback analysis
      setTimeout(() => {
        onComplete('Based on your responses, you appear to be a thoughtful and engaging person with diverse interests and a positive outlook on life.');
      }, 2000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-blue-500 hover:text-blue-600 mb-4 flex items-center"
        >
          ← Back to Questions
        </button>
        <h2 className="text-2xl font-bold mb-2">Analyzing Your Personality</h2>
        <p className="text-gray-600">
          Our AI is analyzing your responses to understand your unique personality traits.
        </p>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-sm border">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Current Step */}
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">{currentStep}</p>
        </div>

        {/* Loading Tips */}
        <div className="mt-8 text-sm text-gray-500">
          <p className="font-medium mb-2">What we&apos;re analyzing:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Personality traits and characteristics</li>
            <li>Energy patterns and preferences</li>
            <li>Strengths and unique qualities</li>
            <li>Values and motivations</li>
            <li>Communication style</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 