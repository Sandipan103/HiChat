
// required dependency
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// required env string
const PORT = process.env.PORT;

//
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// connect with db
const dbConnect = require("./config/database");
dbConnect();

// routing
const authRoutes = require("./routes/authRoutes")
const profileRoutes = require("./routes/profileRoutes")
app.use("/api/v1", authRoutes)
app.use("/api/v1", profileRoutes)

// start server
app.listen(PORT, () => {
  console.log(`app is running on ${PORT}`);
});
