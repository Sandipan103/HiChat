import React,{ useEffect, useState} from "react";
import axios from "axios";
import io from "socket.io-client";
import {server, AuthContext} from '../../context/UserContext';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Input from '@mui/material/Input';
const ariaLabel = { 'aria-label': 'description' };


const BASH_URL = `http://localhost:4000`;

const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
];

export const ChatBox = ({ inputRef, myId,requestId, setMessages,setNoti,noti,setNotiId}) => {
  const [messageInput, setMessageInput] = useState('');
  const [socket, setSocket] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

 

  useEffect(() => {
    const socketIO = io("http://localhost:4000", {
        query: { userId: myId },
      });
      setSocket(socketIO);

      socketIO.on("connect", () => {
        console.log("Connected to server");
      });
  
      socketIO.on("disconnect", () => {
        console.log("Disconnected from server");
      });

      socketIO.on("private-message", ({ from, message }) => {
        if(requestId === from){
          setMessages(prevMessages => [...prevMessages, { recipient : from, content: message, timestamp: Date.now() }]);
          // console.log(`Received message from ${from}: ${message}`);
        }else{
          console.log("notification");
          setNoti((prevNoti) => prevNoti + 1)
          setNotiId(from)
        }
       
      });
  }, [myId, requestId, setMessages, setNoti, setNotiId]);


    const handleMessageInputChange = (e) => {
        setMessageInput(e.target.value);
    };

    const handleSendMessage = async () => {
    console.log('Message sent:', messageInput);
    setMessages(prevMessages => [...prevMessages, { sender: myId,recipient : requestId,  content: messageInput, timestamp: Date.now() }]);
    
    socket.emit("private-message", { to: requestId, message: messageInput,  myId });

    

    inputRef.current.focus();

    try {
        const response = await axios.post(`${server}messaging`, {
        myId,
        requestId,
        messageInput,
        });
        setMessageInput('');
        // console.log(response.data);
    } catch (error) {
        console.error('Error sending message:', error);
    }
    };

  return (
    <div className="message-input">
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
      <Input
        ref={inputRef}
        type="text"
        placeholder="Type Something"
        value={messageInput}
        onChange={handleMessageInputChange}
        inputProps={ariaLabel}
      />
      <Button variant="contained" onClick={handleSendMessage} endIcon={<SendIcon />}>
  Send
</Button>
    </div>
  );
};
