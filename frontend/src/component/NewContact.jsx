import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import {TextField, Button, Grid, CircularProgress, Paper, } from "@mui/material";
import toast from "react-hot-toast";

import { server, AuthContext } from "../context/UserContext";

const NewContact = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [userId, setuserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [friend, setFriend] = useState({
    name: "",
    contactNo : "",
  });
  const handleChange = (event) => {
    setFriend({
      ...friend,
      [event.target.name]: event.target.value,
    });
  };

  const fetchUserDetail = async () => {
    const token = Cookies.get("tokenf");
    if(!token)  {
      navigate('/login');
    }
    console.log( 'isAuthenticated' , isAuthenticated);
    if (token) {
      try {
        setLoading(true);
        const decodedToken = jwtDecode(token);
        setuserId(decodedToken.id);
      } catch (error) {
        toast.error("profile data not fetched");
        console.error("Error decoding token:", error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);

  const handleSubmit = async(event) => {
    event.preventDefault();
    if(!friend.name || !friend.contactNo)   {
        toast.error('all fields are required');
        return;
    }
    const isValidMobile = /^[0-9]{10}$/.test(friend.contactNo);
    if(!isValidMobile)  {
        toast.error('invalid mobile number');
        return;
    }
    try {
        setLoading(true);
        const response = await axios.post(`${server}/addContact`,
            { name : friend.name, contactNo : friend.contactNo, userId : userId},
            { withCredentials: true }
          );
          toast.success('contact saved')
        navigate('/chat')
        // console.log(response);
    } catch (error) {
        toast.error('something wrong contact not saved');
        console.log(error);
    } finally {
        setLoading(false);
      }
  }


  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper
          elevation={3}
          style={{ padding: "20px", borderRadius: "10px", textAlign: "center" }}
        >
          <h1>New Contact</h1>
          {!loading && (
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
                label="mobile number"
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
          )}

          {loading && <CircularProgress size={100} />}
        </Paper>
      </Grid>
    </Grid>
  )
}

export default NewContact