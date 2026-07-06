import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../../types/user-types'
import { getFetch } from '../../utils/getFetch'

interface AuthState {
  user: User | null;
  isGuest: boolean;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isGuest: false,
  isAuthenticated: false,
  loading: true,
}

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const resData = await getFetch<{
        data: {
          user: User | null;
          isGuest?: boolean;
        };
      }>("/auth", {
        method: "POST",
        private: true,
      });
      return resData?.data || { user: null, isGuest: true };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      const user = action.payload;
      state.user = user;
      state.isAuthenticated = !!user;
      state.isGuest = !user;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        const { user, isGuest } = action.payload || { user: null, isGuest: true };
        state.user = user || null;
        state.isAuthenticated = !!user;
        state.isGuest = isGuest !== undefined ? !!isGuest : true;
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isGuest = true;
        state.loading = false;
      })
  }
})

export const { setUser } = authSlice.actions
export default authSlice.reducer
