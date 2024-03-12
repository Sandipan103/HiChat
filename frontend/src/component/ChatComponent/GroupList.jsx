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




const GroupList = ({ groups,  handleGroupClick, }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  
  return (
    <div>
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
    {groups.map((group, index) => (
       <>
         <ListItem key={index} alignItems="flex-start" className={"user"}
            onClick={() => {handleGroupClick(group); }}>
          <ListItemAvatar>
            <Avatar alt={group.groupName ? group.groupName : "no name"} />
          </ListItemAvatar>
          <ListItemText
            primary={group.groupName ? group.groupName : "no name"}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {group.groupName ? group.groupName : "no name"}
                </Typography>
                {" it is a group chat "}
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
