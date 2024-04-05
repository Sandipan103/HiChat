import React from "react";
// import {makeStyles} from '@mui/styles';
import { Container, Typography, Box, Grid } from "@mui/material";
import ChatLogo from "../../assets/hichat-logo.png";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//   },
//   logo: {
//     width: 100, // Adjust the size of the logo as needed
//     height: 'auto',
//     marginBottom: theme.spacing(2),
//   },
// }));

const ChatReturnComponent = () => {
  // const classes = useStyles();

  return (
    <Box sx={{ flex: "1 1 auto", display: "flex", alignItems: "center" }}>
      <Grid
        container
        direction="column"
        alignItems="center"
        width={"40%"}
        mx={"auto"}
      >
        <Grid item>
          <img height={"100px"} src={ChatLogo} alt="Chat Logo" />
        </Grid>
        <Grid item>
          <Typography variant="h5" align="center" mt={1} gutterBottom>
            hiChat: Connect Instantly
          </Typography>
          <Typography variant="body2" align="center">
            Experience seamless communication with hiChat. Instantly connect
            with friends and family while prioritizing your privacy and
            security.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatReturnComponent;
