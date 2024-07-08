const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../controller/productController');
const {isAuthenticatedUser} = require("../middleware/auth");
const router = express.Router();

router.route("/products").get(isAuthenticatedUser, getAllProducts);
router.route("/product/:id").get(getProductDetails);
router.route("/product/new").post(isAuthenticatedUser, createProduct);
router.route("/product/:id").put(isAuthenticatedUser, updateProduct);
router.route("/product/:id").delete(isAuthenticatedUser, deleteProduct);


module.exports = router;
