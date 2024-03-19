// Chat.js
import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import axios from "axios";
import "../styles/chat.css";
import GroupList from "../component/ChatComponent/GroupList";
import GroupChatBox from "../component/ChatComponent/GroupChatBox";
import { server, AuthContext } from "../context/UserContext";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";

import { SpeedDial, SpeedDialAction } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Chatting = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [myId, setMyId] = useState("");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [messages, setMessages] = useState([""]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const fetchUserDetail = async () => {
    const token = Cookies.get("tokenf");
    if (!token) {
      navigate("/login");
    }
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

        console.log("realchat",userChats)
        // console.log(myContacts.data.contacts);

        const modifiedChats = userChats.map((chat) => {
          let unreadMsgCount = 0;

          if (!chat.isGroupChat) {
            const otherUserId = chat.users.find((id) => id !== userId);
            const contact = contacts.find(
              (contact) => contact.contactId === otherUserId
            );
            if (contact) {
              chat.groupName = contact.name;
            } else {
              chat.groupName = "unknown";
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

        // console.log(modifiedGroups)
        modifiedChats.sort(
          (a, b) =>
            new Date(b.latestMessageTime) - new Date(a.latestMessageTime)
        );
        console.log("underchat",modifiedChats);
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
      console.log("selected chat");
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
          <Box sx={{ flexGrow: 1 }} >
            <Grid container wrap={"wrap"} direction="row">
              <Grid item xs={12} sm={4}>
                <GroupList
                  chats={chats}
                  handleChatClick={handleChatClick}
                  selectedChat={selectedChat}
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
                      />
                    ) : (
                      <p>Please select the chat</p>
                    )}
                  </div>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <div>
            {/* <SpeedDial
              ariaLabel="SpeedDial tooltip example"
              sx={{ position: 'absolute', bottom: 16, right: 16 }}
              icon={<AddCircleIcon />}
              open={speedDialOpen}
              onClick={() => setSpeedDialOpen(!speedDialOpen)}
            >
              <SpeedDialAction
                icon={<GroupIcon />}
                tooltipTitle="create group"
                onClick={() => {
                  navigate("/createGroup");
                }}
              />
              <SpeedDialAction
                icon={<PersonAddIcon />}
                tooltipTitle="New contact"
                tooltipOpen
                onClick={() => {
                  navigate("/addContact");
                }}
              />
            </SpeedDial> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
