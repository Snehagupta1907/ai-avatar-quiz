'use client';

import { useState, useEffect } from 'react';
import livepeerUtils from '@/utils/livepeer';
import { cleanLLMOutput } from '../quiz-result';

interface PromptGenerationStepProps {
  personalityAnalysis: string;
  onComplete: (prompt: string) => void;
  onBack: () => void;
}

export default function PromptGenerationStep({ 
  personalityAnalysis, 
  onComplete, 
  onBack 
}: PromptGenerationStepProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  useEffect(() => {
    generatePrompt();
  }, []);

  const generatePrompt = async () => {
    setCurrentStep('Creating your personalized avatar prompt...');
    setProgress(20);

    try {
      const promptRequest = `
        Based on this personality analysis, create a detailed prompt for generating a personalized avatar:

        PERSONALITY ANALYSIS:
        ${personalityAnalysis}

        Please create a comprehensive avatar generation prompt that includes:
        1. Physical appearance details that reflect the personality traits
        2. Clothing style that matches their energy and preferences
        3. Pose and expression that captures their character
        4. Background or setting that complements their interests
        5. Lighting and mood that reflects their personality
        6. Artistic style that would appeal to them

        Make the prompt detailed, specific, and optimized for AI image generation.
        Focus on creating a realistic, high-quality portrait that truly represents this person.
        Include specific details about facial features, hair style, clothing, and overall aesthetic.
      `;

      setProgress(40);
      setCurrentStep('Analyzing personality traits for visual representation...');

      const response = await livepeerUtils.llm({
        messages: [
          {
            role: "system",
            content: "You are an expert avatar designer and prompt engineer. Create detailed, specific prompts for AI image generation that capture personality and create stunning, personalized avatars."
          },
          {
            role: "user",
            content: promptRequest
          }
        ],
        temperature: 0.8,
        max_tokens: 600
      });

      setProgress(80);
      setCurrentStep('Finalizing avatar prompt...');

      const prompt = response.choices[0]?.message?.content || 'Unable to generate prompt';
      const cleanedPrompt = cleanLLMOutput(prompt);
      setGeneratedPrompt(cleanedPrompt);
      
      setProgress(100);
      setCurrentStep('Prompt generation complete!');
      
      // Small delay to show completion
      setTimeout(() => {
        onComplete(cleanedPrompt);
      }, 1000);

    } catch (error) {
      console.error('Prompt generation error:', error);
      setCurrentStep('Error generating prompt. Please try again.');
      // Fallback prompt
      setTimeout(() => {
        const fallbackPrompt = 'A professional headshot portrait of a confident, friendly person with a warm smile, wearing modern casual clothing, soft natural lighting, high quality, detailed, photorealistic';
        setGeneratedPrompt(fallbackPrompt);
        onComplete(fallbackPrompt);
      }, 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-blue-500 hover:text-blue-600 mb-4 flex items-center"
        >
          ← Back to Analysis
        </button>
        <h2 className="text-2xl font-bold mb-2">Creating Your Avatar Prompt</h2>
        <p className="text-gray-600">
          Our AI is crafting a detailed prompt to generate your personalized avatar based on your personality analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
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

          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">{currentStep}</p>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p className="font-medium mb-2">What we&apos;re creating:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Physical appearance details</li>
              <li>Clothing and style preferences</li>
              <li>Pose and expression</li>
              <li>Background and setting</li>
              <li>Lighting and mood</li>
              <li>Artistic style direction</li>
            </ul>
          </div>
        </div>

        {/* Generated Prompt Preview */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="font-semibold mb-4">Generated Avatar Prompt</h3>
          {generatedPrompt ? (
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="whitespace-pre-wrap">{generatedPrompt}</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
              Generating your personalized avatar prompt...
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 