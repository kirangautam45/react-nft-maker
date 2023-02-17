import { createSlice } from '@reduxjs/toolkit';

import { IDialogsStatus } from './types';

const initialState: IDialogsStatus = {
  isSendNftDialogOpen: false,
  isCreateNftDialogOpen: false,
  isSelectContactOpen: false,
};

const dialogSlice = createSlice({
  name: 'dialogStatus',
  initialState,
  reducers: {
    toggleSendNftDialog(state: IDialogsStatus) {
      state.isSendNftDialogOpen = !state.isSendNftDialogOpen;
    },
    openSendNftDialog(state: IDialogsStatus) {
      state.isSendNftDialogOpen = true;
    },
    closeSendNftDialog(state: IDialogsStatus) {
      state.isSendNftDialogOpen = false;
    },

    toggleCreateNftDialog(state: IDialogsStatus) {
      state.isCreateNftDialogOpen = !state.isCreateNftDialogOpen;
    },
    openCreateNftDialog(state: IDialogsStatus) {
      state.isCreateNftDialogOpen = true;
    },
    closeCreateNftDialog(state: IDialogsStatus) {
      state.isCreateNftDialogOpen = false;
    },

    openAndCloseContactDialog(state: IDialogsStatus, { payload }) {
      state.isSelectContactOpen = payload;
    },

    resetProcess: () => initialState,
  },
});

export const {
  toggleSendNftDialog,
  openSendNftDialog,
  closeSendNftDialog,
  toggleCreateNftDialog,
  openCreateNftDialog,
  closeCreateNftDialog,
  openAndCloseContactDialog,
} = dialogSlice.actions;

export default dialogSlice.reducer;
