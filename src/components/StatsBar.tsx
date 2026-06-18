import { TrendingDown, TrendingUp, Activity } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import type { Transaction } from '@/types';

type StatsBarProps = {
  transactions: Transaction[];
};

export default function StatsBar({ transactions }: StatsBarProps) {
  const totalDeducted = transactions
    .filter((t) => t.type === 'deduct')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalAdded = transactions
    .filter((t) => t.type === 'add')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalTransactions = transactions.length;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 shrink-0">
          <TrendingDown className="h-5 w-5 text-rose-500" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Total Deducted</p>
          <p className="text-lg font-bold text-rose-500 tabular-nums">{formatNumber(totalDeducted)}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 shrink-0">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Total Added</p>
          <p className="text-lg font-bold text-emerald-500 tabular-nums">{formatNumber(totalAdded)}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 shrink-0">
          <Activity className="h-5 w-5 text-brand-500" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Transactions</p>
          <p className="text-lg font-bold text-brand-600 tabular-nums">{totalTransactions}</p>
        </div>
      </div>
    </div>
  );
}
