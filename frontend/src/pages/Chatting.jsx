// Chat.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import io from "socket.io-client";
import axios from "axios";
import "../styles/chat.css";
import ChatSidebar from "../component/ChatComponent/ChatSidebar";
import ChatWindow from "../component/ChatComponent/ChatWindow";
import { server } from "../context/UserContext";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { useMediaQuery, useTheme } from "@mui/material";
import ChatReturnComponent from "../component/ChatComponent/ChatReturnComponent";

let socket;

const Chatting = () => {
  const [myId, setMyId] = useState();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [messages, setMessages] = useState([""]);
  const [myContacts, setMycontacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showChatWindow, setShowChatWindow] = useState(false);

  useEffect(() => {
    let socketInstance;

    const establishSocketConnection = () => {
      socketInstance = io("http://localhost:4000");
      socketInstance.emit("online", myId);
      socketInstance.on("onlineUsers", (map) => {
        setSocketConnected(true);
      });
    };
    const cleanUpSocketConnection = () => {
      if (socketInstance) {
        socketInstance.disconnect();
        setSocketConnected(false);
        console.log("Socket connection closed.");
      }
    };

    if (myId) {
      establishSocketConnection();

      return cleanUpSocketConnection;
    }
  }, [myId, navigate]);

  useEffect(() => {
    socket = io("http://localhost:4000");
    socket.on("onlineUsers", (map) => {
      setOnlineUsers(map);
    });
  });

  const fetchUserDetail = async () => {
    const token = Cookies.get("tokenf");
    if (!token) {
      navigate("/login");
    }
    const decodedToken = jwtDecode(token);
    const { id: userId } = decodedToken;

    const response = await axios.get(`${server}/getUserProfileById/${userId}`);
    const userData = response.data.user;
    setUserData(userData);

    setMyId(userId);
    if (token) {
      try {
        setLoading(true);
        const decodedToken = jwtDecode(token);
        const { id: userId } = decodedToken;

        const response = await axios.get(`${server}/findAllChats/${userId}`);
        const myContacts = await axios.get(`${server}/contacts/${userId}`);

        const userChats = response.data.chats;
        const contacts = myContacts.data.contacts;

        const updateContactList = [];

        // Update contactlist as a chat list for direct msg from mycontactlist
        const updateContacts = contacts.map((contact) => {
          const contactId = contact.contactId._id;
          // const userIdToSearch = "65f74373993a252804cd515e";
          const chatWithUser = userChats.find((chat) => {
            if (!chat.isGroupChat) {
              return chat.users.some((user) => user._id === contactId);            }
          });
          updateContactList.push(chatWithUser);

        });
        setMycontacts(updateContactList);



        const modifiedChats = userChats.map((chat) => {
          let unreadMsgCount = 0;

          if (!chat.isGroupChat) {
            const otherUserId = chat.users.find((id) => id !== userId);
            const contact = contacts.find(
              (contact) => contact.contactId._id === otherUserId._id
            );
            if (contact) {
              chat.groupName = contact.name;
              contact._id = chat._id;
            } else {
              chat.groupName = otherUserId.contactNo;
            }
          }

          chat.allChatMessages.forEach((message) => {
            if (!message.readBy.includes(userId)) {
              unreadMsgCount++;
            }
          });
          chat.unreadMsgCount = unreadMsgCount;
          return chat;
        });

        modifiedChats.sort(
          (a, b) =>
            new Date(b.latestMessageTime) - new Date(a.latestMessageTime)
        );
        setChats(modifiedChats);
      } catch (error) {
        toast.error("chat data not fetched");
        console.error("Error finding chat : ", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [navigate]);

  const fatchMsg = async (chatId) => {
    const response = await axios.get(`${server}/fetchAllMessages/${chatId}`);
    setMessages(response.data.messages.reverse());
  };

  const handleChatClick = async (chat) => {
    setShowChatWindow(true);
    try {
      setSelectedChat(chat);
      fatchMsg(chat._id);

      if (selectedChat) {
        await axios.post(`${server}/readAllMessages`, {
          myId,
          chatId: selectedChat._id,
        });
      }
      const responseReadMsg = await axios.post(`${server}/readAllMessages`, {
        myId,
        chatId: chat._id,
      });
      await fetchUserDetail();
      chat.unreadMsgCount = 0;

      // setChats((prevChats) => {
      //   const updatedChats = prevChats.filter((grp) => grp._id !== chat._id);
      //   return [chat, ...updatedChats];
      // });
    } catch (error) {
      console.log("chat not detected");
      console.log(error);
    }
  };

  return (
    <div className="main-container">
      <div className="chat-box">
        <div className="chat-body">
          <Box
            sx={{ flexGrow: 1, height: "100%", boxSizing: "border-box" }}
            display={isMobile && !showChatWindow ? "block" : "content"}
          >
            <Grid
              sx={{ height: "100%", overflow: "auto" }}
              container
              direction={isMobile ? "column" : "row"}
            >
              {/* Mobile Left sidebar for chat list */}
              {isMobile && !showChatWindow && (
                <Grid item="true" xs={12} sm={3} sx={{height:"-webkit-fill-available"}}>
                  <ChatSidebar
                    chats={chats}
                    handleChatClick={handleChatClick}
                    selectedChat={selectedChat}
                    userData={userData}
                    myContacts={myContacts}
                    myId={myId}
                  />
                </Grid>
              )}

              {/* Chat window (visible on mobile when chat is selected) */}
              {isMobile && showChatWindow && (
                <Grid item="true" xs={12} sm={4} sx={{height:' -webkit-fill-available'}}>
                  <ChatWindow
                    myId={myId}
                    messages={messages}
                    setMessages={setMessages}
                    selectedChat={selectedChat}
                    chats={chats}
                    setChats={setChats}
                    socketConnected={socketConnected}
                    showChatWindow={showChatWindow}
                    setShowChatWindow={setShowChatWindow}
                  />
                </Grid>
              )}

              {/* Chat window (visible on larger screens when chat is selected) */}

              {!isMobile && (
                <Grid item="true" xs={12} sm={4}>
                  <ChatSidebar
                    chats={chats}
                    handleChatClick={handleChatClick}
                    selectedChat={selectedChat}
                    userData={userData}
                    myContacts={myContacts}
                    myId={myId}
                  />
                </Grid>
              )}
              {!isMobile && showChatWindow && (
                <Grid item="true" xs={12} sm={8}>
                  <ChatWindow
                    myId={myId}
                    messages={messages}
                    setMessages={setMessages}
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                    setShowChatWindow={setShowChatWindow}
                    chats={chats}
                    setChats={setChats}
                    socketConnected={socketConnected}
                  />
                </Grid>
              )}

              {!selectedChat && !isMobile && <ChatReturnComponent />}
            </Grid>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
