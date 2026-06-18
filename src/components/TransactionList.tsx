import { ArrowDownCircle, ArrowUpCircle, Clock, Trash2 } from 'lucide-react';
import { cn, formatNumber, formatDate } from '@/lib/utils';
import type { Transaction } from '@/types';

type TransactionListProps = {
  transactions: Transaction[];
  onReset: () => void;
};

export default function TransactionList({ transactions, onReset }: TransactionListProps) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <h3 className="font-semibold text-gray-900">Transaction History</h3>
          {transactions.length > 0 && (
            <span className="rounded-full bg-brand-100 text-brand-700 text-xs font-medium px-2 py-0.5">
              {transactions.length}
            </span>
          )}
        </div>
        {transactions.length > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-rose-300 hover:text-rose-500 transition"
          >
            <Trash2 className="h-3 w-3" />
            Reset All
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
            <Clock className="h-8 w-8 text-gray-300" />
          </div>
          <p className="font-medium text-gray-400">No transactions yet</p>
          <p className="text-sm text-gray-300 mt-1">Your credit activity will appear here</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {transactions.map((tx) => (
            <li key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                  tx.type === 'deduct' ? 'bg-rose-50' : 'bg-emerald-50'
                )}
              >
                {tx.type === 'deduct' ? (
                  <ArrowDownCircle className="h-5 w-5 text-rose-500" />
                ) : (
                  <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">{tx.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(tx.timestamp)}</p>
              </div>

              <div className="text-right shrink-0">
                <p
                  className={cn(
                    'text-sm font-bold tabular-nums',
                    tx.type === 'deduct' ? 'text-rose-500' : 'text-emerald-500'
                  )}
                >
                  {tx.type === 'deduct' ? '−' : '+'}{formatNumber(tx.amount)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Balance: {formatNumber(tx.balanceAfter)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
