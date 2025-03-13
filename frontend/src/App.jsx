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
import { useEffect, useRef } from "react";
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
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
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
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      console.log("[App] User logged in, setting up WebSocket...");

      if (!socketRef.current) {
        socketRef.current = io("http://localhost:3000", {
          query: { userId: user?._id },
          transports: ["websocket"],
          withCredentials: true,
        });

        socketRef.current.on("connect", () => {
          console.log("✅ [WebSocket] Connected:", socketRef.current.id);
        });

        socketRef.current.on("disconnect", () => {
          console.warn("⚠️ [WebSocket] Disconnected!");
        });

        socketRef.current.on("getOnlineUsers", (onlineUsers) => {
          console.log("📢 [RTM] Online Users Updated:", onlineUsers);
          dispatch(setOnlineUsers(onlineUsers));
        });

        socketRef.current.on("notification", (notification) => {
          console.log("🔔 [RTM] New Notification:", notification);
          dispatch(setLikeNotification(notification));
        });

        dispatch(setSocket(socketRef.current)); // Store the full socket instance
      }

      return () => {
        console.warn("[App] Cleaning up WebSocket connection...");
        if (socketRef.current) {
          socketRef.current.disconnect();
          dispatch(setSocket(null));
          socketRef.current = null;
        }
      };
    }
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
