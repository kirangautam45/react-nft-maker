import React, { FC } from 'react';

import Button from '@/components/core/Button';
import { COLORS } from '@/constants/colors';

import { NFTData, StepProps } from './MintNft';
import { DivContianer, ImgNft, TextMintedTitle, TextMintedSubtitle, DivButtonContainer } from './Success.styles';

const Success: FC<StepProps> = ({ setModalState, changeStep }) => {
  const handleOpenClick = () => {
    changeStep('open');
    setModalState({
      title: 'Real nature Game',
      maxWidth: 'md',
      alignTitle: 'left',
    });
  };
  return (
    <DivContianer data-testid="successNftCreate">
      <ImgNft src={NFTData.fileUrl} />
      <TextMintedTitle>Successfully Minted</TextMintedTitle>
      <TextMintedSubtitle>NFT ID: wapjjr@hkoall</TextMintedSubtitle>
      <DivButtonContainer></DivButtonContainer>
      <DivButtonContainer>
        <Button onClick={handleOpenClick} backgroundColor={COLORS.THEME_BUTTON} hoverColor={COLORS.THEME_BUTTON}>
          Open
        </Button>
      </DivButtonContainer>
    </DivContianer>
  );
};

export default Success;
