import styled from '@emotion/styled';

import { COLORS } from '@/constants/colors';

export const DivItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  @media (max-width: 500px) {
    font-size: 14px;
    align-items: flex-start;
  }
`;

export const DivItemLeftSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  .item-arrow-icon {
    justify-content: flex-start;
    margin-right: 10px;
  }
  .item-inner-content {
    margin-bottom: 12px;
  }
`;

export const HighlightText = styled.span`
  color: ${COLORS.THEME_BUTTON};
  margin-left: 3px !important;
  margin-right: 3px !important;
  &.transaction-item-id {
    font-weight: 600;
  }

  @media (max-width: 500px) {
    &.transaction-item-id {
      display: block;
    }
  }
`;

export const SimpleText = styled.span`
  color: ${COLORS.DARK_LIVER};
`;

export const DivItemRightSection = styled.div`
  color: ${COLORS.GREY_LABEL};

  @media (max-width: 500px) {
    font-size: 13px;
  }
`;
