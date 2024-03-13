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
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState()
  const [messages, setMessages] = useState([""]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const fetchUserDetail = async (group) => {
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
          `${server}/findAllGroups/${userId}`
        );
        const myContacts = await axios.get(
          `${server}/contacts/${userId}`
        );
        setMyId(userId);

        const userGroups = response.data.groups;
        const contacts = myContacts.data.contacts;

        // console.log(userGroups);
        // console.log(myContacts.data.contacts);
        
        const modifiedGroups = userGroups.map(group => {
          if (!group.isGroupChat) {
            const otherUserId = group.users.find(id => id !== userId);
            const contact = contacts.find(contact => contact.contactId === otherUserId);
            if (contact) {
              return { ...group, groupName: contact.name, unreadMsgCount : 0 };
            } else {
              return { ...group, groupName: otherUserId, unreadMsgCount : 0 };
            }
          }
          return  { ...group, unreadMsgCount : 0 };
        });

        console.log(modifiedGroups)
  
        setGroups(modifiedGroups);

      } catch (error) {
        toast.error("group data not fetched");
        console.error("Error finding group : ", error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [navigate]);

  const handleGroupClick = async(group) => {
    try {
        // console.log('group : ', group);
        setSelectedGroup(group);
        const response = await axios.get(`${server}/fetchAllMessages/${group._id}` );
        setMessages(response.data.messages);
        setGroups(prevGroups => {
          const updatedGroups = prevGroups.filter(grp => grp._id !== group._id);
          return [group, ...updatedGroups];
        });
        // console.log(response.data.messages)
    } catch (error) {
        console.log('group not detected');
        console.log(error);
    }
  }

  
  return (
    <div className="main-container">
      <div className="chat-box">
      <div className="chat-body">
        <GroupList
            groups={groups}
            setGroups = {setGroups}
            handleGroupClick = {handleGroupClick}
        />
        <div className="message-body">
            {selectedGroup && (
              <GroupChatBox
                myId={myId}
                messages={messages}
                setMessages={setMessages}
                selectedGroup={selectedGroup}
                groups={groups}
                setGroups = {setGroups}
              />
            )}
          </div>
      </div>
      </div>
    </div>
  );
};

export default Chatting;