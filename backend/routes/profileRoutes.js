
// required dependency
const express = require("express");
const router = express.Router();


// profile controler
const {getUserProfileById, updateUserProfileById} = require('../controller/Profile');


// profile routing
router.get('/getUserProfileById/:userId', getUserProfileById);
router.put('/updateUserProfileById', updateUserProfileById);


module.exports = router; 