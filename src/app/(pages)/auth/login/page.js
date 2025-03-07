'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simuler une connexion pour la démo
      setTimeout(() => {
        if (email === 'demo@example.com' && password === 'password') {
          router.push('/awareness/videos');
        } else {
          setError('Email ou mot de passe incorrect.');
        }
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/images/logo.svg"
              alt="EcoWaste Logo"
              width={80}
              height={80}
            />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connectez-vous à votre compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link href="/auth/register" className="font-medium text-green-600 hover:text-green-500">
            créez un nouveau compte
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 mb-3 text-sm bg-red-100 border border-red-200 text-red-800 rounded-md">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="email">Adresse email</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                />
                <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-900">
                  Se souvenir de moi
                </Label>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full flex items-center justify-center">
                <Image
                  src="/images/social/google.svg"
                  alt="Google"
                  width={18}
                  height={18}
                  className="mr-2"
                />
                Google
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-center">
                <Image
                  src="/images/social/facebook.svg"
                  alt="Facebook"
                  width={18}
                  height={18}
                  className="mr-2"
                />
                Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
