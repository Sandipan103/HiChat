import React, { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import {TextField, Button, Avatar, Grid, CircularProgress, MenuItem, Select, FormControl, InputLabel, Paper, Box, } from "@mui/material";
import toast from "react-hot-toast";

import { server, AuthContext } from "../context/UserContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchUserDetail = async () => {
    const token = Cookies.get("tokenf");
    if(!token)  {
      navigate('/login');
    }
    // console.log( 'isAuthenticated' , isAuthenticated);
    if (token) {
      try {
        setLoading(true);
        const decodedToken = jwtDecode(token);
        const { id: userId } = decodedToken;

        const response = await axios.get(
          `${server}/getUserProfileById/${userId}`
        );

        const user = response.data.user;
        // console.log("userData : ", user);
        setUserData(user);

        const defaultGender = user.gender || "";
        const defaultContactNo = user.contactNo || "";

        setEditedData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          gender: defaultGender,
          contactNo: defaultContactNo,
        });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contactNo" && !/^\d{0,10}$/.test(value)) {
      toast.error("invalid contact number");
      return;
    }
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const token = Cookies.get("tokenf");
    // console.log("editedData : ", editedData);
    if(!token)  {
      toast.error("please login first : ");
      navigate("/login");
    }

    // validation check
    // Check if required fields are not empty
    if (!editedData.firstName || !editedData.lastName || !editedData.gender || !editedData.contactNo) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Validate contactNo length
    if (editedData.contactNo.length !== 10) {
      toast.error("Contact number should be 10 digits long.");
      return;
    }

    if (token) {
      try {
        setLoading(true);
        const response = await axios.put(`${server}/updateUserProfileById`, {
          userId: userData._id,
          firstName: editedData.firstName,
          lastName: editedData.lastName,
          gender: editedData.gender,
          contactNo: editedData.contactNo,
        });
        toast.success("profile updated");
      } catch (error) {
        toast.error("profile not updated");
        console.error("Error updating profile:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isAuthenticated) {
    navigate("/login");
  }

  return (
    <div style={{ padding: "20px" }}>
      <Paper
        style={{
          width: "80%",
          margin: "0 auto",
          boxShadow: "0px 3px 6px #00000029",
          padding: "20px",
          // backgroundColor: "beige",
        }}
      >
        <h2> Profile Page </h2>
        {loading && <CircularProgress />}
        
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} justifyContent="center">
            <Avatar
              alt="Profile Picture"
              src={editedData.image}
              sx={{ width: 100, height: 100 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="firstName"
              label="First Name"
              value={editedData.firstName || ""}
              onChange={handleChange}
              style={{ backgroundColor: "white", color: "black" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="lastName"
              label="Last Name"
              value={editedData.lastName || ""}
              onChange={handleChange}
              style={{ backgroundColor: "white", color: "black" }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              value={editedData.email || ""}
              onChange={handleChange}
              disabled
              style={{ backgroundColor: "white", color: "black" }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                name="gender"
                value={editedData.gender || ""}
                onChange={handleChange}
                style={{ backgroundColor: "white", color: "black" }}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="contactNo"
              label="Contact No"
              value={editedData.contactNo || ""}
              onChange={handleChange}
              style={{ backgroundColor: "white", color: "black" }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
  
  

};

export default ProfilePage;
