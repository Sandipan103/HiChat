const express = require("express");
const router = express.Router();


const { addContact, getAllFriends, createGroup, findAllChats, fetchAllMessages, sendChatMessage, readAllMessages, findChatMemberDetails, updateChatMember} = require('../controller/Group');


router.get("/getAllFriends/:userId", getAllFriends);
router.post("/addContact", addContact);
router.post("/createGroup", createGroup);
router.get("/findAllChats/:userId", findAllChats);
router.get("/fetchAllMessages/:chatId", fetchAllMessages);
router.post("/sendChatMessage", sendChatMessage);
router.post("/readAllMessages", readAllMessages);
router.get("/findChatMemberDetails/:chatId", findChatMemberDetails);
router.post("/updateChatMember", updateChatMember);

// router.get('/getUserProfileById/:userId', getUserProfileById);

module.exports = router; 