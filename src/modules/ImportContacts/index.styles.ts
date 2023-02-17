import styled from '@emotion/styled';

import { COLORS } from '@/constants/colors';

export const DivImportContact = styled.div`
  margin-top: 15px;
  text-align: center;
`;

export const DivImportButton = styled.div`
  margin: auto;
`;

export const DivCancelButton = styled.div`
  margin-top: 20px;
  button {
    margin: 25px auto;
  }
`;

export const LinkStyle = styled.div`
  cursor: pointer;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  text-align: center;
  letter-spacing: -0.154px;
  color: ${COLORS.THEME_BUTTON};
`;

export const ImportButton = styled.button`
  margin: auto;
  margin-bottom: 10px;
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 22px;
  text-align: center;
  letter-spacing: -0.154px;
  background-color: ${COLORS.WHITE_100};
  border: none;
  color: ${COLORS.THEME_BUTTON};
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
  justify-content: center;

  svg {
    margin: 0px 10px;
  }
`;

export const DivImportButtonContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const DivButtonTitleContent = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  text-align: initial;
`;

export const DivButtonTitleWrapper = styled.div`
  display: flex;
  padding-left: 20px;
`;
