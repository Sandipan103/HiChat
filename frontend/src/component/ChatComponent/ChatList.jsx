import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import { server } from "../../context/UserContext";

export const ChatList = ({
  chats,
  searchQuery,
  handleChatClick,
  searchFriends,
  selectedChat,
  myId,
}) => {
  return (
    <List
      sx={{
        width: "100%",
        height: "calc(75vh)",
        boxSizing: "border-box",
        overflowY: "auto",
        bgcolor: "background.paper",
        flex: '1 1 auto',
      }}
    >
      {searchQuery === "" &&
      chats.length ?
        chats.map((chat, index) => (

          <ListItem
            key={index}
            button
            alignItems="flex-start"
            className={`user ${
              selectedChat &&
              ((selectedChat._id === chat._id) ? "selected-chat" : "")
            }`}
            onClick={() => {
              handleChatClick(chat);
            }}
            divider
          >
            <ListItemAvatar>
              <Avatar
                alt={chat.groupName ? chat.groupName : "no name"}
                src={`${server}/fetchprofile/${
                  chat.isGroupChat ? chat.profile : 
                 ( myId === chat.users[0]._id)
                    ? chat.users[1].profile
                    : chat.users[0].profile
                }`}
              />
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
                    sx={{ display: "inline", fontSize:'12px', fontWeight:500 }}
                    component="span"
                    variant="body2"
                    color="#176B87"
                  >
                   
                    {chat.isGroupChat
                      ? chat.latestMessageSender
                        ? chat.latestMessageSender+": "
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
        ))
        :
        <ListItem>start a conversation whenever you're ready.</ListItem>
        
      }
      {searchQuery !== "" &&
        searchQuery &&
        searchFriends.map((chat, index) => (
          <ListItem
          button
            key={index}
            alignItems="flex-start"
            className={`user ${selectedChat === chat ? "selected-chat" : ""}`}
            onClick={() => {
              handleChatClick(chat);
            }}
            divider
          >
            <ListItemAvatar>
              <Avatar
                alt={chat.groupName ? chat.groupName : "no name"}
                src={`${server}/fetchprofile/${
                  myId === chat.users[0]._id
                    ? chat.users[1].profile
                    : chat.users[0].profile
                }`}
              />
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
  );
};
