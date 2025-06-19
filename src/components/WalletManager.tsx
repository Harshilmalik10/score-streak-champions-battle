
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Minus, Wallet } from 'lucide-react';

interface WalletManagerProps {
  user: { id: string; email: string; balance: number };
  onWalletUpdate: (newBalance: number) => void;
  onBack: () => void;
}

const WalletManager = ({ user, onWalletUpdate, onBack }: WalletManagerProps) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to deposit.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const newBalance = user.balance + depositAmount;
      onWalletUpdate(newBalance);
      toast({
        title: "Deposit Successful",
        description: `₹${depositAmount.toLocaleString()} has been added to your wallet.`,
      });
      setAmount('');
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount > user.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance to withdraw this amount.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const newBalance = user.balance - withdrawAmount;
      onWalletUpdate(newBalance);
      toast({
        title: "Withdrawal Successful",
        description: `₹${withdrawAmount.toLocaleString()} has been withdrawn from your wallet.`,
      });
      setAmount('');
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl text-center flex-1 flex items-center justify-center space-x-2">
              <Wallet className="h-6 w-6" />
              <span>Wallet</span>
            </CardTitle>
            <div className="w-10"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Current Balance</p>
            <Badge variant="outline" className="text-2xl px-4 py-2">
              ₹{user.balance.toLocaleString()}
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleDeposit}
                disabled={loading || !amount}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                <span>Deposit</span>
              </Button>

              <Button 
                onClick={handleWithdraw}
                disabled={loading || !amount}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Minus className="h-4 w-4" />
                <span>Withdraw</span>
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>All transactions are secure and processed instantly.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletManager;
