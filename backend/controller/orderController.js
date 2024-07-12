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
    const orders = await Order.find();
    const orderCount = await Order.countDocuments();
    res.status(200).json({
        success : true,
        message : "all orders found",
        orders,
        orderCount
    });
});

exports.updateOrder = catchAsyncErrors(async(req, res, next) => {

    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found", 404));
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    order.orderItems.forEach(async (order)=>{
        await updateStock(order.product, order.quantity);
    });

    order.orderStatus = req.body.status;
    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave : false});
    res.status(200).json({
        success : true,
        message : "order status updated successfully"
    });

});

async function updateStock(id, quantity){
    const product = await Product.findById(id);
    product.Stock -= quantity;
    await product.save({validateBeforeSave:false});
};

exports.deleteOrder = catchAsyncErrors(async(req, res, next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found", 404));
    }

    await Order.deleteOne({ _id: req.params.id });
   // await order.save({validateBeforeSave: false});
    res.status(200).json({
        success : true,
        message : "Order deleted successfully" 
    });
});

