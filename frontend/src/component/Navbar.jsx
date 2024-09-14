import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Hidden, Drawer, List, ListItem, ListItemText, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom'; 
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';

const NavBar = () => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="About" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Team" />
        </ListItem>
        {/* Add more items as needed */}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Hidden smUp>
              <IconButton
                edge="start"
                sx={{ marginRight: theme.spacing(2) }}
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'left' }}>
              HIChat
            </Typography>
            <Hidden xsDown>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit">About</Button>
              <Button color="inherit">Team</Button>
              <Button color="inherit" component={Link} to="/signup">Signup</Button>
              <Button color="inherit" component={Link} to="/login">Login</Button>
            </Hidden>
            <Hidden smUp>
              <IconButton
                color="inherit"
                aria-label="login"
                sx={{ marginLeft: 'auto' }}
                component={Link} 
                to="/login"
              >
                <AccountCircleIcon />
              </IconButton>
            </Hidden>
          </Toolbar>
        </Container>
      </AppBar>
      <nav>
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              '& .MuiDrawer-paper': { width: 250 },
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </Box>
  );
};

export default NavBar;
