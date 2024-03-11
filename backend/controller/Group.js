// model required
const User = require("../models/UserModel");


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