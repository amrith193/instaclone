// import { setMessages } from "@/redux/chatSlice";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const useGetRTM = () => {
//     const dispatch = useDispatch();
//     const { socket } = useSelector(store => store.socketio);
//     const { messages } = useSelector(store => store.chat);
//     useEffect(() => {
//         socket?.on('newMessage', (newMessage) => {
//             dispatch(setMessages([...messages, newMessage]));
//         })

//         return () => {
//             socket?.off('newMessage');
//         }
//     }, [messages, setMessages]);
// };
// export default useGetRTM;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "@/redux/chatSlice";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);

  useEffect(() => {
    if (!socket || typeof socket.on !== "function") {
      console.warn("[RTM] No valid socket connection found!");
      return;
    }

    console.log("[RTM] Listening for new messages...");

    const handleNewMessage = (newMessage) => {
      console.log("[RTM] New message received:", newMessage);

      // Append the new message to the existing messages array
      dispatch(addMessage(newMessage));
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      console.log("[RTM] Unsubscribing from newMessage event.");
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch]);
};

export default useGetRTM;