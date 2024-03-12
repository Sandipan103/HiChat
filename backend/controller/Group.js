// model required
const User = require("../models/UserModel");
const Chat = require("../models/chatModel");
const Msg = require("../models/MsgModel");

// dependency required


// add contacts
exports.addContact = async (req, res) => {
    try {
      // step-1 : fetch data from req body
      const { name, contactNo, userId} = req.body;
  
      // step-2 : find by contact number
      const friend = await User.findOne({ contactNo: contactNo });

      // step-3 : user not found
      if (!friend) {
        return res.status(402).json({
          success: false,
          message: `contact no is not registered`,
        });
      }

      // step-4 : already friend
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User not found with ID ${userId}`,
        });
      }

      const alreadyFriend = user.contacts.some(contact => contact.contactNo === contactNo);
      if (alreadyFriend) {
        return res.status(400).json({
          success: false,
          message: `This contact is already added in your contacts`,
        });
      }

      // step-5 : add the frind in user contact with name passed in name
      await User.findByIdAndUpdate(userId, {
        $push: {
          contacts: {
            contactId: friend._id,
            name: name,
            contactNo: contactNo,
          },
        },
      });
  
      // Also add the user to friend's contacts
      // await User.findByIdAndUpdate(friend._id, {
      //   $push: {
      //     contacts: {
      //       contactId: userId,
      //       name: user.firstName + " " + user.lastName,
      //       contactNo: user.contactNo,
      //     },
      //   },
      // });

      return res.status(200).json({
        success: true,
        message: `contact successfully saved`,
      });

    } catch (error) {
      console.log("contact save error : ", error);
      return res.status(401).json({
        success: false,
        message: `contact not saved`,
      });
    }
  };


// find all the contacts
exports.getAllFriends = async(req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "user not found" 
      });
    }
    res.json({ 
      success: true, 
      user
    });
  } catch (error) {
    console.log("finding frined error : ", error);
      return res.status(401).json({
        success: false,
        message: `friends not found here`,
      });
  }
}


// create a new group
exports.createGroup = async(req, res) => {
  try {
    const {groupName, selectedFriends, admin } = req.body;
    // step-1 : check if group name already exist or not
    const chat = await Chat.findOne({ groupName });
    if(chat)  {
      return res.status(401).json({
        success: false,
        message: `group name already exist`,
      });
    }

    // step-2 : create group
    const response = await Chat.create({
      groupName : groupName,
      isGroupChat : true,
      users : [...selectedFriends, admin],
      groupAdmin : admin,
    });

    return res.status(200).json({
      success: true,
      message: `group successfully created`,
    }); 
    
  } catch (error) {
    console.log("group creating error : ", error);
      return res.status(401).json({
        success: false,
        message: `group not created`,
      });
  }
}

// fetch all groups of the user
exports.findAllGroups = async(req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find all groups where the user is a member
    const groups = await Chat.find({ users: userId });

    res.json({ 
      success: true, 
      groups 
    });
    
  } catch (error) {
    console.log("Group finding error:", error);
    return res.status(500).json({
      success: false,
      message: `Error finding groups: ${error.message}`,
    });
  }
}

// fetch all messages of this group
exports.fetchAllMessages = async(req, res) => {
  try {
    const chatId = req.params.chatId;
    // console.log(chatId);
    
    // Find all messages where the chat id matches
    const messages = await Msg.find({ chat: chatId });
    // console.log(messages);
    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log("Message fetching error:", error);
    return res.status(500).json({
      success: false,
      message: `Error fetching messages: ${error.message}`,
    });
  }
}


exports.sendGroupMessage = async(req, res)  => {
  try {
    const {myId, chatId, messageInput } = req.body;
    if(!myId) {
      return res.status(401).json({
        success: false,
        message: `user not found`,
      });
    }
    if(!chatId) {
      return res.status(401).json({
        success: false,
        message: `chat Id not found`,
      });
    }
    const response = await Msg.create({
      sender : myId,
      content : messageInput,
      chat : chatId,
    });

    return res.status(200).json({
      success: true,
      message: `group message successfully send`,
    }); 

  } catch (error) {
    console.log("Message sending error:", error);
    return res.status(500).json({
      success: false,
      message: `Error sending messages: ${error.message}`,
    });
  }
}