import { Coins } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

type BalanceCardProps = {
  balance: number;
};

export default function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-2xl">
      {/* decorative circles */}
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-white/5" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-brand-200 uppercase tracking-widest">Current Balance</p>
          <h2 className="text-6xl font-extrabold tabular-nums">{formatNumber(balance)}</h2>
          <p className="mt-2 text-brand-200 text-sm">credits available</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
          <Coins className="h-7 w-7 text-white" />
        </div>
      </div>

      {/* progress bar metaphor */}
      <div className="relative z-10 mt-8">
        <div className="flex justify-between text-xs text-brand-200 mb-1">
          <span>0</span>
          <span>{formatNumber(Math.max(balance, 1000))}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-700"
            style={{ width: `${Math.min(100, (balance / Math.max(balance, 1000)) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
