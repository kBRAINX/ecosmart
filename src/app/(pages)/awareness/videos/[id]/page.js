'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThumbsUp, MessageSquare, Share2, BookOpen, Award } from 'lucide-react';
import Layout from '@/components/layout/DashboardLayout';

// Mock data
import mockData from '@/data/mock-data.json';

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement depuis une API
    setTimeout(() => {
      const foundVideo = mockData.awarenessVideos.find(v => v.id === params.id);
      if (foundVideo) {
        setVideo(foundVideo);
        // Trouver des vidéos reliées (par tags)
        const related = mockData.awarenessVideos
          .filter(v => v.id !== params.id && v.tags.some(tag => foundVideo.tags.includes(tag)))
          .slice(0, 3);
        setRelatedVideos(related);
      } else {
        router.push('/awareness/videos');
      }
      setIsLoading(false);
    }, 800);
  }, [params.id, router]);

  if (isLoading || !video) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Lecteur vidéo */}
            <div className="bg-black aspect-video w-full relative rounded-lg overflow-hidden">
              <video
                controls
                poster={video.thumbnailUrl}
                className="w-full h-full"
              >
                <source src={video.videoUrl} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            </div>

            {/* Titre et actions */}
            <div className="mt-4">
              <h1 className="text-2xl font-bold">{video.title}</h1>
              <div className="flex flex-wrap items-center justify-between mt-2">
                <div className="text-sm text-gray-500">
                  {video.views.toLocaleString()} vues
                </div>

                <div className="flex space-x-4 mt-2 sm:mt-0">
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <Share2 className="mr-1" size={16} />
                    Partager
                  </Button>
                </div>
              </div>
            </div>

            {/* Onglets: Description et Quiz */}
            <div className="mt-6">
              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="quiz">Quiz associé</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-gray-700 whitespace-pre-line">
                        {video.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {video.tags.map((tag) => (
                          <Link href={`/awareness/videos?tag=${tag}`} key={tag}>
                            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 transition-colors">
                              #{tag}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="quiz" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-4">
                        <Award size={48} className="mx-auto text-green-600 mb-2" />
                        <h3 className="text-xl font-semibold mb-2">
                          Testez vos connaissances !
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Gagnez des points en répondant correctement aux questions sur cette vidéo.
                        </p>
                        <Button asChild className="bg-green-600 hover:bg-green-700">
                          <Link href={`/awareness/quiz/${video.relatedQuizId}`}>
                            Démarrer le quiz
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Vidéos similaires</h3>
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo) => (
                <Link href={`/awareness/videos/${relatedVideo.id}`} key={relatedVideo.id}>
                  <div className="flex gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                    <div className="relative w-32 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={relatedVideo.thumbnailUrl}
                        alt={relatedVideo.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                        {relatedVideo.duration}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium line-clamp-2 text-sm">
                        {relatedVideo.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {relatedVideo.views.toLocaleString()} vues
                      </p>
                    </div>
                  </div>
                </Link>
              ))}

              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/awareness/videos">
                  Voir toutes les vidéos
                </Link>
              </Button>
            </div>

            <div className="mt-8">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-lg font-semibold flex items-center">
                  <BookOpen size={18} className="mr-2 text-green-600" />
                  Le saviez-vous ?
                </h3>
                <p className="mt-2 text-sm text-gray-700">
                  Le recyclage d&apos;une tonne de plastique permet d&apos;économiser environ 2000 kg de pétrole brut.
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  Découvrez plus de faits sur l&apos;environnement et le recyclage à travers nos quiz éducatifs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
