import React from 'react'
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";

export const ChattingList = ({chats,searchQuery,handleChatClick,searchFriends,selectedChat}) => {
  return (
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
            <Avatar alt={chat.groupName ? chat.groupName : "no name"} src={chat.users.profile&&chat.users.profile} />
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
            <Avatar alt={chat.groupName ? chat.groupName : "no name"} src={chat.users.profile&&chat.users.profile} />
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
  )
}
