import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import { server } from "../../context/UserContext";

export const MyContactList = ({
  searchQuery,
  myContacts,
  selectedChat,
  handleChatClick,
  searchFriends,
  setShowMyContacts,
  myId,
}) => {
  const [searchContact, setSearchContact] = useState([]);

  useEffect(() => {
    const filtered = myContacts.filter(
      (contact) =>
        contact.groupName &&
        contact.groupName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchContact(filtered);
  }, [searchQuery]);

  const handleClose = () => {
    setShowMyContacts(false);
  };

  return (
    <Box>
      <List
      button
        dividers
        sx={{
          width: "100%",
          height: "calc(75vh)",
          boxSizing: "border-box",
          overflowY: "auto",
          bgcolor: "background.paper",
          flex: "1 1 auto",
        }}
      >
        <DialogTitle component={"span"} sx={{ m: 0, p: 0 }}>
          <IconButton aria-label="close" onClick={handleClose}>
            <ArrowBackIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        {searchQuery === "" &&
         myContacts.length ? myContacts.map((contact, index) => (
            <ListItem
            button
              key={index}
              alignItems="flex-start"
              onClick={() => {
                handleChatClick(contact);
              }}
              divider
            >
              <ListItemAvatar>
                <Avatar
                  alt={contact.groupName ? contact.groupName : "no name"}
                  src={`${server}/fetchprofile/${
                    myId === contact.users[0]._id
                      ? contact.users[1].profile
                      : contact.users[0].profile
                  }`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={<>{contact.groupName}</>}
                secondary={
                  <>
                    {myId === contact.users[0]._id
                      ? contact.users[1].about
                      : contact.users[0].about}
                  </>
                }
              />
            </ListItem>
          )) : <ListItem>Add Contact</ListItem>
        }
        {searchQuery !== "" &&
          searchQuery &&
          searchContact.map((contact, index) => (
            <ListItem
            button
              key={index}
              alignItems="flex-start"
              onClick={() => {
                handleChatClick(contact);
              }}
              divider
            >
              <ListItemAvatar>
                <Avatar
                  alt={contact.groupName ? contact.groupName : "no name"}
                  src={`${server}/fetchprofile/${
                    myId === contact.users[0]._id
                      ? contact.users[1].profile
                      : contact.users[0].profile
                  }`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={<>{contact.groupName}</>}
                secondary={
                  <>
                    {myId === contact.users[0]._id
                      ? contact.users[1].about
                      : contact.users[0].about}
                  </>
                }
              />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};
