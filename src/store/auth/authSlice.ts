import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { loginService } from '@/services/auth/loginService';
import { signupService } from '@/services/auth/signupService';
import { updateUser } from '@/services/auth/userService';
import { validateToken } from '@/services/auth/validateToken';
import { verifyPasscode } from '@/services/auth/verifyPasscode';

import { UserState, User, ResponseUser, ILoginRequest, IVerificationRequest, Wallet } from './types';

export const initialState: UserState = {
  user: {
    phone: '',
    email: '',
    type: '',
    userId: '',
    accountId: '',
  },
  allWallet: [],
  token: '',
  isAuthenticated: false,
  status: '',
  otp: '',
  otpVerified: false,
  error: '',
  otpSent: false,
  actionWalletId: '',
};

//An example to use redux-thunk
export const verifyPasscodeThunk = createAsyncThunk(
  'users/verifyPasscode',
  async (requestData: IVerificationRequest) => {
    return await verifyPasscode(requestData);
  }
);

export const validateTokenThunk = createAsyncThunk('users/validateSession', async (token: string) => {
  return await validateToken(token);
});

export const loginUserThunk = createAsyncThunk('users/login', async (requestData: ILoginRequest) => {
  return await loginService(requestData);
});

export const updateUserThunk = createAsyncThunk(
  'users/update',
  async ({ userId, userData }: { userId: string; userData: Partial<User> }) => {
    const res = await updateUser({ userId, userData });
    return userData.firstName && userData.lastName
      ? { ...userData, fullName: `${userData.firstName} ${userData.lastName}` }
      : { user: userData, res };
  }
);

export const signupUserThunk = createAsyncThunk('users/signUp', async (requestData: User) => {
  return await signupService({ requestData });
});

const userDataMapper = (oldData: User, res: ResponseUser): User => {
  return {
    email: res.email ? res.email : oldData.email,
    phone: res.phone ? res.phone : oldData.phone,
    type: res.type ? res.type : oldData.type,
    accountId: res.walletId,
    created: res.created,
    fullName: `${res.firstName} ${res.lastName}`,
    status: res.status,
    userId: res.userId,
    verified: res.verified ? res.verified : oldData.verified,
    walletStatus: res.walletStatus ? res.walletStatus : oldData.walletStatus,
    walletId: res.walletId,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated(state: UserState, { payload }: PayloadAction<boolean>) {
      state.isAuthenticated = payload;
    },
    setUser(state: UserState, { payload }: PayloadAction<User>) {
      state.user = payload;
    },
    setToken(state: UserState, { payload }: PayloadAction<string>) {
      state.token = payload;
    },
    setOtp(state: UserState, { payload }: PayloadAction<string>) {
      state.otp = payload;
    },
    clearError(state: UserState) {
      state.error = '';
    },
    resetUser: () => {
      return initialState;
    },
    resetOtpSent(state: UserState) {
      state.otpSent = false;
    },
    resetStatus: (state: UserState) => {
      state.status = '';
    },
    resetVerificationStatus: (state: UserState) => {
      state.status = '';
    },
    switchWallet: (state: UserState, { payload }: PayloadAction<any>) => {
      state.status = 'Walet Switched Successfully';
      state.user = { ...state.user, ...payload };
    },
    setWallet: (state: UserState) => {
      state.allWallet = state.draftWallet ? [...state.allWallet, state.draftWallet] : state.allWallet;
      state.draftWallet = undefined;
    },
    setWalletDraft: (state: UserState, { payload }: PayloadAction<any>) => {
      state.draftWallet = payload;
    },
    setActionWalletId: (state: UserState, { payload }: PayloadAction<any>) => {
      state.actionWalletId = payload;
    },
    removeWallet: (state: UserState, { payload }: PayloadAction<any>) => {
      state.allWallet = payload;
    },
  },
  // redux thunk will be added in extraReducers
  extraReducers: (builder: ActionReducerMapBuilder<UserState>) => {
    // Pending state of API
    builder.addCase(verifyPasscodeThunk.pending, (state: UserState) => {
      state.status = '';
      state.otpVerified = false;
    });

    // On getting API response
    builder.addCase(verifyPasscodeThunk.fulfilled, (state: UserState, { payload }) => {
      state.status = 'Verification code verified';
      state.token = payload.jwtAccessToken;
      state.user = {
        ...state.user,
        ...payload.user,
        fullName: `${payload.user.firstName} ${payload.user.lastName}`,
      };
      state.allWallet = [
        {
          fullName: payload.user.firstName + ' ' + payload.user.lastName,
          walletId: payload.user.walletName,
          email: payload.user.email,
          phone: payload.user.phone,
        },
      ];
      state.actionWalletId = payload.user.walletName;

      state.otpVerified = true;
      state.otpSent = false;
    });

    // On promise rejection
    builder.addCase(verifyPasscodeThunk.rejected, (state: UserState, { error }) => {
      state.status = '';
      state.otp = '';
      state.error = error.message;
      state.otpVerified = false;
    });

    // Pending state of API
    builder.addCase(validateTokenThunk.pending, (state: UserState) => {
      state.status = 'loading';
    });

    // On getting API response
    builder.addCase(validateTokenThunk.fulfilled, (state: UserState, { payload }) => {
      state.status = '';
      state.token = payload.token;
    });

    // On promise rejection
    builder.addCase(validateTokenThunk.rejected, (state: UserState, { error }) => {
      state.status = '';
      state.token = '';
      state.error = error.message;
    });

    // Pending state of API
    builder.addCase(signupUserThunk.pending, (state: UserState) => {
      state.status = 'loading';
    });

    // On getting API response
    builder.addCase(signupUserThunk.fulfilled, (state: UserState, { payload }) => {
      state.status = '';
      state.user = {
        ...userDataMapper(state.user, payload.response.data.user),
        accountId: payload.response.data.user.walletName?.replace(/.near/g, '') || '',
        walletName: payload.response.data.user.walletName || '',
      };
      state.actionWalletId = payload.response.data.user.walletName || '';
      state.token = payload.response.data.jwtAccessToken;
      const walletArray: Wallet[] = state.allWallet || [];
      state.allWallet = [
        ...walletArray,
        {
          fullName: state.user.fullName,
          walletId: state.user.accountId,
          email: state.user.email,
          phone: state.user.phone,
        },
      ];
    });

    // On promise rejection
    builder.addCase(signupUserThunk.rejected, (state: UserState, { error }) => {
      state.status = '';
      state.error = error.message;
    });

    builder.addCase(loginUserThunk.pending, (state: UserState) => {
      state.status = '';
      state.otpSent = false;
    });

    builder.addCase(loginUserThunk.fulfilled, (state: UserState, { payload }) => {
      state.status = payload.response.message;
      state.user.type = payload.response.channelType;
      state.user.email = payload.response.email;
      state.user.phone = payload.response.phone;
      state.otpSent = true;
    });
    builder.addCase(loginUserThunk.rejected, (state: UserState, { error }) => {
      state.status = '';
      state.error = error.message;
      state.otpSent = false;
    });
    builder.addCase(updateUserThunk.pending, (state: UserState) => {
      state.status = '';
    });
    builder.addCase(updateUserThunk.rejected, (state: UserState, { error }) => {
      state.status = '';
      state.error = error.message;
    });
    builder.addCase(updateUserThunk.fulfilled, (state: UserState, { payload }) => {
      state.status = payload?.res?.response?.message || '';
      state.user = { ...state.user, ...payload.user };
    });
  },
});

export const {
  setAuthenticated,
  resetUser,
  setUser,
  setToken,
  setOtp,
  clearError,
  switchWallet,
  setWallet,
  setWalletDraft,
  removeWallet,
  setActionWalletId,
  resetStatus,
  resetOtpSent,
  resetVerificationStatus,
} = authSlice.actions;

export default authSlice.reducer;
