
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Calendar, Award } from 'lucide-react';

interface Tournament {
  id: string;
  name: string;
  entryFee: number;
  prizePool: number;
  participants: number;
  maxParticipants: number;
}

interface TournamentSelectorProps {
  sport: 'basketball' | 'football';
  userBalance: number;
  onTournamentSelect: (tournament: Tournament) => void;
}

const TournamentSelector = ({ sport, userBalance, onTournamentSelect }: TournamentSelectorProps) => {
  const tournaments: Tournament[] = [
    {
      id: `${sport}-basic`,
      name: 'Basic Tournament',
      entryFee: 100,
      prizePool: 5000,
      participants: 45,
      maxParticipants: 100
    },
    {
      id: `${sport}-premium`,
      name: 'Premium Tournament',
      entryFee: 500,
      prizePool: 25000,
      participants: 32,
      maxParticipants: 50
    },
    {
      id: `${sport}-elite`,
      name: 'Elite Tournament',
      entryFee: 1000,
      prizePool: 50000,
      participants: 18,
      maxParticipants: 25
    }
  ];

  const getSportColor = () => {
    return sport === 'basketball' ? 'from-orange-500 to-red-600' : 'from-green-600 to-blue-700';
  };

  const getPrizeDistribution = (prizePool: number) => {
    return {
      first: Math.floor(prizePool * 0.4),
      second: Math.floor(prizePool * 0.3),
      third: Math.floor(prizePool * 0.2),
      host: Math.floor(prizePool * 0.1)
    };
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 capitalize mb-2">
          {sport} Tournaments
        </h2>
        <p className="text-gray-600">Choose your tournament and predict 10 match outcomes</p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Prize Distribution</h3>
          <div className="text-sm text-blue-700 grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>🥇 1st Place: 40%</div>
            <div>🥈 2nd Place: 30%</div>
            <div>🥉 3rd Place: 20%</div>
            <div>🏢 Host Fee: 10%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tournaments.map((tournament) => {
          const prizes = getPrizeDistribution(tournament.prizePool);
          return (
            <Card key={tournament.id} className="overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${getSportColor()}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{tournament.name}</h3>
                  <Trophy className="h-6 w-6 text-yellow-500" />
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Entry Fee</span>
                    <Badge variant="outline">₹{tournament.entryFee}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Prize Pool</span>
                    <Badge className="bg-green-100 text-green-800">₹{tournament.prizePool.toLocaleString()}</Badge>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>🥇 1st:</span>
                      <span>₹{prizes.first.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🥈 2nd:</span>
                      <span>₹{prizes.second.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🥉 3rd:</span>
                      <span>₹{prizes.third.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Participants
                    </span>
                    <span className="text-sm font-medium">
                      {tournament.participants}/{tournament.maxParticipants}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Status
                    </span>
                    <Badge variant="secondary">Open</Badge>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => onTournamentSelect(tournament)}
                  disabled={userBalance < tournament.entryFee}
                  variant={userBalance < tournament.entryFee ? "outline" : "default"}
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
