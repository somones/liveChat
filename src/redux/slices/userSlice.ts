import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: number;
}

interface UserState {
  currentUser: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { setUserLoading, setUser, setUserError, clearUser } = userSlice.actions;

export default userSlice.reducer;