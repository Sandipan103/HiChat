import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Stack,
  Typography,
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";

import axios from "axios";
import io from "socket.io-client";
import { server, AuthContext } from "../../context/UserContext";
import { DisappearMsg } from "./DisappearMsg";
import { EditContact } from "./EditContact";

import { FileShareMenu } from "./FileShareMenu";
import { FileSendPopUp } from "./FileSendPopUp";
import ZegoCloud from "./ZegoCloud";
import { ChatTextInput } from "./ChatTextInput";
import { styled } from "@mui/material/styles";
import { GroupManage } from "./GroupManage";
import toast from "react-hot-toast";

let socket;

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const GroupChatBox = ({
  messages,
  setMessages,
  myId,
  selectedChat,
  setChats,
  chats,
}) => {
  // console.log("selchat: ",selectedChat);
  const [messageInput, setMessageInput] = useState("");
  const [file, setFile] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  const handleClose = () => setOpen(false);
  const [popOpen, setPopOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const messagesEndRef = useRef(null);

  const [calleeId, setCalleeId] = useState();

  const [isTimerEnabled, setIsTimerEnabled] = useState(false);
  const [timer, setTimer] = useState("");
  const [user1, setuser1] = useState("");
  const [user2, setuser2] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [u, su] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuOpenClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    async function fetchChatData() {
      try {
        const response = await axios.get(`${server}/chats/${selectedChat._id}`);
        setuser1(response.data.chatUsers[0].contactNo);
        su(response.data.chatUsers[1].firstName);
        setuser2(response.data.chatUsers[1].contactNo);
        setIsGroup(response.data.isGroup);
        // console.log("chatuser",response.data.isGroup);
        setTimer(response.data.timer);
        setIsTimerEnabled(response.data.isTimerEnabled);
        toast.success("chat data fetched");
      } catch (error) {
        // toast.success("something went wrong, chat data not fetched");
        console.error("Error fetching chat data:", error);
      }
    }

    fetchChatData();
  }, [selectedChat._id]);

  const handleCloseModal = () => {
    setPopOpen(false);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
    // console.log(user1);
  }, [messages]);

  useEffect(() => {
    socket = io("http://localhost:4000");
    // setSocket(socketIO);
    socket.emit("setup", myId);
    socket.on("connected", () => setSocketConnected(true));

    socket.emit("join chat", selectedChat._id);

    const oth = selectedChat.users.find((id) => id != myId);
    setCalleeId(oth);
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      console.log("txt", newMessage);

      if (
        !selectedChat || // if chat is not selected or doesn't match current chat
        selectedChat._id !== newMessage.chat
      ) {
        const updatedChats = chats.map((chat) => {
          if (chat._id === newMessage.chat) {
            const cnt = (chat.unreadMsgCount || 0) + 1;
            return {
              ...chat,
              unreadMsgCount: cnt,
              latestMessage: newMessage.content,
            };
          }
          return chat;
        });

        const index = updatedChats.findIndex(
          (chat) => chat._id === newMessage.chat
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

    socket.on("file recieved", ({ fileData, newMessage }) => {
      const type = fileData;
      console.log(newMessage)
      if (type === "image") {
        newMessage.imageUrl = fileData;
      } else if (type === "video") {
        newMessage.videoUrl = fileData;
      } else if (type === "audio") {
        newMessage.audioUrl = fileData;
      } else {
        newMessage.audioUrl = fileData;
      }
      console.log(newMessage.videoUrl);
      if (!selectedChat || selectedChat._id !== newMessage.chat) {
        const updatedChats = chats.map((chat) => {
          if (chat._id === newMessage.chat) {
            const cnt = (chat.unreadMsgCount || 0) + 1;
            return {
              ...chat,
              unreadMsgCount: cnt,
              latestMessage: newMessage.type,
            };
          }
          return chat;
        });

        const index = updatedChats.findIndex(
          (chat) => chat._id === newMessage.chat
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
  }, [messages, selectedChat, chats, setChats]);

  const handleDeleteMessage = async (messageId) => {
    try {
      // await axios.post(${server}/deletemessage/${messageId},{userId});
      const response = await axios.post(
        `${server}/deletemessage`,
        { messageId: messageId, userId: myId },
        { withCredentials: true }
      );

      const updatedMessages = messages;
      setMessages(updatedMessages);

      socket.emit("message deleted", messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleFileUpload = () => {
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
          const newMessage = response.data.newMessage;
          console.log("NewFileMSGrs", response);
          socket.emit("file", {
            chatUsers: response.data.chatUsers,
            newMessage,
            fileData,
          });
          const type = newMessage.type;
          console.log(fileData)
          if (type === "image") {
            newMessage.imageUrl = fileData;
          } else if (type === "video") {
            newMessage.videoUrl = fileData;
          } else if (type === "audio") {
            newMessage.audioUrl = fileData;
          } else {
            newMessage.audioUrl = fileData;
          }
          const updatedChats = chats.map((chat) => {
            if (chat._id === selectedChat._id) {
              return { ...chat, latestMessage: messageInput };
            }
            return chat;
          });

          setChats(updatedChats);
          setMessageInput("");
          setMessages([...messages, response.data.newMessage]);

          setPopOpen(false);
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
        <div className="message-header">
          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar>H</Avatar>
                  </StyledBadge>
                  <Typography>{selectedChat.groupName}</Typography>
                  <GroupManage selectedChat={selectedChat} myId={myId} />
                </Stack>
              </Grid>
              <Grid item>
                <ZegoCloud
                  myId={myId}
                  calleeId={calleeId}
                  user1={user1}
                  user2={user2}
                />
                <IconButton onClick={handleUserMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuOpenClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  sx={{ ml: -2, mt: 8 }}
                >
                  <MenuItem onClick={handleClose}>
                    <DisappearMsg
                      setChats={setChats}
                      chats={chats}
                      isTimerEnabled={isTimerEnabled}
                      selectedChat={selectedChat}
                    />
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <EditContact />
                  </MenuItem>
                  <MenuItem onClick={handleClose}>Option 3</MenuItem>
                </Menu>
              </Grid>
            </Grid>
          </Box>
        </div>

        {!popOpen && (
          <div className="msg-inner-container">
            <Box className="msg-body">
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
                        {isGroup && (
                          <span className="chat-user-name">
                            {message.sender !== myId
                              ? selectedChat.groupName
                              : u}
                          </span>
                        )}
                        {message.type === "text" ? (
                          <span className="chat-content">
                            {message.content}
                          </span>
                        ) : (
                          <div className="chatfile-box">
                            {message.audioUrl &&
                              (message.audioUrl.startsWith("data:audio") ? (
                                <audio controls className="chatfile">
                                  <source
                                    src={message.audioUrl}
                                    type="audio/mp3"
                                  />
                                  Your browser does not support the audio
                                  element.
                                </audio>
                              ) : (
                                <audio controls className="chatfile">
                                  <source
                                    src={`${server}/fetchfile/${message.audioUrl}`}
                                    type="audio/mp3"
                                  />
                                  Your browser does not support the audio
                                  element.
                                </audio>
                              ))}

                            {message.videoUrl &&
                              (message.videoUrl.startsWith("data:video") ? (
                                <video controls className="chatfile">
                                  <source
                                    src={message.videoUrl}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video
                                  element.
                                </video>
                              ) : (
                                <video controls className="chatfile">
                                  <source
                                    src={`${server}/fetchfile/${message.videoUrl}`}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video
                                  element.
                                </video>
                              ))}

                            {message.imageUrl &&
                              (message.imageUrl.startsWith("data:image") ? (
                                <img
                                  className="chatfile"
                                  src={message.imageUrl}
                                  alt="Chat Image"
                                />
                              ) : (
                                <img
                                  className="chatfile"
                                  src={`${server}/fetchfile/${message.imageUrl}`}
                                  alt="Chat Image"
                                />
                              ))}
                          </div>
                        )}

                        {/* Render delete button only if sender is the current user */}
                        {message.sender === myId &&
                          message.isDeleted === false && (
                            <button
                              onClick={() => handleDeleteMessage(message._id)}
                              className="delete-message-btn"
                            >
                              Delete
                            </button>
                          )}
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
            </Box>

            <div className="message-footer">
              <FileShareMenu
                popOpen={popOpen}
                setPopOpen={setPopOpen}
                handleCloseModal={handleCloseModal}
                setSelectedFile={setSelectedFile}
                setSelectedType={setSelectedType}
              />
              <ChatTextInput
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                myId={myId}
                selectedChat={selectedChat}
                socket={socket}
                chats={chats}
                setChats={setChats}
                messages={messages}
                setMessages={setMessages}
                isTimerEnabled={isTimerEnabled}
                timer={timer}
              />
            </div>
          </div>
        )}

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
