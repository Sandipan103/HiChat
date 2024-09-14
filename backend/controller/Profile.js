

// model required
const User = require("../models/UserModel")

// dependency required

exports.getUserProfileById = async (req, res) => {
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
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "something went wrong while fetching user profile detail" 
    });
  }
};

exports.updateUserProfileById = async (req, res, next) => {
  var profile = req.file;
  if(profile) profile = profile.filename;
  console.log(profile)
  const userId = req.body.userId;
  const firstName = req.body.firstName;
  const about = req.body.about;
  const updatedData = {
    ...(firstName && {firstName}),
    ...(about && {about}),
    ...(profile && {profile}),
  };

  try {
    const user = await User.findByIdAndUpdate(userId, updatedData,
      {new: true,}
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "user not found" 
      });
    }

    res.json({ 
      success: true, 
      user, 
      message: "profile updated successfully" 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "something went wrong while updating user profile detail"
    });
  }
};

exports.uploadProfile = async (req, res, next) => {
  const {
    userId,
    profile,
  } = req.body;
console.log(profile);

  try {
    const user = await User.findByIdAndUpdate(userId,{profile : profile},
      {new: true,}
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "user not found" 
      });
    }

    res.json({ 
      success: true, 
      user, 
      message: "profile updated successfully" 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "something went wrong whileupdating user profile detail"
    });
  }
};

