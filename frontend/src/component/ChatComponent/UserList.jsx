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




const UserList = ({ users, setUsers, selectedUser, setSelectedUser, setRequestId, handleUserClick,noti,notiId }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  
  return (
    <div>
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
    {users.map((users, index) => (
       <>
         <ListItem key={index} alignItems="flex-start" className={
              selectedUser && selectedUser._id === users._id
                ? "user selected"
                : "user"
            }
            onClick={() => {handleUserClick(users); setRequestId(users._id);}}>
          <ListItemAvatar>
            <Avatar alt={users.name ? users.name : "Contact"} />
          </ListItemAvatar>
          <ListItemText
            primary={users.name ? users.name : users.number}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {users.name ? users.name : "No Name"}
                </Typography>
                {" — I'll be in your neighborhood doing errands this…"}
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

export default UserList;
