const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter Product name!"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter Product Description"],
  },
  price: {
    type: Number,
    required: [true, "Please enter Product Price"],
    maxLength: [8, "Maximum length is 8 characters"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter Product category"],
  },
  Stock: {
    type: Number,
    required: [true, "Please enter Product Stock"],
    maxLength: [4, "Ploduct Sock cannot exceed 4 characters"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: [true, "Please enter your name!"],
        trim: true,
      },
      rating: {
        type: Number,
        required: [true, "Please enter your rating!"],
      },
      comment: {
        type: String,
        required: [true, "Please enter your comment!"],
      },
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
