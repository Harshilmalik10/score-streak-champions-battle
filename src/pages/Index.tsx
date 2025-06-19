
import { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import UserHeader from '@/components/UserHeader';
import SportSelector from '@/components/SportSelector';
import TournamentSelector from '@/components/TournamentSelector';
import GameModeSelector from '@/components/GameModeSelector';
import MatchCard from '@/components/MatchCard';
import ScoreBoard from '@/components/ScoreBoard';
import { Button } from '@/components/ui/button';
import { basketballMatches, footballMatches } from '@/data/mockMatches';
import { ArrowLeft, RefreshCw } from 'lucide-react';

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
  const [selectedSport, setSelectedSport] = useState<'basketball' | 'football' | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [gameMode, setGameMode] = useState<'select' | 'tournament' | 'predict' | 'results'>('select');
  const [predictions, setPredictions] = useState<Record<number, 'team1' | 'draw' | 'team2'>>({});

  const currentMatches = selectedSport === 'basketball' ? basketballMatches : footballMatches;

  const handleAuth = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedSport(null);
    setSelectedTournament(null);
    setGameMode('select');
    setPredictions({});
  };

  const handleSportSelect = (sport: 'basketball' | 'football') => {
    setSelectedSport(sport);
    setGameMode('tournament');
    setSelectedTournament(null);
    setPredictions({});
  };

  const handleTournamentSelect = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setGameMode('select');
    // Deduct entry fee from user balance
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

  const calculateScore = () => {
    let correct = 0;
    let total = 0;
    
    currentMatches.forEach(match => {
      if (predictions[match.id]) {
        total++;
        if (predictions[match.id] === match.actualResult) {
          correct++;
        }
      }
    });
    
    return { correct, total, score: correct * 3 };
  };

  const { correct, total, score } = calculateScore();

  const resetGame = () => {
    setSelectedSport(null);
    setSelectedTournament(null);
    setGameMode('select');
    setPredictions({});
  };

  // Show auth form if user is not logged in
  if (!user) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <UserHeader user={user} onLogout={handleLogout} />
      
      <div className="p-4">
        {!selectedSport && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 pt-8">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Fantasy Sports Predictor
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join tournaments, predict match outcomes, and win exciting prizes!
              </p>
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
              userBalance={user.balance}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMatches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  prediction={predictions[match.id] || null}
                  onPredict={handlePredict}
                  showResults={gameMode === 'results'}
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
