import React, { useContext, useState, useEffect } from "react";
import { server, AuthContext } from "../../context/UserContext";
import { Box } from "@mui/material";
import { ChattingList } from "./ChattingList";
import ChatSidebarNav from "./ChatSidebarNav";
import { MyContactList } from "./MyContactList";

const GroupList = ({
  chats,
  handleChatClick,
  selectedChat,
  userData,
  setUserData,
  myContacts,
}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
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
      <Box>
        <ChatSidebarNav userData={userData} setSearchQuery={setSearchQuery}  setShowMyContacts={setShowMyContacts}/>
        {showMyContacts ? (
          <MyContactList
            searchQuery={searchQuery}
            myContacts={myContacts}
            handleChatClick={handleChatClick}
            selectedChat={selectedChat}
            setShowMyContacts={setShowMyContacts}
          />
        ) : (
          <ChattingList
            chats={chats}
            searchQuery={searchQuery}
            handleChatClick={handleChatClick}
            selectedChat={selectedChat}
            searchFriends={searchFriends}
          />
        )}
      </Box>
    </div>
  );
};

export default GroupList;
