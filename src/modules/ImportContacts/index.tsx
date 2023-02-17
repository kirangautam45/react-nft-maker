import React, { useEffect } from 'react';

import { ArrowRightBlue } from '@/assets/svg/arrow-right-blue';
import { GoogleIcon } from '@/assets/svg/google-icon';
import CommonDialog from '@/components/core/CommonDialog';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxTypedHooks';
import { getContactsList, importContactService } from '@/services/contact/contact.service';
import { getAuthDataSelector } from '@/store/auth';
import {
  getContactsSelector,
  setAllContacts,
  toggleImportModal,
  setSelectedContacts,
  setSelectContactModalOpen,
} from '@/store/contacts';
import { changeStep, createNewNFT, setFromScreen } from '@/store/nft/nftSlice';
import { removeNumbersFromString } from '@/utils/helper';

import {
  DivButtonTitleContent,
  DivButtonTitleWrapper,
  DivImportButton,
  DivImportButtonContent,
  DivImportContact,
  ImportButton,
} from './index.styles';
import { CustomWindow, ImportContact, ImportContactsProps } from './index.type';

// declare custom window with cloud type props
declare let window: CustomWindow;

/**
 *
 * @returns Modal import contacts
 */
const ImportContacts = ({ resetState }: { resetState?: () => void }) => {
  const { importContacts } = useAppSelector(getContactsSelector);
  const { user } = useAppSelector(getAuthDataSelector);

  const dispatch = useAppDispatch();

  const toggleModal = (shouldReset = true) => {
    dispatch(toggleImportModal());
    setSelectContactModalOpen();
    if (shouldReset) {
      if (resetState) return resetState();
    }
  };

  const onCloseModel = () => {
    toggleModal();
    dispatch(createNewNFT());
    dispatch(changeStep('create'));
    dispatch(setFromScreen('main'));
  };

  const LoadCloudSponge = (callback: any) => {
    const existingScript: any = document.getElementById('cloudSponge');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // for localhost testing
      script.src = 'https://api.cloudsponge.com/widget/localhost-only.js';
    } else {
      // for production
      script.src = 'https://api.cloudsponge.com/widget/l8UL7ckxBgjk0bLDQv5gzA.js';
    }

    script.id = 'cloudSponge';
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };

    if (existingScript && callback) callback();
  };
  const saveContactsAtBackend = async (contacts: ImportContact[]) => {
    // add owner info to contacts
    const setPhoneNumber = (number: any) => number.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
    const contactNumbers = contacts.map((contact: any) => {
      const addresses = contact.address.map((i: any) => {
        const { street, city, region, country } = i;
        const postalCode = i['postal_code'];
        return { street, city, region, country, postalCode, type: 'other' };
      });
      const email = contact.email.map((i: any) => ({ address: i.address, type: i.type }));
      const phone = contact.phone.map((i: any) => ({ number: `+${setPhoneNumber(i.number)}`, type: i.type }));
      const tempContact: ImportContactsProps = {
        address: addresses,
        appId: user.userId,
        companies: contact.companies,
        email,
        firstName: removeNumbersFromString(contact.first_name),
        groups: contact.groups,
        importSource: 'Google',
        jobTitle: contact.job_title,
        lastName: removeNumbersFromString(contact.last_name),
        phone,
      };
      // tempContact = removeAllEmptyData(tempContact);

      return tempContact;
    });
    // Ajax Request to create user
    await importContactService(contactNumbers, user?.userId);
    const response: any = await getContactsList(user.userId);
    dispatch(setAllContacts(response?.data || []));
    dispatch(setSelectedContacts(response?.data || []));
  };
  useEffect(() => {
    LoadCloudSponge(() => {
      if (window.cloudsponge) {
        window.cloudsponge.init({
          skipContactsDisplay: false,
          skipSourceMenu: true,
          browserContactCacheMin: false,
          rootNodeSelector: '#cloudsponge-widget-container',
          beforeDisplayContacts(contacts: ImportContact[]) {
            saveContactsAtBackend(contacts);
            toggleModal();
            const all = document.getElementsByClassName('initial__modal') as HTMLCollectionOf<HTMLElement>;
            for (let i = 0; i < all.length; i++) {
              all[i].style.display = 'block';
            }
            if (resetState) resetState();
            return false;
          },
          beforeLaunch() {
            const all1 = document.getElementsByClassName('initial__modal') as HTMLCollectionOf<HTMLElement>;
            for (let i = 0; i < all1.length; i++) {
              all1[i].style.display = 'none';
            }
          },
          beforeClosing() {
            const all1 = document.getElementsByClassName('initial__modal') as HTMLCollectionOf<HTMLElement>;
            for (let i = 0; i < all1.length; i++) {
              all1[i].style.display = 'block';
            }
          },
          afterImport() {
            const all = document.getElementsByClassName('contactDialogBack') as HTMLCollectionOf<HTMLElement>;
            for (let i = 0; i < all.length; i++) {
              all[i].style.visibility = 'hidden';
            }
            // const sourceTitle =
            //   source === 'office365' ? 'Microsoft 365' : source === 'icloud' ? 'Apple Contacts (iCloud)' : 'Google';
            // callback(!success, sourceTitle);
            // dispatch(changeStep('create'));
            localStorage.setItem('importContact', 'true');
          },
          afterClosing() {},
        });
      }
    });
  }, []);

  useEffect(() => {
    toggleModal(false);
  }, []);

  return (
    <CommonDialog
      open={importContacts}
      onClose={onCloseModel}
      title={'Import your contacts to generate and share your NFT'}
    >
      <DivImportContact data-testid="import-contacts-modal">
        <DivImportButton>
          <ImportButton className={`cloudsponge-launch`} data-cloudsponge-source="gmail">
            <DivButtonTitleWrapper>
              <DivImportButtonContent>
                <GoogleIcon />
                <DivButtonTitleContent>Sign in with Google</DivButtonTitleContent>
                <ArrowRightBlue />
              </DivImportButtonContent>
            </DivButtonTitleWrapper>
          </ImportButton>
        </DivImportButton>
      </DivImportContact>
    </CommonDialog>
  );
};

export default ImportContacts;
