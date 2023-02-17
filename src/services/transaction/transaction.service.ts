import { ITransaction } from '@/components/TransactionItem/TransactionItem.type';
import { API_TRANSACTION_DATA } from '@/constants/api';

import { getRequest } from '../utils';

export const getTransactionsData = async (): Promise<ITransaction[]> => {
  const { data } = await getRequest(`${API_TRANSACTION_DATA}`);
  return data?.data || [];
};
