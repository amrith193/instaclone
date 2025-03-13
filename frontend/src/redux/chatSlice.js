import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [], // Messages array
  onlineUsers: [], // Array of online user IDs
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload; // Update messages
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload); // Append a single message
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload; // Update online users
    },
  },
});

export const { setMessages, addMessage, setOnlineUsers } = chatSlice.actions;

export default chatSlice.reducer;