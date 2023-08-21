const express = require("express");
const authorize = require("../middlewares/authMiddleware");
const {
  authUser,
  registerUser,
  allUsers,
  verifyUser
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", authUser);
router.route("/signup").post(registerUser);
router.route("/search/:username").get(authorize, allUsers);
router.route("/verify").post(authorize, verifyUser);

module.exports = router;
