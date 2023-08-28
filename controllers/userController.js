const errorHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = errorHandler(async (req, res) => {
  const { name, email, mobile_no, password, kyc_image } = req.body;
  const admin_key = process.env.ADMIN_KEY;
  if (!name || !email || !mobile_no || !password || !kyc_image) {
    res.status(400);
    throw new Error("Please fill all the details");
  }
  
  // Multiple user with same mobile no is not allowed
  const userExist = await User.findOne({ mobile_no });
  if (userExist) {
    res.status(400);
    throw new Error("User already created");
  }

  let user_type = "user";
// admin key required to create admin user
  if (req.body.user_type && req.body.user_type === "administrator") {
    const valid_admin = req.body.admin_key === admin_key;
    if (!valid_admin) {
      res.status(400);
      throw new Error("Invalid administrator key");
    }
    if (valid_admin) {
      user_type = "administrator";
    }
  }

  const newUser = await User.create({
    name: name,
    email: email,
    mobile_no: mobile_no,
    password: password,
    kyc_image: kyc_image,
    user_type: user_type,
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      mobile_no: newUser.mobile_no,
      user_type: newUser.user_type,
      kyc_image: newUser.kyc_image,
      // token: generateToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Error occurred while creating user");
  }
});

const authUser = errorHandler(async function (req, res) {
  const { mobile_no, password } = req.body;
  const user = await User.findOne({ mobile_no });
  const correctPass = await user.comparePassword(password); // check whether password is correct or not
  if (user && correctPass) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      mobile_no: user.mobile_no,
      email: user.email,
      mobile_no: user.mobile_no,
      kyc_image: user.kyc_image,
      user_type: user.user_type,
      borrowed_books: user.borrowed_books,
      verified: user.verified,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Incorrect mobile number or password");
  }
});

const getUser = errorHandler(async function (req, res) {
  try {
    const mobile_no = req.params.mobile_no;
    const user = await User.findOne({ mobile_no });
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error("Error occured while searching the user");
  }
});

// User required to be verified by administrator to activate account completely
const verifyUser = errorHandler(async function (req, res) {
  const mobile_no = req.params.mobile_no;
  const user = await User.findOneAndUpdate(
    { mobile_no },
    { verified: true, verification_date: new Date() },
    { new: true }
  );
  res.status(201).json(user);
});

// User can change their details after login
const manageProfile = errorHandler(async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, data);
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error("Some error occurred while updating the user profile");
  }
});

module.exports = {
  registerUser,
  authUser,
  getUser,
  verifyUser,
  manageProfile,
};
