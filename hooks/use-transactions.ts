// hooks/use-transactions.ts
import { useState, useEffect } from "react";
import { transactionService } from "@/services/transaction.service";
import { Transaction } from "@/types";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    const res = await transactionService.getAll();
    if (res.success) setTransactions(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchTransactions(); }, []);

  return { transactions, loading, refresh: fetchTransactions };
}