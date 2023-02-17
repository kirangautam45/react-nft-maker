import { useRouter } from 'next/router';

import { useEffect } from 'react';

import FullscreenLoader from '@/components/FullscreenLoader';
import { PrivateLayout } from '@/components/Layout';
import { useNftListData } from '@/hooks/apis/nft/useNftListData';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxTypedHooks';
import CreateNFT from '@/modules/CreateNFT';
import CreateNFTSuccess from '@/modules/CreateNFTSuccess/CreateNFTSuccess';
import ImportContacts from '@/modules/ImportContacts';
import NftList from '@/modules/NftList';
import NftListBanner from '@/modules/NftList/NftListBanner';
import SelectContact from '@/modules/SelectContact';
import SendNft from '@/modules/SendNft';
import SingleNft from '@/modules/SingleNft';
import TransactionList from '@/modules/TransactionList';
import { getAuthDataSelector } from '@/store/auth';
import { resetVerificationStatus } from '@/store/auth/authSlice';
import { setReturnUrl } from '@/store/common/commonSlice';
import { getContactsSelector, toggleSelectContactModal } from '@/store/contacts';
import { getContactsThunk } from '@/store/contacts/contactsSlice';
import { getDialogsStatus } from '@/store/dialogs/dialogsSelector';
import { closeCreateNftDialog, closeSendNftDialog } from '@/store/dialogs/dialogsSlice';
import { getNftSelector, getNtfCreateStatus, resetNftDetails } from '@/store/nft';

import { AllNFTsStyled } from './index.styles';

const AllNFTs = (): JSX.Element => {
  const { allNfts = [] } = useAppSelector(getNftSelector);
  const { currentStep } = useAppSelector(getNtfCreateStatus);
  const { user } = useAppSelector(getAuthDataSelector);
  const { selectContactDialog, allContacts, allContactsLoading, loadingMessage } = useAppSelector(getContactsSelector);
  const { data, isLoading } = useNftListData();
  const router = useRouter();
  const { returnUrl } = useAppSelector((state) => state.commonData);
  const dispatch = useAppDispatch();

  const { isSendNftDialogOpen, isCreateNftDialogOpen, isSelectContactOpen } = useAppSelector(getDialogsStatus);

  const handleClose = (): void => {
    dispatch(closeCreateNftDialog());
    // dispatch(resetNftDetails());
  };

  const handleCloseSendNftDialog = () => {
    dispatch(closeSendNftDialog());
  };

  useEffect(() => {
    dispatch(getContactsThunk(user.userId));
    dispatch(resetVerificationStatus());
  }, []);

  useEffect(() => {
    if (!isLoading && !data?.length) {
      dispatch(toggleSelectContactModal());
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (returnUrl) {
      router.push(returnUrl);
      setReturnUrl('');
    }
  }, [returnUrl]);

  return (
    <PrivateLayout isFooterNeeded={true}>
      {!allContactsLoading && allContacts.length === 0 && <ImportContacts />}
      {allContactsLoading && <FullscreenLoader message={loadingMessage} />}
      <AllNFTsStyled>
        <NftListBanner />
        {((!allNfts.length &&
          !currentStep &&
          !allContactsLoading &&
          allContacts.length > 0 &&
          !isLoading &&
          selectContactDialog) ||
          isSelectContactOpen) && <SelectContact />}
        {currentStep === 'open' && <SingleNft handleClose={handleClose} />}
        {(currentStep === 'create' || isCreateNftDialogOpen) && <CreateNFT handleClose={handleClose} />}
        {currentStep === 'success' && <CreateNFTSuccess handleClose={handleClose} />}
        {isSendNftDialogOpen && <SendNft handleClose={handleCloseSendNftDialog} />}
        <NftList />
        <TransactionList />
      </AllNFTsStyled>
    </PrivateLayout>
  );
};

export default AllNFTs;
