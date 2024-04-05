import React, { useContext, useState, useEffect } from "react";
import {AuthContext } from "../../context/UserContext";
import { Box } from "@mui/material";
import { ChatList } from "./ChatList";
import ChatSidebarNav from "./ChatSidebarNav";
import { MyContactList } from "../UserComponent/MyContactList";

const GroupList = ({
  chats,
  handleChatClick,
  selectedChat,
  userData,
  myContacts,
  myId,
}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFriends, setSearchFriends] = useState([]);
  const [showMyContacts, setShowMyContacts] = useState(false);
  useEffect(() => {
    const filtered = chats.filter(
      (friend) =>
        friend.groupName &&
        friend.groupName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchFriends(filtered);
  }, [searchQuery, chats]);

  return (
    <div className="chat-users">
      <Box sx={{display:'flex', flexDirection:'column', height:'100%', boxSizing:'border-box'}}>
        <ChatSidebarNav
          userData={userData}
          setSearchQuery={setSearchQuery}
          setShowMyContacts={setShowMyContacts}
        />
        {showMyContacts ? (
          <MyContactList
            searchQuery={searchQuery}
            myContacts={myContacts}
            handleChatClick={handleChatClick}
            selectedChat={selectedChat}
            setShowMyContacts={setShowMyContacts}
            myId={myId}
          />
        ) : (
          <ChatList
            chats={chats}
            searchQuery={searchQuery}
            handleChatClick={handleChatClick}
            selectedChat={selectedChat}
            searchFriends={searchFriends}
            myId={myId}
          />
        )}
      </Box>
    </div>
  );
};

export default GroupList;
