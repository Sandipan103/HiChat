import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  CircularProgress,
  Paper,
  Avatar,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import toast from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";

import { server, AuthContext } from "../../context/UserContext";

const NewGroup = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [userId, setuserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [open, setOpen] = useState(false);


  const fetchUserDetail = async () => {
    const token = Cookies.get("tokenf");
    if (!token) {
      navigate("/login");
    }
    if (token) {
      try {
        setLoading(true);
        const decodedToken = jwtDecode(token);
        setuserId(decodedToken.id);
        const response = await axios.get(
          `${server}/getAllFriends/${decodedToken.id}`
        );
        setFriends(response.data.contacts);
      } catch (error) {
        toast.error("User friends not found");
        console.error("Friend finding error: ", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);

  useEffect(() => {
    const filtered = friends.filter(
      (friend) =>
        friend.name &&
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSuggestedFriends(filtered);
  }, [searchQuery, friends]);

  const handleFriendSelection = (friendId) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends((prevSelected) =>
        prevSelected.filter((id) => id !== friendId)
      );
    } else {
      setSelectedFriends((prevSelected) => [...prevSelected, friendId]);
    }
    setSearchQuery("");
  };

  const handleRemoveFriend = (friendId) => {
    setSelectedFriends((prevSelected) =>
      prevSelected.filter((id) => id !== friendId)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFriends.length === 0) {
      toast.error("Please select at least one friend to create a group");
      return;
    }
    if (groupName === "") {
      toast.error("group name is required");
      return;
    }
    try {
      setLoading(true);
      console.log(selectedFriends);
      const response = await axios.post(
        `${server}/createGroup`,
        {
          groupName: groupName,
          selectedFriends: selectedFriends,
          admin: userId,
        },
        { withCredentials: true }
      );
      console.log(response);
      toast.success("Group created successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Something went wrong. Group creation failed");
      console.error("Group creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Group Name"
            variant="outlined"
            name="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            {selectedFriends.map((friendId) => {
              const selectedFriend = friends.find(
                (friend) => friend.contactId === friendId
              );
              return (
                <div
                  key={selectedFriend.contactId}
                  style={{ marginRight: "5px" }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFriend(selectedFriend.contactId)}
                  >
                    <Avatar
                      src={selectedFriend.avatarUrl}
                      alt={selectedFriend.name}
                    />
                  </IconButton>
                  <Typography variant="body2">{selectedFriend.name}</Typography>
                </div>
              );
            })}
          </div>
          <TextField
            label="Search Friends"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            margin="normal"
          />
          {searchQuery === "" && (
            <div style={{ marginTop: "10px", textAlign: "left" }}>
              {friends.map((friend) => (
                <IconButton
                  key={friend.contactId}
                  onClick={() => handleFriendSelection(friend.contactId)}
                  style={{ marginRight: "5px" }}
                >
                  <Avatar src={friend.avatarUrl} alt={friend.name} />
                  <Typography variant="body2">{friend.name}</Typography>
                </IconButton>
              ))}
            </div>
          )}
          {searchQuery !== "" && searchQuery && (
            <div style={{ marginTop: "10px", textAlign: "left" }}>
              {suggestedFriends.map((friend) => (
                <IconButton
                  key={friend.contactId}
                  onClick={() => handleFriendSelection(friend.contactId)}
                  style={{ marginRight: "5px" }}
                >
                  <Avatar src={friend.avatarUrl} alt={friend.name} />
                  <Typography variant="body2">{friend.name}</Typography>
                </IconButton>
              ))}
            </div>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "10px" }}
          >
            Create Group
          </Button>
        </form>
      </>
    );
  };

  const handleCreateGroup = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} fullWidth maxWidth="xs">
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          New Group
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          {loading ? <CircularProgress size={100} /> : renderForm()}
        </DialogContent>
      </Dialog>
      <Button onClick={handleCreateGroup}>New Group</Button>
    </>
  );
};

export default NewGroup;
