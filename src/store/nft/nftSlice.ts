import { ActionReducerMapBuilder, createAsyncThunk, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

import { claimNftService } from '@/services/nft/claim.service';
import { CreateNFTData, createNftService } from '@/services/nft/create.service';
import { getNFTDetails } from '@/services/nft/dashboard.service';
import { INftItemType } from '@/services/nft/list.service';

import { CreateNftStepType, INftData, INFTDetails } from './types';

const initialAttributesId = nanoid();

const initialState: INFTDetails = {
  data: {
    actionType: '',
    attributes: [],
    category: '',
    created: 0,
    description: '',
    fileUrl: '',
    nftId: '',
    ownerId: '',
    status: '',
    title: '',
    updated: 0,
    owner: {
      created: 0,
      email: '',
      fullName: '',
      status: '',
      userId: '',
      verified: false,
      walletStatus: '',
      walletId: '',
    },
    attributesData: {
      ids: [initialAttributesId],
      data: {
        [initialAttributesId]: {
          attributeName: '',
          attributeValue: '',
        },
      },
    },
  },
  message: '',
  status: '',
  error: '',
  currentStep: null,
  allNfts: [],
  fromScreen: 'main',
};

export const nftDetailsThunk = createAsyncThunk('nftDetails/getDetails', async (nftId: string) => {
  return await getNFTDetails(nftId);
});

type ICreateNftThunk = {
  file: File | undefined;
  body: CreateNFTData;
  token: string;
  walletId: string;
  ownerId: string;
};

export type IClaimNftThunk = {
  nftId: string | undefined;
  claimToken: string;
};

export const createNftThunk = createAsyncThunk('nftDetails/createNft', async (data: ICreateNftThunk) => {
  const { token, body, walletId } = data;
  // const filePath = await uploadNftFile();
  // const collection = await createNftCollectionService({
  //   body: {
  //     collectionName: body.title,
  //     ownerId,
  //     status: 'pending',
  //   },
  //   token,
  // });

  //Put fixed categoryId for now since category is not yet implemented
  return await createNftService({
    body: {
      ...body,
      categoryId: '_0iM8scD5fkKFi6l9tMo0',
      collectionId: '_0iM8scD5fkKFi6l9tMo0',
      filePath: body.filePath,
    },
    token,
    walletId,
  });
});

export const claimNftThunk = createAsyncThunk('nftDetails/claimNft', async (data: IClaimNftThunk) => {
  const { nftId, claimToken } = data;

  return await claimNftService({ nftId, claimToken });
});

const nftSlice = createSlice({
  name: 'nftDetails',
  initialState,
  reducers: {
    createNewNFT(state: INFTDetails) {
      const newAttributeId = nanoid();
      state.data.attributesData = {
        ids: [newAttributeId],
        data: {
          [newAttributeId]: {
            attributeName: '',
            attributeValue: '',
          },
        },
      };
    },
    addAttribute(state: INFTDetails) {
      const newAttributeId = nanoid();
      if (state.data.attributesData) {
        state.data.attributesData.ids.push(newAttributeId);
        state.data.attributesData.data[newAttributeId] = {
          attributeName: '',
          attributeValue: '',
        };
      }
    },
    removeAttribute(state: INFTDetails, { payload }: PayloadAction<string>) {
      if (state.data.attributesData) {
        state.data.attributesData.ids = state.data.attributesData.ids.filter((id) => id !== payload);
        delete state.data.attributesData.data[payload];
      }
    },
    setAttributeData(
      state: INFTDetails,
      {
        payload,
      }: PayloadAction<{
        id: string;
        field: 'attributeName' | 'attributeValue';
        value: string;
      }>
    ) {
      if (state.data.attributesData) {
        state.data.attributesData.data[payload.id][payload.field] = payload.value;
      }
    },
    setSelectedFile(state: INFTDetails, { payload }: PayloadAction<File>) {
      state.data.selectedFile = payload;
    },
    setCreateNFTFormData(state: INFTDetails, { payload }: PayloadAction<Partial<INftData>>) {
      if (payload.title && payload.description) {
        state.data.title = payload.title;
        state.data.description = payload.description;
      }
    },
    setCategory(state: INFTDetails, { payload }: PayloadAction<string>) {
      state.data.category = payload;
    },
    setNftDetails(state: INFTDetails, { payload }: PayloadAction<INFTDetails>) {
      state = payload;
    },
    changeStep(state: INFTDetails, { payload }: PayloadAction<CreateNftStepType>) {
      state.currentStep = payload;
    },
    setFromScreen(state: INFTDetails, { payload }: PayloadAction<string>) {
      state.fromScreen = payload;
    },
    setAllNfts(state: INFTDetails, { payload }: PayloadAction<INftItemType[] | [] | undefined>) {
      state.allNfts = payload;
    },
    resetNftDetails: () => initialState,
  },
  extraReducers: (builder: ActionReducerMapBuilder<INFTDetails>) => {
    builder.addCase(nftDetailsThunk.pending, (state: INFTDetails) => {
      state.status = 'loading';
    });

    builder.addCase(nftDetailsThunk.fulfilled, (state: INFTDetails, { payload }) => {
      state.data = payload.data;
      state.message = payload.message;
      state.error = '';
      state.status = '';
    });

    builder.addCase(nftDetailsThunk.rejected, (state: INFTDetails, { error }) => {
      state.error = error.message;
    });

    builder.addCase(createNftThunk.pending, (state: INFTDetails) => {
      state.status = 'loading';
    });

    builder.addCase(createNftThunk.fulfilled, (state: INFTDetails, { payload }) => {
      state.data = { ...state.data, ...payload.data };
      state.message = payload.message;
      state.error = '';
      state.status = '';
      state.currentStep = 'success';
    });

    builder.addCase(createNftThunk.rejected, (state: INFTDetails, { error }) => {
      state.error = error.message;
      state.status = '';
      state.currentStep = 'error';
    });
  },
});

export const {
  setNftDetails,
  resetNftDetails,
  createNewNFT,
  setSelectedFile,
  setCreateNFTFormData,
  setAttributeData,
  removeAttribute,
  addAttribute,
  setCategory,
  changeStep,
  setFromScreen,
  setAllNfts,
} = nftSlice.actions;

export default nftSlice.reducer;
