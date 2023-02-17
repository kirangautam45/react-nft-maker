import { useRouter } from 'next/router';

import { useEffect } from 'react';

import { Grid } from '@mui/material';

import { ArrowRightWhite } from '@/assets/svg/arrow-right-white';
import { CloseButton } from '@/assets/svg/CloseButton';
import { UserImage } from '@/assets/svg/user-image';
import CustomAccordion from '@/components/Accordion';
import { DivButtonWrapper } from '@/components/core/CommonDialog/CommonDialog.styles';
import FullscreenLoader from '@/components/FullscreenLoader';
import { COLORS } from '@/constants/colors';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxTypedHooks';
import { NFTDetailsPreview } from '@/modules/NFTDetails';
import { getNftSelector, nftDetailsThunk, resetNftDetails } from '@/store/nft';
import { homePage } from '@/utils/router.utils';

import {
  AttributeName,
  AttributeValue,
  ButtonSend,
  CreatorName,
  CreatorTitle,
  DivAccordionContainer,
  DivAttributeContainer,
  DivCloseButtonContainer,
  DivDetailsContainer,
  DivInfo,
  DivNftCreator,
  DivNftCreatorContainer,
  DivNftCreatorDetails,
  DivNftInfoContainer,
  NftCategory,
  NftDetailsLayoutContainer,
  NftNumber,
  NftTitle,
  Paragraph,
} from './index.styles';

/**
 *
 * @returns NFT Details Page
 */
const NftDetail = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, status } = useAppSelector(getNftSelector);
  const { nftId }: { nftId?: string } = router.query;

  useEffect(() => {
    if (nftId) {
      dispatch(nftDetailsThunk(nftId));
    }
  }, [nftId]);

  const onClose = async () => {
    await dispatch(resetNftDetails());
    router.push(homePage());
  };

  return (
    <NftDetailsLayoutContainer data-testid="auth-layout-container">
      <Grid container className="container">
        <Grid item md={6} sm={12} xs={12} className="left-section">
          <NFTDetailsPreview />
        </Grid>
        <Grid item md={6} sm={12} xs={12} className="right-section">
          {status === 'loading' && data?.nftId !== nftId ? (
            <FullscreenLoader />
          ) : (
            <DivDetailsContainer isMobile={isMobile}>
              <DivCloseButtonContainer>
                <span />
                <DivButtonWrapper onClick={onClose} data-testid="close-button" style={{ top: '10px', right: '10px' }}>
                  <CloseButton />
                </DivButtonWrapper>
              </DivCloseButtonContainer>
              <DivNftInfoContainer>
                <NftCategory>{data?.category}</NftCategory>
                <NftTitle>{data?.title}</NftTitle>
                <NftNumber>#63738</NftNumber>
              </DivNftInfoContainer>
              <DivNftCreator>
                <DivNftCreatorContainer>
                  <UserImage />
                  <DivNftCreatorDetails>
                    <CreatorTitle>Creator</CreatorTitle>
                    <CreatorName>{data?.owner?.userId}</CreatorName>
                  </DivNftCreatorDetails>
                </DivNftCreatorContainer>
                <ButtonSend onClick={onClose} backgroundColor={COLORS.THEME_BUTTON} hoverColor={COLORS.THEME_BUTTON}>
                  Send <ArrowRightWhite />
                </ButtonSend>
              </DivNftCreator>
              <DivAccordionContainer>
                {data?.description && (
                  <CustomAccordion title="Description" open>
                    <Paragraph>{data?.description}</Paragraph>
                  </CustomAccordion>
                )}

                {(data?.token_id || data?.explorer_url) && (
                  <CustomAccordion title="NFT Info" open>
                    <DivInfo>
                      <p>Token ID</p>
                      <a href="https://explorer.near.org/" target="_blank" rel="noreferrer">
                        {data?.token_id ?? ''}
                      </a>
                    </DivInfo>
                    <DivInfo>
                      <p>Contract Address</p>
                      <a href={data?.explorer_url} target="_blank" rel="noreferrer">
                        Explorer
                      </a>
                    </DivInfo>
                  </CustomAccordion>
                )}

                {data?.attributes?.length ? (
                  <CustomAccordion title="Properties">
                    {data?.attributes?.map((attr) => (
                      <DivAttributeContainer key={attr?.attributeName + attr?.attributeValue}>
                        <AttributeName>{attr?.attributeName}</AttributeName>
                        <AttributeValue>{attr?.attributeValue}</AttributeValue>
                      </DivAttributeContainer>
                    ))}
                  </CustomAccordion>
                ) : null}
              </DivAccordionContainer>
            </DivDetailsContainer>
          )}
        </Grid>
      </Grid>
    </NftDetailsLayoutContainer>
  );
};

export default NftDetail;
