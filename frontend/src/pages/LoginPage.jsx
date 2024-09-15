import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Link from '@mui/material/Link';
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import {Paper} from "@mui/material";
import Box from "@mui/material/Box";
import toast from "react-hot-toast";
import NavBar from "../component/Navbar";
import { server, AuthContext } from "../context/UserContext";
import { Container, Typography } from "@mui/material";
import "../styles/login.css";

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
          minHeight: "calc(100vh - 90px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f9f9f9",
          padding: 2,
        }}
      >
        <Container maxWidth="xs">
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              {!loading ? (
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
                    required
                    size="small"
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
                    required
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={handleTogglePasswordVisibility}
                          >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
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
                    sx={{ mt: 2, mb: 1 }}
                  >
                    Login
                  </Button>
                </form>
              ) : (
                <CircularProgress size={24} />
              )}
              <Link href="/signup" variant="body2" sx={{ mt: 2 }}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;
