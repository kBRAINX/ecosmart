'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { MapPin, Filter, List, Search, Navigation, X, Plus, Minus, RefreshCw, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/DashboardLayout';

// Mock data
import mockData from '@/data/mock-data.json';

export default function MapPage() {
  const searchParams = useSearchParams();
  const [bins, setBins] = useState([]);
  const [wasteTypes, setWasteTypes] = useState([]);
  const [selectedBin, setSelectedBin] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isMobileListView, setIsMobileListView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mapZoom, setMapZoom] = useState(15);
  const [mapCenter, setMapCenter] = useState(null);
  const [directionsShown, setDirectionsShown] = useState(false);

  // Référence pour l'élément carte (serait utilisé avec une bibliothèque de cartes réelle)
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialiser les données
    setBins(mockData.wasteBins);
    setWasteTypes(mockData.wasteTypes);

    // Simuler la géolocalisation de l'utilisateur
    setTimeout(() => {
      setUserLocation({
        latitude: 4.060536,
        longitude: 9.786172
      });
      setMapCenter({
        latitude: 4.060536,
        longitude: 9.786172
      });
      setIsLoading(false);
    }, 1000);

    // Vérifier si un binId est spécifié dans l'URL
    const binId = searchParams.get('binId');
    if (binId) {
      const bin = mockData.wasteBins.find(b => b.id === binId);
      if (bin) {
        setSelectedBin(bin);
        setMapCenter(bin.location);
      }
    }
  }, [searchParams]);

  // Filtrer les points de collecte en fonction de la recherche et des filtres
  const filteredBins = bins.filter(bin => {
    // Filtre de recherche
    const matchesSearch = bin.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtre par type de déchet
    const matchesType = activeFilters.length === 0 ||
                        bin.types.some(type => activeFilters.includes(type));

    return matchesSearch && matchesType;
  });

    // Calculer la distance entre deux coordonnées (formule de Haversine simplifiée)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Rayon de la Terre en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        return distance;
        };

        const formatDistance = (distance) => {
        if (distance < 1) {
            return `${Math.round(distance * 1000)} m`;
        }
        return `${distance.toFixed(1)} km`;
    };

  // Trier les points de collecte par distance si la localisation de l'utilisateur est disponible
  const sortedBins = [...filteredBins].sort((a, b) => {
    if (!userLocation) return 0;

    const distanceA = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      a.location.latitude,
      a.location.longitude
    );

    const distanceB = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      b.location.latitude,
      b.location.longitude
    );

    return distanceA - distanceB;
  });


  const handleFilterChange = (typeId) => {
    setActiveFilters(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
  };

  const selectBin = (bin) => {
    setSelectedBin(bin);
    setMapCenter(bin.location);
    setDirectionsShown(false);
  };

  const showDirections = () => {
    if (userLocation && selectedBin) {
      setDirectionsShown(true);
      // Dans une implémentation réelle, on utiliserait un service de calcul d'itinéraire
    }
  };

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
      setSelectedBin(null);
      setDirectionsShown(false);
    }
  };

  return (
    <Layout>
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Carte des points de collecte</h1>
            <p className="text-gray-600 mt-1">
              Trouvez les points de collecte près de chez vous
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex">
            <Button
              variant="outline"
              className="mr-2 md:hidden"
              onClick={() => setIsMobileListView(!isMobileListView)}
            >
              {isMobileListView ? <MapPin size={16} /> : <List size={16} />}
              <span className="ml-2">{isMobileListView ? 'Voir la carte' : 'Liste des points'}</span>
            </Button>
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => setIsFilterDrawerOpen(true)}
            >
              <Filter size={16} />
              <span className="ml-2">Filtres</span>
              {activeFilters.length > 0 && (
                <Badge className="ml-2 bg-green-600" variant="secondary">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={resetView}
              disabled={!userLocation}
            >
              <Navigation size={16} />
              <span className="ml-2">Ma position</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Liste des points de collecte (visible sur mobile uniquement en mode liste) */}
          <div className={`md:block ${isMobileListView ? 'block' : 'hidden'}`}>
            <Card className="h-[calc(100vh-12rem)] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>Points de collecte</span>
                  <Badge variant="outline" className="font-normal">
                    {sortedBins.length} résultats
                  </Badge>
                </CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Rechercher un point..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchQuery('')}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </CardHeader>

              <div className="p-3 border-t border-gray-100 bg-gray-50 flex gap-2 overflow-x-auto">
                {activeFilters.length > 0 ? (
                  <>
                    {activeFilters.map(typeId => {
                      const type = wasteTypes.find(t => t.id === typeId);
                      return (
                        <Badge
                          key={typeId}
                          className="bg-green-600"
                          onClick={() => handleFilterChange(typeId)}
                        >
                          {type?.name} <X size={12} className="ml-1" />
                        </Badge>
                      );
                    })}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-gray-500 hover:text-gray-700"
                      onClick={clearFilters}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </>
                ) : (
                  <span className="text-gray-500 text-sm">Aucun filtre actif</span>
                )}
              </div>

              <div className="overflow-y-auto h-[calc(100%-8rem)]">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : sortedBins.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <MapPin className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">Aucun point de collecte correspondant à vos critères</p>
                    <Button variant="link" onClick={clearFilters}>
                      Effacer les filtres
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 p-3">
                    {sortedBins.map((bin) => (
                      <div
                        key={bin.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedBin?.id === bin.id ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50 border border-transparent'
                        }`}
                        onClick={() => selectBin(bin)}
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium">{bin.name}</h3>
                          {userLocation && (
                            <span className="text-sm text-gray-500">
                              {formatDistance(calculateDistance(
                                userLocation.latitude,
                                userLocation.longitude,
                                bin.location.latitude,
                                bin.location.longitude
                              ))}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            bin.fillLevel < 50 ? 'bg-green-500' : bin.fillLevel < 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></span>
                          Niveau de remplissage: {bin.fillLevel}%
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {bin.types.map(typeId => {
                            const type = wasteTypes.find(t => t.id === typeId);
                            return (
                              <Badge
                                key={typeId}
                                variant="outline"
                                className="text-xs"
                                style={{ borderColor: type?.color, color: type?.color }}
                              >
                                {type?.name}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Carte (visible sur mobile uniquement en mode carte) */}
          <div className={`md:col-span-2 md:block ${isMobileListView ? 'hidden' : 'block'}`}>
            <Card className="h-[calc(100vh-12rem)] overflow-hidden relative">
              {/* Simuler une carte avec un placeholder */}
              <div className="absolute inset-0 bg-gray-200">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  </div>
                ) : (
                  <div className="h-full w-full relative" ref={mapRef}>
                    {/* Dans une implémentation réelle, ici nous aurions une bibliothèque de cartes comme Mapbox ou Google Maps */}
                    <div className="absolute inset-0 bg-blue-50"></div>

                    {/* Afficher les points de collecte sur la carte */}
                    {filteredBins.map((bin) => (
                      <div
                        key={bin.id}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                          selectedBin?.id === bin.id ? 'z-20' : 'z-10'
                        }`}
                        style={{
                          left: `${50 + (bin.location.longitude - 9.785) * 2000}%`,
                          top: `${50 - (bin.location.latitude - 4.06) * 2000}%`
                        }}
                        onClick={() => selectBin(bin)}
                      >
                        <div className={`flex flex-col items-center ${selectedBin?.id === bin.id ? 'scale-125' : ''}`}>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                              selectedBin?.id === bin.id ? 'border-green-700 bg-green-600' : 'border-gray-300 bg-white'
                            }`}
                          >
                            <MapPin className={`h-4 w-4 ${selectedBin?.id === bin.id ? 'text-white' : 'text-gray-500'}`} />
                          </div>
                          {selectedBin?.id === bin.id && (
                            <div className="mt-1 bg-white px-2 py-1 rounded-md shadow-md text-xs font-medium">
                              {bin.name}
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
                          left: `${50 + (userLocation.longitude - 9.785) * 2000}%`,
                          top: `${50 - (userLocation.latitude - 4.06) * 2000}%`
                        }}
                      >
                        <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md pulse-animation"></div>
                      </div>
                    )}

                    {/* Afficher l'itinéraire (si demandé) */}
                    {directionsShown && selectedBin && userLocation && (
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
                            d={`M${50 + (userLocation.longitude - 9.785) * 2000},${50 - (userLocation.latitude - 4.06) * 2000}
                              L${50 + (selectedBin.location.longitude - 9.785) * 2000},${50 - (selectedBin.location.latitude - 4.06) * 2000}`}
                            stroke="#3B82F6"
                            strokeWidth="3"
                            strokeDasharray="5,5"
                            fill="none"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </div>

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
                >
                  <RefreshCw size={18} />
                </Button>
              </div>

              {/* Détails du point de collecte sélectionné */}
              {selectedBin && (
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <Card className="shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between items-start">
                        <span>{selectedBin.name}</span>
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => setSelectedBin(null)}
                        >
                          <X size={18} />
                        </button>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="pb-4">
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              selectedBin.fillLevel < 50 ? 'bg-green-500' : selectedBin.fillLevel < 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></span>
                            Niveau de remplissage: {selectedBin.fillLevel}%
                          </div>

                          <p className="text-sm text-gray-500 mb-2">
                            Capacité: {selectedBin.capacity}
                          </p>

                          <p className="text-sm text-gray-500 mb-3">
                            Dernière vidange: {new Date(selectedBin.lastEmptied).toLocaleDateString()}
                          </p>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {selectedBin.types.map(typeId => {
                              const type = wasteTypes.find(t => t.id === typeId);
                              return (
                                <Badge
                                  key={typeId}
                                  variant="outline"
                                  className="text-xs"
                                  style={{ borderColor: type?.color, color: type?.color }}
                                >
                                  {type?.name}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>

                        {userLocation && (
                          <div className="mt-3 sm:mt-0 flex flex-col items-center sm:items-end">
                            <div className="text-center sm:text-right">
                              <p className="text-sm text-gray-500">Distance</p>
                              <p className="text-2xl font-bold">
                                {formatDistance(calculateDistance(
                                  userLocation.latitude,
                                  userLocation.longitude,
                                  selectedBin.location.latitude,
                                  selectedBin.location.longitude
                                ))}
                              </p>
                            </div>

                            <Button
                              className="mt-2 bg-green-600 hover:bg-green-700"
                              onClick={showDirections}
                              disabled={directionsShown}
                            >
                              {directionsShown ? 'Itinéraire affiché' : 'Afficher l\'itinéraire'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Drawer pour les filtres sur mobile */}
      <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filtrer par type de déchets</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <div className="space-y-4">
              {wasteTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filter-${type.id}`}
                    checked={activeFilters.includes(type.id)}
                    onCheckedChange={() => handleFilterChange(type.id)}
                  />
                  <label
                    htmlFor={`filter-${type.id}`}
                    className="flex items-center cursor-pointer"
                  >
                    <div
                      className="w-6 h-6 rounded-full mr-2 flex items-center justify-center"
                      style={{ backgroundColor: `${type.color}20` }}
                    >
                      <Image
                        src={type.icon}
                        alt={type.name}
                        width={12}
                        height={12}
                      />
                    </div>
                    <span>{type.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <DrawerFooter>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="mb-2"
            >
              Effacer les filtres
            </Button>
            <Button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="bg-green-600 hover:bg-green-700"
            >
              Appliquer les filtres
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Style pour l'animation de pulsation */}
      <style jsx global>{`
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
    </Layout>
  );
}
