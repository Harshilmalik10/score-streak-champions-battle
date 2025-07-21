-- Create tournaments table for host-created tournaments
CREATE TABLE public.tournaments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID NOT NULL,
  name TEXT NOT NULL,
  sport TEXT NOT NULL CHECK (sport IN ('basketball', 'football', 'tennis')),
  entry_fee INTEGER NOT NULL CHECK (entry_fee > 0),
  prize_pool INTEGER NOT NULL DEFAULT 0,
  max_participants INTEGER NOT NULL DEFAULT 100,
  current_participants INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'completed')),
  selected_matches JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tournament participants table
CREATE TABLE public.tournament_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  predictions JSONB DEFAULT '{}',
  captain_match_id INTEGER,
  vice_captain_match_id INTEGER,
  score INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);

-- Enable RLS on both tables
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;

-- RLS policies for tournaments
CREATE POLICY "Anyone can view tournaments" 
ON public.tournaments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create tournaments" 
ON public.tournaments 
FOR INSERT 
WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their tournaments" 
ON public.tournaments 
FOR UPDATE 
USING (auth.uid() = host_id);

-- RLS policies for tournament participants
CREATE POLICY "Anyone can view tournament participants" 
ON public.tournament_participants 
FOR SELECT 
USING (true);

CREATE POLICY "Users can join tournaments" 
ON public.tournament_participants 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation" 
ON public.tournament_participants 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update tournament participant count
CREATE OR REPLACE FUNCTION public.update_tournament_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tournaments 
    SET current_participants = current_participants + 1,
        prize_pool = prize_pool + (SELECT entry_fee FROM public.tournaments WHERE id = NEW.tournament_id)
    WHERE id = NEW.tournament_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tournaments 
    SET current_participants = current_participants - 1,
        prize_pool = prize_pool - (SELECT entry_fee FROM public.tournaments WHERE id = OLD.tournament_id)
    WHERE id = OLD.tournament_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for participant count updates
CREATE TRIGGER update_tournament_participants_count
AFTER INSERT OR DELETE ON public.tournament_participants
FOR EACH ROW
EXECUTE FUNCTION public.update_tournament_participant_count();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on tournaments
CREATE TRIGGER update_tournaments_updated_at
BEFORE UPDATE ON public.tournaments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();