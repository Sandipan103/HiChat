const User = require("../models/UserModel");
const Message = require("../models/MessageModel");

exports.createdMessage = async (req, res, next) => {
  try {
    const { myId, requestId, messageInput } = req.body;

    const response = await Message.create({
      sender: myId,
      recipient: requestId,
      content: messageInput,
    });
    return res.json("Successfully added");
  } catch (error) {
    return res.json(error);
  }
};

exports.fetchMessages = async (req, res, next) => {
  try {
    const {userId, requestId} = req.params;
    const messages = await Message.find({
        $or: [
            { sender: userId, recipient: requestId },
            { sender: requestId, recipient: userId },
        ],
    })
    .sort({ timestamp: "asc" }) 
    .exec()
    return res.json(messages);
  } catch (error) {
    return res.json(error);
  }
};

exports.myContacts = async (req, res, next) => {
  try {
    const {userId} = req.params;
    const user = await User.findById(userId);
    return res.json({contacts : user.contacts, msg : "helo"});
  } catch (error) {
    return res.json(error);
  }
};

