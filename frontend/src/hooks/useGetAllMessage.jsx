// import { setMessages } from "@/redux/chatSlice";
// import { setPosts } from "@/redux/postSlice";
// import axios from "axios";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import api from "./../api/api";

// const useGetAllMessage = () => {
//     const dispatch = useDispatch();
//     const {selectedUser} = useSelector(store=>store.auth);
//     useEffect(() => {
//         const fetchAllMessage = async () => {
//             try {
//                 const res = await api.get(`/message/all/${selectedUser?._id}`, { withCredentials: true });
//                 if (res.data.success) {  
//                     dispatch(setMessages(res.data.messages));
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//         fetchAllMessage();
//     }, [selectedUser]);
// };
// export default useGetAllMessage;
// import { setMessages } from "@/redux/chatSlice";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import api from "./../api/api";

// const useGetAllMessage = () => {
//     const dispatch = useDispatch();
//     const { selectedUser } = useSelector((store) => store.auth);

//     useEffect(() => {
//         if (!selectedUser?._id) {
//             console.warn("[useGetAllMessage] No selected user found.");
//             return;
//         }

//         const fetchAllMessages = async () => {
//             try {
//                 console.log(`[useGetAllMessage] Fetching messages for user: ${selectedUser?._id}`);

//                 const res = await api.get(`/message/all/${selectedUser._id}`, { withCredentials: true });

//                 if (res.data.success) {
//                     console.log("[useGetAllMessage] Messages fetched successfully:", res.data.messages);
//                     dispatch(setMessages(res.data.messages));
//                 } else {
//                     console.warn("[useGetAllMessage] API responded with failure:", res.data);
//                 }
//             } catch (error) {
//                 console.error("[useGetAllMessage] Error fetching messages:", error);
//             }
//         };

//         fetchAllMessages();
//     }, [selectedUser, dispatch]);

// };

// export default useGetAllMessage;
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/redux/chatSlice";
import api from "./../api/api";
import { io } from "socket.io-client"; // Import socket.io-client

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector((store) => store.auth);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!selectedUser?._id) {
            console.warn("[useGetAllMessage] No selected user found.");
            return;
        }

        const fetchAllMessages = async () => {
            try {
                console.log(`[useGetAllMessage] Fetching messages for user: ${selectedUser?._id}`);

                const res = await api.get(`/message/all/${selectedUser._id}`, { withCredentials: true });

                if (res.data.success) {
                    console.log("[useGetAllMessage] Messages fetched successfully:", res.data.messages);
                    dispatch(setMessages(res.data.messages));
                } else {
                    console.warn("[useGetAllMessage] API responded with failure:", res.data);
                }
            } catch (error) {
                console.error("[useGetAllMessage] Error fetching messages:", error);
            }
        };

        fetchAllMessages();

        if (!socketRef.current) {
            socketRef.current = io("http://localhost:3000", {
                transports: ["websocket"],
                withCredentials: true,
            });

            socketRef.current.on("newMessage", (newMessage) => {
                dispatch(setMessages((prevMessages) => [...prevMessages, newMessage]));
            });

            return () => {
                socketRef.current.off("newMessage");
                socketRef.current.disconnect();
                socketRef.current = null;
            };
        }
    }, [selectedUser, dispatch]);

};

export default useGetAllMessage;
