import React, { FC } from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { ArrowBottomLeft } from '@/assets/svg/arrow-bottom-left';
import { ArrowRedirectIcon } from '@/assets/svg/arrow-redirect-icon';
import { ITransaction } from '@/components/TransactionItem/TransactionItem.type';

import {
  HighlightText,
  SimpleText,
  DivItemContainer,
  DivItemLeftSection,
  DivItemRightSection,
} from './TransactionItem.styles';

interface Props {
  item: ITransaction;
}

dayjs.extend(relativeTime);

const TransactionItem: FC<Props> = ({ item }) => {
  const sent: boolean = ['Create_nft_series', 'transfer_nft'].includes(item.type);
  return (
    <DivItemContainer>
      <DivItemLeftSection>
        <div className="item-arrow-icon">{sent ? <ArrowRedirectIcon /> : <ArrowBottomLeft />}</div>
        <div className="item-inner-content">
          <HighlightText className="transaction-item-id">#{item.transactionItemId}</HighlightText>
          <SimpleText> {sent ? ' Sent to ' : 'Received from'} </SimpleText>
          <HighlightText> {sent ? item.receiverWalletId : item.senderWalleId}</HighlightText>
        </div>
      </DivItemLeftSection>
      <DivItemRightSection>{dayjs(item?.updated).fromNow()}</DivItemRightSection>
    </DivItemContainer>
  );
};

export default TransactionItem;
