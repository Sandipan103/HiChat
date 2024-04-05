const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const User = require('../models/UserModel.js');
const http = require('http');
const cookie = require('cookie');

exports.protect = expressAsyncHandler(async (req, res, next) => {
    let token
    const cookies = cookie.parse(req.headers.cookie || '');
    token = cookies.token;
// console.log(cookies.token);
// next();
        try {            
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findOne({email:decoded.email}).select('-password')
            // console.log(req.user)
            next()
        } catch (err) {
            res.status(401)
            throw new Error('Not Authorized,no token')
        }

    if (!token) {
        res.status(401)
        throw new Error('Not Authorized')
    }

})