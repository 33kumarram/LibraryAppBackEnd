const express = require("express");
const {
  borrowBook,
  returnBook,
  bookList,
} = require("../controllers/bookController");
const { authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/borrow/:bookId").put(authorize, borrowBook);
router.route("/return/:bookId").put(authorize, returnBook);
router.route("/list/:page").get(authorize, returnBook);

module.exports = router;
