const express = require("express");
const { borrowBook } = require("../controllers/bookController");

const router = express.Router();

router.route("/borrow/id").put(borrowBook);

module.exports = router;
