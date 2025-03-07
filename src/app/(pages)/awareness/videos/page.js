'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, ThumbsUp, Eye, PlayCircle } from 'lucide-react';
import Layout from '@/components/layout/DashboardLayout';

// Mock data (dans un vrai projet, cela viendrait d'une API)
import mockData from '@/data/mock-data.json';

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Simuler un chargement depuis une API
    setTimeout(() => {
      setVideos(mockData.awarenessVideos);
    }, 500);
  }, []);

  const filteredVideos = videos.filter(video => {
    // Filtrer par recherche
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtrer par catégorie
    const matchesCategory = selectedCategory === 'all' || video.tags.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'tri', name: 'Tri des déchets' },
    { id: 'recyclage', name: 'Recyclage' },
    { id: 'plastique', name: 'Plastique' },
    { id: 'économie circulaire', name: 'Économie circulaire' },
  ];

  return (
    <Layout>
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Vidéos éducatives</h1>
            <p className="text-gray-600 mt-1">
              Découvrez comment mieux gérer vos déchets et protéger l&apos;environnement
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex">
            <Button asChild variant="outline" className="mr-2">
              <Link href="/awareness/quiz">
                Voir les quiz
              </Link>
            </Button>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="#popular">
                Vidéos populaires
              </Link>
            </Button>
          </div>
        </div>

        {/* Recherche et filtres */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Rechercher une vidéo..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`cursor-pointer ${selectedCategory === category.id ? 'bg-green-600' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Liste de vidéos */}
        {videos.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <Link href={`/awareness/videos/${video.id}`}>
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="object-cover"
                      width={500}
                      height={281}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <PlayCircle className="text-white" size={48} />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center">
                      <Clock size={12} className="mr-1" />
                      {video.duration}
                    </div>
                  </div>
                </Link>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    <Link href={`/awareness/videos/${video.id}`}>
                      {video.title}
                    </Link>
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-2">
                  <CardDescription className="line-clamp-2">
                    {video.description}
                  </CardDescription>
                </CardContent>

                <CardFooter className="flex justify-between pt-0">
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye size={14} className="mr-1" />
                    {video.views.toLocaleString()}
                    <ThumbsUp size={14} className="ml-3 mr-1" />
                    {video.likesCount.toLocaleString()}
                  </div>

                  <Button asChild variant="outline" size="sm">
                    <Link href={`/awareness/quiz/${video.relatedQuizId}`}>
                      Quiz associé
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
