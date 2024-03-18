import React, { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import NewContact from "../NewContact";
import NewGroup from "../NewGroup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { GroupManage } from "./GroupManage";

import { server, AuthContext } from "../../context/UserContext";
const BASH_URL = process.env.BASH_URL;

const GroupList = ({ chats, handleChatClick, setChats }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [addContact, setAddContact] = useState(false);
  const [createGroup, SetCreateGroup] = useState(false);

  const handleAddContact = () => {
    SetCreateGroup(false);
    setOpen(true);
    setAddContact(true);   
  };

  const handleCreateGroup = () => {
    setAddContact(false);  
    SetCreateGroup(true);
    setOpen(true);
     
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="chat-users">
  <GroupManage/>      
      <Stack direction="row" spacing={2} sx={{ mx: "auto", mt: 2, width: 300 }}>
        <Button variant="outlined" onClick={handleAddContact}>
          Add Contact
        </Button>
        <Button variant="outlined" onClick={handleCreateGroup}>
          Create Group
        </Button>
      </Stack>

      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const email = formJson.email;
              console.log(email);
              handleClose();
            },
          }}
        >
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
          {addContact && <NewContact />}
          {createGroup && <NewGroup />}
        </Dialog>
      </div>

      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {chats.map((chat, index) => (
          <>
            <ListItem
              key={index}
              alignItems="flex-start"
              className={"user"}
              onClick={() => {
                handleChatClick(chat);
              }}
            >
              <ListItemAvatar>
                <Avatar alt={chat.groupName ? chat.groupName : "no name"} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    {chat.groupName ? chat.groupName : "no name"}{" "}
                    {chat.unreadMsgCount && <span> {chat.unreadMsgCount}</span>}
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
                      {chat.groupName ? chat.groupName : "no name"}
                    </Typography>
                    {chat.latestMessage}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
    </div>
  );
};

export default GroupList;
