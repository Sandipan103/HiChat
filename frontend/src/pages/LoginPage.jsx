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
import Box from "@mui/material/Box";
import toast from "react-hot-toast";
import NavBar from "../component/Navbar";
import LoginSvg from "../component/SVG/LoginSvg";

import { server, AuthContext } from "../context/UserContext";
import { Container, Typography } from "@mui/material";
import '../styles/login.css'
const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

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
      const response = await axios.post(
        `${server}/login`,
        { email: userDetail.email, password: userDetail.password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);

      Cookies.set("tokenf", response.data.token, {
        expires: 1,
      });
      navigate(`/chatting`);
      toast.success(`Logged in`);
    } catch (error) {
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`Login Failed`);
      }
      console.error("Login error", error);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    navigate("/chatting");
  }

  return (
    <>
      <NavBar />
      <Box
        sx={{
          minHeight: "calc(100vh - 90px)", // Adjust for navbar height
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "auto",
          background: "#eee"
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} flexDirection={"row-reverse"}>
            <Grid item xs={12} sm={6}  sx={{position:'relative'}} >
            <div class="background">
                  <div class="shape"></div>
                  <div class="shape"></div>
                </div>
              <Box
              class={'loginForm'}
     
              >
                
                <Typography variant="h4" component="h1" gutterBottom>
                  Login
                </Typography>
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
                      size="small"
                      autoFocus
                      required
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
                      size="small"
                      required
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
                      size="large"
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
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <LoginSvg />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      ;
    </>
  );
};

export default LoginPage;
