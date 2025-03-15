import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io("http://localhost:3000", {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: true, // ✅ Ensure auto connection
      query: { userId: user._id },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
