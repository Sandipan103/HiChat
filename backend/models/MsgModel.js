const mongoose = require("mongoose");

const msgSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: { type: String, trim: true },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  timestamp: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  type: {
    type: String,
    enum: ["text", "image", "video", "document", "location", "contact"],
    required: true,
  },
  imageUrl: { type: String },
  videoUrl: { type: String },
  documentUrl: { type: String },
});

module.exports = mongoose.model("Msg", msgSchema);
