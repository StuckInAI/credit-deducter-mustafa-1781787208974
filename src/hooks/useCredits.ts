import { useState, useEffect } from 'react';
import type { CreditState, Transaction } from '@/types';

const STORAGE_KEY = 'credit_tracker_data';

const DEFAULT_STATE: CreditState = {
  balance: 1000,
  transactions: [],
};

function loadState(): CreditState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return JSON.parse(raw) as CreditState;
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: CreditState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useCredits() {
  const [state, setState] = useState<CreditState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  function deduct(amount: number, description: string): boolean {
    if (amount <= 0 || amount > state.balance) return false;
    const newBalance = state.balance - amount;
    const tx: Transaction = {
      id: crypto.randomUUID(),
      type: 'deduct',
      amount,
      description: description.trim() || 'Deduction',
      timestamp: Date.now(),
      balanceAfter: newBalance,
    };
    setState((prev) => ({
      balance: newBalance,
      transactions: [tx, ...prev.transactions],
    }));
    return true;
  }

  function add(amount: number, description: string): boolean {
    if (amount <= 0) return false;
    const newBalance = state.balance + amount;
    const tx: Transaction = {
      id: crypto.randomUUID(),
      type: 'add',
      amount,
      description: description.trim() || 'Credit Added',
      timestamp: Date.now(),
      balanceAfter: newBalance,
    };
    setState((prev) => ({
      balance: newBalance,
      transactions: [tx, ...prev.transactions],
    }));
    return true;
  }

  function reset(): void {
    setState(DEFAULT_STATE);
  }

  return { balance: state.balance, transactions: state.transactions, deduct, add, reset };
}
