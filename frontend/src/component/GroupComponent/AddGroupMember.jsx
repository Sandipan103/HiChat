import { React, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../context/UserContext";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  TextField,
  ListItemSecondaryAction,
  Box,
} from "@mui/material";

export const GroupManage = ({ selectedChat, myId }) => {
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState([]);
  const [notSelectedContact, setNotSelectedContact] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const addToGroup = (contactId) => {
    const contactToAdd = allContacts.find(
      (contact) => contact.contactId._id === contactId
    );
    setSelectedContact([...selectedContact, contactToAdd]);
    setNotSelectedContact(
      notSelectedContact.filter((contact) => contact.contactId._id !== contactId)
    );
  };

  const removeFromGroup = (contactId) => {
    const contactToRemove = selectedContact.find(
      (contact) => contact.contactId._id === contactId
    );
    setNotSelectedContact([...notSelectedContact, contactToRemove]);
    setSelectedContact(
      selectedContact.filter((contact) => contact.contactId._id !== contactId)
    );
  };

  const modifyGroup = async () => {
    setOpen(true);
    try {
      const chatMembersResponse = await axios.get(
        `${server}/findChatMemberDetails/${selectedChat._id}`
      );
      const chatMembers = chatMembersResponse.data.users;
      
      const allContactsResponse = await axios.get(
        `${server}/getAllFriends/${myId}`
        );
        const allContacts = allContactsResponse.data.contacts;
        
        const selectedContacts = [];
        const unselectedContacts = [];

      allContacts.forEach((contact) => {
        const isPresentInChat = chatMembers.some(
          (member) => member._id === contact.contactId._id
        );
        if (isPresentInChat) {
          selectedContacts.push(contact);
        } else {
          unselectedContacts.push(contact);
        }
      });

      setAllContacts(allContacts);
      setSelectedContact(selectedContacts);
      setNotSelectedContact(unselectedContacts);
    } catch (error) {
      console.error("Error modifying group:", error);
    }
  };

  const updateGroup = async () => {
    try {
      const selectedContactIds = selectedContact.map(
        (contact) => contact.contactId._id
      );
      const response = await axios.post(`${server}/updateChatMember`, {
        chatId: selectedChat._id,
        selectedContacts: selectedContactIds,
        myId: myId,
      });
      toast.success("Group updated successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error in updating group:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Typography onClick={modifyGroup}>Add Members</Typography>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogActions>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <Box p={2}>
          <Typography variant="h6">Group Members</Typography>
          <List>
            {selectedContact.map((contact, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar src={`${server}/fetchprofile/${contact.contactId.profile}`} alt={contact.name} />
                </ListItemAvatar>
                <ListItemText primary={contact.name} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => removeFromGroup(contact.contactId._id)}
                  >
                    <CloseIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box p={2}>
          <Typography variant="h6">Add Members</Typography>
          <TextField
            label="Search Contacts"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            margin="normal"
          />
          <List>
            {notSelectedContact
              .filter((contact) =>
                contact.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((contact, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar src={`${server}/fetchprofile/${contact.contactId.profile}`} alt={contact.name} />
                  </ListItemAvatar>
                  <ListItemText primary={contact.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => addToGroup(contact.contactId._id)}
                    >
                      <PersonAddIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          </List>
        </Box>
        <Box p={2}>
          <Button variant="contained" color="primary" onClick={updateGroup}>
            Update Group
          </Button>
        </Box>
      </Dialog>
    </>
  );
};
