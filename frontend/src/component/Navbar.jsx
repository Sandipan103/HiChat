import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Hidden, Drawer, List, ListItem, ListItemText, Container, Divider } from '@mui/material';
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
        <ListItem button component={Link} to="/signup">
          <ListItemText primary="Signup" />
        </ListItem>
        <ListItem button component={Link} to="/login">
          <ListItemText primary="Login" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#2E3B55', boxShadow: 'none', borderBottom: '1px solid #ddd' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Logo */}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                textAlign: 'left',
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                '&:hover': {
                  color: '#FF6F61',
                }
              }}
            >
              HIChat
            </Typography>

            {/* Links for larger screens */}
            <Hidden smDown>
              <Box sx={{ display: 'flex', gap: theme.spacing(3) }}>
                <Button
                  color="inherit"
                  component={Link}
                  to="/"
                  sx={{ textTransform: 'none', fontWeight: 'bold', '&:hover': { color: '#FF6F61' } }}
                >
                  Home
                </Button>
                <Button
                  color="inherit"
                  sx={{ textTransform: 'none', fontWeight: 'bold', '&:hover': { color: '#FF6F61' } }}
                >
                  About
                </Button>
                <Button
                  color="inherit"
                  sx={{ textTransform: 'none', fontWeight: 'bold', '&:hover': { color: '#FF6F61' } }}
                >
                  Team
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/signup"
                  sx={{ textTransform: 'none', fontWeight: 'bold', '&:hover': { color: '#FF6F61' } }}
                >
                  Signup
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{ textTransform: 'none', fontWeight: 'bold', '&:hover': { color: '#FF6F61' } }}
                >
                  Login
                </Button>
              </Box>
            </Hidden>

            {/* Mobile hamburger menu */}
            <Hidden smUp>
              <IconButton
                edge="start"
                sx={{ color: 'white' }}
                aria-label="menu"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
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
              '& .MuiDrawer-paper': {
                width: 250,
                backgroundColor: '#2E3B55',
                color: 'white',
              },
            }}
          >
            <Box sx={{ width: 250, p: 2 }}>
              <Typography variant="h6" sx={{ textAlign: 'center', color: '#FF6F61', fontWeight: 'bold' }}>HIChat</Typography>
            </Box>
            <Divider sx={{ backgroundColor: '#fff' }} />
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </Box>
  );
};

export default NavBar;
