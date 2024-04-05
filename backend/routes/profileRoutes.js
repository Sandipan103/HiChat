
// required dependency
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path');



// profile controler
const {getUserProfileById, updateUserProfileById,uploadProfile} = require('../controller/Profile');

const userProfile = multer.diskStorage({
    destination: "./uploads/users/profile",
    filename: (req, file, cb) => {
        const uniqueSuffix = Math.floor(Math.random() * 10000);
        const ext = path.extname(file.originalname);
        cb(null, 'profile-' + uniqueSuffix + ext);
        
        cb(null, file.originalname);
    },
  });
  
  const profile = multer({ storage:userProfile });


// profile routing
router.get('/getUserProfileById/:userId', getUserProfileById);
router.put('/updateUserProfileById', profile.single("profile"), updateUserProfileById);
router.put('/uploadProfile', uploadProfile)


module.exports = router; 