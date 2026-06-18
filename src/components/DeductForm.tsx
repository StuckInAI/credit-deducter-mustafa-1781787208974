import { useState } from 'react';
import { MinusCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type DeductFormProps = {
  balance: number;
  onDeduct: (amount: number, description: string) => boolean;
};

export default function DeductForm({ balance, onDeduct }: DeductFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const parsedAmount = parseFloat(amount);
  const isValid = !isNaN(parsedAmount) && parsedAmount > 0 && parsedAmount <= balance;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    if (parsedAmount > balance) {
      setError(`Insufficient credits. You only have ${balance} credits.`);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const ok = onDeduct(parsedAmount, description);
    setLoading(false);

    if (ok) {
      setSuccess(true);
      setAmount('');
      setDescription('');
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError('Failed to deduct credits.');
    }
  }

  const quickAmounts = [10, 25, 50, 100];

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
          <MinusCircle className="h-5 w-5 text-rose-500" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">Deduct Credits</h3>
          <p className="text-sm text-gray-500">Remove credits from your balance</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">−</span>
            <input
              type="number"
              min="1"
              max={balance}
              step="1"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAmount(e.target.value);
                setError('');
              }}
              placeholder="Enter amount..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
            />
          </div>

          <div className="flex gap-2 mt-2">
            {quickAmounts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => { setAmount(String(q)); setError(''); }}
                className={cn(
                  'flex-1 rounded-lg border py-1.5 text-xs font-medium transition',
                  parsedAmount === q
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-600'
                )}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-gray-400">(optional)</span></label>
          <input
            type="text"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            placeholder="What is this deduction for?"
            maxLength={120}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-600">
            ✓ Credits deducted successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isValid}
          className={cn(
            'w-full rounded-xl py-3 px-6 font-semibold text-white transition-all duration-200',
            isValid && !loading
              ? 'bg-rose-500 hover:bg-rose-600 active:scale-[0.98] shadow-md shadow-rose-200'
              : 'bg-gray-300 cursor-not-allowed'
          )}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : (
            `Deduct ${parsedAmount > 0 ? parsedAmount : ''} Credits`
          )}
        </button>
      </form>
    </div>
  );
}
