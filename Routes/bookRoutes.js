const express = require("express");
const {
  borrowBook,
  returnBook,
  bookList,
  addNewBook,
  searchBook,
  updateBookDetails,
} = require("../controllers/bookController");
const { authorize, isAdministrator } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/borrow/:bookId").put(authorize, borrowBook);
router.route("/return/:bookId").put(authorize, returnBook);
router.route("/list/:page").get(authorize, bookList);
// new book can be added by a administrator user
router.route("/addnewbook").post(authorize, isAdministrator, addNewBook);
// book details can be updated by administrator user
router
  .route("/updatebook/:bookId")
  .post(authorize, isAdministrator, updateBookDetails);
router
  .route("/searchbook/:attributename/:value")
  .get(authorize, searchBook);

module.exports = router;
