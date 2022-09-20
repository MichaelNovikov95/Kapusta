import { createSlice } from '@reduxjs/toolkit';
import {
  handleLogin,
  handleLogout,
  handleRegistration,
  handleAuthGoogle,
  initNewSession,
  getCurrentUser,
  handleUpdateUserBalance,
} from './auth-operations';

const initialState = {
  userData: {},
  loading: false,
  error: null,
  accessToken: '',
  refreshToken: '',
  sid: '',
  currentUser: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateBalance: (state, { payload: { newBalance } }) => {
      state.userData.balance = newBalance;
    },
  },
  extraReducers: {
    // -------------------register------------------------------

    [handleRegistration.pending]: store => {
      store.loading = true;
      store.error = null;
    },
    [handleRegistration.fulfilled]: (store, { payload }) => {
      store.userData = { ...payload.userData };
      store.token = payload.token;
      store.loading = false;
      // console.log(payload);
    },
    [handleRegistration.rejected]: (store, { payload }) => {
      store.loading = false;
      store.error = payload.message;
    },
    // -----------------auth/google----------------------------

    [handleAuthGoogle.fulfilled]: (store, { payload }) => {
      store.loading = false;
      // console.log(payload);
    },

    // -------------------login------------------------------

    [handleLogin.pending]: store => {
      store.loading = true;
      store.error = null;
    },
    [handleLogin.fulfilled]: (store, { payload }) => {
      store.userData = { ...payload.userData };
      store.accessToken = payload.accessToken;
      store.loading = false;
      store.sid = payload.sid;
      store.refreshToken = payload.refreshToken;
      store.currentUser = true;
    },
    [handleLogin.rejected]: (store, { payload }) => {
      store.loading = false;
      store.error = payload.message;
    },

    // -------------------logout------------------------------
    [handleLogout.pending]: store => {
      store.loading = true;
      store.error = null;
    },
    [handleLogout.fulfilled]: () => ({ ...initialState }),
    [handleLogout.rejected]: (store, { payload }) => {
      store.loading = false;
      store.error = payload.message;
    },

    // -------------------currentUser----------------------------------

    [getCurrentUser.pending]: store => {
      store.loading = true;
      store.error = null;
    },
    [getCurrentUser.fulfilled]: (store, { payload }) => {
      store.userData = { ...payload };
      store.currentUser = true;
    },
    [getCurrentUser.rejected]: (store, { payload }) => {
      store.loading = false;
      store.error = payload?.message;
    },

    // -------------------updateBalance----------------------------------

    [handleUpdateUserBalance.pending]: store => {
      store.loading = true;
      store.error = null;
    },
    [handleUpdateUserBalance.fulfilled]: (store, { payload }) => {
      store.userData.balance = payload.newBalance;
    },
    [handleUpdateUserBalance.rejected]: (store, { payload }) => {
      store.loading = false;
      store.error = payload.message;
    },
    // -------------------refresh------------------------------

    [initNewSession.pending]: store => {
      store.loading = true;
      store.error = null;
    },
    [initNewSession.fulfilled]: (state, { payload }) => {
      state.accessToken = payload.newAccessToken;
      state.refreshToken = payload.newRefreshToken;
      state.sid = payload.newSid;
      state.loading = false;
    },
    [initNewSession.rejected]: (store, { payload }) => {
      store.loading = false;
      store.error = payload.message;
    },
  },
});

export const { updateBalance } = authSlice.actions;
export default authSlice.reducer;
