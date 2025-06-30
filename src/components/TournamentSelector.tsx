
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Calendar, Award, Star } from 'lucide-react';

interface Tournament {
  id: string;
  name: string;
  entryFee: number;
  prizePool: number;
  participants: number;
  maxParticipants: number;
}

interface TournamentSelectorProps {
  sport: 'basketball' | 'football' | 'tennis';
  userBalance: number;
  onTournamentSelect: (tournament: Tournament) => void;
}

const TournamentSelector = ({ sport, userBalance, onTournamentSelect }: TournamentSelectorProps) => {
  const tournaments: Tournament[] = [
    {
      id: `${sport}-basic`,
      name: 'Basic Tournament',
      entryFee: 100,
      prizePool: 4500, // 45 participants * 100 entry fee
      participants: 45,
      maxParticipants: 100
    },
    {
      id: `${sport}-premium`,
      name: 'Premium Tournament',
      entryFee: 500,
      prizePool: 16000, // 32 participants * 500 entry fee
      participants: 32,
      maxParticipants: 50
    },
    {
      id: `${sport}-elite`,
      name: 'Elite Tournament',
      entryFee: 1000,
      prizePool: 18000, // 18 participants * 1000 entry fee
      participants: 18,
      maxParticipants: 25
    }
  ];

  const getSportColor = () => {
    if (sport === 'basketball') return 'from-orange-500 to-red-600';
    if (sport === 'football') return 'from-green-600 to-blue-700';
    if (sport === 'tennis') return 'from-yellow-500 to-orange-600';
    return 'from-gray-500 to-gray-700';
  };

  const getPrizeDistribution = (prizePool: number) => {
    const hostFee = Math.floor(prizePool * 0.1);
    const remainingPrize = prizePool - hostFee;
    
    return {
      first: Math.floor(remainingPrize * 0.4),
      second: Math.floor(remainingPrize * 0.3), 
      third: Math.floor(remainingPrize * 0.2),
      host: hostFee,
      remaining: remainingPrize - Math.floor(remainingPrize * 0.4) - Math.floor(remainingPrize * 0.3) - Math.floor(remainingPrize * 0.2)
    };
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Star className="h-8 w-8 text-yellow-500" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent capitalize">
            {sport} Tournaments
          </h2>
          <Star className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="text-xl text-gray-600 mb-6">Choose your tournament and predict 10 match outcomes</p>
        
        <div className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-lg">
          <h3 className="font-bold text-blue-900 mb-4 text-lg flex items-center justify-center">
            <Trophy className="h-5 w-5 mr-2" />
            Prize Distribution Structure
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="text-2xl mb-1">🥇</div>
              <div className="font-semibold text-yellow-700">1st Place</div>
              <div className="text-yellow-600">40%</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="text-2xl mb-1">🥈</div>
              <div className="font-semibold text-gray-700">2nd Place</div>
              <div className="text-gray-600">30%</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="text-2xl mb-1">🥉</div>
              <div className="font-semibold text-orange-700">3rd Place</div>
              <div className="text-orange-600">20%</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="text-2xl mb-1">🏢</div>
              <div className="font-semibold text-purple-700">Host Fee</div>
              <div className="text-purple-600">10%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tournaments.map((tournament, index) => {
          const prizes = getPrizeDistribution(tournament.prizePool);
          const isPopular = index === 1;
          
          return (
            <Card key={tournament.id} className={`overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isPopular ? 'ring-2 ring-purple-400 shadow-xl' : 'shadow-lg'}`}>
              <div className={`h-3 bg-gradient-to-r ${getSportColor()}`}></div>
              {isPopular && (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 text-sm font-bold">
                  ⭐ MOST POPULAR ⭐
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">{tournament.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <Award className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Entry Fee</span>
                    <Badge variant="outline" className="text-lg font-bold">₹{tournament.entryFee}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Total Prize Pool</span>
                    <Badge className="bg-green-100 text-green-800 text-lg font-bold">₹{tournament.prizePool.toLocaleString()}</Badge>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <h4 className="font-semibold text-blue-800 text-sm">Prize Breakdown:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-yellow-700">🥇 1st:</span>
                        <span className="font-medium">₹{prizes.first.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">🥈 2nd:</span>
                        <span className="font-medium">₹{prizes.second.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-600">🥉 3rd:</span>
                        <span className="font-medium">₹{prizes.third.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-600">🏢 Host:</span>
                        <span className="font-medium">₹{prizes.host.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Participants
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {tournament.participants}/{tournament.maxParticipants}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Status
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Open</Badge>
                  </div>
                </div>
                
                <Button 
                  className={`w-full py-3 text-lg font-bold transition-all duration-300 ${
                    userBalance < tournament.entryFee 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : isPopular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg'
                  }`}
                  onClick={() => onTournamentSelect(tournament)}
                  disabled={userBalance < tournament.entryFee}
                >
                  {userBalance < tournament.entryFee ? 'Insufficient Balance' : 'Join Tournament'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TournamentSelector;
