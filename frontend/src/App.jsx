// import { useEffect, useRef } from 'react'
// import ChatPage from './components/ChatPage'
// import EditProfile from './components/EditProfile'
// import Home from './components/Home'
// import Login from './components/Login'
// import MainLayout from './components/MainLayout'
// import Profile from './components/Profile'
// import Signup from './components/Signup'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import { io } from "socket.io-client";
// import { useDispatch, useSelector } from 'react-redux'
// import { setSocket } from './redux/socketSlice'
// import { setOnlineUsers } from './redux/chatSlice'
// import { setLikeNotification } from './redux/rtnSlice'
// import ProtectedRoutes from './components/ProtectedRoutes'


// const browserRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
//     children: [
//       {
//         path: '/',
//         element: <ProtectedRoutes><Home /></ProtectedRoutes>
//       },
//       {
//         path: '/profile/:id',
//         element: <ProtectedRoutes> <Profile /></ProtectedRoutes>
//       },
//       {
//         path: '/account/edit',
//         element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
//       },
//       {
//         path: '/chat',
//         element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
//       },
//     ]
//   },
//   {
//     path: '/login',
//     element: <Login />
//   },
//   {
//     path: '/signup',
//     element: <Signup />
//   },
// ])

// function App() {
//   const { user } = useSelector(store => store.auth);
//   const { socket } = useSelector(store => store.socketio);
//   const dispatch = useDispatch();
//   const socketRef = useRef(null);

//   useEffect(() => {
//     if (user) {
//       const socketio = io('http://localhost:3000', {
//         query: {
//           userId: user?._id
//         },
//         transports: ['websocket']
//       });
//       dispatch(setSocket(socketio));

//       // listen all the events
//       socketio.on('getOnlineUsers', (onlineUsers) => {
//         dispatch(setOnlineUsers(onlineUsers));
//       });

//       socketio.on('notification', (notification) => {
//         dispatch(setLikeNotification(notification));
//       });

//       return () => {
//         socketio.close();
//         dispatch(setSocket(null));
//       }
//     } else if (socket) {
//       socket.close();
//       dispatch(setSocket(null));
//     }
//   }, [user, dispatch]);

 

//   return (
//     <>
//       <RouterProvider router={browserRouter} />
//     </>
//   )
// }

// export default App
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ChatPage from "./components/ChatPage";
import EditProfile from "./components/EditProfile";
import Home from "./components/Home";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Signup from "./components/Signup";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/account/edit",
        element: (
          <ProtectedRoutes>
            <EditProfile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoutes>
            <ChatPage />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?._id) {
      console.warn("[App] No user logged in. Skipping WebSocket initialization.");
      return;
    }

    // Initialize the WebSocket connection
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      withCredentials: true,
      query: {
        userId: user._id, // Pass the user ID to the server
      },
    });

    console.log("✅ [WebSocket] Connecting...");

    // Attach event listeners
    socket.on("connect", () => {
      console.log("✅ [WebSocket] Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.warn("⚠️ [WebSocket] Disconnected!");
    });

    socket.on("getOnlineUsers", (onlineUsers) => {
      console.log("📢 [RTM] Online Users Updated:", onlineUsers);
      dispatch(setOnlineUsers(onlineUsers));
    });

    socket.on("notification", (notification) => {
      console.log("🔔 [RTM] New Notification:", notification);
      dispatch(setLikeNotification(notification));
    });

    // Store the socket instance in the Redux store
    dispatch(setSocket(socket));

    // Cleanup function
    return () => {
      console.warn("[App] Cleaning up WebSocket connection...");
      socket.disconnect();
      dispatch(setSocket(null));
    };
  }, [user?._id, dispatch]); // Only re-run when the user ID changes

  return <RouterProvider router={browserRouter} />;
}

export default App;