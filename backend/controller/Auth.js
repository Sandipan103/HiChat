

// model required
const User = require("../models/UserModel");
const Otp = require("../models/OtpModel");


// dependency required
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();



// send otp
exports.sendOtp = async (req, res) => {
  try {
    // step-1 : fetch email
    const { email } = req.body;

    // step-2 : email is valid or not
    // checked in frontend

    // step-3 : find if email exist or not
    const user = await User.findOne({ email });
    // if user present then he can't register twice
    if (user) {
      return res.status(401).json({
        success: false,
        message: `email already registered`,
      });
    }

    // step-4 : generate random 6 digit otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // step-5 : send otp (this will send the otp in user mail first after that the otp will save in database for 5 minutes)
    const otpBody = await Otp.create({ email, otp });
    res.status(200).json({
      success: true,
      message: `otp send successfully`,
      otp,
    });
  } catch (error) {
    console.log("otp sending error : ", error);
    return res.status(401).json({
      success: false,
      message: `otp sending failed`,
    });
  }
};

// signup
exports.signup = async (req, res) => {
  try {
    // step-1 : fetch data
    const { firstName, lastName, email, password, otp } = req.body;

    // step-2 : email already present or not
    const emailAlreadyPresent = await User.findOne({ email });
    // if user present then he can't register twice
    if (emailAlreadyPresent) {
      return res.status(401).json({
        success: false,
        message: `email already registered`,
      });
    }

    // step-3 : find latest otp with this email, and verify
    const recentOtps = await Otp.find({ email }).sort({ createdAt: -1 });

    if (recentOtps.length === 0) {
      return res.status(401).json({
        success: false,
        message: `otp is not found with this email id`,
      });
    }

    if (recentOtps[0].otp !== otp) {
      // console.log('recentOtps : ', recentOtps);
      return res.status(401).json({
        success: false,
        message: `incorrect otp`,
      });
    }

    // step-4 : hash password
    const hashedPassword = await bcrypt.hash(password, 10);



    // step-5 : create user
    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: `user created successfully`,
    });
  } catch (error) {
    console.log("signup error : ", error);
    return res.status(401).json({
      success: false,
      message: `somthing went wrong while signup`,
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    // step-1 : fetch data
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: `all fields are required`,
      });
    }

    // step-2 : find emial is registered or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(402).json({
        success: false,
        message: `email is not registered`,
      });
    }

    // step-3 : match the password with user hashed password
    const matchPassword = await bcrypt.compare(password, user.password);

    if(!matchPassword)  {
      return res.status(400).json({
        success: false,
        message: `incorrect password`,
      });
    }

    // step-4 : creating payload
    const payload = {
      email: user.email,
      id: user._id,
      //  **  we can add any other detail here **
    };

    // step-5 : generate jwt token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: `2h`,
    });
    user.token = token;
    user.password = undefined;
    const options2 = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // after 24 hours
      httpOnly: true,
    };
    

    // step-6 : save user data token in cookies
    // step-7 : login
    res.cookie('token', token, options2).status(200).json({
      success: true,
      token,
      user,
      message: `user lgged in successfully`,
    });
  } catch (error) {
    console.log("login error : ", error);
    return res.status(401).json({
      success: false,
      message: `somthing went wrong while login`,
    });
  }
};

// logout
exports.logout = async (req, res) => {
  try {
    // Clearing the token cookie to log out the user
    res.clearCookie('token').status(200).json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    console.log('logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while logging out',
    });
  }
};
