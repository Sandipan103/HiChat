import React, { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import axios from 'axios';

import {server, AuthContext} from '../../context/UserContext';
const BASH_URL = process.env.BASH_URL;




const GroupList = ({  chats,  handleChatClick,  setChats}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  
  return (
    <div className="chat-users">
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
    {chats.map((chat, index) => (
       <>
         <ListItem key={index} alignItems="flex-start" className={"user"}
            onClick={() => {handleChatClick(chat); }}>
          <ListItemAvatar>
            <Avatar alt={chat.groupName ? chat.groupName : "no name"} />
          </ListItemAvatar>
          <ListItemText
            primary={<>{chat.groupName ? chat.groupName : "no name"} {chat.unreadMsgCount && (
              <span>  {chat.unreadMsgCount}</span>
            )}</>}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {chat.groupName ? chat.groupName : "no name"}
                </Typography>
                {chat.latestMessage}
              </React.Fragment>
            }
          />
        </ListItem>
         <Divider variant="inset" component="li" />
       </>
      ))}
     
    </List>
    </div>
  );
};

export default GroupList;
