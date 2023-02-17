import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getContactsList, createContact } from '@/services/contact/contact.service';

import { IContactStore } from './types';

const initialState: IContactStore = {
  importContacts: false,
  selectContactDialog: false,
  addContact: false,
  allContactsLoading: true,
  allContacts: [],
  selectedContacts: [],
  isContactImported: false,
  loadingMessage: '',
};

export const getContactsThunk = createAsyncThunk('contacts/list', async (userId: any) => {
  return await getContactsList(userId);
});

export const createContactsThunk = createAsyncThunk(
  'contacts/create',
  async ({ requestBody, userId }: { requestBody: any; userId: string | undefined }) => {
    return await createContact(requestBody, userId);
  }
);

const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    toggleImportModal(state: IContactStore) {
      state.importContacts = !state.importContacts;
    },
    toggleSelectContactModal(state: IContactStore) {
      state.selectContactDialog = !state.selectContactDialog;
    },
    setSelectContactModalOpen(state: IContactStore) {
      state.selectContactDialog = true;
    },
    toggleAddContactModal(state: IContactStore) {
      state.addContact = !state.addContact;
    },
    setAllContacts(state: IContactStore, { payload }: PayloadAction<any[]>) {
      state.allContacts = payload;
      state.isContactImported = true;
    },
    setAllContactsLoading(state: IContactStore, { payload }: PayloadAction<boolean>) {
      state.allContactsLoading = payload;
    },
    setSelectedContacts(state: IContactStore, { payload }: PayloadAction<any[]>) {
      state.selectedContacts = payload;
    },
    resetContacts: () => initialState,
  },
  extraReducers: (builder: ActionReducerMapBuilder<IContactStore>) => {
    builder.addCase(getContactsThunk.pending, (state: IContactStore) => {
      state.allContactsLoading = true;
    });

    builder.addCase(getContactsThunk.fulfilled, (state: IContactStore, { payload }) => {
      state.allContactsLoading = false;
      state.allContacts = payload.data;
      state.selectedContacts = payload.data;
      state.selectContactDialog = true;
    });

    builder.addCase(getContactsThunk.rejected, (state: IContactStore) => {
      state.allContactsLoading = false;
    });

    builder.addCase(createContactsThunk.pending, (state: IContactStore) => {
      state.allContactsLoading = true;
      state.selectContactDialog = true;
      state.loadingMessage = 'Adding Contacts';
    });

    builder.addCase(createContactsThunk.fulfilled, (state: IContactStore) => {
      state.allContactsLoading = false;
      state.selectContactDialog = true;
      state.loadingMessage = '';
    });

    builder.addCase(createContactsThunk.rejected, (state: IContactStore) => {
      state.allContactsLoading = false;
      state.loadingMessage = '';
    });
  },
});

export const {
  toggleImportModal,
  resetContacts,
  toggleSelectContactModal,
  toggleAddContactModal,
  setAllContacts,
  setSelectedContacts,
  setSelectContactModalOpen,
} = contactSlice.actions;

export default contactSlice.reducer;
