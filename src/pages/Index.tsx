import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import UserHeader from '@/components/UserHeader';
import SportSelector from '@/components/SportSelector';
import TournamentSelector from '@/components/TournamentSelector';
import TournamentCreator from '@/components/TournamentCreator';
import GameModeSelector from '@/components/GameModeSelector';
import MatchCard from '@/components/MatchCard';
import ScoreBoard from '@/components/ScoreBoard';
import WalletManager from '@/components/WalletManager';
import { Button } from '@/components/ui/button';
import { basketballMatches, footballMatches, tennisMatches } from '@/data/mockMatches';
import { ArrowLeft, RefreshCw, LogIn, UserPlus, Sparkles } from 'lucide-react';

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
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const [showWallet, setShowWallet] = useState(false);
  const [selectedSport, setSelectedSport] = useState<'basketball' | 'football' | 'tennis' | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [gameMode, setGameMode] = useState<'select' | 'tournament' | 'predict' | 'results' | 'create-tournament'>('select');
  const [predictions, setPredictions] = useState<Record<number, 'team1' | 'draw' | 'team2'>>({});
  const [captain, setCaptain] = useState<number | null>(null);
  const [viceCaptain, setViceCaptain] = useState<number | null>(null);

  // Set up authentication listener
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getCurrentMatches = () => {
    if (selectedSport === 'basketball') return basketballMatches;
    if (selectedSport === 'football') return footballMatches;
    if (selectedSport === 'tennis') return tennisMatches;
    return [];
  };

  const currentMatches = getCurrentMatches();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setSelectedSport(null);
    setSelectedTournament(null);
    setGameMode('select');
    setPredictions({});
    setCaptain(null);
    setViceCaptain(null);
    setShowWallet(false);
  };

  const handleSportSelect = (sport: 'basketball' | 'football' | 'tennis') => {
    if (!user) {
      navigate('/auth');
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
    // Note: In real app, deduct entry fee from user's wallet in database
  };

  const handleCreateTournament = () => {
    setGameMode('create-tournament');
  };

  const handleTournamentCreated = () => {
    setGameMode('tournament');
    // Optionally refresh tournaments here
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
            points = 6; // Captain gets double points
          } else if (viceCaptain === match.id) {
            points = 4.5; // Vice-captain gets 1.5x points
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
    // Note: In real app, update wallet balance in database
    console.log('Wallet update:', newBalance);
  };

  // Show wallet manager if requested
  if (showWallet && user) {
    return (
      <WalletManager 
        user={{
          id: user.id,
          email: user.email || '',
          balance: 5000 // Mock balance - would come from database
        }}
        onWalletUpdate={handleWalletUpdate}
        onBack={() => setShowWallet(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      {user && (
        <UserHeader 
          user={{
            id: user.id,
            email: user.email || '',
            balance: 5000 // Mock balance - would come from database
          }} 
          onLogout={handleLogout}
          onWalletClick={() => setShowWallet(true)}
        />
      )}
      
      <div className="p-4">
        {!selectedSport && (
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 pt-12">
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="h-12 w-12 text-purple-600 mr-4" />
                <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Fantasy Sports Arena
                </h1>
                <Sparkles className="h-12 w-12 text-purple-600 ml-4" />
              </div>
              <p className="text-2xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
                Experience the thrill of sports prediction with our premium fantasy platform. 
                Join exclusive tournaments, make strategic predictions, and win amazing prizes!
              </p>
              
              {!user && (
                <div className="flex justify-center space-x-6 mb-12">
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Login
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/auth')}
                    className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Sign Up
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
              userBalance={5000} // Mock balance - would come from database
              onTournamentSelect={handleTournamentSelect}
              onCreateTournament={handleCreateTournament}
              userId={user?.id}
            />
          </div>
        )}

        {selectedSport && gameMode === 'create-tournament' && user && (
          <TournamentCreator
            sport={selectedSport}
            availableMatches={getCurrentMatches()}
            onBack={() => setGameMode('tournament')}
            onTournamentCreated={handleTournamentCreated}
            userId={user.id}
          />
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
                  Select one Captain (6 points if correct) and one Vice-Captain (4.5 points if correct) from your predictions.
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
