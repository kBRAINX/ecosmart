'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, X } from 'lucide-react';

export default function CameraScanner({ onCapture, onError }) {
  const [isActive, setIsActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Erreur lors de l\'accès à la caméra:', err);
      setCameraError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
      onError && onError(err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Définir les dimensions du canvas pour correspondre à la vidéo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dessiner l'image de la vidéo sur le canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Obtenir les données de l'image
    const imageData = canvas.toDataURL('image/jpeg');

    // Simuler un temps de traitement
    setTimeout(() => {
      setIsScanning(false);
      onCapture && onCapture(imageData, canvas);
    }, 1500);
  };

  return (
    <div className="relative w-full">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {cameraError ? (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-gray-900">
            <div className="text-center text-white">
              <X className="h-12 w-12 mx-auto text-red-500 mb-2" />
              <p className="text-lg font-medium mb-2">Erreur de caméra</p>
              <p className="text-sm text-gray-300">{cameraError}</p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => {
                  setCameraError(null);
                  startCamera();
                }}
              >
                Réessayer
              </Button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              onCanPlay={() => setIsActive(true)}
            />

            {isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p className="text-lg font-medium">Analyse en cours...</p>
              </div>
            )}

            <div className="absolute top-0 left-0 w-full h-full p-4">
              <div className="relative w-full h-full">
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="98" height="98" rx="4" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>

      <Button
        className="w-full mt-4 bg-green-600 hover:bg-green-700"
        onClick={handleCapture}
        disabled={isScanning || cameraError || !isActive}
      >
        {isScanning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyse en cours...
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4" />
            Capturer et analyser
          </>
        )}
      </Button>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
