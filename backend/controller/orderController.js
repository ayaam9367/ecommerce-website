const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//Create new Order
exports.newOrder = catchAsyncErrors(async(req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo, 
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo, 
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user : req.user._id,
    });
    res.status(201).json({
        success : true,
        message : "order created successsfully",
        order
    });
});


//get single order details 
exports.getSingleOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found", 404));
    };

    res.status(200).json({
        success : true,
        message : "order details found",
        order,
    });
});

//get all orders of logged in user
exports.myOrders = catchAsyncErrors(async(req, res, next) => {

    const orders = await Order.find({user :req.user._id})  

    res.status(200).json({
        success : true,
        message : "order details found",
        orders
    });

});

//get all orders --  ADMIN
exports.getAllOrders = catchAsyncErrors(async(req, res, next) => {

})


// getAllOrders, updateOrder, deleteOrder