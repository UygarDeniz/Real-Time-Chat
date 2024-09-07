import { createSlice } from '@reduxjs/toolkit';
type UserState = {
  name: string | null;
};

const initialState: UserState = {
  name: null,
};
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.name = action.payload;
    },
    logout: (state) => {
      state.name = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
