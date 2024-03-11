// Chat.js
import React, { useContext, useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import axios from "axios";
import UserList from "../component/ChatComponent/UserList";
import MessageBox from "../component/ChatComponent/MessageBox";
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
    // const userAuth = async () => {
    //   try {
    //     const response = await axios.post(
    //       `${server}`,
    //       {},
    //       { withCredentials: true }
    //     );
    //     const { status, user } = response.data;
    //     if (status) {
    //       setMyId(user._id);
    //     } else {
    //       navigate("/login");
    //     }
    //   } catch (error) {
    //     console.error("Error authenticating user:", error.message);
    //   }
    // };
    // userAuth();

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
        <div className="chat-header">
          <h5 className="header-message">Chat</h5>
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
            {/* {selectedUser && <MessageBox messages={messages} myId={myId} />} */}

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