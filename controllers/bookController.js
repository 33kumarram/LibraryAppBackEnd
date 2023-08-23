const asyncHandler = require("express-async-handler");
const Books = require("../models/bookModel");
const Users = require("../models/bookModel");
const { booksOnOnePage } = require("../config/constValues");

const borrowBook = asyncHandler(async (req, res) => {
  const bookId = req.params.bookId;
  const book1 = await Books.findById(bookId);
  try {
    if (book1 && book1.no_of_borrowers >= borrowing_limit) {
      res.status(400);
      throw new Error("Sorry, Book not available");
    }
    const book = await Books.findByIdAndUpdate(bookId, {
      $inc: { no_of_borrowers: 1 },
    });
    res.status(201).json(book);
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error("Some error occurred while borrowing");
  }
});

const returnBook = asyncHandler(async (req, res) => {
  const bookId = req.params.bookId;
  const borrowerId = req.body.borrowerId;
  try {
    const book = await Books.findByIdAndUpdate(bookId, {
      $inc: { no_of_borrowers: -1 },
    });
    const borrower = await Users.findByIdAndUpdate(borrowerId, {
      $pull: { borrowed_books: { id: bookId } },
    });
    res.status(201).json(borrower);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error("Some error occurred while returning the book");
  }
});

const bookList = asyncHandler(async (req, res) => {
  try {
    const page = req.params.page || 1;
    const booksToSkip = page * (page - 1);
    const BookCount = await Books.count();
    const totalPages = Math.ceil(BookCount / totalPages);
    const books = await Books.aggregate([
      {
        $addFields: {
          inStock: {
            $cond: {
              if: { $lt: ["$no_of_borrowers", "$borrowing_limit"] }, // Condition to check
              then: true,
              else: false,
            },
          },
        },
      },
    ])
      .skip(booksToSkip)
      .limit(booksOnOnePage);
    res.status(201).json({ books: books, totalPages: totalPages });
  } catch (err) {
    res.status(400);
    throw new Error("Error occurred while fetching the books");
  }
});

const addNewBook = asyncHandler(async (req, res) => {});

module.exports = {
  borrowBook,
  returnBook,
  bookList,
  addNewBook,
};
