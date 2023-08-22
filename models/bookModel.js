const mongoose = require("mongoose");

const newSchema = new mongoose.Schema(
  {
    book_name: { type: String },
    isbn: { type: String },
    author: { type: String },
    publication_year: { type: Number },
    rating: { type: Number },
    book_type: { type: String },
    borrowed: { type: Boolean, default: false },
    borrowing_limit: { type: Number },
    no_of_borrowers: { type: Number },
  },
  {
    timestamps: true,
  }
);

const books = mongoose.model("books", newSchema);

module.exports = books;
