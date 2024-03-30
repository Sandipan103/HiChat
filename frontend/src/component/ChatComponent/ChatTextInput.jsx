import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { server, AuthContext } from "../../context/UserContext";
import io from "socket.io-client";

import {
  Paper,
  IconButton,
  InputBase,
  Divider,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  useMediaQuery,
} from "@mui/material";
import {
  AddReaction as AddReactionIcon,
  Send as SendIcon,
} from "@mui/icons-material";

export const ChatTextInput = ({
  messageInput,
  setMessageInput,
  myId,
  selectedChat,
  socket,
  setChats,
  chats,
  setMessages,
  messages,
  isTimerEnabled,
  timer,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [error, setError] = useState(false);

  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
    const socket = io("http://localhost:4000");
    socket.emit("typeing", myId);
  };

  const handleReactionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEmojiClick = (emoji) => {
    setMessageInput((prevMessageInput) => prevMessageInput + emoji);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const open = Boolean(anchorEl);

  const handleSendMessage = async () => {
    if (messageInput == "") return;
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
        deleteAt,
      });
      socket.emit("new message", {
        newMessage: response.data.newMessage,
        chatUsers: response.data.chatUsers,
      });

      const updatedChats = chats.map((chat) => {
        setChats((prevChats) => {
          const updatedChats = prevChats.filter((grp) => grp._id !== chat._id);
          return [chat, ...updatedChats];
        });
        if (chat._id === selectedChat._id) {
          return { ...chat, latestMessage: messageInput };
        }
        return chat;
      });
      console.log(response.data.newMessage);
      setChats(updatedChats);
      setMessageInput("");
      setMessages([...messages, response.data.newMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!messageInput.trim()) {
        e.preventDefault();
        setError(true); // Show error if message input is empty
      } else {
        e.preventDefault();
        handleSendMessage();
        setError(false);
      }
    }
  };

  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 900,
        borderBottom: error ? "2px solid #FF5722" : "0",
      }}
    >
      <IconButton
        sx={{ p: "10px" }}
        aria-label="reaction"
        onClick={handleReactionClick}
      >
        <AddReactionIcon />
      </IconButton>
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          borderColor: error ? "red" : "inherit",
          borderWidth: "2px",
        }}
        placeholder={error ? "Please enter a message" : "Type a message"}
        value={selectedEmoji ? messageInput + selectedEmoji : messageInput}
        onChange={handleMessageInputChange}
        onKeyDown={handleKeyDown}
        inputProps={{ "aria-label": "Type a message" }}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton
        color="primary"
        sx={{ p: "10px" }}
        aria-label="send"
        onClick={() => {
          if (!messageInput.trim()) {
            setError(true); // Show error if message input is empty
          } else {
            handleSendMessage();
            setError(false);
          }
        }}
      >
        <SendIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1,
            padding: 2,
          }}
        >
          {[
            "😀",
            "😂",
            "😊",
            "😍",
            "😎",
            "👍",
            "👎",
            "👏",
            "❤️",
            "😊",
            "😇",
            "😋",
            "😜",
            "😘",
            "😴",
            "🤗",
            "😷",
            "🤓",
            "🤑",
            "😳",
            "😠",
            "😱",
            "🤡",
            "👽",
          ].map((emoji, index) => (
            <ListItem
              button
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              sx={{ width: "auto", minWidth: "0", padding: "1px" }}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: "30px" }}>
                {emoji}
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
      </Popover>
    </Paper>
  );
};
