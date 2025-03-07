'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Évaluer la force du mot de passe
    if (name === 'password') {
      const strength = evaluatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const evaluatePasswordStrength = (password) => {
    // Calculer la force du mot de passe (1-5)
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return strength;
  };

  const getStrengthColor = () => {
    if (passwordStrength < 2) return 'bg-red-500';
    if (passwordStrength < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 2) return 'Faible';
    if (passwordStrength < 4) return 'Moyen';
    return 'Fort';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation basique
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 3) {
      setError('Veuillez choisir un mot de passe plus fort.');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError('Vous devez accepter les conditions d\'utilisation.');
      setIsLoading(false);
      return;
    }

    try {
      // Simuler l'inscription pour la démo
      setTimeout(() => {
        router.push('/auth/login');
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
          Créez votre compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link href="/auth/login" className="font-medium text-green-600 hover:text-green-500">
            connectez-vous à votre compte existant
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <div className="mt-1">
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Jean"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="lastName">Nom</Label>
                <div className="mt-1">
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Dupont"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Adresse email</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()}`}
                      style={{ width: `${passwordStrength * 20}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Force: {getStrengthText()}
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => setFormData({...formData, agreeTerms: checked})}
              />
              <Label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-900">
                J&apos;accepte les{' '}
                <Link href="/terms" className="font-medium text-green-600 hover:text-green-500">
                  conditions d&apos;utilisation
                </Link>{' '}
                et la{' '}
                <Link href="/privacy" className="font-medium text-green-600 hover:text-green-500">
                  politique de confidentialité
                </Link>
              </Label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Création en cours...' : 'Créer un compte'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou s&apos;inscrire avec</span>
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
