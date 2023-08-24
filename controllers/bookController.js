const asyncHandler = require("express-async-handler");
const Books = require("../models/bookModel");
const Users = require("../models/userModel");
const {
  booksOnOnePage,
  bookBorrowLimitPerUser,
} = require("../config/constValues");

const borrowBook = asyncHandler(async (req, res) => {
  if (req.user.borrowed_books.length >= bookBorrowLimitPerUser) {
    res.status(400);
    throw new Error(
      `You can not borrow more than ${bookBorrowLimitPerUser} books`
    );
  }
  const bookId = req.params.bookId;
  const book1 = await Books.findById(bookId);
  console.log(req.user);
  if (book1 && book1.no_of_borrowers >= book1.borrowing_limit) {
    res.status(400);
    throw new Error("Sorry, Book not available");
  }
  try {
    const book = await Books.findByIdAndUpdate(
      bookId,
      {
        $inc: { no_of_borrowers: 1 },
      },
      { new: true }
    );
    const user = await Users.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          borrowed_books: {
            id: bookId,
            book_name: book1.book_name,
            borrowing_date: new Date(),
          },
        },
      },
      { new: true }
    );
    res.status(201).json({message:`${book.book_name} book borrowed successfully`});
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error("Some error occurred while borrowing");
  }
});

const returnBook = asyncHandler(async (req, res) => {
  const bookId = req.params.bookId;
  const borrowerId = req.user._id;
  try {
    const book = await Books.findByIdAndUpdate(bookId, {
      $inc: { no_of_borrowers: -1 },
    });
    const borrower = await Users.updateOne({_id:req.user._id}, {
      $pull: { "borrowed_books": { id: bookId } },
    },{
      multi:false
    });
    res.status(201).json({message:`${book.book_name} Book returned successfully`});
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
    const totalPages = Math.ceil(BookCount / booksOnOnePage);
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
    console.log(err)
    res.status(400);
    throw new Error("Error occurred while fetching the books");
  }
});

const addNewBook = asyncHandler(async (req, res) => {
  const {
    book_name,
    isbn,
    author,
    publication_year,
    book_type,
    borrowing_limit,
  } = req.body;
  if (
    !book_name ||
    !isbn ||
    !author ||
    !publication_year ||
    !book_type ||
    !borrowing_limit
  ) {
    res.status(400);
    throw new Error("Please fill all the details");
  }
  try {
    const book = await Books.create({ ...req.body });
    res.status(201).json(book);
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error("Some Error occurred while adding a book");
  }
});

const searchBook = asyncHandler(async (req, res) => {
  try {
    const attributename = req.params.attributename;
    const value = req.params.value;
    const query = {};
    query[attributename] = { $regex: value, $options: "i" };
    const books = await Books.find(query).sort({ id: -1 });
    res.status(201).json(books);
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error("Some Error occurred while searching books");
  }
});

const updateBookDetails = asyncHandler(async (req, res) => {
  const bookId = req.params.bookId;
  const data = req.body;

  try {
    const book = await Books.findByIdAndUpdate(bookId, { ...data });
    res.status(201).json(book);
  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error("Some Error occurred while updating book datails");
  }
});

module.exports = {
  borrowBook,
  returnBook,
  bookList,
  addNewBook,
  searchBook,
  updateBookDetails,
};
