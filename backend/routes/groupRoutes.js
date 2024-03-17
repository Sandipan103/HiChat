const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path');

const { addContact, getAllFriends, createGroup, findAllChats, fetchAllMessages, sendChatMessage, readAllMessages, sendFiles, findChatMemberDetails, updateChatMember} = require('../controller/Group');


router.get("/getAllFriends/:userId", getAllFriends);
router.post("/addContact", addContact);
router.post("/createGroup", createGroup);
router.get("/findAllChats/:userId", findAllChats);
router.get("/fetchAllMessages/:chatId", fetchAllMessages);
router.post("/sendChatMessage", sendChatMessage);
router.post("/readAllMessages", readAllMessages);

function getCurrentDateTimeString() {
    const date = new Date();

    // Get individual components of the date and time
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Combine components into the desired format
    const dateTimeString = `${day}${month}${year}_${hours}${minutes}${seconds}`;

    return dateTimeString;
}

const userFile = multer.diskStorage({
    destination: "./uploads/users/files",
    filename: (req, file, cb) => {
        const fileType = file.mimetype;

        if(fileType.startsWith('image/')){
            const uniqueSuffix = getCurrentDateTimeString();
            const ext = path.extname(file.originalname);
            cb(null, 'IMG-' + uniqueSuffix + ext);
        }
        else if(fileType.startsWith('video/')){
            const uniqueSuffix = getCurrentDateTimeString();
            const ext = path.extname(file.originalname);
            
            cb(null, 'VID-' + uniqueSuffix + ext);
        }
        
        cb(null, file.originalname);
    },
  });
  
  const userfile = multer({ storage:userFile });
  router.post("/sendFiles",userfile.single("file"),sendFiles);

// router.post("/sendFiles", sendFiles);


router.get("/findChatMemberDetails/:chatId", findChatMemberDetails);
router.post("/updateChatMember", updateChatMember);

// router.get('/getUserProfileById/:userId', getUserProfileById);

module.exports = router; 