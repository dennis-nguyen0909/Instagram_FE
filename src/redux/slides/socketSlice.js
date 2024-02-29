// socketSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    connected: false,
};

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        connectSocket: (state) => {
            state.connected = true;
        },
        disconnectSocket: (state) => {
            state.connected = false;
        },
    },
});

export const { connectSocket, disconnectSocket } = socketSlice.actions;
export default socketSlice.reducer;
