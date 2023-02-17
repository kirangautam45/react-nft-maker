import Link from 'next/link';

import { Divider } from '@mui/material';

import {
  DivLoginWithNear,
  DivSignupWrapper,
  DivStyled,
  DivTermAndConditionText,
  StyledText,
} from './SignUpFooter.styles';

interface ISignupFooter {
  customTermsAndConditionText?: React.ReactNode | string;
}

const SignUpFooter = ({ customTermsAndConditionText }: ISignupFooter) => {
  return (
    <DivSignupWrapper>
      {!customTermsAndConditionText ? (
        <DivTermAndConditionText>
          by clicking continue you must agree to near labs <br />
          <Link href="https://terms.nftmakerapp.io/"> Terms & Conditions</Link> and
          <Link href="https://privacy.nftmakerapp.io/"> Privacy Policy.</Link>
        </DivTermAndConditionText>
      ) : (
        <DivTermAndConditionText>{customTermsAndConditionText}</DivTermAndConditionText>
      )}

      <Divider />
      <DivStyled>
        <StyledText data-testid="footer-text-login">Already have Near Account?</StyledText>
      </DivStyled>
      <Link href="/login">
        <DivLoginWithNear>Login with NEARApps</DivLoginWithNear>
      </Link>
    </DivSignupWrapper>
  );
};
export default SignUpFooter;
