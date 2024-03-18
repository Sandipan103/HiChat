import React , { useEffect, useState, useRef } from "react";
import axios from "axios";
import { server, AuthContext } from "../../context/UserContext";


import { Paper, IconButton, InputBase, Divider, Popover, List, ListItem, ListItemIcon,useMediaQuery  } from '@mui/material';
import { AddReaction as AddReactionIcon, Send as SendIcon } from '@mui/icons-material';

export const ChatTextInput = ({messageInput,setMessageInput,myId,selectedChat,socket, setChats,chats,setMessages,messages,isTimerEnabled,timer }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  
  
  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
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

  const open = Boolean(anchorEl);

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
    <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 900 }}>
      <IconButton sx={{ p: "10px" }} aria-label="reaction" onClick={handleReactionClick}>
        <AddReactionIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Type a message"
        value={selectedEmoji ? messageInput + selectedEmoji : messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        inputProps={{ 'aria-label': 'Type a message' }}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: "10px" }} aria-label="send" onClick={handleSendMessage}>
        <SendIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List>
          {['😀', '😂', '😊', '😍', '😎', '👍', '👎', '👏', '❤️'].map((emoji, index) => (
            <ListItem button key={index} onClick={() => handleEmojiClick(emoji)}>
              <ListItemIcon>{emoji}</ListItemIcon>
            </ListItem>
          ))}
        </List>
      </Popover>
    </Paper>
  );
};