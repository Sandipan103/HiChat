const express = require("express");
const router = express.Router();


const { addContact } = require('../controller/Group');


router.post("/addContact",addContact);

module.exports = router; 