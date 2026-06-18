import { useState, useEffect } from 'react';
import { CreditCard, TrendingDown, TrendingUp, History, Zap } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deduct' | 'add';
  amount: number;
  description: string;
  timestamp: number;
}

const STORAGE_KEY = 'credit_tracker_data';

interface StoredData {
  balance: number;
  transactions: Transaction[];
}

function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredData;
  } catch {}
  return { balance: 1000, transactions: [] };
}

function saveData(data: StoredData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatDate(ts: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ts));
}

export default function App() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deductAmount, setDeductAmount] = useState<string>('');
  const [deductDesc, setDeductDesc] = useState<string>('');
  const [addAmount, setAddAmount] = useState<string>('');
  const [addDesc, setAddDesc] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  useEffect(() => {
    const data = loadData();
    setBalance(data.balance);
    setTransactions(data.transactions);
  }, []);

  function persist(newBalance: number, newTransactions: Transaction[]): void {
    setBalance(newBalance);
    setTransactions(newTransactions);
    saveData({ balance: newBalance, transactions: newTransactions });
  }

  function showSuccess(msg: string): void {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 2500);
  }

  function handleDeduct(): void {
    setError('');
    const amt = parseFloat(deductAmount);
    if (isNaN(amt) || amt <= 0) { setError('Enter a valid positive amount.'); return; }
    if (amt > balance) { setError('Insufficient credits.'); return; }
    const tx: Transaction = {
      id: crypto.randomUUID(),
      type: 'deduct',
      amount: amt,
      description: deductDesc.trim() || 'Deduction',
      timestamp: Date.now(),
    };
    persist(balance - amt, [tx, ...transactions]);
    setDeductAmount('');
    setDeductDesc('');
    showSuccess(`Deducted ${amt} credits.`);
  }

  function handleAdd(): void {
    setError('');
    const amt = parseFloat(addAmount);
    if (isNaN(amt) || amt <= 0) { setError('Enter a valid positive amount.'); return; }
    const tx: Transaction = {
      id: crypto.randomUUID(),
      type: 'add',
      amount: amt,
      description: addDesc.trim() || 'Top-up',
      timestamp: Date.now(),
    };
    persist(balance + amt, [tx, ...transactions]);
    setAddAmount('');
    setAddDesc('');
    showSuccess(`Added ${amt} credits.`);
  }

  const totalSpent = transactions
    .filter((t) => t.type === 'deduct')
    .reduce((s, t) => s + t.amount, 0);

  const totalAdded = transactions
    .filter((t) => t.type === 'add')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-600 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Credit Tracker</h1>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-2 mb-1 opacity-80">
            <CreditCard className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-widest">Current Balance</span>
          </div>
          <div className="text-5xl font-extrabold tracking-tight">
            {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm opacity-70 mt-1">credits</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Total Spent</div>
              <div className="text-xl font-bold text-red-400">{totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Total Added</div>
              <div className="text-xl font-bold text-green-400">{totalAdded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-500/20 border border-green-500/40 text-green-300 rounded-xl px-4 py-3 mb-4 text-sm">
            {successMsg}
          </div>
        )}

        {/* Forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Deduct */}
          <div className="bg-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-red-400 mb-4 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" /> Deduct Credits
            </h2>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="Amount"
              value={deductAmount}
              onChange={(e) => setDeductAmount(e.target.value)}
              className="w-full bg-slate-700 rounded-lg px-4 py-2.5 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={deductDesc}
              onChange={(e) => setDeductDesc(e.target.value)}
              className="w-full bg-slate-700 rounded-lg px-4 py-2.5 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500"
            />
            <button
              onClick={handleDeduct}
              className="w-full bg-red-600 hover:bg-red-500 active:bg-red-700 transition-colors rounded-lg py-2.5 text-sm font-semibold"
            >
              Deduct
            </button>
          </div>

          {/* Add */}
          <div className="bg-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-green-400 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Add Credits
            </h2>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="Amount"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              className="w-full bg-slate-700 rounded-lg px-4 py-2.5 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-500"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={addDesc}
              onChange={(e) => setAddDesc(e.target.value)}
              className="w-full bg-slate-700 rounded-lg px-4 py-2.5 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-500"
            />
            <button
              onClick={handleAdd}
              className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 transition-colors rounded-lg py-2.5 text-sm font-semibold"
            >
              Add
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-slate-800 rounded-2xl p-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <History className="w-4 h-4" /> Transaction History
          </h2>
          {transactions.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">No transactions yet.</p>
          ) : (
            <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between bg-slate-700/60 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg ${
                        tx.type === 'deduct' ? 'bg-red-500/20' : 'bg-green-500/20'
                      }`}
                    >
                      {tx.type === 'deduct' ? (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{tx.description}</div>
                      <div className="text-xs text-slate-400">{formatDate(tx.timestamp)}</div>
                    </div>
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      tx.type === 'deduct' ? 'text-red-400' : 'text-green-400'
                    }`}
                  >
                    {tx.type === 'deduct' ? '-' : '+'}
                    {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
