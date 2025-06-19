
import { Card } from '@/components/ui/card';
import { Trophy, Target, TrendingUp } from 'lucide-react';

interface ScoreBoardProps {
  totalScore: number;
  correctPredictions: number;
  totalPredictions: number;
  sport: 'basketball' | 'football' | null;
}

const ScoreBoard = ({ totalScore, correctPredictions, totalPredictions, sport }: ScoreBoardProps) => {
  const accuracy = totalPredictions > 0 ? ((correctPredictions / totalPredictions) * 100).toFixed(1) : '0';
  
  const getSportColor = () => {
    if (sport === 'basketball') return 'from-orange-500 to-red-600';
    if (sport === 'football') return 'from-green-600 to-blue-700';
    return 'from-gray-500 to-gray-700';
  };

  return (
    <Card className={`p-6 bg-gradient-to-r ${getSportColor()} text-white`}>
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Trophy className="h-8 w-8" />
          </div>
          <p className="text-sm opacity-90">Total Score</p>
          <p className="text-3xl font-bold">{totalScore}</p>
          <p className="text-xs opacity-75">points</p>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Target className="h-8 w-8" />
          </div>
          <p className="text-sm opacity-90">Correct</p>
          <p className="text-3xl font-bold">{correctPredictions}</p>
          <p className="text-xs opacity-75">out of {totalPredictions}</p>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <TrendingUp className="h-8 w-8" />
          </div>
          <p className="text-sm opacity-90">Accuracy</p>
          <p className="text-3xl font-bold">{accuracy}%</p>
          <p className="text-xs opacity-75">success rate</p>
        </div>
      </div>
    </Card>
  );
};

export default ScoreBoard;
