import { useRouter } from 'next/router';

import { useState, useEffect, useCallback } from 'react';

import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Modal } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Field, Form, Formik } from 'formik';

import { DoubleArrow } from '@/assets/svg/double-arrow';
import { RightMenueIcon } from '@/assets/svg/right-menu-icon';
import { SignOutArrow } from '@/assets/svg/signout-arrow-icon';
import { WalletIcon } from '@/assets/svg/wallet-icon';
import Button from '@/components/core/Button';
import CommonDialog from '@/components/core/CommonDialog';
import Input from '@/components/core/FieldInput';
import Loader from '@/components/core/Loader';
import PhoneInput from '@/components/core/PhoneInput';
import SnackBar from '@/components/core/SnackBar';
import { SnackBarType } from '@/components/core/SnackBar/SnackBar';
import Header from '@/components/DynamicHeader';
import { COLORS } from '@/constants/colors';
import { useAppSelector, useAppDispatch } from '@/hooks/useReduxTypedHooks';
// import AddWalletForm from '@/modules/AddWalletForm';
import VerificationForm from '@/modules/VerificationForm';
import {
  getAuthDataSelector,
  updateUserThunk,
  resetStatus,
  switchWallet,
  setActionWalletId,
  resetUser,
  // setWalletDraft,
} from '@/store/auth';
import { User } from '@/store/auth/types';
// import { ICreateWalletServiceRequestProps } from '@/store/wallet/types';

import {
  DivContainer,
  DivConnectedWallet,
  // DivAllWallet,
  DivAuthHeading,
  DivDoubleArrowWrapper,
  DivRow,
  DivFlexRow,
  DivFormWrapper,
  DivBox,
  Div,
  DivContentBold,
  DividerStyled,
  DivContent,
  DivLabel,
  DivColumn,
  DivModalContainer,
  DivTitleContainer,
  DivCancelIcon,
  DivCheckBoxIconContainer,
  DivAddButton,
  DivSecondContainer,
  DivRoundIconContainer,
} from './index.style';

/**
 *
 * @returns Settings page
 */

interface IDataType {
  [key: string]: string | number | boolean | undefined;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: 350,
    sm: 400,
  },
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '21.6px',
  p: 3,
  m: 10,
};
const Settings = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, allWallet = [], status, actionWalletId } = useAppSelector(getAuthDataSelector);
  const className = 'btn-add';

  const [connectedModal, setConnectedModal] = useState(false);
  const [wallet, setWallet] = useState(false);
  const [name, setName] = useState(false);
  const [email, setEmail] = useState(false);
  const [phone, setPhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [showMessage, setShowMessage] = useState(false);
  const [openVerification, setOpenVerification] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState<Partial<User> | null>(null);
  // Don't remove this once the backend is done we will add this modal
  // const [openModal, setOpenModal] = useState<boolean>(false);
  // const { error, isLoading } = useAppSelector((state) => state.wallets);

  useEffect(() => {
    if (router.query?.switched) {
      setMessage('Wallet Switched Successfully');
      setShowMessage(true);
    }
    router.replace('/settings', undefined, { shallow: true });
  }, []);

  useEffect(() => {
    if (status) {
      setMessage(status);
      setShowMessage(true);
      dispatch(resetStatus());
    }
  }, [status]);

  const closeConnectedModal = () => {
    setConnectedModal(false);
    // setWallet(false);
    setWallet(false);
    setName(false);
    setEmail(false);
    setPhone(false);
    setOpenVerification(false);
  };

  const handleFormSubmit = async (values: Partial<User>) => {
    if (user.userId) {
      setLoading(true);
      const updatedValues: IDataType = { fullName: '' };
      Object.entries(values).forEach((item) => {
        if (item[1]) {
          updatedValues[item[0]] = item[1];
        }
      });
      if (name) {
        await dispatch(
          updateUserThunk({
            userId: user.userId,
            userData: { firstName: values?.firstName, lastName: values?.lastName, email: values.email },
          })
        );
        closeConnectedModal();
      } else {
        setUpdatedUserData(values);
        handleSubmit(values);
      }
    }
    setLoading(false);
  };

  const openConnectedModal = (type: any) => {
    type?.type === 'wallet' && setWallet(true);
    type?.type === 'name' && setName(true);
    type?.type === 'email' && setEmail(true);
    type?.type === 'phone' && setPhone(true);
    setConnectedModal(true);
  };

  const signOut = async () => {
    await dispatch(resetUser());
    router.replace('/');
  };

  const handleSelectWallet = (id: string) => {
    dispatch(setActionWalletId(id));
    closeConnectedModal();
    setOpenVerification(true);
  };

  const handleSwitchWallet = async () => {
    setWallet(false);
    const wallet = allWallet.find(({ walletId }) => walletId === actionWalletId);
    await dispatch(switchWallet(wallet));
    setOpenVerification(false);
    setLoading(false);
    await dispatch(setActionWalletId(''));
  };

  const handleSubmit = useCallback(
    async (values) => {
      if (user.userId && email) {
        await dispatch(
          updateUserThunk({
            userId: user.userId,
            userData: { email: values?.email },
          })
        );
        closeConnectedModal();
      } else if (user.userId && phone) {
        await dispatch(
          updateUserThunk({
            userId: user.userId,
            userData: { phone: values?.phone, countryCode: user?.countryCode },
          })
        );
        closeConnectedModal();
      }
      setLoading(false);
      closeConnectedModal();
    },
    [email, phone, updatedUserData]
  );

  // Don't remove this once the backend is done we will add this modal

  // const handleClickAddWallet = () => {
  //   setOpenModal(true);
  // };

  // const handleCreateWallet = useCallback(() => {
  //   setOpenVerification(false);
  //   if (error) {
  //     setMessage('Created wallet failed');
  //   } else if (!isLoading && !error) {
  //     setMessage('New Wallet Added Successfully');
  //   }
  // }, [isLoading, error]);

  // const handleOnSubmit = ({ email, phone }: ICreateWalletServiceRequestProps) => {
  //   const walletId = `${email?.split('@')[0]}.near`;
  //   dispatch(setWalletDraft({ phone, walletId }));
  //   handleCreateWallet();
  // };

  return (
    <>
      <Header title="Settings" isBackButton left></Header>
      <DivContainer>
        {showMessage && (
          <SnackBar setVisible={setShowMessage} visible={showMessage} content={message} type={SnackBarType.SUCCESS} />
        )}
        <DivRow>
          <DivConnectedWallet>Connected Wallet</DivConnectedWallet>
          {/*Don't remove this once the backend is done we will add this modal */}
          {/* <AddWalletForm openModal={openModal} setOpenModal={setOpenModal} onSubmit={handleOnSubmit} />
          <DivAllWallet onClick={handleClickAddWallet}>+ Add wallets</DivAllWallet> */}
        </DivRow>
        <DivBox onClick={() => openConnectedModal({ type: 'wallet' })}>
          <DivFlexRow>
            <div className="walletId-conatiner">
              <WalletIcon />
              <DivContentBold>{user?.walletName ?? user?.walletId}</DivContentBold>
            </div>
            <RightMenueIcon />
          </DivFlexRow>
        </DivBox>
        <DivConnectedWallet>Profile Settings</DivConnectedWallet>
        <DivBox>
          <DivRow onClick={() => openConnectedModal({ type: 'name' })}>
            <Div>
              <DivLabel>Name</DivLabel>
              <DivContent>{user?.fullName}</DivContent>
            </Div>
            <DivColumn>
              <RightMenueIcon />
            </DivColumn>
          </DivRow>
          <DivRow onClick={() => openConnectedModal({ type: 'email' })}>
            <Div>
              <DivLabel>Email Address</DivLabel>
              <DivContent>{user?.email}</DivContent>
            </Div>
            <DivColumn>
              <RightMenueIcon />
            </DivColumn>
          </DivRow>
          <DivRow onClick={() => openConnectedModal({ type: 'phone' })}>
            <Div>
              <DivLabel>Phone Number</DivLabel>
              <DivContent>{user?.phone}</DivContent>
            </Div>
            <DivColumn>
              <RightMenueIcon />
            </DivColumn>
          </DivRow>
        </DivBox>
        <DivBox onClick={signOut}>
          <DivRow>
            <DivContentBold>Sign out</DivContentBold>
            <DivColumn>
              <SignOutArrow />
            </DivColumn>
          </DivRow>
        </DivBox>
        <DivModalContainer>
          <Modal open={connectedModal} onClose={closeConnectedModal}>
            <>
              {wallet && (
                <Box sx={style}>
                  <div>
                    <DivTitleContainer>
                      <span id="modal-modal-title">Select connected wallet</span>
                      <DivCancelIcon onClick={closeConnectedModal}>
                        <CancelIcon style={{ color: '#818C99' }} />
                      </DivCancelIcon>
                    </DivTitleContainer>
                    {allWallet.map((item) => (
                      <div key={`wallet-${item.walletId}`}>
                        <DivSecondContainer key={item.walletId}>
                          <span>{item.walletId}</span>
                          {user.walletId === item.walletId ? (
                            <DivCheckBoxIconContainer>
                              <CheckIcon style={{ color: '#fff' }} />
                            </DivCheckBoxIconContainer>
                          ) : (
                            <DivRoundIconContainer onClick={() => handleSelectWallet(item.walletId)} />
                          )}
                        </DivSecondContainer>
                        {allWallet.length - 1 !== allWallet.indexOf(item) && <DividerStyled />}
                      </div>
                    ))}
                  </div>
                </Box>
              )}
              <Formik
                initialValues={{
                  firstName: user.fullName?.split(' ')[0],
                  lastName: user.fullName?.split(' ')[1],
                  email: user.email,
                  phone: user.phone,
                }}
                enableReinitialize
                onSubmit={handleFormSubmit}
              >
                {({ errors, touched, values, setFieldValue, initialValues }) => (
                  <Form>
                    {name && (
                      <Box sx={style}>
                        <div>
                          <DivTitleContainer>
                            <span id="modal-modal-title">Change Name</span>
                            <DivCancelIcon onClick={closeConnectedModal}>
                              <CancelIcon style={{ color: '#818C99' }} sx={{ fontSize: 28 }} />
                            </DivCancelIcon>
                          </DivTitleContainer>
                          <DivSecondContainer>
                            <Field
                              as={Input}
                              id="firstName"
                              variant="outlined"
                              name="firstName"
                              data-testid="name-input"
                              placeholder="first name"
                              // error={errors.firstName && touched.email ? true : false}
                            />
                            <Field
                              as={Input}
                              id="lastName"
                              variant="outlined"
                              name="lastName"
                              data-testid="name-input"
                              placeholder="last name"
                              // error={errors.lastName && touched.email ? true : false}
                            />
                          </DivSecondContainer>
                          <DivAddButton>
                            <Button
                              className={className}
                              type="submit"
                              // disabled={!values.firstName || loading || initialValues.firstName === values.firstName}
                            >
                              {loading ? (
                                <Loader
                                  style={{
                                    height: 20,
                                    width: 20,
                                    color: COLORS.WHITE_100,
                                  }}
                                />
                              ) : (
                                'Save'
                              )}
                            </Button>
                          </DivAddButton>
                        </div>
                      </Box>
                    )}
                    {email && (
                      <Box sx={style}>
                        <div>
                          <DivTitleContainer>
                            <span id="modal-modal-title">Update E-mail Address</span>
                            <DivCancelIcon onClick={closeConnectedModal}>
                              <CancelIcon style={{ color: '#818C99' }} />
                            </DivCancelIcon>
                          </DivTitleContainer>
                          <DivSecondContainer>
                            <Field
                              as={Input}
                              id="email"
                              variant="outlined"
                              name="email"
                              error={errors.email && touched.email ? true : false}
                            />
                          </DivSecondContainer>
                          <DivAddButton>
                            <Button
                              className={className}
                              type="submit"
                              disabled={!values.email || loading || initialValues.email === values.email}
                            >
                              Save
                            </Button>
                          </DivAddButton>
                        </div>
                      </Box>
                    )}

                    {phone && (
                      <Box sx={style}>
                        <div>
                          <DivTitleContainer>
                            <span id="modal-modal-title">Change Phone Number</span>
                            <DivCancelIcon onClick={closeConnectedModal}>
                              <CancelIcon style={{ color: '#818C99' }} />
                            </DivCancelIcon>
                          </DivTitleContainer>
                          <DivSecondContainer data-testid="phone-input">
                            <Field
                              as={PhoneInput}
                              id="phone"
                              variant="outlined"
                              name="phone"
                              error={errors.phone && touched.phone ? true : false}
                              onChange={(e: any) => setFieldValue('phone', e)}
                            />
                          </DivSecondContainer>
                          <DivAddButton>
                            <Button
                              className={className}
                              type="submit"
                              disabled={!values.phone || loading || initialValues.phone === values.phone}
                            >
                              Save
                            </Button>
                          </DivAddButton>
                        </div>
                      </Box>
                    )}
                  </Form>
                )}
              </Formik>
            </>
          </Modal>
        </DivModalContainer>
        {openVerification && (
          <CommonDialog open={openVerification} onClose={closeConnectedModal} title="">
            <Grid container>
              <Grid item md={12} sm={12} xs={12}>
                <DivDoubleArrowWrapper>
                  <DoubleArrow />
                </DivDoubleArrowWrapper>
                <DivAuthHeading data-testid="verification-heading">Authentication</DivAuthHeading>
              </Grid>
            </Grid>
            <DivFormWrapper className="form-wrapper">
              <p>We've sent a 6-digit verification code to your {email ? 'email' : 'phone'}</p>
              <p className="sub-heading">{email ? user.email : user.phone}</p>
              <VerificationForm
                setLoading={setLoading}
                loading={loading}
                onSubmit={wallet ? handleSwitchWallet : handleSubmit}
              />
            </DivFormWrapper>
          </CommonDialog>
        )}
      </DivContainer>
    </>
  );
};

export default Settings;
