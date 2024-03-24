// Chat.js
import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import io from "socket.io-client";
import axios from "axios";
import "../styles/chat.css";
import GroupList from "../component/ChatComponent/GroupList";
import GroupChatBox from "../component/ChatComponent/GroupChatBox";
import { server } from "../context/UserContext";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";

let socket;


const Chatting = () => {
  const [myId, setMyId] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [messages, setMessages] = useState([""]);
  const [myContacts, setMycontacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);


  useEffect(() => {
    // Setup socket connection
    if(myId){
      socket = io("http://localhost:4000");
      socket.emit("setup", myId);
      socket.on("connected", () => setSocketConnected(true));
      return () => {
          socket.disconnect();
          setSocketConnected(false)
      };
    }
}, [myId]);

useEffect(()=>{
  socket = io("http://localhost:4000");
  socket.on("onlineUsers", (map) => {
    // setOnlineUsers(userSocketMap);
    console.log(map)
  });
})




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

    if (token) {
      try {
        setLoading(true);
        const decodedToken = jwtDecode(token);
        const { id: userId } = decodedToken;

        const response = await axios.get(`${server}/findAllChats/${userId}`);
        const myContacts = await axios.get(`${server}/contacts/${userId}`);
        setMyId(userId);

        const userChats = response.data.chats;
        const contacts = myContacts.data.contacts;
        setMycontacts(contacts);

        const modifiedChats = userChats.map((chat) => {
          let unreadMsgCount = 0;

          if (!chat.isGroupChat) {

            const otherUserId = chat.users.find(id => id !== userId);
            const contact = contacts.find(contact => contact.contactId === otherUserId._id);
            // console.log(otherUserId);


            if (contact) {
              // console.log(contact._id)
                chat.groupName = contact.name;
                contact._id = chat._id;
                // console.log(contact._id)
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

  const handleChatClick = async (chat) => {
    try {
      // console.log('group : ', group);
      if (selectedChat) {
        await axios.post(`${server}/readAllMessages`, {
          myId,
          chatId: selectedChat._id,
        });
      }
      setSelectedChat(chat);
      const response = await axios.get(
        `${server}/fetchAllMessages/${chat._id}`
      );
      const responseReadMsg = await axios.post(`${server}/readAllMessages`, {
        myId,
        chatId: chat._id,
      });
      await fetchUserDetail();
      chat.unreadMsgCount = 0;
      setMessages(response.data.messages);
      setChats((prevChats) => {
        const updatedChats = prevChats.filter((grp) => grp._id !== chat._id);
        return [chat, ...updatedChats];
      });
    } catch (error) {
      console.log("chat not detected");
      console.log(error);
    }
  };

  return (
    <div className="main-container">
      <div className="chat-box">
        <div className="chat-body">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container wrap={"wrap"} direction="row">
              <Grid item xs={12} sm={4}>
                <GroupList
                  chats={chats}
                  handleChatClick={handleChatClick}
                  selectedChat={selectedChat}
                  userData={userData}
                  myContacts={myContacts}
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <Box sx={{ position: "relative" }}>
                  <div className="message-body">
                    {selectedChat ? (
                      <GroupChatBox
                        myId={myId}
                        messages={messages}
                        setMessages={setMessages}
                        selectedChat={selectedChat}
                        chats={chats}
                        setChats={setChats}
                        socketConnected={socketConnected}
                      />
                    ) : (
                      <p>Please select the chat</p>
                    )}
                  </div>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
