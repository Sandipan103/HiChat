import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
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
import NewContact from "./NewContact";
import NewGroup from "./NewGroup";
import { UpdateProfile } from "./UpdateProfile";
import { server } from "../../context/UserContext";

const ChatSidebarNav = ({ userData, setSearchQuery }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [profileUrl, setProfileUrl] = useState();

  
  // const handleClose = (e) => {
  //   e.stopPropagation();
  //   handleUserMenuOpenClose(e);
  // }
useEffect(() => {
  const profileImageUrl = userData.profile && `${server}/fetchprofile/${userData.profile}`;
  setProfileUrl(profileImageUrl);
  console.log(profileUrl);
})
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


  return (
    <Box>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Avatar
            alt="User Avatar"
            src={profileUrl}
            onClick={()=>handleOpen() }
          />
          <Typography variant="span" sx={{ flexGrow: 1, ml: 2,fontWeight: 500 }}>
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
            <MenuItem onClick={(e)=>handleUserMenuOpenClose}><NewGroup /></MenuItem>
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
      {open && <UpdateProfile userData={userData} setOpen={setOpen}/>}
    </Box>
  );
};

export default ChatSidebarNav;
