'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Plus, Minus, RefreshCw } from 'lucide-react';

export default function MapComponent({
  points = [],
  userLocation = null,
  selectedPoint = null,
  onSelectPoint,
  showDirections = false,
  className = ''
}) {
  const [mapZoom, setMapZoom] = useState(15);
  const [mapCenter, setMapCenter] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Si un point est sélectionné, centrer la carte sur ce point
    if (selectedPoint) {
      setMapCenter(selectedPoint.location);
    }
    // Sinon, si la position de l'utilisateur est disponible, centrer sur l'utilisateur
    else if (userLocation) {
      setMapCenter(userLocation);
    }
    // Sinon, utiliser un centre par défaut ou le premier point s'il y en a
    else if (points.length > 0) {
      setMapCenter(points[0].location);
    }
  }, [selectedPoint, userLocation, points]);

  const zoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 18));
  };

  const zoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 10));
  };

  const resetView = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setMapZoom(15);
    }
  };

  // Dans une implémentation réelle, utiliser une bibliothèque comme Mapbox, Google Maps ou Leaflet
  // Ce composant est une simulation de carte pour la démonstration
  return (
    <div className={`relative bg-gray-200 h-full w-full ${className}`}>
      {/* Simuler une carte */}
      <div className="absolute inset-0 bg-blue-50"></div>

      {/* Afficher les points sur la carte */}
      {points.map((point) => (
        <div
          key={point.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
            selectedPoint?.id === point.id ? 'z-20' : 'z-10'
          }`}
          style={{
            left: `${50 + (point.location.longitude - (mapCenter?.longitude || 0)) * 2000 * mapZoom / 15}%`,
            top: `${50 - (point.location.latitude - (mapCenter?.latitude || 0)) * 2000 * mapZoom / 15}%`
          }}
          onClick={() => onSelectPoint && onSelectPoint(point)}
        >
          <div className={`flex flex-col items-center ${selectedPoint?.id === point.id ? 'scale-125' : ''}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                selectedPoint?.id === point.id ? 'border-green-700 bg-green-600' : 'border-gray-300 bg-white'
              }`}
            >
              <MapPin className={`h-4 w-4 ${selectedPoint?.id === point.id ? 'text-white' : 'text-gray-500'}`} />
            </div>
            {selectedPoint?.id === point.id && (
              <div className="mt-1 bg-white px-2 py-1 rounded-md shadow-md text-xs font-medium">
                {point.name}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Afficher la position de l'utilisateur */}
      {userLocation && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
          style={{
            left: `${50 + (userLocation.longitude - (mapCenter?.longitude || 0)) * 2000 * mapZoom / 15}%`,
            top: `${50 - (userLocation.latitude - (mapCenter?.latitude || 0)) * 2000 * mapZoom / 15}%`
          }}
        >
          <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md pulse-animation"></div>
        </div>
      )}

      {/* Afficher l'itinéraire (si demandé) */}
      {showDirections && selectedPoint && userLocation && (
        <div
          className="absolute z-15"
          style={{
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        >
          <svg width="100%" height="100%">
            <path
              d={`M${50 + (userLocation.longitude - (mapCenter?.longitude || 0)) * 2000 * mapZoom / 15},${50 - (userLocation.latitude - (mapCenter?.latitude || 0)) * 2000 * mapZoom / 15}
                 L${50 + (selectedPoint.location.longitude - (mapCenter?.longitude || 0)) * 2000 * mapZoom / 15},${50 - (selectedPoint.location.latitude - (mapCenter?.latitude || 0)) * 2000 * mapZoom / 15}`}
              stroke="#3B82F6"
              strokeWidth="3"
              strokeDasharray="5,5"
              fill="none"
            />
          </svg>
        </div>
      )}

      {/* Contrôles de la carte */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 bg-white shadow-md"
          onClick={zoomIn}
        >
          <Plus size={18} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 bg-white shadow-md"
          onClick={zoomOut}
        >
          <Minus size={18} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 bg-white shadow-md"
          onClick={resetView}
          disabled={!userLocation}
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* Style pour l'animation de pulsation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        .pulse-animation {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}
