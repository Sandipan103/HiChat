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

const GroupChatBox = ({ messages, setMessages, myId, selectedGroup, setGroups, groups}) => {
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
    socket.emit("join chat", selectedGroup._id);
    const oth=selectedGroup.users.find(id=>id!=myId);
    setCalleeId(oth);
  }, [selectedGroup]);

  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (
        !selectedGroup || // if chat is not selected or doesn't match current chat
        selectedGroup._id !== newMessage.chat._id
      ) {
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
  }, [messages, selectedGroup, groups, setGroups]);

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
      setMessageInput("");
      socket.emit("new message", {
        newMessage: response.data.newMessage,
        chatUsers: response.data.chatUsers,
      });
      setMessages([...messages, response.data.newMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };


  return (
    <>
      <div className="message-area">
        <div className="message-header">
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
