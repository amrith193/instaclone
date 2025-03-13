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
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/redux/chatSlice";
import api from "./../api/api";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!selectedUser?._id) {
      console.warn("[useGetAllMessage] No selected user found.");
      return;
    }

    const fetchAllMessages = async () => {
      try {
        console.log(`[useGetAllMessage] Fetching messages for user: ${selectedUser?._id}`);

        const res = await api.get(`/message/all/${selectedUser._id}`, { withCredentials: true });

        if (res.data.success && Array.isArray(res.data.messages)) {
          console.log("[useGetAllMessage] Messages fetched successfully:", res.data.messages);
          dispatch(setMessages(res.data.messages)); // Ensure messages is an array
        } else {
          console.warn("[useGetAllMessage] Invalid API response:", res.data);
          dispatch(setMessages([])); // Fallback to an empty array
        }
      } catch (error) {
        console.error("[useGetAllMessage] Error fetching messages:", error);
        dispatch(setMessages([])); // Fallback to an empty array
      }
    };

    fetchAllMessages();
  }, [selectedUser, dispatch]);
};

export default useGetAllMessage;