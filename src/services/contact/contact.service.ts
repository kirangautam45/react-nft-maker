import { API_CONTACT, API_FETCH_CONTACTS, API_IMPORT_CONTACT } from '@/constants/api';
import { getErrorMessage } from '@/utils/helper';

import { getRequest, postRequest } from '../utils';

export const importContactService = async (
  contactNumbers: any[],
  userId: any
): Promise<{
  response: any;
}> => {
  const resp = await postRequest(`${API_IMPORT_CONTACT(userId)}`, contactNumbers);
  return { response: resp.data };
};

export const getContactsList = async (userId: any): Promise<any> => {
  try {
    const { data } = await getRequest(`${API_FETCH_CONTACTS(userId)}`);
    return data;
  } catch (e: any) {
    throw new Error(getErrorMessage(e));
  }
};

export const createContact = async (requestBody: any, userId: string | undefined): Promise<any> => {
  try {
    const { data } = await postRequest(`${API_CONTACT}/${userId}`, requestBody);
    return transformData(data);
  } catch (e: any) {
    throw new Error(getErrorMessage(e));
  }
};

const transformData = ({ data }: { data: any }) => {
  const {
    contactJSON: { contactId, email, firstName, lastName, phone, userId },
  } = data;

  return {
    contactId,
    email,
    phone,
    userId,
    firstName,
    lastName,
  };
};
