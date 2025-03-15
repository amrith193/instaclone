
// import { useEffect } from "react";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setOnlineUsers, addMessage, resetUnreadCount  } from "./redux/chatSlice";
// import { setLikeNotification } from "./redux/rtnSlice";

// import ProtectedRoutes from "./components/ProtectedRoutes";
// import ChatPage from "./components/ChatPage";
// import EditProfile from "./components/EditProfile";
// import Home from "./components/Home";
// import Login from "./components/Login";
// import MainLayout from "./components/MainLayout";
// import Profile from "./components/Profile";
// import Signup from "./components/Signup";
// import { useSocket } from "./redux/SocketContext"; // ✅ Import socket context

// const browserRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <ProtectedRoutes>
//         <MainLayout />
//       </ProtectedRoutes>
//     ),
//     children: [
//       { path: "/", element: <ProtectedRoutes><Home /></ProtectedRoutes> },
//       { path: "/profile/:id", element: <ProtectedRoutes><Profile /></ProtectedRoutes> },
//       { path: "/account/edit", element: <ProtectedRoutes><EditProfile /></ProtectedRoutes> },
//       { path: "/chat", element: <ProtectedRoutes><ChatPage /></ProtectedRoutes> },
//     ],
//   },
//   { path: "/login", element: <Login /> },
//   { path: "/signup", element: <Signup /> },
// ]);

// function App() {
//   const { user } = useSelector((store) => store.auth);
//   const dispatch = useDispatch();
//   const socket = useSocket(); // ✅ Get socket instance from context

//   useEffect(() => {
//     if (!socket || !user?._id) return;

//     console.log("✅ [WebSocket] Connected:", socket.id);

//     // ✅ Listen for real-time online users
//     const handleOnlineUsers = (onlineUsers) => {
//       console.log("📢 [RTM] Online Users Updated:", onlineUsers);
//       dispatch(setOnlineUsers(onlineUsers));
//     };

//     // ✅ Listen for real-time notifications
//     const handleNotification = (notification) => {
//       console.log("🔔 [RTM] New Notification:", notification);
//       dispatch(setLikeNotification(notification));
//     };

//     // ✅ Listen for new messages in real-time
//     // const handleNewMessage = (message) => {
//     //   console.log("📩 [Chat] New Message Received:", message);
//     //   dispatch(addMessage(message)); // ✅ Add message to store

//     //   if (message.receiverId === user._id) {
//     //     dispatch(setUnreadMessages({ senderId: message.senderId })); // ✅ Mark as unread if the message is for this user
//     //   }
//     // };

//     const handleNewMessage = (message) => {
//       console.log("📩 [Chat] New Message Received:", message);
//       dispatch(addMessage(message)); // ✅ Add message to store

//       if (message.receiverId === user._id) {
//         dispatch(resetUnreadCount()); // ✅ Correct function to reset unread count
//       }
//     };

//     socket.on("getOnlineUsers", handleOnlineUsers);
//     socket.on("notification", handleNotification);
//     socket.on("newMessage", handleNewMessage); // ✅ Listen for real-time messages

//     return () => {
//       console.warn("⚠️ [WebSocket] Cleaning up event listeners...");
//       socket.off("getOnlineUsers", handleOnlineUsers);
//       socket.off("notification", handleNotification);
//       socket.off("newMessage", handleNewMessage);
//     };
//   }, [socket, user?._id, dispatch]);

//   return <RouterProvider router={browserRouter} />;

  
// }

// export default App;


import { useEffect, useState,useRef  } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers, addMessage, resetUnreadCount ,incrementUnreadCount } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";

import ProtectedRoutes from "./components/ProtectedRoutes";
import ChatPage from "./components/ChatPage";
import EditProfile from "./components/EditProfile";
import Home from "./components/Home";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import { useSocket } from "./redux/SocketContext"; // ✅ Import socket context

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "/", element: <ProtectedRoutes><Home /></ProtectedRoutes> },
      { path: "/profile/:id", element: <ProtectedRoutes><Profile /></ProtectedRoutes> },
      { path: "/account/edit", element: <ProtectedRoutes><EditProfile /></ProtectedRoutes> },
      { path: "/chat", element: <ProtectedRoutes><ChatPage /></ProtectedRoutes> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

function App() {
  const [localMessages, setLocalMessages] = useState([]);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const socket = useSocket(); // ✅ Get socket instance from context
  const messagesRef = useRef(new Set());

  useEffect(() => {
    if (!socket || !user?._id) return;

    console.log("✅ [WebSocket] Connected:", socket.id);

    // ✅ Listen for real-time online users
    const handleOnlineUsers = (onlineUsers) => {
      console.log("📢 [RTM] Online Users Updated:", onlineUsers);
      dispatch(setOnlineUsers(onlineUsers));
    };

    // ✅ Listen for real-time notifications
    const handleNotification = (notification) => {
      console.log("🔔 [RTM] New Notification:", notification);
      dispatch(setLikeNotification(notification));
    };


  
    
    const handleNewMessage = (newMessage) => {
      if (!messagesRef.current.has(newMessage._id)) { // ✅ Prevent duplicates
        messagesRef.current.add(newMessage._id);
        setLocalMessages((prev) => [...prev, newMessage]);
        dispatch(addMessage(newMessage)); // Update Redux store
      }
    };
    
    

    
  


  socket.on("newMessage", (message) => {
    dispatch(incrementUnreadCount()); // ✅ Fixes error
  });

  
 

    socket.on("getOnlineUsers", handleOnlineUsers);
    socket.on("notification", handleNotification);


    return () => {
      console.warn("⚠️ [WebSocket] Cleaning up event listeners...");
      socket.off("getOnlineUsers", handleOnlineUsers);
      socket.off("notification", handleNotification);
      socket.off("newMessage", handleNewMessage);
      socket.off("resetUnreadCount",resetUnreadCount);
    };
  }, [socket, user?._id, dispatch]);

  return <RouterProvider router={browserRouter} />;

  
}

export default App;
