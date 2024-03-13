import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { server, AuthContext } from "../../context/UserContext";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Input from "@mui/material/Input";
const ariaLabel = { "aria-label": "description" };

const actions = [
  { icon: <FileCopyIcon />, name: "Copy" },
  { icon: <SaveIcon />, name: "Save" },
  { icon: <PrintIcon />, name: "Print" },
  { icon: <ShareIcon />, name: "Share" },
];

let socket;

const GroupChatBox = ({ messages, setMessages, myId, selectedGroup, setGroups, groups}) => {
  const [messageInput, setMessageInput] = useState("");
  // const [socket, setSocket] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    socket = io("http://localhost:4000");
    // setSocket(socketIO);
    socket.emit("setup", myId);
    socket.on("connected", () => setSocketConnected(true));

    socket.emit("join chat", selectedGroup._id);

  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      if (
        !selectedGroup || // if chat is not selected or doesn't match current chat
        selectedGroup._id !== newMessage.chat._id
      ) {
        // console.log('new message recived : ', newMessage)
        // console.log('selectedGroup : ', selectedGroup)
        const updatedGroups = groups.map(group => {
          if (group._id === newMessage.chat._id) {
            const cnt = (group.unreadMsgCount || 0) + 1;
            return { ...group, unreadMsgCount : cnt};
          }
          return group;
        });

        const index = updatedGroups.findIndex(group => group._id === newMessage.chat._id);
        if (index !== -1) {
          const groupWithNewMessage = updatedGroups.splice(index, 1)[0];
          updatedGroups.unshift(groupWithNewMessage);
        }
        
        setGroups(updatedGroups);
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });

  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleSendMessage = async () => {
    try {
        const response = await axios.post(`${server}/sendGroupMessage`, {
          myId,
          chatId : selectedGroup._id,
          messageInput,
        });
        // console.log(response.data.newMessage);
        // console.log(response.data.chatUsers);
        // console.log(messages);
        setMessageInput("");
        socket.emit("new message", {
          newMessage: response.data.newMessage,
          chatUsers: response.data.chatUsers,
        });
        // socket.emit("new message", response.data.newMessage);
        setMessages([...messages, response.data.newMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
  }

  return (
    <>
      <div className="message-area">
        <div className="message-header"></div>
          <ul className="messageArea">
          {messages && messages.length > 0 ? (
          <ul className="messageArea">
            {messages.map((message, index) => (
              <li
                key={index}
                className={
                    message.sender === myId ? "own-message" : "other-message"
                }
              >
                <div className="message">
                  <p>{message.sender}</p>
                  <p>{message.content}</p>
                </div>
                <div className="timestamp">
                  <p className="message-timestamp">
                    {new Date(message.timestamp).toLocaleString("en-US", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </p>
                </div>
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
        ) : (
          <p className="messageArea">No chat available</p>
        )}
            <div ref={messagesEndRef} />
          </ul>
        </div>

      <div className="message-input">
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClick={handleOpen}
          open={open}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={handleClose}
            />
          ))}
        </SpeedDial>
        <Input
        //   ref={inputRef}
          type="text"
          placeholder="Type Something"
          value={messageInput}
          onChange={handleMessageInputChange}
          inputProps={ariaLabel}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </div>
    </>
  );
};


export default GroupChatBox;