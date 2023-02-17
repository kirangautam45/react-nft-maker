import { useQuery } from 'react-query';

import { useAppSelector } from '@/hooks/useReduxTypedHooks';
import { getTransactionsData } from '@/services/transaction/transaction.service';
/**
 * Hook for querying transactions data
 * @returns data for nft dashboard
 */
export function useTransactionsData() {
  const { transactions } = useAppSelector((state) => ({
    transactions: state.transactionsDetails.allTransactions,
  }));

  if (transactions.length > 0) {
    return {
      data: transactions,
      isLoading: false,
    };
  }
  return useQuery(['transactionsData'], () => getTransactionsData(), { retry: false });
}
