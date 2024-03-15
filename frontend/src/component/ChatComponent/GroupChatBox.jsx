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
import CallIcon from "@mui/icons-material/Call";
import VideoCall from "../../pages/Home";

import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

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
  const [socketConnected, setSocketConnected] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  const messagesEndRef = useRef(null);

  const handleDeleteMessage = async (messageId) => {
    try {
      
      // await axios.post(`${server}/deletemessage/${messageId}`,{userId});
      const response = await axios.post(`${server}/deletemessage`,
        { messageId: messageId, userId: myId },
        { withCredentials: true }
      );
     
      const updatedMessages = messages.filter((message) => message._id !== messageId);
      setMessages(updatedMessages);

      socket.emit("message deleted", messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };
  



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
    // Ensure userData is not null or undefined before initializing
    if (myId) {
      init();
    }
  }, [myId]);


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
        setChats(prevChats => prevChats.map(chat => {
          if (chat._id === selectedChat._id) {
            return { ...chat, latestMessage: newMessage.content };
          }
          return chat;
        }));
        setMessages([...messages, newMessage]);
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

  return (
    <>
      <div className="message-area">
        <div className="message-header">
          {selectedChat.groupName}
        </div>
          <ul className="messageArea">
          {messages && messages.length > 0 ? (
            <ul className="messageArea">
           {messages.map((message, index) => (
  <li
    key={index}
    className={message.sender === myId ? "own-message" : "other-message"}
  >
    <div className="message">
      <p>{message.sender}</p>
      <p>{message.content}</p>
      {/* Add Delete Button for messages sent by the user */}
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
              <div ref={messagesEndRef}></div>
            </ul>
          ) : (
            <p className="messageArea">No chat available</p>
          )}
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
        <Button
          variant="contained"
          onClick={() => {
            handleSend(ZegoUIKitPrebuilt.InvitationTypeVideoCall);
          }}
          startIcon={<CallIcon />}
          color="primary"
        >
          Video Call
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleSend(ZegoUIKitPrebuilt.InvitationTypeVoiceCall);
          }}
          startIcon={<CallIcon />}
          color="primary"
        >
          Voice Call
        </Button>
      </div>
    </>
  );
};

export default GroupChatBox;
