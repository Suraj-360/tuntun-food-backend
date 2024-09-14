const Order = require('../models/Order'); // Adjust the path as necessary
const Food = require('../models/Food'); // Adjust the path as necessary

// Get orders for a specific user with populated food details and prices
const getAllOrdersWithFood = async (req, res) => {
    try {
        const { userId } = req.body; // Extract userId from the request body

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Fetch orders for the specific user
        const orders = await Order.find({ userId })
            .populate({
                path: 'orderData.foodId',
                select: 'categoryName name img options _id' // Select necessary fields including options
            })
            .exec();

        // Transform the order data to include the necessary fields
        const transformedOrders = orders.map(order => ({
            ...order.toObject(),
            orderData: order.orderData.map(orderItem => {
                // Find the price for the selected stype
                const price = orderItem.foodId.options.find(option => option[orderItem.stype])?.[orderItem.stype] || 'N/A';

                return {
                    food: {
                        foodID: orderItem.foodId._id,
                        categoryName: orderItem.foodId.categoryName,
                        name: orderItem.foodId.name,
                        img: orderItem.foodId.img
                    },
                    quantity: orderItem.quantity,
                    stype: orderItem.stype,
                    price
                };
            })
        }));

        res.status(200).json({
            orderData:transformedOrders,
            message:"Order History Fetched!!"
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error',
            error:error.message
         });
    }
};

module.exports = getAllOrdersWithFood;
