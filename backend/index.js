// required dependency
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
// required env string
const PORT = process.env.PORT;

// // connect with db
const dbConnect = require("./config/database");
// dbConnect();
// //
// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// Connect to MongoDB by calling the imported connectDB function
dbConnect()
  .then(() => {
    // Start your server once the MongoDB connection is established
    const port = process.env.PORT || 3000;

    // Create the HTTP server
    const server = http.createServer(app);
    console.log("connected");
    // Attach Socket.io to the HTTP server
    const io = require("socket.io")(server, {
      cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    const userConnections = new Map();

    io.on('connection', (socket) => {
      
      const userId = socket.handshake.query.userId; // Extract user ID from query parameters
      userConnections.set(userId, socket);
    
      socket.on('private-message', ({ to, message }) => {
        const toSocket = userConnections.get(to);
        if (toSocket) {
          toSocket.emit('private-message', { from: userId, message });
          
        }
      });
    
      socket.on('disconnect', () => {
        userConnections.delete(userId);
      });
    });

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start the server:", error);
  });

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use(cookieParser());
app.use(express.json());

// routing
const testingRoutes = require("./routes/testingRoutes");
app.use("/api/v1", testingRoutes);


