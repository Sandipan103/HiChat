
// required dependency
const express = require("express");
const router = express.Router();


// importing required controler
// auth controller
const {sendOtp, signup, login, logout, } = require('../controller/Auth')


// other controller


// auth routing
router.post('/sendOtp' , sendOtp);
router.post('/signup' , signup);
router.post('/login' , login);
router.get('/logout' , logout);


// other routing
// User Messages




// export route
module.exports = router; 
