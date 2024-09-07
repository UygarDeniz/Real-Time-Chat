import { createSlice } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';
type SocketState = {
  socket: Socket | null;
  activeUsers: string[];
};
const initialState: SocketState = {
  socket: null,
  activeUsers: [],
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload;
    },
  },
});

export const { setSocket, setActiveUsers } = socketSlice.actions;
export default socketSlice.reducer;
