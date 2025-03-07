// components/layout/DashboardLayout.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Bell, Menu, Home, BookOpen, Camera, MapPin, Settings, LogOut, ChevronDown, Search, Sun, Moon, User, Wallet } from 'lucide-react';

// Mock data
import mockData from '@/data/mock-data.json';

export default function Layout({ children }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement depuis une API
    setTimeout(() => {
      setUser(mockData.users[0]);
      setIsLoading(false);
    }, 500);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const navigationItems = [
    {
      name: 'Accueil',
      href: '/dashboard',
      icon: Home
    },
    {
      name: 'Sensibilisation',
      href: '/awareness/videos',
      icon: BookOpen,
      submenu: [
        { name: 'Vidéos', href: '/awareness/videos' },
        { name: 'Quiz', href: '/awareness/quiz' }
      ]
    },
    {
      name: 'Scanner',
      href: '/scanner',
      icon: Camera
    },
    {
      name: 'Carte',
      href: '/map',
      icon: MapPin
    },
    {
      name: 'Paramètres',
      href: '/settings',
      icon: Settings
    }
  ];

  const isActive = (path) => {
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true;
    }

    // Vérifier si le chemin actuel commence par le chemin de l'élément de navigation
    return path !== '/dashboard' && pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="px-2 py-6">
                  <Link href="/" className="flex items-center mb-6">
                    <Image
                      src="/images/logo.svg"
                      alt="EcoWaste Logo"
                      width={40}
                      height={40}
                      className="mr-2"
                    />
                    <span className="text-xl font-bold">EcoWaste</span>
                  </Link>

                  <nav className="space-y-2">
                    {navigationItems.map((item) => (
                      <div key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? 'bg-green-50 text-green-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </Link>

                        {item.submenu && isActive(item.href) && (
                          <div className="ml-5 mt-1 space-y-1">
                            {item.submenu.map((subitem) => (
                              <Link
                                key={subitem.href}
                                href={subitem.href}
                                className={`flex items-center px-3 py-1 rounded-md text-sm transition-colors ${
                                  pathname === subitem.href
                                    ? 'text-green-700 font-medium'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {subitem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>

                  {user && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={toggleTheme}
                        >
                          {theme === 'light' ? (
                            <Moon className="h-4 w-4 mr-2" />
                          ) : (
                            <Sun className="h-4 w-4 mr-2" />
                          )}
                          Thème
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <Link href="/">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sortir
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.svg"
                alt="EcoWaste Logo"
                width={36}
                height={36}
                className="mr-2"
              />
              <span className="text-lg font-bold hidden md:block">EcoWaste</span>
            </Link>

            <nav className="ml-6 hidden md:flex space-x-1">
              {navigationItems.map((item) => (
                <div key={item.href} className="relative group">
                  {item.submenu ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`px-3 flex items-center ${
                            isActive(item.href) ? 'text-green-700' : 'text-gray-700'
                          }`}
                        >
                          <item.icon className="mr-1 h-4 w-4" />
                          <span className="mr-1">{item.name}</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {item.submenu.map((subitem) => (
                          <DropdownMenuItem key={subitem.href} asChild>
                            <Link
                              href={subitem.href}
                              className={pathname === subitem.href ? 'text-green-700 font-medium' : ''}
                            >
                              {subitem.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        className={`px-3 flex items-center ${
                          isActive(item.href) ? 'text-green-700' : 'text-gray-700'
                        }`}
                      >
                        <item.icon className="mr-1 h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-1 relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-green-600">
                3
              </Badge>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="font-normal flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left mr-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.points} points</p>
                    </div>
                    <ChevronDown className="h-4 w-4 hidden md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings?tab=points" className="flex items-center">
                      <Wallet className="mr-2 h-4 w-4" />
                      Mes points
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme} className="flex items-center">
                    {theme === 'light' ? (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        Mode sombre
                      </>
                    ) : (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        Mode clair
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Se déconnecter
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/auth/login">Se connecter</Link>
                </Button>
                <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                  <Link href="/auth/register">S&apos;inscrire</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                src="/images/logo.svg"
                alt="EcoWaste Logo"
                width={30}
                height={30}
                className="mr-2"
              />
              <span className="text-sm font-semibold">EcoWaste</span>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <Link href="/about" className="hover:text-gray-900">À propos</Link>
              <Link href="/privacy" className="hover:text-gray-900">Confidentialité</Link>
              <Link href="/terms" className="hover:text-gray-900">Conditions d&apos;utilisation</Link>
              <Link href="/contact" className="hover:text-gray-900">Contact</Link>
            </div>

            <div className="mt-4 md:mt-0 text-sm text-gray-500">
              &copy; {new Date().getFullYear()} EcoWaste. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
