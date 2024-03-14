const express = require("express");
const router = express.Router();
const multer = require("multer");


const { addContact, getAllFriends, createGroup, findAllChats, fetchAllMessages, sendChatMessage, readAllMessages, sendFiles} = require('../controller/Group');


router.get("/getAllFriends/:userId", getAllFriends);
router.post("/addContact", addContact);
router.post("/createGroup", createGroup);
router.get("/findAllChats/:userId", findAllChats);
router.get("/fetchAllMessages/:chatId", fetchAllMessages);
router.post("/sendChatMessage", sendChatMessage);
router.post("/readAllMessages", readAllMessages);


const userFile = multer.diskStorage({
    destination: "./uploads/users/files",
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const userfile = multer({ storage:userFile });
  router.post("/sendFiles",userfile.single("file"),sendFiles);

// router.post("/sendFiles", sendFiles);


// router.get('/getUserProfileById/:userId', getUserProfileById);

module.exports = router; 