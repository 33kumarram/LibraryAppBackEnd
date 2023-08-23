const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile_no: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    borrowed_books: [
      {
        book_name: { type: String },
        id: { type: mongoose.Schema.Types.ObjectId },
        borrowing_date: { type: Date },
      },
    ],
    user_type: {
      type: String,
      enum: ["user", "administrator"],
      default: "user",
    },
    kyc_image: {
      type: String,
    },
    verified: { type: Boolean, default: false },
    verification_date: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});
const user = mongoose.model("User", userSchema);

module.exports = user;
