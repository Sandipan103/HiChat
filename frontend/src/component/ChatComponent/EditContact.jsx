import React, { useState } from "react";
import axios from "axios";
import { server } from "../../context/UserContext";
import {
  Dialog,
  Button,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
} from "@mui/material";

export const EditContact = ({ setChats, chats, selectedChat }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [timer, setTimer] = useState("");
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleCheckboxChange = async (chatId, newValue) => {
    await axios.post(`${server}/settimer/${chatId}`, {
      isTimerEnabled: newValue,
      timer: timer,
    });

    setChats(
      chats.map((chat) => {
        if (chat._id === chatId) {
          return { ...chat, isTimerEnabled: newValue, timer: timer };
        }
        return chat;
      })
    );
  };

  const timerOptions = {
    "1 Hour": 60,
    "24 Hour": 1440,
    "7 Days": 10080,
    "1 Month": 43200,
    "Off" : '',
  };

  const handleTimerChange = (e) => {
    const minutes = timerOptions[e.target.value];
    setTimer(minutes);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button onClick={handleClick}>Edit Contact</Button>
      <Dialog
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        maxWidth={'xs'}
        fullWidth
       
      >
        <div style={{ padding: "20px 40px" }}>
          <Button onClick={handleClose}>Close</Button>
        </div>
      </Dialog>
    </div>
  );
};
