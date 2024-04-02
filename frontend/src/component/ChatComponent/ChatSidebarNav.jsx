import React, { useEffect, useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Typography,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import NewContact from "./UserComponent/NewContact";
import NewGroup from "./GroupComponent/NewGroup";
import { UpdateProfile } from "../UserComponent/UpdateProfile";
import { server,AuthContext } from "../../context/UserContext";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ChatSidebarNav = ({ userData, setSearchQuery, setShowMyContacts }) => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [profileUrl, setProfileUrl] = useState();

  useEffect(() => {
    const profileImageUrl =
      userData.profile && `${server}/fetchprofile/${userData.profile}`;
    setProfileUrl(profileImageUrl);
    // console.log(profileUrl);
  });
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuOpenClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const logoutHandler = async () => {
    try {
      setLoading(true);
      await axios.get(`${server}/logout`, {
        withCredentials: true,
      });
      Cookies.remove("tokenf");
      setIsAuthenticated(false);
      toast.success("Logged Out !!!!");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Problem while Logging out");
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Avatar
            alt="User Avatar"
            src={profileUrl}
            onClick={() => handleOpen()}
          />
          <Typography
            variant="span"
            sx={{ flexGrow: 1, ml: 2, fontWeight: 500 }}
          >
            {userData.firstName}
          </Typography>
          <IconButton>
            <NewContact />
          </IconButton>
          <IconButton onClick={handleUserMenuOpen}>
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuOpenClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{ ml: -1, mt: 6 }}
          >
            <MenuItem>
              <NewGroup />
            </MenuItem>
            <MenuItem onClick={(e) => setShowMyContacts(true)}>
              My Contacts
            </MenuItem>
            <MenuItem onClick={(e) => logoutHandler()}>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
        <TextField
          variant="outlined"
          placeholder="Search..."
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </AppBar>
      {open && <UpdateProfile userData={userData} setOpen={setOpen} />}
    </Box>
  );
};

export default ChatSidebarNav;
