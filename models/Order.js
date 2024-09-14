const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderData: [
        {
            foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            stype: {
                type: String,
                required: true
            }
        }
    ],
    orderDate:{
        type:Date,
        required:true,
    },
    paymentType: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },
    razorpayOrderId: {
        type: String,
        required: function() { return this.paymentType === "Online"; }
    },
    razorpayPaymentId: {
        type: String
    },
    razorpaySignature: {
        type: String
    },
    deliveryStatus: {
        type: String,
        enum: ["Pending", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"],
        default: "Pending"
    }
});

module.exports = mongoose.model('Order', orderSchema);
