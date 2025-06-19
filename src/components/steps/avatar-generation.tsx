'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import livepeerUtils from '@/utils/livepeer';

interface AvatarGenerationStepProps {
  prompt: string;
  onComplete: (avatarUrl: string) => void;
  onBack: () => void;
}

export default function AvatarGenerationStep({ 
  prompt, 
  onComplete, 
  onBack 
}: AvatarGenerationStepProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    generateAvatar();
  }, []);

  const generateAvatar = async () => {
    setCurrentStep('Initializing avatar generation...');
    setProgress(10);

    try {
      setProgress(30);
      setCurrentStep('Processing your personalized prompt...');

      // Generate the avatar using the prompt
      const result = await livepeerUtils.textToImage({
        prompt: prompt,
        model: "SG161222/RealVisXL_V4.0_Lightning",
        height: 1024,
        width: 1024,
        guidanceScale: 7.5,
        negativePrompt: "blurry, low quality, distorted, ugly, deformed, extra limbs, missing limbs",
        safetyCheck: true,
        numInferenceSteps: 25,
        seed: Math.floor(Math.random() * 1000000)
      });

      setProgress(80);
      setCurrentStep('Finalizing your avatar...');

      // Extract the image URL from the result
      const imageUrl = Array.isArray(result) && result.length > 0 
        ? result[0] 
        : typeof result === 'string' 
          ? result 
          : null;

      if (imageUrl) {
        setAvatarUrl(imageUrl);
        setProgress(100);
        setCurrentStep('Avatar generation complete!');
        
        // Small delay to show completion
        setTimeout(() => {
          onComplete(imageUrl);
        }, 1000);
      } else {
        throw new Error('No image URL received from generation');
      }

    } catch (error) {
      console.error('Avatar generation error:', error);
      setCurrentStep('Error generating avatar. Please try again.');
      // Fallback - create a placeholder
      setTimeout(() => {
        const fallbackUrl = 'https://via.placeholder.com/1024x1024/4F46E5/FFFFFF?text=Avatar+Generation+Failed';
        setAvatarUrl(fallbackUrl);
        onComplete(fallbackUrl);
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
          ← Back to Prompt
        </button>
        <h2 className="text-2xl font-bold mb-2">Generating Your Avatar</h2>
        <p className="text-gray-600">
          Our AI is creating your personalized avatar based on your personality and the generated prompt.
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
              <li>Personalized facial features</li>
              <li>Matching clothing and style</li>
              <li>Appropriate pose and expression</li>
              <li>Complementary background</li>
              <li>Professional lighting and quality</li>
              <li>High-resolution output</li>
            </ul>
          </div>
        </div>

        {/* Avatar Preview */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="font-semibold mb-4">Your Avatar</h3>
          {avatarUrl ? (
            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
              <Image
                src={avatarUrl}
                alt="Generated Avatar"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p>Generating your avatar...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 