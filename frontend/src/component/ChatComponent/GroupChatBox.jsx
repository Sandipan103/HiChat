import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { server, AuthContext } from "../../context/UserContext";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Input from "@mui/material/Input";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AddReactionIcon from "@mui/icons-material/AddReaction";

import { FileShareMenu } from "./FileShareMenu";
import { FileSendPopUp } from "./FileSendPopUp";

const ariaLabel = { "aria-label": "description" };

let socket;

const GroupChatBox = ({
  messages,
  setMessages,
  myId,
  selectedChat,
  setChats,
  chats,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [file, setFile] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  const handleClose = () => setOpen(false);
  const [popOpen, setPopOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const handleCloseModal = () => {
    setPopOpen(false);
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
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

    socket.emit("join chat", selectedChat._id);
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      console.log(newMessage);
      if (
        !selectedChat || // if chat is not selected or doesn't match current chat
        selectedChat._id !== newMessage.chat._id
      ) {
        // console.log('new message recived : ', newMessage)
        // console.log('selectedChat : ', selectedChat)
        const updatedChats = chats.map((chat) => {
          if (chat._id === newMessage.chat._id) {
            const cnt = (chat.unreadMsgCount || 0) + 1;
            return { ...chat, unreadMsgCount: cnt };
          }
          return chat;
        });

        const index = updatedChats.findIndex(
          (chat) => chat._id === newMessage.chat._id
        );
        if (index !== -1) {
          const chatWithNewMessage = updatedChats.splice(index, 1)[0];
          updatedChats.unshift(chatWithNewMessage);
        }
        setChats(updatedChats);
      } else {
        setMessages([...messages, newMessage]);
      }
    });

    socket.on("file recieved", (imageData) => {
      if (imageData) {
        const imgElement = document.createElement("img");
        imgElement.src = imageData;

        // const newMsg = { type: 'img', content: imgElement };
        setMessages([...messages, imgElement]);

        // if (messageHeaderRef.current) {
        //   messageHeaderRef.current.appendChild(imgElement);
        // }
        console.log(imgElement);
      }
    });
  });

  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(`${server}/sendChatMessage`, {
        myId,
        chatId: selectedChat._id,
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
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    console.log(Date.now())
    try {
      if (selectedFile) {
        const reader = new FileReader();
       
        reader.onload = async (e) => {
          const fileData = e.target.result;
          const filename = selectedFile.name;
          const chatId = selectedChat._id;

          const data = new FormData();

          data.append("file", selectedFile);
          data.append("myId", myId);
          data.append("chatId", chatId);
          data.append("type", selectedType);
          // data.append("fileUrl", fileUrl);
          data.append("messageInput", messageInput);

          const response = await axios.post(`${server}/sendFiles`, data);
          console.log(response)
          // socket.emit("file", {
          //   chatUsers: response.data.chatUsers,
          //   filename: filename,
          //   fileData: fileData,
          // });
          setFile(null);
        };
        reader.readAsDataURL(selectedFile);
      }
    } catch (error) {
      console.error("Error file sending: ", error);
    }
  };

  return (
    <>
      <div className="message-area">
        <div className="message-header">{selectedChat.groupName}</div>
        {!popOpen && <div className="msg-inner-container">
          <div className="msg-body">
            <ul className="messageArea">
              {messages && messages.length > 0 ? (
                <ul className="messageArea">
                  {messages.map((message, index) => (
                    <li
                      key={index}
                      className={
                        message.sender === myId
                          ? "own-message"
                          : "other-message"
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
                  <div ref={messagesEndRef}> </div>
                </ul>
              ) : (
                <p className="messageArea">No chat available</p>
              )}
              {/* <div ref={messagesEndRef} /> */}
            </ul>
          </div>
          <div className="message-footer">
            <FileShareMenu
              popOpen={popOpen}
              setPopOpen={setPopOpen}
              handleCloseModal={handleCloseModal}
              setSelectedFile={setSelectedFile}
              setSelectedType={setSelectedType}
            />
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

            {/* <div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleFileUpload}>Upload File</button>
        </div> */}
          </div>
        </div>}

        {popOpen && (
        <FileSendPopUp
        fileType={selectedType}
          popOpen={popOpen}
          handleCloseModal={handleCloseModal}
          selectedFile={selectedFile}
          handleFileUpload={handleFileUpload}
        />
      )}
      </div>

      
    </>
  );
};

export default GroupChatBox;
