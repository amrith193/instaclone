// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   messages: [],
//   onlineUsers: [],
//   unreadCount: 0, // Track unread messages
// };

// const chatSlice = createSlice({
//   name: "chat",
//   initialState,
//   reducers: {
//     setMessages: (state, action) => {
//       state.messages = action.payload;
//     },
//     addMessage: (state, action) => {
//       state.messages.push(action.payload);
//       if (action.payload.receiverId === state.userId) {
//         state.unreadCount += 1;
//     }
//     },
//     setOnlineUsers: (state, action) => {
//       state.onlineUsers = action.payload; // ✅ Fix: Ensure state update works correctly
//     },
//     resetUnreadCount: (state) => {
//       state.unreadCount = 0; // Reset unread count when user opens chat
//     },
//     incrementUnreadCount: (state) => {
//       state.unreadCount += 1; // ✅ Increase unread count for new messages
//     },
//   },
// });

// export const { setMessages, addMessage, resetUnreadCount,setOnlineUsers,incrementUnreadCount  } = chatSlice.actions;
// export default chatSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  onlineUsers: [],
  unreadCount: 0, // Track unread messages
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      const { receiverId, senderId } = action.payload;
      if (receiverId === state.userId) {
        state.unreadCount += 1;
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload; 
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0; 
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
  },
});

export const { setMessages, addMessage, resetUnreadCount, setOnlineUsers, incrementUnreadCount } = chatSlice.actions;
export default chatSlice.reducer;
