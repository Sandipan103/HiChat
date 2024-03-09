

// database connection :: 
const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("db connected successfull")
    })
    .catch((error) => {
      console.log(`error occur db not connected: ${error}`)
      process.exit(1)
    })
};

module.exports = dbConnect;