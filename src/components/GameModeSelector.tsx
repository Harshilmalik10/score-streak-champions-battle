
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, BarChart3 } from 'lucide-react';

interface GameModeSelectorProps {
  onModeSelect: (mode: 'predict' | 'results') => void;
  hasPredictions: boolean;
}

const GameModeSelector = ({ onModeSelect, hasPredictions }: GameModeSelectorProps) => {
  return (
    <div className="flex gap-4 justify-center mb-8">
      <Card className="p-6">
        <div className="text-center space-y-4">
          <Play className="h-12 w-12 text-blue-600 mx-auto" />
          <h3 className="text-xl font-bold">Make Predictions</h3>
          <p className="text-gray-600 text-sm">Predict outcomes for 10 matches</p>
          <Button 
            onClick={() => onModeSelect('predict')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Start Predicting
          </Button>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="text-center space-y-4">
          <BarChart3 className="h-12 w-12 text-green-600 mx-auto" />
          <h3 className="text-xl font-bold">View Results</h3>
          <p className="text-gray-600 text-sm">See your score and accuracy</p>
          <Button 
            onClick={() => onModeSelect('results')}
            variant="outline"
            className="w-full"
            disabled={!hasPredictions}
          >
            View Results
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GameModeSelector;
