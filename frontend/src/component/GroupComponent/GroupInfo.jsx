import React, { useState } from "react";
import axios from "axios";
import { server } from "../../context/UserContext";
import {
  Typography,
  IconButton,
  ListItemSecondaryAction,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import ListItemSecondaryAction from '@mui/material';

export const GroupInfo = ({ selectedChat }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const handleOpenDialog = async () => {
    try {
      const response = await axios.get(
        `${server}/findChatMemberDetails/${selectedChat._id}`
      );
      const { users, groupName, groupDescription } = response.data;
      setGroupMembers(users);
      setGroupName(groupName);
      setGroupDescription(groupDescription);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  console.log(groupMembers);
  return (
    <>
      <Typography onClick={handleOpenDialog}>Group info</Typography>

      <Dialog
        open={openDialog}
        maxWidth="sm"
        fullWidth
        onClose={handleCloseDialog}
      >
        <DialogTitle>Group Information</DialogTitle>
        <DialogContent>
          <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: 1 }}>
            Name: {selectedChat.groupName}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.1rem", marginBottom: 2 }}
          >
            Description: {selectedChat.about}
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 1 }}>
            Group Members
          </Typography>

          <List>
            {groupMembers.map((member, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar
                    src={`${server}/fetchprofile/${member.profile}`}
                    alt={member.firstName}
                  />
                </ListItemAvatar>
                <ListItemText primary={member.firstName} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
