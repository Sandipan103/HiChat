

// required dependency
const nodemailer = require("nodemailer");
require("dotenv").config();


// using nodemailer for sending mail
const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
    });
    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    // console.log(info);
    return info;
  } catch (error) {
    console.log("mail send error");
    console.log(error);
  }
};

module.exports = mailSender;
