const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  profile: {
    type: String,
  },
  about:{
    type: String,
  },
  contactNo: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  contacts: [
    {
      contactId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
      },
      contactNo: {
        type: String,
        required: true,
      },
    },
  ],
  token: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
