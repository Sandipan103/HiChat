
const mongoose = require("mongoose");

// required for sending mail for verification otp to user mail id 
const mailSender = require('../utils/mailsender')

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60000,
  },
});


const sendVerificationMail = async (email, otp) => {
  try {
    const title = "Verification mail from WhatsApp";
    const body = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
      <h1 style="color: #4CAF50; font-size: 28px; margin-bottom: 20px;">WhatsApp</h1>
      <p style="color: #555; font-size: 16px; margin-bottom: 20px;">To verify your email and create your account, enter the OTP:</p>
      <div style="background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #FFC107; font-size: 24px; margin-bottom: 20px;">OTP: <span style="color: #FFC107; background-color: #333; padding: 5px 10px; border-radius: 5px;">${otp}</span></h2>
        <p style="color: #555; font-size: 16px; margin-bottom: 20px;">Please use this OTP to verify your email and proceed with your WhatsApp registration.</p>
      </div>
      <p style="color: #888; font-size: 14px; margin-top: 20px;">WhatsApp Team</p>
    </div>
    `;

    const mailResponse = await mailSender(email, title, body);
    // console.log(`otp send successfully `, mailResponse);
  } catch (error) {
    console.log("otp sending error", error);
    throw error;
  }
};



// .pre =>  first it will send the mail to user mail id
// if there is no error then it will save the otp in our database
otpSchema.pre("save", async function (next) {
  await sendVerificationMail(this.email, this.otp);
  next();
});



module.exports = mongoose.model("Otp", otpSchema);
