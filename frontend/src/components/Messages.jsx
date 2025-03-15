import React, { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";
import { resetUnreadCount, addMessage } from "@/redux/chatSlice";
import { useSocket } from "@/redux/SocketContext";

const Messages = ({ selectedUser }) => {
  useGetRTM(); // Listen for real-time messages
  useGetAllMessage(); // Fetch initial messages

  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const socket = useSocket();

  const [localMessages, setLocalMessages] = useState([]);
  const messagesRef = useRef(new Set()); // Track message IDs to prevent duplicates
  const socketListenerRef = useRef(false); // Ensure only one listener

  // ✅ Filter messages for the selected user only
  useEffect(() => {
    if (!selectedUser || !user) return;

    const filteredMessages = messages.filter(
      (msg) =>
        (msg.senderId === user._id && msg.receiverId === selectedUser._id) ||
        (msg.senderId === selectedUser._id && msg.receiverId === user._id)
    );

    setLocalMessages(filteredMessages);
    messagesRef.current = new Set(filteredMessages.map((msg) => msg._id)); // Track unique messages
  }, [messages, selectedUser, user]);

  // ✅ Ensure only one socket listener is attached
  useEffect(() => {
    if (!socket || !selectedUser || !user) return;
    if (socketListenerRef.current) return; // Prevent multiple listeners

    const handleNewMessage = (newMessage) => {
      if (
        (newMessage.senderId === user._id && newMessage.receiverId === selectedUser._id) ||
        (newMessage.senderId === selectedUser._id && newMessage.receiverId === user._id)
      ) {
        if (!messagesRef.current.has(newMessage._id)) {
          messagesRef.current.add(newMessage._id);
          setLocalMessages((prev) => [...prev, newMessage]);
          dispatch(addMessage(newMessage)); // Update Redux store
        }
      }
    };

    socket.on("newMessage", handleNewMessage);
    socketListenerRef.current = true; // Mark that listener is attached

    return () => {
      socket.off("newMessage", handleNewMessage);
      socketListenerRef.current = false; // Reset when unmounting
    };
  }, [socket, selectedUser, user, dispatch]);

  // ✅ Mark messages as read when opening chat
  useEffect(() => {
    dispatch(resetUnreadCount());

    if (socket && selectedUser?._id) {
      socket.emit("markMessagesAsRead", { senderId: selectedUser._id });
    }
  }, [dispatch, socket, selectedUser]);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {localMessages.map((msg, index) => (
          <div
            key={msg._id || `temp-${index}`} // Ensure unique key
            className={`flex ${
              msg.senderId === user?._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg max-w-xs break-words ${
                msg.senderId === user?._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
