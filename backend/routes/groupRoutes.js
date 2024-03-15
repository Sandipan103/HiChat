const express = require("express");
const router = express.Router();


const { addContact, getAllFriends, createGroup, findAllGroups, fetchAllMessages, sendGroupMessage} = require('../controller/Group');


router.get("/getAllFriends/:userId", getAllFriends);
router.post("/addContact", addContact);
router.post("/createGroup", createGroup);
router.get("/findAllGroups/:userId", findAllGroups);
router.get("/fetchAllMessages/:chatId", fetchAllMessages);
router.post("/sendGroupMessage", sendGroupMessage);

// router.get('/getUserProfileById/:userId', getUserProfileById);

module.exports = router; 