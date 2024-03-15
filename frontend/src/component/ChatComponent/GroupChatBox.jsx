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
import {Button, Avatar, Typography, IconButton, TextField} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SendIcon from "@mui/icons-material/Send";
import Input from "@mui/material/Input";
import toast from "react-hot-toast";
const ariaLabel = { "aria-label": "description" };

const actions = [
  { icon: <FileCopyIcon />, name: "Copy" },
  { icon: <SaveIcon />, name: "Save" },
  { icon: <PrintIcon />, name: "Print" },
  { icon: <ShareIcon />, name: "Share" },
];

let socket;

const GroupChatBox = ({ messages, setMessages, myId, selectedChat, setChats, chats}) => {
  const [messageInput, setMessageInput] = useState("");
  // const [socket, setSocket] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [showModifiedGroup, setShowModifiedGroup] = useState(false);
  const [selectedContact, setSelectedContact] = useState([])
  const [notSelectedContact, setNotSelectedContact] = useState([])
  const [allContacts, setAllContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("")
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

    socket.emit("join chat", selectedChat._id);

  }, []);

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
        setChats(prevChats => prevChats.map(chat => {
          if (chat._id === selectedChat._id) {
            return { ...chat, latestMessage: newMessage.content };
          }
          return chat;
        }));
        setMessages([...messages, newMessage]);
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
          chatId : selectedChat._id,
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
      console.log(chatMembersResponse);
      // Step 2: Find all contacts
      const allContactsResponse = await axios.get(`${server}/getAllFriends/${myId}`);
      const allContacts = allContactsResponse.data.contacts;
      console.log(allContacts);
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
      console.log(selectedContacts)
      console.log(unselectedContacts)
      console.log(allContacts)
      
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

  return (
    <>
      <div className="message-area">
        <div className="message-header">
          {selectedChat.groupName}
          {selectedChat.isGroupChat &&  <Button onClick={handleGroupShowing}> seeGroup </Button>}
          {selectedChat.isGroupChat && selectedChat.groupAdmin === myId &&  <Button onClick={modifyGroup}> modifyGroup </Button>}

          {/* here you have to show the required things */}
          {showModifiedGroup && (<div>
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
            <div ref={messagesEndRef}>  </div>
          </ul>
        ) : (
          <p className="messageArea">No chat available</p>
        )}
            {/* <div ref={messagesEndRef} /> */}
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