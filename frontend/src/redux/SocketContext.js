import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user && !socketRef.current) {
      console.log("[Socket] Connecting...");

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

      return () => {
        console.warn("[Socket] Disconnecting...");
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [user, dispatch]);

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  return useContext(SocketContext);
};
