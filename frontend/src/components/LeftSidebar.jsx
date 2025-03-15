// import {
//   Heart,
//   Home,
//   LogOut,
//   MessageCircle,
//   PlusSquare,
//   Search,
//   TrendingUp,
// } from "lucide-react";
// import React, { useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setAuthUser } from "@/redux/authSlice";
// import CreatePost from "./CreatePost";
// import { setPosts, setSelectedPost } from "@/redux/postSlice";
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
// import { Button } from "./ui/button";
// import api from "./../api/api";

// const LeftSidebar = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Fetch required data from Redux store
//   const { user } = useSelector((store) => store.auth);
//   const { likeNotification } = useSelector(
//     (store) => store.realTimeNotification
//   );
//   const { unreadCount } = useSelector((store) => store.chat); // ✅ Fix: Get unreadCount from Redux

//   const [open, setOpen] = useState(false);

//   // Logout function
//   const logoutHandler = async () => {
//     try {
//       const res = await api.get("/user/logout", { withCredentials: true });
//       if (res.data.success) {
//         dispatch(setAuthUser(null));
//         dispatch(setSelectedPost(null));
//         dispatch(setPosts([]));
//         navigate("/login");
//         toast.success(res.data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Logout failed");
//     }
//   };

//   // Sidebar navigation handler
//   const sidebarHandler = (textType) => {
//     const routes = {
//       Logout: logoutHandler,
//       Create: () => setOpen(true),
//       Profile: () => navigate(`/profile/${user?._id}`),
//       Home: () => navigate("/"),
//       Messages: () => navigate("/chat"),
//     };
//     routes[textType]?.();
//   };

//   // Sidebar items list
//   const sidebarItems = [
//     { icon: <Home />, text: "Home" },
//     { icon: <Search />, text: "Search" },
//     { icon: <TrendingUp />, text: "Explore" },
//     {
//       icon: <MessageCircle />,
//       text: "Messages",
//       showDot: unreadCount > 0, // ✅ Fix: Ensure unreadCount is used properly
//     },
//     { icon: <Heart />, text: "Notifications" },
//     { icon: <PlusSquare />, text: "Create" },
//     {
//       icon: (
//         <Avatar className="w-6 h-6">
//           <AvatarImage src={user?.profilePicture} alt="Profile" />
//           <AvatarFallback>CN</AvatarFallback>
//         </Avatar>
//       ),
//       text: "Profile",
//     },
//     { icon: <LogOut />, text: "Logout" },
//   ];

//   return (
//     <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
//       <div className="flex flex-col">
//         <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
//         <div>
//           {sidebarItems.map((item, index) => (
//             <div
//               key={index}
//               onClick={() => sidebarHandler(item.text)}
//               className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
//             >
//               {item.icon}
//               <span>{item.text}</span>

//               {/* Show unread message count instead of a dot */}
//               {item.text === "Messages" && unreadCount > 0 && (
//                 <div className="absolute top-2 right-2 h-5 w-5 bg-red-600 text-white text-xs font-bold flex items-center justify-center rounded-full">
//                   {unreadCount > 99 ? "99+" : unreadCount}
//                 </div>
//               )}

//               {/* Notifications Popover */}
//               {item.text === "Notifications" && likeNotification.length > 0 && (
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       size="icon"
//                       className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
//                     >
//                       {likeNotification.length}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent>
//                     <div>
//                       {likeNotification.length === 0 ? (
//                         <p>No new notifications</p>
//                       ) : (
//                         likeNotification.map((notification) => (
//                           <div
//                             key={notification.userId}
//                             className="flex items-center gap-2 my-2"
//                           >
//                             <Avatar>
//                               <AvatarImage
//                                 src={notification.userDetails?.profilePicture}
//                               />
//                               <AvatarFallback>CN</AvatarFallback>
//                             </Avatar>
//                             <p className="text-sm">
//                               <span className="font-bold">
//                                 {notification.userDetails?.username}
//                               </span>{" "}
//                               liked your post
//                             </p>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </PopoverContent>
//                 </Popover>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Create Post Modal */}
//       <CreatePost open={open} setOpen={setOpen} />
//     </div>
//   );
// };

// export default LeftSidebar;
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import CreatePost from './CreatePost';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import api from './../api/api';

const LeftSidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Fetch required data from Redux store
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const { unreadCount } = useSelector(store => store.chat); // ✅ Fix: Get unreadCount from Redux

    const [open, setOpen] = useState(false);

    // Logout function
    const logoutHandler = async () => {
        try {
            const res = await api.get('/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    // Sidebar navigation handler
    const sidebarHandler = (textType) => {
        const routes = {
            "Logout": logoutHandler,
            "Create": () => setOpen(true),
            "Profile": () => navigate(`/profile/${user?._id}`),
            "Home": () => navigate("/"),
            "Messages": () => navigate("/chat")
        };
        routes[textType]?.();
    };

    // Sidebar items list
    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { 
            icon: <MessageCircle />, 
            text: "Messages",
            showUnread: unreadCount > 0 // ✅ Show unread message count
        },
        { icon: <Heart />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user?.profilePicture} alt="Profile" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ];

    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
                <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
                <div>
                    {sidebarItems.map((item, index) => (
                        <div 
                            key={index} 
                            onClick={() => sidebarHandler(item.text)} 
                            className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'
                        >
                            {item.icon}
                            <span>{item.text}</span>

                            {/* Show unread message count instead of a dot */}
                            {item.text === "Messages" && unreadCount > 0 && (
                                <div className="absolute top-2 right-2 h-5 w-5 bg-red-600 text-white text-xs font-bold flex items-center justify-center rounded-full">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </div>
                            )}

                            {/* Notifications Popover */}
                            {item.text === "Notifications" && likeNotification.length > 0 && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">
                                            {likeNotification.length}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div>
                                            {likeNotification.length === 0 ? (
                                                <p>No new notifications</p>
                                            ) : (
                                                likeNotification.map((notification) => (
                                                    <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                        <Avatar>
                                                            <AvatarImage src={notification.userDetails?.profilePicture} />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
                                                        <p className='text-sm'>
                                                            <span className='font-bold'>{notification.userDetails?.username}</span> liked your post
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Post Modal */}
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    );
};

export default LeftSidebar;
