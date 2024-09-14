import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../context/UserContext";
import { Dialog, Button, Box, TextField,Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import toast from "react-hot-toast";

export const EditContact = ({ selectedChat, myId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [timer, setTimer] = useState("");
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [contactName, setContactName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setContactName(selectedChat.groupName);
    const mNum =
      selectedChat.users[0]._id === myId
        ? selectedChat.users[1].contactNo
        : selectedChat.users[0].contactNo;
    setContactNo(mNum);
  }, []);

  const handleSubmit = async () => {
    try {
      const data = {
        userId: selectedChat.users[1],
        contactName: contactName,
        contactNo: contactNo,
      };
      setLoading(true);
      const response = await axios.put(`${server}/editContact`, data);
      toast.success("Contact updated");
      window.location.reload();
    } catch (error) {
      toast.error("Contact not updated");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
      // window.location.reload();
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Typography onClick={handleClick}>Edit Contact</Typography>
      <React.Fragment>
        <Dialog
          fullScreen={fullScreen}
          open={anchorEl}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
          sx={{ m: 0, p: 2 }}
          maxWidth="xs"
          fullWidth="true"
        >
          <DialogContent>
            <Box
              alignItems="center"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <TextField
                label="Name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone number"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" variant="outlined">
              Close
            </Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
};
