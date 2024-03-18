import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Avatar, Typography, Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import { MoreVert as MoreVertIcon, Group as GroupIcon } from '@mui/icons-material';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const ChatSidebarNav = ({ userAvatar }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    setDrawerOpen(open);
  };

  return (
    <Box>
      <AppBar position="static" color="default" elevation={0} >
        <Toolbar>
          <Avatar alt="User Avatar" src={userAvatar} onClick={toggleDrawer(true)} />
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            Chat Title
          </Typography>
          <IconButton>
            <GroupIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
        <TextField
      variant="outlined"
      placeholder="Search..."
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

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>
          <ListItem button>
            <ListItemText primary="Item 1" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Item 2" />
          </ListItem>
          {/* Add more list items as needed */}
        </List>
      </Drawer>
    </Box>
  );
};

export default ChatSidebarNav;
