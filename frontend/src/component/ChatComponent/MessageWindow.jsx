import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Avatar, List, ListItem, ListItemText } from '@mui/material';

const MessageBox = ({ messages, myId }) => {

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };


  useEffect(() => {
    if (messages.length>0) {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <>
     <Paper sx={{ padding: 2 }}>
      {messages && messages.length > 0 ? (
       <List>
       {messages.map((message, index) => (
         <ListItem
           key={index}
           alignItems="flex-start"
           className={message.sender._id === myId ? "own-message" : "other-message"}
         >
           <ListItemAvatar>
             <Avatar alt="User Avatar" src={message.senderAvatar} />
           </ListItemAvatar>
           <ListItemText
             primary={
               <Typography variant="body1" component="span" fontWeight="bold">
                 {message.senderName}
               </Typography>
             }
             secondary={
               <>
                 <Typography variant="body2" color="text.secondary">
                   {message.content}
                 </Typography>
                 <Typography variant="body2" color="text.secondary">
                   {new Date(message.timestamp).toLocaleString("en-US", {
                     year: "numeric",
                     month: "numeric",
                     day: "numeric",
                     hour: "numeric",
                     minute: "numeric",
                     hour12: true,
                   })}
                 </Typography>
               </>
             }
           />
           <ListItemSecondaryAction>
             {message.sender._id === myId && (
               <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteMessage(index)}>
                 <DeleteIcon />
               </IconButton>
             )}
           </ListItemSecondaryAction>
         </ListItem>
       ))}
     </List>
      ) : (
        <Typography variant="body1">No chat available</Typography>
      )}
    </Paper>
    </>
  );
};

export default MessageBox;