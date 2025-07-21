import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Users, Trophy, Crown, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Match {
  id: number;
  team1: string;
  team2: string;
  sport: 'basketball' | 'football' | 'tennis';
  actualResult?: 'team1' | 'draw' | 'team2';
}

interface TournamentCreatorProps {
  sport: 'basketball' | 'football' | 'tennis';
  availableMatches: Match[];
  onBack: () => void;
  onTournamentCreated: () => void;
  userId: string;
}

const TournamentCreator = ({ 
  sport, 
  availableMatches, 
  onBack, 
  onTournamentCreated, 
  userId 
}: TournamentCreatorProps) => {
  const [selectedMatches, setSelectedMatches] = useState<Match[]>([]);
  const [tournamentName, setTournamentName] = useState('');
  const [entryFee, setEntryFee] = useState<number>(100);
  const [maxParticipants, setMaxParticipants] = useState<number>(100);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleMatchToggle = (match: Match) => {
    setSelectedMatches(prev => {
      const isSelected = prev.some(m => m.id === match.id);
      if (isSelected) {
        return prev.filter(m => m.id !== match.id);
      } else if (prev.length < 10) {
        return [...prev, match];
      } else {
        toast({
          title: "Maximum matches selected",
          description: "You can only select up to 10 matches for a tournament.",
          variant: "destructive"
        });
        return prev;
      }
    });
  };

  const isMatchSelected = (matchId: number) => {
    return selectedMatches.some(m => m.id === matchId);
  };

  const canCreateTournament = () => {
    return selectedMatches.length === 10 && 
           tournamentName.trim() !== '' && 
           entryFee > 0 && 
           maxParticipants > 0;
  };

  const handleCreateTournament = async () => {
    if (!canCreateTournament()) return;

    setIsCreating(true);
    try {
      const { error } = await supabase
        .from('tournaments')
        .insert({
          host_id: userId,
          name: tournamentName.trim(),
          sport: sport,
          entry_fee: entryFee,
          max_participants: maxParticipants,
          selected_matches: JSON.stringify(selectedMatches)
        });

      if (error) throw error;

      toast({
        title: "Tournament created successfully!",
        description: `Your ${sport} tournament "${tournamentName}" is now live.`,
      });

      onTournamentCreated();
    } catch (error) {
      console.error('Error creating tournament:', error);
      toast({
        title: "Failed to create tournament",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getSportColor = () => {
    if (sport === 'basketball') return 'from-orange-500 to-red-600';
    if (sport === 'football') return 'from-green-600 to-blue-700';
    if (sport === 'tennis') return 'from-yellow-500 to-orange-600';
    return 'from-gray-500 to-gray-700';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            Create {sport} Tournament
          </h1>
          <p className="text-gray-600 mt-2">
            Select exactly 10 matches and configure your tournament
          </p>
        </div>
        
        <div className="w-24"></div>
      </div>

      {/* Progress Indicator */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Match Selection Progress</h3>
          <Badge 
            variant={selectedMatches.length === 10 ? "default" : "secondary"}
            className="text-lg px-4 py-2"
          >
            {selectedMatches.length}/10 matches selected
          </Badge>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full bg-gradient-to-r ${getSportColor()} transition-all duration-300`}
            style={{ width: `${(selectedMatches.length / 10) * 100}%` }}
          ></div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Match Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Available Matches
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableMatches.map((match) => (
                <Card 
                  key={match.id} 
                  className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    isMatchSelected(match.id) 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:ring-1 hover:ring-gray-300'
                  }`}
                  onClick={() => handleMatchToggle(match)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Match {match.id}</span>
                      {isMatchSelected(match.id) && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="font-medium text-xs">{match.team1}</p>
                      </div>
                      
                      <span className="text-gray-400 font-bold">VS</span>
                      
                      <div className="text-center">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mb-1">
                          <Users className="h-4 w-4 text-red-600" />
                        </div>
                        <p className="font-medium text-xs">{match.team2}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Tournament Configuration */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              Tournament Configuration
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="tournament-name">Tournament Name</Label>
                <Input
                  id="tournament-name"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  placeholder="Enter tournament name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="entry-fee">Entry Fee (₹)</Label>
                <Input
                  id="entry-fee"
                  type="number"
                  value={entryFee}
                  onChange={(e) => setEntryFee(Number(e.target.value))}
                  min="1"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="max-participants">Max Participants</Label>
                <Input
                  id="max-participants"
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(Number(e.target.value))}
                  min="2"
                  className="mt-1"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Prize Distribution</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>🥇 1st Place:</span>
                    <span>40% of prize pool</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🥈 2nd Place:</span>
                    <span>30% of prize pool</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🥉 3rd Place:</span>
                    <span>20% of prize pool</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🏢 Host Fee:</span>
                    <span>10% of prize pool</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Selected Matches Preview */}
          {selectedMatches.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Matches</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedMatches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Match {match.id}</span>
                    <span className="text-xs text-gray-600">{match.team1} vs {match.team2}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Create Button */}
          <Button
            className={`w-full py-3 text-lg font-bold transition-all duration-300 ${
              canCreateTournament()
                ? `bg-gradient-to-r ${getSportColor()} text-white shadow-lg hover:shadow-xl`
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleCreateTournament}
            disabled={!canCreateTournament() || isCreating}
          >
            {isCreating ? 'Creating Tournament...' : 
             selectedMatches.length < 10 ? `Select ${10 - selectedMatches.length} more matches` :
             !tournamentName.trim() ? 'Enter tournament name' :
             'Create Tournament'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TournamentCreator;