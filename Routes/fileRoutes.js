const express = require("express");
const upload = require("../middlewares/imgUploadMiddleware");
const { imageUpload, getImage } = require("../controllers/fileController");
const router = express.Router();

// to upload kyc image in mongodb. It returns image url which is saved in user details for further use
router.route("/uploadimage").post(upload.single("file"), imageUpload);
// to access image using image url
router.route("/:filename").get(getImage);

module.exports = router;
