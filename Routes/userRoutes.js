const express = require("express");
const { authorize, isAdministrator } = require("../middlewares/authMiddleware");
const {
  authUser,
  registerUser,
  getUser,
  verifyUser,
  manageProfile,
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", authUser);
router.route("/signup").post(registerUser);
router.route("/search/:mobile_no").get(authorize, getUser);
router.route("/verify/:mobile_no").post(authorize, isAdministrator, verifyUser);
router.route("/manageprofile/:userId").put(authorize, manageProfile);

module.exports = router;
