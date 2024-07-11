const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

//Create Product -- ADMIN
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id; 
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 10;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = await apiFeature.query;
  res.status(200).json({
    success: true,
    products,
    productCount
  });
});

//Get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    message = "product not found";
    statusCode = "404";
    return next(new ErrorHandler(message, statusCode));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

//Update product -- ADMIN
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).josn({
      success: false,
      message: "product not found",
    });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//Delete Product -- ADMIN
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    succces: true,
    messgae: "Product deleted successfully",
  });
});

//Create new review or update the review
/**
 * find the product using productId
 * check if it already reviewd by the particular user
 * if it is not, then create a new review by pushing a destructured review in the the reeviews array
 * if it is, update the rating and comment only. 
 * update the avg ratings of the product and increase the numOfReviws count
*/

exports.createProductReview = catchAsyncErrors(async(req, res, next) => {
  const {rating, comment, productId} = req.body;

  const review = {
    user : req.user._id,
    name : req.user.name,
    rating : Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  if(!product){
    return next(new ErrorHandler("product not found", 404));
  };

  const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());

  if(isReviewed){
    product.reviews.forEach((rev) => {
      if(rev.user.toString()===req.user._id.toString()){
        rev.rating = rating,
        rev.comment = comment
      }
    });

  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  //updating the ratings of the product by calculating the avg
  let sum = 0;
  product.reviews.forEach((rev) => {
    sum += rating;
  });

  const avg = sum / product.reviews.length;

  product.ratings = avg;
  await product.save({validateBeforeSave:false});

  res.status(200).json({
    success : true,
    message : "product reviewd successfully",
    product
  });

});


/**
 * Future work 
 * 
 * Level : urgent
 * description : refactor the code to improve consistency of code habits for eg in line: 50 use the ErrorHandler to send the error to next();
 */