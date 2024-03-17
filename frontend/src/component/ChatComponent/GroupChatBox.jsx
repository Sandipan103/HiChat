import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { server, AuthContext } from "../../context/UserContext";

import { FileShareMenu } from "./FileShareMenu";
import { FileSendPopUp } from "./FileSendPopUp";
import ZegoCloud from "./ZegoCloud";
import { ChatTextInput } from "./ChatTextInput";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { Grid, Avatar, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";

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
  const [messageInput, setMessageInput] = useState("");
  const [file, setFile] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  const handleClose = () => setOpen(false);
  const [popOpen, setPopOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const [isTimerEnabled, setIsTimerEnabled] = useState(false);
  const [timer, setTimer] = useState('');


  useEffect(() => {
    async function fetchChatData() {
      try {
        const response = await axios.get(`${server}/chats/${selectedChat._id}`);
        
        // console.log(response.data.timer);
         setTimer(response.data.timer);
         setIsTimerEnabled(response.data.isTimerEnabled);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    }

    fetchChatData();
  }, [selectedChat._id]); 

  const messagesEndRef = useRef(null);

  const [calleeId, setCalleeId] = useState();

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

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
      console.log(newMessage);
      if (
        !selectedChat || // if chat is not selected or doesn't match current chat
        selectedChat._id !== newMessage.chat
      ) {
        // console.log('new message recived : ', newMessage)
        // console.log('selectedChat : ', selectedChat)
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

    socket.on("file recieved", (imageData) => {
      if (imageData) {
        const imgElement = document.createElement("img");
        imgElement.src = imageData;

        // const newMsg = { type: 'img', content: imgElement };
        setMessages([...messages, imgElement]);

        // if (messageHeaderRef.current) {
        //   messageHeaderRef.current.appendChild(imgElement);
        // }
      }
    });
    console.log(messages);
  }, [messages, selectedChat, chats, setChats]);

  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
  };
  
  const handleSendMessage = async () => {
    const sendTime = new Date();
  
   
    let deleteAt = null;
  const handleDeleteMessage = async (messageId) => {
    try {
      if (timer && isTimerEnabled) {
        deleteAt = new Date(sendTime.getTime() + timer * 60000);
      }
        const response = await axios.post(`${server}/sendChatMessage`, {
          myId,
          chatId : selectedChat._id,
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

        const updatedChats = chats.map(chat => {
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
  }


  const addToGroup = (contactId) => {
    const contactToAdd = allContacts.find(contact => contact.contactId === contactId);
    setSelectedContact([...selectedContact, contactToAdd]);
    setNotSelectedContact(notSelectedContact.filter(contact => contact.contactId !== contactId));
  };

  const removeFromGroup = (contactId) => {
    const contactToRemove = selectedContact.find(contact => contact.contactId === contactId);
    setNotSelectedContact([...notSelectedContact, contactToRemove]);
    setSelectedContact(selectedContact.filter(contact => contact.contactId !== contactId));
  };

  const handleGroupShowing = async()=> {
    const response = await axios.get(`${server}/findChatMemberDetails/${selectedChat._id}`);
    console.log(response.data.users); 
    console.log(response.data.groupAdmin);

    // ********************      task ===>  @w3_yogesh        ********************
    //  frontend me show krna baki hai
  }

  const modifyGroup = async()=> {
    setShowModifiedGroup(!showModifiedGroup);
    try {
      // Step 1: Find all chat members
      const chatMembersResponse = await axios.get(`${server}/findChatMemberDetails/${selectedChat._id}`);
      const chatMembers = chatMembersResponse.data.users;
      // Step 2: Find all contacts
      const allContactsResponse = await axios.get(`${server}/getAllFriends/${myId}`);
      const allContacts = allContactsResponse.data.contacts;
      // step-3 : show the chatMember top of the searchbar and other contact below the search bar, and other contact below the search bar
      const selectedContacts = [];
      const unselectedContacts = [];

      allContacts.forEach(contact => {
        const isPresentInChat = chatMembers.some(member => member._id === contact.contactId);
        if (isPresentInChat) {
          selectedContacts.push(contact);
        } else {
          unselectedContacts.push(contact);
        }
      });
      
      setAllContacts(allContacts); 
      setSelectedContact(selectedContacts);
      setNotSelectedContact(unselectedContacts);
      
      // step-4 : when click on the submit button it will send the selected user list to the backend, and update the group
    } catch (error) {
      console.error("Error modifying group:", error);
    }
  }

  const updateGroup = async () => {
    try {
      const selectedContactIds = selectedContact.map(contact => contact.contactId); 
      const response = await axios.post(`${server}/updateChatMember`, {
        chatId: selectedChat._id,
        selectedContacts: selectedContactIds,
        myId : myId,
      });
      console.log(response);
      toast.success("Group updated successfully");
    } catch (error) {
      console.error("Error file sending: ", error);
    }
  };
  
  const handleCheckboxChange = async (chatId, newValue) => {
    await axios.post(`${server}/settimer/${chatId}`, { isTimerEnabled: newValue, timer: timer });
    
    setChats(chats.map(chat => {
      if (chat._id === chatId) {
        return { ...chat, isTimerEnabled: newValue,timer:timer };
      }
      return chat;
    }));
  };
  
  const handleCheckboxChange = async (chatId, newValue) => {
    await axios.post(`${server}/settimer/${chatId}`, { isTimerEnabled: newValue, timer: timer });
    
    setChats(chats.map(chat => {
      if (chat._id === chatId) {
        return { ...chat, isTimerEnabled: newValue,timer:timer };
      }
      return chat;
    }));
  };

  return (
    <>
      <div className="message-area">
        <div>
        <input
        type="number"
        value={timer}
        onChange={(e) => setTimer(e.target.value)}
        placeholder="Timer in minutes"
      />
      <label>
        <input
          type="checkbox"
          checked={isTimerEnabled}
          onChange={e => handleCheckboxChange(selectedChat._id, e.target.checked)}
        /> Enable Timer
      </label>
        </div>
        <div className="message-header">
          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: "center;" }}
                >
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar>H</Avatar>
                  </StyledBadge>
                  <Typography>{selectedChat.groupName}</Typography>
                </Stack>
              </Grid>
              <Grid>
                <ZegoCloud myId={myId} calleeId={calleeId} />
              </Grid>
            </Grid>
          </Box>
        </div>
        {!popOpen && (
          <div className="msg-inner-container">
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

                          {/* Render message content based on message type */}
                          {message.type === "text" && <p>{message.content}</p>}

                          {message.type === "audio" && (
                            <audio controls>
                              <source src={`${server}/fetchfile/${message.audioUrl}`} type="audio/mp3" />
                              Your browser does not support the audio element.
                            </audio>
                          )}

                          {message.type === "video" && (
                            <video controls>
                              <source src={message.videoUrl} type="video/mp4" />
                              Your browser does not support the video element.
                            </video>
                          )}

                          {message.type === "image" && (
                            <img src={`${server}/fetchfile/${message.imageUrl}`} alt="message" />
                          )}

                          {/* Render delete button only if sender is the current user */}
                          {message.sender === myId && (
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
                            {new Date(message.timestamp).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              }
                            )}
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
              />

              {/* <div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleFileUpload}>Upload File</button>
        </div> */}
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
