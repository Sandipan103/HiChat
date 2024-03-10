import React, { useContext, useState } from "react";
import axios from "axios";

import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import toast from "react-hot-toast";
import { Link, useNavigate} from "react-router-dom";

import {server} from '../context/UserContext';

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (event) => {
    setSignupData({
      ...signupData,
      [event.target.name]: event.target.value,
    });
  };

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // email validation
    const emailPattern =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (!emailPattern.test(signupData.email)) {
      toast.error("Please use a valid email address.");
      return;
    }
    
    // password validation

    try {
      setLoading(true);
      const response = await axios.post(
        `${server}/sendOtp`,
        { email: signupData.email },
        { withCredentials: true }
      );
      toast.success(`Otp successfully send to your mail 📫`);
      console.log(response.data);
      setProgress(true);
    } catch (error) {
      
      if(error.response.data.message) {
        toast.error(error.response.data.message);
      }
      else  {
        toast.error(`Otp can't be send 📪`);
      }
      // console.log("error : " , error.response.data.message);
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${server}/signup`,
        { ...signupData, otp },
        { withCredentials: true }
      );
      console.log(response.data);
      toast.success(``)
    } catch (error) {
      toast.error(`invalid Otp ⛔ `);
      console.error("Error verifying OTP:", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper
          elevation={3}
          style={{ padding: "20px", borderRadius: "10px", textAlign: "center" }}
        >
          <h1>Signup Page</h1>
          {loading && (
            <CircularProgress size={100} />
          )}
          {!loading && !progress && (
            <form onSubmit={handleSubmit}>
              <TextField
                label="First Name"
                variant="outlined"
                name="firstName"
                value={signupData.firstName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last Name"
                variant="outlined"
                name="lastName"
                value={signupData.lastName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                name="password"
                value={signupData.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={handleTogglePasswordVisibility}
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "10px" }}
              >
                Sign Up
              </Button>
            </form>
          )}
          { !loading && progress && (
            <form onSubmit={handleOtpSubmit}>
              <TextField
                label="Enter OTP"
                variant="outlined"
                type="number"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                fullWidth
                margin="normal"
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]{6}'
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "10px" }}
              >
                Verify OTP
              </Button>
            </form>
          )}

          {/* Login button */}
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            style={{ marginTop: "10px" }}
            component={Link} 
            to="/login"
          >
            Log in here
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SignupPage;
