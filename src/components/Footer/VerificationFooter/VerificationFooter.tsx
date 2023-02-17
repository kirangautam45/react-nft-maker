import Link from 'next/link';

import { useState, useEffect } from 'react';

import SnackBar from '@/components/core/SnackBar';
import { SnackBarType } from '@/components/core/SnackBar/SnackBar';
import FullscreenLoader from '@/components/FullscreenLoader';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxTypedHooks';
import { loginUserThunk, getAuthDataSelector } from '@/store/auth';

import { DivVerificationFooterWrapper, StyledDiv, StyledText } from './VerificationFooter.styles';

const VerificationFooter = () => {
  const dispatch = useAppDispatch();
  const [showToast, setShowToast] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    status = '',
    user: { accountId },
  } = useAppSelector(getAuthDataSelector);

  useEffect(() => {
    if (status) setShowToast(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  }, [status, isSubmitting]);

  const handleResendOTP = () => {
    dispatch(loginUserThunk({ accountId }));
    setIsSubmitting(true);
  };

  return (
    <>
      {isSubmitting && <FullscreenLoader />}
      <DivVerificationFooterWrapper>
        {showToast && (
          <SnackBar type={SnackBarType.SUCCESS} visible={showToast} setVisible={setShowToast} content={status} />
        )}
        <StyledDiv>
          <StyledText data-testid="code-text">Didn't receive your code?</StyledText>
        </StyledDiv>
        <StyledDiv>
          <StyledText data-testid="resend-code">
            <Link href="/authenticate" data-testid="login-link">
              <span onClick={handleResendOTP} className="link">
                Resend your code
              </span>
            </Link>
          </StyledText>
        </StyledDiv>
      </DivVerificationFooterWrapper>
    </>
  );
};
export default VerificationFooter;
