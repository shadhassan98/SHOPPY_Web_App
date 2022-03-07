const res = require("express/lib/response");
const app = require("../app");
const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

// Create Product -- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await productModel.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

//Delete a Product .. Admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  //Deleting Images from CLoudinary...
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }
  await productModel.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Product deleted Successfully",
  });
});

//Update a product.. Admin
exports.updateProduct = catchAsyncError(async (req, res) => {
  let product = await productModel.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));
  product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidaters: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

//get Product details...
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));
  res.status(200).json({
    success: true,
    product,
  });
});

//get all products
exports.getAllProducts = catchAsyncError(async (req, res) => {
  const resultPerPage = 10;
  const productsCount = await productModel.countDocuments();

  const apiFeature = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;
  apiFeature.pagination(resultPerPage);
  products = await apiFeature.query.clone();
  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
  });
});

// Create new review or Update a review ...
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await productModel.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await productModel.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Get all reviews of a product ...
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete a review ... Admin

exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  let ratings = 0;
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }
  const numOfReviews = reviews.length;

  await productModel.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: "Product Review deleted Successfully",
  });
});
