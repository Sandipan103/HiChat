import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import {
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import toast from "react-hot-toast";

import { server, AuthContext } from "../../context/UserContext";

const NewContact = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [userId, setuserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  const [friend, setFriend] = useState({
    name: "",
    contactNo: "",
  });

  const handleChange = (event) => {
    setFriend({
      ...friend,
      [event.target.name]: event.target.value,
    });
  };

  const fetchUserDetail = async () => {
    const token = Cookies.get("tokenf");
    if (!token) {
      navigate("/login");
    }
    console.log("isAuthenticated", isAuthenticated);
    if (token) {
      try {
        setLoading(true);
        const decodedToken = jwtDecode(token);
        setuserId(decodedToken.id);
      } catch (error) {
        toast.error("profile data not fetched");
        console.error("Error decoding token:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!friend.name || !friend.contactNo) {
      toast.error("all fields are required");
      return;
    }
    const isValidMobile = /^[0-9]{10}$/.test(friend.contactNo);
    if (!isValidMobile) {
      toast.error("invalid mobile number");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${server}/addContact`,
        { name: friend.name, contactNo: friend.contactNo, userId: userId },
        { withCredentials: true }
      );
      const success = response.data.success;
      const message = response.data.message;
      console.log(success);
      if(success){
        toast.success(message);
      }else{
        toast.error(message)
      }
    } catch (error) {
      toast.error("something wrong contact not saved");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          name="name"
          value={friend.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mobile number"
          variant="outlined"
          name="contactNo"
          value={friend.contactNo}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "10px" }}
        >
          Save Contact
        </Button>
      </form>
    );
  };

  const handleAddContact = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} fullWidth maxWidth="xs">
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          New Contact
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
      <IconButton onClick={handleAddContact}>
      <PersonAddAltRoundedIcon />
          </IconButton>
    </>
  );
};

export default NewContact;
