import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import VideoPreview from '@/components/ui/VideoPreview';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-green-600/80 z-10" />
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/landing-background.mp4" type="video/mp4" />
        </video>

        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <Image
            src="/images/logo.svg"
            alt="EcoWaste Logo"
            width={120}
            height={120}
            className="mb-6"
          />
          <h1 className="text-4xl md:text-6xl font-bold mb-4">EcoWaste</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Transformez vos déchets en opportunités économiques tout en préservant notre planète
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-green-500 hover:bg-green-600">
              <Link href="/auth/register">
                Commencer maintenant
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link href="#how-it-works">
                Comment ça marche
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos fonctionnalités</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-green-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/images/icons/awareness.svg"
                  alt="Sensibilisation"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sensibilisation</h3>
              <p className="text-gray-600">Apprenez tout sur le recyclage à travers des vidéos et des quiz interactifs</p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/images/icons/scanner.svg"
                  alt="Scanner"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Scanner</h3>
              <p className="text-gray-600">Identifiez facilement le type de déchets grâce à notre technologie de reconnaissance</p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/images/icons/map.svg"
                  alt="Carte"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Carte</h3>
              <p className="text-gray-600">Localisez les points de collecte les plus proches et trouvez le chemin optimal</p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/images/icons/rewards.svg"
                  alt="Récompenses"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Récompenses</h3>
              <p className="text-gray-600">Gagnez des points et convertissez-les en argent réel via MTN, Orange ou carte bancaire</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>

          <div className="max-w-4xl mx-auto">
            <VideoPreview
              src="/videos/how-it-works.mp4"
              poster="/images/video-thumbnail.jpg"
              className="w-full rounded-2xl shadow-lg"
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-md text-green-600 font-bold text-xl">1</div>
                <h3 className="text-xl font-semibold mb-2">Scannez vos déchets</h3>
                <p className="text-gray-600">Utilisez notre scanner pour identifier le type de déchets</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-md text-green-600 font-bold text-xl">2</div>
                <h3 className="text-xl font-semibold mb-2">Déposez à un point de collecte</h3>
                <p className="text-gray-600">Trouvez le point de collecte le plus proche sur la carte</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-md text-green-600 font-bold text-xl">3</div>
                <h3 className="text-xl font-semibold mb-2">Gagnez des récompenses</h3>
                <p className="text-gray-600">Cumulez des points et convertissez-les en argent réel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ce que nos utilisateurs disent</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/testimonials/user1.jpg"
                  alt="User"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">Thomas N.</h4>
                  <p className="text-gray-500 text-sm">Douala</p>
                </div>
              </div>
              <p className="text-gray-600 italic">&ldquo;Grâce à EcoWaste, j&apos;ai pu financer une partie de mes études tout en contribuant à la protection de l&apos;environnement. Une application innovante !&ldquo;</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/testimonials/user2.jpg"
                  alt="User"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">Aïcha M.</h4>
                  <p className="text-gray-500 text-sm">Yaoundé</p>
                </div>
              </div>
              <p className="text-gray-600 italic">&ldquo;J&apos;ai appris énormément sur le recyclage grâce aux vidéos et aux quiz. Maintenant, toute ma famille est impliquée dans la gestion des déchets !&ldquo;</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/testimonials/user3.jpg"
                  alt="User"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">Pascal K.</h4>
                  <p className="text-gray-500 text-sm">Bafoussam</p>
                </div>
              </div>
              <p className="text-gray-600 italic">&ldquo;La carte des points de collecte est très pratique et m&apos;a permis de découvrir des endroits où je pouvais déposer mes déchets près de chez moi.&ldquo;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à faire la différence ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Rejoignez notre communauté et commencez à transformer vos déchets en opportunités dès aujourd&apos;hui.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Link href="/auth/register">
                Créer un compte
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link href="/auth/login">
                Se connecter
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/images/logo-white.svg"
                alt="EcoWaste Logo"
                width={80}
                height={80}
                className="mb-4"
              />
              <p className="text-gray-400">Transformez vos déchets en opportunités économiques tout en préservant notre planète.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Accueil</Link></li>
                <li><Link href="/awareness/videos" className="text-gray-400 hover:text-white transition-colors">Vidéos</Link></li>
                <li><Link href="/awareness/quiz" className="text-gray-400 hover:text-white transition-colors">Quiz</Link></li>
                <li><Link href="/scanner" className="text-gray-400 hover:text-white transition-colors">Scanner</Link></li>
                <li><Link href="/map" className="text-gray-400 hover:text-white transition-colors">Carte</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">info@ecowaste.com</li>
                <li className="text-gray-400">+237 6XX XXX XXX</li>
                <li className="text-gray-400">Douala, Cameroun</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Image src="/images/social/facebook.svg" alt="Facebook" width={24} height={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Image src="/images/social/twitter.svg" alt="Twitter" width={24} height={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Image src="/images/social/instagram.svg" alt="Instagram" width={24} height={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Image src="/images/social/youtube.svg" alt="YouTube" width={24} height={24} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} EcoWaste. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
