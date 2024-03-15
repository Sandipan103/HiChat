// Chat.js
import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import axios from "axios";
import "../styles/chat.css"
import GroupList from "../component/ChatComponent/GroupList";
import GroupChatBox from "../component/ChatComponent/GroupChatBox";
import {server, AuthContext} from '../context/UserContext';


const Chatting = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [myId, setMyId] = useState("");
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState()
  const [messages, setMessages] = useState([""]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const fetchUserDetail = async () => {
    const token = Cookies.get("tokenf");
    if(!token)  {
      navigate('/login');
    }
    if (token) {
      try {
        setLoading(true);
        const decodedToken = jwtDecode(token);
        const { id: userId } = decodedToken;

        const response = await axios.get(
          `${server}/findAllChats/${userId}`
        );
        const myContacts = await axios.get(
          `${server}/contacts/${userId}`
        );
        setMyId(userId);

        const userChats = response.data.chats;
        const contacts = myContacts.data.contacts;

        // console.log(userChats); 
        // console.log(myContacts.data.contacts);
        
        const modifiedChats = userChats.map(chat => {

          let unreadMsgCount = 0;
          
          if (!chat.isGroupChat) {
            const otherUserId = chat.users.find(id => id !== userId);
            const contact = contacts.find(contact => contact.contactId === otherUserId);
            if (contact) {
              chat.groupName = contact.name
            } else {
              chat.groupName = contact.otherUserId
            }
          }

          chat.allChatMessages.forEach(message => {
            if (!message.readBy.includes(userId)) {
                unreadMsgCount++;
            }
          });
          chat.unreadMsgCount = unreadMsgCount;
          return chat;
        });

        // console.log(modifiedGroups) 
        console.log(modifiedChats) 
        setChats(modifiedChats);

      } catch (error) {
        toast.error("chat data not fetched");
        console.error("Error finding chat : ", error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [navigate]);

  const handleChatClick = async(chat) => {
    try {
        // console.log('group : ', group);
        if(selectedChat)  {
          await axios.post(`${server}/readAllMessages`, {
            myId,
            chatId : selectedChat._id,
          });
        }
        setSelectedChat(chat);
        const response = await axios.get(`${server}/fetchAllMessages/${chat._id}` );
        const responseReadMsg = await axios.post(`${server}/readAllMessages`, {
          myId,
          chatId : chat._id,
        });
        await fetchUserDetail();
        chat.unreadMsgCount = 0;
        setMessages(response.data.messages);
        setChats(prevChats => {
          const updatedChats = prevChats.filter(grp => grp._id !== chat._id);
          return [chat, ...updatedChats];
        });
    } catch (error) {
        console.log('chat not detected');
        console.log(error);
    }
  }

  
  return (
    <div className="main-container">
      <div className="chat-box">
      <div className="chat-body">
        <GroupList
            chats={chats}
            setChats = {setChats}
            handleChatClick = {handleChatClick}
        />
        <div className="message-body">
            {selectedChat && (
              <GroupChatBox
                myId={myId}
                messages={messages}
                setMessages={setMessages}
                selectedChat={selectedChat}
                chats={chats}
                setChats = {setChats}
              />
            )}
          </div>
      </div>
      </div>
    </div>
  );
};

export default Chatting;