const errorHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const user = require("../models/userModel");

const registerUser = errorHandler(async (req, res) => {
  const { name, email, mobile_no, password, kyc_image } = req.body;
  if (!name || !email || !mobile_no || !password || !kyc_image) {
    res.status(400);
    throw new Error("Please fill all the details");
  }

  const userExist = await User.findOne({ mobile_no });
  if (userExist) {
    res.status(400);
    throw new Error("User already created");
  }

  const newUser = await User.create({
    name: name,
    email: email,
    mobile_no: mobile_no,
    password: password,
    kyc_image: kyc_image,
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      mobile_no: newUser.mobile_no,
      kyc_image: newUser.kyc_image,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Error occurred while creating user");
  }
});

const authUser = errorHandler(async function (req, res) {
  const { mobile_no, password } = req.body;
  const user = await User.findOne({ mobile_no });
  if (user && user.comparePassword(password)) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile_no: user.mobile_no,
      kyc_image: user.kyc_image,
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

const verifyUser = errorHandler(async function (req, res) {
  const keyWords = req.params.mobile_no;
  const user = await User.findOneAndUpdate(
    { mobile_no },
    { verified: true, verification_date: new Date() }
  );
  res.status(201).json(user);
});

module.exports = {
  registerUser,
  authUser,
  getUser,
  verifyUser,
};
