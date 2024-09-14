const express = require('express');
const Razorpay = require('razorpay');
require('dotenv').config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const orderWithPayment = async(req,res)=>{
    try {
        const { amount, currency = 'INR' } = req.body;

        // Create a new order
        const options = {
            amount: amount * 100, // amount in smallest currency unit (e.g., 100 paise = 1 INR)
            currency,
            receipt: `receipt_${Math.random() * 10000}`,
            payment_capture: 1 // Automatically capture the payment
        };

        const order = await razorpay.orders.create(options);
        return res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order', error:error.message});
    }
}

module.exports = orderWithPayment;
