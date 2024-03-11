
// required dependency
const express = require("express");
const router = express.Router();


// importing required controler
// auth controller
const {sendOtp, signup, login, logout, } = require('../controller/Auth')
const {createdMessage, fetchMessages, myContacts} =  require("../controller/MessageController");


// other controller


// auth routing
router.post('/sendOtp' , sendOtp);
router.post('/signup' , signup);
router.post('/login' , login);
router.get('/logout' , logout);


// other routing
// User Messages
router.get("/contacts/:userId",myContacts);
router.post("/messaging",createdMessage);
router.get("/chats/:userId/:requestId",fetchMessages);



// export route
module.exports = router; 
