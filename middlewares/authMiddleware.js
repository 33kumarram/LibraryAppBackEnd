const jwt = require("jsonwebtoken");
const user = require("../models/userModel");
const errorHandler = require("express-async-handler");
const JWT_SECRET = process.env.JWT_SECRET;

const authorize = errorHandler(async function (req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token =await  req.headers.authorization.split(" ")[1];
    console.log("MyToken", token);
    let decoded;
    try {
      decoded = await jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Authorization failed");
    }
    const userdetails = await user.findById(decoded.id).select("-password");
    // check verification status for normal user
    if (userdetails && userdetails.user_type === "user") {
      if (userdetails?.verified === false) {
        console.log("entered");
        res.status(400);
        throw new Error("Verification pending");
        return;
      }
      // check whether user verified within a year or not
      if (new Date().getTime() - userdetails.verification_date > 31536000000) {
        await user.findByIdAndUpdate(decoded.id, { verified: false });
        res.status(400);
        throw new Error("Your verification expired, please reverify");
      }
    }
    req.user = userdetails;
    next();
  }
  if (!token) {
    res.status(401);
    throw new Error("Authorization token not found");
  }
});

const isAdministrator = errorHandler(async (req, res, next) => {
  if (req.user.user_type === "administrator") {
    next();
  } else {
    res.status(400);
    throw new Error("This functionality can be used by administrators only");
  }
});

module.exports = { authorize, isAdministrator };
