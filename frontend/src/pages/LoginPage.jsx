import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

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

import {server, AuthContext} from '../context/UserContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const {isAuthenticated,setIsAuthenticated} = useContext(AuthContext);

  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setUserDetail({
      ...userDetail,
      [event.target.name]: event.target.value,
    });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${server}/login`,
        { email: userDetail.email, password: userDetail.password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      
      Cookies.set("tokenf", response.data.token, {
        expires: 1,
      });
      console.log(`isAuthenticated : `, isAuthenticated);
      navigate(`/profile`);
      toast.success(`logged in`)
    } catch (error) {
      if(error.response.data.message) {
        toast.error(error.response.data.message);
      }
      else  {
        toast.error(`Login Faild`);
      }
      console.error("lgoin error", error);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    navigate('/profile');
  }
  
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper
          elevation={3}
          style={{ padding: "20px", borderRadius: "10px", textAlign: "center" }}
        >
          <h1>Login Page</h1>
          {!loading && (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                name="email"
                value={userDetail.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                name="password"
                value={userDetail.password}
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
                Login
              </Button>
            </form>
          )}

          {loading && <CircularProgress size={100} />}

          {/* Signup button */}
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            style={{ marginTop: "10px" }}
            component={Link}
            to="/signup"
          >
            Sign Up
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
