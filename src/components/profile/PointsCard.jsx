'use client';

import { Coins, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PointsCard({ points, onConvert }) {
  const calculateAmount = () => {
    // 5 points = 1 XAF
    return Math.floor(points / 5);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-start">
        <div className="mr-4 p-2 bg-green-100 text-green-600 rounded-full">
          <Coins size={20} />
        </div>
        <div>
          <p className="font-medium">Solde actuel</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {points} points
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Équivalent à {calculateAmount().toLocaleString()} XAF
          </p>
        </div>
      </div>

      <div className="mt-4 w-full flex flex-col items-center">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#16a34a"
              strokeWidth="6"
              strokeDasharray="282.7"
              strokeDashoffset={282.7 - (282.7 * (points / 2000))}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Award className="h-8 w-8 text-green-600 mb-1" />
            <p className="text-sm text-gray-500">Niveau</p>
            <p className="text-xl font-bold">{Math.floor(points / 500) + 1}</p>
          </div>
        </div>

        <Button
          className="w-full mt-4 bg-green-600 hover:bg-green-700"
          onClick={onConvert}
        >
          Convertir mes points
        </Button>
      </div>
    </div>
  );
}
