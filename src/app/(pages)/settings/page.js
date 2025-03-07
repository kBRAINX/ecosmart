'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { User, Coins, LogOut, Trash2, Edit, Camera, Plus, Award, Wallet, Calendar, CheckCircle, BarChart2, Clock, ArrowRight, CheckCircle2, X, AlertTriangle, Minus } from 'lucide-react';
import Layout from '@/components/layout/DashboardLayout';

// Mock data
import mockData from '@/data/mock-data.json';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [withdrawalMethods, setWithdrawalMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [confirmNumber, setConfirmNumber] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // État du formulaire d'édition de profil
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    language: 'fr',
    darkMode: false,
    notifications: true
  });

  useEffect(() => {
    // Simuler un chargement depuis une API
    setTimeout(() => {
      setUser(mockData.users[0]);
      setWithdrawalMethods(mockData.withdrawalMethods);

      // Filtrer les transactions de l'utilisateur
      const userTransactions = mockData.transactions.filter(
        t => t.userId === mockData.users[0].id
      );
      setTransactions(userTransactions);

      // Initialiser le formulaire d'édition
      setProfileForm({
        name: mockData.users[0].name,
        email: mockData.users[0].email,
        phone: '655 123 456', // Exemple de téléphone (non présent dans les données mock)
        language: mockData.users[0].preferences.language,
        darkMode: mockData.users[0].preferences.darkMode,
        notifications: mockData.users[0].preferences.notifications
      });

      setIsLoading(false);
    }, 800);
  }, []);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuler une mise à jour du profil
    setTimeout(() => {
      // Mettre à jour l'utilisateur avec les nouvelles données
      setUser(prev => ({
        ...prev,
        name: profileForm.name,
        email: profileForm.email,
        preferences: {
          ...prev.preferences,
          language: profileForm.language,
          darkMode: profileForm.darkMode,
          notifications: profileForm.notifications
        }
      }));

      setIsEditing(false);
      setIsLoading(false);
    }, 1000);
  };

  const cancelEdit = () => {
    // Réinitialiser le formulaire avec les valeurs actuelles
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
        phone: '655 123 456',
        language: user.preferences.language,
        darkMode: user.preferences.darkMode,
        notifications: user.preferences.notifications
      });
    }
    setIsEditing(false);
  };

  const handleWithdrawSubmit = () => {
    setWithdrawError('');
    setIsWithdrawLoading(true);

    // Valider les champs
    if (!withdrawAmount || !selectedMethod || !confirmNumber) {
      setWithdrawError('Veuillez remplir tous les champs.');
      setIsWithdrawLoading(false);
      return;
    }

    const amount = parseInt(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawError('Montant invalide.');
      setIsWithdrawLoading(false);
      return;
    }

    // Vérifier que l'utilisateur a suffisamment de points
    const pointsNeeded = amount / 5; // 5 points = 1 XAF
    if (user && pointsNeeded > user.points) {
      setWithdrawError('Vous n\'avez pas assez de points.');
      setIsWithdrawLoading(false);
      return;
    }

    // Simuler une transaction
    setTimeout(() => {
      setIsWithdrawLoading(false);
      setWithdrawSuccess(true);

      // Mettre à jour le solde de points de l'utilisateur
      setUser(prev => ({
        ...prev,
        points: prev.points - pointsNeeded
      }));

      // Ajouter la transaction à l'historique
      const newTransaction = {
        id: `t${transactions.length + 1}`,
        userId: user.id,
        type: 'withdrawal',
        amount: amount,
        points: pointsNeeded,
        method: selectedMethod,
        status: 'completed',
        timestamp: new Date().toISOString(),
        reference: `${selectedMethod.toUpperCase()}-${Math.floor(Math.random() * 100000)}`
      };

      setTransactions(prev => [newTransaction, ...prev]);
    }, 2000);
  };

  const closeWithdrawDialog = () => {
    setShowWithdrawDialog(false);
    setWithdrawAmount('');
    setSelectedMethod('');
    setConfirmNumber('');
    setWithdrawError('');
    setWithdrawSuccess(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading || !user) {
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-gray-600 mt-1">
              Gérez votre profil et vos préférences
            </p>
          </div>
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full max-w-md">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="points" className="flex items-center">
              <Coins className="mr-2 h-4 w-4" />
              Points
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="flex items-center">
              <Wallet className="mr-2 h-4 w-4" />
              Retrait
            </TabsTrigger>
          </TabsList>

          {/* Onglet Profil */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Informations personnelles
                      {!isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="flex items-center"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    {isEditing ? (
                      <form onSubmit={handleProfileSubmit}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Nom complet</Label>
                            <Input
                              id="name"
                              value={profileForm.name}
                              onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="email">Adresse email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileForm.email}
                              onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="phone">Numéro de téléphone</Label>
                            <Input
                              id="phone"
                              value={profileForm.phone}
                              onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                            />
                          </div>

                          <div>
                            <Label htmlFor="language">Langue</Label>
                            <Select
                              value={profileForm.language}
                              onValueChange={(value) => setProfileForm({...profileForm, language: value})}
                            >
                              <SelectTrigger id="language">
                                <SelectValue placeholder="Sélectionner une langue" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fr">Français</SelectItem>
                                <SelectItem value="en">Anglais</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="dark-mode"
                                checked={profileForm.darkMode}
                                onCheckedChange={(checked) => setProfileForm({...profileForm, darkMode: checked})}
                              />
                              <Label htmlFor="dark-mode">Mode sombre</Label>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="notifications"
                                checked={profileForm.notifications}
                                onCheckedChange={(checked) => setProfileForm({...profileForm, notifications: checked})}
                              />
                              <Label htmlFor="notifications">Notifications</Label>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={cancelEdit}>
                            Annuler
                          </Button>
                          <Button type="submit" className="bg-green-600 hover:bg-green-700">
                            Enregistrer
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Nom complet</p>
                            <p>{user.name}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Adresse email</p>
                            <p>{user.email}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Numéro de téléphone</p>
                            <p>655 123 456</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Langue</p>
                            <p>{user.preferences.language === 'fr' ? 'Français' : 'Anglais'}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <h3 className="text-sm font-medium text-gray-500 mb-3">Préférences</h3>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p>Mode sombre</p>
                              <Badge variant={user.preferences.darkMode ? 'default' : 'outline'}>
                                {user.preferences.darkMode ? 'Activé' : 'Désactivé'}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                              <p>Notifications</p>
                              <Badge variant={user.preferences.notifications ? 'default' : 'outline'}>
                                {user.preferences.notifications ? 'Activées' : 'Désactivées'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Sécurité</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Mot de passe</p>
                          <p className="text-sm text-gray-500">Dernière modification il y a 3 mois</p>
                        </div>
                        <Button variant="outline">Modifier</Button>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full sm:w-auto">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer mon compte
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                Supprimer mon compte
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Photo de profil</CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col items-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                            <Camera className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Modifier votre photo de profil</DialogTitle>
                            <DialogDescription>
                              Téléchargez une nouvelle photo ou choisissez parmi nos avatars.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-3 gap-2 my-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                              <div
                                key={i}
                                className="aspect-square rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-green-600 transition-colors"
                              >
                                <Image
                                  src={`/images/avatars/avatar${i}.png`}
                                  alt={`Avatar ${i}`}
                                  width={100}
                                  height={100}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="relative border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                            <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Télécharger une photo</p>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Annuler</Button>
                            <Button className="bg-green-600 hover:bg-green-700">Enregistrer</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="mt-4 text-center">
                      <p className="font-medium text-lg">{user.name}</p>
                      <p className="text-gray-500">{user.email}</p>
                    </div>

                    <div className="mt-6 w-full">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500">Membre depuis</p>
                        <p>{new Date(user.joinedDate).toLocaleDateString()}</p>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500">Déchets scannés</p>
                        <p>{user.scannedWaste}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Quiz complétés</p>
                        <p>{user.quizCompleted}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button asChild variant="outline" className="mt-6 w-full">
                  <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Onglet Points */}
          <TabsContent value="points">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique de points</CardTitle>
                    <CardDescription>
                      Visualisez comment vous avez gagné et utilisé vos points
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {transactions.length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                          <p className="text-gray-500">Aucune transaction pour le moment</p>
                        </div>
                      ) : (
                        transactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-start justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start">
                              <div className={`mr-4 p-2 rounded-full ${
                                transaction.type === 'earning'
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-orange-100 text-orange-600'
                              }`}>
                                {transaction.type === 'earning' ? (
                                  <Plus size={20} />
                                ) : (
                                  <Minus size={20} />
                                )}
                              </div>

                              <div>
                                <p className="font-medium">
                                  {transaction.type === 'earning'
                                    ? `Gain: ${transaction.details || 'Activité'}`
                                    : `Retrait: ${transaction.method === 'wm1'
                                        ? 'MTN Mobile Money'
                                        : transaction.method === 'wm2'
                                            ? 'Orange Money'
                                            : 'Carte Bancaire'}`
                                  }
                                </p>

                                <p className="text-sm text-gray-500">
                                  {formatDate(transaction.timestamp)}
                                </p>

                                {transaction.reference && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Réf: {transaction.reference}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <p className={`font-medium ${
                                transaction.type === 'earning' ? 'text-green-600' : 'text-orange-600'
                              }`}>
                                {transaction.type === 'earning' ? '+' : '-'}{transaction.points} points
                              </p>

                              {transaction.amount > 0 && (
                                <p className="text-sm">
                                  {transaction.amount.toLocaleString()} XAF
                                </p>
                              )}

                              <Badge variant={
                                transaction.status === 'completed'
                                  ? 'outline'
                                  : transaction.status === 'pending'
                                      ? 'secondary'
                                      : 'destructive'
                              } className="mt-1">
                                {transaction.status === 'completed'
                                  ? 'Complété'
                                  : transaction.status === 'pending'
                                      ? 'En attente'
                                      : 'Échoué'}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Mes points</CardTitle>
                  </CardHeader>

                  <CardContent className="pb-6">
                    <div className="flex flex-col items-center">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="6"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#16a34a"
                            strokeWidth="6"
                            strokeDasharray="282.7"
                            strokeDashoffset={282.7 - (282.7 * (user.points / 2000))}
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-3xl font-bold">{user.points}</p>
                          <p className="text-sm text-gray-500">points</p>
                        </div>
                      </div>

                      <div className="mt-6 w-full">
                        <p className="text-sm text-gray-500 mb-1">
                          {user.points} points = {Math.floor(user.points / 5).toLocaleString()} XAF
                        </p>
                        <p className="text-xs text-gray-400 mb-3">
                          5 points = 1 XAF
                        </p>

                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => {
                          setActiveTab('withdraw');
                        }}>
                          Convertir mes points
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Statistiques</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-medium flex items-center">
                            <Award className="mr-2 h-4 w-4 text-green-600" />
                            Points gagnés
                          </p>
                          <span className="text-sm text-gray-500">
                            {Math.floor(user.points * 1.2)}
                          </span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-medium flex items-center">
                            <BarChart2 className="mr-2 h-4 w-4 text-blue-600" />
                            Déchets recyclés
                          </p>
                          <span className="text-sm text-gray-500">
                            {user.scannedWaste} items
                          </span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-medium flex items-center">
                            <CheckCircle className="mr-2 h-4 w-4 text-purple-600" />
                            Quiz complétés
                          </p>
                          <span className="text-sm text-gray-500">
                            {user.quizCompleted}/12
                          </span>
                        </div>
                        <Progress value={user.quizCompleted / 12 * 100} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-medium flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-orange-600" />
                            Temps actif
                          </p>
                          <span className="text-sm text-gray-500">
                            12j 5h
                          </span>
                        </div>
                        <Progress value={40} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Onglet Retrait */}
          <TabsContent value="withdraw">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Retirer des fonds</CardTitle>
                    <CardDescription>
                      Convertissez vos points en argent réel
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-start">
                        <div className="mr-4 p-2 bg-green-100 text-green-600 rounded-full">
                          <Coins size={20} />
                        </div>
                        <div>
                          <p className="font-medium">Solde actuel</p>
                          <p className="text-2xl font-bold text-green-600 mt-1">
                            {user.points} points
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Équivalent à {Math.floor(user.points / 5).toLocaleString()} XAF
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">
                        Options de retrait
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {withdrawalMethods.map((method) => (
                          <div
                            key={method.id}
                            className="border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:border-green-200"
                            onClick={() => {
                              setSelectedMethod(method.id);
                              setShowWithdrawDialog(true);
                            }}
                          >
                            <div className="flex items-center mb-3">
                              <Image
                                src={method.icon}
                                alt={method.name}
                                width={32}
                                height={32}
                                className="mr-2"
                              />
                              <h4 className="font-medium">{method.name}</h4>
                            </div>

                            <div className="space-y-1 text-sm text-gray-500">
                              <p>Min: {method.minAmount.toLocaleString()} XAF</p>
                              <p>Max: {method.maxAmount.toLocaleString()} XAF</p>
                              <p>Frais: {method.fee}%</p>
                              <p>Délai: {method.processingTime}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Historique des retraits</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {transactions.filter(t => t.type === 'withdrawal').length === 0 ? (
                        <div className="text-center py-8">
                          <Wallet className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                          <p className="text-gray-500">Aucun retrait pour le moment</p>
                        </div>
                      ) : (
                        transactions
                          .filter(t => t.type === 'withdrawal')
                          .map((transaction) => (
                            <div
                              key={transaction.id}
                              className="flex items-start justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start">
                                <div className="mr-4">
                                  <Image
                                    src={transaction.method === 'wm1'
                                      ? '/images/payment/mtn.svg'
                                      : transaction.method === 'wm2'
                                          ? '/images/payment/orange.svg'
                                          : '/images/payment/card.svg'
                                    }
                                    alt="Méthode de paiement"
                                    width={40}
                                    height={40}
                                  />
                                </div>

                                <div>
                                  <p className="font-medium">
                                    {transaction.method === 'wm1'
                                      ? 'MTN Mobile Money'
                                      : transaction.method === 'wm2'
                                          ? 'Orange Money'
                                          : 'Carte Bancaire'
                                    }
                                  </p>

                                  <p className="text-sm text-gray-500">
                                    {formatDate(transaction.timestamp)}
                                  </p>

                                  <p className="text-xs text-gray-500 mt-1">
                                    Réf: {transaction.reference}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="font-medium">
                                  {transaction.amount.toLocaleString()} XAF
                                </p>

                                <p className="text-sm text-orange-600">
                                  -{transaction.points} points
                                </p>

                                <Badge variant={
                                  transaction.status === 'completed'
                                    ? 'outline'
                                    : transaction.status === 'pending'
                                        ? 'secondary'
                                        : 'destructive'
                                } className="mt-1">
                                  {transaction.status === 'completed'
                                    ? 'Complété'
                                    : transaction.status === 'pending'
                                        ? 'En attente'
                                        : 'Échoué'}
                                </Badge>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Guide de retrait</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <span className="text-green-800 font-bold">1</span>
                      </div>
                      <p className="text-gray-700">
                        Choisissez votre méthode de retrait préférée parmi les options disponibles.
                      </p>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <span className="text-green-800 font-bold">2</span>
                      </div>
                      <p className="text-gray-700">
                        Entrez le montant que vous souhaitez retirer (minimum 500 XAF = 2500 points).
                      </p>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <span className="text-green-800 font-bold">3</span>
                      </div>
                      <p className="text-gray-700">
                        Confirmez votre numéro de téléphone ou les détails de votre compte.
                      </p>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <span className="text-green-800 font-bold">4</span>
                      </div>
                      <p className="text-gray-700">
                        Recevez votre argent instantanément ou dans les délais indiqués.
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <h3 className="font-medium mb-2">Notes importantes:</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Le taux de conversion est de 5 points = 1 XAF.</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Des frais peuvent s&apos;appliquer selon la méthode de retrait.</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Assurez-vous que les informations de contact sont correctes.</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog pour le retrait d'argent */}
      <Dialog open={showWithdrawDialog} onOpenChange={closeWithdrawDialog}>
        <DialogContent>
          {!withdrawSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle>Retrait d&apos;argent</DialogTitle>
                <DialogDescription>
                  Convertissez vos points en argent réel
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {withdrawError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex items-start">
                    <X className="h-4 w-4 mr-2 mt-0.5" />
                    {withdrawError}
                  </div>
                )}

                <div>
                  <Label htmlFor="withdraw-amount">Montant (XAF)</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="Ex: 5000"
                    min={selectedMethod ? (withdrawalMethods.find(m => m.id === selectedMethod)?.minAmount || 500) : 500}
                    max={Math.min(
                      selectedMethod ? (withdrawalMethods.find(m => m.id === selectedMethod)?.maxAmount || 100000) : 100000,
                      Math.floor(user.points / 5)
                    )}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {withdrawAmount
                      ? `${Math.ceil(parseInt(withdrawAmount) * 5)} points seront déduits`
                      : 'Entrez un montant pour voir les points équivalents'
                    }
                  </p>
                </div>

                <div>
                  <Label htmlFor="withdraw-method">Méthode de retrait</Label>
                  <Select
                    value={selectedMethod}
                    onValueChange={setSelectedMethod}
                  >
                    <SelectTrigger id="withdraw-method">
                      <SelectValue placeholder="Sélectionner une méthode" />
                    </SelectTrigger>
                    <SelectContent>
                      {withdrawalMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className="flex items-center">
                            <Image
                              src={method.icon}
                              alt={method.name}
                              width={16}
                              height={16}
                              className="mr-2"
                            />
                            {method.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="confirm-number">
                    {selectedMethod === 'wm1'
                      ? 'Numéro MTN'
                      : selectedMethod === 'wm2'
                          ? 'Numéro Orange'
                          : 'Numéro de carte'
                    }
                  </Label>
                  <Input
                    id="confirm-number"
                    placeholder={selectedMethod === 'wm3'
                      ? 'XXXX XXXX XXXX XXXX'
                      : '6XX XXX XXX'
                    }
                    value={confirmNumber}
                    onChange={(e) => setConfirmNumber(e.target.value)}
                  />
                </div>

                {selectedMethod && (
                  <div className="p-3 bg-gray-50 rounded-md text-sm">
                    <p className="font-medium mb-1">Détails du retrait:</p>
                    <div className="text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Montant:</span>
                        <span>{withdrawAmount ? `${parseInt(withdrawAmount).toLocaleString()} XAF` : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frais ({withdrawalMethods.find(m => m.id === selectedMethod)?.fee}%):</span>
                        <span>
                          {withdrawAmount
                            ? `${Math.round(parseInt(withdrawAmount) * (withdrawalMethods.find(m => m.id === selectedMethod)?.fee / 100)).toLocaleString()} XAF`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Montant à recevoir:</span>
                        <span>
                          {withdrawAmount
                            ? `${Math.round(parseInt(withdrawAmount) * (1 - withdrawalMethods.find(m => m.id === selectedMethod)?.fee / 100)).toLocaleString()} XAF`
                            : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeWithdrawDialog}>
                  Annuler
                </Button>
                <Button
                  onClick={handleWithdrawSubmit}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isWithdrawLoading}
                >
                  {isWithdrawLoading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Traitement...
                    </>
                  ) : (
                    'Confirmer le retrait'
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="py-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <h2 className="text-xl font-bold mb-2">Retrait réussi!</h2>
              <p className="text-gray-600 mb-6">
                Votre demande de retrait a été traitée avec succès.
              </p>

              <div className="p-4 bg-gray-50 rounded-lg mb-6 max-w-xs mx-auto">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Montant:</span>
                  <span className="font-medium">{parseInt(withdrawAmount).toLocaleString()} XAF</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Méthode:</span>
                  <span className="font-medium">
                    {selectedMethod === 'wm1'
                      ? 'MTN Mobile Money'
                      : selectedMethod === 'wm2'
                          ? 'Orange Money'
                          : 'Carte Bancaire'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Numéro:</span>
                  <span className="font-medium">
                    {confirmNumber.substring(0, 3)}•••{confirmNumber.substring(confirmNumber.length - 2)}
                  </span>
                </div>
              </div>

              <Button onClick={closeWithdrawDialog}>
                Fermer
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
