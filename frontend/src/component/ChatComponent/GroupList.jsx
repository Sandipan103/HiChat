import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ChatSidebarNav from "./ChatSidebarNav";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import { TextField, InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";

import { server, AuthContext } from "../../context/UserContext";
import { Box } from "@mui/material";

const GroupList = ({
  chats,
  handleChatClick,
  selectedChat,
  userData,
  setUserData,
}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFriends, setSearchFriends] = useState([]);

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
        <ChatSidebarNav userData={userData} setSearchQuery={setSearchQuery} />
        <List
          sx={{
            width: "100%",
            height: "calc(74vh)",
            overflowY: "auto",
            bgcolor: "background.paper",
          }}
        >
          {searchQuery === "" &&
            chats.map((chat, index) => (
              <ListItem
                key={index}
                alignItems="flex-start"
                className={`user ${
                  selectedChat === chat ? "selected-chat" : ""
                }`}
                onClick={() => {
                  handleChatClick(chat);
                }}
                divider
              >
                <ListItemAvatar>
                  <Avatar alt={chat.groupName ? chat.groupName : "no name"} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      {chat.groupName ? chat.groupName : "no name"}{" "}
                      {chat.unreadMsgCount ? (
                        <Badge
                          badgeContent={chat.unreadMsgCount}
                          color="error"
                          sx={{ float: "right", top: 20 }}
                        ></Badge>
                      ) : (
                        ""
                      )}
                    </>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {chat.isGroupChat
                          ? chat.latestMessageSender
                            ? chat.latestMessageSender
                            : "You: "
                          : ""}
                      </Typography>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {chat.latestMessage
                          ? chat.latestMessage.length > 30
                            ? chat.latestMessage.slice(0, 50) + "..."
                            : chat.latestMessage
                          : ""}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          {searchQuery !== "" &&
            searchQuery &&
            searchFriends.map((chat, index) => (
              <ListItem
                key={index}
                alignItems="flex-start"
                className={`user ${
                  selectedChat === chat ? "selected-chat" : ""
                }`}
                onClick={() => {
                  handleChatClick(chat);
                }}
                divider
              >
                <ListItemAvatar>
                  <Avatar alt={chat.groupName ? chat.groupName : "no name"} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      {chat.groupName ? chat.groupName : "no name"}{" "}
                      {chat.unreadMsgCount ? (
                        <Badge
                          badgeContent={chat.unreadMsgCount}
                          color="error"
                          sx={{ float: "right", top: 20 }}
                        ></Badge>
                      ) : (
                        ""
                      )}
                    </>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {chat.isGroupChat
                          ? chat.latestMessageSender
                            ? chat.latestMessageSender
                            : "You: "
                          : ""}
                      </Typography>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {chat.latestMessage
                          ? chat.latestMessage.length > 30
                            ? chat.latestMessage.slice(0, 50) + "..."
                            : chat.latestMessage
                          : ""}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
        </List>
      </Box>
    </div>
  );
};

export default GroupList;
