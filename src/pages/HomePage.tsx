import { Coins } from 'lucide-react';
import BalanceCard from '@/components/BalanceCard';
import DeductForm from '@/components/DeductForm';
import AddForm from '@/components/AddForm';
import TransactionList from '@/components/TransactionList';
import StatsBar from '@/components/StatsBar';
import { useCredits } from '@/hooks/useCredits';

export default function HomePage() {
  const { balance, transactions, deduct, add, reset } = useCredits();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex items-center gap-3 h-16">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
            <Coins className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">Credit Tracker</h1>
          <span className="ml-auto text-sm text-gray-400">Data saved locally in your browser</span>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <BalanceCard balance={balance} />
        <StatsBar transactions={transactions} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DeductForm balance={balance} onDeduct={deduct} />
          <AddForm onAdd={add} />
        </div>

        <TransactionList transactions={transactions} onReset={reset} />
      </main>
    </div>
  );
}
