import { createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";

const initialState = {
    notifications: []
}


const NotificationSlice = createSlice({
    name: 'notify',
    initialState,
    reducers: {
        addNotify: (state, action) => {
            state.notifications.push(action.payload);
        }
    }
})

export const { addNotify } = NotificationSlice.actions
export default NotificationSlice.reducer
