const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order');


const orderFood = async (req, res) => {
    try {
        const { orderData, paymentType, userId } = req.body;

        if (!orderData || !paymentType || !userId) {
            return res.status(400).json({ message: "Missing required fields in the request." });
        }

        const formattedOrderData = orderData.map(item => {
            return {
                foodId: new mongoose.Types.ObjectId(item.id),
                quantity: item.quantity,
                stype: item.stype
            };
        });

        const orderId = uuidv4();

        if (paymentType !== "Online") {
            const result = await Order.create({
                orderId,
                userId: new mongoose.Types.ObjectId(userId),
                orderData: formattedOrderData,
                paymentType,
                orderDate: Date.now()
            });

            res.status(200).json({
                message: "Order placed successfully!",
                orderId,
            });
        }
        else
        {
            const {paymentData} = req.body;
            const result = await Order.create({
                orderId,
                userId: new mongoose.Types.ObjectId(userId),
                orderData: formattedOrderData,
                paymentType,
                orderDate: Date.now(),
                razorpayOrderId: paymentData.razorpayOrderId,
                razorpayPaymentId: paymentData.razorpayPaymentId,
                razorpaySignature: paymentData.razorpaySignature
            });

            res.status(200).json({
                message: "Order placed successfully!",
                orderId,
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Internal Server Error",
        });
    }
}

module.exports = orderFood;
