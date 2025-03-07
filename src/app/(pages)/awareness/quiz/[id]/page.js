'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, CheckCircle, XCircle, Award } from 'lucide-react';
import Layout from '@/components/layout/DashboardLayout';

// Mock data
import mockData from '@/data/mock-data.json';

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const timerRef = useRef(null);

  useEffect(() => {
    // Simuler un chargement depuis une API
    setTimeout(() => {
      const foundQuiz = mockData.quizzes.find(q => q.id === params.id);
      if (foundQuiz) {
        setQuiz(foundQuiz);
        setTimeLeft(foundQuiz.timeLimit);
      } else {
        router.push('/awareness/quiz');
      }
      setIsLoading(false);
    }, 800);
  }, [params.id, router]);

  useEffect(() => {
    if (!quiz || isQuizCompleted || !timeLeft) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!isQuizCompleted) {
            setIsQuizCompleted(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quiz, isQuizCompleted, timeLeft]);

  const handleAnswerSelect = (index) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setIsAnswerSubmitted(true);

    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex >= quiz.questions.length - 1) {
      // Quiz is finished
      setIsQuizCompleted(true);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculatePointsEarned = () => {
    if (!quiz) return 0;
    const percentage = (score / quiz.questions.length);
    return Math.round(quiz.points * percentage);
  };

  if (isLoading || !quiz) {
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
      <div className="py-6 max-w-3xl mx-auto">
        {!isQuizCompleted ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">{quiz.title}</h1>
                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                  <Clock size={16} className="mr-1 text-gray-600" />
                  <span className="text-gray-700 font-medium">{formatTime(timeLeft)}</span>
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestionIndex + 1} / {quiz.questions.length}</span>
                <span>{calculatePointsEarned()} / {quiz.points} points</span>
              </div>

              <Progress value={(currentQuestionIndex / quiz.questions.length) * 100} className="h-2" />
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">
                  {quiz.questions[currentQuestionIndex].question}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <RadioGroup value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}>
                  {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${
                        selectedAnswer === index ? 'bg-gray-100' : ''
                      } ${
                        isAnswerSubmitted && index === quiz.questions[currentQuestionIndex].correctAnswer
                          ? 'bg-green-100'
                          : ''
                      } ${
                        isAnswerSubmitted && selectedAnswer === index && index !== quiz.questions[currentQuestionIndex].correctAnswer
                          ? 'bg-red-100'
                          : ''
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                        disabled={isAnswerSubmitted}
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-grow cursor-pointer"
                      >
                        {option}
                      </Label>

                      {isAnswerSubmitted && index === quiz.questions[currentQuestionIndex].correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}

                      {isAnswerSubmitted && selectedAnswer === index && index !== quiz.questions[currentQuestionIndex].correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  ))}
                </RadioGroup>

                {isAnswerSubmitted && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">Explication :</p>
                    <p className="text-gray-700 mt-1">
                      {quiz.questions[currentQuestionIndex].explanation}
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between">
                {!isAnswerSubmitted ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Valider ma réponse
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {currentQuestionIndex >= quiz.questions.length - 1 ? 'Terminer le quiz' : 'Question suivante'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </>
        ) : (
          // Results screen
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Quiz terminé !</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="py-6">
                <Award size={64} className="mx-auto text-green-600 mb-4" />

                <h3 className="text-xl font-bold mb-2">
                  Vous avez obtenu {score} / {quiz.questions.length} bonnes réponses
                </h3>

                <div className="w-36 h-36 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {calculatePointsEarned()}
                    </p>
                    <p className="text-sm text-gray-600">points gagnés</p>
                  </div>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                    <span className="text-gray-700">Temps utilisé:</span>
                    <span className="font-medium">{formatTime(quiz.timeLimit - timeLeft)}</span>
                  </div>

                  <div className="flex justify-between p-3 bg-gray-50 rounded-md">
                    <span className="text-gray-700">Score:</span>
                    <span className="font-medium">{Math.round((score / quiz.questions.length) * 100)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href={`/awareness/quiz/${quiz.id}`}>
                  Refaire le quiz
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/awareness/quiz">
                  Tous les quiz
                </Link>
              </Button>
              <Button asChild className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                <Link href="/awareness/videos">
                  Explorer les vidéos
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
}
