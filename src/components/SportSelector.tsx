
import { Circle, Zap, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SportSelectorProps {
  selectedSport: 'basketball' | 'football' | 'tennis' | null;
  onSportSelect: (sport: 'basketball' | 'football' | 'tennis') => void;
}

const SportSelector = ({ selectedSport, onSportSelect }: SportSelectorProps) => {
  return (
    <div className="flex gap-8 justify-center mb-8">
      <Card 
        className={`p-8 cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-2xl ${
          selectedSport === 'basketball' 
            ? 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white shadow-2xl transform scale-105' 
            : 'bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50 border-2 hover:border-orange-400 shadow-lg'
        }`}
        onClick={() => onSportSelect('basketball')}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${selectedSport === 'basketball' ? 'bg-white/20' : 'bg-orange-100'}`}>
            <Circle size={56} className={selectedSport === 'basketball' ? 'text-white' : 'text-orange-600'} />
          </div>
          <h3 className={`text-2xl font-bold ${selectedSport === 'basketball' ? 'text-white' : 'text-gray-800'}`}>
            Basketball
          </h3>
          <p className={`text-sm ${selectedSport === 'basketball' ? 'text-white/80' : 'text-gray-600'}`}>
            NBA & International
          </p>
        </div>
      </Card>
      
      <Card 
        className={`p-8 cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-2xl ${
          selectedSport === 'football' 
            ? 'bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 text-white shadow-2xl transform scale-105' 
            : 'bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-blue-50 border-2 hover:border-green-400 shadow-lg'
        }`}
        onClick={() => onSportSelect('football')}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${selectedSport === 'football' ? 'bg-white/20' : 'bg-green-100'}`}>
            <Zap size={56} className={selectedSport === 'football' ? 'text-white' : 'text-green-600'} />
          </div>
          <h3 className={`text-2xl font-bold ${selectedSport === 'football' ? 'text-white' : 'text-gray-800'}`}>
            Football
          </h3>
          <p className={`text-sm ${selectedSport === 'football' ? 'text-white/80' : 'text-gray-600'}`}>
            NFL & College
          </p>
        </div>
      </Card>

      <Card 
        className={`p-8 cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-2xl ${
          selectedSport === 'tennis' 
            ? 'bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 text-white shadow-2xl transform scale-105' 
            : 'bg-white hover:bg-gradient-to-br hover:from-yellow-50 hover:to-orange-50 border-2 hover:border-yellow-400 shadow-lg'
        }`}
        onClick={() => onSportSelect('tennis')}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${selectedSport === 'tennis' ? 'bg-white/20' : 'bg-yellow-100'}`}>
            <Trophy size={56} className={selectedSport === 'tennis' ? 'text-white' : 'text-yellow-600'} />
          </div>
          <h3 className={`text-2xl font-bold ${selectedSport === 'tennis' ? 'text-white' : 'text-gray-800'}`}>
            Tennis
          </h3>
          <p className={`text-sm ${selectedSport === 'tennis' ? 'text-white/80' : 'text-gray-600'}`}>
            ATP & WTA Tours
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SportSelector;
