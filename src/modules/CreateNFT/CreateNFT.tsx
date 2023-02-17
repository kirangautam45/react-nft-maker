import { useCallback, useEffect, useState } from 'react';

import { useIsMobile } from '@/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxTypedHooks';
import CreateNFTFormWizard from '@/modules/CreateNFT/CreateNFTFormWizard';
import DataPreviewWizard from '@/modules/CreateNFT/DataPreviewWizard';
import ImageSelectionWizard from '@/modules/CreateNFT/ImageSelectionWizard';
import { CreateNFTData } from '@/services/nft/create.service';
import { getAuthDataSelector } from '@/store/auth/authSelector';
import { getNftSelector } from '@/store/nft';
import { createNftThunk } from '@/store/nft/nftSlice';

import { DialogCreateNFTWorkflow, DivContainer, DivProgress, DivProgressContainer } from './CreateNFT.styles';

interface IProps {
  handleClose: () => void;
}

const CreateNFT = (props: IProps) => {
  const { handleClose } = props;
  const isMobile = useIsMobile();

  const dispatch = useAppDispatch();
  const {
    user: { userId, walletId },
    token,
    actionWalletId,
  } = useAppSelector(getAuthDataSelector);
  const [progress, setProgress] = useState<number>(0);
  const [step, setStep] = useState<number>(0);

  const {
    data: { title, description, attributesData, selectedFile },
    fromScreen,
  } = useAppSelector(getNftSelector);

  const nextStep = useCallback(() => {
    setStep((step) => Math.min(step + 1, 3));
  }, []);

  const createNft = () => {
    const selectedWalletId = actionWalletId || walletId;
    if (!token) {
      throw new Error('Token is required');
    }
    if (!selectedWalletId) {
      throw new Error('Wallet ID is required');
    }

    const body: CreateNFTData = {
      title,
      description,
      tags:
        attributesData?.ids.map((id) => {
          const attribute = attributesData?.data[id];
          return attribute.attributeName;
        }) ?? [],
      collectionId: '_0iM8scD5fkKFi6l9tMo0',
      categoryId: '_0iM8scD5fkKFi6l9tMo0',
      filePath:
        'https://cdn.eathappyproject.com/wp-content/uploads/2021/02/The-Most-Beautiful-Flowers-in-the-World-With-Name-and-Picture.jpg',
    };

    dispatch(
      createNftThunk({
        file: selectedFile,
        body,
        token,
        walletId: actionWalletId ?? '',
        ownerId: userId ?? '',
      })
    );
    handleClose();
  };

  const handleBack = useCallback(() => {
    setStep((step) => Math.max(step - 1, 0));
  }, []);

  const progressObjs: { [key: number]: number } = {
    0: fromScreen === 'contactModal' ? 10 : 0,
    1: 40,
    2: 90,
    3: 100,
  };

  useEffect(() => {
    setProgress(progressObjs?.[step]);
  }, [step]);

  return (
    <DialogCreateNFTWorkflow
      open
      isMobile={isMobile}
      title={'Create an NFT'}
      maxWidth="sm"
      onClose={handleClose}
      onBack={handleBack}
      disableBack={step === 0}
      showClose={false}
      crossIconPosition={{
        top: '-4px',
        right: '-6px',
      }}
    >
      <DivProgressContainer>
        <DivProgress progress={progress} />
      </DivProgressContainer>
      <DivContainer>
        {step === 0 && <ImageSelectionWizard setProgress={setProgress} handleNext={nextStep} />}
        {step === 1 && <CreateNFTFormWizard setProgress={setProgress} handleNext={nextStep} />}
        {step === 2 && (
          <DataPreviewWizard
            setProgress={setProgress}
            handleNext={() => {
              nextStep();
              createNft();
            }}
          />
        )}
      </DivContainer>
    </DialogCreateNFTWorkflow>
  );
};

export default CreateNFT;
