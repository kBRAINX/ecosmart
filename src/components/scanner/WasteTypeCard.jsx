'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowRight } from 'lucide-react';

export default function WasteTypeCard({ wasteType, confidence, nearestBin, capturedImage, onReset }) {
  if (!wasteType) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="relative w-full md:w-1/3 aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {capturedImage && (
            <Image
              src={capturedImage}
              alt={wasteType.name}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center">
            <div
              className="w-12 h-12 rounded-full mr-4 flex items-center justify-center"
              style={{ backgroundColor: `${wasteType.color}20` }}
            >
              <Image
                src={wasteType.icon}
                alt={wasteType.name}
                width={24}
                height={24}
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{wasteType.name}</h3>
              <p className="text-gray-500 text-sm">
                Confiance: {confidence.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">Description:</p>
              <p className="text-gray-700 mt-1">{wasteType.description}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">Recyclage:</p>
              <p className="text-gray-700 mt-1">{wasteType.recyclingInfo}</p>
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <p className="font-medium text-green-800">Points:</p>
              <p className="text-green-700 font-bold text-xl mt-1">{wasteType.pointsPerKg} points par kg</p>
            </div>
          </div>
        </div>
      </div>

      {nearestBin && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <MapPin className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold">Point de collecte le plus proche</h3>
          </div>

          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <p className="font-medium">{nearestBin.name}</p>
              <p className="text-gray-600 text-sm">Capacité: {nearestBin.capacity} • Niveau de remplissage: {nearestBin.fillLevel}%</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {nearestBin.types.map(typeId => {
                  // Vous devriez normalement avoir une fonction pour trouver le type correspondant à l'ID
                  const type = { name: typeId, color: '#16a34a' }; // Exemple simplifié
                  return (
                    <Badge key={typeId} style={{ backgroundColor: type?.color }}>
                      {type?.name}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <Button asChild className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700">
              <Link href={`/map?binId=${nearestBin.id}`}>
                <span className="flex items-center">
                  Voir sur la carte <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onReset} variant="outline" className="w-full sm:w-auto">
          Scanner à nouveau
        </Button>
        <Button asChild className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
          <Link href="/map">
            Voir tous les points de collecte
          </Link>
        </Button>
      </div>
    </div>
  );
}
