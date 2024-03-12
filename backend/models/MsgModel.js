const mongoose = require("mongoose");

const msgSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    timestamp:{ type: Date, default: Date.now, },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
);

module.exports = mongoose.model("Msg", msgSchema);