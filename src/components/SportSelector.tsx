
import { Circle, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SportSelectorProps {
  selectedSport: 'basketball' | 'football' | null;
  onSportSelect: (sport: 'basketball' | 'football') => void;
}

const SportSelector = ({ selectedSport, onSportSelect }: SportSelectorProps) => {
  return (
    <div className="flex gap-6 justify-center mb-8">
      <Card 
        className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
          selectedSport === 'basketball' 
            ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-xl' 
            : 'bg-white hover:bg-orange-50 border-2 hover:border-orange-300'
        }`}
        onClick={() => onSportSelect('basketball')}
      >
        <div className="flex flex-col items-center space-y-3">
          <Circle size={48} className={selectedSport === 'basketball' ? 'text-white' : 'text-orange-600'} />
          <h3 className={`text-xl font-bold ${selectedSport === 'basketball' ? 'text-white' : 'text-gray-800'}`}>
            Basketball
          </h3>
        </div>
      </Card>
      
      <Card 
        className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
          selectedSport === 'football' 
            ? 'bg-gradient-to-br from-green-600 to-blue-700 text-white shadow-xl' 
            : 'bg-white hover:bg-green-50 border-2 hover:border-green-300'
        }`}
        onClick={() => onSportSelect('football')}
      >
        <div className="flex flex-col items-center space-y-3">
          <Zap size={48} className={selectedSport === 'football' ? 'text-white' : 'text-green-600'} />
          <h3 className={`text-xl font-bold ${selectedSport === 'football' ? 'text-white' : 'text-gray-800'}`}>
            Football
          </h3>
        </div>
      </Card>
    </div>
  );
};

export default SportSelector;
