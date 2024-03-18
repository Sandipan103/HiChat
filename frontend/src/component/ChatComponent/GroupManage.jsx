import { React, useState } from "react";
import { Avatar, Typography, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../context/UserContext";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";

export const GroupManage = ({ selectedChat, myId }) => {
  const [showModifiedGroup, setShowModifiedGroup] = useState(false);
  const [selectedContact, setSelectedContact] = useState([]);
  const [notSelectedContact, setNotSelectedContact] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const addToGroup = (contactId) => {
    const contactToAdd = allContacts.find(
      (contact) => contact.contactId === contactId
    );
    setSelectedContact([...selectedContact, contactToAdd]);
    setNotSelectedContact(
      notSelectedContact.filter((contact) => contact.contactId !== contactId)
    );
  };

  const removeFromGroup = (contactId) => {
    const contactToRemove = selectedContact.find(
      (contact) => contact.contactId === contactId
    );
    setNotSelectedContact([...notSelectedContact, contactToRemove]);
    setSelectedContact(
      selectedContact.filter((contact) => contact.contactId !== contactId)
    );
  };

  const handleGroupShowing = async () => {
    const response = await axios.get(
      `${server}/findChatMemberDetails/${selectedChat._id}`
    );
    console.log(response.data.users);
    console.log(response.data.groupAdmin);

    // ********************      task ===>  @w3_yogesh        ********************
    //  frontend me show krna baki hai
  };

  const modifyGroup = async () => {
    setShowModifiedGroup(!showModifiedGroup);
    try {
      // Step 1: Find all chat members
      const chatMembersResponse = await axios.get(
        `${server}/findChatMemberDetails/${selectedChat._id}`
      );
      const chatMembers = chatMembersResponse.data.users;
      // Step 2: Find all contacts
      const allContactsResponse = await axios.get(
        `${server}/getAllFriends/${myId}`
      );
      const allContacts = allContactsResponse.data.contacts;
      // step-3 : show the chatMember top of the searchbar and other contact below the search bar, and other contact below the search bar
      const selectedContacts = [];
      const unselectedContacts = [];

      allContacts.forEach((contact) => {
        const isPresentInChat = chatMembers.some(
          (member) => member._id === contact.contactId
        );
        if (isPresentInChat) {
          selectedContacts.push(contact);
        } else {
          unselectedContacts.push(contact);
        }
      });

      setAllContacts(allContacts);
      setSelectedContact(selectedContacts);
      setNotSelectedContact(unselectedContacts);

      // step-4 : when click on the submit button it will send the selected user list to the backend, and update the group
    } catch (error) {
      console.error("Error modifying group:", error);
    }
  };

  const updateGroup = async () => {
    try {
      const selectedContactIds = selectedContact.map(
        (contact) => contact.contactId
      );
      const response = await axios.post(`${server}/updateChatMember`, {
        chatId: selectedChat._id,
        selectedContacts: selectedContactIds,
        myId: myId,
      });
      console.log(response);
      toast.success("Group updated successfully");
    } catch (error) {
      console.error("Error in updating group:", error);
    }
  };

  return (
    <>
    {/* {selectedChat.isGroupChat && (
      <Button onClick={handleGroupShowing}> seeGroup </Button>
    )}
    {selectedChat.isGroupChat &&
      selectedChat.groupAdmin === myId && (
        <Button onClick={modifyGroup}> modifyGroup </Button>
      )} */}
      
      <div>GroupManage</div>
      {/* <Button onClick={handleGroupShowing}> seeGroup </Button>
      <Button onClick={modifyGroup}> modifyGroup </Button> */}
      {showModifiedGroup && (
        <div>
          <h2>Selected Members:</h2>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {selectedContact.map((contact) => {
              // Accessing the contactId property directly from each object
              const contactId = contact.contactId;
              return (
                <div key={contact.contactId}>
                  <Avatar src={contact.avatarUrl} alt={contact.name} />
                  <Typography>{contact.name}</Typography>
                  <IconButton onClick={() => removeFromGroup(contactId)}>
                    <CloseIcon />
                  </IconButton>
                </div>
              );
            })}
          </div>
          <div>
            <h2>Not Selected Members:</h2>
            <TextField
              label="Search Contacts"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              margin="normal"
            />
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {notSelectedContact
                .filter((contact) =>
                  contact.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((contact) => (
                  <div
                    key={contact.contactId}
                    style={{ margin: "5px", textAlign: "center" }}
                  >
                    <Avatar src={contact.avatarUrl} alt={contact.name} />
                    <Typography>{contact.name}</Typography>
                    <IconButton onClick={() => addToGroup(contact.contactId)}>
                      <PersonAddIcon />
                    </IconButton>
                  </div>
                ))}
            </div>
          </div>
          <Button onClick={updateGroup}> Update </Button>
        </div>
      )}
    </>
  );
};
