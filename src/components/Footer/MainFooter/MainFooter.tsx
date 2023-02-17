import { useRouter } from 'next/router';

import React, { FC, memo } from 'react';

import { AddIcon } from '@/assets/svg/add-icon';
import { DoubleArrowIcon } from '@/assets/svg/double-arrow-icon';
import { HomeIcon } from '@/assets/svg/home-icon';
import FooterMenu from '@/components/Footer/FooterMenu';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxTypedHooks';
import MintNft from '@/modules/MintNft';
import { getCommonData, setActiveFooterTab } from '@/store/common';

import { MainFooter, StyledLi } from './MainFooter.styles';

/**
 * Main Footer component
 * @interface FooterTypes
 * @property {padding} - Footer padding
 */

interface FooterTypes {
  padding?: string;
}

enum ActiveTab {
  DASHBOARD = 'dashboard',
  TRASACTIONS = 'transactions',
  NFTS = 'nfts',
}

const FooterNFT: FC<FooterTypes> = memo(({ padding }) => {
  const router = useRouter();
  const { activeFooterTab } = useAppSelector(getCommonData);
  const [isOpen, setIsOpen] = React.useState(false);
  const dispatch = useAppDispatch();

  const handleClick = async (tab: ActiveTab) => {
    await dispatch(setActiveFooterTab(tab));
    if (tab === ActiveTab.DASHBOARD) {
      router.push('/all-nfts');
    } else if (tab === ActiveTab.TRASACTIONS) {
      router.push('/transactions');
    }
  };

  const getActive = (tab: ActiveTab) => {
    if (tab === activeFooterTab) {
      return true;
    }
    return false;
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };

  return (
    <MainFooter data-testid="mainFooter" style={{ padding }}>
      <MintNft open={isOpen} onClose={handleModalClose} />
      <ul>
        <StyledLi onClick={() => handleClick(ActiveTab.DASHBOARD)}>
          <HomeIcon isActive={getActive(ActiveTab.DASHBOARD)} />
        </StyledLi>
        <StyledLi onClick={() => handleClick(ActiveTab.NFTS)}>
          <FooterMenu>
            <AddIcon isActive={getActive(ActiveTab.NFTS)} />
          </FooterMenu>
        </StyledLi>
        <StyledLi onClick={() => handleClick(ActiveTab.TRASACTIONS)}>
          <DoubleArrowIcon isActive={getActive(ActiveTab.TRASACTIONS)} />
        </StyledLi>
      </ul>
    </MainFooter>
  );
});

export default FooterNFT;
