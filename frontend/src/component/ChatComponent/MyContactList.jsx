import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';

export const MyContactList = ({
  searchQuery,
  myContacts,
  selectedChat,
  handleChatClick,
  searchFriends,
  setShowMyContacts,
}) => {
    const [searchContact, setSearchContact] = useState([]);

    useEffect(() => {
        const filtered = myContacts.filter(
          (contact) =>
          contact.name &&
          contact.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchContact(filtered);
      }, [searchQuery]);
      
  const handleClose = () => {
    setShowMyContacts(false);
  };

  return (
    <Box>
      <List
        dividers
        sx={{
          width: "100%",
          height: "calc(74vh)",
          overflowY: "auto",
          bgcolor: "background.paper",
        }}
      >
       
        <DialogTitle component={"span"} sx={{ m: 0, p: 0}}>
        <IconButton aria-label="close" onClick={handleClose}>
          <ArrowBackIcon />
        </IconButton>
        </DialogTitle>
        <Divider />
        {searchQuery === "" &&
          myContacts.map((contact, index) => (
            <ListItem
              key={index}
              alignItems="flex-start"
              onClick={() => {
                handleChatClick(contact);
              }}
              divider
            >
              <ListItemAvatar>
                <Avatar alt={contact.name} />
              </ListItemAvatar>
              <ListItemText primary={<>{contact.name}</>} />
            </ListItem>
          ))}
        {searchQuery !== "" &&
          searchQuery &&
          searchContact.map((contact, index) => (
            <ListItem
              key={index}
              alignItems="flex-start"
              onClick={() => {
                handleChatClick(contact);
              }}
              divider
            >
              <ListItemAvatar>
                <Avatar alt={contact.name} />
              </ListItemAvatar>
              <ListItemText primary={<>{contact.name}</>} />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};
