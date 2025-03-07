'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle } from 'lucide-react';

export default function QuizResult({ score, totalQuestions, points, timeUsed }) {
  const calculatePercentage = () => {
    return Math.round((score / totalQuestions) * 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="py-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>

      <h2 className="text-xl font-bold mb-2">Quiz terminé!</h2>
      <p className="text-gray-600 mb-6">
        Vous avez obtenu {score} / {totalQuestions} bonnes réponses
      </p>

      <div className="w-36 h-36 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600">
            {points}
          </p>
          <p className="text-sm text-gray-600">points gagnés</p>
        </div>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div className="flex justify-between p-3 bg-gray-50 rounded-md">
          <span className="text-gray-700">Temps utilisé:</span>
          <span className="font-medium">{formatTime(timeUsed)}</span>
        </div>

        <div className="flex justify-between p-3 bg-gray-50 rounded-md">
          <span className="text-gray-700">Score:</span>
          <span className="font-medium">{calculatePercentage()}%</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-center mt-6">
        <Button asChild variant="outline">
          <Link href={`/awareness/quiz`}>
            Refaire le quiz
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/awareness/quiz">
            Tous les quiz
          </Link>
        </Button>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/awareness/videos">
            Explorer les vidéos
          </Link>
        </Button>
      </div>
    </div>
  );
}
