
import { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import UserHeader from '@/components/UserHeader';
import SportSelector from '@/components/SportSelector';
import TournamentSelector from '@/components/TournamentSelector';
import GameModeSelector from '@/components/GameModeSelector';
import MatchCard from '@/components/MatchCard';
import ScoreBoard from '@/components/ScoreBoard';
import WalletManager from '@/components/WalletManager';
import { Button } from '@/components/ui/button';
import { basketballMatches, footballMatches } from '@/data/mockMatches';
import { ArrowLeft, RefreshCw, LogIn, UserPlus } from 'lucide-react';

interface User {
  id: string;
  email: string;
  balance: number;
}

interface Tournament {
  id: string;
  name: string;
  entryFee: number;
  prizePool: number;
  participants: number;
  maxParticipants: number;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showWallet, setShowWallet] = useState(false);
  const [selectedSport, setSelectedSport] = useState<'basketball' | 'football' | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [gameMode, setGameMode] = useState<'select' | 'tournament' | 'predict' | 'results'>('select');
  const [predictions, setPredictions] = useState<Record<number, 'team1' | 'draw' | 'team2'>>({});
  const [captain, setCaptain] = useState<number | null>(null);
  const [viceCaptain, setViceCaptain] = useState<number | null>(null);

  const currentMatches = selectedSport === 'basketball' ? basketballMatches : footballMatches;

  const handleAuth = (userData: User) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedSport(null);
    setSelectedTournament(null);
    setGameMode('select');
    setPredictions({});
    setCaptain(null);
    setViceCaptain(null);
    setShowWallet(false);
  };

  const handleSportSelect = (sport: 'basketball' | 'football') => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setSelectedSport(sport);
    setGameMode('tournament');
    setSelectedTournament(null);
    setPredictions({});
    setCaptain(null);
    setViceCaptain(null);
  };

  const handleTournamentSelect = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setGameMode('select');
    if (user) {
      setUser({
        ...user,
        balance: user.balance - tournament.entryFee
      });
    }
  };

  const handleModeSelect = (mode: 'predict' | 'results') => {
    setGameMode(mode);
  };

  const handlePredict = (matchId: number, prediction: 'team1' | 'draw' | 'team2') => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: prediction
    }));
  };

  const handleCaptainSelect = (matchId: number) => {
    if (captain === matchId) {
      setCaptain(null);
    } else {
      setCaptain(matchId);
      if (viceCaptain === matchId) {
        setViceCaptain(null);
      }
    }
  };

  const handleViceCaptainSelect = (matchId: number) => {
    if (viceCaptain === matchId) {
      setViceCaptain(null);
    } else {
      setViceCaptain(matchId);
      if (captain === matchId) {
        setCaptain(null);
      }
    }
  };

  const calculateScore = () => {
    let correct = 0;
    let total = 0;
    let score = 0;
    
    currentMatches.forEach(match => {
      if (predictions[match.id]) {
        total++;
        if (predictions[match.id] === match.actualResult) {
          correct++;
          let points = 3;
          if (captain === match.id) {
            points = 9; // Captain gets 3x points
          } else if (viceCaptain === match.id) {
            points = 6; // Vice-captain gets 2x points
          }
          score += points;
        }
      }
    });
    
    return { correct, total, score };
  };

  const { correct, total, score } = calculateScore();

  const resetGame = () => {
    setSelectedSport(null);
    setSelectedTournament(null);
    setGameMode('select');
    setPredictions({});
    setCaptain(null);
    setViceCaptain(null);
  };

  const handleWalletUpdate = (newBalance: number) => {
    if (user) {
      setUser({ ...user, balance: newBalance });
    }
  };

  // Show auth form if requested
  if (showAuth) {
    return (
      <AuthForm 
        onAuth={handleAuth} 
        initialMode={authMode}
        onBack={() => setShowAuth(false)}
      />
    );
  }

  // Show wallet manager if requested
  if (showWallet && user) {
    return (
      <WalletManager 
        user={user}
        onWalletUpdate={handleWalletUpdate}
        onBack={() => setShowWallet(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {user && (
        <UserHeader 
          user={user} 
          onLogout={handleLogout}
          onWalletClick={() => setShowWallet(true)}
        />
      )}
      
      <div className="p-4">
        {!selectedSport && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 pt-8">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Fantasy Sports Predictor
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Join tournaments, predict match outcomes, and win exciting prizes!
              </p>
              
              {!user && (
                <div className="flex justify-center space-x-4 mb-8">
                  <Button 
                    onClick={() => { setAuthMode('login'); setShowAuth(true); }}
                    className="flex items-center space-x-2"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
                    className="flex items-center space-x-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Button>
                </div>
              )}
            </div>
            
            <SportSelector 
              selectedSport={selectedSport} 
              onSportSelect={handleSportSelect} 
            />
          </div>
        )}

        {selectedSport && gameMode === 'tournament' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <Button 
                variant="outline" 
                onClick={() => setSelectedSport(null)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Sports</span>
              </Button>
              
              <div className="w-24"></div>
            </div>
            
            <TournamentSelector 
              sport={selectedSport}
              userBalance={user?.balance || 0}
              onTournamentSelect={handleTournamentSelect}
            />
          </div>
        )}

        {selectedSport && selectedTournament && gameMode === 'select' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <Button 
                variant="outline" 
                onClick={() => setGameMode('tournament')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Tournaments</span>
              </Button>
              
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedTournament.name}
              </h1>
              
              <div className="w-24"></div>
            </div>
            
            <GameModeSelector 
              onModeSelect={handleModeSelect}
              hasPredictions={Object.keys(predictions).length > 0}
            />
          </div>
        )}

        {selectedSport && selectedTournament && (gameMode === 'predict' || gameMode === 'results') && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <Button 
                variant="outline" 
                onClick={() => setGameMode('select')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {selectedTournament.name} - {gameMode === 'predict' ? 'Predictions' : 'Results'}
              </h1>
              
              <Button 
                variant="outline" 
                onClick={resetGame}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>New Game</span>
              </Button>
            </div>

            <div className="mb-8">
              <ScoreBoard 
                totalScore={score}
                correctPredictions={correct}
                totalPredictions={total}
                sport={selectedSport}
              />
            </div>

            {gameMode === 'predict' && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Captain & Vice-Captain Selection</h3>
                <p className="text-sm text-yellow-700">
                  Select one Captain (9 points if correct) and one Vice-Captain (6 points if correct) from your predictions.
                  {captain && ` Captain: Match ${captain}`}
                  {viceCaptain && ` | Vice-Captain: Match ${viceCaptain}`}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMatches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  prediction={predictions[match.id] || null}
                  onPredict={handlePredict}
                  showResults={gameMode === 'results'}
                  captain={captain}
                  viceCaptain={viceCaptain}
                  onCaptainSelect={handleCaptainSelect}
                  onViceCaptainSelect={handleViceCaptainSelect}
                  canSelectCaptain={gameMode === 'predict' && predictions[match.id] !== undefined}
                />
              ))}
            </div>

            {gameMode === 'predict' && (
              <div className="mt-8 text-center">
                <Button 
                  onClick={() => setGameMode('results')}
                  disabled={Object.keys(predictions).length < 10}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                >
                  {Object.keys(predictions).length < 10 
                    ? `Make ${10 - Object.keys(predictions).length} more predictions` 
                    : 'View Results'
                  }
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
