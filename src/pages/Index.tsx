
import { useState } from 'react';
import SportSelector from '@/components/SportSelector';
import GameModeSelector from '@/components/GameModeSelector';
import MatchCard from '@/components/MatchCard';
import ScoreBoard from '@/components/ScoreBoard';
import { Button } from '@/components/ui/button';
import { basketballMatches, footballMatches } from '@/data/mockMatches';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const Index = () => {
  const [selectedSport, setSelectedSport] = useState<'basketball' | 'football' | null>(null);
  const [gameMode, setGameMode] = useState<'select' | 'predict' | 'results'>('select');
  const [predictions, setPredictions] = useState<Record<number, 'team1' | 'draw' | 'team2'>>({});

  const currentMatches = selectedSport === 'basketball' ? basketballMatches : footballMatches;
  
  const handleSportSelect = (sport: 'basketball' | 'football') => {
    setSelectedSport(sport);
    setGameMode('select');
    setPredictions({});
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
    setGameMode('select');
    setPredictions({});
  };

  if (!selectedSport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 pt-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Fantasy Sports Predictor
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Test your sports knowledge! Predict the outcomes of 10 matches and earn 3 points for each correct prediction.
            </p>
          </div>
          
          <SportSelector 
            selectedSport={selectedSport} 
            onSportSelect={handleSportSelect} 
          />
        </div>
      </div>
    );
  }

  if (gameMode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="outline" 
              onClick={() => setSelectedSport(null)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Sports</span>
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900 capitalize">
              {selectedSport} Predictions
            </h1>
            
            <div className="w-24"></div>
          </div>
          
          <GameModeSelector 
            onModeSelect={handleModeSelect}
            hasPredictions={Object.keys(predictions).length > 0}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
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
            {selectedSport} {gameMode === 'predict' ? 'Predictions' : 'Results'}
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
    </div>
  );
};

export default Index;
