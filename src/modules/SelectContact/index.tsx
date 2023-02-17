import React, { useEffect, useState } from 'react';

import { InputAdornment, Avatar } from '@mui/material';

import { ArrowRight } from '@/assets/svg/arrow-right';
import { PlusIcon } from '@/assets/svg/plus-icon';
import { SearchIcon } from '@/assets/svg/search-icon';
import { SelectedContactIcon } from '@/assets/svg/selected-contact';
import CommonDialog from '@/components/core/CommonDialog';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxTypedHooks';
import CreateContact from '@/modules/CreateContact';
import ImportContacts from '@/modules/ImportContacts';
import { ImportContact } from '@/modules/SelectContact/index.type';
import { getContactsList } from '@/services/contact/contact.service';
import { getAuthDataSelector } from '@/store/auth';
import {
  getContactsSelector,
  setAllContacts,
  setSelectedContacts,
  toggleAddContactModal,
  toggleSelectContactModal,
} from '@/store/contacts';
import { openAndCloseContactDialog } from '@/store/dialogs';
import { getDialogsStatus } from '@/store/dialogs/dialogsSelector';
import { getNtfCreateStatus } from '@/store/nft';
import { changeStep, setFromScreen } from '@/store/nft/nftSlice';

import {
  BlueTitle,
  ButtonSend,
  DivButtonWrapper,
  DivContact,
  DivContactInfo,
  DivContactsList,
  DivContactSubTitle,
  DivContactTitle,
  DivContactWrapper,
  DivSelectContact,
  DivSelectedIcon,
  DivTitle,
  SearchBar,
  DivContactDetails,
} from './index.styles';

/**
 *
 * @returns Modal Select contacts
 */

const SelectContact = () => {
  const { selectContactDialog, allContacts, selectedContacts } = useAppSelector(getContactsSelector);
  const { token, user } = useAppSelector(getAuthDataSelector);
  const { isSelectContactOpen } = useAppSelector(getDialogsStatus);
  const { currentStep } = useAppSelector(getNtfCreateStatus);
  const [displayData, setDisplayData] = useState<any[]>(allContacts);
  const [openImportModal, setOpenImportModal] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getContactsData = async () => {
      if (!allContacts.length && token) {
        const response: any = await getContactsList(user.userId);
        dispatch(setAllContacts(response?.data || []));
      }
    };
    getContactsData();
  }, [token]);

  useEffect(() => {
    setDisplayData(allContacts);
    if (currentStep) toggleModal();
  }, [allContacts]);

  const findIfChecked = (contactId: any) => !!selectedContacts.find((contact) => contact.contactId === contactId);
  const toggleModal = () => {
    dispatch(toggleSelectContactModal());
    dispatch(openAndCloseContactDialog(false));
  };

  const addContact = () => dispatch(toggleAddContactModal());
  const importContact = () => {
    setOpenImportModal(!openImportModal);
  };
  const checkAllContacts = () => dispatch(setSelectedContacts(allContacts));
  const clearAllContacts = () => {
    if (selectedContacts.length) dispatch(setSelectedContacts([]));
  };

  const handleToggleContactSelection = (contact: ImportContact) => {
    if (findIfChecked(contact.contactId)) {
      dispatch(setSelectedContacts(selectedContacts.filter((c) => c.contactId !== contact.contactId)));
    } else dispatch(setSelectedContacts([...selectedContacts, contact]));
  };
  const getFulllName = (contact: ImportContact) =>
    `${contact.firstName ? contact.firstName : ''} ${contact.lastName ? contact.lastName : ''}`;
  const getPrimaryEmail = (contact: ImportContact) => {
    if (contact.email.length > 0) {
      return contact.email[0].address || '';
    }
    return '';
  };
  const getPrimaryPhone = (contact: ImportContact) => {
    if (contact?.phone?.length > 0) {
      return contact?.phone[0]?.number || '';
    }
    return '';
  };
  const getSearchResult = (text: string) => {
    const result: any[] = allContacts.filter(
      (data: any) =>
        getFulllName(data).toLowerCase().search(text) !== -1 ||
        getPrimaryEmail(data).toLowerCase().search(text) !== -1 ||
        getPrimaryPhone(data).toLowerCase().search(text) !== -1
    );
    return result;
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement> | any) => {
    const value = event.target.value.toLowerCase();
    const result = getSearchResult(value);
    setDisplayData(result);
  };

  const handleSendNFT = () => {
    dispatch(changeStep('create'));
    dispatch(openAndCloseContactDialog(false));
    dispatch(setFromScreen('contactModal'));
    toggleModal();
  };

  return (
    <CommonDialog
      paperStyle={{ maxWidth: '676px' }}
      maxWidth={'sm'}
      open={selectContactDialog || isSelectContactOpen}
      onClose={toggleModal}
      title={'Send NFT'}
    >
      <CreateContact />
      {openImportModal && <ImportContacts resetState={importContact} />}
      <DivSelectContact data-testid="select-contacts-modal">
        <SearchBar
          placeholder="Search contact or add new"
          id="outlined-start-adornment"
          sx={{ m: 1, width: '25ch' }}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment onClick={addContact} position="end">
                <PlusIcon />
              </InputAdornment>
            ),
          }}
        />
        <BlueTitle onClick={importContact}>Import</BlueTitle>
      </DivSelectContact>

      <DivTitle>
        <BlueTitle onClick={selectedContacts?.length < 1 ? checkAllContacts : clearAllContacts}>
          {selectedContacts?.length < 1 ? 'Select All' : 'Deselect All'}
        </BlueTitle>
        {/* <BlueTitle onClick={clearAllContacts}>Clear all</BlueTitle> */}
      </DivTitle>
      <DivContactsList>
        {displayData.map((contact: ImportContact, index: number) => {
          const displayName = `${contact.firstName ? contact.firstName : ''} ${
            contact.lastName ? contact.lastName : ''
          }`;
          const displayAvatarIconText = `${contact.firstName ? contact.firstName[0] : ''}${
            contact.lastName ? contact.lastName[0] : ''
          }`;
          let displayContact;
          if (contact && contact.email && Array.isArray(contact.email) && contact.email.length) {
            displayContact = contact.email[0].address;
          } else if (contact && contact.phone && Array.isArray(contact.phone) && contact.phone.length) {
            displayContact = contact.phone[0].number;
          }
          return (
            <DivContactWrapper key={index}>
              <DivContact>
                <DivContactInfo>
                  <Avatar>{displayAvatarIconText.toUpperCase()}</Avatar>
                  <DivContactDetails>
                    <DivContactTitle>{displayName}</DivContactTitle>
                    <DivContactSubTitle>{displayContact}</DivContactSubTitle>
                  </DivContactDetails>
                </DivContactInfo>
                <DivSelectedIcon onClick={() => handleToggleContactSelection(contact)}>
                  <SelectedContactIcon checked={findIfChecked(contact.contactId)} />
                </DivSelectedIcon>
              </DivContact>
            </DivContactWrapper>
          );
        })}
      </DivContactsList>
      <DivButtonWrapper>
        <ButtonSend onClick={handleSendNFT}>
          Send NFT <ArrowRight />
        </ButtonSend>
      </DivButtonWrapper>
    </CommonDialog>
  );
};

export default SelectContact;
