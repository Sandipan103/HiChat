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

  const fetchUserDetail = async () => {
    const token = Cookies.get("tokenf");
    if(!token)  {
      navigate('/login');
    }
    console.log( 'isAuthenticated' , isAuthenticated);
    if (token) {
      try {
        // setLoading(true);
        const decodedToken = jwtDecode(token);
        const { id: userId } = decodedToken;

        const response = await axios.get(
          `${server}/contacts/${userId}`
        );

        const user = response.data.user;
        console.log("userData : ", user);
        // setUserData(user);

      } catch (error) {
        toast.error("profile data not fetched");
        console.error("Error decoding token:", error);
        navigate('/login');
      } finally {
        // setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [navigate]);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //      const response = await axios.get(`${server}/contacts/${currentUser}`);
  //       // const response = await axios.get(`${server}/contacts/65ed69f40a1180e2ae943e58`);
  //       setUsers(response.data.contacts);
  //       console.log(response)
  //       // setSelectedUser(users[0]); 
        
  //     } catch (error) {
  //       console.error('Error fetching users:', error);
  //     }
  //   };
  //   if (currentUser) {
  //     fetchUsers();
  //   }
  //   console.log(users);
  // }, [currentUser, setUsers]);

  return (
    <>
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
    {users.map((users, index) => (
        <ListItem key={index} alignItems="flex-start">
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
      ))}
      <Divider variant="inset" component="li" />
    </List>
    
        
    {/* <div className="chat-users">
      <ul className="userList">
        {users.map((user) => (
          <li
            key={user._id}
            className={
              selectedUser && selectedUser._id === user._id
                ? "user selected"
                : "user"
            }
            onClick={() => {handleUserClick(user); setRequestId(user._id);}}
          >
            <img
              className="user-image"
              alt={user.firstName}
              src="/images/user-profile-photo.svg"
            />
            <span>{user.firstName}</span>
            {notiId === user._id ?  <span className='msg-noti'>{noti}</span> : ""}
          </li>
        ))}
      </ul>
    </div> */}
    </>
  );
};

export default UserList;
