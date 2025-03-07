'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Camera, Upload, AlertCircle, ArrowRight, Check, Info, MapPin } from 'lucide-react';
import Layout from '@/components/layout/DashboardLayout';

// Mock data
import mockData from '@/data/mock-data.json';

export default function ScannerPage() {
  const [activeTab, setActiveTab] = useState('camera');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [wasteTypes, setWasteTypes] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setWasteTypes(mockData.wasteTypes);
  }, []);

  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [activeTab]);

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

    setScanning(true);
    setResult(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Définir les dimensions du canvas pour correspondre à la vidéo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dessiner l'image de la vidéo sur le canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Simuler un temps de traitement
    setTimeout(() => {
      scanImage();
    }, 2000);
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setScanning(true);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);

      // Simuler un temps de traitement
      setTimeout(() => {
        scanImage();
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  const scanImage = () => {
    // Simuler la détection d'un type de déchet
    const randomIndex = Math.floor(Math.random() * wasteTypes.length);
    const detectedWaste = wasteTypes[randomIndex];

    setResult({
      wasteType: detectedWaste,
      confidence: Math.random() * 30 + 70, // Valeur entre 70 et 100
      points: detectedWaste.pointsPerKg,
      nearestBin: mockData.wasteBins.find(bin => bin.types.includes(detectedWaste.id)),
    });

    setScanning(false);
  };

  const resetScan = () => {
    setResult(null);
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Layout>
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Scanner de déchets</h1>
            <p className="text-gray-600 mt-1">
              Identifiez le type de déchet et trouvez le point de collecte le plus proche
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              {result ? (
                // Résultat de la numérisation
                <div>
                  <CardHeader className="pb-2">
                    <CardTitle>Résultat de l&apos;analyse</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                      <div className="relative w-full md:w-1/3 aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {activeTab === 'upload' && uploadedImage ? (
                          <Image
                            src={uploadedImage}
                            alt="Image téléchargée"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <canvas
                            ref={canvasRef}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center">
                          <div
                            className="w-12 h-12 rounded-full mr-4 flex items-center justify-center"
                            style={{ backgroundColor: `${result.wasteType.color}20` }}
                          >
                            <Image
                              src={result.wasteType.icon}
                              alt={result.wasteType.name}
                              width={24}
                              height={24}
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">{result.wasteType.name}</h3>
                            <p className="text-gray-500 text-sm">
                              Confiance: {result.confidence.toFixed(1)}%
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 space-y-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium">Description:</p>
                            <p className="text-gray-700 mt-1">{result.wasteType.description}</p>
                          </div>

                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium">Recyclage:</p>
                            <p className="text-gray-700 mt-1">{result.wasteType.recyclingInfo}</p>
                          </div>

                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="font-medium text-green-800">Points:</p>
                            <p className="text-green-700 font-bold text-xl mt-1">{result.points} points par kg</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {result.nearestBin && (
                      <div className="mt-6 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <MapPin className="h-5 w-5 text-green-600 mr-2" />
                          <h3 className="text-lg font-semibold">Point de collecte le plus proche</h3>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <p className="font-medium">{result.nearestBin.name}</p>
                            <p className="text-gray-600 text-sm">Capacité: {result.nearestBin.capacity} • Niveau de remplissage: {result.nearestBin.fillLevel}%</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {result.nearestBin.types.map(typeId => {
                                const type = wasteTypes.find(t => t.id === typeId);
                                return (
                                  <Badge key={typeId} style={{ backgroundColor: type?.color }}>
                                    {type?.name}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>

                          <Button asChild className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700">
                            <Link href={`/map?binId=${result.nearestBin.id}`}>
                              <span className="flex items-center">
                                Voir sur la carte <ArrowRight className="ml-1 h-4 w-4" />
                              </span>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={resetScan} variant="outline" className="w-full sm:w-auto">
                      Numériser à nouveau
                    </Button>
                    <Button asChild className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                      <Link href="/map">
                        Voir tous les points de collecte
                      </Link>
                    </Button>
                  </CardFooter>
                </div>
              ) : (
                // Interface de numérisation
                <div>
                  <CardHeader>
                    <CardTitle>Numériser un déchet</CardTitle>
                    <CardDescription>
                      Utilisez l&apos;appareil photo ou téléchargez une image pour identifier le type de déchet
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <Tabs defaultValue="camera" value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="camera" className="flex items-center">
                          <Camera className="mr-2 h-4 w-4" />
                          Caméra
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="flex items-center">
                          <Upload className="mr-2 h-4 w-4" />
                          Télécharger
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="camera" className="mt-0">
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                          {cameraError ? (
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                              <Alert variant="destructive" className="w-full max-w-md">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Erreur de caméra</AlertTitle>
                                <AlertDescription>
                                  {cameraError}
                                </AlertDescription>
                              </Alert>
                            </div>
                          ) : (
                            <>
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                              />

                              {scanning && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white">
                                  <Loader2 className="h-12 w-12 animate-spin mb-4" />
                                  <p className="text-lg font-medium">Analyse en cours...</p>
                                </div>
                              )}

                              <div className="absolute top-0 left-0 w-full p-4">
                                <div className="relative w-full h-full">
                                  <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1" y="1" width="98" height="98" rx="4" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                                  </svg>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="upload" className="mt-0">
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          {uploadedImage ? (
                            <>
                              <Image
                                src={uploadedImage}
                                alt="Image téléchargée"
                                fill
                                className="object-contain"
                              />

                              {scanning && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white">
                                  <Loader2 className="h-12 w-12 animate-spin mb-4" />
                                  <p className="text-lg font-medium">Analyse en cours...</p>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <Upload className="h-12 w-12 text-gray-400 mb-4" />
                              <p className="text-gray-500 font-medium mb-2">Glissez-déposez ou cliquez pour télécharger</p>
                              <p className="text-gray-400 text-sm">Formats acceptés: JPG, PNG</p>
                              <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleUpload}
                                ref={fileInputRef}
                                disabled={scanning}
                              />
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>

                  <CardFooter>
                    {activeTab === 'camera' ? (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={handleCapture}
                        disabled={scanning || cameraError}
                      >
                        {scanning ? (
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
                    ) : (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={scanning || uploadedImage}
                      >
                        {scanning ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyse en cours...
                          </>
                        ) : uploadedImage ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Image téléchargée
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Sélectionner une image
                          </>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Info className="mr-2 h-5 w-5 text-green-600" />
                  Guide d&apos;utilisation
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <span className="text-green-800 font-bold">1</span>
                  </div>
                  <p className="text-gray-700">
                    Positionnez votre déchet dans le cadre ou téléchargez une photo claire du déchet.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <span className="text-green-800 font-bold">2</span>
                  </div>
                  <p className="text-gray-700">
                    Notre système d&apos;IA analysera l&apos;image et identifiera le type de déchet.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <span className="text-green-800 font-bold">3</span>
                  </div>
                  <p className="text-gray-700">
                    Consultez les informations sur le recyclage et les points de collecte les plus proches.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <span className="text-green-800 font-bold">4</span>
                  </div>
                  <p className="text-gray-700">
                    Déposez votre déchet au point de collecte et gagnez des points!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Types de déchets</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {wasteTypes.map((type) => (
                    <div key={type.id} className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full mr-3 flex items-center justify-center"
                        style={{ backgroundColor: `${type.color}20` }}
                      >
                        <Image
                          src={type.icon}
                          alt={type.name}
                          width={16}
                          height={16}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{type.name}</p>
                        <p className="text-xs text-gray-500">{type.pointsPerKg} points/kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </Layout>
  );
}
