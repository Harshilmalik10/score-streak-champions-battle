
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Wallet } from 'lucide-react';

interface UserHeaderProps {
  user: { id: string; email: string; balance: number };
  onLogout: () => void;
  onWalletClick: () => void;
}

const UserHeader = ({ user, onLogout, onWalletClick }: UserHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm border-b">
      <h1 className="text-2xl font-bold text-gray-900">Fantasy Sports</h1>
      
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onWalletClick}
          className="flex items-center space-x-2"
        >
          <Wallet className="h-4 w-4 text-green-600" />
          <Badge variant="outline" className="text-lg px-3 py-1">
            ₹{user.balance.toLocaleString()}
          </Badge>
        </Button>
        
        <div className="text-sm text-gray-600">
          {user.email}
        </div>
        
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserHeader;
