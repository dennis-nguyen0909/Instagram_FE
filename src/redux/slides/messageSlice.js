import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initialState = {
    messageChat: []
}

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            const { messageChat } = action.payload
            console.log("messageChat", messageChat)
            const itemChat = state.messageChat.find((item) => item.id === messageChat.id)
            state.messageChat.push(messageChat)
            // state.id = _id
            // state.text = text
            // state.senderId = senderId
            // state.chatId = chatId
            // state.createdAt = createdAt
        }
    }
})

export const { addMessage } = messageSlice.actions
export default messageSlice.reducer
