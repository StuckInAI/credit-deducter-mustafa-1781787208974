export type TransactionType = 'deduct' | 'add';

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: number;
  balanceAfter: number;
};

export type CreditState = {
  balance: number;
  transactions: Transaction[];
};
