const express = require("express");
const authorize = require("../middlewares/authMiddleware");
const {
  authUser,
  registerUser,
  getUser,
  verifyUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", authUser);
router.route("/signup").post(registerUser);
router.route("/search/:mobile_no").get(authorize, getUser);
router.route("/verify").post(authorize, verifyUser);

module.exports = router;
