import React , { useEffect, useState, useRef } from "react";
import axios from "axios";
import { server, AuthContext } from "../../context/UserContext";




import SendIcon from "@mui/icons-material/Send";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AddReactionIcon from "@mui/icons-material/AddReaction";


export const ChatTextInput = ({messageInput,setMessageInput,myId,selectedChat,socket, setChats,chats,setMessages,messages,isTimerEnabled,timer }) => {
  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
  };
  
 


  const handleSendMessage = async () => {
    const sendTime = new Date();
  
   
    let deleteAt = null;
    try {
      if (timer && isTimerEnabled) {
        deleteAt = new Date(sendTime.getTime() + timer * 60000);
      }

      const response = await axios.post(`${server}/sendChatMessage`, {
        myId,
        chatId: selectedChat._id,
        messageInput,
        deleteAt
      });
      // console.log(response.data.newMessage);
      // console.log(response.data.chatUsers);
      // console.log(messages);
      socket.emit("new message", {
        newMessage: response.data.newMessage,
        chatUsers: response.data.chatUsers,
      });
      const updatedChats = chats.map((chat) => {
        if (chat._id === selectedChat._id) {
          return { ...chat, latestMessage: messageInput };
        }
        return chat;
      });

      setChats(updatedChats);
      setMessageInput("");
      setMessages([...messages, response.data.newMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 900,
        }}
      >
        <IconButton sx={{ p: "10px" }} aria-label="menu">
          <AddReactionIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Type a message"
          value={messageInput}
          onChange={handleMessageInputChange}
          inputProps={{ ariaLabel: "Type a message" }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton
          color="primary"
          sx={{ p: "10px" }}
          aria-label="SendIcon"
          onClick={handleSendMessage}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </>
  );
};