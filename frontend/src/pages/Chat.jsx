// Chat.js
import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import axios from "axios";
import UserList from "../component/ChatComponent/UserList";
import {SpeedDial, SpeedDialAction } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import "../styles/chat.css";
import { ChatBox } from "../component/ChatComponent/ChatBox";
import {server, AuthContext} from '../context/UserContext';


const Chat = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([""]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [myId, setMyId] = useState("");
  const [requestId, setRequestId] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [noti, setNoti] = useState(1);
  const [notiId, setNotiId] = useState('');
  const [speedDialOpen, setSpeedDialOpen] = useState(false);


  const fetchUserDetail = async () => {
    const token = Cookies.get("tokenf");
    if(!token)  {
      navigate('/login');
    }
    console.log( 'isAuthenticated' , isAuthenticated);
    if (token) {
      try {
        // setLoading(true);
        const decodedToken = jwtDecode(token);
        const { id: userId } = decodedToken;

        const response = await axios.get(
          `${server}/contacts/${userId}`
        );
        setMyId(userId);

        const userContacts = response.data.contacts;
        setUsers(userContacts);
        // setUserData(user);

      } catch (error) {
        toast.error("profile data not fetched");
        console.error("Error decoding token:", error);
        navigate('/login');
      } finally {
        // setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [navigate]);

  const handleUserClick = async (user) => {
    console.log(user._id);
    setSelectedUser(user);
    setRequestId(user._id);
    console.log({"id" : requestId});

    try {
      const response = await axios.get(
        `${server}/chats/${myId}/${user._id}`
      );
      
      setMessages(response.data);
      console.log(messages)
      inputRef.current.focus();
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <>
    
    <div className="main-container">
      <div className="chat-box">

        {/* <div className="chat-header">
          <h5 className="header-message">Chat</h5>
        </div> */}

        <div>
          search
        </div>

        <div>

        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          sx={{ position: 'absolute', bottom: 16, left: 100 }}
          icon={<AddCircleIcon />}
          open={speedDialOpen}
          onClick={() => setSpeedDialOpen(!speedDialOpen)}
        >
          <SpeedDialAction
            icon={<GroupIcon />}
            tooltipTitle='create group'
            tooltipOpen
            onClick={()=>{navigate('/createGroup')}}
          />
          <SpeedDialAction
            icon={<PersonAddIcon />}
            tooltipTitle='new contact'
            tooltipOpen
            onClick={()=>{navigate('/addContact')}}
          />
        </SpeedDial>
        </div>

        <div className="chat-body">
          <UserList
            noti={noti}
            notiId={notiId}
            users={users}
            setUsers={setUsers}
            selectedUser={selectedUser}
            setRequestId={setRequestId}
            handleUserClick={handleUserClick}
          />
          <div className="message-body">
            {selectedUser && (
              <ChatBox
              setNotiId={setNotiId}
              setSelectedUser={setSelectedUser}
              inputRef={inputRef}
              setMessages={setMessages}
              myId={myId}
              messages={messages}
              requestId={requestId}
              setNoti={setNoti}
              noti={noti}
            />
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Chat;