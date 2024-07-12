const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    pinCode: {
      type: Number,
      required: [true, "pinCode is required"],
      max: [999999, "pincode cannot exceed 6 digits"],
    },
    phoneNo: {
      type: Number,
      required: [true, "phone no. is required"],
      max: [9999999999999, "phoneNo. cannot exceed 13 digits"],
    },
  },

  orderItems: [
    {
      name: {
        type: String,
        reuired: [true, "Name is required"],
      },
      price: {
        type: Number,
        required: [true, "Price is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
      },
      image: {
        type: String,
        required: [true, "Image is required"],
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  itemsPrice: {
    type: Number,
    required: [true, "Items Price is required"],
    default: 0,
    max: [999999, "Items price cannot exceed 6 digits"],
  },
  taxPrice: {
    type: Number,
    required: [true, "Tax Price is required"],
    default: 0,
    max: [999999, "Tax price cannot exceed 6 digits"],
  },
  shippingPrice: {
    type: Number,
    required: [true, "Shipping Price is required"],
    default: 0,
    max: [999999, "Shipping price cannot exceed 6 digits"],
  },
  totalPrice: {
    type: Number,
    requireD: [true, "Total Price is required"],
    default: 0,
    max: [9999999, "Total price cannot exceed 7 digits"],
  },
  orderStatus: {
    type: String,
    required: [true, "Order Status is required"],
    default: "Processing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", orderSchema);

/**
 * read about : https://mongoosejs.com/docs/validation.html should be on your tips this is about the validators made available by mongoose
 * also read : https://mongoosejs.com/docs/guide.html for toJson function so as to improve your database presentation
 * Future work -
 * Level : Necessary try out
 * Description : currently we will be calculating the complete data in the frontend which is not a good practice for several reasons, I want to shift
 * the whole business logic to backend and carry all of the calculations here for the reason of security, data integrity and scalability ad performance. 
 */
