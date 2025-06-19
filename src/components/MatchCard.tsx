
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users } from 'lucide-react';

interface Match {
  id: number;
  team1: string;
  team2: string;
  sport: 'basketball' | 'football';
  actualResult?: 'team1' | 'draw' | 'team2';
}

interface MatchCardProps {
  match: Match;
  prediction: 'team1' | 'draw' | 'team2' | null;
  onPredict: (matchId: number, prediction: 'team1' | 'draw' | 'team2') => void;
  showResults?: boolean;
}

const MatchCard = ({ match, prediction, onPredict, showResults = false }: MatchCardProps) => {
  const getResultIcon = (result: string) => {
    if (showResults && match.actualResult) {
      if (prediction === match.actualResult) {
        return <Trophy className="h-5 w-5 text-green-600" />;
      } else if (prediction) {
        return <span className="h-5 w-5 text-red-600">✗</span>;
      }
    }
    return null;
  };

  const getButtonStyle = (option: 'team1' | 'draw' | 'team2') => {
    const isSelected = prediction === option;
    const isCorrect = showResults && match.actualResult === option && prediction === option;
    const isWrong = showResults && prediction === option && match.actualResult !== option;
    
    if (isCorrect) return 'bg-green-600 text-white border-green-600';
    if (isWrong) return 'bg-red-600 text-white border-red-600';
    if (isSelected) return 'bg-blue-600 text-white border-blue-600';
    return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
  };

  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-lg">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Match {match.id}</h3>
          {getResultIcon(prediction || '')}
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <p className="font-medium text-sm">{match.team1}</p>
          </div>
          
          <span className="text-gray-400 font-bold text-xl">VS</span>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-red-600" />
            </div>
            <p className="font-medium text-sm">{match.team2}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            className={getButtonStyle('team1')}
            onClick={() => onPredict(match.id, 'team1')}
            disabled={showResults}
          >
            {match.team1} Win
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={getButtonStyle('draw')}
            onClick={() => onPredict(match.id, 'draw')}
            disabled={showResults}
          >
            {match.sport === 'basketball' ? 'Tie' : 'Draw'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={getButtonStyle('team2')}
            onClick={() => onPredict(match.id, 'team2')}
            disabled={showResults}
          >
            {match.team2} Win
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MatchCard;
