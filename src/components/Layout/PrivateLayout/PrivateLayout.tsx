import { useRouter } from 'next/router';

import { ReactNode, useEffect } from 'react';

import MainFooter from '@/components/Footer/MainFooter';
import MainHeader from '@/components/Header/MainHeader';
import { useAppSelector } from '@/hooks/useReduxTypedHooks';
import { getAuthDataSelector } from '@/store/auth';

import PrivateLayoutStyled from './PrivateLayout.styles';

const PrivateLayout = ({
  children,
  isFooterNeeded,
}: {
  children: ReactNode;
  isDesktopHeader?: boolean;
  isMobileHeader?: boolean;
  isFooterNeeded?: boolean;
}): JSX.Element => {
  const router = useRouter();
  const { token, user } = useAppSelector(getAuthDataSelector);

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token]);
  return (
    <PrivateLayoutStyled>
      <MainHeader accountId={user.accountId} isLogo />
      <main>{children}</main>
      {isFooterNeeded && <MainFooter />}
    </PrivateLayoutStyled>
  );
};

export default PrivateLayout;
