'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Award, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/layout/DashboardLayout';

// Mock data
import mockData from '@/data/mock-data.json';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedQuizzes, setCompletedQuizzes] = useState(['q1']); // Simuler des quiz déjà complétés
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement depuis une API
    setTimeout(() => {
      setQuizzes(mockData.quizzes);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredQuizzes = quizzes.filter(quiz => {
    return quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Layout>
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Quiz éducatifs</h1>
            <p className="text-gray-600 mt-1">
              Testez vos connaissances et gagnez des points
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild variant="outline" className="mr-2">
              <Link href="/awareness/videos">
                Voir les vidéos
              </Link>
            </Button>
          </div>
        </div>

        {/* Recherche */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Rechercher un quiz..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Award className="mr-2 text-green-600" size={18} />
                Points gagnés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">125</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle2 className="mr-2 text-green-600" size={18} />
                Quiz complétés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{completedQuizzes.length}/{quizzes.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 text-green-600" size={18} />
                Temps moyen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">3:24</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste de quiz */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className={`overflow-hidden transition-shadow hover:shadow-md ${
                completedQuizzes.includes(quiz.id) ? 'border-green-200 bg-green-50' : ''
              }`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    {completedQuizzes.includes(quiz.id) && (
                      <Badge className="bg-green-600">Complété</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {quiz.description}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {Math.floor(quiz.timeLimit / 60)}:{(quiz.timeLimit % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="flex items-center">
                      <Award size={14} className="mr-1" />
                      {quiz.points} points
                    </div>
                    <div>
                      {quiz.questions.length} questions
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button asChild className={`w-full ${
                    completedQuizzes.includes(quiz.id)
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}>
                    <Link href={`/awareness/quiz/${quiz.id}`}>
                      {completedQuizzes.includes(quiz.id) ? 'Refaire le quiz' : 'Démarrer le quiz'}
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
