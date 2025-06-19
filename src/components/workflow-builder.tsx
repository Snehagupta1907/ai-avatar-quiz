/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { PhotoUpload } from "./photo-upload";
import QuizType from "./steps/quiz-type";
import QuizQuestionsStep from "./steps/quiz-questions";
import ResultCalculationStep from "./steps/result-calculation";
import PromptGenerationStep from "./steps/prompt-generation";
import AvatarGenerationStep from "./steps/avatar-generation";
import { QuizResult as QuizResultComponent } from "./quiz-result";
import { QuizResult } from "@/types/quiz";
import ThemeToggle from "./theme-toggle";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: "upcoming" | "current" | "complete";
}

const workflowSteps: WorkflowStep[] = [
  {
    id: "photo-upload",
    title: "Photo Upload",
    description: "Upload your photo",
    status: "current",
  },
  {
    id: "quiz-type",
    title: "Select Quiz Type",
    description: "Choose quiz category and number of questions",
    status: "upcoming",
  },
  {
    id: "quiz-questions",
    title: "Quiz Questions",
    description: "Answer personality assessment questions",
    status: "upcoming",
  },
  {
    id: "result-calculation",
    title: "Result Calculation",
    description: "AI processes your responses",
    status: "upcoming",
  },
  {
    id: "prompt-generation",
    title: "Prompt Generation",
    description: "Creating detailed prompts for your avatar",
    status: "upcoming",
  },
  {
    id: "avatar-generation",
    title: "Avatar Generation",
    description: "Generating your personalized avatar",
    status: "upcoming",
  },
];

export default function WorkflowBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [quizType, setQuizType] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [personalityAnalysis, setPersonalityAnalysis] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isComplete, setIsComplete] = useState(false);

  const handlePhotoValidated = (file: File) => {
    setUploadedPhoto(file);
    setCurrentStep(1); // Move to quiz type selection
  };

  const handlePhotoCancel = () => {
    setUploadedPhoto(null);
  };

  const handleQuizTypeSelected = (categoryId: string) => {
    setQuizType(categoryId);
    setCurrentStep(2); // Move to quiz questions
  };

  const handleQuizComplete = (answers: string[]) => {
    setQuizAnswers(answers);
    setCurrentStep(3); // Move to result calculation
  };

  const handleAnalysisComplete = (analysis: string) => {
    setPersonalityAnalysis(analysis);
    setCurrentStep(4); // Move to prompt generation
  };

  const handlePromptComplete = (prompt: string) => {
    setGeneratedPrompt(prompt);
    setCurrentStep(5); // Move to avatar generation
  };

  const handleAvatarComplete = (url: string) => {
    setAvatarUrl(url);
    setIsComplete(true);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegenerate = () => {
    // Reset to prompt generation step
    setCurrentStep(4);
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Sharing result...');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PhotoUpload 
            onPhotoValidated={handlePhotoValidated}
            onError={(error) => console.error(error)}
            onCancel={handlePhotoCancel}
          />
        );
      case 1:
        return <QuizType onSelectQuizType={handleQuizTypeSelected} />;
      case 2:
        return (
          <QuizQuestionsStep 
            onComplete={handleQuizComplete}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ResultCalculationStep
            answers={quizAnswers}
            onComplete={handleAnalysisComplete}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <PromptGenerationStep
            personalityAnalysis={personalityAnalysis}
            onComplete={handlePromptComplete}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <AvatarGenerationStep
            prompt={generatedPrompt}
            onComplete={handleAvatarComplete}
            onBack={handleBack}
          />
        );
      default:
        return <div>Step content in development</div>;
    }
  };

  // Show final result if complete
  if (isComplete) {
    const result: QuizResult = {
      theme: 'personality',
      answers: quizAnswers,
      generatedPrompt: generatedPrompt,
      avatarUrl: avatarUrl,
      systemMessage: personalityAnalysis,
    };

    return (
      <div className="max-w-7xl mx-auto">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="fade-in">
          <QuizResultComponent 
            result={result}
            onRegenerate={handleRegenerate}
            onShare={handleShare}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        {/* Workflow Steps */}
        <div className="glass shadow-lg p-6 h-fit fade-in">
          <h2 className="text-xl font-semibold mb-6 text-primary">Workflow Steps</h2>
          <div className="space-y-4">
            {workflowSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center p-4 rounded-lg transition-colors cursor-pointer group ${
                  index === currentStep
                    ? "bg-primary/90 text-primary-foreground shadow-md"
                    : index < currentStep
                    ? "bg-muted text-muted-foreground opacity-80"
                    : "hover:bg-muted/80"
                }`}
                onClick={() => {
                  // Only allow going back to completed steps
                  if (index <= currentStep) {
                    setCurrentStep(index);
                  }
                }}
              >
                <div className="mr-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      index === currentStep
                        ? "bg-primary-foreground text-primary"
                        : index < currentStep
                        ? "bg-muted-foreground/20"
                        : "bg-muted-foreground/20"
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-base">{step.title}</h3>
                  <p className="text-xs opacity-80">{step.description}</p>
                </div>
                {index === currentStep && (
                  <ChevronRightIcon className="w-5 h-5 ml-auto animate-pulse text-accent" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="glass shadow-xl p-6 min-h-[600px] fade-in">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: [0.4,0,0.2,1] }}
              className="h-full"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 