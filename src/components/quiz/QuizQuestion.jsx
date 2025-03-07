'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';

export default function QuizQuestion({ question, onAnswer, onNext, isSubmitted, selectedAnswer, isLast }) {
  const [localAnswer, setLocalAnswer] = useState(null);

  const handleAnswerSelect = (index) => {
    if (isSubmitted) return;
    setLocalAnswer(index);
  };

  const handleSubmit = () => {
    if (localAnswer === null) return;
    onAnswer && onAnswer(localAnswer);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {question.question}
      </h2>

      <RadioGroup value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}>
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${
              localAnswer === index ? 'bg-gray-100' : ''
            } ${
              isSubmitted && index === question.correctAnswer
                ? 'bg-green-100'
                : ''
            } ${
              isSubmitted && selectedAnswer === index && index !== question.correctAnswer
                ? 'bg-red-100'
                : ''
            }`}
            onClick={() => handleAnswerSelect(index)}
          >
            <RadioGroupItem
              value={index.toString()}
              id={`option-${index}`}
              disabled={isSubmitted}
            />
            <Label
              htmlFor={`option-${index}`}
              className="flex-grow cursor-pointer"
            >
              {option}
            </Label>

            {isSubmitted && index === question.correctAnswer && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}

            {isSubmitted && selectedAnswer === index && index !== question.correctAnswer && (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
          </div>
        ))}
      </RadioGroup>

      {isSubmitted && (
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="font-medium">Explication :</p>
          <p className="text-gray-700 mt-1">
            {question.explanation}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={localAnswer === null}
            className="bg-green-600 hover:bg-green-700"
          >
            Valider ma réponse
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLast ? 'Terminer le quiz' : 'Question suivante'}
          </Button>
        )}
      </div>
    </div>
  );
}
