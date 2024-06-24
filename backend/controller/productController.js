const Product = require("../models/productModel");

//Create Product -- ADMIN
exports.createProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
};

//Get all products
exports.getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
};

//Update product -- ADMIN
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(500).josn({
        success: false,
        message: "product not found",
      });
    }

    try {
      product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


//Delete Product 
exports.deleteProduct = async(req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(500).json({
                success : false, 
                message : "Product not found"
            });
        }

        try{
            await Product.findByIdAndDelete(req.params.id);
            res.status(200).json({
                succces : true,
                messgae : "Product deleted successfully"
            });
        } catch(error) {
            console.log(error);
            res.status(500).json({
                success : false,
                message : "Failed to delete the product"
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}
