"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface QuizCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const quizCategories: QuizCategory[] = [
  {
    id: "sci-fi",
    title: "Sci-Fi Character",
    description: "Which sci-fi universe character are you?",
    icon: "🚀",
  },
  {
    id: "fantasy",
    title: "Fantasy Creature",
    description: "What fantasy creature matches your personality?",
    icon: "🐉",
  },
  {
    id: "historical",
    title: "Historical Figure",
    description: "Which historical figure do you resemble?",
    icon: "👑",
  },
  {
    id: "superhero",
    title: "Superhero",
    description: "What kind of superhero would you be?",
    icon: "⚡",
  },
  {
    id: "disney",
    title: "Disney Character",
    description: "Which Disney character are you most like?",
    icon: "✨",
  },
];

interface QuizTypeProps {
  onSelectQuizType: (categoryId: string) => void;
}

export default function QuizType({ onSelectQuizType }: QuizTypeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onSelectQuizType(categoryId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2 text-primary">Choose Your Avatar Theme</h3>
        <p className="text-muted-foreground">
          Select a category to determine your personalized avatar style
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizCategories.map((category) => (
          <motion.div
            key={category.id}
            className={`glass shadow-md p-6 rounded-xl cursor-pointer transition-all duration-300 border border-transparent group fade-in
              ${selectedCategory === category.id
                ? "bg-gradient-to-r from-primary/80 to-accent/60 text-primary-foreground border-primary/60 scale-105 shadow-lg"
                : "hover:bg-secondary/60 hover:shadow-xl hover:scale-102"}
            `}
            onClick={() => handleCategorySelect(category.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
              <div>
                <h4 className="font-semibold text-lg">{category.title}</h4>
                <p className={`text-sm ${
                  selectedCategory === category.id
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}>
                  {category.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 