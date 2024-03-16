import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { server, AuthContext } from "../../context/UserContext";
import Button from "@mui/material/Button";
import {Avatar, Typography, TextField} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import toast from "react-hot-toast";
import CallIcon from "@mui/icons-material/Call";
import VideoCall from "../../pages/Home";
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


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
  const [showModifiedGroup, setShowModifiedGroup] = useState(false);
const [selectedContact, setSelectedContact] = useState([])
const [notSelectedContact, setNotSelectedContact] = useState([])
const [allContacts, setAllContacts] = useState([]);
const [searchQuery, setSearchQuery] = useState("")

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
  const handleDeleteMessage = async (messageId) => {
    try {
      // await axios.post(`${server}/deletemessage/${messageId}`,{userId});
      const response = await axios.post(`${server}/deletemessage`,
        { messageId: messageId, userId: myId },
        { withCredentials: true }
      );
     
      const updatedMessages = messages;
      setMessages(updatedMessages);

      socket.emit("message deleted", messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  }
    const [userInfo, setUserInfo] = useState({
      userName: "",
      userId: "",
    });
    const [calleeId,setCalleeId]=useState();
    const zeroCloudInstance = useRef(null);
    const navigate = useNavigate(); // Moved inside the component
    const [loading, setLoading] = useState(false); // Moved inside the component
 
    
    
  async function init() {
    const userId = myId;    
  
    const userName = "user_" + userId;
    setUserInfo({
      userName,
      userId,
    });
    const appID = 488373535;
    const serverSecret = "f3b1043cfb6175db07ba795897c22b4d";

    const KitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      null,
      userId,
      userName
    );

    zeroCloudInstance.current = ZegoUIKitPrebuilt.create(KitToken);
    // add plugin
    zeroCloudInstance.current.addPlugins({ ZIM });
  }

  function handleSend(callType) {
    const callee = calleeId;
    console.log(callee);
    console.log(myId);
    if (!callee) {
      alert("userID cannot be empty!!");
      return;
    }

    // send call invitation
    zeroCloudInstance.current
      .sendCallInvitation({
        callees: [{ userID: callee, userName: "user_" + callee }],
        callType: callType,
        timeout: 60,
      })
      .then((res) => {
        console.warn(res);
        if (res.errorInvitees.length) {
          alert("The user dose not exist or is offline.");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    if (myId) {
      init();
    }
  }, [myId]);

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

    const oth=selectedChat.users.find(id=>id!=myId);
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
        const updatedChats = chats.map(chat => {
          if (chat._id === newMessage.chat) {
            const cnt = (chat.unreadMsgCount || 0) + 1;
            return { ...chat, unreadMsgCount : cnt, latestMessage : newMessage.content};
          }
          return chat;
        });

        const index = updatedChats.findIndex(chat => chat._id === newMessage.chat);
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

}, [messages, selectedChat, chats, setChats]);

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
  };

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
      console.error("Error in updating group:", error);
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
        <div className="message-header">{selectedChat.groupName}
        
        {selectedChat.isGroupChat &&  <Button onClick={handleGroupShowing}> seeGroup </Button>}
          {selectedChat.isGroupChat && selectedChat.groupAdmin === myId &&  <Button onClick={modifyGroup}> modifyGroup </Button>}
          {showModifiedGroup && 
          (<div>
            <h2>Selected Members:</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {selectedContact.map(contact => {
              // Accessing the contactId property directly from each object
              const contactId = contact.contactId;
              return (
                <div key={contact.contactId}>
                  <Avatar src={contact.avatarUrl} alt={contact.name} />
                  <Typography>{contact.name}</Typography>
                  <IconButton onClick={() => removeFromGroup(contactId)}>
                    <CloseIcon />
                  </IconButton>  
                </div>
              );
            })}
            </div>
            <div>
              <h2>Not Selected Members:</h2>
              <TextField
                label="Search Contacts"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                margin="normal"
              />
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {notSelectedContact
                  .filter(contact => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(contact => (
                    <div key={contact.contactId} style={{ margin: '5px', textAlign: 'center' }}>
                      <Avatar src={contact.avatarUrl} alt={contact.name} />
                      <Typography>{contact.name}</Typography>
                      <IconButton onClick={() => addToGroup(contact.contactId)}>
                        <PersonAddIcon />
                      </IconButton>
                    </div>
                  ))
                }
              </div>
            </div>
            <Button onClick={updateGroup}> Update </Button>
          </div>)}
        
        </div>
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
                        {message.sender === myId && (
                  <button onClick={() => handleDeleteMessage(message._id)} className="delete-message-btn">Delete</button>
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
