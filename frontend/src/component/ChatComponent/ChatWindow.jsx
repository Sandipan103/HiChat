import React, { useState, useEffect, useRef } from "react";
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
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import imageCompression from "browser-image-compression";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import axios from "axios";
import io from "socket.io-client";
import { server } from "../../context/UserContext";
import { DisappearMsg } from "./DisappearMsg";
import { EditContact } from "../UserComponent/EditContact";

import { FileShareMenu } from "./FileShareMenu";
import { FileSendPopUp } from "./FileSendPopUp";
import ZegoCloud from "./ZegoCloud";
import { ChatTextInput } from "./ChatTextInput";
import { styled } from "@mui/material/styles";
import { GroupManage } from "../GroupComponent/AddGroupMember";
import toast from "react-hot-toast";
import { GroupInfo } from "../GroupComponent/GroupInfo";
import { UpdateGroup } from "../GroupComponent/UpdateGroup";

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

const GroupChatBox = ({
  messages,
  setMessages,
  myId,
  selectedChat,
  setSelectedChat,
  setChats,
  chats,
  socketConnected,
  showChatWindow,
  setShowChatWindow,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [file, setFile] = useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  const handleClose = () => setOpen(false);
  const [popOpen, setPopOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [msgId, setMsgId] = useState(null);
  const [page, setPage] = useState(2);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const [calleeId, setCalleeId] = useState();

  const [isTimerEnabled, setIsTimerEnabled] = useState(false);
  const [timer, setTimer] = useState("");
  const [user1, setuser1] = useState("");
  const [user2, setuser2] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [u, su] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorMsgMenuEl, setAnchorMsgMenuEl] = useState(null);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuOpenClose = (event) => {
    setAnchorEl(null);
  };

  const handleMsgMenuClick = (event) => {
    setAnchorMsgMenuEl(event.currentTarget);
  };

  const handleMsgMenuClose = (event) => {
    setAnchorMsgMenuEl(null);
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
        toast.error("something went wrong, chat data not fetched");
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
  }, [messages]);

  useEffect(() => {
    // console.log(socketConnected)
    socket = io("https://hichat.w3yogesh.com");
    socket.emit("setup", myId);
    // socket.on("connected", () => console.log("connected"));
    socket.emit("join chat", selectedChat._id);

    // socket.on("onlineUsers", () => {
    //   // setOnlineUsers(userSocketMap);
    //   console.log("onuser")
    // });
    const oth = selectedChat.users.find((user) => user._id !== myId);
    setCalleeId(oth);
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      if (!selectedChat || selectedChat._id !== newMessage.chat) {
        const updatedChats = chats.map((chat) => {
          if (chat._id === newMessage.chat) {
            const cnt = chat.unreadMsgCount + 1;
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

    socket.on("isTyping", (chatId) => {
      const updatedChats = chats.map((chat) => {
        if (chat._id === chatId) {
          return {
            ...chat,
            isTyping: true,
          };
        }
        return chat;
      });
      setChats(updatedChats);

      // console.log("up",chats);

      // // Clear the typing indicator after a certain duration (e.g., 3 seconds)
      const timeout = setTimeout(() => {
        const updatedChats = chats.map((chat) => {
          if (chat._id === chatId) {
            return {
              ...chat,
              isTyping: false,
            };
          }
          return chat;
        });
        setChats(updatedChats);
      }, 5000); // Adjust the timeout duration as needed

      // Cleanup function to clear the timeout if the user starts typing again
      return () => clearTimeout(timeout);
    });

    socket.on("file recieved", ({ fileData, newMessage }) => {
      const type = fileData;
      // console.log(fileData)
      if (type === "image") {
        newMessage.imageUrl = fileData;
      } else if (type === "video") {
        newMessage.videoUrl = fileData;
      } else if (type === "audio") {
        newMessage.audioUrl = fileData;
      } else {
        newMessage.audioUrl = fileData;
      }
      // console.log(newMessage.videoUrl);
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

  const handleDeleteMessage = async () => {
    try {
      const response = await axios.post(
        `${server}/deletemessage`,
        { messageId: msgId, userId: myId },
        { withCredentials: true }
      );

      const updatedMessages = messages;
      setMessages(updatedMessages);
      // console.log(messages);

      handleMsgMenuClose();
      socket.emit("message deleted", msgId);
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleFileUpload = () => {
    try {
      if (selectedFile) {
        const reader = new FileReader();

        reader.onload = async (e) => {
          const nonCompressfileData = e.target.result;
          const fileData = await compressImage(nonCompressfileData);

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
          socket.emit("file", {
            chatUsers: response.data.chatUsers,
            newMessage,
            fileData,
          });
          const type = newMessage.type;
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
              return {
                ...chat,
                latestMessage: messageInput ? messageInput : selectedType,
              };
            }
            return chat;
          });

          setChats(updatedChats);
          setMessageInput("");
          // console.log(response.data.newMessage);
          // console.log(messages);
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

  // Function to compress the selected image
  const compressImage = async (file) => {
    try {
      const options = {
        maxSizeMB: 0.001, // Max size in MB
        maxWidthOrHeight: 64, // Max width or height
      };
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Error compressing image: ", error);
      return file; // Return the original file if compression fails
    }
  };

  const fatchMsg = async (page) => {
    try {
      const response = await axios.get(
        `${server}/loadMoreMessages/${selectedChat._id}/${page}`
      );
      setMessages((prevMessages) => [
        ...response.data.messages.reverse(),
        ...prevMessages,
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };
  const loadMoreMessages = () => {
    setLoading(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fatchMsg(nextPage);
  };

  const profileimg = selectedChat.isGroupChat
    ? selectedChat.profile
    : myId === selectedChat.users[0]._id
    ? selectedChat.users[1].profile
    : selectedChat.users[0].profile;
  return (
    <>
      <div className="message-area">
        <div
          className={
            showChatWindow ? "message-header mobile-msg-hdr" : "message-header"
          }
        >
          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <Stack direction="row" alignItems="center">
                  {showChatWindow && (
                    <IconButton
                      sx={{ pr: 0, pl: "4px" }}
                      onClick={() => {
                        setShowChatWindow(false);
                      }}
                    >
                      <ArrowBackIosIcon />
                    </IconButton>
                  )}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                    >
                      <Avatar
                        src={`${server}/fetchprofile/${profileimg}`}
                      ></Avatar>
                    </StyledBadge>
                    <Typography>{selectedChat.groupName}</Typography>
                    {selectedChat.isTyping && (
                      <Typography variant="body2" color="textSecondary">
                        Typing...
                      </Typography>
                    )}
                  </Stack>
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
                  {selectedChat.isGroupChat && (
                    <MenuItem onClick={handleClose}>
                      <GroupInfo selectedChat={selectedChat} />
                    </MenuItem>
                  )}
                  {selectedChat.isGroupChat &&
                    selectedChat.groupAdmin === myId && (
                      <MenuItem onClick={handleClose}>
                        <GroupManage selectedChat={selectedChat} myId={myId} />
                      </MenuItem>
                    )}
                  {selectedChat.isGroupChat &&
                    selectedChat.groupAdmin === myId && (
                      <MenuItem onClick={handleClose}>
                        <UpdateGroup selectedChat={selectedChat} myId={myId} />
                      </MenuItem>
                    )}

                  {!selectedChat.isGroupChat && (
                    <MenuItem onClick={handleClose}>
                      <EditContact selectedChat={selectedChat} myId={myId} />
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={(e) => {
                      setSelectedChat(null);
                      setShowChatWindow(false);
                    }}
                  >
                    Close Chat
                  </MenuItem>
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
                  {!reachedEnd && !loading && (
                    <Button
                      sx={{
                        display: "block",
                        background: "#B3E5FC",
                        fontSize: "12px",
                        color: "black",
                        borderRadius: "5px",
                        textAlign: "center",
                        margin: "0 auto",
                        marginTop: "10px",
                      }}
                      onClick={loadMoreMessages}
                      disabled={loading}
                    >
                      Older Messages
                    </Button>
                  )}

                  {messages.map((message) => (
                    <li
                      key={message._id}
                      className={
                        message.sender &&
                        message.sender._id &&
                        message.sender._id === myId
                          ? "own-message"
                          : "other-message"
                      }
                    >
                      <Box className="message-bubble">
                        {message.sender &&
                          message.sender._id &&
                          message.sender._id === myId && (
                            <IconButton
                              sx={{
                                p: 0,
                                position: "absolute",
                                top: 4,
                                right: 10,
                                mt: 0,
                              }}
                              onClick={(e) => {
                                setMsgId(message._id);
                                handleMsgMenuClick(e);
                              }}
                            >
                              <KeyboardArrowDownIcon />
                            </IconButton>
                          )}

                        <div className="message">
                          {isGroup && (
                            <span className="chat-user-name">
                              {message.sender &&
                                message.sender.firstName &&
                                message.sender.firstName}
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
                        </div>

                        <div className="timestamp">
                          <p className="message-timestamp">
                            {new Date(message.timestamp).toLocaleString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              }
                            )}
                          </p>
                        </div>
                      </Box>
                    </li>
                  ))}

                  <div ref={messagesEndRef}></div>
                </ul>
              ) : (
                <p className="messageArea">No chat available</p>
              )}
            </Box>
            <Menu
              anchorEl={anchorMsgMenuEl}
              open={Boolean(anchorMsgMenuEl)}
              onClose={handleMsgMenuClose}
            >
              <MenuItem onClick={(e) => console.log("Edit clicked")}>
                Edit
              </MenuItem>
              <MenuItem onClick={(e) => handleDeleteMessage(e)}>
                Delete
              </MenuItem>
            </Menu>
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
